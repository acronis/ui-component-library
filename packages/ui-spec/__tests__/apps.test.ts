import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020';
import { load as parseYaml } from 'js-yaml';
import { describe, expect, it } from 'vitest';

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(HERE, '..');
const APPS_DIR = join(PKG_ROOT, 'apps');
const SCREENS_DIR = join(PKG_ROOT, 'screens');
const PATTERNS_DIR = join(PKG_ROOT, 'patterns');

const ajv = new Ajv2020({ strict: false, allErrors: true });
const validate = ajv.compile(
  JSON.parse(readFileSync(join(PKG_ROOT, 'schema', 'app.schema.json'), 'utf8'))
);

interface AppSpec {
  name: string;
  screens?: string[];
  patterns?: string[];
  sections?: { items: { screen?: string }[] }[];
}

function listApps(): string[] {
  if (!existsSync(APPS_DIR)) return [];
  return readdirSync(APPS_DIR)
    .filter(
      (entry) =>
        statSync(join(APPS_DIR, entry)).isDirectory() &&
        existsSync(join(APPS_DIR, entry, 'app.yaml'))
    )
    .sort();
}

const screenExists = (slug: string): boolean =>
  existsSync(join(SCREENS_DIR, slug, 'screen.yaml'));
const patternExists = (slug: string): boolean =>
  existsSync(join(PATTERNS_DIR, slug, 'pattern.yaml'));

describe('every app descriptor validates and references real things', () => {
  const apps = listApps();

  it('at least one app spec exists', () => {
    expect(apps.length).toBeGreaterThan(0);
  });

  for (const name of apps) {
    const app = parseYaml(
      readFileSync(join(APPS_DIR, name, 'app.yaml'), 'utf8')
    ) as AppSpec;

    it(`${name}: schema + slug`, () => {
      expect(
        validate(app),
        ajv.errorsText(validate.errors, { separator: '\n' })
      ).toBe(true);
      // The folder name is the source of truth for the slug.
      expect(app.name).toBe(name);
    });

    it(`${name}: referenced screens exist in screens/`, () => {
      const missing = (app.screens ?? []).filter((slug) => !screenExists(slug));
      expect(missing, `screens not found: ${missing.join(', ')}`).toEqual([]);
    });

    it(`${name}: referenced patterns exist in patterns/`, () => {
      const missing = (app.patterns ?? []).filter(
        (slug) => !patternExists(slug)
      );
      expect(missing, `patterns not found: ${missing.join(', ')}`).toEqual([]);
    });

    it(`${name}: section screen references exist`, () => {
      const refs = (app.sections ?? []).flatMap((section) =>
        section.items
          .map((item) => item.screen)
          .filter((slug): slug is string => Boolean(slug))
      );
      const missing = refs.filter((slug) => !screenExists(slug));
      expect(missing, `section screens not found: ${missing.join(', ')}`).toEqual(
        []
      );
    });
  }
});

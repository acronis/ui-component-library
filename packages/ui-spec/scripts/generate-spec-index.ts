/**
 * Generate the committed `spec-index.json` — the stable data contract that
 * `apps/demo` imports to build its spec-driven catalog (component / pattern /
 * screen indexes). The demo depends on this JSON, never on the raw YAML, so the
 * spec stays the single source of truth for *what exists* and the catalog can't
 * drift.
 *
 * Source of truth:
 *   - components/<name>/index.yaml    → components[]
 *   - patterns/<name>/pattern.yaml    → patterns[]
 *   - screens/<slug>/screen.yaml      → screens[]
 *
 * Output: packages/ui-spec/spec-index.json (committed)
 * Run:    pnpm --filter @spec-lab/ui-spec generate:spec-index
 *
 * The `__tests__/spec-index.test.ts` drift gate rebuilds the index in-memory via
 * the exported `buildSpecIndex()` and deep-equals it against the committed file,
 * failing if it is stale — mirroring how the repo gates generated artifacts.
 */
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as parseYaml } from 'js-yaml';

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const COMPONENTS_DIR = join(PKG_ROOT, 'components');
const PATTERNS_DIR = join(PKG_ROOT, 'patterns');
const SCREENS_DIR = join(PKG_ROOT, 'screens');
export const SPEC_INDEX_PATH = join(PKG_ROOT, 'spec-index.json');

export interface SpecIndexComponent {
  name: string;
  component: string;
  layer?: string;
  category: string;
  status: string;
  since?: string;
}

export interface SpecIndexPattern {
  name: string;
  pattern: string;
  status: string;
  category?: string;
  intent?: string;
  description?: string;
  when_to_use?: string[];
  when_not_to_use?: string[];
  anti_patterns?: string[];
  example?: string;
  components?: string[];
  implementedBy?: string;
  demo?: string;
  docs?: string;
}

export interface SpecIndexScreen {
  name: string;
  title: string;
  status: string;
  category?: string;
  route?: string;
  story?: string;
  pattern?: string;
}

export interface SpecIndex {
  components: SpecIndexComponent[];
  patterns: SpecIndexPattern[];
  screens: SpecIndexScreen[];
}

function listDirs(dir: string, requiredFile: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(
      (entry) =>
        statSync(join(dir, entry)).isDirectory() &&
        existsSync(join(dir, entry, requiredFile))
    )
    .sort();
}

function readYaml<T>(absPath: string): T {
  return parseYaml(readFileSync(absPath, 'utf8')) as T;
}

/** Copy only the keys that are present (non-nullish) in the source. */
function pick<T extends object, K extends keyof T>(
  source: T,
  keys: readonly K[]
): Partial<Pick<T, K>> {
  const out: Partial<Pick<T, K>> = {};
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null)
      out[key] = source[key];
  }
  return out;
}

const byName = (a: { name: string }, b: { name: string }): number =>
  a.name.localeCompare(b.name);

function buildComponents(): SpecIndexComponent[] {
  return listDirs(COMPONENTS_DIR, 'index.yaml')
    .map((name) => {
      const raw = readYaml<SpecIndexComponent>(
        join(COMPONENTS_DIR, name, 'index.yaml')
      );
      return {
        name: raw.name,
        component: raw.component,
        category: raw.category,
        status: raw.status,
        ...pick(raw, ['layer', 'since'] as const),
      } as SpecIndexComponent;
    })
    .sort(byName);
}

function buildPatterns(): SpecIndexPattern[] {
  return listDirs(PATTERNS_DIR, 'pattern.yaml')
    .map((name) => {
      const raw = readYaml<SpecIndexPattern>(
        join(PATTERNS_DIR, name, 'pattern.yaml')
      );
      return {
        name: raw.name,
        pattern: raw.pattern,
        status: raw.status,
        ...pick(raw, [
          'category',
          'intent',
          'description',
          'when_to_use',
          'when_not_to_use',
          'anti_patterns',
          'example',
          'components',
          'implementedBy',
          'demo',
          'docs',
        ] as const),
      } as SpecIndexPattern;
    })
    .sort(byName);
}

function buildScreens(): SpecIndexScreen[] {
  return listDirs(SCREENS_DIR, 'screen.yaml')
    .map((name) => {
      const raw = readYaml<SpecIndexScreen>(
        join(SCREENS_DIR, name, 'screen.yaml')
      );
      return {
        name: raw.name,
        title: raw.title,
        status: raw.status,
        ...pick(raw, ['category', 'route', 'story', 'pattern'] as const),
      } as SpecIndexScreen;
    })
    .sort(byName);
}

/** Build the spec index in-memory from the YAML sources. */
export function buildSpecIndex(): SpecIndex {
  return {
    components: buildComponents(),
    patterns: buildPatterns(),
    screens: buildScreens(),
  };
}

function main(): void {
  const index = buildSpecIndex();
  writeFileSync(SPEC_INDEX_PATH, `${JSON.stringify(index, null, 2)}\n`);
  console.log(
    `spec-index.json: ${index.components.length} components, ` +
      `${index.patterns.length} patterns, ${index.screens.length} screens.`
  );
}

// Only write the file when run as a script, not when imported by the drift test.
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main();
}

// PLTFRM-93014 — the config registry must survive the dts bundler.
//
// Every `data-grid-config/<group>.ts` contributes its slice of the public prop
// surface with `declare module './registry' { interface DataGridGroupedConfigMap
// … }`. tsup's dts step flattens all declarations into one file but copied those
// blocks across verbatim, and in the flattened file `'./registry'` resolves to
// nothing — TypeScript ignores an augmentation of an unresolvable module in
// silence. All 19 blocks evaporated, every config key fell off `DataGridProps`,
// and a consumer got 21 unknown-prop errors against a runtime that reads all of
// them. `scripts/inline-dts-augmentations.mjs` unwraps the blocks after the
// build; this is the check that it worked.
//
// The expectation is **derived from src, not hardcoded**. A frozen list of keys
// would go stale the first time a unit lands a group — `registry.ts` says exactly
// this about tallies — and a stale list is worse than none, because it passes.
// So: read what the source declares, then require dist to declare the same.
//
// Nothing here can be replaced by a `src`-side type test. The whole defect lives
// between src and the published artifact: the workspace typecheck and all 19
// `props-<group>.types.test.ts` files passed the entire time the published types
// were broken.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

import ts from 'typescript';
import { describe, expect, it } from 'vitest';

/**
 * Walk up from the cwd to this package's root. Not `import.meta.url`: under the
 * happy-dom environment Vitest rewrites it to a non-`file:` URL and
 * `fileURLToPath` throws.
 */
function findPackageRoot(from: string): string {
  for (let dir = from; ; dir = dirname(dir)) {
    const manifest = join(dir, 'package.json');
    if (
      existsSync(manifest) &&
      JSON.parse(readFileSync(manifest, 'utf8')).name ===
        '@constructor-lab/ui-react'
    ) {
      return dir;
    }
    if (dirname(dir) === dir)
      throw new Error('package root not found from ' + from);
  }
}

const packageRoot = findPackageRoot(process.cwd());
const distDir = join(packageRoot, 'dist');
const configDir = join(
  packageRoot,
  'src/components/ui/data-grid/data-grid-config'
);

/** The five augmentable registry maps (`data-grid-config/registry.ts`). */
const REGISTRY_MAPS = [
  'DataGridGroupedConfigMap',
  'DataGridTopLevelConfigMap',
  'DataGridDeprecatedAliasMap',
  'DataGridResolvedConfigMap',
  'DataGridIdentityFreeMap',
] as const;

type MapName = (typeof REGISTRY_MAPS)[number];
type Surface = Record<MapName, Set<string>>;

const emptySurface = (): Surface =>
  Object.fromEntries(
    REGISTRY_MAPS.map((name) => [name, new Set<string>()])
  ) as Surface;

const parse = (file: string, text: string) =>
  ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );

const isRegistryMap = (name: string): name is MapName =>
  (REGISTRY_MAPS as readonly string[]).includes(name);

function collectMembers(
  source: ts.SourceFile,
  statements: readonly ts.Statement[],
  into: Surface
) {
  for (const statement of statements) {
    if (!ts.isInterfaceDeclaration(statement)) continue;
    const name = statement.name.text;
    if (!isRegistryMap(name)) continue;
    for (const member of statement.members) {
      if (member.name) into[name].add(member.name.getText(source));
    }
  }
}

/** What the source declares, across every `data-grid-config` module. */
function surfaceFromSource(): Surface {
  const surface = emptySurface();
  for (const entry of readdirSync(configDir)) {
    if (!/\.tsx?$/.test(entry)) continue;
    const file = join(configDir, entry);
    const source = parse(file, readFileSync(file, 'utf8'));
    for (const statement of source.statements) {
      if (
        ts.isModuleDeclaration(statement) &&
        ts.isStringLiteral(statement.name) &&
        statement.name.text.startsWith('.') &&
        statement.body &&
        ts.isModuleBlock(statement.body)
      ) {
        collectMembers(source, statement.body.statements, surface);
      }
    }
  }
  return surface;
}

function declarationFiles(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) found.push(...declarationFiles(path));
    else if (entry.endsWith('.d.ts')) found.push(path);
  }
  return found;
}

/** What the published declarations declare, merged across every dist `.d.ts`. */
function surfaceFromDist(files: string[]) {
  const surface = emptySurface();
  const survivingAugmentations: string[] = [];
  for (const file of files) {
    const source = parse(file, readFileSync(file, 'utf8'));
    collectMembers(source, source.statements, surface);
    for (const statement of source.statements) {
      if (
        ts.isModuleDeclaration(statement) &&
        ts.isStringLiteral(statement.name) &&
        statement.name.text.startsWith('.')
      ) {
        survivingAugmentations.push(
          `${relative(packageRoot, file)}: declare module '${statement.name.text}'`
        );
      }
    }
  }
  return { surface, survivingAugmentations };
}

// The build has to have run. Skipping quietly is the right call for a bare
// `vitest run` on a clean tree; CI builds before it tests, so the check bites
// where it matters.
const built = existsSync(distDir) && declarationFiles(distDir).length > 0;

describe.skipIf(!built)('published DataGrid config types', () => {
  const files = built ? declarationFiles(distDir) : [];
  const { surface: published, survivingAugmentations } = surfaceFromDist(files);
  const declared = surfaceFromSource();

  it('leaves no relative `declare module` in the published declarations', () => {
    // A relative specifier that resolved in src resolves to nothing once
    // flattened, and TypeScript drops the augmentation without a word. This is
    // the exact shape of PLTFRM-93014.
    expect(survivingAugmentations).toEqual([]);
  });

  it.each(REGISTRY_MAPS)('publishes every member src declares on %s', (map) => {
    const missing = [...declared[map]]
      .filter((key) => !published[map].has(key))
      .sort();
    expect(missing).toEqual([]);
  });

  it('publishes a non-empty grouped-config map', () => {
    // The failure mode was an *empty* map — belt and braces, in case the source
    // side of this test ever reads zero modules and vacuously agrees.
    expect(published.DataGridGroupedConfigMap.size).toBeGreaterThan(0);
    expect(declared.DataGridGroupedConfigMap.size).toBeGreaterThan(0);
  });
});

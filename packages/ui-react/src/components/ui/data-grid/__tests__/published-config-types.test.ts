// PLTFRM-93014 — the config registry must survive the dts step.
//
// Every `data-grid-config/<group>.ts` contributes its slice of the public prop
// surface with `declare module './registry' { interface DataGridGroupedConfigMap
// … }`. Two different build shapes have broken that, both silently, because
// TypeScript ignores an augmentation it cannot resolve without a word:
//
//  1. tsup's `dts` flattened every declaration into one file per entry and copied
//     the blocks across verbatim. In the flattened file `'./registry'` resolved to
//     nothing, so all 19 evaporated and every config key fell off `DataGridProps`.
//     `scripts/inline-dts-augmentations.mjs` unwrapped the blocks to fix it — once
//     flattened, the target sat in the *same* module, so bare interfaces merged.
//  2. The build then moved to Vite + `unplugin-dts`, which emits **one `.d.ts` per
//     module**. `'./registry'` resolves again — and the unwrapping became the
//     defect: an unwrapped block declares a *local* `DataGridGroupedConfigMap` in
//     `pagination.d.ts` that merges with nothing, leaving the registry's map empty
//     for consumers exactly as in (1). The script is gone; the blocks now ship
//     as-authored.
//
// The previous guard could not see either failure. It collected interface members
// **textually, merged across all of dist** — which is not what the type checker
// does — so an augmentation stranded in the wrong module still counted. Both this
// package's `typecheck` and all 19 `props-<group>.types.test.ts` files also passed
// the whole time the published types were broken: the defect lives strictly
// between src and the artifact.
//
// So this asks the type checker instead: it compiles probe modules against the
// built `.d.ts` and requires every key src declares to be a key of the published
// `DataGridProps`. The expectation stays **derived from src, not hardcoded** — a
// frozen list would go stale the first time a unit lands a group, and a stale list
// is worse than none because it passes. A deliberately wrong probe is compiled
// alongside, so a probe that can no longer fail is itself a failure.

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

/**
 * The three maps whose members are **props**. The other two are internal: the
 * resolved map is what modules read after resolution, and the identity-free map
 * only re-types props the prop maps already declare.
 */
const PROP_MAPS = [
  'DataGridGroupedConfigMap',
  'DataGridTopLevelConfigMap',
  'DataGridDeprecatedAliasMap',
] as const satisfies readonly MapName[];

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

/**
 * A path as an import specifier: POSIX separators, no `.d.ts` extension.
 * A regex over `replaceAll` because this package targets ES2020.
 */
const specifier = (path: string) =>
  path.replace(/\\/g, '/').replace(/\.d\.ts$/, '');

/**
 * A key as an identifier fragment, so the alias naming a failed check points at
 * the key that failed. Config keys are already identifiers; a quoted or symbol
 * member would not be.
 */
const identifierPart = (key: string) => key.replace(/[^A-Za-z0-9_$]/g, '_');

const PROBE_PREAMBLE = `
type Row = { id: string };
type Assert<T extends true> = T;
`;

/** Probes: one deliberately-wrong module proves the mechanism can still fail. */
function probeModules(declared: Surface) {
  const propKeys = [
    ...new Set(PROP_MAPS.flatMap((map) => [...declared[map]])),
  ].sort();

  const publicProbe = `
import type { DataGridProps } from '${specifier(join(distDir, 'index.d.ts'))}';
${PROBE_PREAMBLE}
type PropKey<K extends PropertyKey> = K extends keyof DataGridProps<Row>
  ? true
  : false;
${propKeys
  .map(
    (key) =>
      `type Prop_${identifierPart(key)} = Assert<PropKey<'${key}'>>; // ${key}`
  )
  .join('\n')}
`;

  // The internal maps never reach a consumer as props, but a stranded
  // augmentation would leave them empty too — and an empty resolved map is how a
  // group's own module silently stops seeing its config.
  const internalProbe = `
import type {
  DataGridIdentityFreeMap,
  DataGridResolvedConfigMap,
} from '${specifier(join(distDir, 'components/ui/data-grid/data-grid-config/index.d.ts'))}';
${PROBE_PREAMBLE}
type ResolvedKey<K extends PropertyKey> =
  K extends keyof DataGridResolvedConfigMap<Row> ? true : false;
type IdentityFreeKey<K extends PropertyKey> =
  K extends keyof DataGridIdentityFreeMap<Row> ? true : false;
${[...declared.DataGridResolvedConfigMap]
  .sort()
  .map(
    (key) =>
      `type Resolved_${identifierPart(key)} = Assert<ResolvedKey<'${key}'>>; // ${key}`
  )
  .join('\n')}
${[...declared.DataGridIdentityFreeMap]
  .sort()
  .map(
    (key) =>
      `type IdentityFree_${identifierPart(key)} = Assert<IdentityFreeKey<'${key}'>>; // ${key}`
  )
  .join('\n')}
`;

  const negativeProbe = `
import type { DataGridProps } from '${specifier(join(distDir, 'index.d.ts'))}';
${PROBE_PREAMBLE}
type PropKey<K extends PropertyKey> = K extends keyof DataGridProps<Row>
  ? true
  : false;
// Must NOT compile. If it does, every check above passed vacuously — the import
// resolved to \`any\`, or \`Assert\` stopped constraining.
type Missing = Assert<PropKey<'notARealDataGridProp'>>;
`;

  return {
    [join(packageRoot, '__probe-published-props.ts')]: publicProbe,
    [join(packageRoot, '__probe-published-internal.ts')]: internalProbe,
    [join(packageRoot, '__probe-published-negative.ts')]: negativeProbe,
  };
}

/** Type-check the probes against dist, and report their diagnostics per file. */
function checkProbes(probes: Record<string, string>) {
  const options: ts.CompilerOptions = {
    strict: true,
    noEmit: true,
    // The published declarations reference React and TanStack types; checking
    // those is not this test's job, and it dominates the run time.
    skipLibCheck: true,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    target: ts.ScriptTarget.ES2022,
    // Nothing here needs an ambient global, and pulling every @types package in
    // makes the program much larger.
    types: [],
  };

  const host = ts.createCompilerHost(options, true);
  const readProbe = (fileName: string) => probes[fileName];
  const originalGetSourceFile = host.getSourceFile.bind(host);
  host.getSourceFile = (fileName, languageVersion, ...rest) => {
    const overlay = readProbe(fileName);
    return overlay === undefined
      ? originalGetSourceFile(fileName, languageVersion, ...rest)
      : ts.createSourceFile(fileName, overlay, languageVersion, true);
  };
  host.fileExists = (fileName) =>
    readProbe(fileName) !== undefined || ts.sys.fileExists(fileName);
  host.readFile = (fileName) =>
    readProbe(fileName) ?? ts.sys.readFile(fileName);

  const program = ts.createProgram(Object.keys(probes), options, host);
  const diagnostics = ts.getPreEmitDiagnostics(program);

  const byFile = Object.fromEntries(
    Object.keys(probes).map((file) => [file, [] as string[]])
  );
  for (const diagnostic of diagnostics) {
    const file = diagnostic.file?.fileName;
    if (file === undefined || byFile[file] === undefined) continue;
    const { line } = diagnostic.file!.getLineAndCharacterOfPosition(
      diagnostic.start ?? 0
    );
    // The offending line verbatim, not just its number: the probe is generated,
    // so a bare `probe.ts:18 Type 'false' does not satisfy 'true'` names nothing
    // a reader can act on. The line *is* the `Prop_<key>` alias.
    const offending = probes[file].split('\n')[line]?.trim() ?? '';
    byFile[file].push(
      `${relative(packageRoot, file)}:${line + 1} ` +
        ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ') +
        (offending === '' ? '' : ` — ${offending}`)
    );
  }
  return byFile;
}

// The build has to have run. Skipping quietly is the right call for a bare
// `vitest run` on a clean tree; CI builds before it tests, so the check bites
// where it matters.
const built = existsSync(distDir) && declarationFiles(distDir).length > 0;

describe.skipIf(!built)('published DataGrid config types', () => {
  const declared = surfaceFromSource();
  const probes = probeModules(declared);
  const [propsProbe, internalProbe, negativeProbe] = Object.keys(probes);
  const diagnostics = checkProbes(probes);

  it('declares a non-empty surface in src', () => {
    // Belt and braces: everything below is derived from these, so a source-side
    // read of zero modules would otherwise agree vacuously.
    expect(declared.DataGridGroupedConfigMap.size).toBeGreaterThan(0);
    expect(declared.DataGridResolvedConfigMap.size).toBeGreaterThan(0);
  });

  it('publishes every src-declared config key on `DataGridProps`', () => {
    // Each diagnostic names the `Prop_<key>` alias that failed, so the message
    // says which group fell off.
    expect(diagnostics[propsProbe]).toEqual([]);
  });

  it('publishes the internal registry maps intact', () => {
    expect(diagnostics[internalProbe]).toEqual([]);
  });

  it('would notice a key that is genuinely absent', () => {
    expect(diagnostics[negativeProbe].length).toBeGreaterThan(0);
  });
});

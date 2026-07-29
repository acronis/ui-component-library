import { readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

import { DATA_GRID_CONFIG_MODULES } from '../components/ui/data-grid/data-grid-config';

// The mechanism behind `vitest.config.ts`'s `typecheck.enabled: false`.
//
// That block is off because it is redundant for DETECTION: `tsconfig.json` has
// `"include": ["src", …]`, so every `*.types.test.ts` is already in the type
// program, and an `expectTypeOf` failure is an ordinary type error — measured,
// not assumed (a false assertion is reported by plain `tsc --noEmit` as `TS2344`).
// `pnpm typecheck` therefore already gates every type assertion in the package,
// and `pnpm test:types` adds reporting rather than coverage.
//
// **That redundancy holds only while the test files stay inside the type program,
// and the coupling is invisible from both ends.** Excluding `src/**/__tests__` to
// speed `typecheck` up looks purely like a performance change; it would silently
// make the vitest block the only gate, while `pnpm test` — which no longer runs
// that block — kept reporting green. Nothing about either file hints at the other.
//
// A comment next to the `include` array is not a mechanism, so this is the
// assertion. It is a RUNTIME test on purpose: it has to run in the fast `test`
// script, because the fast gate is what protects the slow gate's precondition.

const packageDir = resolve(__dirname, '../..');
const tsconfigPath = join(packageDir, 'tsconfig.json');

/**
 * The file names TypeScript actually puts in the program for a given config —
 * resolved by TypeScript itself rather than by re-implementing `include` /
 * `exclude` / `extends` semantics, which is the part that would rot.
 */
function programFileNames(configPath: string): readonly string[] {
  const parsed = ts.getParsedCommandLineOfConfigFile(
    configPath,
    {},
    {
      ...ts.sys,
      onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
        throw new Error(
          ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ')
        );
      },
    }
  );
  if (parsed === undefined) {
    throw new Error(`could not parse ${configPath}`);
  }
  return parsed.fileNames;
}

/** Every `*.types.test.ts(x)` under `src`, found rather than hard-listed. */
function typeTestFiles(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...typeTestFiles(path));
    } else if (/\.types\.test\.tsx?$/.test(entry.name)) {
      found.push(path);
    }
  }
  return found;
}

describe('the typecheck gate', () => {
  it('keeps every type-test file inside the tsconfig type program', () => {
    const inProgram = new Set(
      programFileNames(tsconfigPath).map((file) => resolve(file))
    );
    const typeTests = typeTestFiles(join(packageDir, 'src')).map((file) =>
      resolve(file)
    );

    // Guard the guard: if the search found nothing, the assertion below is
    // vacuously true and would stay green after the files were deleted or
    // renamed. This package has many of them.
    //
    // **A threshold is the weak form of this guard and is kept only as a floor.**
    // With 18 `props-*.types.test.ts` files alone, `> 10` survives eight of them
    // vanishing. The discriminating version is the set-equality assertion in the
    // case below; a count cannot distinguish "one group lost its type test" from
    // "nothing changed" (#50).
    expect(typeTests.length).toBeGreaterThan(10);

    const missing = typeTests.filter((file) => !inProgram.has(file));
    expect(
      missing,
      `type-test files outside the type program: ${missing.join(', ')}`
    ).toEqual([]);
  });

  // #50, tranche 4. What guarantees that each DataGrid behavior group has a
  // prop-surface assertion is a **file convention, not a type**: one
  // `props-<group>.types.test.ts` per group. Nothing asserted the convention held,
  // and two groups shipped without theirs being filled in —
  // `props-columns-features` (U3) and `props-footer` (U5) both still said "NOT YET
  // IMPLEMENTED" and held an `it.todo` after their groups landed.
  //
  // **File existence is not the discriminating property, which is the whole lesson
  // here.** Both files existed the entire time. `it.todo` never fails, so the type
  // surface of a shipped group was unasserted with no signal anywhere. So this
  // checks both directions and the second one is the one that bites:
  //   1. every registered `kind: 'grouped'` module has a file, and
  //   2. that file contains at least one real `it(` — a todo-only file for a
  //      SHIPPED group is the defect.
  //
  // The reverse of (1) is deliberately not asserted: a file may exist before its
  // group does, which is exactly how the not-yet-shipped groups reserve ownership.
  it('gives every shipped DataGrid group a filled prop-surface type test', () => {
    const dir = join(packageDir, 'src/components/ui/data-grid/__tests__');
    const kebab = (key: string) =>
      key.replace(/[A-Z]/g, (upper) => `-${upper.toLowerCase()}`);

    const grouped = DATA_GRID_CONFIG_MODULES.filter(
      (module) => module.kind === 'grouped'
    ).map((module) => module.key);

    const absent: string[] = [];
    const todoOnly: string[] = [];
    for (const key of grouped) {
      const name = `props-${kebab(key)}.types.test.ts`;
      let source: string;
      try {
        source = readFileSync(join(dir, name), 'utf8');
      } catch {
        absent.push(name);
        continue;
      }
      if (!/\bit\(/.test(source)) todoOnly.push(name);
    }

    expect(
      absent,
      `registered groups with no prop-surface type test: ${absent.join(', ')}`
    ).toEqual([]);
    expect(
      todoOnly,
      `groups that shipped but whose type test is still todo-only: ${todoOnly.join(', ')}`
    ).toEqual([]);
  });

  it('would notice if they left it', () => {
    // The negative control. Two things about its shape are deliberate.
    //
    // It does NOT edit the real `tsconfig.json`: four units share this checkout
    // and a temporary exclude there would break their typecheck for the duration.
    // Instead it writes a throwaway config that `extends` the real one and adds
    // the exclude someone would add, then deletes it.
    //
    // And it resolves that config through **`getParsedCommandLineOfConfigFile`,
    // the same API the assertion above uses**. An earlier version used
    // `parseJsonConfigFileContent` over an in-memory object, which proved the
    // shared `missing` computation discriminates but NOT that the real code path
    // does — a control that exercises a different route than its subject can
    // agree with it by luck. Both APIs are public; only one of them is the one
    // under test.
    const probePath = join(packageDir, 'tsconfig.gate-probe.json');
    const raw = JSON.parse(readFileSync(tsconfigPath, 'utf8')) as {
      exclude?: string[];
    };
    writeFileSync(
      probePath,
      JSON.stringify({
        extends: './tsconfig.json',
        exclude: [...(raw.exclude ?? []), 'src/**/__tests__/**'],
      })
    );

    try {
      const inProgram = new Set(
        programFileNames(probePath).map((file) => resolve(file))
      );
      const typeTests = typeTestFiles(join(packageDir, 'src')).map((file) =>
        resolve(file)
      );

      // Same computation as the assertion above, and every file must fall out —
      // not merely "some", which a stray glob could also produce.
      const missing = typeTests.filter((file) => !inProgram.has(file));
      expect(missing.length).toBe(typeTests.length);
    } finally {
      // `finally` rather than an afterEach: a throwaway config left in the package
      // root would outlive a crashed run, and nothing globs it, so nothing else
      // would ever report it.
      rmSync(probePath, { force: true });
    }
  });
});

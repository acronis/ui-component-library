// Nothing under `src/` may import this package by name.
//
// A self-referential `from '@constructor-lab/ui-react'` resolves fine on a
// developer machine and fails in CI, which is the worst possible failure shape:
// it depends on whether `dist/` happens to exist. With a build present the
// specifier resolves to the built artifact; on a clean checkout there is nothing
// to resolve and the bundler aborts.
//
// It has now bitten twice, both times from the same ui-blocks sync:
//
//  1. Five source modules broke `pnpm --filter @constructor-lab/ui-react build`
//     outright — rolldown cannot resolve the package from inside itself while
//     building the very `dist` the specifier points at (fixed in f2910b74).
//  2. Two `__stories__` files then broke the **visual-regression** workflow only.
//     That job builds `icons-react` and Storybook, never `ui-react`, so no `dist`
//     exists — while `ci.yml` runs `pnpm -r build` first and therefore passed.
//     Locally both passed, because a `dist` was already sitting there from an
//     earlier build.
//
// So neither `pnpm build`, nor `pnpm test`, nor a local `storybook:build` is a
// reliable detector: each one's verdict depends on prior state. A static read of
// the source does not.
//
// Fix any failure by importing the module directly (`../../button`), never by
// adding the package to a bundler's `external`.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

import ts from 'typescript';
import { describe, expect, it } from 'vitest';

/**
 * Walk up to this package's root. Not `import.meta.url`: under happy-dom Vitest
 * rewrites it to a non-`file:` URL and `fileURLToPath` throws.
 */
function findPackageRoot(from: string): string {
  for (let dir = from; ; dir = dirname(dir)) {
    const manifest = join(dir, 'package.json');
    try {
      const name = JSON.parse(readFileSync(manifest, 'utf8')).name;
      if (name === '@constructor-lab/ui-react') return dir;
    } catch {
      // no manifest here, or not ours — keep walking
    }
    if (dirname(dir) === dir)
      throw new Error('package root not found from ' + from);
  }
}

const packageRoot = findPackageRoot(process.cwd());
const srcDir = join(packageRoot, 'src');
const packageName = JSON.parse(
  readFileSync(join(packageRoot, 'package.json'), 'utf8')
).name as string;

function sourceFiles(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) found.push(...sourceFiles(path));
    else if (/\.(ts|tsx)$/.test(entry)) found.push(path);
  }
  return found;
}

const isSelf = (specifier: string) =>
  specifier === packageName || specifier.startsWith(packageName + '/');

/**
 * Every module specifier a file actually imports from — `import`, `export … from`
 * and dynamic `import()`.
 *
 * The parser, not a regex over the text. A textual search reports this very file
 * and the two comments in
 * `data-table/__tests__/table-family-public-types.test.ts` that quote
 * `from '@constructor-lab/ui-react'` while explaining why that import form is the
 * wrong way to assert the public surface. A guard whose only failures are prose
 * about the guard gets deleted, so it has to read declarations.
 */
function importedSpecifiers(file: string, text: string): string[] {
  const source = ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );
  const found: string[] = [];
  const visit = (node: ts.Node) => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      found.push(node.moduleSpecifier.text);
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments[0] &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      found.push(node.arguments[0].text);
    }
    ts.forEachChild(node, visit);
  };
  ts.forEachChild(source, visit);
  return found;
}

describe('no self-referential imports', () => {
  const files = sourceFiles(srcDir);

  it('reads a non-empty source tree', () => {
    // Everything below is derived from this list, so a glob that matched nothing
    // would otherwise agree vacuously.
    expect(files.length).toBeGreaterThan(100);
  });

  it(`no file under src/ imports ${packageName}`, () => {
    const offenders = files
      .filter((file) =>
        importedSpecifiers(file, readFileSync(file, 'utf8')).some(isSelf)
      )
      .map((file) => relative(packageRoot, file));
    expect(offenders).toEqual([]);
  });

  it('would notice one', () => {
    // The extractor is the whole check, so a version that stopped seeing imports
    // would make the assertion above pass forever.
    const probe = (code: string) =>
      importedSpecifiers('probe.tsx', code).some(isSelf);

    expect(probe(`import { Button } from '${packageName}';`)).toBe(true);
    expect(probe(`export { x } from '${packageName}/components';`)).toBe(true);
    expect(probe(`const m = await import('${packageName}');`)).toBe(true);
    // A relative import of the same module is the fix, not a violation.
    expect(probe(`import { Button } from '../../button';`)).toBe(false);
    // And prose quoting an import must not trip it — the reason this reads
    // declarations rather than text.
    expect(probe(`// never write: from '${packageName}'`)).toBe(false);
  });
});

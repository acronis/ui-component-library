import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { cssDir, dtcgDir, jsDir, scssDir } from '../platforms';
import { buildCss, buildDtcg } from '../tokens';

// Golden / characterization test: the committed generated output IS the golden.
// Running the `pd` build (what `packages/tokens build` runs: `pd-css`, whose css
// step also emits scss + js, preceded by its dtcg dep) must reproduce the exact
// bytes already committed under packages/tokens/{dtcg,css,scss,js}. This is the
// same-output guard for refactors of the build pipeline: any change that alters a
// generated file fails here. It also proves the build is idempotent.

/** Read every file under `dir` into a { relativePath: contents } map. */
function snapshotDir(dir: string): Record<string, string> {
  const out: Record<string, string> = {};
  const walk = (d: string): void => {
    for (const entry of readdirSync(d)) {
      const p = path.join(d, entry);
      if (statSync(p).isDirectory()) walk(p);
      else out[path.relative(dir, p)] = readFileSync(p, 'utf8');
    }
  };
  walk(dir);
  return out;
}

describe('token build — golden (same output)', () => {
  it('reproduces the committed dtcg/css/scss/js byte-for-byte', async () => {
    const dirs = {
      dtcg: dtcgDir(),
      css: cssDir(),
      scss: scssDir(),
      js: jsDir(),
    } as const;

    const before = Object.fromEntries(
      Object.entries(dirs).map(([name, dir]) => [name, snapshotDir(dir)])
    );

    // Same sequence as `tsx src/index.ts pd-css` (css reads dtcg → dtcg first).
    buildDtcg('pd');
    await buildCss('pd');

    for (const [name, dir] of Object.entries(dirs)) {
      expect(snapshotDir(dir), `${name} output changed`).toEqual(before[name]);
    }
  }, 60_000);
});

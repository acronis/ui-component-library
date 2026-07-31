import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { compile } from 'tailwindcss';

/**
 * Guards the `dark:` custom variant in `../index.css`.
 *
 * ── WHY THIS NEEDS A TEST AT ALL ─────────────────────────────────────────────
 * **No component in `src/` uses a `dark:` utility today.** So the variant
 * contributes nothing to the built stylesheet, no story renders through it, and
 * no visual-regression baseline can move if it breaks. A malformed
 * `@custom-variant` does not error either — Tailwind emits the utility with the
 * variant silently dropped, or emits nothing. The first person to write
 * `dark:bg-…` would inherit whatever state it is in, with no signal that it was
 * never exercised.
 *
 * ── WHAT IS ACTUALLY BEING ASSERTED ──────────────────────────────────────────
 * Two branches, because the tokens have two. `@constructor-lab/tokens` puts
 * `color-scheme: light dark` on `:root`, so with no `[data-theme]` the palette
 * follows the OS through `light-dark()`. A variant that keys only on the
 * attribute would paint light `dark:` utilities over dark token colours.
 *
 * The second branch's `:not([data-theme='light'], …)` escape is the load-bearing
 * half and the easiest thing to get wrong: drop it and a user who deliberately
 * chose light on a dark machine gets dark utilities on a light palette.
 *
 * ── WHY IT COMPILES THE REAL FILE ────────────────────────────────────────────
 * The variant is brace-matched out of `index.css` and run through Tailwind's own
 * compiler rather than pattern-matched as text. A textual assertion would pass on
 * source that Tailwind cannot parse — which is precisely the failure mode here,
 * since nothing else in the repo compiles this rule.
 */

const require = createRequire(import.meta.url);
const INDEX_CSS = resolve(__dirname, '../index.css');

/** The `@custom-variant dark { … }` block, brace-matched out of the real file. */
function extractDarkVariant(css: string): string {
  const start = css.indexOf('@custom-variant dark');
  if (start === -1) {
    throw new Error(
      'No `@custom-variant dark` in src/styles/index.css. If the variant moved, ' +
        'move this test with it — do not delete it; nothing else exercises it.'
    );
  }
  const open = css.indexOf('{', start);
  if (open === -1) {
    throw new Error(
      '`@custom-variant dark` is not in block form. The single-selector form ' +
        '`@custom-variant dark (…)` cannot express the `prefers-color-scheme` ' +
        'branch, so reaching here means the OS branch was lost.'
    );
  }

  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}' && --depth === 0) return css.slice(start, i + 1);
  }
  throw new Error('Unbalanced braces in the `@custom-variant dark` block.');
}

async function buildWithVariant(candidates: string[]): Promise<string> {
  const tailwindIndex = require.resolve('tailwindcss/index.css');
  const variant = extractDarkVariant(readFileSync(INDEX_CSS, 'utf8'));

  const compiled = await compile(`@import 'tailwindcss';\n${variant}`, {
    base: dirname(tailwindIndex),
    loadStylesheet: async (id: string) => {
      const path = id === 'tailwindcss' ? tailwindIndex : id;
      return {
        path,
        base: dirname(path),
        content: readFileSync(path, 'utf8'),
      };
    },
  });

  return compiled.build(candidates);
}

describe('the `dark:` custom variant', () => {
  it('compiles — Tailwind accepts the block form and keeps the utility', async () => {
    const css = await buildWithVariant(['dark:bg-black']);
    // A dropped variant still emits the utility, so "it produced CSS" proves
    // nothing on its own; the branch assertions below are what carry the weight.
    expect(css).toContain('background-color');
  });

  it('emits the attribute branch', async () => {
    const css = await buildWithVariant(['dark:bg-black']);
    expect(css).toContain("[data-theme='dark'], [data-theme='dark'] *");
  });

  it('emits the OS branch, so a system-dark user is covered', async () => {
    // The whole reason this variant is not just an attribute selector.
    const css = await buildWithVariant(['dark:bg-black']);
    expect(css).toContain('@media (prefers-color-scheme: dark)');
  });

  it('guards the OS branch against an explicit light choice', async () => {
    // Without this, `[data-theme='light']` on a dark machine gets dark utilities
    // over a light palette. `forced-light` in the visual-regression profiles is
    // the pixel-level counterpart of this assertion.
    const css = await buildWithVariant(['dark:bg-black']);
    expect(css).toContain(":not([data-theme='light'], [data-theme='light'] *)");
  });

  it('applies the declaration in BOTH branches, not just one', async () => {
    // The assertion a text-match on index.css could never make: if either branch
    // fails to compile, Tailwind drops it silently and this count falls to 1.
    const css = await buildWithVariant(['dark:bg-black']);
    expect(css.match(/background-color: var\(--color-black\)/g)).toHaveLength(
      2
    );
  });

  it('keeps the variant at zero specificity via :where()', async () => {
    // Both branches were `:where()`-wrapped before the OS branch was added;
    // losing it would let `dark:` beat unrelated utilities it used to tie with.
    const css = await buildWithVariant(['dark:bg-black']);
    expect(css).toContain(":where([data-theme='dark']");
    expect(css).toContain(':where(:not(');
  });
});

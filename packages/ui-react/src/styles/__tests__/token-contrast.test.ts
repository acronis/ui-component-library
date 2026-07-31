import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * WCAG AA contrast for the text/surface token pairs, in BOTH themes, computed
 * straight from the generated token CSS.
 *
 * ── WHY THIS EXISTS: THE FIX IT GUARDS IS REVERTIBLE BY A SYNC ───────────────
 * `--ui-text-on-surface-secondary` used to resolve to `--ui-palette-grayscale-7`,
 * which measures 4.85:1 on white but **3.36:1 on the dark surface** — 287 real
 * findings across 43+ pages in the first `story-audit` sweep, the single largest
 * cause. The reason is structural rather than a typo: the grayscale ramp is
 * MIRRORED (index N's light value is index 14−N's dark value), and 7 is the
 * midpoint of a 15-step ramp, so it maps onto itself and is the one grey that is
 * identical in both themes. A foreground that never changes cannot serve two
 * surfaces that do.
 *
 * It was retargeted to `grayscale-8`. But `packages/tokens/tiers/` is
 * **re-emitted from a Figma snapshot** by `pnpm --filter @constructor-lab/tokens
 * emit`, so the next sync will happily put `grayscale-7` back — silently, and
 * with no visual-regression failure, because the baselines would be regenerated
 * against the regressed value. This test is what makes that loud.
 *
 * ── WHY IT READS THE GENERATED CSS ───────────────────────────────────────────
 * The CSS is the artifact components actually resolve against, and the repo
 * already fails CI when a tier change is not rebuilt and committed — so checking
 * the built output cannot drift from the tiers without CI noticing separately.
 * Reading it also keeps this test free of a token-package dependency and of any
 * re-implementation of the alias resolution.
 */

const require = createRequire(import.meta.url);
const CSS_DIR = dirname(require.resolve('@constructor-lab/tokens/css'));

const read = (file: string): string =>
  readFileSync(join(CSS_DIR, file), 'utf8');

/** `--ui-palette-x: light-dark(rgb(…), rgb(…))` → name → [light, dark]. */
function palettePairs(): Map<string, [string, string]> {
  const out = new Map<string, [string, string]>();
  const re =
    /--(ui-palette-[\w-]+):\s*light-dark\(\s*(rgb\([^)]*\)|transparent)\s*,\s*(rgb\([^)]*\)|transparent)\s*\)/g;
  for (const m of read('primitives.css').matchAll(re)) {
    out.set(m[1], [m[2], m[3]]);
  }
  return out;
}

/** `--ui-semantic: var(--ui-palette-x)` → semantic → palette name. */
function semanticAliases(): Map<string, string> {
  const out = new Map<string, string>();
  const re = /--(ui-[\w-]+):\s*var\(--(ui-palette-[\w-]+)\)/g;
  // Only the `:root, :host` block — later blocks are per-brand overrides, and
  // this test deliberately scopes to the default brand (see the note below).
  const base = read('semantics.css').split('[data-brand=')[0];
  for (const m of base.matchAll(re)) out.set(m[1], m[2]);
  return out;
}

function luminance(rgb: string): number {
  const parts = rgb.match(/[\d.]+/g);
  if (!parts || parts.length < 3) throw new Error(`unparseable color: ${rgb}`);
  const channel = (v: number): number => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return (
    0.2126 * channel(Number(parts[0])) +
    0.7152 * channel(Number(parts[1])) +
    0.0722 * channel(Number(parts[2]))
  );
}

function contrast(fg: string, bg: string): number {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

const PALETTE = palettePairs();
const ALIASES = semanticAliases();

/** Resolve a semantic to its [light, dark] literal pair. */
function resolve(semantic: string): [string, string] {
  const palette = ALIASES.get(semantic);
  if (!palette) {
    throw new Error(
      `No \`--${semantic}: var(--ui-palette-…)\` in the default-brand block of ` +
        'semantics.css. The token was renamed or is no longer a simple alias — ' +
        'fix this test rather than deleting the pair it guards.'
    );
  }
  const pair = PALETTE.get(palette);
  if (!pair) {
    throw new Error(
      `\`--${palette}\` has no light-dark() pair in primitives.css (referenced ` +
        `by --${semantic}).`
    );
  }
  return pair;
}

/**
 * Foreground/background pairs that must clear AA in both themes.
 *
 * Scoped to the DEFAULT brand and to normal-size body text (4.5:1). The other 20
 * `[data-brand]` blocks override some of these and are not covered here — stated
 * rather than implied, because a test that silently checks one brand while
 * reading like it checks all of them is its own kind of false confidence.
 */
const PAIRS: { fg: string; bg: string; note: string }[] = [
  {
    fg: 'ui-text-on-surface-primary',
    bg: 'ui-background-surface-primary',
    note: 'body text on the page surface',
  },
  {
    fg: 'ui-text-on-surface-secondary',
    bg: 'ui-background-surface-primary',
    note: 'the grayscale-7 regression this test exists for',
  },
  {
    fg: 'ui-text-on-surface-secondary',
    bg: 'ui-background-surface-secondary',
    note: 'secondary text on the raised surface',
  },
  {
    fg: 'ui-text-on-surface-primary',
    bg: 'ui-background-surface-secondary',
    note: 'body text on the raised surface',
  },
];

const AA_NORMAL = 4.5;

describe('token contrast (default brand, normal text)', () => {
  it('parsed both token files', () => {
    // Guards the guard: a moved file or changed emitter shape would make every
    // assertion below vacuous rather than failing.
    expect(PALETTE.size).toBeGreaterThan(50);
    expect(ALIASES.size).toBeGreaterThan(50);
  });

  it.each(PAIRS)('$fg on $bg — $note', ({ fg, bg }) => {
    const [fgLight, fgDark] = resolve(fg);
    const [bgLight, bgDark] = resolve(bg);

    const light = contrast(fgLight, bgLight);
    const dark = contrast(fgDark, bgDark);

    expect(
      light,
      `light: ${fgLight} on ${bgLight} = ${light.toFixed(2)}:1`
    ).toBeGreaterThanOrEqual(AA_NORMAL);
    expect(
      dark,
      `dark: ${fgDark} on ${bgDark} = ${dark.toFixed(2)}:1`
    ).toBeGreaterThanOrEqual(AA_NORMAL);
  });
});

describe('the mirrored grayscale ramp', () => {
  it('has exactly one fixed point, and no text semantic points at it', () => {
    // `grayscale-7` is the midpoint of a 15-step mirrored ramp, so light === dark
    // there by construction. That is fine for a border or a fill; it is not fine
    // for a foreground, which has to contrast against surfaces that DO flip.
    // This asserts the property directly, so the trap stays documented in code
    // even if the specific pair above is ever restructured.
    const fixedPoints = [...PALETTE.entries()]
      .filter(([name]) => name.startsWith('ui-palette-grayscale-'))
      .filter(([, [light, dark]]) => light === dark)
      .map(([name]) => name);

    expect(fixedPoints).toEqual(['ui-palette-grayscale-7']);

    const textOnFixedPoint = [...ALIASES.entries()]
      .filter(([semantic]) => semantic.startsWith('ui-text-'))
      .filter(([, palette]) => fixedPoints.includes(palette))
      .map(([semantic]) => semantic);

    expect(
      textOnFixedPoint,
      'a text token on the ramp fixed point cannot contrast in both themes'
    ).toEqual([]);
  });
});

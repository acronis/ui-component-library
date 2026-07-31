/**
 * brand-contrast — WCAG contrast over the COMPONENT token tier, for every brand.
 *
 * Run: pnpm --filter @constructor-lab/ui-spec brand-contrast [--all] [--brand <name>]
 *
 * ── WHY THIS EXISTS ALONGSIDE `story-audit` ──────────────────────────────────
 * `story-audit` renders real pages, which makes it the more trustworthy of the
 * two — but it renders ONE brand. The token bundle ships 21, and a brand exists
 * precisely to change colour, so per-brand contrast is the failure mode the
 * single-brand sweep is structurally blind to. Rendering 21 × 1144 pages to find
 * out is not a check anyone would run.
 *
 * This reads the generated CSS instead: no browser, whole matrix, ~1 second.
 *
 * ── THE INFERENCE THIS RESTS ON, AND ITS LIMIT ───────────────────────────────
 * Component tokens are named `--ui-<component>-<variant>-<part>-color-<state>`,
 * so this pairs each `…-container-color-<state>` (the background) with the
 * matching `…-label-color-<state>` and `…-icon-color-<state>` (the foregrounds).
 *
 * **That pairing is a naming convention, not a guarantee.** A component is free
 * to paint a label somewhere other than its own container. So a finding here is
 * a STRONG CANDIDATE, not a confirmed defect — verify in a render before acting.
 * The convention was spot-checked against a real page when this was written:
 * SidebarPrimary's selected label predicted 1.30 under `light-gray` and measured
 * 1.30 in Chromium, and 1.72 predicted/measured under `yellow-1c`.
 *
 * Alpha is composited, not dropped — `rgb(255 255 255 / 0.6)` is 60% white over
 * whatever is behind it, and reading it as opaque white was a real bug in the
 * first version of this check.
 *
 * Disabled states are skipped: WCAG 1.4.3 places no contrast requirement on
 * inactive components.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const CSS_DIR = dirname(require.resolve('@constructor-lab/tokens/css'));

const AA_TEXT = 4.5;
/** WCAG 1.4.11 — non-text (icons, glyphs) needs 3:1, not 4.5:1. */
const AA_NON_TEXT = 3;

type Decls = Map<string, string>;

function parseDecls(block: string): Decls {
  const out: Decls = new Map();
  for (const m of block.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
    out.set(m[1], m[2].trim());
  }
  return out;
}

/** Base (`:root`) declarations, plus per-brand override blocks, across all tiers. */
function loadTokens(): { base: Decls; brands: Map<string, Decls> } {
  const base: Decls = new Map();
  const brands = new Map<string, Decls>();

  const files = [
    'primitives.css',
    'semantics.css',
    ...readdirSync(join(CSS_DIR, 'components')).map((f) => `components/${f}`),
  ];

  for (const file of files) {
    const css = readFileSync(join(CSS_DIR, file), 'utf8');
    for (const [k, v] of parseDecls(css.split('[data-brand=')[0]))
      base.set(k, v);
    for (const m of css.matchAll(
      /\[data-brand='([^']+)'\][^{]*\{(.*?)\n\}/gs
    )) {
      const brand = brands.get(m[1]) ?? new Map();
      for (const [k, v] of parseDecls(m[2])) brand.set(k, v);
      brands.set(m[1], brand);
    }
  }
  return { base, brands };
}

const { base: BASE, brands: BRANDS } = loadTokens();

/** Follow `var()` chains to a literal, picking the requested side of `light-dark()`. */
function resolve(
  name: string,
  brand: string,
  theme: 'light' | 'dark',
  depth = 0
): string | null {
  if (depth > 12) return null;
  const value = BRANDS.get(brand)?.get(name) ?? BASE.get(name);
  if (!value) return null;

  const pair = value.match(/^light-dark\(\s*(.+?)\s*,\s*(.+?)\s*\)$/);
  if (pair) return (theme === 'light' ? pair[1] : pair[2]).trim();

  const ref = value.match(/^var\(--([\w-]+)\)$/);
  if (ref) return resolve(ref[1], brand, theme, depth + 1);

  return value.startsWith('rgb') || value === 'transparent' ? value : null;
}

interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

function parseColor(value: string | null): Rgba | null {
  if (!value || value === 'transparent') return null;
  const n = value.match(/[\d.]+/g);
  if (!n || n.length < 3) return null;
  return {
    r: Number(n[0]),
    g: Number(n[1]),
    b: Number(n[2]),
    a: n.length > 3 ? Number(n[3]) : 1,
  };
}

function luminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const ch = (v: number): number => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

function contrast(
  fgValue: string | null,
  bgValue: string | null
): number | null {
  const fg = parseColor(fgValue);
  const bg = parseColor(bgValue);
  // A translucent BACKGROUND has no determinate colour without knowing the page
  // behind it — skip rather than guess. (A translucent foreground is fine: it
  // composites over the background we do know.)
  if (!fg || !bg || bg.a < 1) return null;

  const composited =
    fg.a < 1
      ? {
          r: fg.r * fg.a + bg.r * (1 - fg.a),
          g: fg.g * fg.a + bg.g * (1 - fg.a),
          b: fg.b * fg.a + bg.b * (1 - fg.a),
        }
      : fg;

  const [hi, lo] = [luminance(composited), luminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

interface Pair {
  fg: string;
  bg: string;
  min: number;
  part: 'label' | 'icon';
}

function componentPairs(): Pair[] {
  const pairs: Pair[] = [];
  for (const name of BASE.keys()) {
    const m = name.match(/^(ui-[\w-]+?)-container-color-(\w+)$/);
    if (!m) continue;
    const [, prefix, state] = m;
    if (state === 'disabled') continue;
    for (const [part, min] of [
      ['label', AA_TEXT],
      ['icon', AA_NON_TEXT],
    ] as const) {
      const fg = `${prefix}-${part}-color-${state}`;
      if (BASE.has(fg)) pairs.push({ fg, bg: name, min, part });
    }
  }
  return pairs;
}

interface Finding {
  brand: string;
  theme: 'light' | 'dark';
  ratio: number;
  pair: Pair;
  fgValue: string;
  bgValue: string;
}

const argv = process.argv.slice(2);
const flag = (n: string): string | undefined => {
  const i = argv.indexOf(`--${n}`);
  return i === -1 ? undefined : argv[i + 1];
};

const pairs = componentPairs();
const only = flag('brand');
const brandList = only ? [only] : ['acronis', ...[...BRANDS.keys()].sort()];

const findings: Finding[] = [];
for (const brand of brandList) {
  for (const pair of pairs) {
    for (const theme of ['light', 'dark'] as const) {
      const fgValue = resolve(pair.fg, brand, theme);
      const bgValue = resolve(pair.bg, brand, theme);
      const ratio = contrast(fgValue, bgValue);
      if (ratio !== null && ratio < pair.min) {
        findings.push({
          brand,
          theme,
          ratio,
          pair,
          fgValue: fgValue!,
          bgValue: bgValue!,
        });
      }
    }
  }
}

const checks = pairs.length * brandList.length * 2;
const byBrand = new Map<string, number>();
for (const f of findings) byBrand.set(f.brand, (byBrand.get(f.brand) ?? 0) + 1);

const combo = (f: Finding): string => `${f.pair.fg}|${f.pair.bg}|${f.theme}`;
const combos = new Map<string, Finding[]>();
for (const f of findings) {
  combos.set(combo(f), [...(combos.get(combo(f)) ?? []), f]);
}

const lines: string[] = [
  'brand-contrast (component tier, WCAG AA)',
  `  ${pairs.length} token pairs × ${brandList.length} brands × 2 themes = ${checks} checks`,
  `  ${findings.length} below threshold · ${combos.size} distinct pairs · ` +
    `${byBrand.size}/${brandList.length} brands affected`,
  '',
  '  NOTE: pairing is inferred from token naming — treat findings as candidates',
  '  and confirm in a render before acting. See the header of this script.',
];

if (findings.length) {
  lines.push('', 'Per brand:');
  for (const [brand, n] of [...byBrand].sort((a, b) => b[1] - a[1])) {
    lines.push(`  ${brand.padEnd(26)} ${String(n).padStart(4)}`);
  }

  lines.push('', 'Distinct pairs, worst first:');
  const worst = [...combos.values()].sort(
    (a, b) =>
      Math.min(...a.map((f) => f.ratio)) - Math.min(...b.map((f) => f.ratio))
  );
  const shown = argv.includes('--all') ? worst : worst.slice(0, 15);
  for (const group of shown) {
    const f = group.reduce((a, b) => (a.ratio <= b.ratio ? a : b));
    lines.push(
      `  ${f.ratio.toFixed(2).padStart(5)} [${f.theme.padEnd(5)}] ` +
        `${f.pair.fg.replace('ui-', '')}` +
        `\n        on ${f.pair.bg.replace('ui-', '')}` +
        `  — ${group.length} brand(s), worst ${f.brand} (${f.fgValue} on ${f.bgValue})`
    );
  }
  if (shown.length < worst.length) {
    // No silent truncation — say what was withheld and how to see it.
    lines.push(
      `  … ${worst.length - shown.length} more distinct pair(s); pass --all to list them.`
    );
  }
}

process.stdout.write(`${lines.join('\n')}\n`);
process.exit(findings.length > 0 ? 1 : 0);

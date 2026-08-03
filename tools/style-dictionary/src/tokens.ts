// The token build domain: the two Style Dictionary stages that turn
// @constructor-lab/tokens into the published `@constructor-lab/tokens`
// CSS. `index.ts` (the CLI) dispatches here; the SD hooks these stages share live
// in `hooks/`.
//
//   1. buildDtcg (`<filter>-dtcg`) — read the UI Components library token files and emit six
//      per-mode, 100%-DTCG JSON files into `tokens/dtcg/`. Serialized from
//      `normalizeTree` directly, NOT via an SD format: SD's init normalization
//      relocates `$type`, which would break the intermediate's "every token
//      self-describing, references intact" contract. See context/pipeline.md.
//   2. buildCss (`<filter>-css`) — resolve those views per brand, then emit
//      tier-partitioned CSS into the package: the semantic tier at the root
//      (`<brand>.css`), each component tier in its own dir
//      (`<component>/<brand>.css`). The default brand (acronis) gets full files;
//      every other brand gets override-only files diffed against the default.

import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import StyleDictionary from 'style-dictionary';
import type { Config, TransformedToken } from 'style-dictionary/types';

import { emitTailwindTheme } from './bridge/tailwind-theme';
import { STATIC_HOOKS } from './hooks';
import { isPrimitiveToken } from './hooks/primitive-roots';
import {
  type BrandOverride,
  collectDecls,
  type Decls,
  serializeSlice,
  isEmptySlice,
  type StyleModel,
  type WriteFile,
} from './hooks/formats/css-light-dark';
import { normalizeTree } from './hooks/preprocessors/acronis-dtcg';
import { ACRONIS_CSS_GROUP } from './hooks/transforms';
import { emitJs } from './js';
import {
  componentCssFile,
  cssDir,
  dtcgDir,
  FILTER_ENUM,
  type Filter,
  indexCssFile,
  jsDir,
  type PlatformKey,
  primitivesCssFile,
  rel,
  scssDir,
  semanticsCssFile,
  tiersDir,
} from './platforms';
import { emitScss } from './scss';

// ── Sources ──────────────────────────────────────────────────────────────────

/** A raw token tree (a DTCG-shaped JSON object). */
type TokenTree = Record<string, unknown>;

/**
 * The source token files, read from `tokens/tiers/` by relative path.
 *
 * `charts` is a repo-authored tier (theme-invariant chart palette), not a Figma
 * re-emit target — it has no emitter, so the Figma sync pipeline can never
 * overwrite it. It carries the Brand/Theme axes trivially (single `$value` per
 * token), so it is neither a `BRAND_TIERS` member nor a primitive root; it emits
 * its own `components/chart.css` slice via `sliceOf`.
 */
const TOKEN_SOURCES = {
  primitives: 'primitives.json',
  semantics: 'semantics.json',
  components: 'components.json',
  charts: 'charts.json',
} as const;

type TokenSourceName = keyof typeof TOKEN_SOURCES;

/** Read and parse one source token file by name. */
function readTokenSource(name: TokenSourceName): TokenTree {
  const file = path.join(tiersDir(), TOKEN_SOURCES[name]);
  return JSON.parse(readFileSync(file, 'utf8')) as TokenTree;
}

/**
 * The semantic-tier roots — the non-`$` top-level keys of `semantics.json`
 * (`colors`, `gradients`, `typography`). Derived from the data so a new semantic
 * root needs no code change. A token whose first path segment is in this set
 * belongs to the semantics tier (one root CSS file / the base Tailwind preset);
 * everything else is a component tier (its own dir / preset). Shared by the css
 * and tailwind builds so the two partitions can't drift.
 */
export function semanticRoots(): Set<string> {
  return new Set(
    Object.keys(readTokenSource('semantics')).filter(
      (key) => !key.startsWith('$')
    )
  );
}

/**
 * The role → Tailwind-namespace routing map, read from the source tiers'
 * root-level `com.acronis.tailwindRoles` extension (a build-time hint, not token
 * data). Keyed by a path segment (a semantic role like `background`, a component
 * part like `container`, or the `gradients` root); the value is the Tailwind
 * theme namespace the build routes that token into.
 *
 * Tier-scoped: pass `['semantics']` for the map a *semantic* token routes against
 * and the default (both tiers) for the map a *component* token routes against.
 * The split lets a component element reuse a name that exists as a *semantic token
 * segment* (e.g. the input `error` message vs the semantic `error` focus variant)
 * without the component entry shadowing semantic routing — semantic tokens never
 * see the component entries. Later tiers win on key conflicts within a single map.
 */
export function tailwindRoleMap(
  tiers: readonly TokenSourceName[] = ['semantics', 'components']
): Map<string, string> {
  const map = new Map<string, string>();
  for (const tier of tiers) {
    const ext = readTokenSource(tier)['$extensions'] as
      Record<string, Record<string, string>> | undefined;
    const roles = ext?.['com.acronis.tailwindRoles'];
    if (roles)
      for (const [segment, namespace] of Object.entries(roles))
        map.set(segment, namespace);
  }
  return map;
}

// ── Shared design data ─────────────────────────────────────────────────────────

/** The brand emitted in full; every other brand is a diff against it. */
export const DEFAULT_BRAND = 'default';

/**
 * Stage-1 outputs. `primitives` carries the Theme axis (light/dark); `semantic`
 * and `components` carry the Brand axis (acronis/brand-b). `mode` is the key to
 * pick out of each token's `values` dict; single-value tokens (units, font,
 * typography composites) are mode-invariant and emitted into every view of their
 * source file unchanged.
 */
interface DtcgView {
  out: string;
  source: TokenSourceName;
  mode: string;
}

/**
 * Tiers whose tokens carry the Brand axis — their `values` dicts are keyed by
 * brand. (The primitives tier is keyed by theme: light/dark, not by brand.)
 */
const BRAND_TIERS: TokenSourceName[] = ['semantics', 'components'];

/** Collect the key set of every `values` dict in a token tree. */
export function collectValueKeys(node: unknown, into: Set<string>): void {
  if (!node || typeof node !== 'object') return;
  const obj = node as Record<string, unknown>;
  const values = obj['values'];
  if (values && typeof values === 'object' && !Array.isArray(values)) {
    for (const key of Object.keys(values)) into.add(key);
    return; // token leaf — do not descend into the resolved values
  }
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$')) continue;
    collectValueKeys(v, into);
  }
}

/**
 * Discover the brand set from the token data — the union of `values` keys across
 * the brand-bearing tiers (semantic + components). `DEFAULT_BRAND` is emitted in
 * full and listed first; the rest are alphabetical. The brand set is
 * data-driven: adding a brand mode in `@constructor-lab/tokens` adds a
 * brand here (and a generated `<brand>.css`) with **no code change**.
 */
export function discoverBrands(): string[] {
  const keys = new Set<string>();
  for (const tier of BRAND_TIERS) collectValueKeys(readTokenSource(tier), keys);
  if (!keys.has(DEFAULT_BRAND)) {
    throw new Error(
      `Default brand "${DEFAULT_BRAND}" has no token values in ${BRAND_TIERS.join(' / ')}`
    );
  }
  return [
    DEFAULT_BRAND,
    ...[...keys].filter((b) => b !== DEFAULT_BRAND).sort(),
  ];
}

/** The discovered brand set (data-driven). */
export const BRAND_NAMES: readonly string[] = discoverBrands();

const VIEWS: DtcgView[] = [
  { out: 'primitives-light', source: 'primitives', mode: 'light' },
  { out: 'primitives-dark', source: 'primitives', mode: 'dark' },
  // The chart palette is mode-invariant (single `$value`), so `mode` is ignored
  // by `normalizeTree` — one view feeds every brand/theme merge unchanged.
  { out: 'charts', source: 'charts', mode: 'default' },
  ...BRAND_NAMES.flatMap((brand): DtcgView[] => [
    { out: `semantics-${brand}`, source: 'semantics', mode: brand },
    { out: `components-${brand}`, source: 'components', mode: brand },
  ]),
];

/**
 * Stage-2 brands. Each brand resolves its semantic + component view against both
 * theme views of the primitives, zipping colors into `light-dark()`. Derived
 * from the discovered brand set, so the list is data-driven.
 */
export interface Brand {
  name: string;
  semantics: string;
  components: string;
}

export const BRANDS: Brand[] = BRAND_NAMES.map((name) => ({
  name,
  semantics: `semantics-${name}`,
  components: `components-${name}`,
}));

export type Theme = 'light' | 'dark';

// ── Style Dictionary factory ─────────────────────────────────────────────────
// Every instance shares this tool's static hooks (transforms, transform group,
// filter). Stage 2 (css) uses SD only to resolve aliases + run the transforms;
// emission is driven directly from the resolved tokens. Stage 1 (dtcg) writes
// normalized trees directly (see file header).

const makeSd = (config: Config): StyleDictionary =>
  new StyleDictionary({
    usesDtcg: true,
    log: { verbosity: 'silent', warnings: 'disabled' },
    hooks: STATIC_HOOKS,
    ...config,
  });

// Recursively sort object keys alphabetically (ASCII code-unit order), with
// all-numeric keys ordered numerically so "8" precedes "12". Arrays keep their
// order. Mirrors the tiers' ordering rule so the emitted DTCG is alphabetical too.
const sortKeysDeep = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value === null || typeof value !== 'object') return value;
  const entries = Object.keys(value as Record<string, unknown>).sort((a, b) => {
    const na = /^\d+$/.test(a);
    const nb = /^\d+$/.test(b);
    if (na && nb) return Number(a) - Number(b);
    return a < b ? -1 : a > b ? 1 : 0;
  });
  const out: Record<string, unknown> = {};
  for (const k of entries)
    out[k] = sortKeysDeep((value as Record<string, unknown>)[k]);
  return out;
};

// ── Stage 1: dtcg ──────────────────────────────────────────────────────────────

export function buildDtcg(filter: Filter): void {
  const outDir = dtcgDir();
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  // Each source feeds several views (primitives → light + dark, etc.), so read
  // each file once up front rather than re-reading it per view.
  const sources = {} as Record<TokenSourceName, TokenTree>;
  for (const name of Object.keys(TOKEN_SOURCES) as TokenSourceName[]) {
    sources[name] = readTokenSource(name);
  }

  for (const view of VIEWS) {
    const isBrandTier = (BRAND_TIERS as readonly string[]).includes(
      view.source
    );
    const tree = normalizeTree(
      sources[view.source],
      view.mode,
      FILTER_ENUM[filter],
      isBrandTier ? DEFAULT_BRAND : undefined
    );
    const dest = path.join(outDir, `${view.out}.json`);
    writeFileSync(dest, `${JSON.stringify(sortKeysDeep(tree), null, 2)}\n`);
    console.log(`✓ ${rel(dest)}`);
  }
}

// ── Stage 2: css / scss / js ─────────────────────────────────────────────────

const readView = (name: string): Config['tokens'] =>
  JSON.parse(readFileSync(path.join(dtcgDir(), `${name}.json`), 'utf8'));

/** Merge a brand's semantic + component views with one theme of the primitives. */
const mergeViews = (brand: Brand, theme: Theme): Config['tokens'] => ({
  ...readView(`primitives-${theme}`),
  ...readView('charts'),
  ...readView(brand.semantics),
  ...readView(brand.components),
});

const cssConfig = (filter: Filter, brand: Brand, theme: Theme): Config => {
  const key: PlatformKey = `${filter}-css`;
  return {
    tokens: mergeViews(brand, theme),
    platforms: { [key]: { transformGroup: ACRONIS_CSS_GROUP } },
  };
};

/**
 * Resolve a brand+theme to ALL transformed tokens (primitives included — they are
 * now emitted as the theme layer, and their names are needed to resolve `{alias}`
 * references into `var()`).
 */
export async function resolveAllTokens(
  filter: Filter,
  brand: Brand,
  theme: Theme
): Promise<TransformedToken[]> {
  const sd = makeSd(cssConfig(filter, brand, theme));
  const { allTokens } = await sd.getPlatformTokens(`${filter}-css`);
  return allTokens;
}

/** path (`a.b.c`) → resolved color value, across every color token of a resolve. */
const colorMap = (tokens: TransformedToken[]): Map<string, string> =>
  new Map(
    tokens
      .filter((t) => t.$type === 'color' && typeof t.$value === 'string')
      .map((t) => [t.path.join('.'), t.$value as string])
  );

// Slice routing: `primitives` (the raw value / theme layer), `semantics` (the
// shared vocabulary root file), or a component name (its own file). Semantic roots
// are data-driven (see `semanticRoots`), so a new root needs no edit.
const SEMANTIC_ROOTS = semanticRoots();
const sliceOf = (token: TransformedToken): string => {
  if (isPrimitiveToken(token)) return 'primitives';
  return SEMANTIC_ROOTS.has(token.path[0]) ? 'semantics' : token.path[0];
};

/** Override-only maps: entries that differ from (or are absent in) the base. */
export function diffDecls(
  base: Decls,
  brand: Decls
): Pick<Decls, 'vars' | 'classes'> {
  const vars = new Map<string, string>();
  for (const [name, value] of brand.vars)
    if (base.vars.get(name) !== value) vars.set(name, value);
  const classes = new Map<string, string>();
  for (const [selector, block] of brand.classes)
    if (base.classes.get(selector) !== block) classes.set(selector, block);
  return { vars, classes };
}

const emptyDecls = (): Decls => ({
  vars: new Map(),
  classes: new Map(),
  skipped: [],
});

/** Resolve all brands into the reference-based style model. */
async function buildModel(filter: Filter): Promise<StyleModel> {
  const base = BRANDS.find((b) => b.name === DEFAULT_BRAND);
  if (!base)
    throw new Error(`Default brand "${DEFAULT_BRAND}" is not in the brand set`);

  // Names + the primitive theme layer come from the default brand (names are
  // brand/theme-invariant; the palette is brand-invariant, theme-keyed).
  const baseLight = await resolveAllTokens(filter, base, 'light');
  const baseDark = await resolveAllTokens(filter, base, 'dark');
  const pathToName = new Map(baseLight.map((t) => [t.path.join('.'), t.name]));
  const darkColors = colorMap(baseDark);
  const collectOpts = { pathToName, darkColors };

  const primitives = collectDecls(baseLight.filter(isPrimitiveToken), {
    ...collectOpts,
    themeLayer: true,
  });

  // Per brand: collect the non-primitive decls, partitioned by slice.
  const perBrand = new Map<string, Map<string, Decls>>();
  for (const brand of BRANDS) {
    const tokens =
      brand.name === DEFAULT_BRAND
        ? baseLight
        : await resolveAllTokens(filter, brand, 'light');
    const bySlice = new Map<string, TransformedToken[]>();
    for (const token of tokens) {
      if (isPrimitiveToken(token)) continue;
      const slice = sliceOf(token);
      const bucket = bySlice.get(slice);
      if (bucket) bucket.push(token);
      else bySlice.set(slice, [token]);
    }
    const decls = new Map<string, Decls>();
    for (const [slice, toks] of bySlice)
      decls.set(
        slice,
        collectDecls(toks, { ...collectOpts, themeLayer: false })
      );
    perBrand.set(brand.name, decls);
  }

  // Surface unrepresentable tokens (e.g. a malformed typography value in the
  // source tiers) so a data defect isn't silently dropped from the output.
  const skipped = [
    ...primitives.skipped,
    ...[...perBrand.entries()].flatMap(([brand, byslice]) =>
      [...byslice.values()].flatMap((d) =>
        d.skipped.map((s) => `${brand}: ${s}`)
      )
    ),
  ];
  if (skipped.length) {
    console.warn(
      `⚠ ${skipped.length} token(s) skipped as unrepresentable (check the source tiers):\n  ` +
        skipped.join('\n  ')
    );
  }

  const baseDecls = perBrand.get(DEFAULT_BRAND) ?? new Map<string, Decls>();
  const nonDefault = BRANDS.filter((b) => b.name !== DEFAULT_BRAND);

  const slices = [...baseDecls.keys()].sort().map((tier) => {
    const sliceBase = baseDecls.get(tier) ?? emptyDecls();
    const overrides: BrandOverride[] = nonDefault.map((brand) => {
      const d = perBrand.get(brand.name)?.get(tier) ?? emptyDecls();
      const { vars, classes } = diffDecls(sliceBase, d);
      return { brand: brand.name, vars, classes };
    });
    return { tier, base: sliceBase, overrides };
  });

  return { primitives, slices };
}

/** Remove the generated style trees (`css/`, `scss/`, `js/`) before a rebuild. */
function cleanStyleOutputs(): void {
  for (const dir of [cssDir(), scssDir(), jsDir()])
    rmSync(dir, { recursive: true, force: true });
}

export async function buildCss(filter: Filter): Promise<void> {
  cleanStyleOutputs();
  const model = await buildModel(filter);

  const write: WriteFile = (dest, content) => {
    mkdirSync(path.dirname(dest), { recursive: true });
    writeFileSync(dest, content);
    console.log(`✓ ${rel(dest)}`);
  };

  // primitives.css — the theme layer (raw values + light-dark()).
  write(
    primitivesCssFile(),
    serializeSlice({
      tier: 'primitives',
      themeLayer: true,
      base: model.primitives,
      overrides: [],
    })
  );

  // semantics.css + one file per component (all brands inside via selectors).
  const componentTiers: string[] = [];
  for (const { tier, base, overrides } of model.slices) {
    // A tier with nothing renderable produces an empty `:root, :host {}` and an
    // `@import` of it — valid CSS that states nothing, and a standing puzzle for
    // the next reader ("why is this file empty?"). Skip the file and its import;
    // the emit's skipped-token report is where the reason belongs. Semantics is
    // never skipped: it is a fixed part of the manifest.
    if (tier !== 'semantics' && isEmptySlice({ base, overrides })) {
      console.log(`· skipped ${tier} (no renderable tokens)`);
      continue;
    }
    if (tier !== 'semantics') componentTiers.push(tier);
    write(
      tier === 'semantics' ? semanticsCssFile() : componentCssFile(tier),
      serializeSlice({ tier, themeLayer: false, base, overrides })
    );
  }

  // index.css — the single-import manifest.
  const imports = [
    `@import './primitives.css';`,
    `@import './semantics.css';`,
    ...componentTiers.sort().map((c) => `@import './components/${c}.css';`),
  ];
  write(
    indexCssFile(),
    `/* Generated by @constructor-lab/style-dictionary — DO NOT EDIT. */\n` +
      `/* The whole token kit in one import: primitives + semantics + components. */\n\n` +
      `${imports.join('\n')}\n`
  );

  // The Tailwind v4 @theme inline bridge (shadcn-compatible color names).
  emitTailwindTheme(model, write);

  // SCSS mirror + JS token map (same model, no re-resolve).
  emitScss(model, write);
  emitJs(model, write);
}

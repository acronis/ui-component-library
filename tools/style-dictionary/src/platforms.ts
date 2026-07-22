// Shared platform-key model + output locations — the axes the CLI and the token
// build domain agree on, owned by neither (so the domain doesn't have to import
// the CLI). A build target is `${filter}-${output}`: `filter` maps to the
// `platforms` enum (PD | WEB) the tokens declare; `output` is the artifact kind.
// The token outputs (dtcg, css, tailwind) land inside the published
// `@constructor-lab/tokens` package.

import path from 'node:path';
import { fileURLToPath } from 'node:url';

export type Filter = 'pd' | 'web';
// The `css` output emits the whole stylesheet family from one resolve: the
// `css/` bundle (primitives + semantics + per-component + index), the SCSS
// mirror (`scss/`), the JS token map (`js/`), and the Tailwind `@theme inline`
// bridge (`css/tailwind-theme.css`). They share the expensive SD resolve, so
// they are one output, not four.
export type Output = 'dtcg' | 'css';
export type PlatformKey = `${Filter}-${Output}`;

/** Filter slug → the `platforms` enum value kept by normalization. */
export const FILTER_ENUM: Record<Filter, 'PD' | 'WEB'> = {
  pd: 'PD',
  web: 'WEB',
};

/** Token filters that have source data today. WEB lands here when it exists. */
export const FILTERS: Filter[] = ['pd'];

export const OUTPUTS: Output[] = ['dtcg', 'css'];

/**
 * Which filters have source data for a given output. `dtcg`/`css` come from the
 * token package (PD today).
 */
export const filtersFor = (_output: Output): Filter[] => FILTERS;

/** Every valid `--filter` value. */
export const ALL_FILTERS: Filter[] = [...FILTERS];

/** Tool root (`tools/style-dictionary/`). */
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * The published token package the token builds write into: `packages/tokens/`.
 * Its generated contents (`css/`, `scss/`, `js/`, `dtcg/`) are committed.
 */
export const TOKENS_PKG = path.resolve(ROOT, '..', '..', 'packages', 'tokens');

/**
 * The DTCG source tiers this tool reads. Addressed by relative path (not the
 * `@constructor-lab/tokens` package specifier) so this tool does NOT declare a build
 * dependency on the package it writes into — that edge would form a cycle with
 * `tokens`' own `build` (which invokes this tool), and pnpm resolves a cycle by
 * running both concurrently, racing on the shared `tokens/{dtcg,css}` writes.
 */
export const tiersDir = (): string => path.join(TOKENS_PKG, 'tiers');

/** The DTCG intermediate ships under `tokens/dtcg/`. */
export const dtcgDir = (): string => path.join(TOKENS_PKG, 'dtcg');

/** All CSS lives under `tokens/css/`. Brands live inside via `[data-brand]`. */
export const cssDir = (): string => path.join(TOKENS_PKG, 'css');

/** The theme layer (raw palette values + `light-dark()`): `css/primitives.css`. */
export const primitivesCssFile = (): string =>
  path.join(cssDir(), 'primitives.css');

/** Semantic tier (`var()` refs onto primitives): `css/semantics.css`. */
export const semanticsCssFile = (): string =>
  path.join(cssDir(), 'semantics.css');

/** Per-component tier CSS: `css/components/<component>.css` (all brands via selectors). */
export const componentsCssDir = (): string => path.join(cssDir(), 'components');
export const componentCssFile = (component: string): string =>
  path.join(componentsCssDir(), `${component}.css`);

/** The single-import manifest that `@import`s every css partition: `css/index.css`. */
export const indexCssFile = (): string => path.join(cssDir(), 'index.css');

/** The generated Tailwind v4 `@theme inline` bridge: `css/tailwind-theme.css`. */
export const tailwindThemeCssFile = (): string =>
  path.join(cssDir(), 'tailwind-theme.css');

/** SCSS mirror of the token vars + reusable mixins under `tokens/scss/`. */
export const scssDir = (): string => path.join(TOKENS_PKG, 'scss');
export const scssTokensFile = (): string =>
  path.join(scssDir(), '_tokens.scss');
export const scssMixinsFile = (): string =>
  path.join(scssDir(), '_mixins.scss');

/** JS token map (name → CSS value/ref) under `tokens/js/`. */
export const jsDir = (): string => path.join(TOKENS_PKG, 'js');
export const jsTokensFile = (): string => path.join(jsDir(), 'tokens.js');
export const jsTokensDtsFile = (): string => path.join(jsDir(), 'tokens.d.ts');

/** Path relative to CWD, for log lines. */
export const rel = (p: string): string => path.relative(process.cwd(), p);

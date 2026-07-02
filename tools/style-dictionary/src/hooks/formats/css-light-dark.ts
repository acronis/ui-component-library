// CSS rendering for the token build. The model is reference-based:
//
//   - `primitives` slice (palette / units / font) is the raw value layer and the
//     ONLY place `light-dark()` appears — a color's light value is zipped with its
//     dark value (from `darkColors`, keyed by token path) into `light-dark(l, d)`.
//   - `semantics` + component slices emit `var(--<referenced>)` whenever a token's
//     original value is a single `{alias}` — the primitive/semantic it points at
//     owns the concrete value (and, transitively, light/dark). Only non-aliased
//     literals (e.g. a brand's raw color) emit a concrete value; those are
//     theme-invariant (the theme axis lives solely in the primitive layer).
//   - typography composites → utility classes (`.ui-typography-* { … }`).
//
// Brand is a selector, not a file: the default brand renders under `:root, :host`;
// every other brand renders its diff under `[data-brand='<brand>']`. `collectDecls`
// turns a resolved token slice into name→value / selector→block maps;
// `serializeSlice` renders one slice file (base + brand overrides) from them.

import type { TransformedToken } from 'style-dictionary/types';

export const CSS_LIGHT_DARK = 'css/light-dark';

/** Resolved declarations of one token slice, keyed for rendering and diffing. */
export interface Decls {
  /** CSS var name → value (`var(--ref)`, a literal, or a `light-dark()` pair). */
  vars: Map<string, string>;
  /** Class selector → declaration block (typography utilities). */
  classes: Map<string, string>;
  /** Tokens that could not be represented, for the build log. */
  skipped: string[];
}

/** A single full `{group.token}` alias → the referenced path; else null. */
const FULL_ALIAS = /^\{([^{}]+)\}$/;
export function aliasTarget(original: unknown): string | null {
  if (typeof original !== 'string') return null;
  const match = original.match(FULL_ALIAS);
  return match ? match[1] : null;
}

export interface CollectOptions {
  /** token path (`a.b.c`) → its `--ui-*` name, for resolving `{alias}` → `var()`. */
  pathToName: Map<string, string>;
  /** token path → resolved dark-mode color value (used only for the theme layer). */
  darkColors: Map<string, string>;
  /** The primitive theme layer: colors emit `light-dark()` instead of `var()`/literal. */
  themeLayer: boolean;
}

/**
 * Collect a resolved token slice into declaration maps. A token whose *original*
 * value is a single alias emits `var(--<referenced-name>)`; a color in the theme
 * layer emits `light-dark(light, dark)`; everything else emits its resolved
 * literal.
 */
export function collectDecls(
  tokens: TransformedToken[],
  opts: CollectOptions
): Decls {
  const { pathToName, darkColors, themeLayer } = opts;
  const vars = new Map<string, string>();
  const classes = new Map<string, string>();
  const skipped: string[] = [];

  for (const token of tokens) {
    if (token.$type === 'typography') {
      // `typography/css-class` transformed the composite into a declaration block
      // (`property: value;` lines). Only emit a class when the value actually is
      // such a block — a typography token whose source value is malformed (e.g. a
      // stray non-composite string that never hit the transform) must NOT become
      // `.class { garbage }`, which is invalid CSS. Skip it so the element falls
      // back to the base (default-brand) typography instead.
      if (typeof token.$value === 'string' && token.$value.includes(':')) {
        classes.set(`.${token.name}`, token.$value);
      } else {
        skipped.push(`${token.name} (typography — no declarations)`);
      }
      continue;
    }

    // Preserve the alias chain: a single `{alias}` becomes a `var()` reference to
    // the token it points at, so a value is stated once (at the layer that owns it).
    const ref = aliasTarget(token.original?.$value);
    const refName = ref ? pathToName.get(ref) : undefined;
    if (refName) {
      vars.set(token.name, `var(--${refName})`);
      continue;
    }

    if (token.$type === 'color') {
      const light = typeof token.$value === 'string' ? token.$value : null;
      if (light === null) {
        skipped.push(`${token.name} (color)`);
        continue;
      }
      if (themeLayer) {
        const dark = darkColors.get(token.path.join('.')) ?? light;
        vars.set(token.name, `light-dark(${light}, ${dark})`);
      } else {
        // A non-aliased brand color is theme-invariant (the theme axis lives in
        // the primitive layer), so it emits its concrete value directly.
        vars.set(token.name, light);
      }
      continue;
    }

    if (typeof token.$value === 'string') {
      // dimension / scalar / gradient literal — already CSS-ready, theme-invariant.
      vars.set(token.name, token.$value);
    } else {
      skipped.push(`${token.name} (${token.$type})`);
    }
  }

  return { vars, classes, skipped };
}

const indent = (block: string): string =>
  block
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n');

const varLines = (vars: Map<string, string>): string =>
  [...vars.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => `  --${name}: ${value};`)
    .join('\n');

/** Overrides for one non-default brand (already diffed against the base). */
export interface BrandOverride {
  brand: string;
  vars: Map<string, string>;
  classes: Map<string, string>;
}

export interface SliceRender {
  /** `primitives` | `semantics` | a component name — recorded in the header. */
  tier: string;
  /** Only the primitive slice carries the `color-scheme` + `[data-theme]` shell. */
  themeLayer: boolean;
  /** Default-brand declarations (rendered under `:root, :host`). */
  base: Pick<Decls, 'vars' | 'classes'>;
  /** Non-default brands, rendered under `[data-brand='<brand>']`. */
  overrides: BrandOverride[];
}

/** The in-memory result of resolving every brand — consumed by css/scss/js emitters. */
export interface StyleModel {
  /** The theme layer (palette/units/font) — brand-invariant, owns `light-dark()`. */
  primitives: Decls;
  /** Non-primitive slices, each with default-brand base + per-brand overrides. */
  slices: { tier: string; base: Decls; overrides: BrandOverride[] }[];
}

/** A writer that ensures the parent dir exists and logs the relative path. */
export type WriteFile = (dest: string, content: string) => void;

const brandSelector = (brand: string): string =>
  `[data-brand='${brand}'], :host([data-brand='${brand}'])`;

/** Render one slice's CSS file: base under `:root`, each brand under `[data-brand]`. */
export function serializeSlice({
  tier,
  themeLayer,
  base,
  overrides,
}: SliceRender): string {
  const header =
    `/* Generated by @spec-lab/style-dictionary — DO NOT EDIT. */\n` +
    `/* Source: @spec-lab/tokens • tier: ${tier} */\n`;

  const baseVars = varLines(base.vars);
  const root = themeLayer
    ? `:root, :host {\n  color-scheme: light dark;\n\n${baseVars}\n}\n\n` +
      `[data-theme='light'], :host([data-theme='light']) {\n  color-scheme: light;\n}\n\n` +
      `[data-theme='dark'], :host([data-theme='dark']) {\n  color-scheme: dark;\n}`
    : `:root, :host {\n${baseVars}\n}`;

  const classBlock = (
    selectorPrefix: string,
    classes: Map<string, string>
  ): string =>
    [...classes.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([selector, block]) =>
          `${selectorPrefix}${selector} {\n${indent(block)}\n}`
      )
      .join('\n\n');

  const baseClasses = classBlock('', base.classes);

  const overrideBlocks = overrides
    .filter((o) => o.vars.size > 0 || o.classes.size > 0)
    .map((o) => {
      const blocks: string[] = [];
      if (o.vars.size > 0)
        blocks.push(`${brandSelector(o.brand)} {\n${varLines(o.vars)}\n}`);
      if (o.classes.size > 0)
        blocks.push(classBlock(`[data-brand='${o.brand}'] `, o.classes));
      return blocks.join('\n\n');
    });

  return `${header}\n${[root, baseClasses, ...overrideBlocks].filter(Boolean).join('\n\n')}\n`;
}

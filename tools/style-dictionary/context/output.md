# Output — the CSS / SCSS / JS contract

The token build writes into the published `packages/tokens/` package (committed,
not gitignored), grouped into `css/`, `scss/`, `js/`, and `dtcg/` dirs. The model
is **reference-based**: a value is stated once, at the layer that owns it, and
everything downstream is a `var(--…)` reference.

## CSS layout (`tokens/css/`)

- `primitives.css` — the **raw value / theme layer**. `--ui-palette-*`,
  `--ui-units-*`, `--ui-font-*`. The **only** place `light-dark()` appears (colors
  carry both modes here) and the only place concrete color literals live.
- `semantics.css` — the semantic tier (`--ui-background-*`, `--ui-text-*`,
  `--ui-border-*`, `--ui-glyph-*`, `--ui-focus-*`, `--ui-gradients-*`) + the
  `.ui-typography-*` classes. Each color/dimension token is a `var(--…)`
  reference onto a primitive.
- `components/<component>.css` — one file per component tier (`Button.css`, …),
  each token a `var(--…)` reference onto a semantic or primitive.
- `index.css` — the single-import manifest that `@import`s the three above
  (consumed as `@constructor-lab/tokens/css`).
- `tailwind-theme.css` — the generated Tailwind v4 `@theme inline` bridge (below).

Tokens partition into files by `token.path[0]`: the primitive roots (`palette`,
`units`, `font`) → `primitives`; the semantic-tier roots (`colors`, `gradients`,
`typography`, **data-driven** from `semantics.json` via `semanticRoots()`) →
`semantics`; every other root → its own component file.

## Theming — one bundle, two selector axes

Both axes live in the one bundle; there are no per-brand files and no runtime
stylesheet injection.

- **Light/dark** is owned by `primitives.css` via `light-dark()` + `color-scheme`
  (baseline-supported: Chrome 123+, Safari 17.5+, Firefox 120+). Everything else
  references a primitive, so it inherits the theme transitively. Set `[data-theme]`
  on an ancestor to force a mode; unset follows the OS preference.

  ```css
  :root,
  :host {
    color-scheme: light dark;
    --ui-palette-blue-13: light-dark(rgb(0 32 77), rgb(12 12 14));
  }
  [data-theme='light'],
  :host([data-theme='light']) {
    color-scheme: light;
  }
  [data-theme='dark'],
  :host([data-theme='dark']) {
    color-scheme: dark;
  }
  ```

- **Brand** is a **selector**, not a file. The default brand (`default`) renders
  under `:root, :host`; every other brand renders its **diff** under
  `[data-brand='<brand>'], :host([data-brand='<brand>'])`. Set `[data-brand]` on an
  ancestor to switch. A brand override block contains a declaration only when its
  value **differs** from the default (or is new in that brand).

  ```css
  /* semantics.css */
  :root,
  :host {
    --ui-background-brand-primary: var(--ui-palette-blue-13);
  }
  [data-brand='deep-sky-itkontoret'],
  :host([data-brand='deep-sky-itkontoret']) {
    --ui-background-brand-primary: var(--ui-palette-teal-9);
  }
  ```

## Variable & class names — `--ui-*`

The `name/ui` transform drops a leading `colors` tier segment and prefixes every
token with `ui`:

- `colors.background.surface.primary` → `--ui-background-surface-primary`
- `palette.blue.13` → `--ui-palette-blue-13`
- `button._global.radius` → `--ui-button-global-radius` (leading `_` dropped)
- typography composites become a class → `.ui-typography-body-default`

## Value formats

| Token `$type` | Output                                                                                                                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| alias (any)   | `var(--<referenced-name>)` — a single `{group.token}` original value becomes a reference (the chain is preserved)                                                                                             |
| `color`       | primitive: `light-dark(<rgb>, <rgb>)`; non-aliased brand color: a concrete `rgb(r g b[ / a])` (theme-invariant)                                                                                               |
| `gradient`    | `linear-gradient(<deg>, <rgb> <pos>%, …)` (theme-invariant; angle from the Figma transform)                                                                                                                   |
| `dimension`   | `<value><unit>` (e.g. `4px`) when a primitive/literal, else a `var(--…)` reference                                                                                                                            |
| `typography`  | a `.ui-typography-…` class: `font-family`, `font-size` (px), `font-weight`, `line-height` (px), `letter-spacing` (px). A malformed (non-declaration) value is **skipped** (never emitted as an invalid rule). |

## Gradients

Gradient tokens live under the top-level `gradients.*` root of `semantics.json`
(a semantic root, emitted as `--ui-gradients-*` in `semantics.css`). They are
rendered by the `gradient/css` transform (`hooks/transforms/gradient-css.ts`): the
`$value` is a DTCG array of `{ color, position }` stops, the matrix is under
`$extensions.com.figma.gradientTransform`, mapped to a CSS angle via `atan2(a, -c)`.

## SCSS (`tokens/scss/`)

- `_tokens.scss` — `@mixin ui-tokens { … }` wrapping the full CSS layer (the same
  rules as the css bundle).
- `_mixins.scss` — forwards it and exposes `@mixin ui-theme` for a plain
  `@include tokens.ui-theme;`.

## JS (`tokens/js/`)

`tokens.js` (+ `.d.ts`) — a map of every `--ui-*` name → its `var(--…)` reference,
for CSS-in-JS / inline styles. Values are references (not resolved colors), so
brand/theme overrides still resolve at paint.

## Tailwind bridge (`tokens/css/tailwind-theme.css`)

The generated `@theme inline` block mapping shadcn-compatible color names
(`--color-primary`, `--color-muted-foreground`, …) onto `--ui-*` semantic tokens.
`inline` emits `var(--ui-*)` references (not baked values), so brand/theme
overrides resolve at paint. The mapping is a curated table in
`bridge/tailwind-theme.ts` (the shadcn names are a deliberate contract, not a 1:1
of token roles). ui-react `@import`s this after the token css instead of
hand-maintaining the block. (The former per-brand/per-component **baked** Tailwind
presets are removed — nothing consumed them.)

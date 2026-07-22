# AGENTS.md — `tools/style-dictionary`

`@constructor-lab/style-dictionary` — a **private** (unpublished) build tool: a
[Style Dictionary v5](https://styledictionary.com/) translation pipeline that
builds the DTCG source tiers of `@constructor-lab/tokens` into that same package's
generated, committed output — **reference-based CSS** (primitives + semantics +
per-component, brand + light/dark via selectors), a **SCSS** mirror, a **JS**
token map, the Tailwind `@theme inline` bridge, and a DTCG intermediate. This is
the first inhabitant of the repo's `tools/` tier (scripts that automate,
translate, or execute operations — never published to npm).

Repo-wide rules (TypeScript, file naming, Conventional Commits) live in the repo
root's [`../../context/`](../../context/) and apply on top. This file documents
only what is specific to this workspace.

## Build

The only script that does real work. From the repo root:

```bash
pnpm --filter @constructor-lab/style-dictionary build
```

`src/index.ts` is the single entry point. Each output is a **platform key**,
`<filter>-<output>` — the SD-style name that is also the CLI selector. It builds
them in dependency order. The **token** outputs are written into the published
`packages/tokens/` package (committed, not gitignored):

1. `pd-dtcg` → `tokens/dtcg/` — six per-mode, 100%-DTCG JSON files.
2. `pd-css` → the whole stylesheet family from one resolve (they share it):
   - `tokens/css/` — **reference-based** CSS: `primitives.css` (the sole raw-value
     - `light-dark()` theme layer), `semantics.css` + `components/<component>.css`
       (each token a `var(--…)` reference onto primitives), `index.css` (the
       single-import manifest), and `tailwind-theme.css` (the `@theme inline`
       bridge). Brand is a **selector** (`[data-brand]`), not a file: the default
       brand renders under `:root`, others as `[data-brand='…']` override blocks.
       Names use the `--ui-*` convention.
   - `tokens/scss/` — `_tokens.scss` (`@mixin ui-tokens`) + `_mixins.scss`
     (`ui-theme`) — the same layer as a Sass mixin.
   - `tokens/js/` — `tokens.js` + `.d.ts`, a name → `var(--…)` map for CSS-in-JS.

Usage:

```bash
tsx src/index.ts                                # all filters, all outputs
tsx src/index.ts pd-css                         # css/scss/js (runs its pd-dtcg dependency first)
tsx src/index.ts --filter=web                   # restrict to one filter
```

`pd-css` consumes the DTCG files `pd-dtcg` writes, so requesting it runs `pd-dtcg`
first; the default builds everything. `dev` is a no-op; `clean` removes `dist/`
(the token output lives in `tokens` and is cleaned per-build before
regenerating); `lint`/`typecheck` run eslint/tsc; `test` runs the vitest suite
(the token normalization + CSS rendering units).

## Platforms

A platform key is `<filter>-<output>`. Both halves are real axes:

- **`filter`** (`pd` | `web`) maps to the `platforms` enum (`PD` | `WEB`) — a
  closed enum mirrored by the tokens. The same sources produce a **different**
  bundle per filter.
- **`output`** (`dtcg` | `css`) is the artifact kind. `css` emits the whole
  stylesheet family (css + scss + js + the Tailwind bridge) from one resolve.

`filtersFor(output)` in `platforms.ts` encodes which filters have source data:

- `dtcg`/`css` come from the token package. Every token is `["PD"]`
  today, so `FILTERS` is `['pd']`; `web` is schema-defined and coming. The valid
  platform keys are therefore `pd-dtcg` + `pd-css`.
- Adding WEB tokens = add `'web'` to `FILTERS`. No hook changes — the stages take a
  `filter` and derive their keys from it.

## Source layout

`index.ts` is the **CLI home only** — it parses keys/filters and dispatches to the
token build. `tokens.ts` is the Style Dictionary token build (its SD hooks live in
`hooks/`); `scss.ts` / `js.ts` / `bridge/tailwind-theme.ts` render the SCSS, JS,
and Tailwind-bridge artifacts from the same resolved model. The shared platform-key
axes + output locations they all agree on live in `platforms.ts`, so no domain has
to import the CLI.

```
src/
  index.ts              CLI home: parseArgs/parseKey/main, dispatch to the token build.
  platforms.ts          Shared axes: Filter/Output/PlatformKey, FILTERS, OUTPUTS,
                        filtersFor, ALL_FILTERS, FILTER_ENUM; the tokens output
                        paths (TOKENS_PKG, dtcgDir, cssDir, primitivesCssFile,
                        semanticsCssFile, componentCssFile, indexCssFile,
                        tailwindThemeCssFile, scssDir, jsDir, …), rel.
  tokens.ts             The two SD stages (buildDtcg, buildCss) + TOKEN_SOURCES, VIEWS,
                        BRANDS, the makeSd factory; buildModel + resolveAllTokens.
  scss.ts, js.ts        emitScss / emitJs — SCSS mixin + JS token map from the model.
  bridge/tailwind-theme.ts  emitTailwindTheme — the generated `@theme inline` bridge.
  hooks/                Style Dictionary hooks — the token pipeline's extension points.
    preprocessors/      acronis-dtcg — UI Components library source → per-mode DTCG. `normalizeTree`
                        is what stage 1 calls directly (deliberately not an SD
                        preprocessor — see the stage-1 gotcha above).
    transforms/         color/hsl-to-rgb, gradient/css, dimension/px, scalar/css,
                        typography/css-class, name/ui + the `acronis/css` transform group.
    primitive-roots.ts  the primitive-root predicate (isPrimitiveToken / PRIMITIVE_ROOTS)
                        the builder routes emission with.
    formats/            css/light-dark — collectDecls + serializeSlice render the CSS
                        (reference-based; brand via [data-brand]).
    index.ts            STATIC_HOOKS — the registry every instance shares.
```

`tokens.ts` + `hooks/` are the SD token build; `index.ts` just wires it to the
CLI. Adding a token output is a new build function in `tokens.ts` + a CLI branch;
new token logic goes in a hook under `hooks/`. A new source package gets a reader
(like `readTokenSource` in `tokens.ts`).

## CI integration

Change-detection and validation-gating live in **CI**, not this tool — the tool is
a pure, granular builder. CI detects changed paths, runs each package's existing
`validate` (ajv), and on success calls the tool with the right selector:

| Changed path                    | Build invocation                                        |
| ------------------------------- | ------------------------------------------------------- |
| `tokens/tiers/**` or its schema | `build` (token build: `pd-dtcg`+`pd-css`+`pd-tailwind`) |

Tokens always build together (one schema, tightly-coupled files).

## Gotchas

- **Node ≥ 22** — Style Dictionary v5 requires it (the repo is already on 22).
- **Token output is committed.** The token builds write into `packages/tokens/`
  whose generated files are **tracked** (CI fails if a token change isn't
  re-generated + committed — see the drift gate in `ci.yml`).
  `@constructor-lab/tokens` is the source of truth — never hand-edit generated
  output.
- **`--ui-*` naming.** The `name/ui` transform drops a leading `colors` tier
  segment and prefixes every token with `ui` (`colors.background.surface.primary`
  → `--ui-background-surface-primary`). Tokens partition into output files by
  `token.path[0]`: the **data-driven** semantic roots (`colors`/`gradients`/
  `typography`) → the semantic root file, every other root → its own component
  dir. The semantic roots are derived from the top-level keys of `semantics.json`
  via the shared `semanticRoots()` helper, not a hardcoded set. Non-default brands
  are diffed against the default (`acronis`) and emit override-only files.
- **Platform filter** — the `normalizeTree` pass keeps only tokens whose
  `platforms` array includes the build's filter enum value (PD today), then strips
  the (non-DTCG) `platforms` key; `$extensions` is retained for traceability. The
  enum value is threaded in from the `filter` via `FILTER_ENUM` (see Platforms),
  not hardcoded.
- **Stage 1 serializes `normalizeTree`'s output directly**, not `sd.tokens` —
  SD's own init normalization relocates `$type` (it drops the redundant
  group-level type _and_ the token-level type on units-promoted dimensions),
  which would break the "every token self-describing, references intact"
  contract of the DTCG artifact. That's why `buildDtcg` calls `normalizeTree`
  itself instead of running stage 1 through an SD instance.
- **Scalar value transforms stay non-transitive; the typography one must be
  transitive.** Stage 2's `acronis/css` group keeps `color/hsl-to-rgb`,
  `dimension/px`, and `scalar/css` **non-transitive** — they run after reference
  resolution and must not be `transitive: true` (a transitive scalar transform
  re-runs mid-resolution and breaks `{…}` alias resolution). `typography/css-class`
  is the deliberate **exception**: a composite token's sub-fields are references,
  so SD only applies a value transform to it on the transitive (post-resolution)
  pass — non-transitive, it never fires at all. It's safe because typography
  composites are terminal (nothing aliases into them), so it can't interfere with
  anyone else's resolution.
- **Typography → utility classes, not variables.** Composite typography tokens
  are emitted as `.ui-typography-*` classes (one declaration per field), not per
  field as `--…` custom properties. They are **not** expanded: the
  `typography/css-class` transform builds the declaration block from the resolved
  composite `$value`, and `serializeCss` wraps it in the `.ui-typography-*`
  selector. Because the composite's sub-fields carry no `$type`, the transform
  formats them by shape (`formatScalar`), handling both already-px strings and
  inline `{ value, unit }` objects.
- **Gradients are supported.** The `gradient/css` transform renders the top-level
  `gradients.*` root (color-stop arrays + a Figma transform matrix) into
  `linear-gradient(...)` strings (angle from `com.figma.gradientTransform`).
  `gradients` is a semantic root, so they emit as plain `--ui-gradients-*` custom
  properties (theme-invariant, not zipped into `light-dark()`) in the root semantic
  CSS, and route into the base Tailwind preset's `backgroundImage` — the routing is
  driven by the source `com.acronis.tailwindRoles` extension, not hardcoded.

## Loading context

Before non-trivial work, read the matching file(s) in full.

| When the task involves…                                                                                                                     | Load                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| The two stages, the source→mode mapping, the PD filter, how aliases are kept vs flattened                                                   | [`context/pipeline.md`](context/pipeline.md) |
| The CSS contract — `light-dark()`, `rgb()` colors, `--ui-*` names, tier split, brand override diff, typography, gradients, Tailwind presets | [`context/output.md`](context/output.md)     |

To understand the **input** shape (the UI Components library token divergences this tool
consumes), read
[`../../packages/tokens/context/manifest.md`](../../packages/tokens/context/manifest.md).

## Conventions for new context files

`context/<name>.md`, lowercase-hyphen. One concept per file; add a row to the
table above in the same change — an unlisted file is invisible to the agent.

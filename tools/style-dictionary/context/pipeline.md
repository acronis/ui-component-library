# Pipeline — the two build stages

`@spec-lab/style-dictionary` builds in two stages. Stage 1 normalizes the
Constructor Lab design tokens into plain DTCG; stage 2 turns that into CSS. Splitting the
work this way keeps the DTCG-conformance concern (handling the Constructor Lab
divergences) separate from the CSS concern (resolution, formatting, theming), and
leaves a clean intermediate that generic DTCG tooling could also consume.

## Why two stages, and why the file split

The source tokens carry two independent mode axes (see
[`tokens/context/manifest.md`](../../../packages/tokens/context/manifest.md)):

- **Theme** (`light` / `dark`) lives on `primitives.palette`.
- **Brand** (`acronis` / `brand-b`) lives on `semantics.colors` and `components.*`.

So stage 1 splits **primitives by theme** but **semantics/components by brand**.
The semantics tier carries `colors`, `gradients`, and `typography`:

| Output (`tokens/dtcg/`)   | Source file       | Mode key picked from `values` |
| ------------------------- | ----------------- | ----------------------------- |
| `primitives-light.json`   | `primitives.json` | `light`                       |
| `primitives-dark.json`    | `primitives.json` | `dark`                        |
| `semantics-acronis.json`  | `semantics.json`  | `acronis`                     |
| `semantics-brand-b.json`  | `semantics.json`  | `brand-b`                     |
| `components-acronis.json` | `components.json` | `acronis`                     |
| `components-brand-b.json` | `components.json` | `brand-b`                     |

Because semantics/component files are **not** split by theme, their values **keep
their `{group.token}` aliases** (e.g. `"{palette.base}"`). Stage 2 preserves that
alias chain: a token whose original value is a single `{alias}` is emitted as a
`var(--<referenced>)` **reference**, not a flattened literal. So light/dark is
owned solely by the primitive theme layer (`light-dark()` on the palette), and
semantics/components inherit it transitively through their `var()` refs — no
`semantics-acronis-dark.json`, and no re-baked per-component color literals. Only
the primitive palette needs the light-vs-dark resolve pass; a non-aliased brand
literal (rare) is emitted concretely and is theme-invariant.

## Stage 1 — `buildDtcg` (in `tokens.ts`)

`buildDtcg` (in `tokens.ts`) reads the three token files through the
`readTokenSource` reader (also in `tokens.ts`, a typed reader over the package's
`exports`) and, for each view above, normalizes the tree for that view's mode and
the build's `filter` enum value (`normalizeTree` in
`hooks/preprocessors/acronis-dtcg.ts`) producing 100%-DTCG JSON. It serializes
`normalizeTree`'s output **directly** rather than reading it back off a Style
Dictionary instance (SD's init normalization would relocate `$type`; see
AGENTS.md), which is why this stage does not run through SD. The pass:

- **Filter to the platform** — a token is dropped unless its `platforms` array
  includes the build's filter enum value (`"PD"` today; see AGENTS.md →
  Platforms). The `platforms` key itself is then **stripped** (it has no DTCG home).
- **One `$value` per token, original form** — `values.<mode>` collapses to a
  single `$value`. Every `$value` is already native DTCG (dimension
  `{ value, unit }`, plain fontWeight number / fontFamily string, HSL color
  objects, typography composites), so it is kept as-is. No flattening here.
- **`$extensions` is retained** for traceability.
- **`$type`** is carried down from groups onto each token so every emitted token
  is self-describing; `$description` / `$deprecated` are preserved.

A node is a **token** (not a group) if it carries `values` or `$value`; groups
whose every child was omitted for a mode are themselves omitted.

## Stage 2 — `buildCss` (in `tokens.ts`) + the `acronis/css` hooks

`buildCss` (in `tokens.ts`) builds an in-memory `StyleModel` (`buildModel`): it
resolves the tokens with Style Dictionary (`getPlatformTokens` under the
`<filter>-css` key) to run the transforms and populate `token.name` +
`token.references`, then **emits directly** from the resolved model
(`collectDecls` + `serializeSlice`) — the same "serialize-directly" approach stage
1 uses, because the output is many partitioned files, and because references (not
resolved literals) are what we emit. See [`output.md`](output.md) for the contract.

- **Value transforms** (`hooks/transforms/`, grouped as `acronis/css`) format the
  primitive layer + any non-aliased literal: `color/hsl-to-rgb`, `gradient/css`,
  `dimension/px`, `scalar/css`, `typography/css-class`, then `name/ui` (drop
  `colors`, prefix `ui`). The value transforms are **non-transitive** — they run
  after reference resolution. `typography/css-class` must be **transitive**: a
  composite's sub-fields are references, so SD only applies a value transform to it
  on the transitive pass.
- **References over literals** — `collectDecls` inspects each token's
  `original.$value`: a single `{alias}` → `var(--<referenced-name>)` (looked up in
  a `path → name` map built from the full resolve). Only the **primitive** color
  layer zips light + dark into `light-dark(lightRgb, darkRgb)` (dark from a second
  resolve pass); semantics/components are theme-invariant references.
- The primitive roots (`palette`, `units`, `font`) **are** emitted — as the
  `primitives` slice / theme layer (`isPrimitiveToken` routes them). They are no
  longer dropped; everything else references them.
- Typography composites become a `.ui-typography-*` class; a malformed
  (non-declaration) typography value is skipped, never emitted as invalid CSS.
- Emitted tokens partition by `token.path[0]` into `primitives` / `semantics` / a
  per-component slice. **Brand is a selector**: the default brand renders under
  `:root`, non-default brands are diffed and rendered under `[data-brand='<brand>']`
  in the **same** file. The same model also feeds `scss.ts`, `js.ts`, and
  `bridge/tailwind-theme.ts` (SCSS mixin, JS token map, Tailwind bridge) — one
  resolve, four artifact families.

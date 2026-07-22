# @constructor-lab/style-dictionary

A **private** build tool (not published) that translates
[`@constructor-lab/tokens`](../../packages/tokens) into per-brand
CSS custom properties, using [Style Dictionary v5](https://styledictionary.com/).
It is the first tool in the repo's `tools/` tier.

## What it produces

Run the build and inspect the gitignored `dist/`:

```bash
pnpm --filter @constructor-lab/style-dictionary build
```

```
dist/
└── tokens/
    ├── pd-dtcg/                  # stage 1: 100%-DTCG JSON, one file per mode
    │   ├── primitives-light.json #   (Theme axis)
    │   ├── primitives-dark.json
    │   ├── semantic-acronis.json #   (Brand axis; aliases kept, not flattened)
    │   ├── semantic-brand-b.json
    │   ├── components-acronis.json
    │   └── components-brand-b.json
    └── pd-css/                   # stage 2: per-brand CSS custom properties
        ├── acronis.css
        └── brand-b.css
```

Each CSS file is a single `:root` block using the modern `light-dark()` +
`color-scheme` pattern, with path-derived variable names (no prefix), `rgb()`
colors, and `px` dimensions, followed by a block of `.typography-*` utility
classes. Only the **semantic** and **component** tiers are emitted — the palette
is a resolution input, not output.

```css
:root {
  color-scheme: light dark;
  --colors-background-surface-primary: light-dark(rgb(255 255 255), rgb(0 0 0));
  --button-global-radius: 4px;
}
[data-theme='light'] {
  color-scheme: light;
}
[data-theme='dark'] {
  color-scheme: dark;
}

.typography-body-default {
  font-family: Inter;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
}
```

## How it works

Two token stages — see [`context/pipeline.md`](context/pipeline.md) for the full
mapping and [`context/output.md`](context/output.md) for the CSS contract:

1. **Normalize** the UI Components library tokens (per-mode `values`, `platforms`) into plain
   DTCG JSON, split by mode, filtered to the `PD` platform, with aliases
   preserved. Every `$value` is already native DTCG, so it passes through as-is.
2. **Resolve & format** each brand against both themes, zipping colors into
   `light-dark()` and writing the CSS.

## Scripts

| Script                | Does                                                 |
| --------------------- | ---------------------------------------------------- |
| `build`               | all platforms: `pd-dtcg` → `pd-css`                  |
| `clean`               | remove `dist/`                                       |
| `lint` / `typecheck`  | eslint / `tsc --noEmit`                              |
| `test` / `test:watch` | `vitest` — token normalization + CSS rendering specs |
| `dev`                 | no-op (run `build`)                                  |

### Targeted builds

Each output is a platform key, `<filter>-<output>`. `filter` maps to the
`platforms` enum: tokens are `pd` today. Pass keys to build a subset:

```bash
pnpm build                                       # everything (default)
pnpm build pd-css                                # just pd-css (runs its pd-dtcg dependency first)
pnpm build -- --filter=pd                        # restrict to one filter
```

Tokens always build together. Requires **Node ≥ 22** (Style Dictionary v5).

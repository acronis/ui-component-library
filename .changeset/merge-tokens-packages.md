---
'@spec-lab/tokens': major
'@spec-lab/ui-react': major
---

Merge `@spec-lab/design-tokens` and `@spec-lab/tokens-pd` into a single published package, `@spec-lab/tokens`, and rework token/theme delivery to be reference-based.

- **New package `@spec-lab/tokens`** holds the DTCG source tiers (`tiers/*.json`) **and** the generated, committed CSS/SCSS/JS. `@spec-lab/design-tokens` and `@spec-lab/tokens-pd` are removed.
- **Reference-based CSS, no value duplication.** `css/primitives.css` is the only layer with raw values + `light-dark()`; the semantic and per-component tiers emit `var(--…)` references onto it, so each value is stated once. Brand switches via `[data-brand]`, light/dark via `[data-theme]` — both carried in one bundle (no per-brand files, no runtime stylesheet injection).
- **Single import.** `@spec-lab/tokens/css` pulls in primitives + semantics + every component tier (replaces the ~24 per-component `@import`s). Adds SCSS mixins (`@spec-lab/tokens/scss/mixins`) and a JS token map (`@spec-lab/tokens/js`).
- **Tailwind bridge is generated** as `@spec-lab/tokens/css/tailwind-theme.css` (previously hand-maintained in ui-react). The per-brand / per-component baked Tailwind presets are dropped.

Migration: replace `@spec-lab/tokens-pd` and `@spec-lab/design-tokens` with `@spec-lab/tokens`; `@import '@spec-lab/tokens/css'` once (plus `@import '@spec-lab/tokens/css/tailwind-theme.css'` for the Tailwind bridge); select a brand with `[data-brand="deep-sky"]` instead of importing a per-brand stylesheet.

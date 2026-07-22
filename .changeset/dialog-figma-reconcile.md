---
'@constructor-lab/ui-react': patch
---

fix(dialog): reconcile against Figma — rewire to the `--ui-dialog-*` token tier

Reconciled `Dialog` against the Figma design (node 6343:58898) and completed its
Code Connect. The component previously themed from semantic tokens with a "no
`--ui-dialog-*` tier exists yet" note; that tier now ships in
`@constructor-lab/tokens`, so the container, header, title, and body are wired to
it — which also corrects real geometry drift:

- **container** → `--ui-dialog-container-{color,border-radius,width-min}`; the
  `sm`/`md` sizes → `--ui-dialog-container-size-{sm,md}` (`md` 672 → **632px**).
- **header** → `--ui-dialog-header-{color,border-color,border-width,gap,height,
padding-x}` (padding **20 → 16px**); title → `--ui-dialog-header-title-color`.
- **body** → `--ui-dialog-body-{gap,padding-y,height-min}` (padding **24 → 16px**,
  **72px** min-height, content vertically centered).

The footer keeps the shared semantic vocabulary (Figma's Footer tier has no
`--ui-footer-*` counterpart yet), with its horizontal padding corrected to 16px.
Code Connect completed (`status: COMPLETE`, real node URL); the ui-spec
index/tokens/anatomy were updated to match. Visual-regression baselines
regenerated (light + dark). The close glyph still uses the muted treatment rather
than Figma's plain-blue `ButtonIcon` idle — a separate button-icon token
discrepancy, tracked out of this change.

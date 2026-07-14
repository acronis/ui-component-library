---
'@constructor-lab/tokens': patch
'@constructor-lab/ui-react': patch
---

Fix fallout from the latest design-token regeneration.

**tokens** — normalize the `deep-sky-itkontoret` brand slug (the regeneration
had duplicated it as `deep_sky_itkontoret`, which violates the tier schema's
kebab-case `Modes` contract and breaks with every other brand's naming), drop
the placeholder `"String value"` overrides on the ButtonMenu dropdown item
label text-style, and re-sync per-brand overrides from the current Figma
snapshot. No default-brand values change — only `[data-brand]` override blocks
are affected.

**ui-react** — repoint components at tokens renamed/removed by the
regeneration: Chip icon size (`--ui-chip-global-icon-size` →
`--ui-chip-global-box-icon-size`) and the Search / InputText clear-button icon
color (dropped `--ui-input-*-clear-icon-color` → `--ui-glyph-on-surface-primary`).

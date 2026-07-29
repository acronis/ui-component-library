---
'@constructor-lab/ui-react': minor
---

Add `BarChart` — a typed bar-chart composition over the shared `Chart`
primitives. Takes `data` + `config` + `dataKeys` + `xKey` and renders a themed
recharts `BarChart` with tooltip, legend, axes, and grid. Variants: `orientation`
(vertical / horizontal) and `layout` (grouped / stacked). Supports dashed
reference/average lines, axis titles + unit suffixes, chrome toggles
(`showGrid` / `showTooltip` / `showLegend`), a `barRadius`, and a `tooltipContent`
passthrough. Series colors bind to the theme-invariant `--ui-chart-*` palette.

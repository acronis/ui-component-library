---
'@constructor-lab/ui-react': minor
---

Add `LineChart` — a typed line-chart composition over the shared `Chart`
primitives. Takes `data` + `config` + `dataKeys` + `xKey` and renders a themed
recharts `LineChart` with tooltip, legend, axes, and grid. Variants: `curve`
(linear / monotone / step) and `lineStyle` (solid / dashed). Supports
previous-period comparison overlays (`comparisonKeys`, dashed + dimmed), shaded
delta bands (`deltaBands`), axis titles + a Y unit, `strokeWidth` / `showDots` /
`connectNulls`, chrome toggles, and a `tooltipContent` passthrough. Series colors
bind to the theme-invariant `--ui-chart-*` palette.

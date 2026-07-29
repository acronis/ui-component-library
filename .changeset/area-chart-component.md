---
'@constructor-lab/ui-react': minor
---

Add `AreaChart` — a typed area-chart composition over the shared `Chart`
primitives. Takes `data` + `config` + `dataKeys` + `xKey` and renders a themed
recharts `AreaChart` with tooltip, legend, axes, and grid. Variants: `layout`
(single / stacked) and `fill` (solid / gradient). Supports `curve`, `strokeWidth`,
`fillOpacity`, `showDots`, `connectNulls`, axis titles + a Y unit, chrome toggles,
and a `tooltipContent` passthrough. Series colors bind to the theme-invariant
`--ui-chart-*` palette.

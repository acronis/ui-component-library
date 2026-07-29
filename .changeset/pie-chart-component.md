---
'@constructor-lab/ui-react': minor
---

Add `PieChart` — a typed pie/donut-chart composition over the shared `Chart`
primitives. Takes `data` + `config` + `dataKey` (slice value) + `nameKey` (slice
label) and renders a themed recharts `PieChart` with tooltip and legend. One
variant: `shape` (pie / donut). Supports a donut `centerLabel` (headline value +
caption, legend-aware centering), `innerRadius` / `outerRadius` / `paddingAngle`,
chrome toggles, and a `tooltipContent` passthrough. Slice colors bind to the
theme-invariant `--ui-chart-*` palette.

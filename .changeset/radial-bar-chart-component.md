---
'@constructor-lab/ui-react': minor
---

Add `RadialBarChart` — a typed radial-bar chart over the shared `Chart`
primitives (a polar type). Plots one concentric arc per `data` row, sized by
`dataKey` and named by `nameKey`, with a background track, tooltip, and legend.
No variant axis — its expressiveness is geometry (`startAngle` / `endAngle` +
`innerRadius` / `outerRadius`, so a caller can build a full ring or a half-circle
gauge) plus `showBackground` / chrome toggles and a `tooltipContent` passthrough.
Arc colors bind to the theme-invariant `--ui-chart-*` palette.

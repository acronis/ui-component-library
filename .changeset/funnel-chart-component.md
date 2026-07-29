---
'@constructor-lab/ui-react': minor
---

Add `FunnelChart` — a typed funnel-chart composition over the shared `Chart`
primitives. Plots a `data` list of stages (sized by `dataKey`, named by
`nameKey`) as a narrowing funnel with tooltip and on-chart labels. Variant:
`lastShape` (triangle point / flat rectangle); `reversed` flips the taper;
`showLabels` / `showTooltip` toggle chrome; `tooltipContent` passthrough. Stage
colors bind to the theme-invariant `--ui-chart-*` palette.

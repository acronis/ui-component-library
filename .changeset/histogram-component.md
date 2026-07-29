---
'@constructor-lab/ui-react': minor
---

Add `Histogram` — a typed histogram over the shared `Chart` primitives. Buckets
a flat numeric `data` distribution into `bins` equal-width buckets and plots the
count per bucket as touching bars, with axes and a tooltip. No variant axis — its
expressiveness is the binning (`bins`) plus `showGrid` / `showTooltip` toggles
and a `tooltipContent` passthrough; the binning is a pure exported
`computeHistogramBins` helper. The count series binds to the theme-invariant
`--ui-chart-*` palette; axes/grid/chrome resolve to semantic tokens.

---
'@constructor-lab/ui-react': minor
---

Add `ComposedChart` — a typed composed (mixed) chart over the shared `Chart`
primitives. Plots a `series` list over one shared category axis where each entry
picks its own render `type` (bar / line / area), with tooltip, legend, axes, and
grid. Series render in array order (later entries paint on top). Supports `curve`,
`barRadius`, `fillOpacity`, axis titles + a Y unit, chrome toggles, and a
`tooltipContent` passthrough. No CVA variants (the mix is data-driven). Series
colors bind to the theme-invariant `--ui-chart-*` palette.

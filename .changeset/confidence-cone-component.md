---
'@constructor-lab/ui-react': minor
---

Add `ConfidenceCone` — a typed forecast/uncertainty chart over the shared
`Chart` primitives. Plots a central estimate (`valueKey`) as a line inside a
shaded band between `lowerKey` and `upperKey` (a range `Area` fed a
`[lower, upper]` tuple) — the widening cone of a projection — with an optional
dashed `forecastStart` divider, tooltip, and legend. No variant axis — its
expressiveness is the data mapping plus `bandOpacity` / `curve` / chrome toggles
and a `tooltipContent` passthrough. The line + band bind to the theme-invariant
`--ui-chart-*` palette; the divider/axes/chrome resolve to semantic tokens.

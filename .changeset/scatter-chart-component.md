---
'@constructor-lab/ui-react': minor
---

Add `ScatterChart` — a typed scatter/bubble-chart composition over the shared
`Chart` primitives. Takes a `series` list (each `{ key, data }`) + `config` +
numeric `xKey` / `yKey` and renders a themed recharts `ScatterChart` with
tooltip, legend, axes, and grid. Optional `zKey` (+ `zRange`) maps a third field
to point size (a bubble chart); `shape` sets the marker; axis titles + unit
suffixes and chrome toggles are supported. No CVA variants (expressiveness is in
the data mapping). Series colors bind to the theme-invariant `--ui-chart-*`
palette.

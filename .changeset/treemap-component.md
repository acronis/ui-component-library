---
'@constructor-lab/ui-react': minor
---

Add `Treemap` — a typed treemap over the shared `Chart` primitives. Packs a
hierarchical `data` array into nested rectangles sized by `dataKey`, named by
`nameKey`, with on-tile labels and a tooltip. Each top-level category owns a
color and its leaves inherit it, separated by a surface-colored gutter. No
variant axis — its expressiveness is the hierarchy plus the tile `aspectRatio`
and `showLabels` / `showTooltip` toggles and a `tooltipContent` passthrough.
Category colors bind to the theme-invariant `--ui-chart-*` palette; the gutter,
on-tile labels (on-color text token), and chrome resolve to semantic tokens.

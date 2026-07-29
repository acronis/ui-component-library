---
'@constructor-lab/ui-react': minor
---

Add `RadarChart` — a typed radar (spider) chart over the shared `Chart`
primitives (the kit's first polar type). Plots one radar area per `dataKeys`
entry around a categorical `angleKey` web, with tooltip and legend. Variant:
`gridType` (polygon / circle web); `fillOpacity` / `strokeWidth` / `showDots` and
chrome toggles; `tooltipContent` passthrough. Series colors bind to the
theme-invariant `--ui-chart-*` palette. Polar spoke labels are themed via a local
workaround for a shared-primitives gap (the container themes cartesian ticks, not
polar ones) — the shared `chart.tsx` is left untouched.

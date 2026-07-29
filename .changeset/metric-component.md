---
'@constructor-lab/ui-react': minor
---

Add `Metric` — a presentational metric card built on `Card`: a label (+ optional
info tooltip and top-right caption) over a primary value with an optional
status-tinted icon badge, unit, metadata badge and a composed `TrendIndicator`,
plus optional supporting text and a composable `children` body (a chart, a
`Meter` breakdown, a `Separator`, an insight line). `size` scales the typography;
`loading` swaps the value for a skeleton.

`status` (neutral / info / success / warning / danger / critical) tints **only**
the icon badge — the `--ui-background-status-<s>-pressed` fill with the
`--ui-text-on-status-<s>` icon color — never a full fill, so many metrics read
calmly on one dashboard. `Timeline`'s status marker uses the same pairing.

Design-pending v1: no Figma node exists for a metric card, so there is no
`--ui-metric-*` tier — the composed `Card` supplies the surface and the shared
semantic tokens supply the rest.

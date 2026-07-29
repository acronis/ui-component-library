---
'@constructor-lab/ui-react': minor
---

Add `TrendIndicator` — a small presentational trend/delta indicator: a direction
glyph, an already-formatted change value, and an optional comparison label. It
separates **`direction`** (up / down / flat — the arithmetic) from
**`sentiment`** (positive / negative / neutral — good or bad), because the kit
cannot assume up = good: revenue ↑ is positive, threats ↑ is negative, MTTR ↓ is
positive. Two sizes, an `inline` or tinted `badge` variant, an optional tooltip
(which makes the root keyboard-reachable), and an `ariaLabel` for a full
accessible sentence.

Design-pending v1: no Figma node exists for a trend indicator, so there is no
`--ui-trend-indicator-*` tier — sentiment resolves the semantic
`--ui-text-on-status-*` colors and the badge their matching
`--ui-background-status-*`. The `--ui-chart-*` palette is deliberately unused; it
is reserved for data-series marks.

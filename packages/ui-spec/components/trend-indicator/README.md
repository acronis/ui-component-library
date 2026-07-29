# TrendIndicator

A small presentational primitive that shows **how a metric changed** versus a
reference — a direction glyph, an already-formatted change value, and an optional
comparison label.

## When to use

- Next to a [Metric](../metric/README.md) value ("↑ 12% vs last quarter").
- In a Data Table cell to show per-row movement.
- In compact headers/summaries as a tinted `badge`.

## When not to use

- To plot a trend over time — use [LineChart](../line-chart/README.md) or
  [AreaChart](../area-chart/README.md).
- To compute a delta — the consumer computes `direction`, `sentiment`, and the
  formatted `value`; this component only renders them.

## Key idea: direction ≠ sentiment

`direction` is the maths (up / down / flat); `sentiment` is whether that's good
(positive / negative / neutral). The kit can't assume up = good — revenue ↑ is
positive, threats ↑ is negative, MTTR ↓ is positive. Always pass both.

```tsx
<TrendIndicator direction="up" sentiment="positive" value="8%" comparisonLabel="revenue QoQ" />
<TrendIndicator direction="up" sentiment="negative" value="35%" comparisonLabel="threats" />
<TrendIndicator direction="down" sentiment="positive" value="1.4 h" comparisonLabel="MTTR" />
```

## Parts

| Part               | Element | Notes                                                                          |
| ------------------ | ------- | ------------------------------------------------------------------------------ |
| root               | `span`  | Carries the sentiment color + badge tint; `data-direction` / `data-sentiment`. |
| `icon`             | `svg`   | Decorative (`aria-hidden`), chosen by `direction`, mirrors under RTL.          |
| `value`            | `span`  | Tabular figures; caller-formatted.                                             |
| `comparison-label` | `span`  | Muted secondary caption.                                                       |

## Overlap — read before adding another trend surface

The kit already ships **`WidgetTextTrend`** (in
[`widget-text`](../../../ui-react/src/components/ui/widget-text/widget-text.tsx)):
a `direction`-only trend line, colored from the same
`--ui-text-on-status-success` / `-danger` / `-neutral` tokens, scoped to the
`WidgetText` surface. `TrendIndicator` is the general primitive; `WidgetTextTrend`
predates it and has live consumers, tests and stories, so the two coexist for now.

The intended end state — `WidgetTextTrend` delegating to `TrendIndicator` — is
recorded as reconciliation debt in
[`grammar/LEDGER.md`](../../grammar/LEDGER.md). **Do not add a third trend
surface**; extend this one, or take the reconciliation.

## Notes

- **Design-pending v1** — there is no Figma node for a trend indicator, so
  sentiment colors reuse the semantic status tokens rather than a
  `--ui-trend-indicator-*` tier. `--ui-chart-*` is deliberately unused: it is
  reserved for data-series marks, and a trend arrow carries status meaning.
- Value may be numeric or qualitative (`"Improving"`, `"4.2 h → 2.8 h"`).
- Pass `ariaLabel` for a full accessible sentence; the glyph is decorative.

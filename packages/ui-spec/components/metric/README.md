# Metric

A presentational metric / statistic **card**: a label + optional caption over a
primary value (with an optional status-tinted icon badge, unit, and trend), plus
an optional body for a chart, breakdown, or insight.

## When to use

- A dashboard KPI tile: a headline number with a trend and a small visual.
- Any "value + context" surface (health score, coverage, ARR, MTTR, at-risk
  count, …).

## When not to use

- To plot a series over time — use [LineChart](../line-chart/README.md) or
  [AreaChart](../area-chart/README.md) (compose it as the Metric body).
- To compute the value or the trend — the consumer passes a ready-formatted
  `value` and a resolved `status`; Metric never does maths or business rules.

## Anatomy

```
GROSS MARGIN                 [Last 30 days]   <- label + caption
[#] 73 %              v 5% vs prev 30d        <- icon badge + value + unit · trend
---------------------------------------       <- (children body: chart / Separator / insight)
```

## Composition

Metric is a `Card`. Put the trend in the `trend` slot (a `TrendIndicator`), a
timeframe in `caption` (a `Tag`), and drop a chart / `Meter` breakdown /
`Separator` / insight line into `children`:

```tsx
<Metric
  label="At-risk customers"
  status="critical"
  icon={<ChartPieIcon />}
  caption={<Tag>Now</Tag>}
  value="3"
  trend={
    <TrendIndicator
      direction="up"
      sentiment="negative"
      value="1"
      size="small"
    />
  }
>
  <Meter value={46} max={54} className="gap-1">
    <div className="flex items-center justify-between">
      <MeterLabel className="text-xs font-normal">Healthy</MeterLabel>
      <MeterValue className="text-xs" />
    </div>
    <MeterTrack className="h-1.5">
      <MeterIndicator
        style={{ background: 'var(--ui-background-status-strong-success)' }}
      />
    </MeterTrack>
  </Meter>
  <Separator className="my-3" />
  <p>+3 customers predicted at-risk within 30 days.</p>
</Metric>
```

## Overlap — read before adding another value tile

The kit already ships two adjacent surfaces, both with live consumers, tests and
stories:

- **`WidgetValue` / `WidgetLabel`** (in
  [`widget`](../../../ui-react/src/components/ui/widget/widget.tsx)) — the
  label + prominent value pair inside the `Widget` chrome.
- **`StatRow` / `StatRowStat`** (in [`stat-row`](../stat-row/README.md)) — the
  config-driven KPI row built on `CardFilter`.

`Metric` is the general single-tile primitive. The three coexist for now;
reconciling them is recorded as reconciliation debt in
[`grammar/LEDGER.md`](../../grammar/LEDGER.md). **Do not add a fourth value-tile
surface** — extend one of these, or take the reconciliation.

## Notes

- **Design-pending v1** — there is no Figma node for a metric card in the design
  file, so there is no `--ui-metric-*` token tier: the composed `Card` supplies
  the surface and the semantic `--ui-*` vocabulary supplies the rest. Geometry
  uses the Tailwind scale.
- Value may be numeric or a ReactNode; the kit never formats it.
- `status` (`neutral | info | success | warning | danger | critical`) tints the
  icon badge only (subtle) — the `--ui-background-status-<status>-pressed` fill +
  the `--ui-text-on-status-<status>` icon color — never a full color fill, so
  many metrics stay calm together. This is the same pairing
  [Timeline](../timeline/README.md)'s status marker uses.

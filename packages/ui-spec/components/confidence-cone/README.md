# ConfidenceCone

A typed confidence-cone chart built on the shared `Chart` primitives. Give it
`data` (one row per point) with an estimate field and lower/upper bound fields, a
per-series `config`, and the field names (`xKey` / `valueKey` / `lowerKey` /
`upperKey`); it renders a themed recharts composition — a shaded band between the
bounds with the estimate line on top, plus an optional forecast divider, tooltip,
and legend — so you don't hand-compose the band `Area` + `Line` yourself.

> **Design-pending v1.** The line + band colors bind to the theme-invariant
> `--ui-chart-*` data-viz palette; the chrome is reconciled with Figma later, and
> Code Connect is deferred.

## When to use

- Showing a **forecast/projection** with its uncertainty — the band widens into
  a cone as confidence drops further out.
- Any estimate reported with a range (a predicted value ± an interval).

## When not to use

- A plain trend with no uncertainty band — use a line or area chart.
- Comparing several independent series — use a line chart.
- Categorical magnitudes — use a bar chart.

## Data mapping

ConfidenceCone has **no variant axis** — its expressiveness is the data mapping:

| Prop                    | Role                                          |
| ----------------------- | --------------------------------------------- |
| `valueKey`              | The central estimate (the line).              |
| `lowerKey` / `upperKey` | The band bounds (the cone).                   |
| `forecastStart`         | A dashed divider where the projection begins. |

## Example

```tsx
import { ConfidenceCone } from '@constructor-lab/ui-react';
import type { ChartConfig } from '@constructor-lab/ui-react';

const data = [
  { month: 'Jan', estimate: 100, lower: 100, upper: 100 },
  { month: 'Feb', estimate: 106, lower: 106, upper: 106 },
  { month: 'Mar', estimate: 118, lower: 110, upper: 126 },
  { month: 'Apr', estimate: 124, lower: 112, upper: 138 },
];

const config = {
  estimate: { label: 'Estimate', color: 'var(--ui-chart-1)' },
  band: { label: 'Confidence', color: 'var(--ui-chart-1)' },
} satisfies ChartConfig;

<ConfidenceCone
  config={config}
  data={data}
  xKey="month"
  valueKey="estimate"
  lowerKey="lower"
  upperKey="upper"
  forecastStart="Mar"
  className="h-[360px] w-[560px]"
/>;
```

The line and band reference the `--ui-chart-*` palette (keyed by `valueKey` and
`bandKey`) — a data-viz set that is deliberately theme-invariant.

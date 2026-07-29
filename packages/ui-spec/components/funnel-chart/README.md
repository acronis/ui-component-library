# FunnelChart

A typed funnel-chart built on the shared `Chart` primitives. Give it `data` (one
row per stage), a per-stage `config`, the value field (`dataKey`), and the label
field (`nameKey`); it renders a themed recharts `FunnelChart` — tooltip and
on-chart labels included — so you don't hand-compose recharts children.

> **Design-pending v1.** Stage colors bind to the theme-invariant `--ui-chart-*`
> data-viz palette; the chrome is reconciled with Figma later, and Code Connect
> is deferred.

## When to use

- Showing progression / drop-off through ordered stages (a conversion funnel,
  a hiring pipeline).
- Emphasizing where the biggest fall-off happens between consecutive stages.

## When not to use

- Categories with no inherent order or drop-off relationship — use a bar chart.
- Part-to-whole of one total — use a pie/donut chart.
- Trends over time — use a line or area chart.

## Variants

| Axis        | Values                   | Effect                                         |
| ----------- | ------------------------ | ---------------------------------------------- |
| `lastShape` | `triangle` · `rectangle` | Final segment narrows to a point vs ends flat. |

`reversed` (a plain prop) flips the taper to widen toward the bottom.

## Example

```tsx
import { FunnelChart } from '@constructor-lab/ui-react';
import type { ChartConfig } from '@constructor-lab/ui-react';

const data = [
  { stage: 'Visits', value: 5000 },
  { stage: 'Signups', value: 2600 },
  { stage: 'Trials', value: 1400 },
  { stage: 'Purchases', value: 620 },
];

const config = {
  Visits: { label: 'Visits', color: 'var(--ui-chart-1)' },
  Signups: { label: 'Signups', color: 'var(--ui-chart-2)' },
  Trials: { label: 'Trials', color: 'var(--ui-chart-3)' },
  Purchases: { label: 'Purchases', color: 'var(--ui-chart-4)' },
} satisfies ChartConfig;

<FunnelChart
  config={config}
  data={data}
  dataKey="value"
  nameKey="stage"
  className="h-[380px] w-[460px]"
/>;
```

Stage colors reference the `--ui-chart-*` palette, keyed by each stage's
`nameKey` value — a categorical data-viz set that is deliberately theme-invariant.

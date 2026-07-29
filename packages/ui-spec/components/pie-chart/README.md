# PieChart

A typed pie/donut-chart built on the shared `Chart` primitives. Give it `data`, a
per-slice `config`, the value field (`dataKey`), and the label field (`nameKey`);
it renders a themed recharts `PieChart` — tooltip and legend included — so you
don't hand-compose recharts children.

> **Design-pending v1.** Slice colors bind to the theme-invariant `--ui-chart-*`
> data-viz palette; the chrome is reconciled with Figma later, and Code Connect
> is deferred.

## When to use

- Showing part-to-whole proportions across a handful of categories.
- A compact, at-a-glance distribution (device share, channel split).
- Use `shape="donut"` when you want a lighter footprint or a centre for a total.

## When not to use

- More than ~6 categories, or many similar-sized slices — use a bar chart, which
  compares magnitudes far more precisely.
- Trends over time — use a line or area chart.
- Comparing exact values — angles are hard to read; prefer bars or a table.

## Variants

| Axis    | Values          | Effect                                    |
| ------- | --------------- | ----------------------------------------- |
| `shape` | `pie` · `donut` | Filled arc vs a hollow-centre donut ring. |

## Example

```tsx
import { PieChart } from '@constructor-lab/ui-react';
import type { ChartConfig } from '@constructor-lab/ui-react';

const data = [
  { browser: 'Chrome', value: 275 },
  { browser: 'Safari', value: 200 },
  { browser: 'Firefox', value: 187 },
  { browser: 'Edge', value: 173 },
];

const config = {
  Chrome: { label: 'Chrome', color: 'var(--ui-chart-1)' },
  Safari: { label: 'Safari', color: 'var(--ui-chart-2)' },
  Firefox: { label: 'Firefox', color: 'var(--ui-chart-3)' },
  Edge: { label: 'Edge', color: 'var(--ui-chart-4)' },
} satisfies ChartConfig;

<PieChart
  config={config}
  data={data}
  dataKey="value"
  nameKey="browser"
  shape="donut"
  className="h-[360px] w-[360px]"
/>;
```

Slice colors reference the `--ui-chart-*` palette, keyed by each slice's
`nameKey` value — a categorical data-viz set that is deliberately theme-invariant,
so a slice keeps its identity across light and dark.

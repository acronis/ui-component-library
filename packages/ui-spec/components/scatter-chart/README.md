# ScatterChart

A typed scatter-chart built on the shared `Chart` primitives. Give it a `series`
list (each `{ key, data }`), a per-series `config`, and the numeric axis fields
(`xKey` / `yKey`); it renders a themed recharts `ScatterChart` — tooltip, legend,
axes, and grid included — so you don't hand-compose recharts children. Add a
`zKey` to size points by a third field (a bubble chart).

> **Design-pending v1.** Series colors bind to the theme-invariant `--ui-chart-*`
> data-viz palette; the chrome is reconciled with Figma later, and Code Connect
> is deferred.

## When to use

- Showing the relationship/correlation between two numeric variables.
- Revealing clusters or outliers across groups (one `series` entry per group).
- Adding a third dimension via point size (`zKey` → bubble chart).

## When not to use

- A trend over an ordered/continuous dimension — use a line or area chart.
- Comparing a quantity across discrete categories — use a bar chart.
- Part-to-whole — use a pie/donut chart.

## Variants

None. ScatterChart has no CVA variant axes — its shape is fixed and its
expressiveness comes from the data mapping (`xKey` / `yKey` / `zKey` and the
number of `series`). Marker `shape` and bubble sizing are plain props.

## Example

```tsx
import { ScatterChart } from '@constructor-lab/ui-react';
import type { ChartConfig } from '@constructor-lab/ui-react';

const series = [
  {
    key: 'classA',
    data: [
      { hours: 2, score: 55 },
      { hours: 6, score: 78 },
      { hours: 8, score: 92 },
    ],
  },
  {
    key: 'classB',
    data: [
      { hours: 1, score: 70 },
      { hours: 5, score: 82 },
      { hours: 9, score: 95 },
    ],
  },
];

const config = {
  classA: { label: 'Class A', color: 'var(--ui-chart-1)' },
  classB: { label: 'Class B', color: 'var(--ui-chart-2)' },
} satisfies ChartConfig;

<ScatterChart
  config={config}
  series={series}
  xKey="hours"
  yKey="score"
  className="h-[360px] w-[520px]"
/>;
```

Series colors reference the `--ui-chart-*` palette — a categorical data-viz set
that is deliberately theme-invariant, so a series keeps its identity across light
and dark.

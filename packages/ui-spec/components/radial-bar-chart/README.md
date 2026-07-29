# RadialBarChart

A typed radial-bar chart built on the shared `Chart` primitives. Give it `data`
(one row per arc), a per-arc `config`, the value field (`dataKey`), and the label
field (`nameKey`); it renders a themed recharts `RadialBarChart` — tooltip,
legend, and background track included — so you don't hand-compose recharts
children.

> **Design-pending v1.** Arc colors bind to the theme-invariant `--ui-chart-*`
> data-viz palette; the chrome is reconciled with Figma later, and Code Connect
> is deferred.

## When to use

- Comparing a handful of categorical values in a compact, circular layout.
- A single-metric gauge (one arc over a half-circle sweep).

## When not to use

- Precise magnitude comparison across many categories — a linear bar chart is
  easier to read (arc length is harder to judge than bar length).
- Part-to-whole of one total — use a pie/donut chart.
- Trends over time — use a line or area chart.

## Geometry

RadialBarChart has **no variant axis** — its expressiveness is geometry and data:

| Prop                        | Effect                                                |
| --------------------------- | ----------------------------------------------------- |
| `startAngle` / `endAngle`   | The sweep — a full ring (default) or a partial gauge. |
| `innerRadius`/`outerRadius` | The band the arcs occupy.                             |
| `showBackground`            | The muted track behind each arc.                      |

## Example

```tsx
import { RadialBarChart } from '@constructor-lab/ui-react';
import type { ChartConfig } from '@constructor-lab/ui-react';

const data = [
  { browser: 'Chrome', value: 65 },
  { browser: 'Safari', value: 50 },
  { browser: 'Firefox', value: 35 },
  { browser: 'Edge', value: 25 },
];

const config = {
  Chrome: { label: 'Chrome', color: 'var(--ui-chart-1)' },
  Safari: { label: 'Safari', color: 'var(--ui-chart-2)' },
  Firefox: { label: 'Firefox', color: 'var(--ui-chart-3)' },
  Edge: { label: 'Edge', color: 'var(--ui-chart-4)' },
} satisfies ChartConfig;

<RadialBarChart
  config={config}
  data={data}
  dataKey="value"
  nameKey="browser"
  className="h-[360px] w-[360px]"
/>;
```

Arc colors reference the `--ui-chart-*` palette, keyed by each arc's `nameKey`
value — a categorical data-viz set that is deliberately theme-invariant.

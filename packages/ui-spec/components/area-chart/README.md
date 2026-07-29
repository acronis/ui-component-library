# AreaChart

A typed area-chart built on the shared `Chart` primitives. Give it `data`, a
per-series `config`, the series to plot (`dataKeys`), and the category key
(`xKey`); it renders a themed recharts `AreaChart` — tooltip, legend, axes, and
grid included — so you don't hand-compose recharts children.

> **Design-pending v1.** Series colors bind to the theme-invariant `--ui-chart-*`
> data-viz palette; the chrome is reconciled with Figma later, and Code Connect
> is deferred.

## When to use

- Emphasizing the magnitude of a trend over a continuous or ordered dimension
  (traffic over time, cumulative usage).
- Showing part-to-whole composition over time — with `layout="stacked"`.

## When not to use

- Comparing exact values across a few series — a line chart reads more precisely
  (overlapping fills obscure each other).
- Comparing a quantity across discrete categories — use a bar chart.
- A single metric or KPI — use a `Tag`, `Badge`, or plain text.
- Tabular detail — use `Table` / `DataTable`.

## Variants

| Axis     | Values               | Effect                                                      |
| -------- | -------------------- | ----------------------------------------------------------- |
| `layout` | `single` · `stacked` | Overlapping independent areas vs summed on a shared stack.  |
| `fill`   | `solid` · `gradient` | Flat translucent fill vs a vertical top-to-bottom gradient. |

Single vs multi area is not a variant — it follows from how many `dataKeys` you
plot.

## Example

```tsx
import { AreaChart } from '@constructor-lab/ui-react';
import type { ChartConfig } from '@constructor-lab/ui-react';

const data = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
];

const config = {
  desktop: { label: 'Desktop', color: 'var(--ui-chart-1)' },
  mobile: { label: 'Mobile', color: 'var(--ui-chart-2)' },
} satisfies ChartConfig;

<AreaChart
  config={config}
  data={data}
  dataKeys={['desktop', 'mobile']}
  xKey="month"
  className="h-[320px] w-[560px]"
/>;
```

Series colors reference the `--ui-chart-*` palette — a categorical data-viz set
that is deliberately theme-invariant, so a series keeps its identity across light
and dark.

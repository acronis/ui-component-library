# Histogram

A typed histogram built on the shared `Chart` primitives. Give it a flat numeric
`data` distribution, a single-series `config`, and a bucket count (`bins`); it
buckets the values into equal-width bins and renders a themed recharts bar chart
of the per-bin counts — touching bars, axes, and tooltip included — so you don't
bin the data or hand-compose recharts children.

> **Design-pending v1.** The count series binds to the theme-invariant
> `--ui-chart-*` data-viz palette; the chrome is reconciled with Figma later, and
> Code Connect is deferred.

## When to use

- Showing the **shape** of a distribution — where values cluster, how spread
  out they are, whether they skew (latency, scores, sizes).
- Comparing a distribution against an expected shape.

## When not to use

- Comparing named categories — use a bar chart (a histogram's x axis is a
  continuous range, not labels).
- Part-to-whole of one total — use a pie chart.
- Trends over time — use a line or area chart.

## Binning

Histogram has **no variant axis** — its expressiveness is the binning:

| Prop   | Effect                                                        |
| ------ | ------------------------------------------------------------- |
| `bins` | Number of equal-width buckets the distribution is split into. |

## Example

```tsx
import { Histogram } from '@constructor-lab/ui-react';
import type { ChartConfig } from '@constructor-lab/ui-react';

const values = [12, 18, 22, 25, 28, 31, 34, 36, 38, 40, 42, 45, 50, 58, 72, 95];

const config = {
  count: { label: 'Requests', color: 'var(--ui-chart-1)' },
} satisfies ChartConfig;

<Histogram
  config={config}
  data={values}
  bins={10}
  className="h-[340px] w-[520px]"
/>;
```

The count series references the `--ui-chart-*` palette (keyed by `seriesKey`,
default `"count"`) — a data-viz color that is deliberately theme-invariant.

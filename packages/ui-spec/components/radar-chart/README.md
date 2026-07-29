# RadarChart

A typed radar (spider) chart built on the shared `Chart` primitives — the kit's
first polar chart type. Give it `data` (one row per axis), a per-series `config`,
the series to plot (`dataKeys`), and the categorical axis key (`angleKey`); it
renders a themed recharts `RadarChart` — web, spokes, tooltip, and legend
included — so you don't hand-compose recharts children.

> **Design-pending v1.** Series colors bind to the theme-invariant `--ui-chart-*`
> data-viz palette; the chrome is reconciled with Figma later, and Code Connect
> is deferred. The polar spoke labels are themed via a local workaround for a
> shared-primitives gap (the container themes cartesian ticks, not polar ones).

## When to use

- Comparing a few entities across the same set of quantitative axes (skill
  profiles, feature scorecards).
- Showing the "shape" of a multi-dimensional profile at a glance.

## When not to use

- Precise value comparison — area/angle reads poorly; use a bar chart or table.
- More than ~3–4 series, or many axes — the web becomes unreadable.
- A single series with no axis comparison — plain stats read better.

## Variants

| Axis       | Values               | Effect                                            |
| ---------- | -------------------- | ------------------------------------------------- |
| `gridType` | `polygon` · `circle` | Straight-edged polygon web vs concentric circles. |

## Example

```tsx
import { RadarChart } from '@constructor-lab/ui-react';
import type { ChartConfig } from '@constructor-lab/ui-react';

const data = [
  { subject: 'Math', alice: 120, bob: 110 },
  { subject: 'English', alice: 86, bob: 130 },
  { subject: 'Physics', alice: 85, bob: 90 },
  { subject: 'History', alice: 65, bob: 85 },
];

const config = {
  alice: { label: 'Alice', color: 'var(--ui-chart-1)' },
  bob: { label: 'Bob', color: 'var(--ui-chart-2)' },
} satisfies ChartConfig;

<RadarChart
  config={config}
  data={data}
  dataKeys={['alice', 'bob']}
  angleKey="subject"
  className="h-[380px] w-[420px]"
/>;
```

Series colors reference the `--ui-chart-*` palette — a categorical data-viz set
that is deliberately theme-invariant, so a series keeps its identity across light
and dark.

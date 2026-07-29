# Treemap

A typed treemap built on the shared `Chart` primitives. Give it a hierarchical
`data` array (top-level categories, each with `children`), a per-category
`config`, the value field (`dataKey`), and the label field (`nameKey`); it
renders a themed recharts `Treemap` — tiles, on-tile labels, and tooltip
included — so you don't hand-compose recharts children or write the custom tile
renderer.

> **Design-pending v1.** Category colors bind to the theme-invariant
> `--ui-chart-*` data-viz palette; the chrome is reconciled with Figma later, and
> Code Connect is deferred.

## When to use

- Showing part-to-whole across a two-level hierarchy where the tile area encodes
  magnitude (disk usage, budget breakdown, portfolio weight).
- Comparing many values in a compact, space-filling layout.

## When not to use

- Precise magnitude comparison — area is hard to judge; a bar chart is easier.
- Flat, non-hierarchical categories — use a bar or pie chart.
- Trends over time — use a line or area chart.

## Tiling

Treemap has **no variant axis** — its expressiveness is the hierarchy and tiling:

| Prop          | Effect                                     |
| ------------- | ------------------------------------------ |
| `aspectRatio` | Preferred width/height ratio of the tiles. |
| `showLabels`  | Draw the node name on tiles large enough.  |

## Example

```tsx
import { Treemap } from '@constructor-lab/ui-react';
import type { ChartConfig, TreemapDatum } from '@constructor-lab/ui-react';

const data: TreemapDatum[] = [
  {
    name: 'Frontend',
    children: [
      { name: 'React', size: 3000 },
      { name: 'Vue', size: 2000 },
    ],
  },
  {
    name: 'Backend',
    children: [
      { name: 'Node.js', size: 2500 },
      { name: 'Python', size: 2200 },
    ],
  },
];

const config = {
  Frontend: { label: 'Frontend', color: 'var(--ui-chart-1)' },
  Backend: { label: 'Backend', color: 'var(--ui-chart-2)' },
} satisfies ChartConfig;

<Treemap
  config={config}
  data={data}
  dataKey="size"
  nameKey="name"
  className="h-[400px] w-full"
/>;
```

Category colors reference the `--ui-chart-*` palette, keyed by each top-level
entry's `nameKey` value — a categorical data-viz set that is deliberately
theme-invariant. Leaves inherit their category's color.

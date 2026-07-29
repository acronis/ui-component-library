'use client';

import {
  Treemap,
  type ChartConfig,
  type TreemapDatum,
} from '@constructor-lab/ui-react';

const data: TreemapDatum[] = [
  {
    name: 'Frontend',
    children: [
      { name: 'React', size: 3000 },
      { name: 'Vue', size: 2000 },
      { name: 'Angular', size: 1500 },
      { name: 'Svelte', size: 800 },
    ],
  },
  {
    name: 'Backend',
    children: [
      { name: 'Node.js', size: 2500 },
      { name: 'Python', size: 2200 },
      { name: 'Go', size: 1200 },
    ],
  },
  {
    name: 'Database',
    children: [
      { name: 'PostgreSQL', size: 1800 },
      { name: 'MongoDB', size: 1400 },
      { name: 'Redis', size: 900 },
    ],
  },
];

// Category colors are caller-supplied via `config`, bound to the theme-invariant
// `--ui-chart-*` data-viz palette.
const config = {
  Frontend: { label: 'Frontend', color: 'var(--ui-chart-1)' },
  Backend: { label: 'Backend', color: 'var(--ui-chart-2)' },
  Database: { label: 'Database', color: 'var(--ui-chart-3)' },
} satisfies ChartConfig;

export function TreemapDemo() {
  return (
    <Treemap
      config={config}
      data={data}
      dataKey="size"
      nameKey="name"
      style={{ height: 400, width: 560 }}
    />
  );
}

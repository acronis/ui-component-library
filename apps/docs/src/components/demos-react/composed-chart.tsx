'use client';

import { ComposedChart, type ChartConfig } from '@constructor-lab/ui-react';

const data = [
  { month: 'Jan', revenue: 4200, profit: 2400 },
  { month: 'Feb', revenue: 3100, profit: 1400 },
  { month: 'Mar', revenue: 6500, profit: 4800 },
  { month: 'Apr', revenue: 4900, profit: 2900 },
  { month: 'May', revenue: 5400, profit: 3100 },
  { month: 'Jun', revenue: 4800, profit: 2410 },
];

// Series colors are caller-supplied via `config`, keyed by each series' key and
// bound to the theme-invariant `--ui-chart-*` data-viz palette.
const config = {
  revenue: { label: 'Revenue', color: 'var(--ui-chart-1)' },
  profit: { label: 'Profit', color: 'var(--ui-chart-3)' },
} satisfies ChartConfig;

export function ComposedChartDemo() {
  return (
    <ComposedChart
      config={config}
      data={data}
      series={[
        { key: 'revenue', type: 'bar' },
        { key: 'profit', type: 'line' },
      ]}
      xKey="month"
      style={{ height: 320, width: 560 }}
    />
  );
}

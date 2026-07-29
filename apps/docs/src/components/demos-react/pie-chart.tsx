'use client';

import { PieChart, type ChartConfig } from '@constructor-lab/ui-react';

const data = [
  { browser: 'Chrome', value: 275 },
  { browser: 'Safari', value: 200 },
  { browser: 'Firefox', value: 187 },
  { browser: 'Edge', value: 173 },
];

// Slice colors are caller-supplied via `config`, keyed by each slice's nameKey
// value and bound to the theme-invariant `--ui-chart-*` data-viz palette.
const config = {
  Chrome: { label: 'Chrome', color: 'var(--ui-chart-1)' },
  Safari: { label: 'Safari', color: 'var(--ui-chart-2)' },
  Firefox: { label: 'Firefox', color: 'var(--ui-chart-3)' },
  Edge: { label: 'Edge', color: 'var(--ui-chart-4)' },
} satisfies ChartConfig;

export function PieChartDemo() {
  return (
    <PieChart
      config={config}
      data={data}
      dataKey="value"
      nameKey="browser"
      shape="donut"
      style={{ height: 360, width: 360 }}
    />
  );
}

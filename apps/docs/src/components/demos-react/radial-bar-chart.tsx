'use client';

import { RadialBarChart, type ChartConfig } from '@constructor-lab/ui-react';

const data = [
  { browser: 'Chrome', value: 65 },
  { browser: 'Safari', value: 50 },
  { browser: 'Firefox', value: 35 },
  { browser: 'Edge', value: 25 },
];

// Arc colors are caller-supplied via `config`, bound to the theme-invariant
// `--ui-chart-*` data-viz palette.
const config = {
  Chrome: { label: 'Chrome', color: 'var(--ui-chart-1)' },
  Safari: { label: 'Safari', color: 'var(--ui-chart-2)' },
  Firefox: { label: 'Firefox', color: 'var(--ui-chart-3)' },
  Edge: { label: 'Edge', color: 'var(--ui-chart-4)' },
} satisfies ChartConfig;

export function RadialBarChartDemo() {
  return (
    <RadialBarChart
      config={config}
      data={data}
      dataKey="value"
      nameKey="browser"
      style={{ height: 360, width: 360 }}
    />
  );
}

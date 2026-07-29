'use client';

import { FunnelChart, type ChartConfig } from '@constructor-lab/ui-react';

const data = [
  { stage: 'Visits', value: 5000 },
  { stage: 'Signups', value: 2600 },
  { stage: 'Trials', value: 1400 },
  { stage: 'Purchases', value: 620 },
];

// Stage colors are caller-supplied via `config`, keyed by each stage's nameKey
// value and bound to the theme-invariant `--ui-chart-*` data-viz palette.
const config = {
  Visits: { label: 'Visits', color: 'var(--ui-chart-1)' },
  Signups: { label: 'Signups', color: 'var(--ui-chart-2)' },
  Trials: { label: 'Trials', color: 'var(--ui-chart-3)' },
  Purchases: { label: 'Purchases', color: 'var(--ui-chart-4)' },
} satisfies ChartConfig;

export function FunnelChartDemo() {
  return (
    <FunnelChart
      config={config}
      data={data}
      dataKey="value"
      nameKey="stage"
      style={{ height: 380, width: 460 }}
    />
  );
}

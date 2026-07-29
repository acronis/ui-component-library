'use client';

import { ConfidenceCone, type ChartConfig } from '@constructor-lab/ui-react';

// A revenue projection: history (the band collapses onto the line), then a
// forecast whose confidence band widens into a cone.
const data = [
  { month: 'Jan', estimate: 100, lower: 100, upper: 100 },
  { month: 'Feb', estimate: 106, lower: 106, upper: 106 },
  { month: 'Mar', estimate: 111, lower: 111, upper: 111 },
  { month: 'Apr', estimate: 118, lower: 118, upper: 118 },
  { month: 'May', estimate: 124, lower: 118, upper: 130 },
  { month: 'Jun', estimate: 131, lower: 120, upper: 143 },
  { month: 'Jul', estimate: 138, lower: 121, upper: 156 },
  { month: 'Aug', estimate: 146, lower: 123, upper: 171 },
];

// The line + band are caller-supplied via `config`, bound to the theme-invariant
// `--ui-chart-*` data-viz palette.
const config = {
  estimate: { label: 'Estimate', color: 'var(--ui-chart-1)' },
  band: { label: 'Confidence', color: 'var(--ui-chart-1)' },
} satisfies ChartConfig;

export function ConfidenceConeDemo() {
  return (
    <ConfidenceCone
      config={config}
      data={data}
      xKey="month"
      valueKey="estimate"
      lowerKey="lower"
      upperKey="upper"
      forecastStart="Apr"
      forecastLabel="Forecast"
      style={{ height: 360, width: 560 }}
    />
  );
}

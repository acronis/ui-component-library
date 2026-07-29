'use client';

import { Histogram, type ChartConfig } from '@constructor-lab/ui-react';

// A roughly bell-shaped distribution of response times (ms).
const data = [
  12, 18, 22, 25, 25, 28, 30, 31, 33, 34, 35, 36, 36, 37, 38, 38, 39, 40, 40,
  41, 42, 42, 43, 44, 45, 46, 47, 48, 50, 52, 55, 58, 60, 63, 68, 72, 80, 88,
  95, 110,
];

// The count series is caller-supplied via `config`, bound to the theme-invariant
// `--ui-chart-*` data-viz palette.
const config = {
  count: { label: 'Requests', color: 'var(--ui-chart-1)' },
} satisfies ChartConfig;

export function HistogramDemo() {
  return (
    <Histogram
      config={config}
      data={data}
      bins={10}
      style={{ height: 340, width: 520 }}
    />
  );
}

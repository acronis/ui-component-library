import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ConfidenceCone } from '../confidence-cone';
import { ChartTooltipContent, type ChartConfig } from '../../chart';

const data = [
  { month: 'Jan', estimate: 100, lower: 100, upper: 100 },
  { month: 'Feb', estimate: 108, lower: 104, upper: 112 },
  { month: 'Mar', estimate: 115, lower: 106, upper: 124 },
  { month: 'Apr', estimate: 121, lower: 106, upper: 136 },
];

const config = {
  estimate: { label: 'Estimate', color: 'rgb(23 99 207)' },
  band: { label: 'Confidence', color: 'rgb(23 99 207)' },
} satisfies ChartConfig;

function renderChart(
  props: Partial<React.ComponentProps<typeof ConfidenceCone>> = {}
) {
  return render(
    <ConfidenceCone
      config={config}
      data={data}
      xKey="month"
      valueKey="estimate"
      lowerKey="lower"
      upperKey="upper"
      {...props}
    />
  );
}

describe('ConfidenceCone', () => {
  it('renders the shared chart wrapper', () => {
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('wires the line + band colors from config into --color-* custom properties', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-estimate: rgb(23 99 207)');
    expect(style).toContain('--color-band: rgb(23 99 207)');
  });

  // recharts only paints its SVG once the ResponsiveContainer has real
  // dimensions, which happy-dom never gives it — so the band/line/divider can't
  // be asserted here. This exercises the forecast-divider + chrome-toggle prop
  // paths against a plumbing/crash regression; the visual output is covered by
  // the VR stories.
  it('renders with a forecast divider and chrome toggled off', () => {
    const { container } = renderChart({
      forecastStart: 'Feb',
      forecastLabel: 'Forecast',
      showGrid: false,
      showTooltip: false,
      showLegend: false,
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('renders with a custom bandKey', () => {
    const { container } = renderChart({
      bandKey: 'range',
      config: {
        estimate: { label: 'Estimate', color: 'rgb(23 99 207)' },
        range: { label: 'Range', color: 'rgb(34 139 79)' },
      } satisfies ChartConfig,
    });
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-range: rgb(34 139 79)');
  });

  it('renders without crashing on empty data', () => {
    const { container } = renderChart({ data: [] });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('forwards a ref to the root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    renderChart({ ref });
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges a caller className onto the root', () => {
    const { container } = renderChart({ className: 'h-[340px] w-[560px]' });
    expect(container.firstElementChild).toHaveClass('h-[340px]', 'w-[560px]');
  });

  // The `tooltipContent` prop forwards a custom (library-owned) ChartTooltipContent
  // to recharts' Tooltip; happy-dom doesn't paint the tooltip, so this only guards
  // the prop path — consumers customize the tooltip without importing recharts.
  it('accepts a custom tooltipContent', () => {
    const { container } = renderChart({
      tooltipContent: (
        <ChartTooltipContent
          formatter={(value) => <span>{String(value)}</span>}
        />
      ),
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });
});

import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Histogram, computeHistogramBins } from '../histogram';
import { ChartTooltipContent, type ChartConfig } from '../../chart';

const data = [1, 2, 2, 3, 4, 5, 5, 5, 8, 10];

const config = {
  count: { label: 'Count', color: 'rgb(23 99 207)' },
} satisfies ChartConfig;

function renderChart(
  props: Partial<React.ComponentProps<typeof Histogram>> = {}
) {
  return render(<Histogram config={config} data={data} bins={5} {...props} />);
}

describe('computeHistogramBins', () => {
  it('returns no buckets for empty input', () => {
    expect(computeHistogramBins([], 5)).toEqual([]);
  });

  it('returns no buckets when bins < 1', () => {
    expect(computeHistogramBins([1, 2, 3], 0)).toEqual([]);
  });

  it('collapses to a single bucket when every value is equal', () => {
    const result = computeHistogramBins([7, 7, 7], 4);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ start: 7, end: 7, count: 3 });
  });

  it('buckets a distribution into equal-width bins and counts each', () => {
    // [0,10] over 5 bins → widths of 2: [0,2) [2,4) [4,6) [6,8) [8,10].
    const result = computeHistogramBins([0, 1, 3, 5, 7, 9, 10], 5);
    expect(result).toHaveLength(5);
    expect(result.map((b) => b.count)).toEqual([2, 1, 1, 1, 2]);
    expect(result[0]).toMatchObject({ start: 0, end: 2 });
    // The final bucket is closed on the right, so the max value lands in it.
    expect(result[4]).toMatchObject({ start: 8, end: 10, count: 2 });
  });

  it('counts the total across buckets equal to the input length', () => {
    const total = computeHistogramBins(data, 5).reduce(
      (s, b) => s + b.count,
      0
    );
    expect(total).toBe(data.length);
  });
});

describe('Histogram', () => {
  it('renders the shared chart wrapper', () => {
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('wires the series color from config into a --color-* custom property', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-count: rgb(23 99 207)');
  });

  it('renders with a custom seriesKey', () => {
    const { container } = renderChart({
      seriesKey: 'frequency',
      config: {
        frequency: { label: 'Frequency', color: 'rgb(34 139 79)' },
      } satisfies ChartConfig,
    });
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-frequency: rgb(34 139 79)');
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
    const { container } = renderChart({ className: 'h-[320px] w-[480px]' });
    expect(container.firstElementChild).toHaveClass('h-[320px]', 'w-[480px]');
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

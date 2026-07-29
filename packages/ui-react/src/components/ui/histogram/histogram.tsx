'use client';

import * as React from 'react';
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';

import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../chart';

export interface HistogramBin {
  /** Range label for the bucket, e.g. `"10–20"`. */
  bin: string;
  /** Inclusive lower edge of the bucket. */
  start: number;
  /** Exclusive upper edge of the bucket (inclusive on the final bucket). */
  end: number;
  /** Number of values that fell in the bucket. */
  count: number;
}

// Round to at most 2 decimals without trailing zeros, so bucket edges read
// cleanly whether the distribution is integer-valued or fractional.
function formatEdge(n: number): string {
  return String(Math.round(n * 100) / 100);
}

/**
 * Bucket a flat numeric distribution into `bins` equal-width buckets over
 * `[min, max]`, returning one row per bucket with its range label and count.
 * The final bucket is closed on the right so the maximum value is included.
 * Returns `[]` for empty input; collapses to a single bucket when every value
 * is equal. Exported for unit tests; not part of the package's public API.
 */
export function computeHistogramBins(
  values: ReadonlyArray<number>,
  bins: number
): HistogramBin[] {
  const nums = values.filter((v): v is number => typeof v === 'number');
  if (nums.length === 0 || bins < 1) return [];

  const min = Math.min(...nums);
  const max = Math.max(...nums);

  // A degenerate spread (all values equal) is a single bucket holding them all.
  if (min === max) {
    return [{ bin: formatEdge(min), start: min, end: max, count: nums.length }];
  }

  const width = (max - min) / bins;
  const buckets: HistogramBin[] = Array.from({ length: bins }, (_, i) => {
    const start = min + i * width;
    const end = i === bins - 1 ? max : min + (i + 1) * width;
    return {
      bin: `${formatEdge(start)}–${formatEdge(end)}`,
      start,
      end,
      count: 0,
    };
  });

  for (const value of nums) {
    // Clamp the last bucket so the max value lands in-range, not one past it.
    const index = Math.min(bins - 1, Math.floor((value - min) / width));
    buckets[index].count += 1;
  }

  return buckets;
}

// A typed recharts composition over the shared `Chart` primitives. A histogram
// buckets a flat numeric distribution into equal-width bins and plots the count
// per bin as touching bars. Like ScatterChart/Treemap there is no CVA variant: a
// histogram's expressiveness is the binning (`bins`) and the data, not a visual
// "mode". Binning happens in `computeHistogramBins`; the bars are one series
// colored from `--color-<seriesKey>`.
export interface HistogramProps extends Omit<
  React.ComponentProps<'div'>,
  'children'
> {
  /** The flat numeric distribution to bucket. */
  data: ReadonlyArray<number>;
  /**
   * Single-series map of `label` / `color`, keyed by `seriesKey` (imported from
   * the shared `Chart` primitives). Turned into a `--color-<seriesKey>` custom
   * property. The color is caller-supplied — reference a `--ui-chart-*` palette
   * token for a stable, theme-invariant identity.
   */
  config: ChartConfig;
  /** Config key naming the count series (drives the bar color + tooltip). */
  seriesKey?: string;
  /** Number of equal-width buckets. */
  bins?: number;
  /** Title rendered beneath the X axis. */
  xAxisLabel?: string;
  /** Title rendered beside the Y (count) axis. */
  yAxisLabel?: string;
  /** Corner radius on the top of each bar. */
  barRadius?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  /**
   * Replace the default tooltip. Pass a configured `ChartTooltipContent`
   * (imported from this library) — e.g. with a `formatter` / `labelFormatter` —
   * to customize the tooltip without composing recharts. Ignored when
   * showTooltip is false.
   */
  tooltipContent?: React.ComponentProps<typeof ChartTooltip>['content'];
}

const Histogram = React.forwardRef<HTMLDivElement, HistogramProps>(
  (
    {
      className,
      config,
      data,
      seriesKey = 'count',
      bins = 10,
      xAxisLabel,
      yAxisLabel,
      barRadius = 2,
      showGrid = true,
      showTooltip = true,
      tooltipContent,
      ...props
    },
    ref
  ) => {
    const buckets = React.useMemo(
      () => computeHistogramBins(data, bins),
      [data, bins]
    );

    const xAxisTitle = xAxisLabel
      ? { value: xAxisLabel, position: 'insideBottom' as const, offset: 0 }
      : undefined;
    const yAxisTitle = yAxisLabel
      ? {
          value: yAxisLabel,
          angle: -90,
          position: 'insideLeft' as const,
          style: { textAnchor: 'middle' as const },
        }
      : undefined;

    return (
      <div ref={ref} className={cn(className)} {...props}>
        <ChartContainer
          config={config}
          className="size-full [&_.recharts-label]:fill-foreground"
        >
          <RechartsBarChart
            data={buckets.map((b) => ({ ...b, [seriesKey]: b.count }))}
            // Histogram bars represent a continuous distribution, so they touch.
            barCategoryGap={0}
          >
            {showGrid && <CartesianGrid vertical={false} />}
            <XAxis
              dataKey="bin"
              type="category"
              tickLine={false}
              axisLine={false}
              height={xAxisLabel ? 48 : undefined}
              label={xAxisTitle}
            />
            <YAxis
              type="number"
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={yAxisLabel ? 72 : undefined}
              label={yAxisTitle}
            />
            {showTooltip && (
              <ChartTooltip
                content={tooltipContent ?? <ChartTooltipContent />}
              />
            )}
            <Bar
              dataKey={seriesKey}
              fill={`var(--color-${seriesKey})`}
              radius={barRadius > 0 ? [barRadius, barRadius, 0, 0] : undefined}
              isAnimationActive={false}
            />
          </RechartsBarChart>
        </ChartContainer>
      </div>
    );
  }
);
Histogram.displayName = 'Histogram';

export { Histogram };

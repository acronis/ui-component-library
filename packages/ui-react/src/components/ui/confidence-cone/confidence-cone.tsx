'use client';

import * as React from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';

import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../chart';

// A typed recharts composition over the shared `Chart` primitives. A confidence
// cone plots a central estimate as a line inside a shaded band between a lower
// and an upper bound — the widening "cone" of a forecast/projection. Like
// ScatterChart/Histogram there is no CVA variant: its expressiveness is the
// data mapping (which fields are the estimate and the bounds) and an optional
// `forecastStart` divider, not a visual "mode". The band is a range `<Area>` fed
// a `[lower, upper]` tuple; the estimate is a `<Line>`.
export interface ConfidenceConeProps extends Omit<
  React.ComponentProps<'div'>,
  'children'
> {
  /** Row-per-point data. Each object holds the x key + the estimate + the lower/upper bound fields. */
  data: ReadonlyArray<Record<string, string | number | null>>;
  /**
   * Per-series map of `label` / `color` (imported from the shared `Chart`
   * primitives), keyed by `valueKey` (the line) and `bandKey` (the band fill).
   * Colors are caller-supplied — reference a `--ui-chart-*` palette token for a
   * stable, theme-invariant identity.
   */
  config: ChartConfig;
  /** Category axis key (the shared dimension across rows, e.g. `"month"`). */
  xKey: string;
  /** Numeric field holding the central estimate (the line). */
  valueKey: string;
  /** Numeric field holding the lower bound of the band. */
  lowerKey: string;
  /** Numeric field holding the upper bound of the band. */
  upperKey: string;
  /**
   * Config key naming the band series (drives its fill color + legend/tooltip
   * entry). Must exist in `config`.
   */
  bandKey?: string;
  /**
   * Draw a dashed vertical divider at this x value to mark where the projection
   * begins (history to its left, forecast to its right).
   */
  forecastStart?: string | number;
  /** Caption rendered alongside the forecast divider. */
  forecastLabel?: string;
  /** Translucent fill opacity of the band. */
  bandOpacity?: number;
  /** Interpolation between points. */
  curve?: 'linear' | 'monotone' | 'step';
  /** Stroke width of the estimate line. */
  strokeWidth?: number;
  /** Title rendered beneath the horizontal (X) axis. */
  xAxisLabel?: string;
  /** Title rendered beside the vertical (Y) axis (rotated). */
  yAxisLabel?: string;
  /** Unit suffix appended to Y-axis tick values (recharts `unit`; the X axis is categorical). */
  yUnit?: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  /**
   * Replace the default tooltip. Pass a configured `ChartTooltipContent`
   * (imported from this library) — e.g. with a `formatter` / `labelFormatter` —
   * to customize formatting or extra fields without composing recharts yourself.
   * Ignored when `showTooltip` is false.
   */
  tooltipContent?: React.ComponentProps<typeof ChartTooltip>['content'];
}

const ConfidenceCone = React.forwardRef<HTMLDivElement, ConfidenceConeProps>(
  (
    {
      className,
      config,
      data,
      xKey,
      valueKey,
      lowerKey,
      upperKey,
      bandKey = 'band',
      forecastStart,
      forecastLabel,
      bandOpacity = 0.2,
      curve = 'monotone',
      strokeWidth = 2,
      xAxisLabel,
      yAxisLabel,
      yUnit,
      showGrid = true,
      showTooltip = true,
      showLegend = true,
      tooltipContent,
      ...props
    },
    ref
  ) => {
    // recharts renders a band <Area> when its dataKey resolves to a [low, high]
    // tuple, so stamp one per row from the lower/upper fields. A row missing
    // either bound yields no band segment there (the line still draws).
    const seriesData = data.map((row) => {
      const lower = row[lowerKey];
      const upper = row[upperKey];
      return {
        ...row,
        [bandKey]:
          typeof lower === 'number' && typeof upper === 'number'
            ? [lower, upper]
            : undefined,
      };
    });

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
          <ComposedChart data={seriesData}>
            {showGrid && <CartesianGrid vertical={false} />}
            <XAxis
              dataKey={xKey}
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              height={xAxisLabel ? 48 : undefined}
              label={xAxisTitle}
            />
            <YAxis
              type="number"
              tickLine={false}
              axisLine={false}
              unit={yUnit}
              width={yAxisLabel ? 72 : undefined}
              label={yAxisTitle}
            />
            {showTooltip && (
              <ChartTooltip
                content={tooltipContent ?? <ChartTooltipContent />}
              />
            )}
            {showLegend && <ChartLegend content={<ChartLegendContent />} />}
            {/* The band first, so the estimate line paints on top of it. */}
            <Area
              type={curve}
              dataKey={bandKey}
              stroke="none"
              fill={`var(--color-${bandKey})`}
              fillOpacity={bandOpacity}
              isAnimationActive={false}
            />
            <Line
              type={curve}
              dataKey={valueKey}
              stroke={`var(--color-${valueKey})`}
              strokeWidth={strokeWidth}
              dot={false}
              isAnimationActive={false}
            />
            {forecastStart !== undefined && (
              <ReferenceLine
                x={forecastStart}
                stroke="var(--ui-text-on-surface-secondary)"
                strokeDasharray="4 4"
                label={
                  forecastLabel
                    ? {
                        value: forecastLabel,
                        position: 'insideTopRight',
                        fill: 'var(--ui-text-on-surface-secondary)',
                        fontSize: 12,
                      }
                    : undefined
                }
              />
            )}
          </ComposedChart>
        </ChartContainer>
      </div>
    );
  }
);
ConfidenceCone.displayName = 'ConfidenceCone';

export { ConfidenceCone };

'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import type { LegendPayload } from 'recharts/types/component/DefaultLegendContent';
import {
  NameType,
  Payload,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';
import type { Props as LegendProps } from 'recharts/types/component/Legend';
import { TooltipContentProps } from 'recharts/types/component/Tooltip';

import { cn } from '@/lib/utils';

// The two keys a caller may supply in `ChartConfig`'s `theme` map. ui-react flips
// light/dark via the `[data-theme]` attribute (the tokens resolve `light-dark()`
// through `color-scheme`), not the legacy `.dark` class.
const THEMES = { light: 'light', dark: 'dark' } as const;

type ThemeKey = keyof typeof THEMES;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

export type ChartTooltipContentProps = Partial<
  TooltipContentProps<ValueType, NameType>
> & {
  className?: string;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: 'line' | 'dot' | 'dashed';
  nameKey?: string;
  labelKey?: string;
  labelFormatter?: (
    label: TooltipContentProps<number, string>['label'],
    payload: TooltipContentProps<number, string>['payload']
  ) => React.ReactNode;
  formatter?: (
    value: number | string,
    name: string,
    item: Payload<number | string, string>,
    index: number,
    payload: ReadonlyArray<Payload<number | string, string>>
  ) => React.ReactNode;
  labelClassName?: string;
  color?: string;
};

export type ChartLegendContentProps = {
  className?: string;
  hideIcon?: boolean;
  verticalAlign?: LegendProps['verticalAlign'];
  payload?: LegendPayload[];
  nameKey?: string;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.use(ChartContext);

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }

  return context;
}

export interface ChartContainerProps extends React.ComponentProps<'div'> {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >['children'];
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: ChartContainerProps) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext value={{ config }}>
      <div
        id={id}
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  );

  if (!colorConfig.length) {
    return null;
  }

  const declarations = (theme: ThemeKey) =>
    colorConfig
      .map(([key, itemConfig]) => {
        const color = itemConfig.theme?.[theme] || itemConfig.color;
        return color ? `  --color-${key}: ${color};` : null;
      })
      .filter(Boolean)
      .join('\n');

  // THREE blocks, not two — the third is the OS branch.
  //
  // The dark value used to be emitted ONLY under `[data-theme='dark']`. But the
  // tokens set `color-scheme: light dark` on `:root`, so a user whose system is
  // dark and whose app sets no `[data-theme]` gets the dark `--ui-*` palette
  // while these series colours stay on their light value: a dark chart drawn in
  // light-mode series colours. Verified against a real capture — see
  // `.storybook/visual-regression.ts`'s `system-dark` profile, which reproduced
  // it on `ui-chart--per-theme-series-colors`.
  //
  // `:not([data-theme='light'] *, [data-theme='light'])` is the escape that keeps
  // an explicit light choice winning on a dark machine. It is written against the
  // chart element itself rather than as an ancestor prefix on purpose: a prefix
  // like `:not([data-theme='light']) [data-chart=…]` would match through <body>
  // (which is not `[data-theme='light']` even when :root is) and defeat itself.
  //
  // Specificity works out without relying on order: the media rule is (0,2,0)
  // — `:not()` contributes its most specific argument — against (0,1,0) for the
  // light block, so it wins; and it ties the `[data-theme='dark']` block, which
  // is emitting the same values anyway.
  //
  // Rendered as a text child (not dangerouslySetInnerHTML): React sets it via
  // textContent, which the browser does not HTML-parse, so a `</style>` in a
  // config color can't break out of the tag.
  return (
    <style>
      {[
        `[data-chart=${id}] {\n${declarations(THEMES.light)}\n}`,
        `[data-theme='dark'] [data-chart=${id}] {\n${declarations(THEMES.dark)}\n}`,
        `@media (prefers-color-scheme: dark) {\n` +
          `[data-chart=${id}]:not([data-theme='light'] *, [data-theme='light']) {\n` +
          `${declarations(THEMES.dark)}\n}\n}`,
      ].join('\n')}
    </style>
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
  labelFormatter,
  formatter,
  labelClassName,
  color,
  nameKey,
  labelKey,
}: ChartTooltipContentProps) {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }

    const [item] = payload;
    const key = `${labelKey || item?.dataKey || item?.name || 'value'}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value = (() => {
      const v =
        !labelKey && typeof label === 'string'
          ? (config[label as keyof typeof config]?.label ?? label)
          : itemConfig?.label;

      return typeof v === 'string' || typeof v === 'number' ? v : undefined;
    })();

    if (labelFormatter) {
      return (
        <div className={cn('font-medium', labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      );
    }

    if (!value) {
      return null;
    }

    return <div className={cn('font-medium', labelClassName)}>{value}</div>;
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ]);

  if (!active || !payload?.length) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== 'dot';

  return (
    <div
      className={cn(
        'grid min-w-[8rem] items-start gap-1.5 rounded-[var(--ui-tooltip-container-border-radius)] border border-border bg-background px-[var(--ui-tooltip-container-padding-x)] py-[var(--ui-tooltip-container-padding-y)] text-xs text-foreground shadow-md',
        className
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || 'value'}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const indicatorColor = color || item.payload.fill || item.color;

          return (
            <div
              key={key}
              className={cn(
                'flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground',
                indicator === 'dot' && 'items-center'
              )}
            >
              {formatter && item?.value !== undefined && item.name ? (
                formatter(item.value, item.name, item, index, payload)
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : (
                    !hideIndicator && (
                      <div
                        className={cn(
                          'shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)',
                          {
                            'h-2.5 w-2.5': indicator === 'dot',
                            'h-4 w-1': indicator === 'line',
                            'h-4 w-0 border-[1.5px] border-dashed bg-transparent':
                              indicator === 'dashed',
                            'my-0.5': nestLabel && indicator === 'dashed',
                          }
                        )}
                        style={
                          {
                            '--color-bg': indicatorColor,
                            '--color-border': indicatorColor,
                          } as React.CSSProperties
                        }
                      />
                    )
                  )}
                  <div
                    className={cn(
                      'flex flex-1 justify-between leading-none',
                      nestLabel ? 'items-end' : 'items-center'
                    )}
                  >
                    <div className="grid gap-1.5">
                      {nestLabel ? tooltipLabel : null}
                      <span className="text-muted-foreground">
                        {itemConfig?.label || item.name}
                      </span>
                    </div>
                    {item.value != null && (
                      <span className="font-medium tabular-nums text-foreground">
                        {item.value.toLocaleString()}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = 'bottom',
  nameKey,
}: ChartLegendContentProps) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-4',
        verticalAlign === 'top' ? 'pb-3' : 'pt-3',
        className
      )}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || 'value'}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div
            key={item.value}
            className={cn(
              'flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground'
            )}
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: item.color,
                }}
              />
            )}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== 'object' || payload === null) {
    return undefined;
  }

  const payloadPayload =
    'payload' in payload &&
    typeof payload.payload === 'object' &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === 'string'
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config];
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};

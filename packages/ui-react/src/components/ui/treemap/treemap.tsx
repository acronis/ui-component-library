'use client';

import * as React from 'react';
import { Treemap as RechartsTreemap } from 'recharts';

import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../chart';

// One hierarchical datum: a named node that is either a leaf (with a `dataKey`
// numeric value) or a branch (with `children`). Extra fields are allowed so a
// caller can carry the `dataKey`/`nameKey` under any name.
export interface TreemapDatum {
  children?: TreemapDatum[];
  [key: string]: string | number | TreemapDatum[] | undefined;
}

// The node props recharts passes to a Treemap `content` renderer. Typed here
// because recharts types `content` loosely; we only read the geometry + the
// node's place in the tree. The `source*` props are the ones we set on the
// element ourselves — recharts clones the content element per node, merging in
// the geometry above while preserving these.
interface TreemapCellProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  depth?: number;
  index?: number;
  value?: number;
  parent?: { index: number };
  sourceData: ReadonlyArray<TreemapDatum>;
  sourceNameKey: string;
  sourceShowLabels: boolean;
}

// Rendered once per node (recharts clones this element with the node's geometry
// merged in). Resolves each tile's category color from the top-level entry it
// descends from: the category rect (depth 1) is fully overdrawn by its leaves,
// so a solid category color + surface gutters reads as the canonical treemap.
// Hoisted to module scope (not defined in render) so it keeps a stable identity.
function TreemapCell({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  name = '',
  depth = 0,
  index = 0,
  value = 0,
  parent,
  sourceData,
  sourceNameKey,
  sourceShowLabels,
}: TreemapCellProps) {
  const categoryIndex = depth === 1 ? index : (parent?.index ?? index);
  const categoryName =
    (sourceData[categoryIndex]?.[sourceNameKey] as string) ?? name;
  // Tiles below the top level are leaves; label them only when they are big
  // enough to hold the text without spilling.
  const canLabel = sourceShowLabels && width > 50 && height > 24;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: `var(--color-${categoryName})`,
          // The gutter between tiles is chrome, not data — paint it with the
          // surface so tiles separate cleanly in light and dark.
          stroke: 'var(--ui-background-surface-primary)',
          strokeWidth: 2,
        }}
      />
      {canLabel && depth > 1 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          // Labels sit on the theme-invariant `--ui-chart-*` tiles, whose
          // luminance spans 1.63:1–5.70:1 against white — so NO single fixed
          // label color can meet contrast on every tile, and there is no
          // on-chart text token (one cannot exist; see the ui-spec grammar
          // ledger `charts/on-fill-text-halo`). Instead the glyph carries its
          // own contrast: a white fill with an opaque dark halo painted
          // underneath via `paint-order: stroke`, legible on any tile without
          // resolving its color. The halo MUST stay the opaque `-100` stop:
          // the glyph's effective contrast is against the halo, not the tile,
          // so a lighter/translucent stop silently reintroduces the failure.
          // `paint-order` on <text> is universally supported (Chrome 35+,
          // Firefox 60+, Safari 8+); the VR chromium renders it.
          fill="var(--ui-palette-transparent-white-fixed-100)"
          stroke="var(--ui-palette-transparent-dark-fixed-100)"
          strokeWidth={3}
          strokeLinejoin="round"
          paintOrder="stroke"
          fontSize={11}
        >
          {name || value}
        </text>
      )}
    </g>
  );
}

// A typed recharts composition over the shared `Chart` primitives. A treemap
// packs a hierarchy into nested rectangles sized by `dataKey`; each top-level
// category owns a color from its `--color-<name>` var and its leaves inherit it,
// separated by a surface-colored gutter. Like ScatterChart/RadialBarChart there
// is no CVA variant: a treemap's expressiveness is the hierarchy + the
// `aspectRatio` of its tiles, not a visual "mode".
export interface TreemapProps extends Omit<
  React.ComponentProps<'div'>,
  'children'
> {
  /**
   * Hierarchical data. Top-level entries are the color categories; their
   * `children` are the leaves. Each leaf holds a `dataKey` numeric value; each
   * node holds a `nameKey` label.
   */
  data: ReadonlyArray<TreemapDatum>;
  /**
   * Per-category map of `label` / `color`, keyed by the top-level entry's
   * `nameKey` value (imported from the shared `Chart` primitives). Turned into
   * `--color-<name>` custom properties. Colors are caller-supplied — reference a
   * `--ui-chart-*` palette token for a stable, theme-invariant category
   * identity.
   */
  config: ChartConfig;
  /** Numeric field that sizes each tile. */
  dataKey: string;
  /**
   * Label field that names each node (drives the on-tile label, the tooltip,
   * and the top-level `--color-<name>` lookup). Top-level values should be
   * unique and CSS-safe — they become part of a custom-property name.
   */
  nameKey?: string;
  /** Preferred width/height ratio of the tiles. */
  aspectRatio?: number;
  /** Draw the node name on tiles large enough to hold it. */
  showLabels?: boolean;
  showTooltip?: boolean;
  /**
   * Replace the default tooltip. Pass a configured `ChartTooltipContent`
   * (imported from this library) — e.g. with a `formatter` / `labelFormatter` —
   * to customize formatting or extra fields without composing recharts
   * yourself. Ignored when `showTooltip` is false.
   */
  tooltipContent?: React.ComponentProps<typeof ChartTooltip>['content'];
}

const Treemap = React.forwardRef<HTMLDivElement, TreemapProps>(
  (
    {
      className,
      config,
      data,
      dataKey,
      nameKey = 'name',
      aspectRatio = 4 / 3,
      showLabels = true,
      showTooltip = true,
      tooltipContent,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn(className)} {...props}>
        <ChartContainer config={config} className="size-full">
          <RechartsTreemap
            data={data as TreemapDatum[]}
            dataKey={dataKey}
            nameKey={nameKey}
            aspectRatio={aspectRatio}
            isAnimationActive={false}
            content={
              <TreemapCell
                sourceData={data}
                sourceNameKey={nameKey}
                sourceShowLabels={showLabels}
              />
            }
          >
            {showTooltip && (
              <ChartTooltip
                content={
                  tooltipContent ?? (
                    <ChartTooltipContent nameKey={nameKey} hideLabel />
                  )
                }
              />
            )}
          </RechartsTreemap>
        </ChartContainer>
      </div>
    );
  }
);
Treemap.displayName = 'Treemap';

export { Treemap };

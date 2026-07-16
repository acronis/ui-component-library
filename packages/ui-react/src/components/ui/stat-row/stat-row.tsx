import * as React from 'react';

import { cn } from '@/lib/utils';
import { CardFilter, type CardFilterProps } from '../card-filter';

// PROTOTYPE (see context/opinionated-composites-proposal.md, Tier 2).
//
// StatRow is the config-driven KPI / stat row: `<StatRow stats={…} />`. It takes
// a flat stat list and renders one CardFilter per stat, deriving each card's
// variant from the descriptor (empty → placeholder, onClick/render → clickable
// filter, otherwise a static tile) and laying them out as a consistent wrapping
// row (or an equal-width grid) — so a dashboard's stat tiles never drift apart.
// Built on CardFilter; use it directly for a one-off card.

export interface StatRowStat {
  /** Stable key for the tile (falls back to the index). */
  id?: string;
  /** Caption above the value. */
  label: React.ReactNode;
  /** The prominent value. Ignored when `empty`. */
  value?: React.ReactNode;
  /** Optional leading icon (16px) before the value. */
  icon?: React.ReactNode;
  /** Render as an empty placeholder (an em-dash value, no icon). */
  empty?: boolean;
  /** Make the tile an interactive filter (renders a button). */
  onClick?: () => void;
  /** Polymorphic render (e.g. a router link) — also makes the tile interactive. */
  render?: CardFilterProps['render'];
}

export interface StatRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The stat tiles, in order. */
  stats: StatRowStat[];
  /**
   * Equal-width columns (a grid). Omit for a wrapping row of fixed-width
   * (224px) cards.
   */
  columns?: number;
}

export const StatRow = React.forwardRef<HTMLDivElement, StatRowProps>(
  function StatRow({ stats, columns, className, style, ...props }, ref) {
    const grid = columns != null;
    return (
      <div
        ref={ref}
        className={cn(grid ? 'grid gap-4' : 'flex flex-wrap gap-4', className)}
        style={
          grid
            ? ({
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                ...style,
              } as React.CSSProperties)
            : style
        }
        {...props}
      >
        {stats.map((stat, index) => {
          const variant = stat.empty
            ? 'static-empty'
            : stat.onClick || stat.render
              ? 'clickable'
              : 'static';
          return (
            <CardFilter
              // eslint-disable-next-line @eslint-react/no-array-index-key -- prefer stat.id; index is the documented fallback for a static, caller-ordered list
              key={stat.id ?? index}
              variant={variant}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              render={stat.render}
              onClick={stat.onClick}
              className={cn(grid && 'w-full')}
            />
          );
        })}
      </div>
    );
  }
);

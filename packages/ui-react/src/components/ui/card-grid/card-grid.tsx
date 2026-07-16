import * as React from 'react';

import { Card } from '../card';
import { Grid, type GridProps } from '../grid';

// PROTOTYPE (see context/opinionated-composites-proposal.md, Tier 2).
//
// CardGrid is the config-driven card grid: `<CardGrid items renderItem />`. It
// lays a list of peer items out as uniform Cards in a responsive Grid — either a
// fixed responsive column count (`cols`) or an auto-filling track sized by
// `minColumnWidth` — wrapping each item's content in a Card shell so a catalog /
// gallery / picker's tiles always align and reflow consistently. Built on Grid +
// Card; compose those directly for a bespoke, non-uniform layout.

export interface CardGridProps<T> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /** The items to render as cards. */
  items: T[];
  /** Renders the content *inside* each item's Card (header / content / footer). */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Stable key for each card (falls back to the index). */
  getKey?: (item: T, index: number) => React.Key;
  /** Responsive column count (Grid's `cols`). Ignored when `minColumnWidth` is set. */
  cols?: GridProps['cols'];
  /** Gap between cards (Grid's `gap`). */
  gap?: GridProps['gap'];
  /**
   * When set, use an auto-filling track of columns at least this wide (any CSS
   * length) instead of a fixed `cols` count — the grid fits as many columns as
   * the width allows.
   */
  minColumnWidth?: string;
}

export function CardGrid<T>({
  items,
  renderItem,
  getKey,
  cols = 3,
  gap = 'md',
  minColumnWidth,
  style,
  ...props
}: CardGridProps<T>) {
  return (
    <Grid
      cols={minColumnWidth ? 1 : cols}
      gap={gap}
      style={
        minColumnWidth
          ? ({
              gridTemplateColumns: `repeat(auto-fill, minmax(${minColumnWidth}, 1fr))`,
              ...style,
            } as React.CSSProperties)
          : style
      }
      {...props}
    >
      {items.map((item, index) => (
        <Card
          // eslint-disable-next-line @eslint-react/no-array-index-key -- prefer getKey; index is the documented fallback for a static, caller-ordered list
          key={getKey ? getKey(item, index) : index}
        >
          {renderItem(item, index)}
        </Card>
      ))}
    </Grid>
  );
}

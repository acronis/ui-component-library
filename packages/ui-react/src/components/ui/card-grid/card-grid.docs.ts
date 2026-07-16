import type { Key, ReactNode } from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. The runtime `CardGridProps`
// is generic (`<T>` over the item type), which AutoTypeTable can't render inline;
// this companion documents the caller-facing shape with `unknown` for the item.
// (The runtime type lives in card-grid.tsx; this file is never bundled.)

/** Props for `CardGrid`. */
export interface CardGridProps {
  /** The items to render as cards. */
  items: unknown[];
  /** Renders the content inside each item's Card (header / content / footer). */
  renderItem: (item: unknown, index: number) => ReactNode;
  /** Stable key for each card (falls back to the index). */
  getKey?: (item: unknown, index: number) => Key;
  /** Responsive column count (Grid's `cols`). Ignored when `minColumnWidth` is set (default 3). */
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  /** Gap between cards (Grid's `gap`, default `md`). */
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Auto-fill columns at least this wide (any CSS length) instead of a fixed
   * `cols` count — the grid fits as many columns as the width allows.
   */
  minColumnWidth?: string;
}

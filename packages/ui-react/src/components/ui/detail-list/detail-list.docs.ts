import type { ReactNode } from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. The runtime props
// reference the `DetailListItem[]` descriptor, which AutoTypeTable can't expand
// inline; this companion documents the caller-facing shape. (The runtime types
// live in detail-list.tsx; this file is never bundled.)

/** Props for `DetailList`. See `DetailListItem` for the row descriptor. */
export interface DetailListProps {
  /** The rows, in order. */
  items: unknown[];
  /** Column count. `2` uses a responsive grid that collapses to one column (default 1). */
  columns?: 1 | 2;
  /** Width of the label column (any CSS length). Defaults to 14rem (1 col) / 8rem (2 col). */
  labelWidth?: string;
}

/** A single row descriptor for `DetailList.items`. */
export interface DetailListItem {
  /** Stable key for the row (falls back to the row index). */
  id?: string;
  /** The property name. */
  label: ReactNode;
  /** The property value. */
  value: ReactNode;
  /** A muted line under the value. */
  description?: ReactNode;
  /** A leading icon (sized to 16px) beside the value — e.g. a status glyph. */
  icon?: ReactNode;
  /** Inline actions under the value (e.g. Link elements). */
  actions?: ReactNode;
}

import type { ReactNode } from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. `DataGridProps` is generic
// (`<TData, TValue>` with TanStack `ColumnDef`), which AutoTypeTable can't render
// cleanly; this companion documents the caller-facing shape. (The runtime type
// lives in data-grid.tsx; this file is never bundled.)

/** Props for `DataGrid`. */
export interface DataGridProps {
  /** TanStack column definitions — header/cell renderers and accessors. */
  columns: unknown[];
  /** The row data. */
  rows: unknown[];
  /**
   * Data state. `loaded` (default) renders rows; `loading` renders skeleton rows;
   * `empty` forces the empty message.
   */
  state?: 'loading' | 'empty' | 'loaded';
  /** Prepend a selection checkbox column and enable row selection. */
  selectable?: boolean;
  /** Render the built-in toolbar (search + column visibility). */
  toolbar?: boolean;
  /** Column id the toolbar search box filters (client-side). Implies `toolbar`. */
  searchKey?: string;
  /** Placeholder for the toolbar search box. */
  searchPlaceholder?: string;
  /** Render the built-in pagination footer. */
  pagination?: boolean;
  /** Initial page size when `pagination` is set (default 10). */
  pageSize?: number;
  /** Page-size options offered in the pagination footer. */
  pageSizeOptions?: number[];
  /** Called with the row's original data when a body row is clicked. */
  onRowClick?: (row: unknown) => void;
  /** Message shown in the empty state (default "No results."). */
  emptyMessage?: ReactNode;
  /** Number of skeleton rows rendered while `state="loading"` (default 5). */
  skeletonRows?: number;
  /** Alternating row backgrounds. */
  striped?: boolean;
}

import type { ReactNode } from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. `DataTableProps` is generic
// (`<TData, TValue>` with TanStack `ColumnDef` / `Row`), which AutoTypeTable can't
// render cleanly; this companion documents the caller-facing shape. (The runtime
// type lives in data-table.tsx; this file is never bundled.)

/** Props for `DataTable`. */
export interface DataTableProps {
  /** TanStack column definitions — header/cell renderers and accessors. */
  columns: unknown[];
  /** The row data. */
  data: unknown[];
  /** Enables row expansion for rows that return true; pair with `renderExpandedRow`. */
  getRowCanExpand?: (row: unknown) => boolean;
  /** Renders the detail content for an expanded row. */
  renderExpandedRow?: (row: unknown) => ReactNode;
  /** @deprecated Frozen compatibility prop; use DataGrid `appearance.striped`. Alternating row backgrounds. */
  striped?: boolean;
  /** @deprecated Frozen compatibility prop; use DataGrid `appearance.borders`. Vertical borders between columns. */
  bordered?: boolean;
  /** @deprecated Frozen compatibility prop; use DataGrid `rowInteraction.current`. Highlight the last-clicked row. */
  highlightCurrentRow?: boolean;
  /** @deprecated Frozen compatibility prop; use DataGrid `dataState`. Render placeholder skeleton rows. */
  skeleton?: boolean;
  /** @deprecated Frozen compatibility prop; use DataGrid `dataState.skeletonRows`. */
  skeletonRows?: number;
}

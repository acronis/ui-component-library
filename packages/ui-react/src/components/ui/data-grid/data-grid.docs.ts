import type { ReactNode } from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. The real `DataGridProps`
// is generic (`<TData, TValue>` over TanStack `ColumnDef`) and extends the
// grouped-config interface, which AutoTypeTable can't render cleanly; this
// companion documents the caller-facing shape with generics erased to `unknown`.
// The grouped-config props are the API; the flat props are deprecated aliases
// that normalize into them and are removed in the next major. (The runtime types
// live in data-grid.tsx / data-grid-actions.tsx; this file is never bundled.)

/** Selection behavior. `false`/omitted disables selection. */
export interface DataGridSelectionConfig {
  /** Single- or multi-row selection. Default `multiple`. */
  mode?: 'single' | 'multiple';
  /** Show the header select-all checkbox (multiple mode only). Default `true`. */
  showSelectAll?: boolean;
  /** Per-row eligibility predicate. */
  isRowSelectable?: (row: unknown) => boolean;
}

/** Sorting behavior. `false`/omitted disables sorting. */
export interface DataGridSortingConfig {
  /** Single-column or additive multi-column sort. Default `single`. */
  mode?: 'single' | 'multiple';
}

/** One operator-driven column filter control. */
export interface DataGridColumnFilterDef {
  /** Column id (matches the column's `id` or `accessorKey`). */
  columnId: string;
  /** Control label; defaults to the column id. */
  label?: string;
  /** Offered operators (e.g. `contains`, `equals`, `in`); defaults to a text set. */
  operators?: readonly string[];
}

/** Filter controls: per-column controls plus the toolbar global-search column. */
export interface DataGridFiltersConfig {
  /** Per-column filter controls. */
  columns?: readonly DataGridColumnFilterDef[];
  /** The column the toolbar search box filters, and its placeholder. */
  global?: { columnId?: string; placeholder?: string };
}

/** Pagination behavior (object form of the `pagination` prop). */
export interface DataGridPaginationConfig {
  /** Initial page size (default 10). */
  pageSize?: number;
  /** Page-size options offered in the pagination footer. */
  pageSizeOptions?: readonly number[];
}

/** A bulk action shown while rows are selected. */
export interface DataGridBulkAction {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  /** Style as destructive and route through a confirmation dialog when `confirm` is set. */
  destructive?: boolean;
  confirm?: {
    title: ReactNode;
    description?: ReactNode;
    confirmLabel?: ReactNode;
    cancelLabel?: ReactNode;
  };
  /** Fires with the currently selected rows. */
  onAction: (rows: unknown[]) => void;
}

/** Toolbar behavior (object form of the `toolbar` prop). */
export interface DataGridToolbarConfig {
  /** Show the global search box (needs a search column via `filters.global`). */
  globalSearch?: boolean;
  /** Bulk actions rendered in the selection toolbar. */
  bulkActions?: readonly DataGridBulkAction[];
}

/** One entry in a per-row action menu. */
export interface DataGridRowAction {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  destructive?: boolean;
  /** Per-row disabled predicate. */
  disabled?: (row: unknown) => boolean;
  /** Route through a confirmation dialog before firing `onAction`. */
  confirm?: {
    title: ReactNode;
    description?: ReactNode;
    confirmLabel?: ReactNode;
    cancelLabel?: ReactNode;
  };
}

/**
 * Per-row actions column. Supply exactly one of `items` (the built-in menu) or
 * `render` (a custom cell) — never both.
 */
export interface DataGridActionsConfig {
  /** Built-in overflow menu entries. Mutually exclusive with `render`. */
  items?: readonly DataGridRowAction[];
  /** Custom cell renderer that owns the whole actions cell. Mutually exclusive with `items`. */
  render?: (row: unknown) => ReactNode;
  /** Which side the actions column sits on. Default `end`. */
  placement?: 'start' | 'end';
  /** Fires with the activated action id and its row. */
  onAction: (actionId: string, row: unknown) => void;
}

/** Appearance overrides. */
export interface DataGridAppearanceConfig {
  /** Alternating row backgrounds. */
  striped?: boolean;
}

/**
 * Data-state config: `loaded` (default) renders rows; `loading` renders skeleton
 * rows; `empty` forces the empty message; `error` renders an Alert with `onRetry`.
 */
export interface DataGridDataStateConfig {
  status?: 'loading' | 'empty' | 'loaded' | 'error';
  /** Message shown in the empty state (default "No results."). */
  empty?: ReactNode;
  /** Content shown in the error state. */
  error?: ReactNode;
  /** Retry handler surfaced in the error Alert. */
  onRetry?: () => void;
  /** Number of skeleton rows rendered while loading (default 5). */
  skeletonRows?: number;
}

/**
 * One named bundle of grouped configs. `config` carries behavior groups only —
 * never `state`, `defaultState`, `server`, rows/columns, or callbacks.
 */
export interface DataGridPreset {
  id: string;
  /** Any subset of the grouped configs (`selection`, `sorting`, `filters`, …). */
  config: Record<string, unknown>;
}

/**
 * Named grouped-config bundles. Precedence rises with explicitness: detected
 * presets, then `apply`, then any config the caller passes directly.
 */
export interface DataGridPresetsInput {
  /** The presets available to `apply`/`detect`. */
  definitions: readonly DataGridPreset[];
  /** Preset ids applied left-to-right; a later write wins. */
  apply: readonly string[];
  /**
   * Runs **once** against the initial columns/rows and returns inferred preset
   * ids — it can never observe mutable state.
   */
  detect?: (input: {
    columns: readonly unknown[];
    rows: readonly unknown[];
  }) => readonly string[];
}

/**
 * Named screen callbacks carrying the enriched event (cause, complete next
 * state, query, request key). A config-level handler owns the behavior and runs
 * first; these observe afterwards. The detail/tree/grouping/scroll callbacks land
 * with the P1 features that emit them.
 */
export interface DataGridCallbacks {
  /** Every slice transition, in one place. */
  onStateChange?: (event: unknown) => void;
  /**
   * Every atomic query transition. In server mode `server.onQueryChange` is
   * authoritative and runs first; this only observes it.
   */
  onQueryChange?: (event: unknown) => void;
  onSelectionChange?: (event: unknown) => void;
  onCurrentRowChange?: (event: unknown) => void;
  onPaginationChange?: (event: unknown) => void;
  /** Column visibility / order / sizing / pinning, discriminated by `slice`. */
  onColumnStateChange?: (event: unknown) => void;
  onRowHover?: (event: unknown) => void;
  onRowClick?: (event: unknown) => void;
  onRowActivate?: (event: unknown) => void;
  onCellHover?: (event: unknown) => void;
  onCellClick?: (event: unknown) => void;
  /** A row action fired, after `actions.onAction`. */
  onRowAction?: (event: { actionId: string; row: unknown }) => void;
  /** A data-state recovery control was activated, after `dataState.onRetry`. */
  onDataStateAction?: (event: { action: 'retry' }) => void;
}

/** Row-interaction handlers and current-row roving focus. */
export interface DataGridRowInteractionConfig {
  /** Enable current-row roving focus (arrow keys move, Enter activates). */
  current?: boolean;
  onClick?: (row: unknown) => void;
  onActivate?: (row: unknown) => void;
  onHover?: (row: unknown) => void;
}

/** Props for `DataGrid`. */
export interface DataGridProps {
  /** TanStack column definitions — header/cell renderers and accessors. */
  columns: unknown[];
  /** The row data. */
  rows: unknown[];
  /**
   * Stable row identity. Defaults to the row index; supply a real id for stable
   * selection, actions, and bulk operations across data changes.
   */
  getRowId?: (row: unknown, index: number) => string;

  // ── Grouped configs (the API) ─────────────────────────────────────────────
  /** Selection behavior. `false`/omitted disables it. */
  selection?: false | DataGridSelectionConfig;
  /** Sorting behavior. `false`/omitted disables it. */
  sorting?: false | DataGridSortingConfig;
  /**
   * Column filter controls. A `DataGridFiltersConfig` (`{ columns, global }`) or
   * — deprecated — a bare `DataGridColumnFilterDef[]`. `false` disables filters.
   */
  filters?: false | readonly DataGridColumnFilterDef[] | DataGridFiltersConfig;
  /**
   * Pagination. A `DataGridPaginationConfig` (`{ pageSize, pageSizeOptions }`) or
   * — deprecated — a boolean paired with the flat `pageSize`/`pageSizeOptions`.
   */
  pagination?: boolean | DataGridPaginationConfig;
  /**
   * Toolbar. A `DataGridToolbarConfig` (`{ globalSearch, bulkActions }`) or —
   * deprecated — a boolean. `{}` renders column view-options only.
   */
  toolbar?: boolean | DataGridToolbarConfig;
  /** Per-row actions column (built-in menu via `items`, or a custom `render`). */
  actions?: false | DataGridActionsConfig;
  /** Appearance overrides (striped, …). */
  appearance?: DataGridAppearanceConfig;
  /** Data state (status, skeleton rows, empty/error content, retry). */
  dataState?: DataGridDataStateConfig;
  /** Row interaction (current row, click/activate/hover). */
  rowInteraction?: DataGridRowInteractionConfig;
  /** Named grouped-config bundles applied before the caller's own configs. */
  presets?: DataGridPresetsInput;
  /** Named screen callbacks carrying the enriched events. */
  callbacks?: DataGridCallbacks;
  /** All-manual server mode: caller owns the query and rows; grid emits `onQueryChange`. */
  server?: unknown;
  /**
   * Chrome ownership. Default built-in. `{ mode: 'external', render }` suppresses
   * the built-in toolbar/filters/bulk-bar/pagination and hands the shared
   * controller to a custom renderer (incompatible with `toolbar`/`searchKey`).
   */
  chrome?: unknown;
  /** Called when a body cell is clicked. */
  onCellClick?: (columnId: string, row: unknown) => void;
  /** Called when the pointer enters a body cell. */
  onCellHover?: (columnId: string, row: unknown) => void;

  // ── Deprecated flat aliases (removed next major) ──────────────────────────
  /** @deprecated Use `dataState.status`. */
  state?: 'loading' | 'empty' | 'loaded' | 'error';
  /** @deprecated Use `dataState.error`. */
  error?: ReactNode;
  /** @deprecated Use `dataState.onRetry`. */
  onRetry?: () => void;
  /** @deprecated Use `selection`. */
  selectable?: boolean;
  /** @deprecated Use `selection.mode`. */
  selectionMode?: 'single' | 'multiple';
  /** @deprecated Use `selection.isRowSelectable`. */
  isRowSelectable?: (row: unknown) => boolean;
  /** @deprecated Use `sorting`. */
  sortable?: boolean;
  /** @deprecated Use `sorting: { mode: 'multiple' }`. */
  multiSort?: boolean;
  /** @deprecated Use `toolbar.bulkActions`. */
  bulkActions?: readonly DataGridBulkAction[];
  /** @deprecated Use `filters.global.columnId`. */
  searchKey?: string;
  /** @deprecated Use `filters.global.placeholder`. */
  searchPlaceholder?: string;
  /** @deprecated Use `pagination.pageSize`. */
  pageSize?: number;
  /** @deprecated Use `pagination.pageSizeOptions`. */
  pageSizeOptions?: number[];
  /** @deprecated Use `rowInteraction.current`. */
  currentRow?: boolean;
  /** @deprecated Use `rowInteraction.onClick`. */
  onRowClick?: (row: unknown) => void;
  /** @deprecated Use `rowInteraction.onActivate`. */
  onRowActivate?: (row: unknown) => void;
  /** @deprecated Use `rowInteraction.onHover`. */
  onRowHover?: (row: unknown) => void;
  /** @deprecated Use `dataState.empty`. */
  emptyMessage?: ReactNode;
  /** @deprecated Use `dataState.skeletonRows`. */
  skeletonRows?: number;
  /** @deprecated Use `appearance.striped`. */
  striped?: boolean;
}

import type { MouseEvent as ReactMouseEvent } from 'react';
import type { Cell, Header, Row } from '@tanstack/react-table';

import type { DataTableController } from './data-table-controller';
import { mergeRenderContextFields } from './data-table-features/registry';

// Typed, framework-neutral render contexts. Each context exposes values,
// metadata, and commands only — never a preassembled toolbar/filter/selection/
// menu/pagination/overlay/data-state control (those belong to DataGrid). Every
// command routes through the single DataTable controller, so a command invoked
// from any context mutates the same engine instance the rest of the view reads.
//
// Each factory merges the feature registry's contributions over its own base
// values (ADR-0002's `renderContext` point). Two rules make that safe:
//
//  1. A feature may replace a base value — that is how a shipped default becomes
//     real. `tree.loadState` is the worked example: it ships as `'idle'` and
//     becomes a live request state when U2's lazy-children machine lands.
//  2. Two features may not set the same field. The composer throws, naming both.

export type DataTableSortDirection = 'asc' | 'desc' | false;

/** Loaded/loading/empty projection status derived by the view. */
export type DataTableRenderStatus = 'loading' | 'empty' | 'loaded';

/**
 * Context namespaces a feature contribution may reach *into* rather than
 * replace. Without this, a module contributing `tree: { loadState }` would drop
 * `depth`, `hasChildren` and the toggle command along with it.
 */
const NESTED_CONTEXT_NAMESPACES = ['detail', 'tree'] as const;

export interface DataTableHeaderContext {
  readonly columnId: string;
  readonly isPlaceholder: boolean;
  readonly canSort: boolean;
  readonly sortDirection: DataTableSortDirection;
  /** Zero-based multi-sort priority, or -1 when this column is not sorted. */
  readonly sortIndex: number;
  /** Total number of columns currently sorted (for multi-sort priority UI). */
  readonly sortCount: number;
  /**
   * Accessible sort description, e.g. `"sorted descending, priority 2"` in a
   * multi-sort, `"sorted ascending"` for a single sort, or `"not sorted"`.
   */
  readonly sortDescription: string;
  readonly isVisible: boolean;
  /** Cycles this column's sort; `multi` keeps other sorted columns. */
  readonly toggleSort: (multi?: boolean) => void;
  readonly clearSort: () => void;
}

/**
 * Lazy-children status for a tree row, keyed by row ID outside both expansion
 * slices. A row with no configured lazy loader is always `idle`; the loader and
 * its request-key machine arrive with the `tree` feature, which replaces this
 * field through the registry's `renderContext` point.
 */
export type DataTableTreeLoadState = 'idle' | 'loading' | 'loaded' | 'error';

/**
 * Detail expansion — a render-layer projection over the `detailExpanded` slice.
 * It has no TanStack row-model involvement and shares no ID namespace, state
 * key, or callback with `tree` (ADR-0001).
 */
export interface DataTableRowDetailContext {
  readonly isExpanded: boolean;
  readonly canExpand: boolean;
  readonly toggle: (expanded?: boolean) => void;
}

/**
 * Tree expansion — descendant visibility over the `treeExpanded` slice. This is
 * the domain TanStack's expand row model serves.
 */
export interface DataTableRowTreeContext {
  readonly isExpanded: boolean;
  readonly canExpand: boolean;
  readonly toggle: (expanded?: boolean) => void;
  /** Nesting level of this record row; 0 for a root. */
  readonly depth: number;
  readonly hasChildren: boolean;
  readonly loadState: DataTableTreeLoadState;
}

export interface DataTableRowContext<TData> {
  readonly id: string;
  readonly index: number;
  readonly data: TData;
  readonly isSelected: boolean;
  readonly canSelect: boolean;
  readonly detail: DataTableRowDetailContext;
  readonly tree: DataTableRowTreeContext;
  /**
   * @deprecated Alias of `detail.isExpanded`. Removed with the other table
   * compatibility adapters.
   */
  readonly isExpanded: boolean;
  /** @deprecated Alias of `detail.canExpand`. */
  readonly canExpand: boolean;
  readonly isCurrent: boolean;
  readonly toggleSelected: (selected?: boolean) => void;
  /** @deprecated Alias of `detail.toggle`. */
  readonly toggleExpanded: (expanded?: boolean) => void;
  readonly setCurrent: () => void;
}

export interface DataTableCellContext<TData> {
  readonly columnId: string;
  readonly value: unknown;
  readonly row: DataTableRowContext<TData>;
}

export interface DataTableStateContext {
  readonly status: DataTableRenderStatus;
  readonly isLoading: boolean;
  readonly isEmpty: boolean;
  readonly rowCount: number;
  readonly visibleColumnCount: number;
}

/** Pointer event carrying the row it originated on (hover, click). */
export interface DataTableRowPointerEvent<TData> {
  readonly row: DataTableRowContext<TData>;
  readonly nativeEvent: ReactMouseEvent<HTMLTableRowElement>;
}

/** Row activation via Enter (keyboard) or double-click (pointer). */
export interface DataTableRowActivationEvent<TData> {
  readonly row: DataTableRowContext<TData>;
  readonly via: 'keyboard' | 'pointer';
}

/** Pointer event carrying the cell it originated on (hover, click). */
export interface DataTableCellPointerEvent<TData> {
  readonly cell: DataTableCellContext<TData>;
  readonly nativeEvent: ReactMouseEvent<HTMLTableCellElement>;
}

function describeSort(
  direction: DataTableSortDirection,
  sortIndex: number,
  sortCount: number
): string {
  if (direction === false) {
    return 'not sorted';
  }

  const base = direction === 'asc' ? 'sorted ascending' : 'sorted descending';

  return sortCount > 1 ? `${base}, priority ${sortIndex + 1}` : base;
}

/**
 * Applies a feature contribution over a base context. Top-level fields replace;
 * the `detail`/`tree` namespaces merge one level deep, so a feature can set one
 * field without discarding the rest of the namespace.
 */
function applyContribution<Context extends object>(
  base: Context,
  fields: Readonly<Record<string, unknown>>
): Context {
  if (Object.keys(fields).length === 0) {
    return base;
  }

  const merged = { ...base } as Record<string, unknown>;

  for (const [key, value] of Object.entries(fields)) {
    const baseValue = merged[key];
    const mergeable =
      (NESTED_CONTEXT_NAMESPACES as readonly string[]).includes(key) &&
      typeof baseValue === 'object' &&
      baseValue !== null &&
      typeof value === 'object' &&
      value !== null;

    merged[key] = mergeable ? { ...baseValue, ...value } : value;
  }

  return merged as Context;
}

export function createHeaderContext<TData, RowId extends string = string>(
  header: Header<TData, unknown>,
  controller?: DataTableController<TData, RowId>
): DataTableHeaderContext {
  const { column } = header;
  const sortCount = header.getContext().table.getState().sorting.length;
  const sortDirection = column.getIsSorted();
  const sortIndex = column.getSortIndex();

  const base: DataTableHeaderContext = {
    columnId: column.id,
    isPlaceholder: header.isPlaceholder,
    canSort: column.getCanSort(),
    sortDirection,
    sortIndex,
    sortCount,
    sortDescription: describeSort(sortDirection, sortIndex, sortCount),
    isVisible: column.getIsVisible(),
    toggleSort: (multi) => column.toggleSorting(undefined, multi),
    clearSort: () => column.clearSorting(),
  };

  // The controller argument is optional so the factory keeps working for a caller
  // that only has a header (it is a public export). Without it there is no
  // registry to consult, so the base context is the whole context.
  if (controller === undefined) {
    return base;
  }

  return applyContribution(
    base,
    mergeRenderContextFields(
      'header context field',
      controller.getFeatures().renderContext.header,
      header
    )
  );
}

export function createRowContext<TData, RowId extends string>(
  row: Row<TData>,
  controller: DataTableController<TData, RowId>
): DataTableRowContext<TData> {
  const rowId = row.id as RowId;
  const state = controller.getState();
  const expansion = controller.getExpansion();
  // Both domains read their own slice through the controller rather than
  // TanStack's row methods, so each one means what it says whichever domain the
  // engine's single `expanded` feature is currently bound to (ADR-0001).
  const expand = (domain: 'detail' | 'tree') => (expanded?: boolean) =>
    controller.toggle({
      type: 'expand-row',
      id: rowId,
      domain,
      ...(expanded === undefined ? {} : { expanded }),
    });
  const hasChildren = row.subRows.length > 0;
  const detail: DataTableRowDetailContext = {
    isExpanded: state.detailExpanded.has(rowId),
    canExpand: expansion.canExpandDetail(row),
    toggle: expand('detail'),
  };
  const tree: DataTableRowTreeContext = {
    isExpanded: state.treeExpanded.has(rowId),
    canExpand: hasChildren,
    toggle: expand('tree'),
    depth: row.depth,
    hasChildren,
    loadState: 'idle',
  };

  const base: DataTableRowContext<TData> = {
    id: row.id,
    index: row.index,
    data: row.original,
    isSelected: row.getIsSelected(),
    canSelect: row.getCanSelect(),
    detail,
    tree,
    isExpanded: detail.isExpanded,
    canExpand: detail.canExpand,
    isCurrent: state.currentRowId === rowId,
    toggleSelected: (selected) => row.toggleSelected(selected),
    toggleExpanded: detail.toggle,
    setCurrent: () =>
      controller.requestChange('currentRowId', rowId, 'pointer'),
  };

  return applyContribution(
    base,
    mergeRenderContextFields(
      'row context field',
      controller.getFeatures().renderContext.row,
      row
    )
  );
}

export function createCellContext<TData, RowId extends string>(
  cell: Cell<TData, unknown>,
  controller: DataTableController<TData, RowId>
): DataTableCellContext<TData> {
  // No feature contribution is merged here, and that is deliberate rather than
  // pending. A `cell` scope existed on `DataTableRenderContextContribution`, was
  // filled by no module and claimed by no unit, and #50 deleted it — this merge went
  // with it, because live plumbing behind a deleted declaration is worse than the
  // declaration was: there is no longer anything to notice it by.
  //
  // What reaches a cell instead: `row` is a full `DataTableRowContext`, so every
  // **row**-keyed contribution the `row` scope makes is already here. Only a
  // **column**-keyed or (row, column)-keyed field would need a scope of its own, and
  // that is the bar for adding one back.
  return {
    columnId: cell.column.id,
    value: cell.getValue(),
    row: createRowContext(cell.row, controller),
  };
}

export function createStateContext(input: {
  readonly status: DataTableRenderStatus;
  readonly rowCount: number;
  readonly visibleColumnCount: number;
}): DataTableStateContext {
  return {
    status: input.status,
    isLoading: input.status === 'loading',
    isEmpty: input.status === 'empty',
    rowCount: input.rowCount,
    visibleColumnCount: input.visibleColumnCount,
  };
}

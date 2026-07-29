import type {
  DataTableCellPointerEvent,
  DataTableChangeEvent,
  DataTablePaginationState,
  DataTableQueryChangeEvent,
  DataTableRowActivationEvent,
  DataTableRowPointerEvent,
  DataTableSlice,
  DataTableSliceValue,
} from '../data-table';
// Deep, type-only import on purpose: the lazy-children event shape is U2's, the
// `data-table/index.ts` barrel is a manifest file, and this is one feature reaching
// across its own two halves rather than a new cross-component dependency — the same
// precedent U1 set for `detailRowDomId`.
import type { DataTableTreeLoadEvent } from '../data-table/data-table-tree';

// The named screen callbacks (design §5.3). These are what a screen binds to:
// one callback per meaningful transition, each carrying the enriched event
// (cause, the complete next state, the query, and its request key) rather than a
// bare value.
//
// Every slice-derived event below is the controller's own `DataTableChangeEvent`
// narrowed to the slice it reports, so there is exactly one event shape in the
// family and no parallel vocabulary to keep in sync.
//
// Ordering rule: a config-level handler runs first and owns the behavior; the
// named callback observes afterwards. That applies to `server.onQueryChange` vs
// `callbacks.onQueryChange`, `rowInteraction.on*` vs `callbacks.onRow*`,
// `actions.onAction` vs `callbacks.onRowAction`, and `dataState.onRetry` vs
// `callbacks.onDataStateAction`.

/** Selection changed. `value` is the next selected-row-id set. */
export type DataGridSelectionChangeEvent<RowId extends string = string> =
  DataTableChangeEvent<'selection', ReadonlySet<RowId>, RowId>;

/**
 * Detail expansion changed. `value` is the next set of expanded row ids.
 *
 * Detail and tree expansion never share a slice, a callback, or an id namespace
 * (ADR-0001), so this fires for `detailExpanded` only and `onTreeExpansionChange`
 * fires for `treeExpanded` only.
 */
export type DataGridDetailExpansionChangeEvent<RowId extends string = string> =
  DataTableChangeEvent<'detailExpanded', ReadonlySet<RowId>, RowId>;

/**
 * Tree expansion changed. `value` is the next set of expanded row ids.
 *
 * The counterpart of `DataGridDetailExpansionChangeEvent` and deliberately not a
 * variant of it: the two domains share no slice, callback, or id namespace
 * (ADR-0001), so a caller subscribing to one never hears the other.
 */
export type DataGridTreeExpansionChangeEvent<RowId extends string = string> =
  DataTableChangeEvent<'treeExpanded', ReadonlySet<RowId>, RowId>;

/** The current (roving-focus) row changed. `value` is the next row id. */
export type DataGridCurrentRowChangeEvent<RowId extends string = string> =
  DataTableChangeEvent<'currentRowId', RowId | undefined, RowId>;

/** Page index or page size changed. */
export type DataGridPaginationChangeEvent<RowId extends string = string> =
  DataTableChangeEvent<'pagination', DataTablePaginationState, RowId>;

/** The column-state slices reported by `onColumnStateChange`. */
export type DataGridColumnSlice = Extract<
  DataTableSlice,
  'columnVisibility' | 'columnOrder' | 'columnSizing' | 'columnPinning'
>;

/**
 * A column preference changed. `slice` says which one, so a screen persisting
 * column preferences can branch without subscribing to four callbacks.
 */
export type DataGridColumnStateChangeEvent<RowId extends string = string> =
  DataTableChangeEvent<
    DataGridColumnSlice,
    DataTableSliceValue<DataGridColumnSlice, RowId>,
    RowId
  >;

/** A row action was invoked (after any confirmation dialog was accepted). */
export interface DataGridRowActionEvent<TData> {
  readonly actionId: string;
  readonly row: TData;
}

/**
 * A data-state recovery control was activated. `append-retry` arrives with the
 * P1 append state; today the only reachable action is the error-state retry.
 */
export interface DataGridDataStateActionEvent {
  readonly action: 'retry';
}

/**
 * Named callbacks a screen binds to. Every member is optional; supplying none
 * costs nothing.
 *
 * The P1 feature groups own the rest of the design's callback list
 * (`onTreeLoad`, `onGroupingChange`, `onScroll`) — they land with the features
 * that emit them rather than as callbacks that can never fire.
 * `onDetailExpansionChange` landed with U1 and `onTreeExpansionChange` with U2.
 *
 * **`onTreeLoad` is still absent deliberately, and it will get no projection when
 * it lands.** It is not slice-derived: `resolveSliceCallbacks` maps onto
 * `DataTableSlice`, and the lazy-children machine is required to live outside both
 * expansion slices (`data-table/behavior.md`). There is no `treeLoad` slice and
 * there must not be one — it fires from the machine directly. Recorded so a
 * reviewer does not read the missing projection as an omission.
 *
 * **This file is shared by four Wave 1 units** (U1 here, U2's tree callbacks, U4's
 * grouping, U6's scroll). Each addition is two edits — the interface member and its
 * `resolveSliceCallbacks` projection — so treat it as a manifest: append, never
 * reformat, and check nobody else is mid-edit first.
 */
export interface DataGridCallbacks<TData, RowId extends string = string> {
  /** Every slice transition, in one place. */
  onStateChange?: (
    event: DataTableChangeEvent<DataTableSlice, unknown, RowId>
  ) => void;
  /**
   * Every atomic query transition (sorting / filters / global filter / grouping
   * / pagination). In server mode `server.onQueryChange` is authoritative and
   * runs first; this only observes the same event and must not start a second
   * request.
   */
  onQueryChange?: (event: DataTableQueryChangeEvent) => void;
  onSelectionChange?: (event: DataGridSelectionChangeEvent<RowId>) => void;
  onDetailExpansionChange?: (
    event: DataGridDetailExpansionChangeEvent<RowId>
  ) => void;
  onTreeExpansionChange?: (
    event: DataGridTreeExpansionChangeEvent<RowId>
  ) => void;
  /**
   * Each lazy-children transition: `loading`, then `loaded` or `error`, carrying
   * the request key that identifies the attempt.
   *
   * **No `resolveSliceCallbacks` projection, deliberately** — see the note on this
   * interface. It reaches the machine through `tree.onLoad` instead, which is a
   * `controllerOptions` member rather than a slice handler.
   */
  onTreeLoad?: (event: DataTableTreeLoadEvent<TData>) => void;
  onCurrentRowChange?: (event: DataGridCurrentRowChangeEvent<RowId>) => void;
  onPaginationChange?: (event: DataGridPaginationChangeEvent<RowId>) => void;
  onColumnStateChange?: (event: DataGridColumnStateChangeEvent<RowId>) => void;
  onRowHover?: (event: DataTableRowPointerEvent<TData>) => void;
  onRowClick?: (event: DataTableRowPointerEvent<TData>) => void;
  onRowActivate?: (event: DataTableRowActivationEvent<TData>) => void;
  onCellHover?: (event: DataTableCellPointerEvent<TData>) => void;
  onCellClick?: (event: DataTableCellPointerEvent<TData>) => void;
  onRowAction?: (event: DataGridRowActionEvent<TData>) => void;
  onDataStateAction?: (event: DataGridDataStateActionEvent) => void;
}

/** The per-slice callback map the shared controller consumes. */
export type DataGridSliceCallbacks<RowId extends string = string> = Partial<{
  [Slice in DataTableSlice]: (
    event: DataTableChangeEvent<Slice, DataTableSliceValue<Slice>, RowId>
  ) => void;
}>;

/**
 * Projects the named callbacks onto the controller's per-slice map. The four
 * column slices fan into the single `onColumnStateChange`.
 *
 * Returns `undefined` when nothing is bound, so the controller installs no
 * per-slice handlers at all.
 */
export function resolveSliceCallbacks<TData, RowId extends string>(
  callbacks: DataGridCallbacks<TData, RowId> | undefined
): DataGridSliceCallbacks<RowId> | undefined {
  if (callbacks === undefined) {
    return undefined;
  }

  const map: DataGridSliceCallbacks<RowId> = {};

  if (callbacks.onSelectionChange !== undefined) {
    map.selection = callbacks.onSelectionChange as NonNullable<
      DataGridSliceCallbacks<RowId>['selection']
    >;
  }
  if (callbacks.onDetailExpansionChange !== undefined) {
    map.detailExpanded = callbacks.onDetailExpansionChange as NonNullable<
      DataGridSliceCallbacks<RowId>['detailExpanded']
    >;
  }
  if (callbacks.onTreeExpansionChange !== undefined) {
    map.treeExpanded = callbacks.onTreeExpansionChange as NonNullable<
      DataGridSliceCallbacks<RowId>['treeExpanded']
    >;
  }
  if (callbacks.onCurrentRowChange !== undefined) {
    map.currentRowId = callbacks.onCurrentRowChange as NonNullable<
      DataGridSliceCallbacks<RowId>['currentRowId']
    >;
  }
  if (callbacks.onPaginationChange !== undefined) {
    map.pagination = callbacks.onPaginationChange as NonNullable<
      DataGridSliceCallbacks<RowId>['pagination']
    >;
  }
  if (callbacks.onColumnStateChange !== undefined) {
    // One handler serves four slices. Assigned per slice rather than through a
    // loop: a union-keyed index write would require the handler to satisfy the
    // *intersection* of all four event types, which no single handler can.
    const fanIn = callbacks.onColumnStateChange;
    map.columnVisibility = fanIn as NonNullable<
      DataGridSliceCallbacks<RowId>['columnVisibility']
    >;
    map.columnOrder = fanIn as NonNullable<
      DataGridSliceCallbacks<RowId>['columnOrder']
    >;
    map.columnSizing = fanIn as NonNullable<
      DataGridSliceCallbacks<RowId>['columnSizing']
    >;
    map.columnPinning = fanIn as NonNullable<
      DataGridSliceCallbacks<RowId>['columnPinning']
    >;
  }

  return Object.keys(map).length > 0 ? map : undefined;
}

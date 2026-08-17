import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  type ColumnDef,
  type Row,
  type SortingState,
  type Table,
  type TableOptions,
  type Updater,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  type DataTableChangeCause,
  type DataTableChangeEvent,
  type DataTableColumnPinningState,
  type DataTablePaginationState,
  type DataTableQueryChangeEvent,
  type DataTableSlice,
  type DataTableSortDescriptor,
  type DataTableSliceValue,
  type DataTableState,
  type DataTableStateInput,
} from './data-table-contract';
import type { DataTableViewBridge } from './data-table-body-window';
import type { DataTableInlineDirection } from './data-table-inline-direction';
import { DATA_TABLE_FEATURES } from './data-table-features';
import {
  composeEngineOptions,
  composeRenderContext,
  runFeatureEffects,
  type DataTableFeatureContextBase,
  type DataTableFeatureGates,
  type DataTableFeatureId,
  type DataTableFeatureModule,
  type DataTableRenderContextResolvers,
} from './data-table-features/registry';
import {
  neutralFiltersToTanStack,
  setToRecord,
} from './data-table-features/translate';
import {
  inspectDataTablePluginTopology,
  prepareDataTableExtensions,
  type DataTableEnginePlugin,
  type DataTablePrivatePluginRegistry,
} from './data-table-engine-plugins';
import {
  normalizeDataTableEngineOptions,
  type DataTableEngineOptions,
} from './data-table-engine-options';
import { createDataTableQuery } from './data-table-query';
import { createDefaultDataTableState } from './data-table-state';

// Per-feature config interfaces are declared in and owned by their own
// `data-table-features/<feature>.ts`. The unions below reference them, so a
// Wave 1/2 unit fills in its own file and never opens this one (ADR-0002, BL-1).
// Re-exported so the public entry point's export list does not change.
import type { DataTableColumnsFeaturesConfig } from './data-table-features/columns';
import type { DataTableDetailExpansionConfig } from './data-table-features/detail-expansion';
import type { DataTableFilteringConfig } from './data-table-features/filtering';
import type { DataTableFooterConfig } from './data-table-features/footer';
import type { DataTableGroupingConfig } from './data-table-features/grouping';
import type { DataTablePaginationConfig } from './data-table-features/pagination';
import type { DataTablePersistenceConfig } from './data-table-features/persistence';
import type { DataTableSelectionConfig } from './data-table-features/selection';
import type { DataTableSortingConfig } from './data-table-features/sorting';
import type { DataTableTreeConfig } from './data-table-features/tree';
import type { DataTableVirtualizationConfig } from './data-table-features/virtualization';

export type {
  DataTableColumnsFeaturesConfig,
  DataTableDetailExpansionConfig,
  DataTableFilteringConfig,
  DataTableFooterConfig,
  DataTableGroupingConfig,
  DataTablePaginationConfig,
  DataTablePersistenceConfig,
  DataTableSelectionConfig,
  DataTableSortingConfig,
  DataTableTreeConfig,
  DataTableVirtualizationConfig,
};

declare const process: {
  readonly env: { readonly NODE_ENV?: string };
};

/**
 * Every state slice, derived rather than hand-listed.
 *
 * A new slice used to be declared in three places — `DataTableState` plus the
 * `requiredSlices` array (both in `data-table-contract.ts`), the defaults in
 * `data-table-state.ts`, and a copy here. U4 owns the first two files but must
 * not open this one, so its group-collapse slice had nowhere to land.
 *
 * The required slices now follow `createDefaultDataTableState` automatically: a
 * slice with a default appears here the moment U4 adds one. The two *optional*
 * slices have no default by definition — `assertDefinedSlice` permits them to be
 * explicitly `undefined` and `assertDataTableStateIntegrity` excludes them — so
 * they are passed in to make them enumerable. They are the only names left here,
 * and no planned slice is optional.
 */
const STATE_SLICES = Object.keys(
  createDefaultDataTableState({
    globalFilter: undefined,
    currentRowId: undefined,
  })
) as readonly DataTableSlice[];

const QUERY_RESET_SLICES = new Set<DataTableSlice>([
  'sorting',
  'columnFilters',
  'globalFilter',
  'grouping',
]);

// Slices that participate in the query identity; a change to any of them can
// emit a DataTableQueryChangeEvent.
const QUERY_SLICES = new Set<DataTableSlice>([
  'sorting',
  'columnFilters',
  'globalFilter',
  'grouping',
  'pagination',
]);

type IdentitySlice =
  'selection' | 'detailExpanded' | 'treeExpanded' | 'currentRowId';

export type IdentityFreeDataTableState<RowId extends string = string> = Omit<
  DataTableStateInput<RowId>,
  IdentitySlice
> & {
  [Slice in IdentitySlice]?: never;
};

interface RowInteractionConfig {
  readonly reserve?: boolean;
  readonly current?: boolean;
}

interface DataTableControllerBaseOptions<TData, RowId extends string> {
  readonly columns: ColumnDef<TData, unknown>[];
  readonly data: TData[];
  readonly state?: DataTableStateInput<RowId>;
  readonly defaultState?: DataTableStateInput<RowId>;
  readonly sorting?: boolean | DataTableSortingConfig;
  readonly filtering?: boolean | DataTableFilteringConfig;
  readonly pagination?: boolean | DataTablePaginationConfig;
  /**
   * Identity-free behavior groups, pre-declared so a Wave 1/2 unit fills in its
   * own `data-table-features/<feature>.ts` and never reopens this union
   * (ADR-0002, BL-1).
   *
   * They live on the base options rather than in the identity split below because
   * every one of them is keyed by column ID or by index, never by row ID.
   * Requiring `getRowId` from a caller who only wants a footer would be a bug.
   */
  readonly columnsFeatures?: false | DataTableColumnsFeaturesConfig;
  readonly grouping?: false | DataTableGroupingConfig;
  readonly footer?: false | DataTableFooterConfig<TData>;
  readonly virtualization?: false | DataTableVirtualizationConfig;
  readonly persistence?: false | DataTablePersistenceConfig;
  /** Sort server-side: track sort state but do not sort client rows. */
  readonly manualSorting?: boolean;
  /** Filter server-side: track filter state but do not filter client rows. */
  readonly manualFiltering?: boolean;
  /** Paginate server-side: track page state but do not slice client rows. */
  readonly manualPagination?: boolean;
  /** Group server-side: track grouping state but do not group client rows. */
  readonly manualGrouping?: boolean;
  /** Total row count for manual pagination (when the page count is unknown). */
  readonly rowCount?: number;
  /** Total page count for manual pagination. */
  readonly pageCount?: number;
  readonly engineOptions?: DataTableEngineOptions<TData>;
  readonly plugins?: readonly DataTableEnginePlugin<TData>[];
  readonly onStateChange?: (
    event: DataTableChangeEvent<DataTableSlice, unknown, RowId>
  ) => void;
  /**
   * Fires once per atomic query transition (a change to sorting, filters, global
   * filter, grouping, or pagination). Carries the previous and next query and the
   * canonical request key of the next query. A query-changing sort/filter/group
   * resets `pageIndex` in the same transition, so only the post-reset key is
   * emitted. The caller owns fetch/cancellation; stale results are the caller's
   * responsibility (compare against the latest `requestKey`).
   */
  readonly onQueryChange?: (event: DataTableQueryChangeEvent) => void;
  readonly onSliceChange?: Partial<{
    [Slice in DataTableSlice]: (
      event: DataTableChangeEvent<
        Slice,
        DataTableSliceValue<Slice, RowId>,
        RowId
      >
    ) => void;
  }>;
}

interface IdentityFreeOptions<RowId extends string> {
  readonly getRowId?: never;
  readonly selection?: false;
  readonly detailExpansion?: never;
  readonly tree?: never;
  readonly rowInteraction?: false;
  readonly actions?: false;
  readonly server?: false;
  readonly getSubRows?: never;
  readonly getRowCanExpand?: never;
  readonly renderExpandedRow?: never;
  readonly state?: IdentityFreeDataTableState<RowId>;
  readonly defaultState?: IdentityFreeDataTableState<RowId>;
}

interface IdentityOptions<TData, RowId extends string> {
  readonly getRowId: (row: TData, index: number, parent?: Row<TData>) => RowId;
  readonly selection?: false | DataTableSelectionConfig<TData>;
  readonly detailExpansion?: false | DataTableDetailExpansionConfig<TData>;
  readonly tree?: false | DataTableTreeConfig<TData>;
  readonly rowInteraction?: false | RowInteractionConfig;
  readonly actions?: false | Readonly<Record<string, unknown>>;
  readonly server?: false | Readonly<Record<string, unknown>>;
  readonly getSubRows?: (row: TData, index: number) => TData[] | undefined;
  readonly getRowCanExpand?: (row: Row<TData>) => boolean;
  readonly renderExpandedRow?: (row: Row<TData>) => ReactNode;
}

export type DataTableControllerOptions<TData, RowId extends string = string> =
  | (DataTableControllerBaseOptions<TData, RowId> & IdentityFreeOptions<RowId>)
  | (DataTableControllerBaseOptions<TData, RowId> &
      IdentityOptions<TData, RowId>);

export interface DeprecatedDataTableControllerOptions<TData> {
  readonly columns: ColumnDef<TData, unknown>[];
  readonly data: TData[];
  readonly getRowId?: (
    row: TData,
    index: number,
    parent?: Row<TData>
  ) => string;
  readonly getRowCanExpand?: (row: Row<TData>) => boolean;
  readonly renderExpandedRow?: (row: Row<TData>) => ReactNode;
  readonly sorting?: boolean;
  readonly filtering?: boolean;
  readonly pagination?: boolean;
  readonly manualSorting?: boolean;
  readonly manualFiltering?: boolean;
  readonly manualPagination?: boolean;
  readonly manualGrouping?: boolean;
  readonly rowCount?: number;
  readonly pageCount?: number;
  readonly onQueryChange?: (event: DataTableQueryChangeEvent) => void;
  readonly engineOptions?: DataTableEngineOptions<TData>;
  readonly plugins?: readonly DataTableEnginePlugin<TData>[];
  readonly onStateChange?: (
    event: DataTableChangeEvent<DataTableSlice, unknown>
  ) => void;
  readonly onSliceChange?: Partial<{
    [Slice in DataTableSlice]: (
      event: DataTableChangeEvent<Slice, DataTableSliceValue<Slice>>
    ) => void;
  }>;
  readonly state?: IdentityFreeDataTableState;
  readonly defaultState?: IdentityFreeDataTableState;
  readonly selection?: never;
  readonly detailExpansion?: never;
  readonly tree?: never;
  readonly rowInteraction?: never;
  readonly actions?: never;
  readonly server?: never;
  readonly getSubRows?: never;
  /**
   * The pre-declared behavior groups are `never` here for the same reason every
   * other grouped config is: this overload exists to keep the legacy expansion
   * aliases narrow, so a modern group alongside them is a type error rather than
   * a silently mixed configuration.
   */
  readonly columnsFeatures?: never;
  readonly grouping?: never;
  readonly footer?: never;
  readonly virtualization?: never;
  readonly persistence?: never;
}

type AnyControllerOptions<TData, RowId extends string> =
  | DataTableControllerOptions<TData, RowId>
  | DeprecatedDataTableControllerOptions<TData>;

/**
 * Which expansion domain owns which mechanism (ADR-0001). TanStack ships one
 * expand/collapse row model and it walks `row.subRows` only, so `tree` owns it;
 * detail expansion is a render-layer projection over the `detailExpanded` slice
 * and never enters the row model.
 */
export interface DataTableExpansionDomains<TData> {
  /** Tree relationships are configured, so TanStack's `expanded` means tree. */
  readonly treeEnabled: boolean;
  /** Detail expansion is configured, through the modern config or an alias. */
  readonly detailEnabled: boolean;
  /**
   * Detail-domain expandability. A library predicate evaluated by the detail
   * feature — never TanStack's `getRowCanExpand`, whose subrow-based default is
   * tree truth.
   */
  readonly canExpandDetail: (row: Row<TData>) => boolean;
}

/**
 * The library-internal feature-registry runtime, shared by the controller and the
 * view so both project the same feature set over the same engine instance. Not a
 * public extension point — the public one is `plugins` (design §4.1).
 */
export interface DataTableFeatureRuntime<TData, RowId extends string> {
  readonly modules: readonly DataTableFeatureModule[];
  readonly configs: Readonly<Partial<Record<DataTableFeatureId, unknown>>>;
  readonly gates: DataTableFeatureGates<TData>;
  readonly renderContext: DataTableRenderContextResolvers<TData>;
  /** The controller-side context, for the points the view invokes. */
  /**
   * The **base** context — deliberately without `config`. Only `contextFor`
   * inside the registry may attach a module's own config, so nothing downstream
   * can hand a module the shared context by mistake.
   */
  readonly context: DataTableFeatureContextBase<TData, RowId>;
}

interface InternalTableOptions<
  TData,
  RowId extends string,
> extends TableOptions<TData> {
  __dataTableState: DataTableState<RowId>;
  __dataTableRequest: <Slice extends DataTableSlice>(
    slice: Slice,
    updater: Updater<DataTableSliceValue<Slice, RowId>>,
    cause?: DataTableChangeCause
  ) => DataTableChangeEvent<Slice, DataTableSliceValue<Slice, RowId>, RowId>;
  __dataTableRegistry: DataTablePrivatePluginRegistry;
  __dataTableExpansion: DataTableExpansionDomains<TData>;
  __dataTableFeatures: DataTableFeatureRuntime<TData, RowId>;
  __dataTableId: string;
  __dataTableViewBridge: DataTableViewBridge;
  __dataTableReportInlineDirection: (
    direction: DataTableInlineDirection
  ) => void;
}

/**
 * Supported imperative toggle operations. These replace the legacy Vue
 * one-for-one mutation methods (toggleRowSelection, toggleAllSelection,
 * toggleRowExpansion, setCurrentRow, clearSelection); each maps onto an
 * immutable slice request with an `api` cause. There is intentionally no
 * force-render action — immutable state updates drive rendering.
 *
 * The last three members are **pre-declared for units that do not own this
 * file** (ADR-0002, BL-3b). This union plus the `toggle` switch below is the same
 * hand-listed-surface problem as the options unions: U6 could not ship
 * `measureLayout()` or scroll-to-row, and U4 could not ship group collapse,
 * without editing both. Their switch arms exist, so no Wave 1/2 unit reopens the
 * controller for an action.
 */
export type DataTableToggleAction<RowId extends string = string> =
  | {
      readonly type: 'select-row';
      readonly id: RowId;
      readonly selected?: boolean;
    }
  | { readonly type: 'select-all'; readonly selected?: boolean }
  | { readonly type: 'clear-selection' }
  | {
      readonly type: 'expand-row';
      readonly id: RowId;
      readonly expanded?: boolean;
      readonly domain?: 'detail' | 'tree';
    }
  | { readonly type: 'set-current-row'; readonly id?: RowId }
  /** U6. Re-measures row geometry; replaces the legacy `doLayout()`. */
  | { readonly type: 'measure-layout' }
  /** U6. Scrolls a record row into view by its record index. */
  | { readonly type: 'scroll-to-row'; readonly index: number }
  /** U4. Collapses or expands a synthetic group row by its group ID. */
  | {
      readonly type: 'toggle-group';
      readonly groupId: string;
      readonly expanded?: boolean;
    }
  /**
   * Moves one group to a page, for per-group paging (PLTFRM-93295).
   *
   * Absolute rather than a delta: a relative "next page" would need the caller to
   * know the group's current page and its row count, and a click arriving twice
   * would advance twice. The pager knows both, so it sends where it wants to be.
   */
  | {
      readonly type: 'set-group-page';
      readonly groupId: string;
      readonly page: number;
    };

export interface DataTableController<TData, RowId extends string = string> {
  readonly table: Table<TData>;
  /** Stable DOM id root for this table, for the §7 ARIA id schemes. */
  readonly tableId: string;
  getState(): DataTableState<RowId>;
  getQuery(): ReturnType<typeof createDataTableQuery<RowId>>;
  getPluginRegistry(): DataTablePrivatePluginRegistry;
  /** Reports how the two expansion domains are bound for this controller. */
  getExpansion(): DataTableExpansionDomains<TData>;
  /** The library-internal feature-registry runtime. */
  getFeatures(): DataTableFeatureRuntime<TData, RowId>;
  /**
   * The channel the view publishes its imperative window operations through. The
   * controller owns the toggle-action union but cannot reach the view's scroll
   * container, so `measure-layout` and `scroll-to-row` are dispatched here.
   * Library-internal; not a public extension point.
   */
  getViewBridge(): DataTableViewBridge;
  /**
   * The view reporting which way the inline axis runs, from a real element (#97).
   *
   * ── WHY THE CONTROLLER CANNOT ANSWER THIS ITSELF ─────────────────────────────
   * `table-core` decides a resize drag's sign from `columnResizeDirection`, an
   * **engine option** — so the answer has to be in `table.options`, which this
   * controller builds. But direction is a *rendered* fact: it lives on an element,
   * and the controller runs upstream of every element. Exactly the gap
   * `getViewBridge` exists for, one step further — the bridge lets the controller
   * *call* the DOM, and this lets the view *tell* it something.
   *
   * ── WHY A PUSH FROM THE VIEW AND NOT A PULL THROUGH THE BRIDGE ───────────────
   * The bridge's members are published in a **passive** effect, so a pull from here
   * could not happen until after the first paint — leaving a window, however
   * short, in which a drag would use the default. The view pushes from its own
   * **layout** effect instead, which React runs before paint, so the option is
   * correct by the time anything can be pressed. Measured rather than assumed:
   * `columnResizeDirection` is read per pointer move inside the engine's updater
   * (`ColumnSizing.js:123`), not captured when the handler is built, so a value
   * that lands before the first move is in time.
   *
   * ── WHY IT IS NOT A STATE SLICE ──────────────────────────────────────────────
   * A slice would be caller-controllable, and a caller setting the resize
   * direction by hand is the option this fix rejected: it would contradict the
   * keyboard path, which resolves direction live and correctly without being told.
   * This is an observation, not a preference — nothing persists it.
   *
   * Idempotent: reporting the direction it already holds does nothing, so the
   * view may call it on every layout pass.
   */
  reportInlineDirection(direction: DataTableInlineDirection): void;
  requestChange<Slice extends DataTableSlice>(
    slice: Slice,
    updater: Updater<DataTableSliceValue<Slice, RowId>>,
    cause?: DataTableChangeCause
  ): DataTableChangeEvent<Slice, DataTableSliceValue<Slice, RowId>, RowId>;
  /**
   * Explicitly clears one slice, or every slice when omitted, to its default
   * value with a `reset` cause. Uncontrolled slices commit; controlled slices
   * only emit their change event for the owner to apply.
   */
  reset(slice?: DataTableSlice): void;
  /** Applies a supported imperative toggle as an immutable slice request. */
  toggle(action: DataTableToggleAction<RowId>): void;
}

function hasOwnSlice(
  state: DataTableStateInput | undefined,
  slice: DataTableSlice
): boolean {
  return (
    state !== undefined && Object.prototype.hasOwnProperty.call(state, slice)
  );
}

function hasOwn(value: object, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function resolveUpdater<Value>(
  updater: Updater<Value>,
  previous: Value
): Value {
  return typeof updater === 'function'
    ? (updater as (value: Value) => Value)(previous)
    : updater;
}

function sameSet(
  left: ReadonlySet<string>,
  right: ReadonlySet<string>
): boolean {
  return (
    left.size === right.size && [...left].every((value) => right.has(value))
  );
}

/** Ordered id lists — `columnOrder`, `grouping`. Order carries meaning in both. */
function sameStringList(
  left: readonly string[],
  right: readonly string[]
): boolean {
  return left.length === right.length && left.every((id, i) => id === right[i]);
}

/** Records of primitives keyed by column id — `columnVisibility`, `columnSizing`. */
function samePrimitiveRecord(
  left: Readonly<Record<string, boolean | number>>,
  right: Readonly<Record<string, boolean | number>>
): boolean {
  const keys = Object.keys(left);

  return (
    keys.length === Object.keys(right).length &&
    keys.every(
      (key) =>
        Object.prototype.hasOwnProperty.call(right, key) &&
        left[key] === right[key]
    )
  );
}

/**
 * `true` only when the two values for `slice` are **positively established** to be
 * equal. Anything this cannot compare returns `false`, and the write proceeds.
 *
 * **The direction is the point, not an implementation detail.** The only caller uses
 * this to SKIP a state write, so a wrong `true` silently drops a legitimate update —
 * a defect that is never reported, because nothing visibly breaks at the moment it
 * happens; the value is simply stale from then on. A wrong `false` costs one
 * redundant render. The two errors are not comparable, so this must fail towards
 * writing.
 *
 * That is why the switch is **exhaustive over `DataTableSlice`** and the `default`
 * arm assigns to `never`: **adding a state slice will not compile until its author
 * states the comparison**, and while one is missing the runtime answer is `false`,
 * which is the safe branch rather than the convenient one.
 *
 * Values arrive as `unknown` because the caller is generic over `Slice` and each arm
 * narrows to a different value type; every cast is discharged by the `case` label
 * directly above it.
 */
function sliceValueUnchanged(
  slice: DataTableSlice,
  left: unknown,
  right: unknown
): boolean {
  switch (slice) {
    // Row-id and group-id sets. `sameSet` is the comparison the data-reconcile
    // effect below already uses for exactly three of these four.
    case 'selection':
    case 'detailExpanded':
    case 'treeExpanded':
    case 'groupCollapsed':
      return sameSet(left as ReadonlySet<string>, right as ReadonlySet<string>);

    case 'columnOrder':
    case 'grouping':
      return sameStringList(
        left as readonly string[],
        right as readonly string[]
      );

    case 'columnVisibility':
    case 'columnSizing':
      return samePrimitiveRecord(
        left as Readonly<Record<string, boolean | number>>,
        right as Readonly<Record<string, boolean | number>>
      );

    case 'columnPinning': {
      const a = left as DataTableColumnPinningState;
      const b = right as DataTableColumnPinningState;

      return sameStringList(a.left, b.left) && sameStringList(a.right, b.right);
    }

    case 'sorting': {
      const a = left as readonly DataTableSortDescriptor[];
      const b = right as readonly DataTableSortDescriptor[];

      return (
        a.length === b.length &&
        a.every(
          (entry, i) => entry.id === b[i]?.id && entry.desc === b[i]?.desc
        )
      );
    }

    case 'pagination': {
      const a = left as DataTablePaginationState;
      const b = right as DataTablePaginationState;

      return a.pageIndex === b.pageIndex && a.pageSize === b.pageSize;
    }

    case 'currentRowId':
      return Object.is(left, right);

    // ── NO COMPARISON, DELIBERATELY, AND BY NAME RATHER THAN BY OMISSION ──────
    //
    // Both carry `SerializableValue`: arbitrary caller-supplied nested objects and
    // arrays. Comparing them means a deep-equality implementation whose failure
    // mode is a **dropped filter**, and `JSON.stringify` is not an equality test —
    // key order, `undefined` members and non-finite numbers each make it disagree
    // with equality in one direction or the other. So these two always write,
    // exactly as they did before this guard existed.
    case 'columnFilters':
    case 'globalFilter':
      return false;

    // Per-group page indices (PLTFRM-93295). Compared by content rather than by
    // reference because the reducer rebuilds the map on every page change, so a
    // reference check would report "changed" for a no-op page set — and a no-op
    // write here re-renders every row of every group.
    case 'groupPagination': {
      const before = left as ReadonlyMap<string, number>;
      const after = right as ReadonlyMap<string, number>;
      if (before.size !== after.size) return false;
      for (const [groupId, page] of before) {
        if (after.get(groupId) !== page) return false;
      }

      return true;
    }

    default: {
      // A new slice must state its comparison. This assignment is the forcing
      // function; the `false` is the safe answer while the statement is missing.
      const unhandled: never = slice;
      void unhandled;

      return false;
    }
  }
}

/**
 * The ordered ids roving focus can land on, as the user sees them.
 *
 * `getRowModel()` rather than `getCoreRowModel()`, so filtering, sorting and
 * pagination are already applied; group headers excluded, because they are in that
 * list and cannot hold roving focus. Used only for design §7 clause 3's positional
 * fallback — membership questions stay on `flatRows`.
 */
function focusableRowIds<TData, RowId extends string>(
  table: Table<TData>
): RowId[] {
  return table
    .getRowModel()
    .rows.filter((row) => !row.getIsGrouped())
    .map((row) => row.id as RowId);
}

/** A grouped config's object form, or `undefined` for `false`/absent/boolean. */
function objectConfig(options: object, key: string): unknown {
  if (!hasOwn(options, key)) {
    return undefined;
  }
  const value = (options as Record<string, unknown>)[key];

  return typeof value === 'object' && value !== null ? value : undefined;
}

export function useDataTable<TData, RowId extends string = string>(
  options: DataTableControllerOptions<TData, RowId>
): DataTableController<TData, RowId>;
export function useDataTable<TData>(
  options: DeprecatedDataTableControllerOptions<TData>
): DataTableController<TData, string>;
export function useDataTable<TData, RowId extends string = string>(
  options: AnyControllerOptions<TData, RowId>
): DataTableController<TData, RowId> {
  const { columns, data, state, defaultState, engineOptions, plugins } =
    options;
  const tableId = useId();
  // One stable object for the lifetime of the controller. Deliberately a ref
  // rather than state: the view publishes imperative handles into it during an
  // effect, and that must not trigger a render.
  const viewBridge = useRef<DataTableViewBridge>({}).current;
  // #97. `'ltr'` until the view reports otherwise, which matches both the browser's
  // default and `table-core`'s — so a table that never reports (no view, a test
  // harness, SSR) behaves exactly as it did before this existed. See
  // `reportInlineDirection` for why the value arrives from the view and why it is
  // not a slice.
  const [inlineDirection, setInlineDirection] =
    useState<DataTableInlineDirection>('ltr');
  const [uncontrolledState, setUncontrolledState] = useState(() =>
    createDefaultDataTableState<RowId>(
      defaultState as DataTableStateInput<RowId> | undefined
    )
  );

  const normalizedState = createDefaultDataTableState<RowId>({
    ...uncontrolledState,
    ...(state as DataTableStateInput<RowId> | undefined),
  });

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    for (const slice of STATE_SLICES) {
      if (hasOwnSlice(state, slice) && hasOwnSlice(defaultState, slice)) {
        console.error(
          `DataTable state slice "${slice}" cannot be supplied in both state and defaultState. The controlled value takes precedence.`
        );
      }
    }
  }, [defaultState, state]);

  const hasLegacyAliases =
    hasOwn(options, 'getRowCanExpand') || hasOwn(options, 'renderExpandedRow');
  const hasModernDetailExpansion = hasOwn(options, 'detailExpansion');
  const hasDuplicateExpansionConfig =
    hasLegacyAliases && hasModernDetailExpansion;

  if (process.env.NODE_ENV !== 'production' && hasDuplicateExpansionConfig) {
    throw new TypeError(
      'DataTable detailExpansion cannot be combined with deprecated expansion aliases.'
    );
  }

  const usesLegacyExpansion = hasLegacyAliases && !hasModernDetailExpansion;
  const getRowId = hasOwn(options, 'getRowId') ? options.getRowId : undefined;

  useEffect(() => {
    if (
      process.env.NODE_ENV !== 'production' &&
      usesLegacyExpansion &&
      getRowId === undefined
    ) {
      console.error(
        'Deprecated DataTable expansion without getRowId uses non-reserving index identity.'
      );
    }
  }, [getRowId, usesLegacyExpansion]);

  const pluginTopology = inspectDataTablePluginTopology<TData>(plugins ?? []);
  const initialPluginTopologyRef = useRef(pluginTopology);
  const initialPluginTopology = initialPluginTopologyRef.current;
  const samePluginTopology =
    initialPluginTopology.descriptorIdentities.length ===
      pluginTopology.descriptorIdentities.length &&
    initialPluginTopology.descriptorIdentities.every(
      (descriptor, index) =>
        descriptor === pluginTopology.descriptorIdentities[index] &&
        initialPluginTopology.setupIdentities[index] ===
          pluginTopology.setupIdentities[index]
    ) &&
    initialPluginTopology.fingerprint === pluginTopology.fingerprint;

  if (!samePluginTopology) {
    throw new TypeError(
      'DataTable plugin topology cannot change during a controller lifetime.'
    );
  }

  const [preparedPlugins] = useState(() =>
    prepareDataTableExtensions({ plugins }, pluginTopology)
  );
  const normalizedEngineOptions =
    normalizeDataTableEngineOptions(engineOptions);

  const requestChange = useMemo(() => {
    let requestedState = normalizedState;
    let requestedQuery = createDataTableQuery(normalizedState);

    return <Slice extends DataTableSlice>(
      slice: Slice,
      updater: Updater<DataTableSliceValue<Slice, RowId>>,
      cause: DataTableChangeCause = 'api'
    ) => {
      const currentValue = requestedState[slice] as DataTableSliceValue<
        Slice,
        RowId
      >;
      const nextValue = resolveUpdater(updater, currentValue);

      // A request whose value did not change still allocated a new state object
      // below, and React bails out only on `Object.is` — so every redundant request
      // re-rendered. That is what let TanStack's automatic `resetExpanded` spin this
      // controller forever: 11,293 writes in 8s, stable DOM, flat heap. Bail before
      // the allocation instead.
      //
      // No `setUncontrolledState`, and no callbacks: **a change event for something
      // that did not change is a false statement, not a courtesy.** The returned
      // event still describes the request truthfully — the state and the query are
      // the current ones, because that is what they are.
      if (sliceValueUnchanged(slice, currentValue, nextValue)) {
        return {
          slice,
          value: nextValue,
          cause,
          state: requestedState,
          query: requestedQuery,
          requestKey: requestedQuery.requestKey,
        };
      }

      let nextState = createDefaultDataTableState<RowId>({
        ...requestedState,
        [slice]: nextValue,
      });

      if (
        QUERY_RESET_SLICES.has(slice) &&
        nextState.pagination.pageIndex !== 0
      ) {
        nextState = createDefaultDataTableState<RowId>({
          ...nextState,
          pagination: { ...nextState.pagination, pageIndex: 0 },
        });
      }

      const query = createDataTableQuery(nextState);
      const event: DataTableChangeEvent<
        Slice,
        DataTableSliceValue<Slice, RowId>,
        RowId
      > = {
        slice,
        value: nextValue,
        cause,
        state: nextState,
        query,
        requestKey: query.requestKey,
      };

      setUncontrolledState((previous) => {
        const committed = { ...previous };

        if (!hasOwnSlice(state, slice)) {
          Object.assign(committed, { [slice]: nextValue });
        }
        if (
          QUERY_RESET_SLICES.has(slice) &&
          !hasOwnSlice(state, 'pagination')
        ) {
          committed.pagination = nextState.pagination;
        }

        return createDefaultDataTableState<RowId>(committed);
      });

      const previousQuery = requestedQuery;
      requestedState = nextState;
      requestedQuery = query;
      options.onSliceChange?.[slice]?.(event as never);
      options.onStateChange?.(event);
      if (
        QUERY_SLICES.has(slice) &&
        query.requestKey !== previousQuery.requestKey
      ) {
        options.onQueryChange?.({
          previousQuery,
          query,
          cause,
          requestKey: query.requestKey,
        });
      }

      return event;
    };
  }, [normalizedState, options, state]);

  /* ---------------------------- Feature gates ----------------------------- */
  // Identity logic stays here, never in a module (ADR-0002 scope boundary): the
  // identity-free/identity discrimination, `getRowId` handling and reconciliation
  // are the controller's. A module reads the verdict.

  const sortingConfig =
    typeof options.sorting === 'object' ? options.sorting : undefined;
  const manualSorting = options.manualSorting === true;
  const manualFiltering = options.manualFiltering === true;
  const manualPagination = options.manualPagination === true;
  const manualGrouping = options.manualGrouping === true;
  // Manual modes track their slice/state and emit changes but leave the client
  // rows untouched; the caller processes them server-side.
  const sortingEnabled =
    options.sorting === true || sortingConfig !== undefined || manualSorting;
  const filteringEnabled =
    options.filtering === true ||
    typeof options.filtering === 'object' ||
    manualFiltering;
  const paginationEnabled =
    options.pagination === true ||
    typeof options.pagination === 'object' ||
    manualPagination;
  const selectionConfig =
    hasOwn(options, 'selection') &&
    'selection' in options &&
    typeof options.selection === 'object'
      ? (options.selection as DataTableSelectionConfig<TData>)
      : undefined;
  const detailEnabled =
    (hasModernDetailExpansion &&
      'detailExpansion' in options &&
      options.detailExpansion !== false) ||
    usesLegacyExpansion;
  const hasSubRows =
    hasOwn(options, 'getSubRows') &&
    'getSubRows' in options &&
    options.getSubRows !== undefined;
  // ADR-0001. TanStack ships exactly one expand/collapse feature and
  // `getExpandedRowModel()` walks `row.subRows` only, so the feature belongs to
  // `tree`. `getSubRows` on its own is enough to mean tree: without subrows a
  // `tree` config has nothing to reveal, and with them the caller has already
  // described a tree.
  const treeEnabled =
    (hasOwn(options, 'tree') &&
      'tree' in options &&
      options.tree !== undefined &&
      options.tree !== false) ||
    hasSubRows;
  // Detail expansion is a render-layer projection over `detailExpanded` and
  // needs no row model. The one exception is the frozen legacy adapter: those
  // call sites drive `row.getIsExpanded()` / `row.toggleExpanded()` from their
  // own column defs, so as long as no tree is configured `state.expanded` keeps
  // carrying `detailExpanded` for them. The aliases and this branch are removed
  // together in the next major (design §10.8).
  const legacyDetailBinding = usesLegacyExpansion && !treeEnabled;
  const expandedSlice: 'detailExpanded' | 'treeExpanded' = legacyDetailBinding
    ? 'detailExpanded'
    : 'treeExpanded';
  const legacyCanExpand =
    usesLegacyExpansion &&
    'getRowCanExpand' in options &&
    options.getRowCanExpand !== undefined
      ? options.getRowCanExpand
      : undefined;
  // Matches what `row.getCanExpand()` reports today for every configuration that
  // predates this split; once a tree exists, subrows are tree truth and say
  // nothing about whether a row has detail content.
  const canExpandDetail = (row: Row<TData>) =>
    legacyCanExpand?.(row) ?? (treeEnabled ? false : row.subRows.length > 0);
  const expansionDomains: DataTableExpansionDomains<TData> = {
    treeEnabled,
    detailEnabled,
    canExpandDetail,
  };

  const gates: DataTableFeatureGates<TData> = {
    // Derived from the caller's own inputs, never from `normalizedState` — which
    // has every slice populated and so cannot express "the caller did not ask for
    // this". `persistence` is the consumer; see the members' docs in `registry.ts`.
    controlledSlices: new Set(
      STATE_SLICES.filter((slice) => hasOwnSlice(state, slice))
    ),
    defaultedSlices: new Set(
      STATE_SLICES.filter((slice) => hasOwnSlice(defaultState, slice))
    ),
    sortingEnabled,
    filteringEnabled,
    paginationEnabled,
    manualSorting,
    manualFiltering,
    manualPagination,
    manualGrouping,
    treeEnabled,
    detailEnabled,
    hasSubRows,
    canExpandDetail,
    ...(hasSubRows &&
    'getSubRows' in options &&
    options.getSubRows !== undefined
      ? { getSubRows: options.getSubRows }
      : {}),
    expandedSlice,
    legacyDetailBinding,
    ...(legacyCanExpand === undefined ? {} : { legacyCanExpand }),
    ...(options.rowCount !== undefined ? { rowCount: options.rowCount } : {}),
    ...(options.pageCount !== undefined
      ? { pageCount: options.pageCount }
      : {}),
  };

  const featureConfigs: Readonly<Partial<Record<DataTableFeatureId, unknown>>> =
    {
      columns: objectConfig(options, 'columnsFeatures'),
      tree: objectConfig(options, 'tree'),
      filtering: objectConfig(options, 'filtering'),
      grouping: objectConfig(options, 'grouping'),
      sorting: sortingConfig,
      selection: selectionConfig,
      pagination: objectConfig(options, 'pagination'),
      'detail-expansion': objectConfig(options, 'detailExpansion'),
      footer: objectConfig(options, 'footer'),
      virtualization: objectConfig(options, 'virtualization'),
      persistence: objectConfig(options, 'persistence'),
    };

  /* -------------------------- The feature context -------------------------- */
  // `table` is a thunk, and that is load-bearing twice over. `onExpandedChange`
  // reads `table.getCoreRowModel().flatRows` inside a callback declared in the
  // literal that produces `table`, and the slice it writes to is `expandedSlice`,
  // computed just above — before `useReactTable` runs. Hoisting either one breaks
  // silently; the two `ExpandedState === true` tests in
  // `data-table-controller.test.tsx` are what catch it, one per binding.

  // Flipped once `useReactTable` has returned. Before that the `table` binding
  // below is in its temporal dead zone, and reading it produces a bare
  // `ReferenceError: Cannot access 'table' before initialization` — an error that
  // names neither the rule that was broken nor the fix. Two operators hit exactly
  // that in one day; one recognised it only because the hazard was documented, and
  // the other spent a diagnosis on it. A named error means the next person needs
  // neither the README nor the recognition.
  let engineExists = false;

  const featureContext: DataTableFeatureContextBase<TData, RowId> = {
    table: () => {
      if (!engineExists) {
        throw new TypeError(
          'DataTable: ctx.table() was called while contribution points were being composed, before the engine exists. `data` and other plain values cannot reach the table — call ctx.table() inside a closure the later phase invokes (an `on*Change` handler, a `renderContext` resolver, `effects`), never in the body of `engineOptions`.'
        );
      }

      return table;
    },
    state: normalizedState,
    gates,
    tableId,
    requestChange,
    // Post-`dataState` by construction: the config layer contributes `data` into
    // the controller's prop, so this is the array a feature must copy. See the
    // member's doc for why exposing it is what makes the wrong array unreachable.
    data,
  };

  // Neither composer touches `ctx.table()`; they build closures that will.
  const composedEngineOptions = composeEngineOptions(
    DATA_TABLE_FEATURES,
    featureContext,
    featureConfigs
  );
  const renderContextResolvers = composeRenderContext(
    DATA_TABLE_FEATURES,
    featureContext,
    featureConfigs
  );

  const featureRuntime: DataTableFeatureRuntime<TData, RowId> = {
    modules: DATA_TABLE_FEATURES,
    configs: featureConfigs,
    gates,
    renderContext: renderContextResolvers,
    context: featureContext,
  };

  const internalState = {
    sorting: [...normalizedState.sorting] as SortingState,
    columnFilters: neutralFiltersToTanStack(normalizedState.columnFilters),
    globalFilter: normalizedState.globalFilter,
    columnVisibility: normalizedState.columnVisibility,
    columnOrder: [...normalizedState.columnOrder],
    columnSizing: normalizedState.columnSizing,
    columnPinning: {
      left: [...normalizedState.columnPinning.left],
      right: [...normalizedState.columnPinning.right],
    },
    rowSelection: setToRecord(normalizedState.selection),
    expanded: setToRecord(normalizedState[expandedSlice]),
    grouping: [...normalizedState.grouping],
    pagination: normalizedState.pagination,
  };

  const table = useReactTable({
    data,
    columns,
    state: internalState,
    getRowId,
    ...normalizedEngineOptions,
    autoResetPageIndex: false,
    _features: [...preparedPlugins.features],
    getCoreRowModel: getCoreRowModel(),
    // Every feature-gated option and every `on*Change` handler arrives from the
    // registry. The caller's allowlisted `engineOptions` are spread above and
    // cannot collide: their only members are the six `debug*` keys plus
    // `renderFallbackValue`, none of which any feature sets.
    ...composedEngineOptions,
    // #97. Set unconditionally rather than from the columns feature: it is a fact
    // about the document, not about whether resizing is switched on, and the engine
    // ignores it when nothing is being resized. Spread AFTER the feature options on
    // purpose — no feature sets it, and this is the one place that may.
    //
    // ⚠ `columnResizeDirection` is `rejected-library-contract` in
    // `data-table-engine-options.ts`, and that is about **caller passthrough**: a
    // consumer may not hand it in, because they would then own keeping it in sync
    // with the rendered direction. The kit setting it from a live read is the
    // mechanism that rejection assumes exists.
    columnResizeDirection: inlineDirection,
    __dataTableState: normalizedState,
    __dataTableRequest: requestChange,
    __dataTableRegistry: preparedPlugins.registry,
    __dataTableExpansion: expansionDomains,
    __dataTableFeatures: featureRuntime,
    __dataTableId: tableId,
    __dataTableViewBridge: viewBridge,
    // Guarded so a report of the direction already held is not a render. The view
    // calls this from a layout effect that runs on every pass, so without the
    // comparison every layout pass would schedule one.
    __dataTableReportInlineDirection: (direction: DataTableInlineDirection) => {
      setInlineDirection((previous) =>
        previous === direction ? previous : direction
      );
    },
  } as InternalTableOptions<TData, RowId>);

  // From here on `ctx.table()` resolves. Every closure built during composition
  // runs at or after this point, which is why the thunk is safe at all.
  engineExists = true;

  // Feature effects, in manifest order, each with its own config. Routed through
  // the registry rather than looped here: a hand-written loop is what passed the
  // base context raw and left `ctx.config` undefined for every consumer.
  runFeatureEffects(DATA_TABLE_FEATURES, featureContext, featureConfigs);

  const previousDataRef = useRef(data);
  // The ordered focusable-row ids as of the previous render. Clause 3's "same index"
  // is a question about POSITION, and `ids` below cannot answer it: it is built from
  // `getCoreRowModel().flatRows`, which is right for membership but is pre-filter,
  // pre-sort and pre-pagination. So the position has to come from the list the user
  // actually sees, captured before the row that occupied it went away.
  const previousFocusableRowIdsRef = useRef<RowId[]>([]);

  useEffect(() => {
    if (previousDataRef.current === data) {
      return;
    }
    previousDataRef.current = data;

    if (getRowId === undefined) {
      return;
    }

    const ids = new Set(
      table.getCoreRowModel().flatRows.map((row) => row.id as RowId)
    );
    const reconcileSet = (
      slice: 'selection' | 'detailExpanded' | 'treeExpanded',
      reserve: boolean
    ) => {
      if (reserve) {
        return;
      }
      const current = tableOptions<TData, RowId>(table).__dataTableState[slice];
      const next = new Set([...current].filter((id) => ids.has(id)));

      if (!sameSet(current, next)) {
        tableOptions<TData, RowId>(table).__dataTableRequest(
          slice,
          next,
          'data-reconcile'
        );
      }
    };

    reconcileSet(
      'selection',
      hasOwn(options, 'selection') &&
        typeof options.selection === 'object' &&
        options.selection.reserve === true
    );
    reconcileSet(
      'detailExpanded',
      hasOwn(options, 'detailExpansion') &&
        'detailExpansion' in options &&
        typeof options.detailExpansion === 'object' &&
        options.detailExpansion.reserve === true
    );
    reconcileSet(
      'treeExpanded',
      hasOwn(options, 'tree') &&
        'tree' in options &&
        typeof options.tree === 'object' &&
        options.tree.reserve === true
    );

    const currentRowId = tableOptions<TData, RowId>(table).__dataTableState
      .currentRowId;
    const reserveCurrent =
      hasOwn(options, 'rowInteraction') &&
      'rowInteraction' in options &&
      typeof options.rowInteraction === 'object' &&
      options.rowInteraction.reserve === true;

    if (
      !reserveCurrent &&
      currentRowId !== undefined &&
      !ids.has(currentRowId)
    ) {
      // ── Design §7 clause 3, rungs 1 and 2 ──────────────────────────────────
      //
      // Before this, the current row was simply CLEARED, which strands the keyboard
      // user: the next arrow key has nowhere to resume from.
      //
      // Rung 1 is the row now at the removed row's position; rung 2 is the last
      // surviving row, which is the answer when the removed row was at or past the
      // new end. `??` is the whole chain, because "index no longer exists" and "the
      // list got shorter" are the same condition.
      //
      // POSITION IS MEASURED OVER `getRowModel().rows`, EXCLUDING GROUP HEADERS —
      // recorded because it is a choice and the alternatives are defensible. Roving
      // focus is a visual affordance, so the index a user perceives is the one in the
      // post-filter/sort/pagination list they can see, not in `flatRows`. Group rows
      // are in that list (`getIsGrouped()`) and cannot hold roving focus, so counting
      // them would land rung 1 on a group header. Tree descendants ARE records and DO
      // occupy positions (ADR-0001 OQ-2), so they are deliberately counted.
      //
      // Rungs 3 and 4 — toolbar, then scroll container — move DOM focus, which the
      // controller cannot do: `tableId` never reaches an attribute. They are reached
      // through the view bridge below, and this is the chain's only junction.
      const previousFocusable = previousFocusableRowIdsRef.current;
      const removedIndex = previousFocusable.indexOf(currentRowId);
      const surviving = focusableRowIds<TData, RowId>(table);
      const fallback =
        removedIndex < 0
          ? undefined
          : (surviving[removedIndex] ?? surviving[surviving.length - 1]);

      // ONE request, which is design §7 clause 4 — "exactly one `data-reconcile`
      // event updates the current row". Resolving the whole chain to a single value
      // before requesting is what makes that structural rather than something to
      // remember: there is no branch here that can request twice.
      tableOptions<TData, RowId>(table).__dataTableRequest(
        'currentRowId',
        fallback,
        'data-reconcile'
      );

      // ── Design §7 clause 3, rungs 3 and 4 ─────────────────────────────────
      //
      // Rungs 1 and 2 both missed, so no row can carry focus and the chain
      // continues in the DOM. The seam decides between the toolbar and the scroll
      // container; this is only the junction, which has to be here because it is
      // the one place that knows both rungs missed.
      //
      // `removedIndex >= 0` IS THE CHAIN, not a defensive check. `fallback` is
      // `undefined` for two different reasons: the table has no focusable row left
      // (rungs 3-4 apply), or the removed current row was not in the visible
      // focusable list at all — filtered out, or on another page — in which case
      // DOM focus was never on it and moving focus would TAKE it from wherever the
      // person actually is. Only the first is a §7 case.
      //
      // Not conditional on `virtualization`: the view publishes this member for
      // every table, so windowing cannot change which rung the chain stops at.
      if (fallback === undefined && removedIndex >= 0) {
        viewBridge.focusAfterRowLoss?.();
      }
    }
  }, [data, getRowId, options, table, viewBridge]);

  // Declared AFTER the reconcile effect on purpose, and it is the ordering that makes
  // this correct: React runs effects in declaration order, so when a data change runs
  // the effect above, this one has not yet overwritten the ref — it still holds the
  // list as it was BEFORE the removal, which is the only moment the removed row's
  // position exists. No dependency array, because sorting and filtering reorder the
  // list without changing `data`, and a ref refreshed only on data changes would hand
  // clause 3 a position from two changes ago.
  useEffect(() => {
    previousFocusableRowIdsRef.current = focusableRowIds<TData, RowId>(table);
  });

  return useMemo<DataTableController<TData, RowId>>(
    () => ({
      table,
      tableId: tableOptions<TData, RowId>(table).__dataTableId,
      getState: () => tableOptions<TData, RowId>(table).__dataTableState,
      getQuery: () =>
        createDataTableQuery(
          tableOptions<TData, RowId>(table).__dataTableState
        ),
      getPluginRegistry: () =>
        tableOptions<TData, RowId>(table).__dataTableRegistry,
      getExpansion: () =>
        tableOptions<TData, RowId>(table).__dataTableExpansion,
      getFeatures: () => tableOptions<TData, RowId>(table).__dataTableFeatures,
      getViewBridge: () =>
        tableOptions<TData, RowId>(table).__dataTableViewBridge,
      reportInlineDirection: (direction) =>
        tableOptions<TData, RowId>(table).__dataTableReportInlineDirection(
          direction
        ),
      requestChange: (slice, updater, cause = 'api') =>
        tableOptions<TData, RowId>(table).__dataTableRequest(
          slice,
          updater,
          cause
        ),
      reset: (slice) => {
        const request = tableOptions<TData, RowId>(table).__dataTableRequest;
        const defaults = createDefaultDataTableState<RowId>();
        const targets = slice === undefined ? STATE_SLICES : [slice];

        for (const target of targets) {
          request(
            target,
            defaults[target] as DataTableSliceValue<typeof target, RowId>,
            'reset'
          );
        }
      },
      toggle: (action) => {
        const options = tableOptions<TData, RowId>(table);
        const request = options.__dataTableRequest;
        const state = options.__dataTableState;

        switch (action.type) {
          // ── Both selection arms DELEGATE to the engine ──────────────────────
          //
          // They used to write the slice by hand — `next.add(action.id)` — and
          // hardcode `'api'`. That re-implemented TanStack's `mutateRowIsSelected`
          // (`RowSelection.js:292-316`) while omitting all three things it does, so
          // a caller driving selection through this public action got a selection
          // model that **disagreed with the checkbox** in three configurations:
          //
          //  1. **single-select mode REPLACES rather than accumulates** — the engine
          //     clears every key when `!row.getCanMultiSelect()`;
          //  2. **an ineligible row is REFUSED** — the engine gates on
          //     `row.getCanSelect()`, i.e. the caller's `isRowSelectable`;
          //  3. **selection CASCADES to sub-rows** when `getCanSelectSubRows()` —
          //     which is a policy another unit owns, silently dropped by omission.
          //
          // Delegating is the same insight the `cause` channel rests on: there is one
          // selection algorithm and this is not the place to keep a second. It also
          // gets the cause for free — `row.toggleSelected` routes through
          // `onRowSelectionChange`, the one funnel, which reads
          // `selectionChangeCause()` and falls back to the controller's `'api'`
          // default. So these arms deliberately do **not** name a cause: hardcoding
          // `'api'` here would override a caller who wrapped the call to claim a real
          // provenance.
          case 'select-row': {
            // Resolved from the core row model rather than `table.getRow(id, true)`,
            // which THROWS for an unknown id. An unknown id is a no-op instead, and
            // that is a deliberate non-delegation: the previous behaviour added the id
            // to the slice, and the data-reconcile effect pruned it on the next data
            // change anyway, so selecting a phantom was never durable. Turning it into
            // an exception inside a caller's event handler would be a new failure mode
            // this change was not asked to introduce.
            const row = table.getCoreRowModel().rowsById[action.id];
            if (row === undefined) {
              break;
            }
            row.toggleSelected(action.selected);
            break;
          }
          case 'select-all': {
            // `toggleAllPageRowsSelected` runs `mutateRowIsSelected` per row
            // (`RowSelection.js:66-72`), so this arm had the same three divergences —
            // verified in the source rather than assumed, because the sibling
            // `toggleAllRowsSelected` deliberately does *not* use it ("for performance
            // reasons", `:49`) and would not have fixed anything.
            //
            // It also resolves the toggle default better than the hand-written version
            // did: `getIsAllPageRowsSelected()` filters to `row.getCanSelect()` before
            // comparing, so a page whose only unselected rows are ineligible counts as
            // fully selected and toggling it clears instead of pointlessly re-adding.
            table.toggleAllPageRowsSelected(action.selected);
            break;
          }
          case 'clear-selection': {
            request('selection', new Set<RowId>(), 'api');
            break;
          }
          case 'expand-row': {
            const targetSlice =
              action.domain === 'tree' ? 'treeExpanded' : 'detailExpanded';
            const expanded =
              action.expanded ?? !state[targetSlice].has(action.id);
            request(
              targetSlice,
              (previous) => {
                const next = new Set(previous);
                if (expanded) {
                  next.add(action.id);
                } else {
                  next.delete(action.id);
                }
                return next;
              },
              'api'
            );
            break;
          }
          case 'set-current-row': {
            request('currentRowId', action.id, 'api');
            break;
          }
          // The three pre-declared arms (ADR-0002, BL-3b).
          //
          // The two windowing actions dispatch through the view bridge rather
          // than throwing unconditionally. Pre-declaring the union member is not
          // enough on its own to make an action implementable: the controller
          // owns the union but cannot reach the view's scroll container, so
          // without this path U6 would have to reopen `data-table-view.tsx` —
          // the one thing the seam exists to prevent. They still throw while the
          // seam supplies no implementation, because a shipped action that
          // quietly no-ops is worse than one that says it is not implemented.
          case 'measure-layout': {
            const measure = options.__dataTableViewBridge.measureLayout;
            if (measure === undefined) {
              throw new TypeError(
                'DataTable toggle "measure-layout" requires the virtualization feature, which is not implemented yet.'
              );
            }
            measure();
            break;
          }
          case 'scroll-to-row': {
            const scrollToRecord = options.__dataTableViewBridge.scrollToRecord;
            if (scrollToRecord === undefined) {
              throw new TypeError(
                'DataTable toggle "scroll-to-row" requires the virtualization feature, which is not implemented yet.'
              );
            }
            scrollToRecord(action.index);
            break;
          }
          // Group collapse needs a state slice rather than a view handle, and
          // `groupCollapsed` is that slice (U4). The action inverts it, because
          // the slice records what is SHUT — `expanded: true` means "not
          // collapsed" — so that the empty default leaves every group open.
          //
          // Unlike the two windowing arms this one needs no bridge: the state is
          // the whole mechanism, so the action works whether or not a view is
          // mounted, and there is nothing that could go stale.
          // Per-group paging (PLTFRM-93295). Like `toggle-group` this needs no view
          // bridge: the state is the whole mechanism, and the row model reads it
          // through the memo key.
          case 'set-group-page': {
            request(
              'groupPagination',
              (previous) => {
                const next = new Map(previous);
                const page = Math.max(0, Math.floor(action.page));
                // Page 0 is the default, so it is stored as *absence*. Without this
                // the map grows a key per group the user ever paged and then paged
                // back, and a persisted state slice would carry them forever.
                if (page === 0) {
                  next.delete(action.groupId);
                } else {
                  next.set(action.groupId, page);
                }

                return next;
              },
              'api'
            );
            break;
          }
          case 'toggle-group': {
            // Reads as the `expand-row` arm above does, and the inversion sits in
            // exactly one place: omitting `expanded` toggles, and a group that is
            // currently IN the collapsed set is the one that should expand.
            const expanded =
              action.expanded ?? state.groupCollapsed.has(action.groupId);
            request(
              'groupCollapsed',
              (previous) => {
                const next = new Set(previous);
                if (expanded) {
                  next.delete(action.groupId);
                } else {
                  next.add(action.groupId);
                }

                return next;
              },
              'api'
            );
            break;
          }
        }
      },
    }),
    [table]
  );
}

function tableOptions<TData, RowId extends string>(
  table: Table<TData>
): InternalTableOptions<TData, RowId> {
  return table.options as InternalTableOptions<TData, RowId>;
}

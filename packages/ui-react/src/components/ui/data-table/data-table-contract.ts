export type SerializablePrimitive = boolean | null | number | string;

export interface SerializableObject {
  readonly [key: string]: SerializableValue | undefined;
}

export type SerializableValue =
  SerializablePrimitive | SerializableObject | readonly SerializableValue[];

export interface DataTableSortDescriptor {
  readonly id: string;
  readonly desc: boolean;
}

export interface DataTableFilterDescriptor {
  readonly id: string;
  readonly operator?: string;
  readonly value: SerializableValue;
}

export interface DataTablePaginationState {
  readonly pageIndex: number;
  readonly pageSize: number;
}

export interface DataTableColumnPinningState {
  readonly left: readonly string[];
  readonly right: readonly string[];
}

export interface DataTableState<RowId extends string = string> {
  readonly sorting: readonly DataTableSortDescriptor[];
  readonly columnFilters: readonly DataTableFilterDescriptor[];
  readonly globalFilter?: SerializableValue;
  readonly columnVisibility: Readonly<Record<string, boolean>>;
  readonly columnOrder: readonly string[];
  readonly columnSizing: Readonly<Record<string, number>>;
  readonly columnPinning: DataTableColumnPinningState;
  readonly selection: ReadonlySet<RowId>;
  readonly detailExpanded: ReadonlySet<RowId>;
  readonly treeExpanded: ReadonlySet<RowId>;
  readonly grouping: readonly string[];
  /**
   * Which synthetic group rows are **collapsed**, by group ID.
   *
   * Three deliberate choices, each of which reads as an oddity without its
   * reason:
   *
   *  - **Its own slice, not `treeExpanded`** (design §6.5, plan §4 U4). A group
   *    row is synthetic and carries no record ID — TanStack mints
   *    `` `${columnId}:${value}` `` — so keying it into a row-ID slice invites a
   *    collision with a real ID, and would make a caller's controlled
   *    `treeExpanded` carry entries they never put there.
   *  - **`ReadonlySet<string>`, not `ReadonlySet<RowId>`.** That is the same point
   *    stated in the type: a group ID is not a row ID, so it must not be
   *    assignable to one. This is also why `groupCollapsed` is absent from
   *    `IdentitySlice` in the controller — group collapse needs no `getRowId`.
   *  - **Collapsed, not expanded.** The empty default has to mean "every group
   *    open", because a group's members are what the caller asked to see; an
   *    expanded-ID slice would start with every group shut.
   */
  readonly groupCollapsed: ReadonlySet<string>;
  readonly pagination: DataTablePaginationState;
  readonly currentRowId?: RowId;
}

export function assertDataTableStateIntegrity<RowId extends string>(
  state: DataTableState<RowId>
): void {
  const requiredSlices = [
    'sorting',
    'columnFilters',
    'columnVisibility',
    'columnOrder',
    'columnSizing',
    'columnPinning',
    'selection',
    'detailExpanded',
    'treeExpanded',
    'grouping',
    'groupCollapsed',
    'pagination',
  ] as const;

  for (const slice of requiredSlices) {
    if (state[slice] === undefined) {
      throw new TypeError(
        `DataTable state slice "${slice}" cannot be undefined.`
      );
    }
  }

  if (
    state.columnPinning.left === undefined ||
    state.columnPinning.right === undefined
  ) {
    throw new TypeError(
      'DataTable column pinning requires left and right collections.'
    );
  }

  if (
    state.pagination.pageIndex === undefined ||
    state.pagination.pageSize === undefined
  ) {
    throw new TypeError(
      'DataTable state pagination requires pageIndex and pageSize.'
    );
  }
}

export type DataTableSlice = keyof DataTableState;

export type DataTableSliceValue<
  Slice extends DataTableSlice,
  RowId extends string = string,
> = DataTableState<RowId>[Slice];

export type DataTableChangeCause =
  'pointer' | 'keyboard' | 'api' | 'data-reconcile' | 'restore' | 'reset';

export interface DataTableQuery {
  readonly version: 1;
  readonly sorting: readonly DataTableSortDescriptor[];
  readonly filters: readonly DataTableFilterDescriptor[];
  readonly globalFilter?: SerializableValue;
  readonly grouping: readonly string[];
  readonly pagination: DataTablePaginationState;
  readonly requestKey: string;
}

export interface DataTableChangeEvent<
  Slice extends DataTableSlice = DataTableSlice,
  Value = DataTableSliceValue<Slice>,
  RowId extends string = string,
> {
  readonly slice: Slice;
  readonly value: Value;
  readonly cause: DataTableChangeCause;
  readonly state: DataTableState<RowId>;
  readonly query: DataTableQuery;
  readonly requestKey: string;
}

export interface DataTableQueryChangeEvent {
  readonly previousQuery: DataTableQuery;
  readonly query: DataTableQuery;
  readonly cause: DataTableChangeCause;
  readonly requestKey: string;
}

export type DataTableStateInput<RowId extends string = string> = Partial<
  DataTableState<RowId>
>;

export interface DataTableStateAdapterOptions<RowId extends string = string> {
  readonly state?: DataTableStateInput<RowId>;
  readonly defaultState?: DataTableStateInput<RowId>;
  readonly onStateChange?: (
    event: DataTableChangeEvent<DataTableSlice, unknown, RowId>
  ) => void;
}

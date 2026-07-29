import type { TableOptions } from '@tanstack/react-table';

type UnknownRow = unknown;
type Expect<Value extends true> = Value;
type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <
    Value,
  >() => Value extends Right ? 1 : 2
    ? true
    : false;

export const DATA_TABLE_SAFE_ENGINE_OPTION_KEYS = [
  'debugAll',
  'debugCells',
  'debugColumns',
  'debugHeaders',
  'debugRows',
  'debugTable',
  'renderFallbackValue',
] as const;

export type DataTableSafeEngineOptionKey =
  (typeof DATA_TABLE_SAFE_ENGINE_OPTION_KEYS)[number];

export type DataTableEngineOptions<TData> = Partial<
  Pick<TableOptions<TData>, DataTableSafeEngineOptionKey>
>;

type TanStackOptionClassification =
  'safe-diagnostic' | 'safe-render-fallback' | 'rejected-library-contract';

export const TANSTACK_TABLE_OPTION_CLASSIFICATION = {
  _features: 'rejected-library-contract',
  aggregationFns: 'rejected-library-contract',
  autoResetAll: 'rejected-library-contract',
  autoResetExpanded: 'rejected-library-contract',
  autoResetPageIndex: 'rejected-library-contract',
  columnResizeDirection: 'rejected-library-contract',
  columnResizeMode: 'rejected-library-contract',
  columns: 'rejected-library-contract',
  data: 'rejected-library-contract',
  debugAll: 'safe-diagnostic',
  debugCells: 'safe-diagnostic',
  debugColumns: 'safe-diagnostic',
  debugHeaders: 'safe-diagnostic',
  debugRows: 'safe-diagnostic',
  debugTable: 'safe-diagnostic',
  defaultColumn: 'rejected-library-contract',
  enableColumnFilters: 'rejected-library-contract',
  enableColumnPinning: 'rejected-library-contract',
  enableColumnResizing: 'rejected-library-contract',
  enableExpanding: 'rejected-library-contract',
  enableFilters: 'rejected-library-contract',
  enableGlobalFilter: 'rejected-library-contract',
  enableGrouping: 'rejected-library-contract',
  enableHiding: 'rejected-library-contract',
  enableMultiRemove: 'rejected-library-contract',
  enableMultiRowSelection: 'rejected-library-contract',
  enableMultiSort: 'rejected-library-contract',
  enablePinning: 'rejected-library-contract',
  enableRowPinning: 'rejected-library-contract',
  enableRowSelection: 'rejected-library-contract',
  enableSorting: 'rejected-library-contract',
  enableSortingRemoval: 'rejected-library-contract',
  enableSubRowSelection: 'rejected-library-contract',
  filterFns: 'rejected-library-contract',
  filterFromLeafRows: 'rejected-library-contract',
  getColumnCanGlobalFilter: 'rejected-library-contract',
  getCoreRowModel: 'rejected-library-contract',
  getExpandedRowModel: 'rejected-library-contract',
  getFacetedMinMaxValues: 'rejected-library-contract',
  getFacetedRowModel: 'rejected-library-contract',
  getFacetedUniqueValues: 'rejected-library-contract',
  getFilteredRowModel: 'rejected-library-contract',
  getGroupedRowModel: 'rejected-library-contract',
  getIsRowExpanded: 'rejected-library-contract',
  getPaginationRowModel: 'rejected-library-contract',
  getRowCanExpand: 'rejected-library-contract',
  getRowId: 'rejected-library-contract',
  getSortedRowModel: 'rejected-library-contract',
  getSubRows: 'rejected-library-contract',
  globalFilterFn: 'rejected-library-contract',
  groupedColumnMode: 'rejected-library-contract',
  initialState: 'rejected-library-contract',
  isMultiSortEvent: 'rejected-library-contract',
  keepPinnedRows: 'rejected-library-contract',
  manualExpanding: 'rejected-library-contract',
  manualFiltering: 'rejected-library-contract',
  manualGrouping: 'rejected-library-contract',
  manualPagination: 'rejected-library-contract',
  manualSorting: 'rejected-library-contract',
  maxLeafRowFilterDepth: 'rejected-library-contract',
  maxMultiSortColCount: 'rejected-library-contract',
  mergeOptions: 'rejected-library-contract',
  meta: 'rejected-library-contract',
  onColumnFiltersChange: 'rejected-library-contract',
  onColumnOrderChange: 'rejected-library-contract',
  onColumnPinningChange: 'rejected-library-contract',
  onColumnSizingChange: 'rejected-library-contract',
  onColumnSizingInfoChange: 'rejected-library-contract',
  onColumnVisibilityChange: 'rejected-library-contract',
  onExpandedChange: 'rejected-library-contract',
  onGlobalFilterChange: 'rejected-library-contract',
  onGroupingChange: 'rejected-library-contract',
  onPaginationChange: 'rejected-library-contract',
  onRowPinningChange: 'rejected-library-contract',
  onRowSelectionChange: 'rejected-library-contract',
  onSortingChange: 'rejected-library-contract',
  onStateChange: 'rejected-library-contract',
  pageCount: 'rejected-library-contract',
  paginateExpandedRows: 'rejected-library-contract',
  renderFallbackValue: 'safe-render-fallback',
  rowCount: 'rejected-library-contract',
  sortDescFirst: 'rejected-library-contract',
  sortingFns: 'rejected-library-contract',
  state: 'rejected-library-contract',
} as const satisfies Record<
  keyof TableOptions<UnknownRow>,
  TanStackOptionClassification
>;

type ClassifiedSafeEngineOptionKey = {
  [
    Key in keyof typeof TANSTACK_TABLE_OPTION_CLASSIFICATION
  ]: (typeof TANSTACK_TABLE_OPTION_CLASSIFICATION)[Key] extends `safe-${string}`
    ? Key
    : never;
}[keyof typeof TANSTACK_TABLE_OPTION_CLASSIFICATION];

export type _SafeEngineOptionsAreExhaustive = Expect<
  Equal<ClassifiedSafeEngineOptionKey, DataTableSafeEngineOptionKey>
>;

const safeEngineOptionKeys = new Set<string>(
  DATA_TABLE_SAFE_ENGINE_OPTION_KEYS
);

function snapshotEngineOptionProperties(
  input: object
): Readonly<Record<string, unknown>> {
  const descriptors = Object.getOwnPropertyDescriptors(input);
  const snapshot = Object.create(null) as Record<string, unknown>;

  for (const key of Reflect.ownKeys(descriptors)) {
    if (typeof key === 'symbol') {
      throw new TypeError(
        'DataTable engineOptions cannot contain symbol keys.'
      );
    }

    const descriptor = descriptors[key];

    if (descriptor === undefined) {
      throw new TypeError(
        `DataTable engine option "${key}" descriptor is missing.`
      );
    }
    if ('get' in descriptor || 'set' in descriptor) {
      throw new TypeError(
        `DataTable engine option "${key}" must be a data property; accessors are not allowed.`
      );
    }
    if (!safeEngineOptionKeys.has(key)) {
      throw new TypeError(
        `DataTable engine option "${key}" is not in the seven-key diagnostic/render allowlist.`
      );
    }

    Object.defineProperty(snapshot, key, {
      configurable: false,
      enumerable: true,
      value: descriptor.value,
      writable: false,
    });
  }

  return Object.freeze(snapshot);
}

export function normalizeDataTableEngineOptions<TData>(
  input: DataTableEngineOptions<TData> | undefined
): DataTableEngineOptions<TData> {
  if (input === undefined) {
    return {};
  }

  if (
    typeof input !== 'object' ||
    input === null ||
    Array.isArray(input) ||
    (Object.getPrototypeOf(input) !== Object.prototype &&
      Object.getPrototypeOf(input) !== null)
  ) {
    throw new TypeError('DataTable engineOptions must be a plain object.');
  }

  return snapshotEngineOptionProperties(input) as DataTableEngineOptions<TData>;
}

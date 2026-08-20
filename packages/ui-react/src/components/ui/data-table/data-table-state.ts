import { useEffect, useMemo, useRef, useState } from 'react';

import {
  assertDataTableStateIntegrity,
  type DataTableChangeCause,
  type DataTableChangeEvent,
  type DataTableSlice,
  type DataTableSliceValue,
  type DataTableState,
  type DataTableStateInput,
} from './data-table-contract';
import { createDataTableQuery } from './data-table-query';

declare const process: {
  readonly env: { readonly NODE_ENV?: string };
};

const DEFAULT_PAGE_SIZE = 10;
const OPTIONAL_STATE_SLICES = new Set<DataTableSlice>([
  'globalFilter',
  'currentRowId',
]);
const PAGE_RESET_SLICES = new Set<DataTableSlice>([
  'sorting',
  'columnFilters',
  'globalFilter',
  'grouping',
]);

function hasOwnSlice<RowId extends string>(
  state: DataTableStateInput<RowId> | undefined,
  slice: DataTableSlice
): boolean {
  return (
    state !== undefined && Object.prototype.hasOwnProperty.call(state, slice)
  );
}

function assertDefinedSlice<RowId extends string>(
  state: DataTableStateInput<RowId> | undefined,
  slice: DataTableSlice
): void {
  if (
    hasOwnSlice(state, slice) &&
    state?.[slice] === undefined &&
    !OPTIONAL_STATE_SLICES.has(slice)
  ) {
    throw new TypeError(
      `DataTable state slice "${slice}" cannot be explicitly undefined.`
    );
  }
}

export function createDefaultDataTableState<RowId extends string = string>(
  overrides: DataTableStateInput<RowId> = {}
): DataTableState<RowId> {
  for (const slice of Object.keys(overrides) as DataTableSlice[]) {
    assertDefinedSlice(overrides, slice);
  }

  const state: DataTableState<RowId> = {
    sorting: [],
    columnFilters: [],
    columnVisibility: {},
    columnOrder: [],
    columnSizing: {},
    columnPinning: { left: [], right: [] },
    selection: new Set<RowId>(),
    detailExpanded: new Set<RowId>(),
    treeExpanded: new Set<RowId>(),
    grouping: [],
    // Not `Set<RowId>`: a group ID is synthetic (`${columnId}:${value}`) and must
    // not be assignable to a row ID. See the member's doc in the contract.
    groupCollapsed: new Set<string>(),
    // Empty means every group sits on page 0 — see the slice's docblock for why the
    // default has to be the permissive one.
    groupPagination: new Map<string, number>(),
    pagination: { pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE },
    ...overrides,
  };

  assertDataTableStateIntegrity(state);

  return state;
}

type SliceUpdater<Value> = Value | ((previous: Value) => Value);

interface ControllableDataTableSliceOptions<
  Slice extends DataTableSlice,
  RowId extends string,
> {
  readonly slice: Slice;
  readonly state?: DataTableStateInput<RowId>;
  readonly defaultState?: DataTableStateInput<RowId>;
  readonly fallbackValue: DataTableSliceValue<Slice, RowId>;
  readonly stateSnapshot: DataTableState<RowId>;
  readonly onSliceChange?: (
    event: DataTableChangeEvent<Slice, DataTableSliceValue<Slice, RowId>, RowId>
  ) => void;
  readonly onStateChange?: (
    event: DataTableChangeEvent<DataTableSlice, unknown, RowId>
  ) => void;
}

interface ControllableDataTableSliceResult<
  Slice extends DataTableSlice,
  RowId extends string,
> {
  readonly value: DataTableSliceValue<Slice, RowId>;
  readonly requestChange: (
    updater: SliceUpdater<DataTableSliceValue<Slice, RowId>>,
    cause: DataTableChangeCause
  ) => DataTableChangeEvent<Slice, DataTableSliceValue<Slice, RowId>, RowId>;
}

export function useControllableDataTableSlice<
  Slice extends DataTableSlice,
  RowId extends string = string,
>({
  slice,
  state,
  defaultState,
  fallbackValue,
  stateSnapshot,
  onSliceChange,
  onStateChange,
}: ControllableDataTableSliceOptions<
  Slice,
  RowId
>): ControllableDataTableSliceResult<Slice, RowId> {
  const isControlled = hasOwnSlice(state, slice);
  const hasDefault = hasOwnSlice(defaultState, slice);
  const reportedDuplicateRef = useRef(false);

  assertDefinedSlice(state, slice);
  assertDefinedSlice(defaultState, slice);

  useEffect(() => {
    if (
      process.env.NODE_ENV !== 'production' &&
      isControlled &&
      hasDefault &&
      !reportedDuplicateRef.current
    ) {
      reportedDuplicateRef.current = true;
      console.error(
        `DataTable state slice "${slice}" cannot be supplied in both state and defaultState. The controlled state value takes precedence.`
      );
    }
  }, [hasDefault, isControlled, slice]);

  const [uncontrolledValue, setUncontrolledValue] = useState<
    DataTableSliceValue<Slice, RowId>
  >(() => {
    if (hasDefault) {
      return defaultState?.[slice] as DataTableSliceValue<Slice, RowId>;
    }

    return fallbackValue;
  });

  const value = isControlled
    ? (state?.[slice] as DataTableSliceValue<Slice, RowId>)
    : uncontrolledValue;

  const requestChange = useMemo(() => {
    let requestedValue = value;
    let requestedSnapshot = stateSnapshot;

    return (
      updater: SliceUpdater<DataTableSliceValue<Slice, RowId>>,
      cause: DataTableChangeCause
    ) => {
      const nextValue =
        typeof updater === 'function'
          ? (
              updater as (
                previous: DataTableSliceValue<Slice, RowId>
              ) => DataTableSliceValue<Slice, RowId>
            )(requestedValue)
          : updater;
      let nextState: DataTableState<RowId> = {
        ...requestedSnapshot,
        [slice]: nextValue,
      };

      if (
        PAGE_RESET_SLICES.has(slice) &&
        nextState.pagination.pageIndex !== 0
      ) {
        nextState = {
          ...nextState,
          pagination: {
            ...nextState.pagination,
            pageIndex: 0,
          },
        };
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

      if (!isControlled) {
        requestedValue = nextValue;
        requestedSnapshot = nextState;
        setUncontrolledValue(nextValue);
      }

      onSliceChange?.(event);
      onStateChange?.(event);

      return event;
    };
  }, [isControlled, onSliceChange, onStateChange, slice, stateSnapshot, value]);

  return { value, requestChange };
}

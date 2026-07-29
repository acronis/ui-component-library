import { StrictMode, useLayoutEffect } from 'react';
import { act, render, renderHook, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type {
  DataTableChangeEvent,
  DataTableSlice,
  DataTableSliceValue,
  DataTableSortDescriptor,
  DataTableState,
  DataTableStateInput,
} from '../data-table-contract';
import {
  createDefaultDataTableState,
  useControllableDataTableSlice,
} from '../data-table-state';

const fallbackSorting: readonly DataTableSortDescriptor[] = [];

interface SortingHarnessProps {
  state?: DataTableStateInput;
  defaultState?: DataTableStateInput;
  snapshot?: DataTableState;
  onSliceChange?: (
    event: DataTableChangeEvent<'sorting', readonly DataTableSortDescriptor[]>
  ) => void;
  onStateChange?: (
    event: DataTableChangeEvent<keyof DataTableState, unknown>
  ) => void;
}

function useSortingHarness({
  state,
  defaultState,
  snapshot = createDefaultDataTableState(),
  onSliceChange,
  onStateChange,
}: SortingHarnessProps) {
  return useControllableDataTableSlice({
    slice: 'sorting',
    state,
    defaultState,
    fallbackValue: fallbackSorting,
    stateSnapshot: snapshot,
    onSliceChange,
    onStateChange,
  });
}

type SortingRequestChange = ReturnType<
  typeof useSortingHarness
>['requestChange'];

interface LayoutRequestProps {
  requestChange: SortingRequestChange;
  trigger: boolean;
  onRequest: (
    event: DataTableChangeEvent<'sorting', readonly DataTableSortDescriptor[]>
  ) => void;
}

function LayoutRequest({
  requestChange,
  trigger,
  onRequest,
}: LayoutRequestProps) {
  useLayoutEffect(() => {
    if (trigger) {
      onRequest(
        requestChange(
          (previous) => [...previous, { id: 'layout-request', desc: false }],
          'api'
        )
      );
    }
  }, [onRequest, requestChange, trigger]);

  return null;
}

interface StateOwnerProps {
  state?: DataTableStateInput;
  snapshot: DataTableState;
  trigger: boolean;
  onRequest: (
    event: DataTableChangeEvent<'sorting', readonly DataTableSortDescriptor[]>
  ) => void;
}

function StateOwner({ state, snapshot, trigger, onRequest }: StateOwnerProps) {
  const slice = useControllableDataTableSlice({
    slice: 'sorting',
    state,
    fallbackValue: fallbackSorting,
    stateSnapshot: snapshot,
  });

  return (
    <>
      <output data-testid="owner-sorting">
        {slice.value.map((descriptor) => descriptor.id).join(',') || 'none'}
      </output>
      <LayoutRequest
        requestChange={slice.requestChange}
        trigger={trigger}
        onRequest={onRequest}
      />
    </>
  );
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('DataTable state foundation', () => {
  it('normalizes a complete default state and applies explicit overrides', () => {
    const selection = new Set(['row-1']);
    const state = createDefaultDataTableState({
      selection,
      pagination: { pageIndex: 3, pageSize: 50 },
    });

    expect(state).toMatchObject({
      sorting: [],
      columnFilters: [],
      columnVisibility: {},
      columnOrder: [],
      columnSizing: {},
      columnPinning: { left: [], right: [] },
      grouping: [],
      pagination: { pageIndex: 3, pageSize: 50 },
    });
    expect(state.selection).toBe(selection);
    expect(state.detailExpanded).toEqual(new Set());
    expect(state.treeExpanded).toEqual(new Set());
  });

  it('rejects explicitly undefined required state slices', () => {
    expect(() =>
      createDefaultDataTableState({
        sorting: undefined as never,
      })
    ).toThrow(/sorting/);
    expect(() =>
      createDefaultDataTableState({
        pagination: undefined as never,
      })
    ).toThrow(/pagination/);
    expect(() =>
      createDefaultDataTableState({
        pagination: {
          pageIndex: undefined as never,
          pageSize: 10,
        },
      })
    ).toThrow(/pagination/);
    expect(() =>
      createDefaultDataTableState({
        columnPinning: {
          left: undefined as never,
          right: [],
        },
      })
    ).toThrow(/pinning/);

    expect(() =>
      renderHook(useSortingHarness, {
        initialProps: {
          state: { sorting: undefined as never },
        },
      })
    ).toThrow(/sorting/);
  });

  it('allows explicitly undefined optional state slices without weakening defaults', () => {
    const state = createDefaultDataTableState({
      globalFilter: undefined,
      currentRowId: undefined,
    });

    expect(state.sorting).toEqual([]);
    expect(state.pagination).toEqual({ pageIndex: 0, pageSize: 10 });
    expect(state.globalFilter).toBeUndefined();
    expect(state.currentRowId).toBeUndefined();
  });

  it('initializes an uncontrolled slice from defaultState only once', () => {
    const initial = [{ id: 'name', desc: false }] as const;
    const replacement = [{ id: 'createdAt', desc: true }] as const;
    const { result, rerender } = renderHook(useSortingHarness, {
      initialProps: {
        defaultState: { sorting: initial },
      } as SortingHarnessProps,
    });

    expect(result.current.value).toBe(initial);

    rerender({ defaultState: { sorting: replacement } });

    expect(result.current.value).toBe(initial);
  });

  it('commits an uncontrolled request', () => {
    const nextSorting = [{ id: 'name', desc: false }] as const;
    const { result } = renderHook(useSortingHarness, {
      initialProps: { defaultState: { sorting: fallbackSorting } },
    });

    act(() => {
      result.current.requestChange(nextSorting, 'pointer');
    });

    expect(result.current.value).toBe(nextSorting);
  });

  it('emits but does not commit a controlled request without an owner update', () => {
    const controlledSorting = [{ id: 'name', desc: false }] as const;
    const requestedSorting = [{ id: 'createdAt', desc: true }] as const;
    const onSliceChange = vi.fn();
    const { result } = renderHook(useSortingHarness, {
      initialProps: {
        state: { sorting: controlledSorting },
        onSliceChange,
      },
    });

    act(() => {
      result.current.requestChange(requestedSorting, 'keyboard');
    });

    expect(result.current.value).toBe(controlledSorting);
    expect(onSliceChange).toHaveBeenCalledWith(
      expect.objectContaining({
        slice: 'sorting',
        value: requestedSorting,
        cause: 'keyboard',
      })
    );
  });

  it('gives a descendant layout action the ancestor owner committed inputs', () => {
    const onRequest = vi.fn();
    const initialSnapshot = createDefaultDataTableState({
      sorting: [{ id: 'initial', desc: false }],
      columnOrder: ['initial-column'],
      pagination: { pageIndex: 1, pageSize: 10 },
    });
    const controlledSorting = [{ id: 'owner', desc: true }] as const;
    const committedSnapshot = createDefaultDataTableState({
      sorting: controlledSorting,
      columnOrder: ['committed-column'],
      pagination: { pageIndex: 4, pageSize: 50 },
    });
    const view = render(
      <StateOwner
        snapshot={initialSnapshot}
        trigger={false}
        onRequest={onRequest}
      />
    );

    view.rerender(
      <StateOwner
        state={{ sorting: controlledSorting }}
        snapshot={committedSnapshot}
        trigger
        onRequest={onRequest}
      />
    );

    const event = onRequest.mock.calls[0]?.[0];

    expect(onRequest).toHaveBeenCalledOnce();
    expect(event.value).toEqual([
      ...controlledSorting,
      { id: 'layout-request', desc: false },
    ]);
    expect(event.state.columnOrder).toEqual(['committed-column']);
    expect(event.state.pagination).toEqual({
      pageIndex: 0,
      pageSize: 50,
    });

    view.rerender(
      <StateOwner
        snapshot={initialSnapshot}
        trigger={false}
        onRequest={onRequest}
      />
    );

    expect(screen.getByTestId('owner-sorting')).toHaveTextContent('none');
  });

  it('diagnoses duplicate input once under StrictMode and again after a real remount', () => {
    const controlledSorting = [{ id: 'name', desc: false }] as const;
    const defaultSorting = [{ id: 'createdAt', desc: true }] as const;
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const initialProps = {
      state: { sorting: controlledSorting },
      defaultState: { sorting: defaultSorting },
    };
    const firstMount = renderHook(useSortingHarness, {
      initialProps,
      wrapper: StrictMode,
    });

    expect(firstMount.result.current.value).toBe(controlledSorting);
    expect(consoleError).toHaveBeenCalledOnce();

    firstMount.rerender(initialProps);

    expect(consoleError).toHaveBeenCalledOnce();

    firstMount.unmount();

    const secondMount = renderHook(useSortingHarness, {
      initialProps,
      wrapper: StrictMode,
    });

    expect(secondMount.result.current.value).toBe(controlledSorting);
    expect(consoleError).toHaveBeenCalledTimes(2);

    secondMount.unmount();
  });

  it.each([
    ['sorting', [{ id: 'name', desc: false }]],
    ['columnFilters', [{ id: 'name', value: 'backup' }]],
    ['globalFilter', 'backup'],
    ['grouping', ['tenant']],
  ] as const)(
    'resets pagination atomically when %s changes',
    (slice, requestedValue) => {
      const onSliceChange = vi.fn();
      const onStateChange = vi.fn();
      const snapshot = createDefaultDataTableState({
        pagination: { pageIndex: 2, pageSize: 25 },
      });
      const { result } = renderHook(() =>
        useControllableDataTableSlice<DataTableSlice>({
          slice,
          fallbackValue: snapshot[slice],
          stateSnapshot: snapshot,
          onSliceChange,
          onStateChange,
        })
      );

      let returnedEvent:
        | DataTableChangeEvent<
            DataTableSlice,
            DataTableSliceValue<DataTableSlice>
          >
        | undefined;

      act(() => {
        returnedEvent = result.current.requestChange(
          requestedValue as DataTableSliceValue<DataTableSlice>,
          'api'
        );
      });

      expect(onSliceChange).toHaveBeenCalledOnce();
      expect(onStateChange).toHaveBeenCalledOnce();
      expect(onSliceChange.mock.calls[0]?.[0]).toBe(
        onStateChange.mock.calls[0]?.[0]
      );
      expect(returnedEvent?.state.pagination).toEqual({
        pageIndex: 0,
        pageSize: 25,
      });
      expect(returnedEvent?.query.pagination).toEqual({
        pageIndex: 0,
        pageSize: 25,
      });
      expect(returnedEvent?.requestKey).toBe(returnedEvent?.query.requestKey);
      expect(JSON.parse(returnedEvent?.requestKey ?? '').pagination).toEqual({
        pageIndex: 0,
        pageSize: 25,
      });
    }
  );

  it('gives controlled state precedence over default state', () => {
    const controlledSorting = [{ id: 'name', desc: false }] as const;
    const defaultSorting = [{ id: 'createdAt', desc: true }] as const;
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const { result } = renderHook(useSortingHarness, {
      initialProps: {
        state: { sorting: controlledSorting },
        defaultState: { sorting: defaultSorting },
      },
    });

    expect(result.current.value).toBe(controlledSorting);
    expect(consoleError).toHaveBeenCalledOnce();
  });

  it('keeps controlled precedence without a diagnostic in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const controlledSorting = [{ id: 'name', desc: false }] as const;
    const { result } = renderHook(useSortingHarness, {
      initialProps: {
        state: { sorting: controlledSorting },
        defaultState: { sorting: [{ id: 'createdAt', desc: true }] },
      },
    });

    expect(result.current.value).toBe(controlledSorting);
    expect(consoleError).not.toHaveBeenCalled();
  });

  it('sends the same enriched event object to slice and state callbacks', () => {
    const onSliceChange = vi.fn();
    const onStateChange = vi.fn();
    const snapshot = createDefaultDataTableState({
      pagination: { pageIndex: 2, pageSize: 25 },
    });
    const nextSorting = [{ id: 'name', desc: false }] as const;
    const { result } = renderHook(useSortingHarness, {
      initialProps: {
        snapshot,
        onSliceChange,
        onStateChange,
      },
    });

    let returnedEvent:
      | DataTableChangeEvent<'sorting', readonly DataTableSortDescriptor[]>
      | undefined;

    act(() => {
      returnedEvent = result.current.requestChange(nextSorting, 'api');
    });

    const sliceEvent = onSliceChange.mock.calls[0]?.[0];
    const stateEvent = onStateChange.mock.calls[0]?.[0];

    expect(sliceEvent).toBe(stateEvent);
    expect(sliceEvent).toBe(returnedEvent);
    expect(onSliceChange).toHaveBeenCalledOnce();
    expect(onStateChange).toHaveBeenCalledOnce();
    expect(sliceEvent).toMatchObject({
      slice: 'sorting',
      value: nextSorting,
      cause: 'api',
      state: {
        sorting: nextSorting,
        pagination: { pageIndex: 0, pageSize: 25 },
      },
    });
    expect(sliceEvent.query.sorting).toBe(nextSorting);
    expect(sliceEvent.query.pagination.pageIndex).toBe(0);
    expect(sliceEvent.requestKey).toBe(sliceEvent.query.requestKey);
  });
});

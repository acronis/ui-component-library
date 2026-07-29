import { StrictMode, useLayoutEffect } from 'react';
import { act, render, renderHook } from '@testing-library/react';
import type { ColumnDef } from '@tanstack/react-table';
import { describe, expect, it, vi } from 'vitest';

import type {
  DataTableChangeEvent,
  DataTableSortDescriptor,
} from '../data-table-contract';
import {
  useDataTable,
  type DataTableController,
  type DataTableControllerOptions,
  type DeprecatedDataTableControllerOptions,
} from '../data-table-controller';
import type {
  DataTableEnginePlugin,
  DataTablePluginRegistrar,
} from '../data-table-engine-plugins';

interface Person {
  id: string;
  name: string;
}

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
];

const rows: Person[] = Array.from({ length: 25 }, (_, index) => ({
  id: `person-${index}`,
  name: `Person ${index}`,
}));

interface TreePerson extends Person {
  children?: TreePerson[];
}

const treeColumns = columns as ColumnDef<TreePerson, unknown>[];

const forest: TreePerson[] = [
  { id: 'parent', name: 'Parent', children: [{ id: 'child', name: 'Child' }] },
  { id: 'leaf', name: 'Leaf' },
];

interface LayoutRequestProps {
  controller: DataTableController<Person>;
  trigger: boolean;
  onRequest: (
    event: DataTableChangeEvent<'sorting', readonly DataTableSortDescriptor[]>
  ) => void;
}

function LayoutRequest({ controller, trigger, onRequest }: LayoutRequestProps) {
  useLayoutEffect(() => {
    if (trigger) {
      onRequest(
        controller.requestChange('sorting', (previous) => [
          ...previous,
          { id: 'layout', desc: false },
        ])
      );
    }
  }, [controller, onRequest, trigger]);

  return null;
}

function ControllerOwner({
  sorting,
  trigger,
  onRequest,
}: {
  sorting: readonly DataTableSortDescriptor[];
  trigger: boolean;
  onRequest: LayoutRequestProps['onRequest'];
}) {
  const controller = useDataTable({
    columns,
    data: rows,
    state: { sorting },
  });

  return (
    <LayoutRequest
      controller={controller}
      trigger={trigger}
      onRequest={onRequest}
    />
  );
}

describe('private DataTable controller', () => {
  it('keeps one controller and TanStack instance across owner rerenders', () => {
    const { result, rerender } = renderHook(
      ({ data }: { data: Person[] }) => useDataTable({ columns, data }),
      { initialProps: { data: rows } }
    );
    const controller = result.current;
    const table = result.current.table;

    rerender({ data: [...rows] });

    expect(result.current).toBe(controller);
    expect(result.current.table).toBe(table);
  });

  it('installs row models only when their feature is enabled', () => {
    const disabled = renderHook(() => useDataTable({ columns, data: rows }));
    const enabled = renderHook(() =>
      useDataTable({
        columns,
        data: rows,
        sorting: true,
        filtering: true,
        pagination: true,
      })
    );

    expect(
      disabled.result.current.table.options.getSortedRowModel
    ).toBeUndefined();
    expect(
      disabled.result.current.table.options.getFilteredRowModel
    ).toBeUndefined();
    expect(
      disabled.result.current.table.options.getPaginationRowModel
    ).toBeUndefined();
    expect(
      disabled.result.current.table.options.getExpandedRowModel
    ).toBeUndefined();
    expect(disabled.result.current.table.getRowModel().rows).toHaveLength(25);
    expect(enabled.result.current.table.options.getSortedRowModel).toBeTypeOf(
      'function'
    );
    expect(enabled.result.current.table.options.getFilteredRowModel).toBeTypeOf(
      'function'
    );
    expect(
      enabled.result.current.table.options.getPaginationRowModel
    ).toBeTypeOf('function');
    expect(enabled.result.current.table.getRowModel().rows).toHaveLength(10);

    // ADR-0001: the expand row model is a subrow-visibility stage, so `tree`
    // installs it and detail expansion — a render-layer projection — does not.
    const detail = renderHook(() =>
      useDataTable({
        columns,
        data: rows,
        getRowId: (row) => row.id,
        detailExpansion: {},
      })
    );
    const tree = renderHook(() =>
      useDataTable({
        columns,
        data: rows,
        getRowId: (row) => row.id,
        tree: {},
      })
    );
    expect(
      detail.result.current.table.options.getExpandedRowModel
    ).toBeUndefined();
    expect(tree.result.current.table.options.getExpandedRowModel).toBeTypeOf(
      'function'
    );
  });

  it('emits a controlled request without committing owner state', () => {
    const controlledSorting = [{ id: 'name', desc: false }] as const;
    const onSorting = vi.fn();
    const onStateChange = vi.fn();
    const { result } = renderHook(() =>
      useDataTable({
        columns,
        data: rows,
        state: { sorting: controlledSorting },
        onSliceChange: { sorting: onSorting },
        onStateChange,
      })
    );
    const requested = [{ id: 'name', desc: true }] as const;

    let event:
      | DataTableChangeEvent<'sorting', readonly DataTableSortDescriptor[]>
      | undefined;
    act(() => {
      event = result.current.requestChange('sorting', requested);
    });

    expect(result.current.getState().sorting).toBe(controlledSorting);
    expect(onSorting).toHaveBeenCalledOnce();
    expect(onStateChange).toHaveBeenCalledOnce();
    expect(onSorting.mock.calls[0]?.[0]).toBe(onStateChange.mock.calls[0]?.[0]);
    expect(event).toBe(onSorting.mock.calls[0]?.[0]);
    expect(event).toMatchObject({
      slice: 'sorting',
      value: requested,
      cause: 'api',
      state: { sorting: requested },
    });
    expect(event?.requestKey).toBe(event?.query.requestKey);
  });

  it('emits one enriched atomic event for a real TanStack sorting action', () => {
    const onSorting = vi.fn();
    const onPagination = vi.fn();
    const onStateChange = vi.fn();
    const { result } = renderHook(() =>
      useDataTable({
        columns,
        data: rows,
        sorting: true,
        pagination: true,
        defaultState: { pagination: { pageIndex: 3, pageSize: 10 } },
        onSliceChange: {
          sorting: onSorting,
          pagination: onPagination,
        },
        onStateChange,
      })
    );

    act(() => {
      result.current.table.getColumn('name')?.toggleSorting(false);
    });

    expect(onSorting).toHaveBeenCalledOnce();
    expect(onPagination).not.toHaveBeenCalled();
    expect(onStateChange).toHaveBeenCalledOnce();
    const event = onSorting.mock.calls[0]?.[0];
    expect(event).toBe(onStateChange.mock.calls[0]?.[0]);
    expect(event).toMatchObject({
      slice: 'sorting',
      value: [{ id: 'name', desc: false }],
      state: {
        sorting: [{ id: 'name', desc: false }],
        pagination: { pageIndex: 0, pageSize: 10 },
      },
    });
    expect(event?.requestKey).toBe(event?.query.requestKey);
    expect(event?.query.pagination.pageIndex).toBe(0);
  });

  it('gives a descendant layout action the committed owner state', () => {
    const onRequest = vi.fn();
    const initialSorting = [{ id: 'initial', desc: false }] as const;
    const committedSorting = [{ id: 'owner', desc: true }] as const;
    const view = render(
      <ControllerOwner
        sorting={initialSorting}
        trigger={false}
        onRequest={onRequest}
      />
    );

    view.rerender(
      <ControllerOwner
        sorting={committedSorting}
        trigger
        onRequest={onRequest}
      />
    );

    expect(onRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        cause: 'api',
        value: [...committedSorting, { id: 'layout', desc: false }],
      })
    );
  });

  it('commits an uncontrolled request and keeps expansion namespaces separate', () => {
    const { result } = renderHook(() =>
      useDataTable({
        columns,
        data: rows,
        getRowId: (row) => row.id,
        detailExpansion: {},
        tree: {},
      })
    );

    act(() => {
      result.current.requestChange('detailExpanded', new Set(['person-1']));
      result.current.requestChange('treeExpanded', new Set(['person-2']));
    });

    expect(result.current.getState().detailExpanded).toEqual(
      new Set(['person-1'])
    );
    expect(result.current.getState().treeExpanded).toEqual(
      new Set(['person-2'])
    );
    // ADR-0001: TanStack's single `expanded` state carries the tree slice.
    expect(result.current.table.getState().expanded).toEqual({
      'person-2': true,
    });
  });

  it('preserves same-ID state across immutable replacement and prunes missing IDs', () => {
    const initialRows = rows.slice(0, 3);
    const onStateChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ data }: { data: Person[] }) =>
        useDataTable({
          columns,
          data,
          getRowId: (row) => row.id,
          selection: {},
          detailExpansion: {},
          tree: {},
          rowInteraction: { current: true },
          defaultState: {
            selection: new Set(['person-1']),
            detailExpanded: new Set(['person-1']),
            treeExpanded: new Set(['person-1']),
            currentRowId: 'person-1',
          },
          onStateChange,
        }),
      { initialProps: { data: initialRows } }
    );

    rerender({ data: initialRows.map((row) => ({ ...row })) });

    expect(result.current.getState().selection).toEqual(new Set(['person-1']));
    expect(result.current.getState().detailExpanded).toEqual(
      new Set(['person-1'])
    );
    expect(result.current.getState().treeExpanded).toEqual(
      new Set(['person-1'])
    );
    expect(result.current.getState().currentRowId).toBe('person-1');
    expect(onStateChange).not.toHaveBeenCalled();

    rerender({ data: [initialRows[0] as Person] });

    expect(result.current.getState().selection).toEqual(new Set());
    expect(result.current.getState().detailExpanded).toEqual(new Set());
    expect(result.current.getState().treeExpanded).toEqual(new Set());
    // CONTRACT CHANGE, not a regression. This asserted `undefined` — the reconcile
    // effect used to just CLEAR the current row. Design §7 clause 3
    // (`data-grid/behavior.md:275-276`) requires a fallback instead:
    // same-index → previous-last → toolbar → scroll container. `person-1` sat at
    // index 1 and only `person-0` survives, so index 1 no longer exists and the
    // *last surviving row* is the answer — rung 2.
    //
    // The identity slices above still prune to empty, because membership and position
    // are different questions: a removed id is gone from a Set, while a removed
    // POSITION is inherited by whatever is now there.
    expect(result.current.getState().currentRowId).toBe('person-0');
    // Unchanged at 4, and worth keeping: the fallback resolves to ONE value before
    // requesting, so it emits one `currentRowId` event rather than a clear plus a set.
    // That is §7 clause 4.
    expect(onStateChange).toHaveBeenCalledTimes(4);
    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({ cause: 'data-reconcile' })
    );
  });

  it('reconciles identity slices against nested descendants', () => {
    const initial: TreePerson[] = [
      {
        id: 'parent',
        name: 'Parent',
        children: [{ id: 'child', name: 'Child' }],
      },
    ];
    const { result, rerender } = renderHook(
      ({ data }: { data: TreePerson[] }) =>
        useDataTable({
          columns: treeColumns,
          data,
          getRowId: (row) => row.id,
          getSubRows: (row) => row.children,
          selection: {},
          defaultState: { selection: new Set(['child']) },
        }),
      { initialProps: { data: initial } }
    );

    rerender({
      data: initial.map((row) => ({
        ...row,
        children: row.children?.map((child) => ({ ...child })),
      })),
    });
    expect(result.current.getState().selection).toEqual(new Set(['child']));

    rerender({ data: [{ id: 'parent', name: 'Parent' }] });
    expect(result.current.getState().selection).toEqual(new Set());
  });

  it('preserves all reserved identity slices when rows disappear', () => {
    const initialRows = rows.slice(0, 2);
    const { result, rerender } = renderHook(
      ({ data }: { data: Person[] }) =>
        useDataTable({
          columns,
          data,
          getRowId: (row) => row.id,
          selection: { reserve: true },
          detailExpansion: { reserve: true },
          tree: { reserve: true },
          rowInteraction: { current: true, reserve: true },
          defaultState: {
            selection: new Set(['person-1']),
            detailExpanded: new Set(['person-1']),
            treeExpanded: new Set(['person-1']),
            currentRowId: 'person-1',
          },
        }),
      { initialProps: { data: initialRows } }
    );

    rerender({ data: [initialRows[0] as Person] });

    expect(result.current.getState().selection).toEqual(new Set(['person-1']));
    expect(result.current.getState().detailExpanded).toEqual(
      new Set(['person-1'])
    );
    expect(result.current.getState().treeExpanded).toEqual(
      new Set(['person-1'])
    );
    expect(result.current.getState().currentRowId).toBe('person-1');
  });

  // `onExpandedChange` resolves ExpandedState === true against
  // `table.getCoreRowModel().flatRows`, read inside a callback declared in the
  // same object literal that produces `table`. It is the only argument that
  // reaches that closure, so this is the guard that catches an eagerly
  // evaluated table reference. Keep it driving `options.onExpandedChange?.(true)`
  // and keep it asserting every core row ID.
  it('preserves TanStack ExpandedState=true as all core row IDs, in the bound domain', () => {
    const allIds = new Set(['person-0', 'person-1', 'person-2']);
    const tree = renderHook(() =>
      useDataTable({
        columns,
        data: rows.slice(0, 3),
        getRowId: (row) => row.id,
        tree: {},
      })
    );

    act(() => {
      tree.result.current.table.options.onExpandedChange?.(true);
    });

    expect(tree.result.current.getState().treeExpanded).toEqual(allIds);
    expect(tree.result.current.getState().detailExpanded).toEqual(new Set());

    // The frozen legacy adapter keeps TanStack's `expanded` on the detail slice
    // while no tree is configured, and resolves the same way.
    const legacy = renderHook(() =>
      useDataTable({
        columns,
        data: rows.slice(0, 3),
        getRowId: (row) => row.id,
        getRowCanExpand: () => true,
        renderExpandedRow: () => null,
      })
    );

    act(() => {
      legacy.result.current.table.options.onExpandedChange?.(true);
    });

    expect(legacy.result.current.getState().detailExpanded).toEqual(allIds);
    expect(legacy.result.current.getState().treeExpanded).toEqual(new Set());
  });

  it('forwards only validated engine options into TanStack', () => {
    const fallback = Symbol('fallback');
    const { result } = renderHook(() =>
      useDataTable({
        columns,
        data: rows,
        engineOptions: {
          debugRows: true,
          renderFallbackValue: fallback,
        },
      })
    );

    expect(result.current.table.options.debugRows).toBe(true);
    expect(result.current.table.options.renderFallbackValue).toBe(fallback);
  });

  it('updates diagnostics while keeping the plugin topology fixed', () => {
    const plugin: DataTableEnginePlugin<Person, 'audit'> = {
      id: 'audit',
      actionNamespace: 'audit.actions',
      metadataNamespace: 'audit.metadata',
      manifest: {
        options: [],
        state: [],
        callbacks: [],
        rowModels: [],
        actions: [],
        metadata: [],
      },
      setup() {},
    };
    const { result, rerender } = renderHook(
      ({ debugRows }: { debugRows: boolean }) =>
        useDataTable({
          columns,
          data: rows,
          plugins: [plugin],
          engineOptions: { debugRows },
        }),
      { initialProps: { debugRows: false } }
    );

    rerender({ debugRows: true });

    expect(result.current.table.options.debugRows).toBe(true);
  });

  it('accepts a recreated array containing the same plugin descriptor', () => {
    const plugin: DataTableEnginePlugin<Person, 'audit'> = {
      id: 'audit',
      actionNamespace: 'audit.actions',
      metadataNamespace: 'audit.metadata',
      manifest: {
        options: [],
        state: [],
        callbacks: [],
        rowModels: [],
        actions: [],
        metadata: [],
      },
      setup() {},
    };
    const { rerender } = renderHook(
      ({ revision }: { revision: number }) => {
        void revision;
        return useDataTable({ columns, data: rows, plugins: [plugin] });
      },
      { initialProps: { revision: 0 } }
    );

    expect(() => rerender({ revision: 1 })).not.toThrow();
  });

  it('rejects a replaced descriptor before exposing a changed table', () => {
    const createPlugin = (): DataTableEnginePlugin<Person, 'audit'> => ({
      id: 'audit',
      actionNamespace: 'audit.actions',
      metadataNamespace: 'audit.metadata',
      manifest: {
        options: [],
        state: [],
        callbacks: [],
        rowModels: [],
        actions: [],
        metadata: [],
      },
      setup() {},
    });
    const initial = createPlugin();
    const replacement = createPlugin();
    const { rerender } = renderHook(
      ({ plugin }: { plugin: DataTableEnginePlugin<Person> }) =>
        useDataTable({ columns, data: rows, plugins: [plugin] }),
      { initialProps: { plugin: initial } }
    );

    expect(() => rerender({ plugin: replacement })).toThrow(
      'plugin topology cannot change'
    );
  });

  it('rejects a normalized manifest change on the same descriptor', () => {
    const metadata: string[] = [];
    const plugin: DataTableEnginePlugin<Person, 'audit'> = {
      id: 'audit',
      actionNamespace: 'audit.actions',
      metadataNamespace: 'audit.metadata',
      manifest: {
        options: [],
        state: [],
        callbacks: [],
        rowModels: [],
        actions: [],
        metadata: metadata as `audit.metadata.${string}`[],
      },
      setup() {},
    };
    const { rerender } = renderHook(() =>
      useDataTable({ columns, data: rows, plugins: [plugin] })
    );

    metadata.push('audit.metadata.changed');

    expect(() => rerender()).toThrow('plugin topology cannot change');
  });

  it('supports replay-safe plugin preparation under StrictMode', () => {
    const plugin: DataTableEnginePlugin<Person, 'audit'> = {
      id: 'audit',
      actionNamespace: 'audit.actions',
      metadataNamespace: 'audit.metadata',
      manifest: {
        options: [],
        state: [],
        callbacks: [],
        rowModels: [],
        actions: [],
        metadata: [],
      },
      setup() {},
    };
    const { result } = renderHook(
      () => useDataTable({ columns, data: rows, plugins: [plugin] }),
      { wrapper: StrictMode }
    );

    expect(result.current.table).toBeDefined();
  });

  it('throws for duplicate modern and deprecated expansion config in development', () => {
    expect(() =>
      renderHook(() =>
        useDataTable({
          columns,
          data: rows,
          getRowId: (row) => row.id,
          detailExpansion: false,
          getRowCanExpand: () => true,
        })
      )
    ).toThrow('cannot be combined');
  });

  it('ignores deprecated aliases whenever modern expansion is present in production', () => {
    vi.stubEnv('NODE_ENV', 'production');

    try {
      const { result } = renderHook(() =>
        useDataTable({
          columns,
          data: rows,
          getRowId: (row) => row.id,
          detailExpansion: false,
          getRowCanExpand: () => true,
          renderExpandedRow: () => null,
        })
      );

      expect(result.current.table.options.getExpandedRowModel).toBeUndefined();
      expect(result.current.table.options.getRowCanExpand).toBeUndefined();
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it('retains paired and partial legacy expansion behavior', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const canExpandOnly = renderHook(() =>
      useDataTable({
        columns,
        data: rows,
        getRowCanExpand: () => true,
      })
    );
    const rendererOnly = renderHook(() =>
      useDataTable({
        columns,
        data: rows,
        renderExpandedRow: () => null,
      })
    );
    const paired = renderHook(() =>
      useDataTable({
        columns,
        data: rows,
        getRowId: (row) => row.id,
        getRowCanExpand: () => true,
        renderExpandedRow: () => null,
      })
    );

    // No tree, so each of these keeps the compatibility binding: TanStack's
    // `expanded` carries `detailExpanded` and the legacy predicate is still the
    // engine's `getRowCanExpand`. None of them installs the expand row model —
    // it walks subrows, and none of these datasets has any.
    for (const legacy of [canExpandOnly, rendererOnly, paired]) {
      expect(
        legacy.result.current.table.options.getExpandedRowModel
      ).toBeUndefined();
      expect(legacy.result.current.getExpansion()).toMatchObject({
        detailEnabled: true,
        treeEnabled: false,
      });
    }
    expect(
      canExpandOnly.result.current.table.options.getRowCanExpand
    ).toBeTypeOf('function');
    expect(
      rendererOnly.result.current.table.options.getRowCanExpand
    ).toBeUndefined();
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('without getRowId')
    );

    error.mockRestore();
  });

  it('ignores inherited legacy alias properties', () => {
    const inherited = Object.assign(
      Object.create({ getRowCanExpand: () => true }) as object,
      { columns, data: rows }
    ) as DeprecatedDataTableControllerOptions<Person>;
    const { result } = renderHook(() => useDataTable(inherited));

    expect(result.current.table.options.getExpandedRowModel).toBeUndefined();
    expect(result.current.table.options.getRowCanExpand).toBeUndefined();
  });

  it('runs a valid derived plugin for table, header, row, and cell targets', () => {
    const key = 'audit.metadata.mark';
    const plugin: DataTableEnginePlugin<Person, 'audit'> = {
      id: 'audit',
      actionNamespace: 'audit.actions',
      metadataNamespace: 'audit.metadata',
      manifest: {
        options: [],
        state: [],
        callbacks: [],
        rowModels: [],
        actions: [],
        metadata: [key],
      },
      setup(registrar: DataTablePluginRegistrar<Person>) {
        registrar.metadata('mark', () => 'registry');
        for (const phase of [
          'createTable',
          'createHeader',
          'createRow',
          'createCell',
        ] as const) {
          registrar.hook(phase, () => ({ [key]: phase }));
        }
      },
    };
    const options: DataTableControllerOptions<Person> = {
      columns,
      data: rows.slice(0, 1),
      plugins: [plugin],
    };
    const { result } = renderHook(() => useDataTable(options));
    const table = result.current.table;
    const header = table.getHeaderGroups()[0]?.headers[0];
    const row = table.getRowModel().rows[0];
    const cell = row?.getVisibleCells()[0];

    expect((table as unknown as Record<string, unknown>)[key]).toBe(
      'createTable'
    );
    expect((header as unknown as Record<string, unknown>)[key]).toBe(
      'createHeader'
    );
    expect((row as unknown as Record<string, unknown>)[key]).toBe('createRow');
    expect((cell as unknown as Record<string, unknown>)[key]).toBe(
      'createCell'
    );
    expect(result.current.getPluginRegistry().byPlugin.audit?.metadata).toEqual(
      {
        [key]: 'registry',
      }
    );
  });
});

describe('useDataTable controller actions', () => {
  it('toggles single-row and page selection through the selection slice', () => {
    const { result } = renderHook(() =>
      useDataTable({ columns, data: rows, getRowId: (row) => row.id })
    );

    act(() => {
      result.current.toggle({ type: 'select-row', id: 'person-1' });
    });
    expect([...result.current.getState().selection]).toEqual(['person-1']);

    act(() => {
      result.current.toggle({ type: 'select-row', id: 'person-1' });
    });
    expect(result.current.getState().selection.size).toBe(0);

    act(() => {
      result.current.toggle({ type: 'select-all' });
    });
    expect(result.current.getState().selection.size).toBe(rows.length);

    act(() => {
      result.current.toggle({ type: 'clear-selection' });
    });
    expect(result.current.getState().selection.size).toBe(0);
  });

  it('expands rows into the detail or tree domain independently', () => {
    const { result } = renderHook(() =>
      useDataTable({ columns, data: rows, getRowId: (row) => row.id })
    );

    act(() => {
      result.current.toggle({ type: 'expand-row', id: 'person-2' });
    });
    expect([...result.current.getState().detailExpanded]).toEqual(['person-2']);
    expect(result.current.getState().treeExpanded.size).toBe(0);

    act(() => {
      result.current.toggle({
        type: 'expand-row',
        id: 'person-3',
        domain: 'tree',
      });
    });
    expect([...result.current.getState().treeExpanded]).toEqual(['person-3']);
    expect([...result.current.getState().detailExpanded]).toEqual(['person-2']);
  });

  it('sets and clears the current row id', () => {
    const { result } = renderHook(() =>
      useDataTable({ columns, data: rows, getRowId: (row) => row.id })
    );

    act(() => {
      result.current.toggle({ type: 'set-current-row', id: 'person-4' });
    });
    expect(result.current.getState().currentRowId).toBe('person-4');

    act(() => {
      result.current.toggle({ type: 'set-current-row' });
    });
    expect(result.current.getState().currentRowId).toBeUndefined();
  });

  it('reset(slice) clears one slice with a reset cause', () => {
    const onStateChange = vi.fn();
    const { result } = renderHook(() =>
      useDataTable({
        columns,
        data: rows,
        getRowId: (row) => row.id,
        onStateChange,
      })
    );

    act(() => {
      result.current.toggle({ type: 'select-row', id: 'person-1' });
    });
    onStateChange.mockClear();

    act(() => {
      result.current.reset('selection');
    });

    expect(result.current.getState().selection.size).toBe(0);
    expect(onStateChange).toHaveBeenCalledTimes(1);
    expect(onStateChange.mock.calls[0]?.[0]).toMatchObject({
      slice: 'selection',
      cause: 'reset',
    });
  });

  it('reset() clears every slice to its default', () => {
    const { result } = renderHook(() =>
      useDataTable({
        columns,
        data: rows,
        getRowId: (row) => row.id,
        sorting: true,
      })
    );

    act(() => {
      result.current.requestChange('sorting', [{ id: 'name', desc: true }]);
      result.current.toggle({ type: 'select-row', id: 'person-1' });
      result.current.toggle({ type: 'set-current-row', id: 'person-2' });
    });

    act(() => {
      result.current.reset();
    });

    const state = result.current.getState();
    expect(state.sorting).toEqual([]);
    expect(state.selection.size).toBe(0);
    expect(state.currentRowId).toBeUndefined();
  });

  it('exposes no force-render action', () => {
    const { result } = renderHook(() => useDataTable({ columns, data: rows }));

    const controller = result.current as unknown as Record<string, unknown>;
    expect(controller.triggerRerender).toBeUndefined();
    expect(controller.forceUpdate).toBeUndefined();
  });
});

describe('DataTable expansion domains (ADR-0001)', () => {
  // packages/ui-spec/components/data-table/behavior.md — "Detail and tree
  // expansion are separate". The named onDetailExpansionChange /
  // onTreeExpansionChange callbacks arrive with the detail/tree feature groups;
  // their controller-level equivalent is onSliceChange per slice. Accordion mode
  // is proposed-only and belongs to the detail-expansion unit.
  it('changes only the detail domain when detail expansion toggles', () => {
    const onDetail = vi.fn();
    const onTree = vi.fn();
    const { result } = renderHook(() =>
      useDataTable({
        columns: treeColumns,
        data: forest,
        getRowId: (row) => row.id,
        getSubRows: (row) => row.children,
        detailExpansion: {},
        tree: {},
        defaultState: { treeExpanded: new Set(['parent']) },
        onSliceChange: { detailExpanded: onDetail, treeExpanded: onTree },
      })
    );

    // Given a tree row that is already revealing its children.
    expect(
      result.current.table.getRowModel().rows.map((row) => row.id)
    ).toEqual(['parent', 'child', 'leaf']);

    act(() => {
      result.current.toggle({
        type: 'expand-row',
        id: 'parent',
        domain: 'detail',
      });
    });

    expect(result.current.getState().detailExpanded).toEqual(
      new Set(['parent'])
    );
    expect(onDetail).toHaveBeenCalledOnce();
    expect(result.current.getState().treeExpanded).toEqual(new Set(['parent']));
    expect(onTree).not.toHaveBeenCalled();
    // A detail row is a render-layer projection: it never enters the row model.
    expect(
      result.current.table.getRowModel().rows.map((row) => row.id)
    ).toEqual(['parent', 'child', 'leaf']);
  });

  // No call site combines these today. Before ADR-0001 they shared one conflated
  // expand state; this pins the two independent ones they get now.
  it('gives getSubRows and renderExpandedRow two independent expand domains', () => {
    const { result } = renderHook(() =>
      useDataTable({
        columns: treeColumns,
        data: forest,
        getRowId: (row) => row.id,
        getSubRows: (row) => row.children,
        renderExpandedRow: () => null,
      })
    );

    expect(result.current.getExpansion()).toMatchObject({
      treeEnabled: true,
      detailEnabled: true,
    });
    expect(result.current.table.options.getExpandedRowModel).toBeTypeOf(
      'function'
    );
    // With a tree in play the legacy predicate stays a detail predicate; the
    // engine's getRowCanExpand keeps its subrow-based tree meaning.
    expect(result.current.table.options.getRowCanExpand).toBeUndefined();

    act(() => {
      result.current.requestChange('detailExpanded', new Set(['parent']));
    });

    expect(result.current.table.getState().expanded).toEqual({});
    expect(
      result.current.table.getRowModel().rows.map((row) => row.id)
    ).toEqual(['parent', 'leaf']);

    act(() => {
      result.current.requestChange('treeExpanded', new Set(['parent']));
    });

    expect(result.current.table.getState().expanded).toEqual({ parent: true });
    expect(
      result.current.table.getRowModel().rows.map((row) => row.id)
    ).toEqual(['parent', 'child', 'leaf']);
    expect(result.current.getState().detailExpanded).toEqual(
      new Set(['parent'])
    );
  });

  it('reports the compatibility binding for legacy detail expansion', () => {
    const { result } = renderHook(() =>
      useDataTable({
        columns,
        data: rows.slice(0, 2),
        getRowId: (row) => row.id,
        getRowCanExpand: () => true,
        renderExpandedRow: () => null,
      })
    );

    const expansion = result.current.getExpansion();
    expect(expansion).toMatchObject({
      treeEnabled: false,
      detailEnabled: true,
    });
    const row = result.current.table.getRowModel().rows[0]!;
    expect(expansion.canExpandDetail(row)).toBe(true);
    // Byte-identical to what the engine reported before the split.
    expect(row.getCanExpand()).toBe(true);
  });
});

describe('requestChange — an unchanged value is not a change', () => {
  // WHY THIS EXISTS. `requestChange` allocated a new state object on every call, and
  // React bails out only on `Object.is`, so a request whose value was identical still
  // re-rendered. TanStack's automatic `resetExpanded` writes the expanded slice on
  // every row-model invalidation, so the two formed a loop that froze the browser:
  // 11,293 writes in 8 seconds, DOM stable, heap flat.
  //
  // THE FIRST TEST BELOW IS NOT SUFFICIENT ON ITS OWN, and that is the point. A guard
  // that answers "equal" for everything passes it — and such a guard would silently
  // drop legitimate updates, which is worse than the freeze, because a freeze is
  // reported within the hour and a dropped update is never reported at all. The third
  // test is the one that fails if anyone makes the fallback optimistic.

  it('writes nothing and notifies nobody when a set-valued slice is unchanged', () => {
    const onStateChange = vi.fn();
    const { result } = renderHook(() =>
      useDataTable({
        columns,
        data: rows,
        getRowId: (row) => row.id,
        onStateChange,
      })
    );

    act(() => {
      // Same membership, different Set identity — exactly what `resetExpanded` did.
      result.current.requestChange('selection', new Set<string>());
    });

    expect(onStateChange).not.toHaveBeenCalled();
  });

  it('still writes when the value actually changes', () => {
    const onStateChange = vi.fn();
    const { result } = renderHook(() =>
      useDataTable({
        columns,
        data: rows,
        getRowId: (row) => row.id,
        onStateChange,
      })
    );

    act(() => {
      result.current.requestChange('selection', new Set(['person-0']));
    });

    expect(onStateChange).toHaveBeenCalledTimes(1);
    expect(result.current.getState().selection.has('person-0')).toBe(true);
  });

  it('always writes a slice it has no comparison for, even for an equal value', () => {
    // THE DISCRIMINATING ASSERTION. `columnFilters` carries arbitrary
    // `SerializableValue`, so the guard declines to compare it — deep equality's
    // failure mode there is a dropped filter. A version whose fallback guessed
    // "equal" would swallow this write and pass the first test in this block.
    const onStateChange = vi.fn();
    const { result } = renderHook(() =>
      useDataTable({
        columns,
        data: rows,
        getRowId: (row) => row.id,
        onStateChange,
      })
    );

    const filter = [{ id: 'name', value: 'Person 1' }];
    act(() => {
      result.current.requestChange('columnFilters', filter);
    });
    act(() => {
      // Deep-equal, freshly allocated: must NOT be treated as a no-op.
      result.current.requestChange('columnFilters', [
        { id: 'name', value: 'Person 1' },
      ]);
    });

    expect(onStateChange).toHaveBeenCalledTimes(2);
  });
});

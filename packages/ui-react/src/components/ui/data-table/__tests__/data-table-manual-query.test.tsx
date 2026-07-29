import { act, renderHook } from '@testing-library/react';
import type { ColumnDef } from '@tanstack/react-table';
import { describe, expect, it, vi } from 'vitest';

import type { DataTableQueryChangeEvent } from '../data-table-contract';
import { useDataTable } from '../data-table-controller';

interface Person {
  id: string;
  name: string;
}

const columns: ColumnDef<Person, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
];

const rows: Person[] = Array.from({ length: 25 }, (_, index) => ({
  id: `p${index}`,
  name: `Person ${index}`,
}));

describe('DataTable manual modes', () => {
  it('does not slice client rows under manual pagination', () => {
    const { result } = renderHook(() =>
      useDataTable({
        columns,
        data: rows,
        getRowId: (row) => row.id,
        manualPagination: true,
        pageCount: 5,
        defaultState: { pagination: { pageIndex: 0, pageSize: 10 } },
      })
    );

    // The caller pre-slices; the engine keeps all supplied rows and trusts the
    // reported page count.
    expect(result.current.table.getRowModel().rows).toHaveLength(25);
    expect(result.current.table.getPageCount()).toBe(5);
  });

  it('does not sort client rows under manual sorting', () => {
    const { result } = renderHook(() =>
      useDataTable({
        columns,
        data: rows,
        getRowId: (row) => row.id,
        manualSorting: true,
        state: { sorting: [{ id: 'name', desc: true }] },
      })
    );

    // Descending sort state is tracked, but rows keep their supplied order.
    expect(result.current.table.getRowModel().rows[0]?.original.name).toBe(
      'Person 0'
    );
  });
});

describe('DataTable onQueryChange', () => {
  it('emits one atomic post-reset event when a query-changing sort resets pagination', () => {
    const onQueryChange = vi.fn();
    const { result } = renderHook(() =>
      useDataTable({
        columns,
        data: rows,
        getRowId: (row) => row.id,
        sorting: true,
        pagination: true,
        defaultState: { pagination: { pageIndex: 3, pageSize: 10 } },
        onQueryChange,
      })
    );

    act(() => {
      result.current.requestChange(
        'sorting',
        [{ id: 'name', desc: true }],
        'api'
      );
    });

    expect(onQueryChange).toHaveBeenCalledTimes(1);
    const event = onQueryChange.mock.calls[0]?.[0] as DataTableQueryChangeEvent;
    expect(event.previousQuery.pagination.pageIndex).toBe(3);
    expect(event.query.pagination.pageIndex).toBe(0);
    // The emitted key is the canonical key of the post-reset query.
    expect(event.requestKey).toBe(event.query.requestKey);
    expect(event.requestKey).not.toBe(event.previousQuery.requestKey);
  });

  it('emits on a pagination change but not on non-query slices', () => {
    const onQueryChange = vi.fn();
    const { result } = renderHook(() =>
      useDataTable({
        columns,
        data: rows,
        getRowId: (row) => row.id,
        pagination: true,
        defaultState: { pagination: { pageIndex: 0, pageSize: 10 } },
        onQueryChange,
      })
    );

    act(() => {
      result.current.requestChange('columnVisibility', { name: false }, 'api');
    });
    expect(onQueryChange).not.toHaveBeenCalled();

    act(() => {
      result.current.requestChange(
        'pagination',
        { pageIndex: 1, pageSize: 10 },
        'api'
      );
    });
    expect(onQueryChange).toHaveBeenCalledTimes(1);
    expect(
      (onQueryChange.mock.calls[0]?.[0] as DataTableQueryChangeEvent).query
        .pagination.pageIndex
    ).toBe(1);
  });
});

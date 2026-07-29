import type { ColumnDef } from '@tanstack/react-table';
import { describe, expectTypeOf, it } from 'vitest';

import { DataGrid } from '../data-grid';
import type { DataGridProps } from '../data-grid';

// The identity rule (design §3.1), asserted at compile time. `DataGridProps` is a
// discriminated union: `getRowId` is optional only while every identity-bearing
// feature is disabled, and required the moment one is enabled.
//
// Every `@ts-expect-error` below is an assertion in both directions — it fails
// the build if the line stops erroring, so it cannot rot into a comment.
//
// Nothing here renders; the file exists for `tsc`.

interface Person {
  id: string;
  name: string;
}

const columns: ColumnDef<Person, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
];
const rows: Person[] = [{ id: '1', name: 'Ada' }];
const getRowId = (row: Person) => row.id;

describe('DataGrid identity rule', () => {
  it('allows the identity-free branch without `getRowId`', () => {
    void (<DataGrid columns={columns} rows={rows} />);
    void (<DataGrid columns={columns} rows={rows} sorting={{ mode: 'single' }} />);
    void (
      <DataGrid
        columns={columns}
        rows={rows}
        appearance={{ striped: true }}
        pagination={{ pageSize: 10 }}
        toolbar={{ viewOptions: false }}
      />
    );
  });

  it('keeps the deprecated flat aliases source-compatible without `getRowId`', () => {
    // Design §3.1: the deprecated overload stays compilable for one minor line
    // and warns at runtime instead. Only the grouped API is enforced by types.
    void (<DataGrid columns={columns} rows={rows} selectable />);
    void (<DataGrid columns={columns} rows={rows} currentRow />);
    void (<DataGrid columns={columns} rows={rows} onRowClick={() => {}} />);
    void (<DataGrid columns={columns} rows={rows} state="loading" />);
  });

  it('allows row handlers without `getRowId`, but not the current row', () => {
    // The handlers receive the row *object*; only `current` is keyed by row id.
    void (
      <DataGrid
        columns={columns}
        rows={rows}
        rowInteraction={{ onClick: () => {}, onHover: () => {} }}
      />
    );
    void (
      // @ts-expect-error `rowInteraction.current` needs `getRowId`.
      <DataGrid columns={columns} rows={rows} rowInteraction={{ current: true }} />
    );
  });

  it('requires `getRowId` for every identity-bearing group', () => {
    void (
      // @ts-expect-error `selection` needs `getRowId`.
      <DataGrid columns={columns} rows={rows} selection={{ mode: 'multiple' }} />
    );
    void (
      // @ts-expect-error `actions` needs `getRowId`.
      <DataGrid columns={columns} rows={rows} actions={{ items: [], onAction: () => {} }} />
    );
    void (
      // @ts-expect-error `server` needs `getRowId`.
      <DataGrid
        columns={columns}
        rows={rows}
        server={{ query: {} as never, onQueryChange: () => {} }}
      />
    );
  });

  it('requires `getRowId` for a controlled identity slice', () => {
    void (
      // @ts-expect-error a controlled `selection` slice needs `getRowId`.
      <DataGrid columns={columns} rows={rows} state={{ selection: new Set(['1']) }} />
    );
    void (
      // @ts-expect-error a controlled `currentRowId` slice needs `getRowId`.
      <DataGrid columns={columns} rows={rows} defaultState={{ currentRowId: '1' }} />
    );
    // A non-identity slice is fine without it.
    void (
      <DataGrid
        columns={columns}
        rows={rows}
        state={{ pagination: { pageIndex: 1, pageSize: 10 } }}
      />
    );
  });

  it('accepts every group once `getRowId` is supplied', () => {
    void (
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        selection={{ mode: 'multiple' }}
        actions={{ items: [], onAction: () => {} }}
        rowInteraction={{ current: true }}
        state={{ selection: new Set(['1']) }}
        defaultState={{ currentRowId: '1' }}
      />
    );
  });

  it('discriminates the two branches structurally', () => {
    expectTypeOf<
      NonNullable<DataGridProps<Person, unknown>['getRowId']>
    >().toEqualTypeOf<(row: Person, index: number) => string>();
  });
});

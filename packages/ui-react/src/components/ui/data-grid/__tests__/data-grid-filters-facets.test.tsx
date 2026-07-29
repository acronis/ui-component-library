import type { ColumnDef } from '@tanstack/react-table';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DataGrid } from '../data-grid';

// U7 — the `filters` group completion. Two halves:
//   half 1  faceted option sources (`filters.columns[].facet`)
//   half 2  multi-column global search (`filters.global.columnIds`)
//
// Both are what W3-INTEG's `/data` route migration waits on: that route currently
// hand-rolls a four-field OR inside a single column's `filterFn`, and its status
// filter is a fixed list while its category filter is `'unique'` over the data.

interface Row {
  id: string;
  name: string;
  category: string;
  status: string;
  description?: string;
}

const columns: ColumnDef<Row, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'status', header: 'Status' },
];

const rows: Row[] = [
  {
    id: '1',
    name: 'Ada',
    category: 'Compute',
    status: 'active',
    description: 'first',
  },
  { id: '2', name: 'Grace', category: 'Storage', status: 'active' },
  {
    id: '3',
    name: 'Alan',
    category: 'Compute',
    status: 'paused',
    description: 'Ada mentioned',
  },
];
const getRowId = (row: Row) => row.id;

describe('DataGrid filters — multi-column global search', () => {
  it('matches one query across every listed column', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        filters={{
          global: { columnIds: ['name', 'category'], placeholder: 'Search' },
        }}
        toolbar={{ globalSearch: true }}
      />
    );

    // "Compute" appears only in `category`, and matching it must not require the
    // caller to know which column holds it.
    await user.type(screen.getByPlaceholderText('Search'), 'compute');
    expect(screen.getByText('Ada')).toBeVisible();
    expect(screen.getByText('Alan')).toBeVisible();
    expect(screen.queryByText('Grace')).not.toBeInTheDocument();
  });

  it('is case-insensitive and ORs rather than ANDs', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        filters={{
          global: { columnIds: ['name', 'status'], placeholder: 'Search' },
        }}
        toolbar={{ globalSearch: true }}
      />
    );

    // `GRACE` matches only `name`; `paused` only `status`. Either alone is enough.
    await user.type(screen.getByPlaceholderText('Search'), 'GRACE');
    expect(screen.getByText('Grace')).toBeVisible();
    expect(screen.queryByText('Ada')).not.toBeInTheDocument();

    await user.clear(screen.getByPlaceholderText('Search'));
    await user.type(screen.getByPlaceholderText('Search'), 'paused');
    expect(screen.getByText('Alan')).toBeVisible();
    expect(screen.queryByText('Grace')).not.toBeInTheDocument();
  });

  it('does not match a column outside `columnIds`', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        filters={{ global: { columnIds: ['name'], placeholder: 'Search' } }}
        toolbar={{ globalSearch: true }}
      />
    );

    // `Storage` is a real cell value, in a column the query is not scoped to.
    await user.type(screen.getByPlaceholderText('Search'), 'storage');
    expect(screen.queryByText('Grace')).not.toBeInTheDocument();
    expect(screen.queryByText('Ada')).not.toBeInTheDocument();
  });

  it('keeps the deprecated single-column form working', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        filters={{ global: { columnId: 'name', placeholder: 'Search' } }}
        toolbar={{ globalSearch: true }}
      />
    );

    await user.type(screen.getByPlaceholderText('Search'), 'ada');
    expect(screen.getByText('Ada')).toBeVisible();
    expect(screen.queryByText('Grace')).not.toBeInTheDocument();
  });

  it('keeps the deprecated top-level `searchKey` alias rendering a search box', async () => {
    // `api.yaml` commits the deprecated flat aliases to staying source-compatible
    // for one minor line, and `searchKey` is the alias that reaches the search
    // input without any `filters` config at all. Moving the box from a column
    // filter to the global filter must not have broken that path — this is the
    // configuration the alias produces, not the grouped one.
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        searchKey="name"
        searchPlaceholder="Find"
      />
    );

    // No `toolbar` prop at all: `searchKey` alone must both enable the toolbar and
    // render the field.
    const box = screen.getByPlaceholderText('Find');
    await user.type(box, 'grace');
    expect(screen.getByText('Grace')).toBeVisible();
    expect(screen.queryByText('Ada')).not.toBeInTheDocument();
  });

  it('scopes the deprecated `searchKey` to its one column', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        searchKey="name"
        searchPlaceholder="Find"
      />
    );

    // The alias names one column, so a term living only in `category` must not
    // match — the alias is not silently widened to every column.
    await user.type(screen.getByPlaceholderText('Find'), 'storage');
    expect(screen.queryByText('Grace')).not.toBeInTheDocument();
  });

  it('warns when both `columnIds` and the deprecated `columnId` are supplied', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        filters={{ global: { columnIds: ['name'], columnId: 'category' } }}
        toolbar={{ globalSearch: true }}
      />
    );
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('`columnIds` wins')
    );
    error.mockRestore();
  });

  it('keeps the query descriptor serializable for server mode', async () => {
    const user = userEvent.setup();
    const onQueryChange = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        filters={{
          global: { columnIds: ['name', 'category'], placeholder: 'Search' },
        }}
        toolbar={{ globalSearch: true }}
        callbacks={{ onQueryChange }}
      />
    );

    await user.type(screen.getByPlaceholderText('Search'), 'ada');

    expect(onQueryChange).toHaveBeenCalled();
    const calls = onQueryChange.mock.calls;
    const { query } = calls[calls.length - 1][0];
    // The descriptor carries the query string, not a function — which is what lets
    // server mode round-trip it unchanged.
    expect(query.globalFilter).toBe('ada');
    expect(JSON.parse(JSON.stringify(query)).globalFilter).toBe('ada');
  });

  it('clears the global query from the toolbar reset', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        filters={{ global: { columnIds: ['name'], placeholder: 'Search' } }}
        toolbar={{ globalSearch: true }}
      />
    );

    await user.type(screen.getByPlaceholderText('Search'), 'ada');
    expect(screen.queryByText('Grace')).not.toBeInTheDocument();
    // Before U7 the reset control cleared only column filters, so a global query
    // would have been stranded with the button still showing.
    await user.click(screen.getByRole('button', { name: /Reset/ }));
    expect(screen.getByText('Grace')).toBeVisible();
  });
});

describe('DataGrid filters — faceted option sources', () => {
  const facetGrid = (
    <DataGrid
      columns={columns}
      rows={rows}
      getRowId={getRowId}
      filters={{
        columns: [
          {
            columnId: 'category',
            label: 'Category',
            operators: ['equals'],
            facet: 'unique',
          },
        ],
      }}
      toolbar={{ columnFilters: true }}
    />
  );

  it('offers the column’s distinct values with their counts', async () => {
    const user = userEvent.setup();
    render(facetGrid);

    await user.click(screen.getByRole('button', { name: 'Category' }));
    const group = screen.getByRole('group', { name: 'Category options' });

    // Distinct values from the pre-filter row model, with occurrence counts —
    // `getFacetedUniqueValues` returns an empty map unless the faceted row models
    // are installed, which is what U7 added.
    expect(within(group).getByLabelText('Compute')).toBeInTheDocument();
    expect(within(group).getByLabelText('Storage')).toBeInTheDocument();
    expect(within(group).getByText('2')).toBeVisible();
    expect(within(group).getByText('1')).toBeVisible();
  });

  it('filters by a chosen option', async () => {
    const user = userEvent.setup();
    render(facetGrid);

    await user.click(screen.getByRole('button', { name: 'Category' }));
    await user.click(
      within(
        screen.getByRole('group', { name: 'Category options' })
      ).getByLabelText('Storage')
    );
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    expect(screen.getByText('Grace')).toBeVisible();
    expect(screen.queryByText('Ada')).not.toBeInTheDocument();
  });

  it('supplies a fixed option list verbatim', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        filters={{
          columns: [
            {
              columnId: 'status',
              label: 'Status',
              operators: ['equals'],
              facet: ['active', 'paused', 'archived'],
            },
          ],
        }}
        toolbar={{ columnFilters: true }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Status' }));
    const group = screen.getByRole('group', { name: 'Status options' });
    // `archived` occurs in no row, and a fixed list still offers it.
    expect(within(group).getByLabelText('archived')).toBeInTheDocument();
    // A fixed list carries no counts.
    expect(within(group).queryByText('1')).not.toBeInTheDocument();
  });

  it('leaves an unfaceted definition as a free-text control', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        filters={{ columns: [{ columnId: 'name', label: 'Name' }] }}
        toolbar={{ columnFilters: true }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Name' }));
    expect(screen.getByLabelText('Name value')).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Name options' })).toBeNull();
  });
});

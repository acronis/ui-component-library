import { useState } from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
  DataTableToolbar,
} from '../index';

type Row = { id: string; email: string; amount: number };

const data: Row[] = Array.from({ length: 12 }, (_, i) => ({
  id: `r${i + 1}`,
  email: `user${i + 1}@example.com`,
  amount: (i + 1) * 100,
}));

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'amount', header: 'Amount' },
];

describe('DataTable', () => {
  it('renders the column headers and rows', () => {
    render(<DataTable columns={columns} data={data.slice(0, 3)} />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    expect(screen.getByText('user3@example.com')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(4);
  });

  it('shows an empty state with no data', () => {
    render(<DataTable columns={columns} data={[]} />);
    expect(screen.getByText('No results.')).toBeInTheDocument();
  });

  it('sorts a DataTableColumnHeader column in a single click', async () => {
    const sortable: ColumnDef<Row>[] = [
      {
        accessorKey: 'amount',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ row }) => <span>{row.original.amount}</span>,
      },
    ];
    render(<DataTable columns={sortable} data={data.slice(0, 3)} />);
    const cellsBefore = screen.getAllByRole('cell').map((c) => c.textContent);
    expect(cellsBefore).toEqual(['100', '200', '300']);

    // One click sorts ascending (already ascending → flips to descending here).
    await userEvent.click(
      screen.getByRole('button', { name: 'Sort by Amount' })
    );
    const cellsAfter = screen.getAllByRole('cell').map((c) => c.textContent);
    expect(cellsAfter).not.toEqual(cellsBefore);
  });

  it('renders expanded content for an expanded row', async () => {
    const expandable: ColumnDef<Row>[] = [
      {
        id: 'expand',
        header: () => null,
        cell: ({ row }) => (
          <button
            onClick={row.getToggleExpandedHandler()}
            aria-label={row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
          >
            {row.getIsExpanded() ? '-' : '+'}
          </button>
        ),
      },
      { accessorKey: 'email', header: 'Email' },
    ];
    render(
      <DataTable
        columns={expandable}
        data={data.slice(0, 2)}
        getRowCanExpand={() => true}
        renderExpandedRow={(row) => <span>Details for {row.original.id}</span>}
      />
    );
    expect(screen.queryByText('Details for r1')).not.toBeInTheDocument();
    await userEvent.click(
      screen.getAllByRole('button', { name: 'Expand row' })[0]
    );
    expect(screen.getByText('Details for r1')).toBeInTheDocument();
  });

  it('preserves getRowCanExpand-only legacy state without projecting content', async () => {
    const expandable: ColumnDef<Row>[] = [
      {
        id: 'expand',
        cell: ({ row }) => (
          <button
            onClick={row.getToggleExpandedHandler()}
            aria-label={row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
          >
            Toggle
          </button>
        ),
      },
      { accessorKey: 'email', header: 'Email' },
    ];
    render(
      <DataTable
        columns={expandable}
        data={data.slice(0, 1)}
        getRowCanExpand={() => true}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: 'Expand row' }));

    expect(
      screen.getByRole('button', { name: 'Collapse row' })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });

  it('preserves renderExpandedRow-only legacy projection without adding expandability', async () => {
    const imperativeExpansion: ColumnDef<Row>[] = [
      {
        id: 'expand',
        cell: ({ row }) => (
          <button onClick={() => row.toggleExpanded()}>
            Force detail state
          </button>
        ),
      },
      { accessorKey: 'email', header: 'Email' },
    ];
    render(
      <DataTable
        columns={imperativeExpansion}
        data={data.slice(0, 1)}
        renderExpandedRow={(row) => (
          <span>Forced details for {row.original.id}</span>
        )}
      />
    );

    expect(
      screen.getByRole('button', { name: 'Force detail state' }).closest('tr')
    ).toHaveTextContent('user1@example.com');
    await userEvent.click(
      screen.getByRole('button', { name: 'Force detail state' })
    );

    expect(screen.getByText('Forced details for r1')).toBeInTheDocument();
  });
});

describe('DataTable presentational features', () => {
  it('stripes alternating rows', () => {
    render(<DataTable columns={columns} data={data.slice(0, 4)} striped />);
    const secondRow = screen.getByText('user2@example.com').closest('tr')!;
    const firstRow = screen.getByText('user1@example.com').closest('tr')!;
    expect(secondRow.className).toContain(
      'bg-[var(--ui-background-surface-secondary)]'
    );
    expect(firstRow.className).not.toContain(
      'bg-[var(--ui-background-surface-secondary)]'
    );
  });

  it('adds vertical borders when bordered', () => {
    const { container } = render(
      <DataTable columns={columns} data={data.slice(0, 2)} bordered />
    );
    const wrapper = container.querySelector('div.rounded-md') as HTMLElement;
    expect(wrapper.className).toContain('[&_td:not(:last-child)]:border-e');
  });

  it('renders skeleton placeholder rows instead of data', () => {
    const { container } = render(
      <DataTable columns={columns} data={data} skeleton skeletonRows={3} />
    );
    expect(screen.queryByText('user1@example.com')).not.toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Email' })).toBeVisible();
    expect(screen.getAllByRole('row')).toHaveLength(4);
    // 3 rows × 2 columns of pulse bars
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(6);
  });

  it('highlights the clicked row when highlightCurrentRow', async () => {
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 3)}
        highlightCurrentRow
      />
    );
    const row = screen.getByText('user2@example.com').closest('tr')!;
    // Exact class token — the primitive carries `active:bg-[…row-color-active]`
    // for its pressed pseudo-state, so a substring check would collide.
    const current = 'bg-[var(--ui-table-data-row-color-active)]';
    const classes = (el: HTMLElement) => el.className.split(/\s+/);
    expect(classes(row)).not.toContain(current);
    await userEvent.click(row);
    expect(classes(row)).toContain(current);
  });
});

function Harness() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 5 } },
    state: { columnFilters },
  });
  return (
    <div>
      <DataTableToolbar
        table={table}
        searchKey="email"
        searchPlaceholder="Filter emails…"
      />
      <div data-testid="page-rows">
        {table.getRowModel().rows.map((r) => (
          <span key={r.id}>{r.original.email}</span>
        ))}
      </div>
      <output data-testid="visible-columns">
        {table
          .getVisibleLeafColumns()
          .map((column) => column.id)
          .join(',')}
      </output>
      <DataTablePagination table={table} />
    </div>
  );
}

describe('DataTableToolbar + DataTablePagination', () => {
  it('filters rows via the search box', async () => {
    render(<Harness />);
    const search = screen.getByPlaceholderText('Filter emails…');
    await userEvent.type(search, 'user11');
    const rows = within(screen.getByTestId('page-rows'));
    expect(rows.getByText('user11@example.com')).toBeInTheDocument();
    expect(rows.queryByText('user1@example.com')).not.toBeInTheDocument();
  });

  it('resets caller-owned filtering from the toolbar', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(screen.getByPlaceholderText('Filter emails…'), 'user11');
    await user.click(screen.getByRole('button', { name: /Reset/ }));
    const rows = within(screen.getByTestId('page-rows'));
    expect(rows.getByText('user1@example.com')).toBeInTheDocument();
    expect(rows.queryByText('user11@example.com')).not.toBeInTheDocument();
  });

  it('changes caller-owned column visibility from view options', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    expect(screen.getByTestId('visible-columns')).toHaveTextContent(
      'email,amount'
    );
    await user.click(screen.getByRole('button', { name: /View/ }));
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'amount' }));
    expect(screen.getByTestId('visible-columns')).toHaveTextContent('email');
  });

  it('paginates to the next page', async () => {
    render(<Harness />);
    const rows = () => within(screen.getByTestId('page-rows'));
    expect(rows().getByText('user1@example.com')).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: 'Go to next page' })
    );
    expect(rows().queryByText('user1@example.com')).not.toBeInTheDocument();
    expect(rows().getByText('user6@example.com')).toBeInTheDocument();
  });
});

describe('DataTable frozen compatibility props', () => {
  it('warns once for each supplied frozen prop with its migration destination', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      render(
        <DataTable
          columns={columns}
          data={data}
          striped
          bordered
          highlightCurrentRow
          skeleton
          skeletonRows={3}
        />
      );

      const messages = warn.mock.calls.map((call) => String(call[0]));
      const cases = [
        ['striped', 'appearance.striped'],
        ['bordered', 'appearance.borders'],
        ['highlightCurrentRow', 'rowInteraction.current'],
        ['skeleton', 'dataState'],
        ['skeletonRows', 'dataState.skeletonRows'],
      ] as const;

      for (const [prop, destination] of cases) {
        const matches = messages.filter(
          (message) =>
            message.includes(`"${prop}"`) &&
            message.includes('deprecated') &&
            message.includes(destination)
        );
        expect(matches).toHaveLength(1);
      }
    } finally {
      warn.mockRestore();
    }
  });

  it('does not warn when no frozen prop is supplied', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      render(<DataTable columns={columns} data={data} />);
      expect(warn).not.toHaveBeenCalled();
    } finally {
      warn.mockRestore();
    }
  });
});

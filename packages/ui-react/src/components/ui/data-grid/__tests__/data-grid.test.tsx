import type { ColumnDef } from '@tanstack/react-table';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  createDataTableQuery,
  createDefaultDataTableState,
} from '../../data-table';
import { DataGrid } from '../data-grid';
import type { DataGridGroupedConfig, DataGridPreset } from '../data-grid';
import type { DataGridActionsConfig } from '../data-grid-actions';
import { resolveSliceCallbacks } from '../data-grid-callbacks';

interface Person {
  id: string;
  name: string;
  role: string;
}

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'role', header: 'Role' },
];

const rows: Person[] = [
  { id: '1', name: 'Ada Lovelace', role: 'Engineer' },
  { id: '2', name: 'Grace Hopper', role: 'Engineer' },
];

const paginatedRows: Person[] = Array.from({ length: 5 }, (_, index) => ({
  id: `${index + 1}`,
  name: `Person ${index + 1}`,
  role: index % 2 === 0 ? 'Engineer' : 'Operator',
}));

describe('DataGrid', () => {
  it('renders column headers and a row per datum', () => {
    render(<DataGrid columns={columns} rows={rows} />);
    expect(screen.getByText('Name')).toBeVisible();
    expect(screen.getByText('Role')).toBeVisible();
    expect(screen.getByText('Ada Lovelace')).toBeVisible();
    expect(screen.getByText('Grace Hopper')).toBeVisible();
  });

  it('renders every row when pagination is not requested', () => {
    // Guards the shared-controller migration: DataGrid runs on the one
    // DataTable engine, which installs no pagination model unless asked — so it
    // must not silently truncate to a default page (this set is larger than the
    // default page size of 10).
    const manyRows: Person[] = Array.from({ length: 15 }, (_, index) => ({
      id: `${index + 1}`,
      name: `Person ${index + 1}`,
      role: 'Engineer',
    }));
    render(<DataGrid columns={columns} rows={manyRows} />);
    expect(screen.getByText('Person 15')).toBeVisible();
    // header row + one per datum
    expect(screen.getAllByRole('row')).toHaveLength(manyRows.length + 1);
  });

  it('shows the empty message when there are no rows', () => {
    render(
      <DataGrid columns={columns} rows={[]} emptyMessage="Nothing here" />
    );
    expect(screen.getByText('Nothing here')).toBeVisible();
  });

  it('shows the empty message when state is forced empty', () => {
    render(<DataGrid columns={columns} rows={rows} state="empty" />);
    expect(screen.getByText('No results.')).toBeVisible();
    expect(screen.queryByText('Ada Lovelace')).not.toBeInTheDocument();
  });

  it('renders skeleton rows instead of data while loading', () => {
    const { container } = render(
      <DataGrid
        columns={columns}
        rows={rows}
        state="loading"
        skeletonRows={3}
      />
    );
    expect(screen.queryByText('Ada Lovelace')).not.toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(4);
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(6);
  });

  it('adds a selection column and selects all rows from the header checkbox', async () => {
    const user = userEvent.setup();
    render(<DataGrid columns={columns} rows={rows} selectable />);
    // header select-all + one per row
    const boxes = screen.getAllByRole('checkbox');
    expect(boxes).toHaveLength(rows.length + 1);

    await user.click(screen.getByLabelText('Select all rows'));
    for (const box of screen.getAllByLabelText('Select row')) {
      expect(box).toHaveAttribute('aria-checked', 'true');
    }
  });

  it('calls onRowClick with the row data', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(<DataGrid columns={columns} rows={rows} onRowClick={onRowClick} />);
    await user.click(screen.getByText('Ada Lovelace'));
    expect(onRowClick).toHaveBeenCalledWith(rows[0]);
  });

  it('filters the current rows with the toolbar search', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        searchKey="name"
        searchPlaceholder="Find a person"
      />
    );
    await user.type(screen.getByPlaceholderText('Find a person'), 'Ada');
    expect(screen.getByText('Ada Lovelace')).toBeVisible();
    expect(screen.queryByText('Grace Hopper')).not.toBeInTheDocument();
  });

  it('changes current column visibility from the built-in toolbar', async () => {
    const user = userEvent.setup();
    render(<DataGrid columns={columns} rows={rows} toolbar />);
    expect(screen.getByRole('columnheader', { name: 'Role' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: /View/ }));
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'role' }));
    expect(
      screen.queryByRole('columnheader', { name: 'Role' })
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Engineer')).not.toBeInTheDocument();
  });

  it('paginates its rows from the built-in footer', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={paginatedRows}
        pagination
        pageSize={2}
        pageSizeOptions={[2, 5]}
      />
    );
    expect(screen.getByLabelText('Rows per page')).toBeInTheDocument();
    expect(screen.getByText('Person 1')).toBeVisible();
    expect(screen.queryByText('Person 3')).not.toBeInTheDocument();
    await user.click(screen.getByLabelText('Go to next page'));
    expect(screen.queryByText('Person 1')).not.toBeInTheDocument();
    expect(screen.getByText('Person 3')).toBeVisible();
  });

  it('presents sortable headers and sorts on activation', async () => {
    const user = userEvent.setup();
    const people: Person[] = [
      { id: '1', name: 'Zed', role: 'Engineer' },
      { id: '2', name: 'Ada', role: 'Engineer' },
    ];
    render(<DataGrid columns={columns} rows={people} sortable />);

    const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
    expect(nameHeader).toHaveAttribute('aria-sort', 'none');

    await user.click(within(nameHeader).getByRole('button'));

    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    // Ascending puts Ada before Zed.
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Ada');
  });

  it('shows multi-sort priority when sorting more than one column', async () => {
    const user = userEvent.setup();
    const people: Person[] = [
      { id: '1', name: 'Zed', role: 'Operator' },
      { id: '2', name: 'Ada', role: 'Engineer' },
    ];
    render(<DataGrid columns={columns} rows={people} multiSort />);

    await user.click(
      within(screen.getByRole('columnheader', { name: /Role/ })).getByRole(
        'button'
      )
    );
    // Shift-activation adds the second column to the sort instead of replacing.
    await user.keyboard('{Shift>}');
    await user.click(
      within(screen.getByRole('columnheader', { name: /Name/ })).getByRole(
        'button'
      )
    );
    await user.keyboard('{/Shift}');

    // Both columns carry a visible 1-based priority indicator.
    expect(screen.getByText('1')).toBeVisible();
    expect(screen.getByText('2')).toBeVisible();
  });

  it('filters rows through a column filter control and its removable chip', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        filters={[{ columnId: 'name', label: 'Name', operators: ['contains'] }]}
        toolbar={{ columnFilters: true }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Name' }));
    await user.type(screen.getByLabelText('Name value'), 'Ada');
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    expect(screen.getByText('Ada Lovelace')).toBeVisible();
    expect(screen.queryByText('Grace Hopper')).not.toBeInTheDocument();

    // The applied filter surfaces as a removable chip; removing it restores all.
    expect(screen.getByText(/Name contains/)).toBeVisible();
    await user.click(
      screen.getByRole('button', { name: 'Remove Name filter' })
    );
    expect(screen.getByText('Grace Hopper')).toBeVisible();
  });

  it('clears every column filter from the reset control', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        filters={[{ columnId: 'name', label: 'Name', operators: ['contains'] }]}
        toolbar={{ columnFilters: true }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Name' }));
    await user.type(screen.getByLabelText('Name value'), 'Ada');
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(screen.queryByText('Grace Hopper')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(screen.getByText('Grace Hopper')).toBeVisible();
    expect(screen.queryByText(/Name contains/)).not.toBeInTheDocument();
  });

  it('enforces single selection and hides the header select-all', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        selectable
        selectionMode="single"
        getRowId={(row) => row.id}
      />
    );

    expect(screen.queryByLabelText('Select all rows')).not.toBeInTheDocument();
    const [first, second] = screen.getAllByLabelText('Select row');

    await user.click(first);
    expect(first).toHaveAttribute('aria-checked', 'true');

    await user.click(second);
    expect(second).toHaveAttribute('aria-checked', 'true');
    // Single mode deselects the previous row.
    expect(first).toHaveAttribute('aria-checked', 'false');
  });

  it('excludes ineligible rows from select-all', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        selectable
        getRowId={(row) => row.id}
        isRowSelectable={(row) => row.name === 'Ada Lovelace'}
      />
    );

    await user.click(screen.getByLabelText('Select all rows'));
    const [ada, grace] = screen.getAllByLabelText('Select row');
    expect(ada).toHaveAttribute('aria-checked', 'true');
    expect(grace).toHaveAttribute('aria-checked', 'false');
  });

  it('runs a row action from the actions menu without triggering the row click', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const onRowClick = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        onRowClick={onRowClick}
        actions={{ items: [{ id: 'edit', label: 'Edit' }], onAction }}
      />
    );

    await user.click(screen.getAllByRole('button', { name: 'Row actions' })[0]);
    expect(onRowClick).not.toHaveBeenCalled();

    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(onAction).toHaveBeenCalledWith('edit', rows[0]);
  });

  it('confirms a destructive row action before firing it', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        actions={{
          items: [
            {
              id: 'delete',
              label: 'Delete',
              destructive: true,
              confirm: { title: 'Delete row?' },
            },
          ],
          onAction,
        }}
      />
    );

    await user.click(screen.getAllByRole('button', { name: 'Row actions' })[0]);
    await user.click(screen.getByRole('menuitem', { name: 'Delete' }));

    expect(onAction).not.toHaveBeenCalled();
    expect(screen.getByText('Delete row?')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(onAction).toHaveBeenCalledWith('delete', rows[0]);
  });

  it('surfaces a bulk-action bar for the selection and runs / clears it', async () => {
    const user = userEvent.setup();
    const onBulk = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        selectable
        getRowId={(row) => row.id}
        bulkActions={[{ id: 'archive', label: 'Archive', onAction: onBulk }]}
      />
    );

    expect(
      screen.queryByRole('toolbar', { name: 'Bulk actions' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByLabelText('Select all rows'));
    const bar = screen.getByRole('toolbar', { name: 'Bulk actions' });
    expect(within(bar).getByText('2 selected')).toBeVisible();

    await user.click(within(bar).getByRole('button', { name: 'Archive' }));
    expect(onBulk).toHaveBeenCalledWith(rows);

    await user.click(within(bar).getByRole('button', { name: 'Clear' }));
    expect(
      screen.queryByRole('toolbar', { name: 'Bulk actions' })
    ).not.toBeInTheDocument();
  });

  it('supports current-row roving focus and keyboard activation', async () => {
    const user = userEvent.setup();
    const onRowActivate = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        currentRow
        onRowActivate={onRowActivate}
      />
    );

    const bodyRows = screen.getAllByRole('row').slice(1);
    bodyRows[0].focus();
    await user.keyboard('{ArrowDown}');
    expect(bodyRows[1]).toHaveAttribute('aria-current', 'true');

    await user.keyboard('{Enter}');
    expect(onRowActivate).toHaveBeenCalledWith(rows[1]);
  });

  it('renders an error alert with a retry action', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        state="error"
        error="Failed to load."
        onRetry={onRetry}
      />
    );

    expect(screen.getByText('Failed to load.')).toBeVisible();
    // An error is never treated as empty rows.
    expect(screen.queryByText('Ada Lovelace')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalled();
  });

  it('drives server mode without slicing rows and reports server pagination', () => {
    const onQueryChange = vi.fn();
    const query = createDataTableQuery(
      createDefaultDataTableState({ pagination: { pageIndex: 0, pageSize: 2 } })
    );
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        server={{ query, pageCount: 3, onQueryChange }}
      />
    );

    // Server pre-slices; both supplied rows render and the count comes from it.
    expect(screen.getByText('Ada Lovelace')).toBeVisible();
    expect(screen.getByText('Grace Hopper')).toBeVisible();
    expect(screen.getByText(/Page 1 of 3/)).toBeVisible();
  });

  it('emits onQueryChange with the next page when navigating in server mode', async () => {
    const user = userEvent.setup();
    const onQueryChange = vi.fn();
    const query = createDataTableQuery(
      createDefaultDataTableState({ pagination: { pageIndex: 0, pageSize: 2 } })
    );
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        server={{ query, pageCount: 3, onQueryChange }}
      />
    );

    await user.click(screen.getByLabelText('Go to next page'));
    expect(onQueryChange).toHaveBeenCalledTimes(1);
    expect(onQueryChange.mock.calls[0]?.[0]?.query.pagination.pageIndex).toBe(
      1
    );
  });

  it('suppresses built-in chrome and renders an external chrome renderer', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        pagination
        chrome={{
          mode: 'external',
          render: (context) => (
            <div data-testid="external-chrome">
              {context.state.pagination.pageSize} per page
            </div>
          ),
        }}
      />
    );

    expect(screen.getByTestId('external-chrome')).toBeVisible();
    // Built-in pagination is suppressed; the grid body still renders.
    expect(screen.queryByLabelText('Rows per page')).not.toBeInTheDocument();
    expect(screen.getByText('Ada Lovelace')).toBeVisible();
  });

  it('renders no duplicate chrome when an external renderer owns it', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        selectable
        pagination
        filters={[{ columnId: 'name', label: 'Name' }]}
        bulkActions={[{ id: 'archive', label: 'Archive', onAction: () => {} }]}
        chrome={{
          mode: 'external',
          render: () => <div data-testid="external-chrome">custom</div>,
        }}
      />
    );

    // Every built-in surface stays suppressed, so no control renders twice.
    expect(screen.getByTestId('external-chrome')).toBeVisible();
    expect(screen.queryByLabelText('Rows per page')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /View/ })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Name' })
    ).not.toBeInTheDocument();

    // Not even once rows are selected — the bulk bar is built-in chrome too.
    await user.click(screen.getByLabelText('Select all rows'));
    expect(
      screen.queryByRole('toolbar', { name: 'Bulk actions' })
    ).not.toBeInTheDocument();

    // The body and its data-state region are table content, not chrome.
    expect(screen.getByText('Ada Lovelace')).toBeVisible();
  });

  it('warns when external chrome is combined with a toolbar', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        toolbar
        chrome={{ mode: 'external', render: () => <div /> }}
      />
    );
    expect(error).toHaveBeenCalledWith(expect.stringContaining('external'));
    error.mockRestore();
  });

  it('warns when bulk actions are used without multiple selection', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        selectable
        selectionMode="single"
        bulkActions={[{ id: 'x', label: 'X', onAction: () => {} }]}
      />
    );
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('bulk actions require multiple selection')
    );
    error.mockRestore();
  });
});

describe('DataGrid grouped config', () => {
  it('enables single selection via the grouped `selection` config', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        selection={{ mode: 'single' }}
      />
    );

    expect(screen.queryByLabelText('Select all rows')).not.toBeInTheDocument();
    const [first, second] = screen.getAllByLabelText('Select row');
    await user.click(first);
    await user.click(second);
    expect(first).toHaveAttribute('aria-checked', 'false');
    expect(second).toHaveAttribute('aria-checked', 'true');
  });

  it('enables multi-sort via the grouped `sorting` config', async () => {
    const user = userEvent.setup();
    const people: Person[] = [
      { id: '1', name: 'Zed', role: 'Operator' },
      { id: '2', name: 'Ada', role: 'Engineer' },
    ];
    render(
      <DataGrid
        columns={columns}
        rows={people}
        sorting={{ mode: 'multiple' }}
      />
    );

    await user.click(
      within(screen.getByRole('columnheader', { name: /Role/ })).getByRole(
        'button'
      )
    );
    await user.keyboard('{Shift>}');
    await user.click(
      within(screen.getByRole('columnheader', { name: /Name/ })).getByRole(
        'button'
      )
    );
    await user.keyboard('{/Shift}');

    expect(screen.getByText('1')).toBeVisible();
    expect(screen.getByText('2')).toBeVisible();
  });

  it('renders the error state via the grouped `dataState` config', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        dataState={{ status: 'error', error: 'Boom', onRetry }}
      />
    );

    expect(screen.getByText('Boom')).toBeVisible();
    expect(screen.queryByText('Ada Lovelace')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalled();
  });

  it('drives current-row activation via the grouped `rowInteraction` config', async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        rowInteraction={{ current: true, onActivate }}
      />
    );

    const bodyRows = screen.getAllByRole('row').slice(1);
    bodyRows[0].focus();
    await user.keyboard('{Enter}');
    expect(onActivate).toHaveBeenCalledWith(rows[0]);
  });

  it('warns and lets the grouped config win when a deprecated alias duplicates it', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        sorting={{ mode: 'multiple' }}
        sortable={false}
      />
    );

    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('`sorting` cannot be combined with `sortable`')
    );
    // Grouped config wins: headers are sortable despite `sortable={false}`.
    expect(
      within(screen.getByRole('columnheader', { name: /Name/ })).getByRole(
        'button'
      )
    ).toBeInTheDocument();
    error.mockRestore();
  });
});

describe('DataGrid union grouped configs', () => {
  it('accepts `filters` as a grouped config object', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        filters={{
          columns: [
            { columnId: 'name', label: 'Name', operators: ['contains'] },
          ],
        }}
        toolbar={{ columnFilters: true }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Name' }));
    await user.type(screen.getByLabelText('Name value'), 'Ada');
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(screen.queryByText('Grace Hopper')).not.toBeInTheDocument();
  });

  it('drives global search from `filters.global` + `toolbar.globalSearch`', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        filters={{ global: { columnId: 'name', placeholder: 'Find' } }}
        toolbar={{ globalSearch: true }}
      />
    );

    await user.type(screen.getByPlaceholderText('Find'), 'Ada');
    expect(screen.getByText('Ada Lovelace')).toBeVisible();
    expect(screen.queryByText('Grace Hopper')).not.toBeInTheDocument();
  });

  it('accepts `pagination` as a grouped config object', () => {
    render(
      <DataGrid
        columns={columns}
        rows={paginatedRows}
        pagination={{ pageSize: 2, pageSizeOptions: [2, 5] }}
      />
    );

    expect(screen.getByLabelText('Rows per page')).toBeInTheDocument();
    expect(screen.getByText('Person 1')).toBeVisible();
    expect(screen.queryByText('Person 3')).not.toBeInTheDocument();
  });

  it('accepts bulk actions via `toolbar.bulkActions`', async () => {
    const user = userEvent.setup();
    const onBulk = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        selectable
        getRowId={(row) => row.id}
        toolbar={{ bulkActions: [{ id: 'x', label: 'X', onAction: onBulk }] }}
      />
    );

    await user.click(screen.getByLabelText('Select all rows'));
    await user.click(
      within(screen.getByRole('toolbar', { name: 'Bulk actions' })).getByRole(
        'button',
        { name: 'X' }
      )
    );
    expect(onBulk).toHaveBeenCalled();
  });

  it('warns when a grouped config duplicates its deprecated alias', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        pagination={{ pageSize: 2 }}
        pageSize={5}
      />
    );
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining(
        '`pagination` config cannot be combined with `pageSize`'
      )
    );
    error.mockRestore();
  });
});

describe('DataGrid actions config', () => {
  it('renders no actions column when actions are disabled', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        actions={false}
      />
    );

    expect(
      screen.queryByRole('button', { name: 'Row actions' })
    ).not.toBeInTheDocument();
    expect(
      within(screen.getAllByRole('row')[1]).getAllByRole('cell')
    ).toHaveLength(columns.length);
  });

  it('places the actions column at the start when asked', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        actions={{
          placement: 'start',
          items: [{ id: 'edit', label: 'Edit' }],
          onAction: () => {},
        }}
      />
    );

    const cells = within(screen.getAllByRole('row')[1]).getAllByRole('cell');
    expect(
      within(cells[0]).getByRole('button', { name: 'Row actions' })
    ).toBeVisible();
  });

  it('renders a custom actions cell and still isolates row propagation', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const onRowClick = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        onRowClick={onRowClick}
        actions={{
          render: (row) => (
            <button type="button" onClick={() => onOpen(row.id)}>
              Open {row.name}
            </button>
          ),
          onAction: () => {},
        }}
      />
    );

    // The built-in menu is replaced wholesale by the custom renderer.
    expect(
      screen.queryByRole('button', { name: 'Row actions' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Open Ada Lovelace' }));
    expect(onOpen).toHaveBeenCalledWith('1');
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('warns when action items are combined with a custom renderer', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        actions={
          {
            items: [{ id: 'edit', label: 'Edit' }],
            render: () => <span>custom</span>,
            onAction: () => {},
          } as unknown as DataGridActionsConfig<Person>
        }
      />
    );
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining(
        '`actions.items` cannot be combined with `actions.render`'
      )
    );
    error.mockRestore();
  });

  it('warns when two action items share an id', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        actions={{
          items: [
            { id: 'edit', label: 'Edit' },
            { id: 'edit', label: 'Edit again' },
          ],
          onAction: () => {},
        }}
      />
    );
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('duplicate action id "edit"')
    );
    error.mockRestore();
  });
});

describe('DataGrid named callbacks', () => {
  it('reports every slice transition through onStateChange', async () => {
    const user = userEvent.setup();
    const onStateChange = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        selectable
        callbacks={{ onStateChange }}
      />
    );

    await user.click(screen.getByLabelText('Select all rows'));

    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        slice: 'selection',
        cause: expect.any(String),
        state: expect.any(Object),
        query: expect.objectContaining({ requestKey: expect.any(String) }),
      })
    );
  });

  it('reports selection through onSelectionChange only', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        selectable
        sortable
        callbacks={{ onSelectionChange }}
      />
    );

    await user.click(screen.getAllByLabelText('Select row')[0]);
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    const event = onSelectionChange.mock.calls[0][0];
    expect(event.slice).toBe('selection');
    expect([...event.value]).toEqual(['1']);

    // A sort is a different slice, so it must not reach this callback.
    await user.click(
      within(screen.getByRole('columnheader', { name: /Name/ })).getByRole(
        'button'
      )
    );
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
  });

  it('reports roving focus through onCurrentRowChange', async () => {
    const user = userEvent.setup();
    const onCurrentRowChange = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        rowInteraction={{ current: true }}
        callbacks={{ onCurrentRowChange }}
      />
    );

    screen.getAllByRole('row')[1].focus();
    await user.keyboard('{ArrowDown}');

    expect(onCurrentRowChange).toHaveBeenCalledWith(
      expect.objectContaining({ slice: 'currentRowId', value: '2' })
    );
  });

  it('reports page navigation through onPaginationChange', async () => {
    const user = userEvent.setup();
    const onPaginationChange = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={paginatedRows}
        getRowId={(row) => row.id}
        pagination={{ pageSize: 2 }}
        callbacks={{ onPaginationChange }}
      />
    );

    await user.click(screen.getByLabelText('Go to next page'));

    expect(onPaginationChange).toHaveBeenCalledWith(
      expect.objectContaining({
        slice: 'pagination',
        value: expect.objectContaining({ pageIndex: 1, pageSize: 2 }),
      })
    );
  });

  it('fans the four column slices into onColumnStateChange', async () => {
    const user = userEvent.setup();
    const onColumnStateChange = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        toolbar
        callbacks={{ onColumnStateChange }}
      />
    );

    await user.click(screen.getByRole('button', { name: /View/ }));
    await user.click(screen.getByRole('menuitemcheckbox', { name: /role/i }));

    expect(onColumnStateChange).toHaveBeenCalledWith(
      expect.objectContaining({ slice: 'columnVisibility' })
    );
  });

  it('lets server.onQueryChange run before the observing callback', async () => {
    const user = userEvent.setup();
    const order: string[] = [];
    const query = createDataTableQuery(
      createDefaultDataTableState({ pagination: { pageIndex: 0, pageSize: 2 } })
    );
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        sortable
        server={{
          query,
          pageCount: 3,
          onQueryChange: () => order.push('server'),
        }}
        callbacks={{ onQueryChange: () => order.push('callback') }}
      />
    );

    await user.click(
      within(screen.getByRole('columnheader', { name: /Name/ })).getByRole(
        'button'
      )
    );

    // The server handler is authoritative and refetches; the callback only
    // observes the same event afterwards.
    expect(order).toEqual(['server', 'callback']);
  });

  it('emits onQueryChange without a server config', async () => {
    const user = userEvent.setup();
    const onQueryChange = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        sortable
        callbacks={{ onQueryChange }}
      />
    );

    await user.click(
      within(screen.getByRole('columnheader', { name: /Name/ })).getByRole(
        'button'
      )
    );
    expect(onQueryChange).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.objectContaining({ requestKey: expect.any(String) }),
        previousQuery: expect.any(Object),
      })
    );
  });

  it('carries the enriched event alongside the rowInteraction handler', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onRowClick = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        rowInteraction={{ onClick }}
        callbacks={{ onRowClick }}
      />
    );

    await user.click(screen.getByText('Ada Lovelace'));

    // The config handler gets the row; the named callback gets the full event.
    expect(onClick).toHaveBeenCalledWith(rows[0]);
    expect(onRowClick).toHaveBeenCalledWith(
      expect.objectContaining({
        row: expect.objectContaining({ id: '1', data: rows[0] }),
        nativeEvent: expect.any(Object),
      })
    );
  });

  it('reports cell clicks with the cell context', async () => {
    const user = userEvent.setup();
    const onCellClick = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        callbacks={{ onCellClick }}
      />
    );

    // Both fixture rows are Engineers, so target the first row's cell.
    await user.click(screen.getAllByText('Engineer')[0]);

    expect(onCellClick).toHaveBeenCalledWith(
      expect.objectContaining({
        cell: expect.objectContaining({
          columnId: 'role',
          row: expect.objectContaining({ data: rows[0] }),
        }),
      })
    );
  });

  it('reports a row action through onRowAction after the config handler', async () => {
    const user = userEvent.setup();
    const order: string[] = [];
    const onRowAction = vi.fn(() => order.push('callback'));
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        actions={{
          items: [{ id: 'edit', label: 'Edit' }],
          onAction: () => order.push('config'),
        }}
        callbacks={{ onRowAction }}
      />
    );

    await user.click(screen.getAllByRole('button', { name: 'Row actions' })[0]);
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));

    expect(order).toEqual(['config', 'callback']);
    expect(onRowAction).toHaveBeenCalledWith({
      actionId: 'edit',
      row: rows[0],
    });
  });

  it('reports the error-state retry through onDataStateAction', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const onDataStateAction = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        dataState={{ status: 'error', error: 'Failed.', onRetry }}
        callbacks={{ onDataStateAction }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onDataStateAction).toHaveBeenCalledWith({ action: 'retry' });
  });

  it('installs no handlers when no callbacks are supplied', () => {
    // Guards the opt-in shape: an unbound grid must not pay for the fan-out.
    expect(resolveSliceCallbacks(undefined)).toBeUndefined();
    expect(resolveSliceCallbacks({})).toBeUndefined();
    expect(
      Object.keys(resolveSliceCallbacks({ onSelectionChange: () => {} }) ?? {})
    ).toEqual(['selection']);
  });
});

describe('DataGrid presets', () => {
  const denseSelectable: DataGridPreset<Person> = {
    id: 'dense-selectable',
    config: {
      selection: { mode: 'multiple' },
      sorting: { mode: 'single' },
      pagination: { pageSize: 2 },
    },
  };

  it('applies every grouped config a named preset carries', () => {
    render(
      <DataGrid
        columns={columns}
        rows={paginatedRows}
        getRowId={(row) => row.id}
        presets={{
          definitions: [denseSelectable],
          apply: ['dense-selectable'],
        }}
      />
    );

    expect(screen.getByLabelText('Select all rows')).toBeVisible();
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute(
      'aria-sort',
      'none'
    );
    expect(screen.getByText('Person 1')).toBeVisible();
    expect(screen.queryByText('Person 3')).not.toBeInTheDocument();
  });

  it('applies row actions carried by a preset', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        presets={{
          definitions: [
            {
              id: 'with-actions',
              config: {
                actions: { items: [{ id: 'edit', label: 'Edit' }], onAction },
              },
            },
          ],
          apply: ['with-actions'],
        }}
      />
    );

    await user.click(screen.getAllByRole('button', { name: 'Row actions' })[0]);
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(onAction).toHaveBeenCalledWith('edit', rows[0]);
  });

  it('lets an explicit grouped config beat the preset', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        presets={{
          definitions: [denseSelectable],
          apply: ['dense-selectable'],
        }}
        selection={{ mode: 'single' }}
      />
    );

    // Single mode owns the header cell, so no select-all is offered.
    expect(screen.queryByLabelText('Select all rows')).not.toBeInTheDocument();
    expect(screen.getAllByLabelText('Select row')).toHaveLength(rows.length);
  });

  it('lets a deprecated alias beat the preset without reporting a duplicate', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        presets={{
          definitions: [denseSelectable],
          apply: ['dense-selectable'],
        }}
        selectable
        selectionMode="single"
      />
    );

    expect(screen.queryByLabelText('Select all rows')).not.toBeInTheDocument();
    // The preset never injected `selection`, so it cannot collide with the alias.
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it('resolves presets left-to-right so the later one wins', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        presets={{
          definitions: [
            denseSelectable,
            { id: 'single', config: { selection: { mode: 'single' } } },
          ],
          apply: ['dense-selectable', 'single'],
        }}
      />
    );

    expect(screen.queryByLabelText('Select all rows')).not.toBeInTheDocument();
  });

  it('applies detected presets once, below the explicit apply list', () => {
    const detect = vi.fn(() => ['dense-selectable']);
    const { rerender } = render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        presets={{
          definitions: [
            denseSelectable,
            { id: 'single', config: { selection: { mode: 'single' } } },
          ],
          apply: ['single'],
          detect,
        }}
      />
    );

    expect(detect).toHaveBeenCalledTimes(1);
    // Detection is inference; the explicit `apply` list outranks it.
    expect(screen.queryByLabelText('Select all rows')).not.toBeInTheDocument();

    rerender(
      <DataGrid
        columns={columns}
        rows={paginatedRows}
        getRowId={(row) => row.id}
        presets={{
          definitions: [
            denseSelectable,
            { id: 'single', config: { selection: { mode: 'single' } } },
          ],
          apply: ['single'],
          detect,
        }}
      />
    );

    // Detection can never observe mutable state — new rows do not re-run it.
    expect(detect).toHaveBeenCalledTimes(1);
  });

  it('warns when an applied preset is not defined', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        presets={{ definitions: [denseSelectable], apply: ['compact'] }}
      />
    );
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining(
        'preset "compact" is not defined in `presets.definitions`'
      )
    );
    error.mockRestore();
  });

  it('warns when a preset carries something other than a grouped config', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        presets={{
          definitions: [
            {
              id: 'smuggled',
              // A JavaScript consumer can get past the types; validation still reports it.
              config: {
                server: { query: {} },
              } as unknown as DataGridGroupedConfig<Person>,
            },
          ],
          apply: ['smuggled'],
        }}
      />
    );
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining(
        'preset "smuggled" cannot set `server`; presets carry grouped configs only'
      )
    );
    error.mockRestore();
  });
});

// design §5.2 defaults the toolbar's own members: `globalSearch` false,
// `columnFilters` false, `viewOptions` true. Shipped code rendered the
// column-filter row and the view-options menu unconditionally with no way to
// disable either; these pin the corrected behavior.
describe('DataGrid toolbar members', () => {
  const nameFilter = [
    { columnId: 'name', label: 'Name', operators: ['contains'] as const },
  ];

  it('does not surface column-filter controls until `toolbar.columnFilters`', () => {
    const { rerender } = render(
      <DataGrid columns={columns} rows={rows} filters={nameFilter} />
    );
    expect(screen.queryByRole('button', { name: 'Name' })).toBeNull();

    rerender(
      <DataGrid
        columns={columns}
        rows={rows}
        filters={nameFilter}
        toolbar={{ columnFilters: true }}
      />
    );
    expect(screen.getByRole('button', { name: 'Name' })).toBeVisible();
  });

  it('warns when filter definitions would render nowhere', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<DataGrid columns={columns} rows={rows} filters={nameFilter} />);
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining(
        '`filters.columns` defines filter controls but `toolbar.columnFilters` is not enabled'
      )
    );
    error.mockRestore();
  });

  it('stays silent when the filter controls are surfaced', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        filters={nameFilter}
        toolbar={{ columnFilters: true }}
      />
    );
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it('shows the view-options menu by default and hides it on request', () => {
    const { rerender } = render(
      <DataGrid columns={columns} rows={rows} toolbar />
    );
    expect(screen.getByRole('button', { name: 'View' })).toBeVisible();

    rerender(
      <DataGrid columns={columns} rows={rows} toolbar={{ viewOptions: true }} />
    );
    expect(screen.getByRole('button', { name: 'View' })).toBeVisible();

    rerender(
      <DataGrid
        columns={columns}
        rows={rows}
        toolbar={{ viewOptions: false }}
      />
    );
    expect(screen.queryByRole('button', { name: 'View' })).toBeNull();
  });

  it('keeps the search box when the view-options menu is hidden', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        filters={{ global: { columnId: 'name', placeholder: 'Find' } }}
        toolbar={{ globalSearch: true, viewOptions: false }}
      />
    );

    expect(screen.queryByRole('button', { name: 'View' })).toBeNull();
    await user.type(screen.getByPlaceholderText('Find'), 'Ada');
    expect(screen.getByText('Ada Lovelace')).toBeVisible();
    expect(screen.queryByText('Grace Hopper')).not.toBeInTheDocument();
  });
});

// The assembled column set is memoized because a new columns array invalidates
// TanStack's memoized row model. It does *not* protect selection — that is keyed
// by row id in the controller's own state — and this pins the difference, so the
// memo can be reasoned about as a performance property rather than a correctness
// one.
describe('DataGrid column-set identity', () => {
  it('keeps selection across a re-render with a brand-new columns array', async () => {
    const user = userEvent.setup();
    const grid = (
      <DataGrid
        columns={[...columns]}
        rows={rows}
        selectable
        getRowId={(row) => row.id}
        callbacks={{ onSelectionChange: () => {} }}
      />
    );
    const { rerender } = render(grid);

    await user.click(screen.getAllByLabelText('Select row')[0]);
    expect(screen.getAllByLabelText('Select row')[0]).toBeChecked();

    // A fresh columns array *and* a fresh callbacks object — maximal churn.
    rerender(
      <DataGrid
        columns={[...columns]}
        rows={rows}
        selectable
        getRowId={(row) => row.id}
        callbacks={{ onSelectionChange: () => {} }}
      />
    );
    expect(screen.getAllByLabelText('Select row')[0]).toBeChecked();
  });
});

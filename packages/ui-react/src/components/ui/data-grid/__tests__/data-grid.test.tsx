import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DataGrid } from '../data-grid';

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

describe('DataGrid', () => {
  it('renders column headers and a row per datum', () => {
    render(<DataGrid columns={columns} rows={rows} />);
    expect(screen.getByText('Name')).toBeVisible();
    expect(screen.getByText('Role')).toBeVisible();
    expect(screen.getByText('Ada Lovelace')).toBeVisible();
    expect(screen.getByText('Grace Hopper')).toBeVisible();
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
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        state="loading"
        skeletonRows={3}
      />
    );
    expect(screen.queryByText('Ada Lovelace')).not.toBeInTheDocument();
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

  it('renders the toolbar search when a searchKey is given', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        searchKey="name"
        searchPlaceholder="Find a person"
      />
    );
    expect(screen.getByPlaceholderText('Find a person')).toBeVisible();
  });

  it('renders the pagination footer when enabled', () => {
    render(<DataGrid columns={columns} rows={rows} pagination />);
    expect(screen.getByLabelText('Rows per page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
  });
});

import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  createDataTableQuery,
  createDefaultDataTableState,
} from '../../data-table';
import { DataGrid } from '../data-grid';

// `state` / `defaultState` exposure (design §3.2). The controller already
// implements every controlled/uncontrolled rule; these prove the two props reach
// it and that DataGrid's own precedence rules hold on top.

interface Person {
  id: string;
  name: string;
}

const columns: ColumnDef<Person, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
];
const rows: Person[] = [
  { id: '1', name: 'Ada' },
  { id: '2', name: 'Grace' },
];
const getRowId = (row: Person) => row.id;

describe('DataGrid state and defaultState', () => {
  it('initializes an uncontrolled slice from `defaultState`', async () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        selection={{ mode: 'multiple' }}
        defaultState={{ selection: new Set(['1']) }}
      />
    );

    const boxes = screen.getAllByLabelText('Select row');
    expect(boxes[0]).toBeChecked();
    expect(boxes[1]).not.toBeChecked();
  });

  it('requests without committing when a slice is controlled', async () => {
    // Design §3.2 rule 1: a slice present in `state` is controlled — the change
    // event fires so the owner can apply it, but nothing is committed internally.
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        selection={{ mode: 'multiple' }}
        state={{ selection: new Set<string>() }}
        callbacks={{ onSelectionChange }}
      />
    );

    await user.click(screen.getAllByLabelText('Select row')[0]);

    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(onSelectionChange.mock.calls[0][0].value).toEqual(new Set(['1']));
    // Still unchecked: the owner did not apply the request.
    expect(screen.getAllByLabelText('Select row')[0]).not.toBeChecked();
  });

  it('commits when the same slice is uncontrolled', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        selection={{ mode: 'multiple' }}
      />
    );

    await user.click(screen.getAllByLabelText('Select row')[0]);
    expect(screen.getAllByLabelText('Select row')[0]).toBeChecked();
  });

  it('errors in development when a slice is in both state and defaultState', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        selection={{ mode: 'multiple' }}
        state={{ selection: new Set(['1']) }}
        defaultState={{ selection: new Set(['2']) }}
      />
    );

    expect(error).toHaveBeenCalledWith(
      expect.stringContaining(
        'cannot be supplied in both state and defaultState'
      )
    );
    // Controlled wins.
    expect(screen.getAllByLabelText('Select row')[0]).toBeChecked();
    error.mockRestore();
  });

  it('lets a caller `defaultState` slice beat a group default', () => {
    // Design §5.1: defaultState beats config defaults. `pagination.pageSize`
    // contributes an initial page, and the caller is more explicit.
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        pagination={{ pageSize: 1 }}
        defaultState={{ pagination: { pageIndex: 1, pageSize: 1 } }}
      />
    );

    // Page two of two, so the second row shows.
    expect(screen.getByText('Grace')).toBeVisible();
    expect(screen.queryByText('Ada')).not.toBeInTheDocument();
  });

  it('reports a caller controlling a slice server mode already owns', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        server={{
          query: createDataTableQuery(createDefaultDataTableState()),
          onQueryChange: () => {},
        }}
        state={{ pagination: { pageIndex: 3, pageSize: 10 } }}
      />
    );

    expect(error).toHaveBeenCalledWith(
      expect.stringContaining(
        '`server` already controls the `pagination` slice'
      )
    );
    error.mockRestore();
  });
});

describe('DataGrid deprecated identity aliases', () => {
  it('keeps the deprecated string `state` working', () => {
    render(<DataGrid columns={columns} rows={rows} state="empty" />);
    expect(screen.getByText('No results.')).toBeVisible();
    expect(screen.queryByText('Ada')).not.toBeInTheDocument();
  });

  it('still warns when the string `state` duplicates `dataState`', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        state="loading"
        dataState={{ status: 'empty' }}
      />
    );
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('`dataState` cannot be combined with `state`')
    );
    error.mockRestore();
  });

  it('warns that `selectable` without `getRowId` cannot survive a data change', () => {
    // The grouped `selection` config cannot compile without `getRowId`; the
    // deprecated alias stays source-compatible and warns instead (design §3.1).
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<DataGrid columns={columns} rows={rows} selectable />);
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('`selectable` without `getRowId`')
    );
    error.mockRestore();
  });

  it('warns that `currentRow` without `getRowId` cannot survive a data change', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<DataGrid columns={columns} rows={rows} currentRow />);
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('`currentRow` without `getRowId`')
    );
    error.mockRestore();
  });

  it('stays silent once `getRowId` is supplied', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        selectable
        currentRow
      />
    );
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });
});

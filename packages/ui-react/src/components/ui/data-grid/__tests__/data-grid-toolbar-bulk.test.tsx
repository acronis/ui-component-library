import type { ColumnDef } from '@tanstack/react-table';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import {
  createDataTableQuery,
  createDefaultDataTableState,
} from '../../data-table';
import { DataGrid } from '../data-grid';
import { DATA_GRID_SETTINGS_COLUMN_ID } from '../data-grid-config/toolbar';

// PLTFRM-93130, user-reported: **selecting a row made the whole table jump.**
//
// ── THE MECHANISM ────────────────────────────────────────────────────────────
// Every DataGrid chrome slot is a sibling row inside one `flex flex-col gap-4`, and
// the bulk-action bar mounted in the `top` slot — above the toolbar — returning
// `null` while nothing was selected. So the first selected row *inserted* a row:
// the toolbar, the filter chips and the entire table moved down by the bar's height
// plus a 16px gap, and moved back up on clear.
//
// The fix is not "reserve space above the table": it is that the bulk bar is the
// toolbar row's **selected state**, rendered inside the same element that holds the
// idle members. Which makes the load-bearing assertion a structural one — same node,
// no new sibling — rather than a visual one. happy-dom has no layout engine, so
// nothing here can measure a pixel; what it can prove is that there is nothing to
// measure, because no box was created or destroyed.

interface Device {
  readonly id: string;
  readonly hostname: string;
  readonly status: 'healthy' | 'slow';
}

const devices: Device[] = [
  { id: 'd-1', hostname: 'web-01', status: 'healthy' },
  { id: 'd-2', hostname: 'web-02', status: 'slow' },
  { id: 'd-3', hostname: 'db-01', status: 'healthy' },
];

const columns: ColumnDef<Device, unknown>[] = [
  { accessorKey: 'hostname', header: 'Host' },
  { accessorKey: 'status', header: 'Status' },
];

const bulkActions = [
  { id: 'release', label: 'Release', onAction: () => {} },
  { id: 'blink', label: 'Blink', onAction: () => {} },
];

const TOOLBAR = '[data-slot="data-grid-toolbar"]';

/** The grid's chrome rows, in order — the sequence a mounted slot changes. */
const chromeRows = (container: HTMLElement) =>
  [...(container.firstElementChild?.children ?? [])].map((node) =>
    node.getAttribute('data-slot')
  );

describe('PLTFRM-93130 — the toolbar row does not move when a selection starts', () => {
  it('swaps contents inside the same element, adding no row', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <DataGrid
        columns={columns}
        rows={devices}
        getRowId={(row) => row.id}
        selection={{ mode: 'multiple' }}
        toolbar={{ bulkActions, trailing: <span>3 loaded</span> }}
      />
    );

    const rowBefore = container.querySelector(TOOLBAR);
    const layoutBefore = chromeRows(container);
    expect(rowBefore).not.toBeNull();

    await user.click(screen.getByLabelText('Select all rows'));

    // The two halves of "it cannot jump": the box is the same box, and the number of
    // boxes is unchanged. Either one alone would pass on a reimplementation that
    // still inserts a row — the old bug — as long as it inserted it somewhere else.
    expect(container.querySelector(TOOLBAR)).toBe(rowBefore);
    expect(chromeRows(container)).toEqual(layoutBefore);
    expect(
      screen.getByRole('toolbar', { name: 'Bulk actions' }).closest(TOOLBAR)
    ).toBe(rowBefore);
  });

  it('hides every idle member while selected and restores them on clear', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={devices}
        getRowId={(row) => row.id}
        selection={{ mode: 'multiple' }}
        filters={{ global: { columnId: 'hostname', placeholder: 'Find' } }}
        toolbar={{
          globalSearch: true,
          bulkActions,
          leading: <span>Leading slot</span>,
          trailing: <span>3 loaded</span>,
        }}
      />
    );

    expect(screen.getByPlaceholderText('Find')).toBeVisible();
    expect(screen.getByText('Leading slot')).toBeVisible();
    expect(screen.getByText('3 loaded')).toBeVisible();

    await user.click(screen.getByLabelText('Select all rows'));

    expect(screen.queryByPlaceholderText('Find')).not.toBeInTheDocument();
    expect(screen.queryByText('Leading slot')).not.toBeInTheDocument();
    expect(screen.queryByText('3 loaded')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Release' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Clear selection' }));

    expect(screen.getByPlaceholderText('Find')).toBeVisible();
    expect(screen.getByText('Leading slot')).toBeVisible();
    expect(screen.getByText('3 loaded')).toBeVisible();
  });

  it('keeps the applied-filter chips visible under the swapped row', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={devices}
        getRowId={(row) => row.id}
        selection={{ mode: 'multiple' }}
        filters={{ columns: [{ columnId: 'status', label: 'Status' }] }}
        toolbar={{ columnFilters: true, bulkActions }}
      />
    );

    // Apply a filter through the trigger, which now lives in the toolbar row.
    await user.click(screen.getByRole('button', { name: 'Status' }));
    await user.type(screen.getByLabelText('Status value'), 'healthy');
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(screen.getByRole('button', { name: 'Clear all' })).toBeVisible();

    await user.click(screen.getByLabelText('Select all rows'));

    // The trigger is covered by the bulk strip; the chip summary is not, because it
    // says which result set the selection was drawn from.
    expect(
      screen.queryByRole('button', { name: 'Status' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear all' })).toBeVisible();
  });

  it('leaves the row alone when the grid offers no bulk actions', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={devices}
        getRowId={(row) => row.id}
        selection={{ mode: 'multiple' }}
        toolbar={{ trailing: <span>3 loaded</span> }}
      />
    );

    await user.click(screen.getByLabelText('Select all rows'));

    // No selected state to swap into: the footer already reports the count, and
    // hiding the idle members to show a number twice would be a regression of its
    // own.
    expect(screen.getByText('3 loaded')).toBeVisible();
    expect(
      screen.queryByRole('toolbar', { name: 'Bulk actions' })
    ).not.toBeInTheDocument();
  });

  it('reserves the row for a bulk-actions grid that has no idle member', () => {
    const { container } = render(
      <DataGrid
        columns={columns}
        rows={devices}
        getRowId={(row) => row.id}
        selection={{ mode: 'multiple' }}
        toolbar={{ bulkActions }}
      />
    );

    // Empty, and present anyway. This is the case the `min-h-8` exists for: rendering
    // it only once something is selected would put the original bug back for exactly
    // the configuration Figma shows.
    const row = container.querySelector(TOOLBAR);
    expect(row).not.toBeNull();
    expect(row!.textContent).toBe('');
  });

  it('orders destructive actions last, so a row-loss handoff cannot land on one', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={devices}
        getRowId={(row) => row.id}
        selection={{ mode: 'multiple' }}
        toolbar={{
          bulkActions: [
            {
              id: 'delete',
              label: 'Delete',
              destructive: true,
              onAction: () => {},
            },
            { id: 'release', label: 'Release', onAction: () => {} },
          ],
        }}
      />
    );

    await user.click(screen.getAllByLabelText('Select row')[0]!);

    // Caller order is Delete-then-Release; rendered order is the reverse, because
    // rung 3 of the focus fallback (`data-table-body-window.ts`) hands focus to this
    // row's FIRST focusable control after a row loss — and a bulk delete is what
    // causes the row loss.
    const bar = screen.getByRole('toolbar', { name: 'Bulk actions' });
    const labels = within(bar)
      .getAllByRole('button')
      .map((button) => button.textContent);
    expect(labels.slice(0, 2)).toEqual(['Release', 'Delete']);
  });
});

describe('PLTFRM-93130 — the count the swapped row announces', () => {
  it('counts a server all-results selection by exclusion, not from the engine', () => {
    // The same defect #94 fixed in the pager, in the row that now also shows a count:
    // the engine's `rowSelection` slice is deliberately never written in `all-results`
    // mode, so a per-row count reads 0 however much is selected. Both readers go
    // through `data-grid-config/selected-count.ts`.
    const query = createDataTableQuery(
      createDefaultDataTableState({
        pagination: { pageIndex: 0, pageSize: 10 },
      })
    );
    render(
      <DataGrid
        columns={columns}
        rows={devices}
        getRowId={(row) => row.id}
        selection={{ mode: 'multiple', selectAll: 'all-results' }}
        toolbar={{ bulkActions }}
        server={{
          query,
          rowCount: 4821,
          selection: {
            mode: 'all-results',
            queryRequestKey: query.requestKey,
            excludedIds: new Set(['d-2']),
            token: 'srv-token',
          },
          onSelectionChange: () => {},
          onQueryChange: () => {},
        }}
      />
    );

    const bar = screen.getByRole('toolbar', { name: 'Bulk actions' });
    expect(within(bar).getByText('4820 items selected')).toBeVisible();
  });

  it('says "item" in the singular', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={devices}
        getRowId={(row) => row.id}
        selection={{ mode: 'multiple' }}
        toolbar={{ bulkActions }}
      />
    );

    await user.click(screen.getAllByLabelText('Select row')[0]!);
    expect(screen.getByText('1 item selected')).toBeVisible();
  });

  it('announces the count politely', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={devices}
        getRowId={(row) => row.id}
        selection={{ mode: 'multiple' }}
        toolbar={{ bulkActions }}
      />
    );

    await user.click(screen.getByLabelText('Select all rows'));
    // Polite, not assertive: the count changes on every checkbox click, and an
    // assertive region would interrupt the row announcement that caused it.
    expect(screen.getByText('3 items selected')).toHaveAttribute(
      'aria-live',
      'polite'
    );
  });
});

describe('PLTFRM-93130 — the column-settings gear moved into the trailing column', () => {
  it("takes over the row-actions column's header when there is one", () => {
    render(
      <DataGrid
        columns={columns}
        rows={devices}
        getRowId={(row) => row.id}
        toolbar={{ viewOptions: true }}
        actions={{
          items: [{ id: 'open', label: 'Open' }],
          onAction: () => {},
        }}
      />
    );

    const trigger = screen.getByRole('button', { name: 'Column settings' });
    const header = trigger.closest('th');
    expect(header).not.toBeNull();
    expect(header).toHaveAttribute('data-column-id', '__actions__');
    // Reuse, not addition: the design puts the ⚙ above the ⋯ menus rather than
    // beside them, so a grid with row actions grows no second gutter.
    expect(
      document.querySelector(
        `[data-column-id="${DATA_GRID_SETTINGS_COLUMN_ID}"]`
      )
    ).toBeNull();
  });

  it('appends its own 40px column when there is no actions column', () => {
    render(
      <DataGrid
        columns={columns}
        rows={devices}
        getRowId={(row) => row.id}
        toolbar={{ viewOptions: true }}
      />
    );

    const header = screen
      .getByRole('button', { name: 'Column settings' })
      .closest('th');
    expect(header).toHaveAttribute(
      'data-column-id',
      DATA_GRID_SETTINGS_COLUMN_ID
    );
    expect(header).toHaveStyle({ width: '40px' });
    // A display column: its cells hold nothing, and with no accessor the settings
    // menu cannot offer the column to itself.
    for (const row of screen.getAllByRole('row').slice(1)) {
      const cells = within(row).getAllByRole('cell');
      expect(cells[cells.length - 1]!.textContent).toBe('');
    }
  });

  it('adds no column to a grid that never asked for a toolbar', () => {
    render(<DataGrid columns={columns} rows={devices} />);

    // `viewOptions` defaults to true, but only *within* a requested toolbar. A grid
    // with no `toolbar` prop and no search column must not silently grow a column.
    expect(
      screen.queryByRole('button', { name: 'Column settings' })
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(columns.length);
  });
});

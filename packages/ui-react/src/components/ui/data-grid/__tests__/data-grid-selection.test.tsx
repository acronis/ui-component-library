import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DataGrid } from '../data-grid';

// OWNERSHIP: **U9**. The `selection` group's parity members that reach the grid
// today — `reserve`, `selectAllOnIndeterminate`, and the row control's event
// isolation. `selectByRow` is in `data-grid-select-by-row.test.tsx`, held red
// pending a consumer member on `DataTableViewProps`. `data-grid.test.tsx` is F4's
// and covers the shipped wiring (the column, the modes, the count); this file
// covers only what U9 added.
//
// Every configuration here is the grouped `selection` config. The deprecated
// `selectable`/`selectionMode`/`isRowSelectable` aliases **cannot express any of
// these three members** — they are flat booleans with no place to carry them —
// so the grouped form is not merely the preferred configuration, it is the only
// one, and `getRowId` comes with it by the identity rule.

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

const getRowId = (row: Person) => row.id;

describe('DataGrid selection — the row control', () => {
  it('isolates the row checkbox from the row-click handler', async () => {
    // Independent of `selectByRow`, and true of today's grid: the row control
    // did not isolate propagation, so a checkbox click also ran the row handler
    // — contradicting what `DataTableViewProps.onRowClick` documents. Asserted
    // here rather than only through `selectByRow`'s double-toggle, because this
    // configuration needs no new seam and so cannot go quietly inert.
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        selection={{ mode: 'multiple' }}
        rowInteraction={{ onClick }}
      />
    );
    const [ada] = screen.getAllByLabelText('Select row');

    await user.click(ada);
    expect(ada).toHaveAttribute('aria-checked', 'true');
    expect(onClick).not.toHaveBeenCalled();

    // The control for that negative: a data cell in the same row does reach the
    // handler, so the assertion above is about isolation and not a dead prop.
    await user.click(screen.getByText('Ada Lovelace'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('leaves a row click inert without selectByRow', async () => {
    // The default guard: a body-row click selects nothing unless asked. Cheap,
    // and it is what would catch `selectByRow` arriving switched on.
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        selection={{ mode: 'multiple' }}
      />
    );
    const [ada] = screen.getAllByLabelText('Select row');

    await user.click(screen.getByText('Ada Lovelace'));
    expect(ada).toHaveAttribute('aria-checked', 'false');
  });
});

describe('DataGrid selection — selectAllOnIndeterminate', () => {
  // The eligible set needs at least two members for the header to be
  // indeterminate at all: `getIsAllPageRowsSelected()` ignores ineligible rows,
  // so one-of-one-eligible reads as fully checked rather than mixed. The third
  // row is the ineligible one the scenario calls for.
  const threeRows: Person[] = [
    ...rows,
    { id: '3', name: 'Alan Turing', role: 'Operator' },
  ];
  const eligible = (row: Person) => row.role === 'Engineer';

  it('selects every eligible row from an indeterminate header control by default', async () => {
    // The member is left UNSET here on purpose. The default is `true` — a
    // deviation from design §5.2, ruled deliberately because `true` is what
    // ships: an indeterminate checkbox reports `checked: true` and that value was
    // passed straight through, so defaulting to `false` would change behaviour
    // for every existing caller with no code change on their part. This test is
    // therefore the compatibility guard, not just a feature test.
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={threeRows}
        getRowId={getRowId}
        selection={{ mode: 'multiple', isRowSelectable: eligible }}
      />
    );
    const selectAll = screen.getByLabelText('Select all rows');
    const [ada, grace, alan] = screen.getAllByLabelText('Select row');

    // Reach the indeterminate state through the row control, which is the only
    // way a user reaches it.
    await user.click(ada);
    expect(selectAll).toHaveAttribute('aria-checked', 'mixed');

    await user.click(selectAll);
    expect(ada).toHaveAttribute('aria-checked', 'true');
    expect(grace).toHaveAttribute('aria-checked', 'true');
    // "every eligible row" — the ineligible one is not swept in.
    expect(alan).toHaveAttribute('aria-checked', 'false');
  });

  it('clears from an indeterminate header control when asked', async () => {
    // The opt-in branch, and the one the member exists for. Paired with the test
    // above, the two are mutually exclusive readings of the same click, so
    // neither can pass while the policy is being ignored.
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        selection={{ mode: 'multiple', selectAllOnIndeterminate: false }}
      />
    );
    const selectAll = screen.getByLabelText('Select all rows');
    const [ada, grace] = screen.getAllByLabelText('Select row');

    await user.click(ada);
    expect(selectAll).toHaveAttribute('aria-checked', 'mixed');

    await user.click(selectAll);
    expect(ada).toHaveAttribute('aria-checked', 'false');
    expect(grace).toHaveAttribute('aria-checked', 'false');
  });

  it('still selects all from a fully unselected header control', async () => {
    // The indeterminate policy governs the indeterminate state only; the plain
    // unchecked → checked path is unchanged by either setting.
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        selection={{ mode: 'multiple' }}
      />
    );

    await user.click(screen.getByLabelText('Select all rows'));
    for (const box of screen.getAllByLabelText('Select row')) {
      expect(box).toHaveAttribute('aria-checked', 'true');
    }
  });

  it('stays silent in single mode when the caller never set the policy', () => {
    // The warning below keys off the caller having SET the member, not off its
    // resolved value. With the default at `true`, a resolved-value check would
    // fire for every single-mode grid in the kit — the member's own default
    // accusing a caller of setting something they never touched. This is the
    // control for that.
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        selection={{ mode: 'single' }}
      />
    );
    expect(error).not.toHaveBeenCalledWith(
      expect.stringContaining('selectAllOnIndeterminate')
    );
    error.mockRestore();
  });

  it('warns when the policy governs a control that does not render', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        selection={{ mode: 'single', selectAllOnIndeterminate: false }}
      />
    );
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('selectAllOnIndeterminate')
    );
    error.mockRestore();
  });
});

describe('DataGrid selection — reserve', () => {
  const dropGrace = rows.filter((row) => row.id !== '2');

  // `Array.prototype.at` is beyond this workspace's `lib` target, so the last
  // call is read by index rather than with `.at(-1)`.
  const lastEvent = (mock: ReturnType<typeof vi.fn>) =>
    mock.mock.calls[mock.mock.calls.length - 1][0];

  it('keeps a selected id that is absent after a data replacement', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    const { rerender } = render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        selection={{ mode: 'multiple', reserve: true }}
        callbacks={{ onSelectionChange }}
      />
    );

    await user.click(screen.getByLabelText('Select all rows'));
    expect([...lastEvent(onSelectionChange).value].sort()).toEqual(['1', '2']);

    rerender(
      <DataGrid
        columns={columns}
        rows={dropGrace}
        getRowId={getRowId}
        selection={{ mode: 'multiple', reserve: true }}
        callbacks={{ onSelectionChange }}
      />
    );

    // No reconcile transition at all — the reserved id is neither pruned nor
    // re-emitted.
    expect([...lastEvent(onSelectionChange).value].sort()).toEqual(['1', '2']);
  });

  it('prunes it by default', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    const { rerender } = render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        selection={{ mode: 'multiple' }}
        callbacks={{ onSelectionChange }}
      />
    );

    await user.click(screen.getByLabelText('Select all rows'));

    rerender(
      <DataGrid
        columns={columns}
        rows={dropGrace}
        getRowId={getRowId}
        selection={{ mode: 'multiple' }}
        callbacks={{ onSelectionChange }}
      />
    );

    const last = lastEvent(onSelectionChange);
    expect([...last.value]).toEqual(['1']);
    expect(last.cause).toBe('data-reconcile');
  });
});

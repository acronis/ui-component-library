import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DataGrid } from '../data-grid';

// OWNERSHIP: **U9**. `selection.selectByRow` only — the rest of the group's parity
// members are in `data-grid-selection.test.tsx`.
//
// The member is delivered by a `selectByRow` boolean on `DataTableViewProps` that
// `data-table-view.tsx`'s `handleRowClick` consumes, plus this group's `viewProps`
// contribution. No contribution point reaches a row-level click handler —
// `rowPresentation` carries presentation and no handlers, and `onRowClick`, the
// only other `viewProps` route, is claimed by `row-interaction.ts`, where a second
// claimant makes `composeViewProps` **throw** rather than lose quietly. That
// collision is reachable from `selectByRow` + `rowInteraction.onClick` together,
// which is a configuration a caller can legitimately want, so contributing
// `onRowClick` here would have shipped a crash rather than a limitation.
//
// The two spine-file interaction properties are asserted at the bottom of this
// file rather than assumed: what the widened `isInteractive` does and does not
// buy the row, and what happens on the activation path.

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

describe('DataGrid selection — selectByRow', () => {
  it('toggles the clicked row, and a click in the actions cell selects nothing', async () => {
    // Both halves live in ONE test deliberately. The negative half — an action
    // control must not select its row — passes trivially in a grid where nothing
    // selects on click at all, which is exactly the state the false "shipped in
    // P0.5" status came from. Pairing it with the positive half in the same
    // render is what makes it able to fail: if `selectByRow` silently stops
    // working the first assertion goes red, and if propagation isolation
    // regresses the later ones do.
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        selection={{ mode: 'multiple', selectByRow: true }}
        actions={{ items: [{ id: 'edit', label: 'Edit' }], onAction }}
      />
    );
    const [ada, grace] = screen.getAllByLabelText('Select row');

    await user.click(screen.getByText('Ada Lovelace'));
    expect(ada).toHaveAttribute('aria-checked', 'true');
    expect(grace).toHaveAttribute('aria-checked', 'false');

    // The assertion this member exists for.
    await user.click(screen.getAllByRole('button', { name: 'Row actions' })[1]);
    expect(grace).toHaveAttribute('aria-checked', 'false');
    expect(ada).toHaveAttribute('aria-checked', 'true');

    // And invoking the action does not select on the way out either.
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(onAction).toHaveBeenCalledWith('edit', rows[1]);
    expect(grace).toHaveAttribute('aria-checked', 'false');

    // A second click on the row toggles back off — it is a toggle, not a set.
    await user.click(screen.getByText('Ada Lovelace'));
    expect(ada).toHaveAttribute('aria-checked', 'false');
  });

  it('keeps the checkbox as the primary control rather than double-toggling it', async () => {
    // The checkbox sits inside the row, so its click reaches the row handler by
    // bubbling unless the cell isolates it — and a checkbox toggle plus a row
    // toggle is a net no-op. That failure looks exactly like "selection is
    // broken" and has nothing to do with the checkbox. The isolation itself is
    // asserted without `selectByRow` in the sibling file; this is the
    // consequence that made it necessary.
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        selection={{ mode: 'multiple', selectByRow: true }}
      />
    );
    const [ada] = screen.getAllByLabelText('Select row');

    await user.click(ada);
    expect(ada).toHaveAttribute('aria-checked', 'true');

    await user.click(ada);
    expect(ada).toHaveAttribute('aria-checked', 'false');
  });

  it('does not select an ineligible row from a click', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        selection={{
          mode: 'multiple',
          selectByRow: true,
          isRowSelectable: (row) => row.name === 'Ada Lovelace',
        }}
      />
    );
    const [ada, grace] = screen.getAllByLabelText('Select row');

    await user.click(screen.getByText('Grace Hopper'));
    expect(grace).toHaveAttribute('aria-checked', 'false');

    // Same render, eligible row: the click path is live, so the assertion above
    // is about eligibility rather than about a dead handler.
    await user.click(screen.getByText('Ada Lovelace'));
    expect(ada).toHaveAttribute('aria-checked', 'true');
  });

  it('composes with a row-click handler instead of replacing it', async () => {
    // `rowInteraction.onClick` and `selectByRow` are independent props a caller
    // may reasonably set together (select on click, and open a panel). Both must
    // run — and this is the configuration that rules out contributing
    // `onRowClick` from the selection module, because the composer throws on the
    // second claimant.
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        selection={{ mode: 'multiple', selectByRow: true }}
        rowInteraction={{ onClick }}
      />
    );
    const [ada] = screen.getAllByLabelText('Select row');

    await user.click(screen.getByText('Ada Lovelace'));
    expect(onClick).toHaveBeenCalledWith(rows[0]);
    expect(ada).toHaveAttribute('aria-checked', 'true');
  });
});

// The two questions a spine-file edit has to answer, asserted rather than reasoned
// about. Both concern what `selectByRow` does to the row BESIDES selecting it.

describe('DataGrid selection — what selectByRow does not change', () => {
  it('gives the row no tab stop and no keyboard binding', async () => {
    // `selectByRow` widens `isInteractive`, which gates exactly two things: the
    // row's `onClick` and `cursor-pointer`. `tabIndex` and `onKeyDown` are gated
    // by `rowNavEnabled` instead, so the row does not silently become a focus
    // target — which matters because the checkbox is meant to stay the accessible
    // primary control, and a focusable row with no role would be the opposite.
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        selection={{ mode: 'multiple', selectByRow: true }}
      />
    );
    const bodyRows = screen.getAllByRole('row').slice(1);
    expect(bodyRows[0]).not.toHaveAttribute('tabindex');

    // And Enter on the row does nothing, because the row has no key handler.
    bodyRows[0].focus();
    await user.keyboard('{Enter}');
    expect(screen.getAllByLabelText('Select row')[0]).toHaveAttribute(
      'aria-checked',
      'false'
    );
  });

  it('leaves selection unchanged across a double-click activation', async () => {
    // A double-click fires click, click, dblclick — so `handleRowClick` runs
    // TWICE before activation. Two toggles net to no change, which is the
    // behaviour a caller who double-clicks to open wants: the row is activated
    // and its selection is where they left it.
    const user = userEvent.setup();
    const onActivate = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        selection={{ mode: 'multiple', selectByRow: true }}
        rowInteraction={{ onActivate }}
      />
    );
    const [ada] = screen.getAllByLabelText('Select row');

    await user.dblClick(screen.getByText('Ada Lovelace'));
    expect(onActivate).toHaveBeenCalledWith(rows[0]);
    expect(ada).toHaveAttribute('aria-checked', 'false');

    // And from a selected start it stays selected, so the invariant is "net
    // zero", not "ends up deselected".
    await user.click(ada);
    expect(ada).toHaveAttribute('aria-checked', 'true');
    await user.dblClick(screen.getByText('Ada Lovelace'));
    expect(ada).toHaveAttribute('aria-checked', 'true');
  });
});

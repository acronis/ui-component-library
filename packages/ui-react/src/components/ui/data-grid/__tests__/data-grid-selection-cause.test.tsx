import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DataGrid } from '../data-grid';

// #69's three call sites, each driven by the control a person actually uses.
//
// The mechanism has its own suite (`data-table/__tests__/data-table-selection-cause.test.tsx`)
// which drives the engine API directly. **That one cannot show any site is wired**
// — it would pass with all three controls left untouched, which is precisely the
// half-fix state this task warned against. So each site is asserted here through
// its own control, and a site left unwrapped fails exactly one of these.

interface Person {
  readonly id: string;
  readonly name: string;
  readonly role: string;
}

const rows: Person[] = [
  { id: '1', name: 'Ada', role: 'Engineer' },
  { id: '2', name: 'Grace', role: 'Engineer' },
];

const columns: ColumnDef<Person, unknown>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
  { id: 'role', accessorKey: 'role', header: 'Role' },
];

/** The cause of the last selection change the grid reported. */
function selectionCauses(calls: { slice: string; cause: string }[]) {
  return calls
    .filter((event) => event.slice === 'selection')
    .map((e) => e.cause);
}

function renderGrid(extra?: Record<string, unknown>) {
  const onStateChange = vi.fn();
  render(
    <DataGrid
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id}
      selection={{ mode: 'multiple' }}
      callbacks={{ onStateChange }}
      {...extra}
    />
  );
  return {
    causes: () =>
      selectionCauses(
        onStateChange.mock.calls.map(
          ([event]) => event as { slice: string; cause: string }
        )
      ),
  };
}

describe('selection cause — the three call sites', () => {
  it('reports pointer for the row checkbox', async () => {
    const user = userEvent.setup();
    const { causes } = renderGrid();

    await user.click(screen.getAllByLabelText('Select row')[0]!);

    expect(causes()).toEqual(['pointer']);
  });

  it('reports pointer for the header select-all', async () => {
    const user = userEvent.setup();
    const { causes } = renderGrid();

    await user.click(screen.getByLabelText('Select all rows'));

    expect(causes()).toEqual(['pointer']);
  });

  it('reports pointer for a selectByRow row click', async () => {
    const user = userEvent.setup();
    const { causes } = renderGrid({
      selection: { mode: 'multiple', selectByRow: true },
    });

    // The row body, not the checkbox — this is the view's own handler, which
    // emitted `'pointer'` for the current row and `'api'` for the selection two
    // lines apart before the fix.
    await user.click(screen.getByText('Ada'));

    expect(causes()).toEqual(['pointer']);
  });
});

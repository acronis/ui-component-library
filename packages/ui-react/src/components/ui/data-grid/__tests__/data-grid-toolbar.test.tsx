import type { ReactNode } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useDataTable } from '../../data-table';
import { DataGridToolbar } from '../data-grid-toolbar';

// DataGrid owns its toolbar row rather than reusing the frozen `DataTableToolbar`
// adapter, because the row carries features that suite may not grow —
// `data-table/index.ts` marks it "do not add new features here" (design §1: the
// library publishes no batteries-included DataTable companion suite; those pieces
// move behind DataGrid and are removed next major).
//
// **The markup-parity assertion that used to live here is gone, and its absence is
// the point.** Worth stating plainly because it was *live* when removed, not already
// dead: PR #33 (PLTFRM-93128) had just repaired its id normalization and un-skipped
// it. It pinned "at the default `viewOptions` the two render the same DOM",
// which stopped being true — and stopped being desirable — with PLTFRM-93130: the
// column-settings menu moved out of this row into the trailing column's header, and
// the row gained a selected state that replaces its contents. There is no longer a
// configuration in which the two are equivalent, so a parity test would only pin
// coincidence. What is worth pinning instead is below: the focus hook, and the
// constant-height swap that the ticket was about.

interface Person {
  id: string;
  name: string;
}

const columns: ColumnDef<Person, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
];
const rows: Person[] = [{ id: '1', name: 'Ada' }];

function Harness({
  globalSearch = true,
  bulk,
  leading,
  trailing,
}: {
  globalSearch?: boolean;
  bulk?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
}) {
  const controller = useDataTable<Person>({
    columns,
    data: rows,
    getRowId: (row) => row.id,
    sorting: true,
    filtering: true,
  });
  return (
    <DataGridToolbar
      table={controller.table}
      globalSearch={globalSearch}
      {...(bulk === undefined ? {} : { bulk })}
      {...(leading === undefined ? {} : { leading })}
      {...(trailing === undefined ? {} : { trailing })}
    />
  );
}

const ROW = '[data-slot="data-grid-toolbar"]';

describe('DataGridToolbar', () => {
  it('carries the focus-fallback hook, on the row element itself', () => {
    // Design §7 clause 3's rung 3 finds this row by query, so losing the attribute
    // would silently drop the toolbar out of the chain — the fallback would fall
    // straight through to the scroll container and no assertion about markup could
    // tell. On the row itself, not an inner wrapper: rung 3 queries for focusable
    // controls INSIDE this element, so a hook one level off would find none.
    const grid = render(<Harness />);
    const row = grid.container.querySelector(ROW);
    expect(row).not.toBeNull();
    expect(row).toBe(grid.container.firstElementChild);
  });

  it('has no focusable control when every member is off, and that is a valid rung-3 miss', () => {
    // It used to be impossible to render this row empty: the column-settings menu
    // defaulted on and always left a button behind. With the gear in a column header
    // (PLTFRM-93130) an empty row is reachable — `toolbar={{ bulkActions }}` with
    // nothing selected renders exactly this — and rung 3 documents `null` as a MISS
    // that must fall through to rung 4 rather than a landing. Focusing the row div
    // instead would announce nothing, which is why it deliberately has no
    // `tabIndex`.
    const bare = render(<Harness globalSearch={false} />);
    const row = bare.container.querySelector(ROW)!;
    expect(row.querySelector('button:not([disabled])')).toBeNull();
    expect(row).not.toHaveAttribute('tabindex');
  });

  it('renders leading and trailing members around the search box', () => {
    render(
      <Harness
        leading={<span>123 loaded</span>}
        trailing={<button type="button">Add node</button>}
      />
    );
    expect(screen.getByText('123 loaded')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Add node' })).toBeVisible();
    expect(screen.getByPlaceholderText('Filter…')).toBeVisible();
  });

  it('replaces every idle member with the bulk strip, in the same row element', () => {
    // The whole point of the ticket: same node, so the table below it cannot move.
    const idle = render(
      <Harness
        leading={<span>123 loaded</span>}
        trailing={<span>+ Add</span>}
      />
    );
    const rowBefore = idle.container.querySelector(ROW);
    expect(screen.getByPlaceholderText('Filter…')).toBeVisible();

    idle.rerender(
      <Harness
        leading={<span>123 loaded</span>}
        trailing={<span>+ Add</span>}
        bulk={<span>4 items selected</span>}
      />
    );

    expect(idle.container.querySelector(ROW)).toBe(rowBefore);
    expect(screen.getByText('4 items selected')).toBeVisible();
    expect(screen.queryByPlaceholderText('Filter…')).not.toBeInTheDocument();
    expect(screen.queryByText('123 loaded')).not.toBeInTheDocument();
    expect(screen.queryByText('+ Add')).not.toBeInTheDocument();
  });

  it('keeps a constant minimum height across both states', () => {
    // happy-dom has no layout engine, so height is asserted as the class contract
    // rather than measured: both states share one container, and `min-h-10` is what
    // holds the row open when a state is empty — and what stops the row SHRINKING
    // from a 40px filter trigger to a 32px button when the bulk strip takes over,
    // which is a jump this suite cannot see and a browser can.
    const idle = render(<Harness globalSearch={false} />);
    const row = idle.container.querySelector(ROW)!;
    expect(row.className).toContain('min-h-10');

    idle.rerender(
      <Harness globalSearch={false} bulk={<span>1 item selected</span>} />
    );
    expect(idle.container.querySelector(ROW)!.className).toContain('min-h-10');
  });
});

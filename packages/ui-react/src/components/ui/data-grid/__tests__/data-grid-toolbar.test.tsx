import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DataTableToolbar, useDataTable } from '../../data-table';
import { DataGridToolbar } from '../data-grid-toolbar';

// DataGrid owns its toolbar row rather than reusing the frozen `DataTableToolbar`
// adapter, because `toolbar.viewOptions` is a new feature and
// `data-table/index.ts` marks that whole companion suite "do not add new features
// here" (design §1: the library publishes no batteries-included DataTable
// companion suite; those pieces move behind DataGrid and are removed next major).
//
// The cost of that choice is divergence, so this pins the absence of it *in
// markup*: at the default `viewOptions` the two render the same DOM, which is what
// keeps the visual-regression baselines for every unchanged DataGrid story safe.
//
// They now diverge deliberately in **behavior**: U7 rewired DataGrid's search box
// to the engine's global filter, because `filters.global.columnIds` ORs a query
// across several columns and the frozen adapter drives a single column's filter.
// The markup is unchanged, so the assertion below still holds.

interface Person {
  id: string;
  name: string;
}

const columns: ColumnDef<Person, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
];
const rows: Person[] = [{ id: '1', name: 'Ada' }];

function Harness({
  which,
  viewOptions,
  globalSearch = true,
}: {
  which: 'grid' | 'table';
  viewOptions?: boolean;
  globalSearch?: boolean;
}) {
  const controller = useDataTable<Person>({
    columns,
    data: rows,
    getRowId: (row) => row.id,
    sorting: true,
    filtering: true,
  });
  return which === 'grid' ? (
    <DataGridToolbar
      table={controller.table}
      globalSearch={globalSearch}
      viewOptions={viewOptions}
    />
  ) : (
    <DataTableToolbar table={controller.table} searchKey="name" />
  );
}

/** React and Base UI mint per-render ids; everything else must match exactly. */
function withoutGeneratedIds(html: string): string {
  return html
    .replace(/id="[^"]*_r_[^"]*"/g, 'id="[generated]"')
    .replace(/aria-controls="[^"]*"/g, 'aria-controls="[generated]"');
}

/**
 * The ONE attribute the two are now allowed to differ by, normalized away so the
 * equality above keeps its value over everything else.
 *
 * `data-slot="data-grid-toolbar"` is design §7 clause 3 rung 3's query hook — the
 * focus fallback resolves the toolbar from the table's own root, with no prop and
 * no ref chain (U6.md §3). The frozen `DataTableToolbar` deliberately does not get
 * it: adding one would be a new feature in the suite `data-table/index.ts` freezes.
 *
 * Stripped rather than ignored, and the presence of it is asserted separately —
 * a normalizer that quietly tolerated the attribute's ABSENCE would let the rung
 * lose its hook without a single test noticing.
 */
function withoutFocusHook(html: string): string {
  return html.replace(' data-slot="data-grid-toolbar"', '');
}

describe('DataGridToolbar', () => {
  // Still true after U3 replaced the column control with
  // `DataGridColumnSettings`, and worth saying why rather than leaving a reader to
  // wonder: the menu is closed at rest, so only the trigger is in the DOM and the
  // trigger is byte-identical. The divergence — a pinning section and a reset —
  // lives inside the content, which `data-grid-column-settings.test.tsx` covers.
  // So this keeps its original value: guarding the parts that should still match.
  it('renders the same markup as the frozen DataTableToolbar it replaced', () => {
    const grid = render(<Harness which="grid" />);
    const gridHtml = withoutGeneratedIds(grid.container.innerHTML);
    grid.unmount();

    const table = render(<Harness which="table" />);
    const tableHtml = withoutGeneratedIds(table.container.innerHTML);

    // Exactly one allowed divergence, and it is verified to BE the only one: strip
    // the focus hook from the grid's markup and the two are byte-identical again.
    expect(withoutFocusHook(gridHtml)).toBe(tableHtml);
  });

  it('carries the focus-fallback hook that the frozen adapter does not', () => {
    // The positive half of the exception above. Design §7 clause 3's rung 3 finds
    // this row by query, so losing the attribute would silently drop the toolbar out
    // of the chain — the fallback would fall straight through to the scroll
    // container and no assertion about markup equality could tell.
    const grid = render(<Harness which="grid" />);
    const row = grid.container.querySelector('[data-slot="data-grid-toolbar"]');
    expect(row).not.toBeNull();
    // On the row itself, not on some inner wrapper: rung 3 queries for focusable
    // controls INSIDE this element, so a hook one level off would find none.
    expect(row).toBe(grid.container.firstElementChild);
    // And there is something for the rung to land on in the default `viewOptions`
    // configuration — `globalSearch` being false does not empty the row.
    grid.unmount();

    const bare = render(<Harness which="grid" globalSearch={false} />);
    expect(
      bare.container
        .querySelector('[data-slot="data-grid-toolbar"]')!
        .querySelector('button:not([disabled])')
    ).not.toBeNull();
  });

  it('drops only the view-options menu when `viewOptions` is false', () => {
    render(<Harness which="grid" viewOptions={false} />);
    expect(screen.queryByRole('button', { name: 'View' })).toBeNull();
    // The search box is untouched.
    expect(screen.getByPlaceholderText('Filter…')).toBeVisible();
  });
});

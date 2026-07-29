import type { ColumnDef } from '@tanstack/react-table';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  createDataTableQuery,
  createDefaultDataTableState,
} from '../../data-table';
import { DataGrid } from '../data-grid';
import { DATA_GRID_CHROME_COLUMN_WIDTH } from '../data-grid-config/chrome-column';

// #91, user-reported: "why are columns with selection checkboxes so wide
// everywhere? can we keep them tight or even square as row height?"
//
// **The whole point of this file is that every case runs TWICE — with and without
// `columnsFeatures`.** The widths only reached the DOM through the columnsFeatures
// presentation path, so a fix verified in one configuration would have been inert
// in the other, and a single-configuration suite would have been green either way.
// Measured before the fix, in a real browser at 1280px:
//
//   plain grid            `__select__`  92.6px   `__detail__` 143.5px
//   columnsFeatures on    `__select__` 209.2px   `__actions__` 209.2px
//
// ...for controls measuring 16–24px. Both are now 40.
//
// **These are style assertions, and deliberately not dressed up as layout ones.**
// happy-dom has no layout engine, so `getBoundingClientRect()` is 0 here and
// "renders at 40px" is not checkable in this environment. What *is* checkable — and
// what was actually broken — is whether the constraint reaches the element at all.
// The rendered geometry was verified separately in Chromium and is recorded in
// `.ai/team/table-parity-p1/integration/F3-baseline-predictions.md` (F17-P0).

interface Person {
  readonly id: string;
  readonly name: string;
  readonly team: string;
}

const columns: ColumnDef<Person, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'team', header: 'Team' },
];

const rows: Person[] = [
  { id: 'p-0', name: 'Ada', team: 'Engine' },
  { id: 'p-1', name: 'Grace', team: 'Compiler' },
];

const getRowId = (row: Person) => row.id;
const W = `${DATA_GRID_CHROME_COLUMN_WIDTH}px`;

/** Header cells, in visual order. */
const headers = () => [...document.querySelectorAll<HTMLElement>('thead th')];
/** The first body row's cells, in visual order. */
const firstRowCells = () => [
  ...document.querySelectorAll<HTMLElement>('tbody tr:first-child td'),
];

/**
 * Pinned three ways, not just `size`.
 *
 * `size` alone is a *preference* under `table-layout: auto` — the browser
 * distributes surplus width over it. Measured: the selection column carried
 * `min-width: 150px` and still rendered 209.2px, because a floor does not stop
 * distribution. `max-width` is the member that makes the column measure 40.
 */
const expectPinnedTo40 = (cell: HTMLElement) => {
  expect(cell.style.width).toBe(W);
  expect(cell.style.minWidth).toBe(W);
  expect(cell.style.maxWidth).toBe(W);
};

/** Both halves of the column: a table column has one width for `th` and `td`. */
const expectColumnPinned = (index: number) => {
  expectPinnedTo40(headers()[index]);
  expectPinnedTo40(firstRowCells()[index]);
};

describe.each([
  ['without columnsFeatures', {} as const],
  ['with columnsFeatures', { columnsFeatures: { resizing: true } } as const],
])('DataGrid chrome column widths — %s', (_label, extra) => {
  it('pins the generated selection column', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        selection={{ mode: 'multiple' }}
        {...extra}
      />
    );
    expectColumnPinned(0);
  });

  it('pins the generated detail expander column', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        detailExpansion={{ render: () => <div>detail</div> }}
        {...extra}
      />
    );
    expectColumnPinned(0);
  });

  it('pins the generated actions column', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        actions={{
          items: [{ id: 'restart', label: 'Restart' }],
          onAction: () => undefined,
        }}
        {...extra}
      />
    );
    // Trailing by default (`placement: 'end'`).
    expectColumnPinned(headers().length - 1);
  });

  it('pins all three at once and leaves the data columns unconstrained', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        selection={{ mode: 'multiple' }}
        detailExpansion={{ render: () => <div>detail</div> }}
        actions={{
          items: [{ id: 'restart', label: 'Restart' }],
          onAction: () => undefined,
        }}
        {...extra}
      />
    );
    // `[__select__, __detail__, …data, __actions__]` — the order
    // `detail-expansion.tsx:116` documents.
    const cells = headers();
    expect(cells).toHaveLength(5);
    expectColumnPinned(0);
    expectColumnPinned(1);
    expectColumnPinned(4);

    // **The data columns must NOT be pinned to 40.** Without this, a fix that
    // pinned every column would pass every assertion above.
    for (const index of [2, 3]) {
      expect(headers()[index].style.maxWidth).not.toBe(W);
      expect(headers()[index].style.width).not.toBe(W);
    }
  });
});

describe('DataGrid chrome column widths — the unsized-column contract', () => {
  it('leaves an unsized data column free of a width in a plain grid', () => {
    // The blast-radius guard on #91's mechanism. The fix publishes a *declared*
    // size without `columnsFeatures`; it must not start publishing TanStack's
    // 150px default for columns nobody sized, which would re-flow every grid in
    // the kit.
    render(<DataGrid columns={columns} rows={rows} getRowId={getRowId} />);
    for (const cell of headers()) {
      expect(cell.getAttribute('style')).toBeNull();
    }
  });

  it('publishes a CALLER size in a plain grid, which it did not before', () => {
    // The second defect the split fixes, and it is a behaviour change: `size: 200`
    // on a plain `<DataGrid>` previously reached nothing at all, because the whole
    // presentation was gated on `columnsFeatures` being enabled.
    render(
      <DataGrid
        columns={[
          { accessorKey: 'name', header: 'Name', size: 200 },
          columns[1]!,
        ]}
        rows={rows}
        getRowId={getRowId}
      />
    );
    expect(headers()[0].style.width).toBe('200px');
    expect(headers()[0].style.minWidth).toBe('200px');
    // No `maxWidth`: the caller set `size`, not `maxSize`. The resolved def's
    // `maxSize` default is `Number.MAX_SAFE_INTEGER`, which is how this file's
    // subject once emitted `max-width: 9007199254740991px`.
    expect(headers()[0].style.maxWidth).toBe('');
    // The unsized sibling stays unconstrained.
    expect(headers()[1].getAttribute('style')).toBeNull();
  });

  // ── The `server` configuration (#91, reopened) ──────────────────────────────
  // This file runs every case above with and without `columnsFeatures`, because
  // that asymmetry once hid the whole fix. It had **no `server={{…}}` case**, and
  // that gap is what let "the sizing does not reach the server-selection path"
  // stand as a live hypothesis for an hour. It does reach it; the constraint is
  // published identically. This pins that so the question cannot reopen.
  //
  // ⚠ **THIS ASSERTS THE PUBLISHED CONSTRAINT, NOT THE RENDERED WIDTH, AND THE
  // TWO ARE KNOWN TO DIFFER HERE.** In the three `components-datagrid-server-
  // selection--*` baselines the select column carries exactly these three
  // properties and still renders ≈200px: measured checkbox at x=33–48 with the
  // first data ink at x=233, on images a full run re-rendered and matched. Under
  // `table-layout: auto` on a `w-full` table, surplus distribution can override a
  // cell `max-width`, and where that threshold sits is unresolved (#91).
  //
  // So a green result here means **the constraint reached the element** — nothing
  // more. Do not read it as proof the column measures 40px in a browser; that is
  // the claim this test cannot make, and reading it that way is how the DOM and
  // the picture came apart in the first place.
  it('publishes the pinned constraint on the server-controlled selection path', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        selection={{ mode: 'multiple' }}
        server={{
          query: createDataTableQuery(
            createDefaultDataTableState({
              pagination: { pageIndex: 0, pageSize: 10 },
            })
          ),
          rowCount: rows.length,
          selection: { mode: 'explicit', ids: new Set([rows[0]!.id]) },
          onSelectionChange: () => undefined,
          onQueryChange: () => undefined,
        }}
      />
    );
    // Identical to the plain-`selection` case, `th` and `td` both — which is the
    // point: the `server` branches change the header and cell renderers and
    // nothing about sizing.
    expectColumnPinned(0);
  });

  it('does not resize a chrome column, so a drag cannot be persisted', () => {
    // `enableResizing: false` is not only "there is nothing to reveal": a resize
    // writes a `columnSizing` entry that `persistence` stores and restores, so one
    // stray drag on a 40px gutter would become durable state.
    const { container } = render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        selection={{ mode: 'multiple' }}
        columnsFeatures={{ resizing: true }}
      />
    );
    const resizeHandles = container.querySelectorAll('[role="separator"]');
    // Every resizable column offers one; the chrome column must not.
    expect(headers()[0].querySelector('[role="separator"]')).toBeNull();
    expect(resizeHandles.length).toBeGreaterThan(0);
  });
});

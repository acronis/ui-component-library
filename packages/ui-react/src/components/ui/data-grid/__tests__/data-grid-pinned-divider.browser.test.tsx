import type { ColumnDef } from '@tanstack/react-table';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DataGrid } from '../data-grid';

// The measured half of the pinned-column divider (PLTFRM-93276): does `Table` decide
// correctly whether columns are hidden past each pinned edge?
//
// ── WHY THIS CANNOT LIVE IN THE HAPPY-DOM SUITE ──────────────────────────────
// The decision is arithmetic over `scrollLeft`, `scrollWidth` and `clientWidth`.
// happy-dom performs no layout, so all three are 0: the table never reports itself
// scrollable and the attributes never flip. A test there would pass against logic
// that never runs.
//
// ── WHAT THIS FILE DELIBERATELY DOES NOT ASSERT ─────────────────────────────
// The paint. The browser project loads no stylesheet — every other browser test
// asserts events rather than pixels — and importing `.storybook/preview.css` here
// breaks module loading for the file. So the layering is:
//
//   • `data-table-pinned-divider.test.tsx` (happy-dom) — which cell is the boundary.
//   • this file — whether each edge reports columns hidden beneath it.
//   • the `pinned-column-divider` / `pinned-and-sticky` baselines — the pixels,
//     including the corner cell that carries the header line and the divider at once.
//
// Each layer asserts what its environment can actually see. The one thing no layer
// would catch alone is the attribute being renamed without the CSS following, which
// is why the baselines are part of the same PR.

type Server = {
  id: string;
  host: string;
  a: string;
  b: string;
  c: string;
  d: string;
};

const rows: Server[] = [
  { id: '1', host: 'db-primary-01', a: 'a1', b: 'b1', c: 'c1', d: 'd1' },
  { id: '2', host: 'db-replica-01', a: 'a2', b: 'b2', c: 'c2', d: 'd2' },
];

const columns: ColumnDef<Server>[] = [
  { accessorKey: 'host', header: 'Host', size: 200 },
  { accessorKey: 'a', header: 'A', size: 180 },
  { accessorKey: 'b', header: 'B', size: 180 },
  { accessorKey: 'c', header: 'C', size: 180 },
  { accessorKey: 'd', header: 'D', size: 180 },
];

/** The element that actually overflows — `ScrollArea`'s viewport. */
function scrollerOf(container: HTMLElement): HTMLElement {
  const scroller = [...container.querySelectorAll('div')].find(
    (element) => element.scrollWidth > element.clientWidth + 1
  );
  expect(scroller, 'the fixture must overflow horizontally').toBeDefined();
  return scroller as HTMLElement;
}

const settle = () =>
  new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  );

const state = (scroller: HTMLElement) => ({
  start: scroller.dataset.overflowStart,
  end: scroller.dataset.overflowEnd,
});

function renderGrid() {
  return render(
    <div style={{ width: 520 }}>
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row: Server) => row.id}
        columnsFeatures={{ pinning: true }}
        defaultState={{ columnPinning: { left: ['host'], right: ['d'] } }}
      />
    </div>
  );
}

// ── SKIPPED: THE FEATURE IS NOT IN THIS REPO ────────────────────────────────
// This suite came over with the ui-blocks DataGrid sync and asserts
// `data-overflow-start` / `data-overflow-end` on `ScrollArea`'s viewport. Those
// attributes exist **nowhere** in `packages/ui-react` — the measured half of
// PLTFRM-93276 was never ported, only the tests for it were. So all five cases
// read `undefined` and fail against code that does not exist rather than against
// code that is wrong.
//
// Kept rather than deleted: it is a ready-made spec for the port. Unskip it in
// the same change that makes `Table` measure `scrollLeft` / `scrollWidth` /
// `clientWidth` and emit the two attributes — it should go green with no edits.
// Do not "fix" it by relaxing the assertions.
describe.skip('pinned column divider — measured scroll state', () => {
  it('reports the end edge covered and the start edge clear at rest', async () => {
    const { container } = renderGrid();
    await settle();

    // Both asserted together: a rule that never matched, or one that always did,
    // fails one half of this.
    expect(state(scrollerOf(container))).toEqual({
      start: 'false',
      end: 'true',
    });

    // And the boundary cells exist to hang the divider on, in both regions.
    expect(
      container.querySelector('th[data-pinned-edge="start"]')
    ).not.toBeNull();
    expect(
      container.querySelector('th[data-pinned-edge="end"]')
    ).not.toBeNull();
  });

  it('reports the start edge covered once columns scroll under it', async () => {
    const { container } = renderGrid();
    const scroller = scrollerOf(container);

    scroller.scrollLeft = 160;
    await settle();

    expect(state(scroller)).toEqual({ start: 'true', end: 'true' });
  });

  it('clears the end edge at the far end, where nothing is under it', async () => {
    const { container } = renderGrid();
    const scroller = scrollerOf(container);

    scroller.scrollLeft = scroller.scrollWidth;
    await settle();

    expect(state(scroller)).toEqual({ start: 'true', end: 'false' });
  });

  it('holds the 1px tolerance, so subpixel rounding draws nothing', async () => {
    // The reason the test is `> 1` rather than `> 0`: at fractional zoom a browser
    // reports `scrollLeft` values like 0.5 on a table nobody has scrolled, and a
    // divider appearing at rest is the defect this fix would have introduced.
    const { container } = renderGrid();
    const scroller = scrollerOf(container);

    scroller.scrollLeft = 1;
    await settle();

    expect(state(scroller).start).toBe('false');

    scroller.scrollLeft = 2;
    await settle();

    expect(state(scroller).start).toBe('true');
  });

  it('re-measures when a column is resized, with no scrolling involved', async () => {
    // `scrollWidth` changes with no scroll event, which is why a `ResizeObserver`
    // backs the listener. Narrowing every column until the table fits must clear
    // both edges.
    const { container } = renderGrid();
    const scroller = scrollerOf(container);
    const table = container.querySelector('table')!;

    table.style.width = '200px';
    for (const cell of table.querySelectorAll<HTMLElement>('th, td')) {
      cell.style.width = '40px';
      cell.style.minWidth = '40px';
      cell.style.maxWidth = '40px';
    }
    await settle();
    await settle();

    expect(state(scroller)).toEqual({ start: 'false', end: 'false' });
  });
});

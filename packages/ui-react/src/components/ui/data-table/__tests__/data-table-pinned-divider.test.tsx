// The pinned-region boundary flag (PLTFRM-93276).
//
// A pinned column's inner edge is where scrolled columns disappear underneath, and
// it is the only edge that needs a divider. `data-pinned-edge` marks it. These tests
// assert the *flag*, not the pixels: which cell carries it, under visibility
// changes, and in a region of one — the divider's own rendering is a CSS rule keyed
// off it, covered by the browser test and the baselines.

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DataGrid } from '../../data-grid';

type Row = { id: string; a: string; b: string; c: string; d: string };

const rows: Row[] = [
  { id: '1', a: 'a1', b: 'b1', c: 'c1', d: 'd1' },
  { id: '2', a: 'a2', b: 'b2', c: 'c2', d: 'd2' },
];

const columns = [
  { accessorKey: 'a', header: 'A' },
  { accessorKey: 'b', header: 'B' },
  { accessorKey: 'c', header: 'C' },
  { accessorKey: 'd', header: 'D' },
];

function grid(
  pinning: { left?: string[]; right?: string[] },
  extra: Record<string, unknown> = {}
) {
  return render(
    <DataGrid
      columns={columns}
      rows={rows}
      getRowId={(row: Row) => row.id}
      columnsFeatures={{ pinning: true }}
      defaultState={{ columnPinning: { left: [], right: [], ...pinning } }}
      {...extra}
    />
  );
}

/** Header cells carrying the boundary flag, as `[edge, label]`. */
const edges = (container: HTMLElement) =>
  [...container.querySelectorAll('th[data-pinned-edge]')].map((cell) => [
    cell.getAttribute('data-pinned-edge'),
    (cell.textContent ?? '').trim(),
  ]);

describe('pinned region boundary', () => {
  it('marks the last column of the start region', () => {
    const { container } = grid({ left: ['a', 'b'] });

    // `b` is nearest the scrollable middle, so it owns the boundary; `a` is pinned
    // but interior, and a divider there would just double the cell border.
    expect(edges(container)).toEqual([['start', 'B']]);
  });

  it('marks the first column of the end region', () => {
    const { container } = grid({ right: ['c', 'd'] });

    expect(edges(container)).toEqual([['end', 'C']]);
  });

  it('marks both boundaries when both regions are pinned', () => {
    const { container } = grid({ left: ['a'], right: ['d'] });

    expect(edges(container)).toEqual([
      ['start', 'A'],
      ['end', 'D'],
    ]);
  });

  it('marks a single-column region, which is both first and last', () => {
    const { container } = grid({ left: ['a'] });

    expect(edges(container)).toEqual([['start', 'A']]);
  });

  it('skips a hidden column so the boundary lands on one that renders', () => {
    // `b` is the last start-pinned column but hidden, so the flag has to fall back
    // to `a`. Marking `b` would attach the divider to an element that renders
    // nothing and the line would silently disappear.
    const { container } = grid(
      { left: ['a', 'b'] },
      {
        defaultState: {
          columnPinning: { left: ['a', 'b'], right: [] },
          columnVisibility: { b: false },
        },
      }
    );

    expect(edges(container)).toEqual([['start', 'A']]);
  });

  it('marks nothing when no column is pinned', () => {
    const { container } = grid({});

    expect(edges(container)).toEqual([]);
    // And the body cells agree — the flag is per column, not per section.
    expect(container.querySelectorAll('td[data-pinned-edge]')).toHaveLength(0);
  });

  it('marks body cells as well as the header', () => {
    // The divider runs the whole column, so every cell in it needs the flag; a
    // header-only flag would draw a 40px line above a column of unbounded rows.
    const { container } = grid({ left: ['a'] });

    expect(
      container.querySelectorAll('td[data-pinned-edge="start"]')
    ).toHaveLength(rows.length);
  });

  // ── The divider MODE, as far as happy-dom can see it ──────────────────────
  //
  // These two assert class strings, which is normally a smell. The justification is
  // the layering: `'auto'` and `'always'` differ only in whether the CSS rule is
  // gated on the viewport's overflow attributes, and happy-dom performs no layout,
  // so the attributes never flip and the two modes are indistinguishable by
  // rendering here. What is worth pinning at this level is that the config reaches
  // `Table` at all — `columnsFeatures.pinnedDivider` travels through `viewProps`,
  // and that route silently dropping a key is exactly the defect that cost this
  // change an afternoon (`composeColumnPresentation`'s whitelist).
  //
  // The behaviour itself is covered where it is visible: measured state in
  // `data-grid-pinned-divider.browser.test.tsx`, pixels in the baselines.
  it('gates the divider on scroll state by default', () => {
    const { container } = grid({ left: ['a'] });
    const table = container.querySelector('table')!;

    expect(table.className).toContain('data-overflow-start');
  });

  it('drops the gate when the caller asks for `always`', () => {
    const { container } = render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row: Row) => row.id}
        columnsFeatures={{ pinning: true, pinnedDivider: 'always' }}
        defaultState={{ columnPinning: { left: ['a'], right: [] } }}
      />
    );
    const table = container.querySelector('table')!;

    expect(table.className).not.toContain('data-overflow-start');
    expect(table.className).toContain('data-pinned-edge');
  });
});

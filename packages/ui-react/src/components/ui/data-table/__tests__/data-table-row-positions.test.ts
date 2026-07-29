import { describe, expect, it } from 'vitest';

import { dataTableRowPositions } from '../data-table-row-positions';

// #77's arithmetic, pure. The rendered half — that the attributes actually reach the
// `<table>` and each `<tr>` — is in `data-table-body-window.test.tsx`, which owns the
// only harness that can reach a windowed state in happy-dom.
//
// ⚠ **NEITHER FILE ESTABLISHES THAT A SCREEN READER ANNOUNCES THE RIGHT THING.**
// Together they establish that the values ARIA specifies are emitted, with the values
// ARIA specifies. Whether an assistive technology honours `aria-rowcount` /
// `aria-rowindex` over its own count of the accessibility tree is #63's owed pass and
// nothing here settles it.

describe('dataTableRowPositions', () => {
  it('counts the header rows into the total', () => {
    // `aria-rowindex` numbers the header row 1, so a count that excluded it would be
    // smaller than the largest index it is supposed to bound.
    const positions = dataTableRowPositions({
      headerRowCount: 1,
      totalDisplayRows: 4821,
      windowStart: 0,
    });

    expect(positions.rowCount).toBe(4822);
  });

  it('numbers the header rows from 1', () => {
    const positions = dataTableRowPositions({
      headerRowCount: 2,
      totalDisplayRows: 10,
      windowStart: 0,
    });

    expect(positions.headerRowIndex(0)).toBe(1);
    expect(positions.headerRowIndex(1)).toBe(2);
  });

  it('offsets a windowed row by the header AND the window start', () => {
    // The case #77 describes: a window opening at display row 1,846 with one header
    // row. Its first rendered row is the 1,848th row of the table.
    const positions = dataTableRowPositions({
      headerRowCount: 1,
      totalDisplayRows: 4821,
      windowStart: 1846,
    });

    expect(positions.windowedRowIndex(0)).toBe(1848);
    expect(positions.windowedRowIndex(1)).toBe(1849);
  });

  it('follows the header count rather than assuming one header row', () => {
    // ⚠ THE OFF-BY-ONE THIS FUNCTION EXISTS FOR. A `+ 1` at the render site is right
    // on every ungrouped table and wrong the moment anyone groups columns — and wrong
    // the other way when the header is hidden. Both directions asserted, because a
    // test of only the grouped case would pass against a hardcoded 2.
    const grouped = dataTableRowPositions({
      headerRowCount: 2,
      totalDisplayRows: 10,
      windowStart: 0,
    });
    const headerless = dataTableRowPositions({
      headerRowCount: 0,
      totalDisplayRows: 10,
      windowStart: 0,
    });

    expect(grouped.windowedRowIndex(0)).toBe(3);
    expect(headerless.windowedRowIndex(0)).toBe(1);
    expect(grouped.rowCount).toBe(12);
    expect(headerless.rowCount).toBe(10);
  });

  it('keeps the last row index equal to the count, in every configuration', () => {
    // THE INVARIANT THAT TIES THE TWO NUMBERS TOGETHER. `aria-rowindex` must never
    // exceed `aria-rowcount`, and the last row's index must reach it exactly —
    // otherwise a screen reader announces "row 4822 of 4821", or stops short and
    // implies rows that do not exist. Asserted across header counts and window
    // offsets so the two members cannot drift apart independently.
    for (const headerRowCount of [0, 1, 2, 3]) {
      for (const totalDisplayRows of [1, 10, 4821]) {
        for (const windowStart of [0, 1, totalDisplayRows - 1]) {
          const positions = dataTableRowPositions({
            headerRowCount,
            totalDisplayRows,
            windowStart,
          });
          const lastWindowRow = totalDisplayRows - 1 - windowStart;

          expect(positions.windowedRowIndex(lastWindowRow)).toBe(
            positions.rowCount
          );
        }
      }
    }
  });
});

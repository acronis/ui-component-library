/**
 * `aria-rowcount` / `aria-rowindex` for a table whose DOM holds only a window of
 * its rows (#77).
 *
 * ── THE DEFECT THIS EXISTS FOR ───────────────────────────────────────────────
 * A virtualized table renders a slice of real rows between two `aria-hidden`
 * spacers. Assistive technology counts what is in the accessibility tree, so
 * without these attributes it announces "row 3 of 20" where the truth is row 1,847
 * of 4,821. That is not an imprecise number; it is a different quantity.
 *
 * ── WHY IT IS A MODULE AND NOT THREE ADDITIONS AT THE RENDER SITE ────────────
 * The arithmetic is small and the ARIA contract around it is not, and **two of the
 * three terms are the kind that get silently mis-stated**:
 *
 *  - the index is **1-based**, and the **header row is row 1** — so a body row's
 *    index is offset by the header, not by nothing;
 *  - ⚠ **the header offset is NOT the constant 1.** The view renders one row per
 *    `table.getHeaderGroups()` entry, so a table with *column groups* has several
 *    header rows, and `showHeader: false` has none. A `+ 1` written at the render
 *    site is correct on every ungrouped table and wrong the moment anyone groups
 *    columns — passing tests forever while announcing the wrong row.
 *
 * Naming the terms and testing them is also what shrinks the part of this feature
 * that CI cannot reach: everything below is ordinary arithmetic with ordinary
 * tests, and the only thing left outside is whether an assistive technology honours
 * the attributes — which is #63's owed pass and not something any test here settles.
 *
 * ── WHAT COUNTS AS A ROW: DISPLAY ROWS, NOT RECORDS ──────────────────────────
 * The rows a person navigates are the **display** rows — records plus group
 * headers, detail rows, footer rows and status rows. So `totalDisplayRows` is
 * `displayRows.length`, which is also exactly what the virtualizer counts, and the
 * indices below are positions in that same list. Two consequences worth stating,
 * because both are places a plausible alternative is wrong:
 *
 *  - **`table.getRowCount()` is NOT the total.** It counts records, so a grouped or
 *    expanded table renders *more* rows than it reports; and it is pre-pagination,
 *    while the rendered model is post-pagination.
 *  - **The count describes the TABLE, not the dataset.** MDN: "the number of rows in
 *    the full table". Every configuration in this kit puts all of a table's rows in
 *    `displayRows` — pagination and server mode included, because both slice
 *    *before* display rows are derived. A consumer that instead appends rows
 *    incrementally (infinite scroll) gets a count of what is loaded; mixing
 *    `options.rowCount` in to cover that would add a *record* count to a
 *    *display-row* count, which is the category error above.
 *
 * ── AND WHERE IT MUST NOT BE APPLIED ─────────────────────────────────────────
 * MDN, on `aria-rowcount`: "If all of the rows are loaded and in the DOM, you don't
 * need to include `aria-rowcount` as browsers automatically count the total number
 * of rows." So the caller applies this **only while windowing**, and that is a
 * correctness rule rather than an optimisation: on a fully rendered table the
 * browser's own count is already right, and publishing an explicit one can only
 * replace a correct implicit number with a chance to be wrong.
 */

/** The three numbers a windowed table needs, from the two it has. */
export interface DataTableRowPositionsInput {
  /**
   * Rendered header rows — `table.getHeaderGroups().length`, or `0` when the header
   * is hidden. Not a constant; see the note above.
   */
  readonly headerRowCount: number;
  /** `displayRows.length` — every display row, not only the windowed ones. */
  readonly totalDisplayRows: number;
  /** The absolute display index of the window's first row. */
  readonly windowStart: number;
}

export interface DataTableRowPositions {
  /**
   * `aria-rowcount` for the table element. Includes the header rows, because
   * `aria-rowindex` counts them — a count that excluded them would be smaller than
   * the largest index it is supposed to bound.
   */
  readonly rowCount: number;
  /** `aria-rowindex` for the nth rendered header row, `n` 0-based. */
  headerRowIndex(headerRow: number): number;
  /**
   * `aria-rowindex` for a row the view is rendering, from its index **within the
   * window** — which is the only index the view has, since `bodyWindow.rows` is
   * already sliced.
   */
  windowedRowIndex(windowRow: number): number;
}

export function dataTableRowPositions(
  input: DataTableRowPositionsInput
): DataTableRowPositions {
  const { headerRowCount, totalDisplayRows, windowStart } = input;

  return {
    rowCount: headerRowCount + totalDisplayRows,
    // 1-based: the first header row is row 1.
    headerRowIndex: (headerRow) => headerRow + 1,
    // The header rows come first, then the display rows from the window's offset.
    // `+ 1` last, once, for the 1-based conversion.
    windowedRowIndex: (windowRow) =>
      headerRowCount + windowStart + windowRow + 1,
  };
}

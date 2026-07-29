// OWNERSHIP: the width convention for DataGrid's **generated chrome columns** —
// `__select__`, `__detail__` and `__actions__` (#91).
//
// This module has **no imports on purpose.** All three generating modules plus
// `data-grid-actions.tsx` read from it, and a constant that cannot import cannot
// join an import cycle.

/**
 * Width of a generated chrome column, in px.
 *
 * **Square to the table's row-height *floor*, which is not the same thing as the
 * row height.** `table.tsx`'s `<th>`/`<td>` carry `h-10` (40px), and a table cell
 * treats `height` as a minimum — so a row measures 40px only while its content
 * fits on one line. Measured: 40px on the header row, 40–41px on single-line body
 * rows, and **49px** in a story whose cells hold taller content. So this is square
 * to a minimal row and narrower than a tall one, and no fixed column width can
 * track a content-driven row height.
 *
 * **It is square at the default `medium` density only.** The `size` variant
 * overrides row height to `--ui-units-size-32`/`-48` (32px/48px,
 * `table.tsx:252-258`), and this is a TanStack `size` — a JavaScript number
 * resolved once, which cannot follow a CSS class. Making it density-aware would
 * need the width to be CSS, and there is no seam through which a config module can
 * put a class on its generated column's cells. Deliberately out of scope for P1;
 * the alternative was a wrong number in three files.
 *
 * The value is a floor-matching constant rather than a token because row height is
 * expressed as a Tailwind `h-10`, so there is no `--ui-*` token to reference. If a
 * row-height token ever lands, this should reference it.
 */
export const DATA_GRID_CHROME_COLUMN_WIDTH = 40;

/**
 * The sizing members a generated chrome column must declare, ready to spread into
 * a `ColumnDef`.
 *
 * **All three bounds, and `size` alone is not enough — `maxSize` is the
 * load-bearing one.** The table is `table-layout: auto` and `w-full`, so the
 * browser distributes surplus width across the columns; `size` alone is a
 * preference the surplus overrides. Measured on `columns-features--every-affordance`:
 * the selection column carried `min-width: 150px` and still rendered **209.2px**,
 * because a floor does not stop distribution. Pinning `maxSize` is what makes the
 * column actually measure 40.
 *
 * **Deliberately NOT `enableResizing: false`, and that was a real mistake caught by
 * a test.** A chrome column should not be resizable — it holds a 16–24px control
 * and has nothing to reveal, and a resize writes a `columnSizing` entry that
 * `persistence` then stores and restores, so one stray drag on a gutter becomes
 * durable state. But **that is already handled, revocably**, by
 * `columnsFeatures.lockSystemColumns` → `lockedColumnIds`, which locks all three
 * chrome columns by default.
 *
 * `enableResizing: false` on a column def is **absolute** — `lockedColumnIds`
 * cannot re-enable it — so setting it here made `lockSystemColumns: false`
 * unreachable. That is a documented, deliberately-tested caller escape hatch
 * (`data-grid-column-header-controls.test.tsx`, "offers them once the caller
 * unlocks them"), and overriding an explicit opt-out is worse than a wrong default.
 * One control for the whole policy, not two where a column def silently wins.
 *
 * Safe against clipping: measured min-content floors are 16px (`__select__`) and
 * 32px (`__detail__`, `__actions__`), all below 40, and the 24×24 expander button
 * is unaffected.
 */
export const DATA_GRID_CHROME_COLUMN_SIZING = {
  size: DATA_GRID_CHROME_COLUMN_WIDTH,
  minSize: DATA_GRID_CHROME_COLUMN_WIDTH,
  maxSize: DATA_GRID_CHROME_COLUMN_WIDTH,
} as const;

import type { Table } from '@tanstack/react-table';
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@constructor-lab/icons-react/stroke-mono';

import { ButtonIcon } from '../button-icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';

import {
  DATA_GRID_DEFAULT_LABELS,
  type ResolvedDataGridLabels,
} from './data-grid-config/labels';

// Private DataGrid chrome (design §4.3, "Pagination"): the pagination row, owned
// by DataGrid like `data-grid-toolbar.tsx`, `data-grid-column-filters.tsx` and
// `data-grid-actions.tsx`.
//
// This exists rather than three new props on `DataTablePagination` because that
// component is explicitly frozen — `data-table/index.ts:97-100` marks the whole
// `DataTable*` companion suite as one-minor compatibility adapters that move
// behind DataGrid and are removed next major, with "do not add new features
// here". Design §1 says the same: the library publishes no batteries-included
// DataTable companion suite. F4 set the precedent by building
// `data-grid-toolbar.tsx` rather than extending the frozen `DataTableToolbar`,
// for exactly this reason.
//
// Its markup at the defaults is byte-identical to the frozen component's, and
// `__tests__/data-grid-pagination.test.tsx` pins that (§0.1's equivalence test).
// That is what keeps the visual-regression baselines for every unchanged DataGrid
// story safe, and what keeps the frozen adapter honest until the next major
// removes it.

interface DataGridPaginationProps<TData> {
  readonly table: Table<TData>;
  /** Page-size options offered in the rows-per-page select. */
  readonly pageSizeOptions?: number[];
  /** Render the rows-per-page select. `pagination.showPageSize`, default true. */
  readonly showPageSize?: boolean;
  /**
   * Render the first/last page buttons. `pagination.showFirstLast`, default
   * true. Forced off by `unknownTotal` — see below.
   */
  readonly showFirstLast?: boolean;
  /**
   * The total row/page count is unknown, so navigation follows the owner's
   * directional capabilities and **no page count is announced**
   * (`ui-spec/…/data-table/behavior.md`, "Unknown totals are honest").
   *
   * The count the engine would otherwise announce is not merely missing, it is
   * **wrong**, and that is measured rather than assumed. Under
   * `manualPagination` with no `rowCount`/`pageCount`, TanStack's `getRowCount()`
   * falls back to the pre-pagination row model length — the **loaded window** —
   * so `getPageCount()` is `Math.ceil(window / pageSize)`. A 3-row window at
   * `pageSize: 10` reports **1**, and a 500-result query announces "Page 1 of 1".
   *
   * This also suppresses first/last independently of `showFirstLast`, for the
   * same reason: "go to last page" is `setPageIndex(getPageCount() - 1)`, which
   * with a fabricated count of 1 navigates to page index 0 — the *first* page,
   * while claiming to go to the last. Silently wrong rather than broken, which is
   * worse. The config layer resolves `showFirstLast` to `false` here as well, but
   * a caller composing this component directly has no config layer.
   */
  readonly unknownTotal?: boolean;
  /**
   * The owner's forward capability, from `server.hasNextPage`. Authoritative when
   * supplied, and it has to be able to **enable** a button the engine disabled:
   * with the fabricated page count above, `getCanNextPage()` is
   * `pageIndex < pageCount - 1` → `0 < 0` → `false`, so a server grid's Next
   * button is dead on every window that fits in one page. The engine cannot
   * answer this question, so the owner must.
   */
  readonly hasNextPage?: boolean;
  /** The owner's backward capability, from `server.hasPreviousPage`. */
  readonly hasPreviousPage?: boolean;
  /**
   * How many rows are selected, when the engine cannot answer it (#94).
   *
   * **Absent means "ask the engine"**, which is right for every client-side grid:
   * `getFilteredSelectedRowModel()` counts per-row selection and that is exactly
   * what a client grid has.
   *
   * It is wrong under a **controlled server selection**, and one mode makes it
   * wrong by construction. `server.selection` in `all-results` mode means
   * "everything the query matches except `excludedIds`", and the engine's
   * `rowSelection` slice is **deliberately never written** in that mode — the
   * controlled token stays authoritative and nothing is committed internally. So
   * the per-row count is 0 no matter how much is selected: measured, a grid with
   * 4821 of 4821 rows selected rendered **"0 of 4 row(s) selected."**
   *
   * **A resolved number, not the `DataGridServerSelection` union**, and that is the
   * point of the seam. The pager would otherwise have to know that `all-results`
   * counts by exclusion while `explicit` counts by enumeration — server-selection
   * semantics in a component whose job is page navigation. `server.ts` draws the
   * same line for the same reason, publishing its selection handler as a
   * ready-made closure "so that file composes an opaque function and learns no
   * server semantics". `pagination.tsx`'s `chrome` resolves it; a caller composing
   * this component directly supplies its own.
   *
   * ⚠ **Known limitation, deliberately not addressed here.** In `explicit` mode
   * the resolved count is `ids.size`, which is the owner's truth. The *engine's*
   * fallback below counts only ids inside the loaded window, so a direct composer
   * that omits this prop still undercounts a selection reaching beyond the loaded
   * rows. Logged rather than fixed, because folding it in would make two changes
   * unattributable.
   */
  readonly selectedCount?: number;
  /**
   * The strings this component renders (PLTFRM-93117).
   *
   * Optional, defaulting to the shared `DATA_GRID_DEFAULT_LABELS` — not a second copy
   * of the English strings, the same object the `labels` group starts from. Optional
   * because this component is exported and composable on its own, so requiring it
   * would be a breaking signature change for a caller who has no translations.
   */
  readonly labels?: ResolvedDataGridLabels;
}

export function DataGridPagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  showPageSize = true,
  showFirstLast = true,
  unknownTotal = false,
  hasNextPage,
  hasPreviousPage,
  selectedCount,
  labels = DATA_GRID_DEFAULT_LABELS,
}: DataGridPaginationProps<TData>) {
  // An explicitly supplied capability wins over the engine's guess, which is the
  // whole point of the member. Absent one, the engine's own predicate stands, so
  // a client-paginated grid behaves exactly as the frozen component did.
  const canPreviousPage = hasPreviousPage ?? table.getCanPreviousPage();
  const canNextPage = hasNextPage ?? table.getCanNextPage();
  const firstLast = showFirstLast && !unknownTotal;

  // `?? `, not `||`: a resolved count of 0 is a real answer — "nothing is selected
  // out of 4821" — and truthiness would discard it and fall back to the engine,
  // which is the same class of bug as a value with a default being unable to
  // express "unset".
  //
  // `getRowCount()`, not `getFilteredRowModel().rows.length` (#94). The row model is
  // the **loaded** row set, so under server pagination this announced one window as
  // the whole result set. Measured: a grid with `server.rowCount: 4821` and a 4-row
  // window rendered "0 of 4" while its OWN page counter, four elements away,
  // rendered "Page 1 of 483" — two numbers in one component disagreeing about the
  // same total, and the component already held the right one.
  //
  // `getRowCount()` is `options.rowCount ?? prePaginationRowModel.rows.length`, so
  // it is the filtered count client-side and the owner's total in server mode.
  // Correct in both without a branch here, and without new plumbing — `server.ts`
  // already forwards `rowCount`.
  //
  // Built here rather than inline because it is now a call into `labels`
  // (PLTFRM-93117), and a JSX comment cannot live inside an argument list.
  const selectionSummary = labels.selectedCount(
    selectedCount ?? table.getFilteredSelectedRowModel().rows.length,
    table.getRowCount()
  );

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {selectionSummary}
      </div>
      <div className="flex items-center gap-6 lg:gap-8">
        {showPageSize && (
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{labels.rowsPerPage}</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger
                aria-label={labels.rowsPerPage}
                className="h-8 w-[70px]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {unknownTotal
            ? labels.page(table.getState().pagination.pageIndex + 1)
            : labels.pageOf(
                table.getState().pagination.pageIndex + 1,
                table.getPageCount()
              )}
        </div>
        <div className="flex items-center gap-2">
          {firstLast && (
            <ButtonIcon
              variant="secondary"
              aria-label={labels.firstPage}
              className="hidden lg:inline-flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!canPreviousPage}
            >
              <ChevronFirstIcon />
            </ButtonIcon>
          )}
          <ButtonIcon
            variant="secondary"
            aria-label={labels.previousPage}
            onClick={() => table.previousPage()}
            disabled={!canPreviousPage}
          >
            <ChevronLeftIcon />
          </ButtonIcon>
          <ButtonIcon
            variant="secondary"
            aria-label={labels.nextPage}
            onClick={() => table.nextPage()}
            disabled={!canNextPage}
          >
            <ChevronRightIcon />
          </ButtonIcon>
          {firstLast && (
            <ButtonIcon
              variant="secondary"
              aria-label={labels.lastPage}
              className="hidden lg:inline-flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!canNextPage}
            >
              <ChevronLastIcon />
            </ButtonIcon>
          )}
        </div>
      </div>
    </div>
  );
}

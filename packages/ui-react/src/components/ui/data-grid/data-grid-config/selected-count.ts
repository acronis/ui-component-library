import type { DataTableController } from '../../data-table';
import type { ResolvedDataGrid } from './registry';

// OWNERSHIP: shared by `pagination` and `toolbar`. Both render a selected-row
// count, and both are wrong in the same way without this: `server.selection` in
// `all-results` mode means "everything the query matches except `excludedIds`",
// and the engine's `rowSelection` slice is deliberately never written in that
// mode — so the per-row count is 0 no matter how much is selected. Measured on
// the pager before #94: a grid with 4821 of 4821 rows selected rendered
// "0 of 4 row(s) selected."
//
// It lives here rather than in either caller because PLTFRM-93130 moved the bulk
// bar into the toolbar row, which made the toolbar the *second* place that needs
// the number. Two copies of server-selection semantics is a drift surface, and
// the two copies answer the same question.

/**
 * The selected-row count when the engine cannot answer it, or `undefined` when it
 * can — **absent means "ask the engine"**, which is right for every client-side
 * grid: `getFilteredSelectedRowModel()` / the `selection` slice count per-row
 * selection and that is exactly what a client grid has.
 *
 * A resolved number, never the `DataGridServerSelection` union, so neither caller
 * learns that `all-results` counts by exclusion while `explicit` counts by
 * enumeration. `server.ts` draws the same line for the same reason.
 *
 * `resolved.server.selection`, never the raw `server.selection` prop: the resolved
 * member is the *effective* token — `server.ts` returns `undefined` for an
 * `all-results` token scoped to a different `queryRequestKey`, so a stale token
 * cannot be counted as a live selection. The config member is the request; this is
 * the verdict.
 *
 *  - `all-results` — the total minus the exclusions. `getRowCount()` is the total
 *    the owner supplied (`server.rowCount`); it is the only number in scope that
 *    means "all results" rather than "the loaded window".
 *  - `explicit` — the owner enumerated the ids, so `ids.size` is their truth,
 *    including ids outside the loaded window that the engine cannot see.
 *  - absent — no controlled selection, so the engine owns it outright.
 */
export function resolveSelectedCount<TData>(
  resolved: Pick<ResolvedDataGrid<TData>, 'server'>,
  controller: DataTableController<TData>
): number | undefined {
  const serverSelection = resolved.server.selection;

  if (serverSelection === undefined) {
    return undefined;
  }

  return serverSelection.mode === 'all-results'
    ? controller.table.getRowCount() - serverSelection.excludedIds.size
    : serverSelection.ids.size;
}

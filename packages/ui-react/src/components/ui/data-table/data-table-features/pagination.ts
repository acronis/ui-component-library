import { useEffect } from 'react';
import { getPaginationRowModel } from '@tanstack/react-table';

import { defineDataTableFeature } from './registry';

declare const process: {
  readonly env: { readonly NODE_ENV?: string };
};

// OWNERSHIP: created by F2 with the shipped wiring; **U8 owns this file** —
// `pagination.unknownTotal` landed here, as the guard described below.

/**
 * Pagination behavior at the DataTable layer. Page navigation, the page-size
 * chooser and the counts are DataGrid's (design §4.3); this models state only.
 *
 * Every member is optional by design — the owning unit tightens optionality
 * inside this file.
 */
export interface DataTablePaginationConfig {
  /**
   * The total is unknown, so paging is driven by directional capabilities rather
   * than a page count. **Requires manual pagination.**
   *
   * Its engine consequence is to stop the engine fabricating a page count. This
   * is measured, not assumed: with `manualPagination` and neither total supplied,
   * TanStack's `getRowCount()` falls back to the pre-pagination row model
   * length — the **loaded window** — so `getPageCount()` becomes
   * `ceil(window / pageSize)`. A 3-row window at `pageSize: 10` reports a page
   * count of **1**, which is a confident wrong answer rather than an absent one,
   * and `getCanNextPage()` is `false` as a result. Passing `pageCount: -1` is how
   * TanStack is told the count is genuinely unknown, and it also lifts the page
   * clamp so navigation past the loaded window works.
   *
   * The *presentation* half — which page controls render and what they
   * announce — is DataGrid's (design §4.3):
   * `data-grid-config/pagination.tsx` resolves the member and
   * `data-grid-pagination.tsx` renders it.
   */
  readonly unknownTotal?: boolean;
}

export const paginationFeature = defineDataTableFeature({
  id: 'pagination',

  engineOptions(ctx) {
    const { paginationEnabled, manualPagination, rowCount, pageCount } =
      ctx.gates;
    const config = ctx.config as DataTablePaginationConfig | undefined;
    const unknownTotal = config?.unknownTotal ?? false;

    return {
      onPaginationChange: (updater) => ctx.requestChange('pagination', updater),
      ...(manualPagination ? { manualPagination: true } : {}),
      ...(rowCount !== undefined ? { rowCount } : {}),
      ...(pageCount !== undefined ? { pageCount } : {}),
      // Gated on both totals being absent rather than ordered after them, so
      // there is no spread-precedence puzzle to reason about: an explicit total
      // and `unknownTotal` together is an invalid combination (design §5.2, and
      // DataGrid warns about it), and where a caller supplies both, the known
      // total is the safer degradation — it still produces a working paginator.
      ...(unknownTotal &&
      manualPagination &&
      rowCount === undefined &&
      pageCount === undefined
        ? { pageCount: -1 }
        : {}),
      ...(paginationEnabled && !manualPagination
        ? { getPaginationRowModel: getPaginationRowModel() }
        : {}),
    };
  },

  // The invalid-combination guard for this layer. DataGrid does its own
  // validation and knows more (it can see server mode), so this exists for the
  // configuration DataGrid cannot reach: a **direct**
  // `useDataTable({ pagination: { unknownTotal: true } })` caller with client
  // pagination, where the row model genuinely knows the total and `pageCount: -1`
  // would break it. DataGrid never produces that combination — it resolves
  // `unknownTotal` to `false` outside server mode — so the two never both fire.
  effects(ctx) {
    const config = ctx.config as DataTablePaginationConfig | undefined;
    const unknownTotal = config?.unknownTotal ?? false;
    const { manualPagination } = ctx.gates;

    useEffect(() => {
      if (process.env.NODE_ENV === 'production') {
        return;
      }
      if (unknownTotal && !manualPagination) {
        console.error(
          'DataTable pagination.unknownTotal requires manualPagination; the client row model always knows its own total.'
        );
      }
    }, [manualPagination, unknownTotal]);
  },
});

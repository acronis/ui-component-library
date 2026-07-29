import {
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  type Column,
  type Row,
  type Updater,
} from '@tanstack/react-table';

import type { DataTableSliceValue } from '../data-table-contract';
import { defineDataTableFeature } from './registry';
import {
  neutralFiltersToTanStack,
  resolveUpdater,
  tanStackFiltersToNeutral,
} from './translate';

// OWNERSHIP: created by F2 with the shipped wiring; **U7 owns this file** and
// completed the `filters` group here.
//
// Two halves landed by U7:
//
//  - **Faceted values.** `getFacetedRowModel` / `getFacetedUniqueValues` /
//    `getFacetedMinMaxValues` are all `'rejected-library-contract'` in the engine
//    allowlist, meaning a *feature module* supplies them rather than a caller.
//    None was installed before, so `column.getFacetedUniqueValues()` returned an
//    empty map and no set-membership control could be built.
//  - **Multi-column global search.** Case-insensitive substring OR'd across
//    `filters.global.columnIds`, with a per-column escape hatch on column
//    metadata. The query descriptor stays `{ q, columnIds }` and therefore
//    serializable, so server mode is unaffected.

/** Per-column escape hatch, read from `columnDef.meta`. */
export interface DataTableGlobalFilterColumnMeta<TData> {
  /**
   * Replaces the default case-insensitive substring test for this column only.
   * Design §5.2 puts comparators and filter operators on column metadata, so the
   * escape hatch lives there rather than on `FiltersConfig` — which is also what
   * keeps the query descriptor serializable.
   */
  readonly globalFilterFn?: (row: TData, query: string) => boolean;
}

/**
 * Filtering behavior at the DataTable layer.
 *
 * Every member is optional by design — the DataGrid layer tightens optionality,
 * which is the point of pre-declaring the key.
 */
export interface DataTableFilteringConfig {
  /**
   * Columns the global filter matches against. Case-insensitive substring, OR'd
   * across the listed columns. Absent means the engine's default behavior, which
   * matches every globally-filterable column.
   */
  readonly globalColumnIds?: readonly string[];
  /** Expose faceted unique values / min-max from the **pre-filter** row model. */
  readonly facets?: boolean;
}

/** The default global-filter test: case-insensitive substring on the cell value. */
function matchesQuery(value: unknown, query: string): boolean {
  if (value === null || value === undefined) {
    return false;
  }
  return String(value).toLowerCase().includes(query);
}

function columnGlobalFilterFn<TData>(
  column: Column<TData, unknown>
): ((row: TData, query: string) => boolean) | undefined {
  const meta = column.columnDef.meta as
    DataTableGlobalFilterColumnMeta<TData> | undefined;
  return meta?.globalFilterFn;
}

export const filteringFeature = defineDataTableFeature<unknown, string>({
  id: 'filtering',

  engineOptions(ctx) {
    const { filteringEnabled, manualFiltering } = ctx.gates;
    const config = ctx.config as DataTableFilteringConfig | undefined;
    const globalColumnIds = config?.globalColumnIds;
    const clientFiltering = filteringEnabled && !manualFiltering;

    return {
      // Both handlers are unconditional so filter state is tracked and emitted in
      // manual/server mode, where no client filter model is installed.
      onColumnFiltersChange: (updater) =>
        ctx.requestChange('columnFilters', (previous) =>
          tanStackFiltersToNeutral(
            resolveUpdater(updater, neutralFiltersToTanStack(previous)),
            previous
          )
        ),
      onGlobalFilterChange: (updater) =>
        ctx.requestChange(
          'globalFilter',
          updater as Updater<DataTableSliceValue<'globalFilter'>>
        ),
      ...(manualFiltering ? { manualFiltering: true } : {}),
      ...(clientFiltering
        ? { getFilteredRowModel: getFilteredRowModel() }
        : {}),

      // ── Multi-column global search ──────────────────────────────────────────
      //
      // TanStack already ORs the global filter across every column that reports
      // `getCanGlobalFilter()`, so restricting *which* columns qualify is the
      // whole of the `columnIds` semantics — no bespoke OR loop, and the row-level
      // short-circuit stays TanStack's.
      ...(globalColumnIds !== undefined && globalColumnIds.length > 0
        ? {
            getColumnCanGlobalFilter: (column: Column<unknown, unknown>) =>
              globalColumnIds.includes(column.id),
            globalFilterFn: (
              row: Row<unknown>,
              columnId: string,
              filterValue: unknown
            ) => {
              const query = String(filterValue ?? '')
                .trim()
                .toLowerCase();
              if (query === '') {
                return true;
              }
              const column = row
                .getAllCells()
                .find((cell) => cell.column.id === columnId)?.column;
              const override =
                column === undefined ? undefined : columnGlobalFilterFn(column);
              return override !== undefined
                ? override(row.original, query)
                : matchesQuery(row.getValue(columnId), query);
            },
          }
        : {}),

      // ── Faceted values ──────────────────────────────────────────────────────
      //
      // Faceting reads the *pre-filter* row model, which is what makes an option
      // list show every choice rather than only the ones surviving the current
      // filter. It needs the filtered row model to exist, so it is gated on client
      // filtering: in server mode the client holds one page and any facet computed
      // from it would be wrong.
      ...(config?.facets === true && clientFiltering
        ? {
            getFacetedRowModel: getFacetedRowModel(),
            getFacetedUniqueValues: getFacetedUniqueValues(),
            getFacetedMinMaxValues: getFacetedMinMaxValues(),
          }
        : {}),
    };
  },
});

import type { FilterFn } from '@tanstack/react-table';

import {
  DataGridColumnFilterChips,
  type ResolvedColumnFilterDef,
} from '../data-grid-column-filters';
import {
  operatorFilterFn,
  type DataGridFilterOperator,
} from '../data-grid-filter-operators';
import { defineDataGridConfig } from './registry';

// OWNERSHIP: created by F4 with the shipped wiring; **U7 owns this file**.

// The `filters` behavior group (design §5.2): per-column operator controls plus
// the columns the toolbar search box drives.
//
// `facet` and the multi-column `global.columnIds` semantics are **both
// implemented** — see `facet` on `DataGridColumnFilterDef` and `columnIds` on
// `global` below, `hasFacets`/`facets` in `controllerOptions`, and
// `__tests__/data-grid-filters-facets.test.tsx`.
//
// This header used to carry a "P1 note" listing both as U7's future work, left
// behind when they landed. That is not a harmless stale comment: PLTFRM-93016 was
// filed against the published package reporting "global search covers only one
// column", citing this note as the source's own admission. The note was the
// evidence; `columnIds` had shipped a day before the ticket. If either of these
// grows a follow-up, describe what is missing — never restate the whole feature
// as unbuilt.

/** Enables an operator-driven filter control for one column. */
export interface DataGridColumnFilterDef {
  /** Column id (matches the column's `id` or `accessorKey`). */
  columnId: string;
  /** Control label; defaults to the column id. */
  label?: string;
  /** Offered operators; defaults to a text-oriented set. */
  operators?: readonly DataGridFilterOperator[];
  /**
   * Option source for a set-membership control (shipped legacy parity with
   * `filterStats`). `'unique'` asks DataTable for the column's distinct values
   * **and their counts** from the pre-filter row model; `'min-max'` exposes its
   * numeric range; an explicit list supplies fixed options verbatim.
   *
   * Absent means a free-text control, which is what every filter was before U7.
   */
  facet?: DataGridFacetSource;
}

/** Where a set-membership control gets its options. */
export type DataGridFacetSource =
  'unique' | 'min-max' | readonly (string | number | boolean)[];

/**
 * Filters config. `columns` lists per-column filter controls; `global` names the
 * column the toolbar search box filters. The deprecated flat form is a bare
 * `DataGridColumnFilterDef[]` (equivalent to `{ columns }`).
 */
export interface DataGridFiltersConfig {
  /** One operator-driven filter control per entry. */
  columns?: readonly DataGridColumnFilterDef[];
  /** The toolbar search box. Omit it and no global filter is offered. */
  global?: {
    /**
     * Columns the toolbar search box matches against: case-insensitive substring,
     * OR'd across the listed columns. Per-column customization lives on column
     * metadata as `globalFilterFn`, which keeps the query descriptor
     * `{ q, columnIds }` serializable so server mode round-trips unchanged.
     */
    columnIds?: readonly string[];
    /** @deprecated Use `columnIds`. Single-column form, kept for one minor line. */
    columnId?: string;
    /** Placeholder text for the search box. */
    placeholder?: string;
  };
}

export interface ResolvedDataGridFilters {
  /** The caller's column filter definitions, as supplied. */
  readonly columns: readonly DataGridColumnFilterDef[];
  /** The same definitions with labels and operators defaulted. */
  readonly definitions: readonly ResolvedColumnFilterDef[];
  /** Ids of the columns that carry a filter control. */
  readonly columnIds: ReadonlySet<string>;
  /**
   * The single column the search box binds to, for the toolbar's own wiring.
   * `undefined` when no global search is configured. With several
   * `columnIds` this is the first — TanStack's global filter is table-scoped, so
   * the search box drives `globalFilter` and the *engine* decides which columns
   * match.
   */
  readonly searchColumn?: string;
  /** Every column the global search matches, in configuration order. */
  readonly searchColumnIds: readonly string[];
  readonly searchPlaceholder?: string;
  /** Whether any definition asked for faceted options. */
  readonly hasFacets: boolean;
}

/* eslint-disable unused-imports/no-unused-vars -- declaration merging requires
   every augmentation to repeat the target's type-parameter list verbatim, so
   `TData` must be named even in a group whose shape does not use it. */
declare module './registry' {
  interface DataGridGroupedConfigMap<TData> {
    /**
     * Column filter controls. A `DataGridFiltersConfig` (`{ columns, global }`)
     * or — deprecated — a bare `DataGridColumnFilterDef[]`. `false` disables
     * filters.
     */
    filters: false | readonly DataGridColumnFilterDef[] | DataGridFiltersConfig;
  }
  interface DataGridDeprecatedAliasMap<TData> {
    /** @deprecated Use `filters.global.columnId`. Column the search box filters. */
    searchKey: string;
    /** @deprecated Use `filters.global.placeholder`. */
    searchPlaceholder: string;
  }
  interface DataGridResolvedConfigMap<TData> {
    filters: ResolvedDataGridFilters;
  }
}
/* eslint-enable unused-imports/no-unused-vars */

/** Shared stable empty reference, so an unfiltered grid keeps a constant identity. */
const NO_COLUMN_FILTERS: readonly DataGridColumnFilterDef[] = [];
const NO_DEFINITIONS: readonly ResolvedColumnFilterDef[] = [];
const NO_COLUMN_IDS: ReadonlySet<string> = new Set<string>();
const NO_COLUMN_IDS_LIST: readonly string[] = [];

const DEFAULT_FILTER_OPERATORS: readonly DataGridFilterOperator[] = [
  'contains',
  'equals',
  'startsWith',
  'isEmpty',
  'isNotEmpty',
];

export const filtersConfig = defineDataGridConfig({
  key: 'filters',
  kind: 'grouped',
  aliases: ['searchKey', 'searchPlaceholder'],

  resolve({ props }) {
    const warnings: string[] = [];

    // union: false | DataGridColumnFilterDef[] | DataGridFiltersConfig
    const grouped =
      props.filters !== undefined &&
      props.filters !== false &&
      !Array.isArray(props.filters)
        ? (props.filters as DataGridFiltersConfig)
        : undefined;
    const columns: readonly DataGridColumnFilterDef[] = Array.isArray(
      props.filters
    )
      ? props.filters
      : (grouped?.columns ?? NO_COLUMN_FILTERS);

    let searchColumnIds: readonly string[] =
      props.searchKey === undefined ? NO_COLUMN_IDS_LIST : [props.searchKey];
    let searchPlaceholder = props.searchPlaceholder;
    if (grouped?.global !== undefined) {
      if (
        props.searchKey !== undefined ||
        props.searchPlaceholder !== undefined
      ) {
        warnings.push(
          'DataGrid: `filters.global` cannot be combined with `searchKey`/`searchPlaceholder`; the grouped `filters.global` config wins.'
        );
      }
      const { columnIds, columnId } = grouped.global;
      if (columnIds !== undefined && columnId !== undefined) {
        warnings.push(
          'DataGrid: `filters.global.columnIds` cannot be combined with the deprecated `filters.global.columnId`; `columnIds` wins.'
        );
      }
      searchColumnIds =
        columnIds ?? (columnId === undefined ? NO_COLUMN_IDS_LIST : [columnId]);
      searchPlaceholder = grouped.global.placeholder;
    }

    return {
      value: {
        columns,
        definitions:
          columns.length === 0
            ? NO_DEFINITIONS
            : columns.map((filter) => ({
                columnId: filter.columnId,
                label: filter.label ?? filter.columnId,
                operators:
                  filter.operators && filter.operators.length > 0
                    ? filter.operators
                    : DEFAULT_FILTER_OPERATORS,
                ...(filter.facet === undefined ? {} : { facet: filter.facet }),
              })),
        columnIds:
          columns.length === 0
            ? NO_COLUMN_IDS
            : new Set(columns.map((filter) => filter.columnId)),
        searchColumn: searchColumnIds[0],
        searchColumnIds,
        searchPlaceholder,
        hasFacets: columns.some((filter) => filter.facet !== undefined),
      },
      warnings,
    };
  },

  columns(columns, { resolved, resolveColumnId }) {
    const { columnIds } = resolved.filters;
    if (columnIds.size === 0) {
      return columns;
    }
    return columns.map((column) => {
      const columnId = resolveColumnId(column);
      return columnId !== undefined && columnIds.has(columnId)
        ? {
            ...column,
            enableColumnFilter: true,
            filterFn: operatorFilterFn as FilterFn<unknown>,
          }
        : column;
    });
  },

  controllerOptions({ resolved }) {
    const { searchColumnIds, hasFacets } = resolved.filters;
    // The controller reads this feature's config from the `filtering` option
    // itself (`objectConfig(options, 'filtering')`), and `filteringEnabled` is
    // true for the boolean *or* an object — so the config form both enables
    // filtering and carries U7's two additions. There is no separate `filters`
    // controller option; passing one would be silently dropped, because an
    // unknown key inside a conditional spread escapes excess-property checking.
    if (searchColumnIds.length === 0 && !hasFacets) {
      return { filtering: true };
    }
    return {
      filtering: {
        ...(searchColumnIds.length > 0
          ? { globalColumnIds: searchColumnIds }
          : {}),
        ...(hasFacets ? { facets: true } : {}),
      },
    };
  },

  chrome(slot, { controller, resolved }) {
    // **Chips only.** The trigger controls moved up into the toolbar row
    // (PLTFRM-93130) so that a selection's bulk actions replace them, and the
    // `toolbar` module mounts them from the same `definitions` this group resolves;
    // what stays here is the applied-filter summary, which deliberately survives a
    // selection so the acting-on set stays legible. Still gated by
    // `toolbar.columnFilters` (design §5.2 defaults it to false).
    if (slot !== 'under-toolbar' || !resolved.toolbar.columnFilters) {
      return null;
    }
    const { definitions } = resolved.filters;
    if (definitions.length === 0) {
      return null;
    }
    return (
      <DataGridColumnFilterChips
        controller={controller}
        filters={definitions}
      />
    );
  },
});

import { DataGridPagination } from '../data-grid-pagination';
import { defineDataGridConfig } from './registry';

// OWNERSHIP: created by F4 with the shipped wiring; **U8 owns this file** —
// `unknownTotal`, `showPageSize` and `showFirstLast` landed here.

// The `pagination` behavior group (design §5.2).
//
// **Correcting this file's original P1 note**, which said the three members
// above land "by extending the two interfaces below plus this module's `chrome`.
// Nothing outside this file changes." That last sentence was false. The chrome
// used to render `DataTablePagination`, whose props are exactly
// `{ table, pageSizeOptions? }` — there is nowhere in them to put the three
// members — and `data-table/index.ts:97-100` lists that component in a **frozen**
// block of one-minor compatibility adapters with an explicit "Do not add new
// features here". So the three members needed DataGrid's own pagination chrome,
// `../data-grid-pagination.tsx`, exactly as `toolbar.viewOptions` needed
// `../data-grid-toolbar.tsx` for the same reason (plan §0.1). The frozen
// component stays exported for external callers and DataGrid no longer consumes
// it, and `../__tests__/data-grid-pagination.test.tsx` carries §0.1's equivalence
// test so the two cannot drift accidentally while both exist.

/**
 * Pagination config. The deprecated flat form is a boolean plus the separate
 * `pageSize`/`pageSizeOptions` props.
 */
export interface DataGridPaginationConfig {
  pageSize?: number;
  pageSizeOptions?: readonly number[];
  /** Show the rows-per-page select. Default true (design §5.2). */
  showPageSize?: boolean;
  /**
   * Show the first/last page buttons. Default true (design §5.2), and forced to
   * `false` by `unknownTotal`, which cannot address a last page.
   */
  showFirstLast?: boolean;
  /**
   * The total is unknown, so navigation follows the owner's directional
   * capabilities and no page count is announced. Default false.
   *
   * Valid **only** in server mode with both `server.hasNextPage` and
   * `server.hasPreviousPage` supplied, and not alongside `server.rowCount`/
   * `server.pageCount` or an explicit `showFirstLast: true` (design §5.2's
   * invalid combinations). Each of those is reported as a development warning.
   */
  unknownTotal?: boolean;
}

export interface ResolvedDataGridPagination {
  /**
   * Whether the engine paginates and the footer renders. Server mode paginates
   * even when the caller did not ask for the `pagination` group.
   */
  readonly enabled: boolean;
  /** Whether the caller configured the group (server mode alone does not). */
  readonly configured: boolean;
  readonly pageSize: number;
  readonly pageSizeOptions?: readonly number[];
  readonly showPageSize: boolean;
  /** Already reduced to `false` when `unknownTotal` is on. */
  readonly showFirstLast: boolean;
  readonly unknownTotal: boolean;
  /**
   * The initial page slice this group contributes to `defaultState`, or
   * `undefined` when server mode owns the page or the caller never configured
   * pagination. Exposed as data because `state.ts` owns `defaultState` and a
   * caller's own slice beats a group default (design §5.1).
   */
  readonly initialSlice?: {
    readonly pageIndex: number;
    readonly pageSize: number;
  };
}

/* eslint-disable unused-imports/no-unused-vars -- declaration merging requires
   every augmentation to repeat the target's type-parameter list verbatim, so
   `TData` must be named even in a group whose shape does not use it. */
declare module './registry' {
  interface DataGridGroupedConfigMap<TData> {
    /**
     * Pagination. A `DataGridPaginationConfig`
     * (`{ pageSize, pageSizeOptions, showPageSize, showFirstLast, unknownTotal }`)
     * or — deprecated with `pageSize`/`pageSizeOptions` — a boolean.
     */
    pagination: boolean | DataGridPaginationConfig;
  }
  interface DataGridDeprecatedAliasMap<TData> {
    /** @deprecated Use `pagination.pageSize`. Initial page size. */
    pageSize: number;
    /** @deprecated Use `pagination.pageSizeOptions`. */
    pageSizeOptions: number[];
  }
  interface DataGridResolvedConfigMap<TData> {
    pagination: ResolvedDataGridPagination;
  }
}
/* eslint-enable unused-imports/no-unused-vars */

export const paginationConfig = defineDataGridConfig({
  key: 'pagination',
  kind: 'grouped',
  aliases: ['pageSize', 'pageSizeOptions'],

  resolve({ props, resolved }) {
    const warnings: string[] = [];

    // union: boolean | DataGridPaginationConfig
    const config =
      typeof props.pagination === 'object' && props.pagination !== null
        ? props.pagination
        : undefined;

    if (config !== undefined) {
      if (props.pageSize !== undefined || props.pageSizeOptions !== undefined) {
        warnings.push(
          'DataGrid: `pagination` config cannot be combined with `pageSize`/`pageSizeOptions`; the grouped `pagination` config wins.'
        );
      }
    }

    const configured = config !== undefined || props.pagination === true;
    const pageSize = config?.pageSize ?? props.pageSize ?? 10;
    // Server mode owns the page slice through its controlled query, so an initial
    // page size would fight it.
    const server = resolved.server?.config;
    const serverDriven = server !== undefined;

    const showPageSize = config?.showPageSize ?? true;
    // What the caller asked for, kept separate from what is honored. Every
    // warning below is keyed to the request, because a resolved value cannot
    // express "the caller never mentioned this".
    const requestedUnknownTotal = config?.unknownTotal ?? false;

    // Design §5.2's four invalid combinations for `unknownTotal`. All four are
    // development warnings rather than throws, matching every other combination
    // rule in this layer.
    if (requestedUnknownTotal) {
      if (!serverDriven) {
        warnings.push(
          'DataGrid: `pagination.unknownTotal` is valid only in server mode — the client row model always knows its own total, so there is nothing for it to describe.'
        );
      } else {
        if (
          server.hasNextPage === undefined ||
          server.hasPreviousPage === undefined
        ) {
          warnings.push(
            'DataGrid: `pagination.unknownTotal` requires both `server.hasNextPage` and `server.hasPreviousPage`; without a page count they are the only thing that can drive page navigation.'
          );
        }
        if (server.rowCount !== undefined || server.pageCount !== undefined) {
          warnings.push(
            'DataGrid: `pagination.unknownTotal` cannot be combined with `server.rowCount`/`server.pageCount`; the total is either known or it is not.'
          );
        }
      }
      // Deliberately keyed to the **config member**, not to the resolved value:
      // `showFirstLast` defaults to `true`, so reading the resolved flag here
      // would warn on every `unknownTotal` grid, including the correct ones that
      // never mentioned `showFirstLast`. Only an explicit `true` is a caller
      // asking for something impossible.
      if (config?.showFirstLast === true) {
        warnings.push(
          'DataGrid: `pagination.unknownTotal` hides the first/last page buttons, so `showFirstLast: true` cannot be honored — there is no last page to go to.'
        );
      }
    }

    // Honored only where it is meaningful. Outside server mode the row model
    // knows the real total, so hiding the count would replace a correct answer
    // with no answer — strictly worse than the warning above. Resolving it to
    // `false` also keeps the invalid state out of everything downstream: neither
    // the chrome nor the controller ever sees an unknown total it cannot support.
    const unknownTotal = requestedUnknownTotal && serverDriven;

    return {
      value: {
        configured,
        enabled: configured || serverDriven,
        pageSize,
        pageSizeOptions: config?.pageSizeOptions ?? props.pageSizeOptions,
        showPageSize,
        // Unknown totals win over the request: "go to last page" is
        // `setPageIndex(getPageCount() - 1)`, which with a page count derived
        // from the loaded window navigates to the *first* page while claiming
        // otherwise.
        showFirstLast: unknownTotal ? false : (config?.showFirstLast ?? true),
        unknownTotal,
        initialSlice:
          !serverDriven && configured ? { pageIndex: 0, pageSize } : undefined,
      },
      warnings,
    };
  },

  controllerOptions({ resolved }) {
    const { enabled, unknownTotal } = resolved.pagination;
    // The object form carries `unknownTotal` to the DataTable pagination
    // feature, which turns it into `pageCount: -1` so the engine stops deriving
    // a page count from the loaded window. The boolean form is kept for every
    // other configuration so nothing else changes shape.
    return { pagination: unknownTotal ? { unknownTotal: true } : enabled };
  },

  chrome(slot, { controller, resolved }) {
    if (slot !== 'bottom' || !resolved.pagination.enabled) {
      return null;
    }
    const { pageSizeOptions, showPageSize, showFirstLast, unknownTotal } =
      resolved.pagination;
    // The directional capabilities are the owner's, so they come from `server`
    // rather than from this group. Manifest order puts `server` before
    // `pagination`, which is what makes this readable here at all.
    const server = resolved.server.config;

    // #94: how many rows are selected, when the engine cannot answer it.
    //
    // **`resolved.server.selection`, never `server.selection`.** The resolved
    // member is the *effective* token — `server.ts` returns `undefined` for an
    // `all-results` token scoped to a different `queryRequestKey`, so a stale token
    // cannot be counted as a live selection. The config member is the request; this
    // is the verdict.
    //
    // Resolved to a number here rather than handed down as the union, so the pager
    // learns no server-selection semantics — see the prop's docblock.
    //
    //  • `all-results` — "everything the query matches except these", so the count
    //    is the total minus the exclusions. `getRowCount()` is the total the owner
    //    supplied (`server.rowCount`); it is the only number in scope that means
    //    "all results" rather than "the loaded window".
    //  • `explicit` — the owner enumerated the ids, so `ids.size` is their truth,
    //    including ids outside the loaded window that the engine cannot see.
    //  • absent — no controlled selection, so the engine owns it outright and the
    //    prop is omitted rather than passed as 0.
    const serverSelection = resolved.server.selection;
    const selectedCount =
      serverSelection === undefined
        ? undefined
        : serverSelection.mode === 'all-results'
          ? controller.table.getRowCount() - serverSelection.excludedIds.size
          : serverSelection.ids.size;
    return (
      <DataGridPagination
        table={controller.table}
        pageSizeOptions={pageSizeOptions ? [...pageSizeOptions] : undefined}
        showPageSize={showPageSize}
        showFirstLast={showFirstLast}
        unknownTotal={unknownTotal}
        {...(server?.hasNextPage === undefined
          ? {}
          : { hasNextPage: server.hasNextPage })}
        {...(server?.hasPreviousPage === undefined
          ? {}
          : { hasPreviousPage: server.hasPreviousPage })}
        {...(selectedCount === undefined ? {} : { selectedCount })}
      />
    );
  },
});

import type {
  DataTableChangeCause,
  DataTableChangeEvent,
  DataTableQuery,
  DataTableQueryChangeEvent,
  DataTableStateInput,
} from '../../data-table';
import { defineDataGridConfig } from './registry';

// OWNERSHIP: created by F4 with the shipped wiring; **U8 owns this file** —
// `hasNextPage` and `hasPreviousPage` landed with the pagination chrome that
// consumes them; `selection` and `onSelectionChange` landed after them.

// All-manual server mode (design §5.2). Not a behavior group: it is a top-level
// ownership input, so it is never preset-addressable.
//
// **Correcting this file's original P1 note**, which said all four remaining
// members land "by extending `DataGridServerConfig` below plus this module's
// `controllerOptions`. Nothing outside this file changes." Two of the four
// cannot: `hasNextPage`/`hasPreviousPage` have no controller option to land in
// and never will, because the engine has no way to answer the question they
// answer. Measured, under `manualPagination` with no `rowCount`/`pageCount`:
// `getRowCount()` falls back to the pre-pagination row model length — the loaded
// window — so `getPageCount()` is `ceil(window / pageSize)`, which for a 3-row
// window at `pageSize: 10` is **1**, and `getCanNextPage()` is therefore
// **false**. A server grid with 500 results announces "Page 1 of 1" and its Next
// button is dead. Their only consumer is DataGrid's own pagination chrome
// (`../data-grid-pagination.tsx`), which is why they landed in the same change as
// it rather than earlier and inert.

/**
 * A controlled, server-owned selection (design §3.6).
 *
 * `explicit` enumerates the selected ids. `all-results` means "everything the
 * query matches, except these" — a claim DataGrid cannot make on its own, because
 * it has only ever seen the loaded window. So the `token` is
 * **application-issued** and scoped to the exact `queryRequestKey` it was issued
 * for; DataGrid never invents one and never labels loaded rows as all server
 * results.
 */
export type DataGridServerSelection =
  | { readonly mode: 'explicit'; readonly ids: ReadonlySet<string> }
  | {
      readonly mode: 'all-results';
      /** The `query.requestKey` this token was issued for. */
      readonly queryRequestKey: string;
      readonly excludedIds: ReadonlySet<string>;
      readonly token: string;
    };

/**
 * A requested change to `server.selection`. The controlled selection stays
 * authoritative: this reports what the user asked for, and nothing is committed
 * internally until the owner supplies a new `server.selection`.
 */
export interface DataGridServerSelectionChangeEvent {
  /** The selection this event is measured against — the controlled one. */
  readonly previous: DataGridServerSelection | undefined;
  /** The requested next selection. */
  readonly selection: DataGridServerSelection | undefined;
  readonly cause: DataTableChangeCause;
  readonly query: DataTableQuery;
  readonly requestKey: string;
}

/**
 * All-manual server mode: the caller owns the query and the rows. DataGrid tracks
 * sort/filter/page state, emits `onQueryChange` on every atomic query transition
 * (with the canonical request key), and drives server pagination — but never
 * sorts, filters, or slices client rows.
 */
export interface DataGridServerConfig {
  /** The controlled query (sorting, filters, global filter, grouping, pagination). */
  query: DataTableQuery;
  /** Total row count (when the page count is not supplied). */
  rowCount?: number;
  /** Total page count. */
  pageCount?: number;
  /**
   * Whether a next page exists. Supply this **with** `hasPreviousPage` when the
   * total is unknown: manual pagination needs either known totals or both
   * directional capabilities (design §3.6), and `pagination.unknownTotal`
   * requires these two.
   *
   * Read by DataGrid's pagination chrome, never by the engine — see the note at
   * the top of this file for why there is no controller option for it.
   */
  hasNextPage?: boolean;
  /** Whether a previous page exists. The counterpart of `hasNextPage`. */
  hasPreviousPage?: boolean;
  /**
   * A controlled selection the server owns. Invalid alongside `state.selection`
   * (design §5.2) — `state.ts` reports the overlap, because this becomes one of
   * the controlled slices it merges.
   *
   * An `all-results` value whose `queryRequestKey` does not match
   * `query.requestKey` is **stale and not reported**: changing the query
   * invalidates a token until the owner supplies one for the new key
   * (`ui-spec/…/data-table/behavior.md`, "All-results token cannot cross a
   * query").
   */
  selection?: DataGridServerSelection;
  /**
   * Fires when the user requests a different selection. Paired with `selection`
   * and inert without it — with no controlled server selection the engine owns
   * selection outright and `callbacks.onSelectionChange` already reports it, so
   * firing here too would be a second event for one transition.
   */
  onSelectionChange?: (event: DataGridServerSelectionChangeEvent) => void;
  /** Fires once per atomic query transition; the caller refetches from it. */
  onQueryChange: (event: DataTableQueryChangeEvent) => void;
}

export interface ResolvedDataGridServer {
  readonly config?: DataGridServerConfig;
  /**
   * The query slices server mode controls, **plus `selection` in `explicit`
   * mode**. Exposed as data rather than contributed as a `state` controller
   * option, because `state.ts` owns that option and has to merge these with the
   * caller's own controlled slices — server wins on any overlap (design §5.1).
   */
  readonly controlledSlices?: DataTableStateInput;
  /**
   * The **effective** server selection: the configured one, or `undefined` when
   * there is none or when an `all-results` token is scoped to a different query
   * request key. Read this rather than `config.selection`, which is the request
   * rather than the verdict.
   *
   * **Consumed by `selection.tsx`** — this member was held for
   * `selection.selectAll: 'all-results'` and that work has landed, so the
   * reservation is discharged. Its `columns` contribution reads this to derive
   * each checkbox from `!excludedIds.has(row.id)` and to compute the exclusion
   * delta on a toggle, which is why the consumer had to be there: a row id is in
   * hand in the cell renderer and nowhere upstream.
   *
   * In `explicit` mode it has a second consumer — it reaches the controller
   * through `controlledSlices` above.
   */
  readonly selection?: DataGridServerSelection;
  /**
   * The authoritative selection-slice handler, or `undefined` when nothing should
   * be reported. `data-grid-config/callbacks.ts` composes this ahead of the
   * observing `callbacks.onSelectionChange`, exactly as it does for
   * `onQueryChange` — it is published as a ready-made closure so that file
   * composes an opaque function and learns no server semantics.
   *
   * Present only when a **controlled `explicit`** selection is configured with a
   * handler. Deliberately **not** in `all-results` mode, and that asymmetry is
   * permanent rather than pending: translating an engine selection-slice change
   * into an adjusted `excludedIds` needs the loaded row ids, which are unreachable
   * from here, so `selection.tsx` calls `config.onSelectionChange` directly from
   * the toggle site instead. One consequence worth knowing — that path reports
   * `cause: 'pointer'` because it runs in the click handler, while this one
   * reports `'api'` because `row.toggleSelected()` loses the provenance (task #69).
   */
  readonly onSelectionChange?: (
    event: DataTableChangeEvent<'selection', ReadonlySet<string>>
  ) => void;
}

/* eslint-disable unused-imports/no-unused-vars -- declaration merging requires
   every augmentation to repeat the target's type-parameter list verbatim, so
   `TData` must be named even in a group whose shape does not use it. */
declare module './registry' {
  interface DataGridTopLevelConfigMap<TData> {
    /** All-manual server mode (query + row/page counts + onQueryChange). */
    server: DataGridServerConfig;
  }
  interface DataGridIdentityFreeMap<TData> {
    // Server mode replaces whole data windows, so row state can only survive by
    // id (design §3.1).
    server: never;
  }
  interface DataGridResolvedConfigMap<TData> {
    server: ResolvedDataGridServer;
  }
}
/* eslint-enable unused-imports/no-unused-vars */

export const serverConfig = defineDataGridConfig({
  key: 'server',
  kind: 'top-level',
  aliases: [],
  reads: ['server'],

  resolve({ props, resolved }) {
    const config = props.server;

    // Design §5.2: `all-results` without an application-issued server token is an
    // invalid combination. The check lives here rather than in `selection.tsx`
    // because `selection` is at index 9 of the manifest and this module at 12 — a
    // module only sees what resolved before it, so `selection.resolve` cannot see
    // `server` and this one can see `selection`. It is also the right home on the
    // merits: what is missing is the server's token, not the selection config.
    const wantsAllResults = resolved.selection?.selectAll === 'all-results';
    const hasToken =
      config?.selection?.mode === 'all-results' &&
      config.selection.queryRequestKey === config.query.requestKey;

    if (config === undefined) {
      return {
        value: {},
        warnings: wantsAllResults
          ? [
              'DataGrid: `selection.selectAll: "all-results"` requires server mode with a `server.selection` token scoped to the current query; without one DataGrid would have to label the loaded rows as all results, so the header select-all covers the loaded rows instead.',
            ]
          : [],
      };
    }

    const warnings: string[] = [];

    if (wantsAllResults && !hasToken) {
      warnings.push(
        config.selection === undefined
          ? 'DataGrid: `selection.selectAll: "all-results"` requires an application-issued `server.selection` token in `all-results` mode. DataGrid never invents one, so the header select-all covers the loaded rows instead.'
          : 'DataGrid: `selection.selectAll: "all-results"` has no usable `server.selection` token — it is either `explicit` or scoped to a different query — so the header select-all covers the loaded rows instead.'
      );
    }

    // Design §3.6: manual pagination requires either a known `rowCount`/
    // `pageCount` or **both** directional capabilities. With neither, the engine
    // derives a page count from the loaded window instead — so the footer
    // announces "Page 1 of 1" for a 500-result query and disables Next on every
    // page. Both capabilities rather than either one, because a footer has to
    // answer both directions.
    const hasTotals =
      config.rowCount !== undefined || config.pageCount !== undefined;
    const hasDirectional =
      config.hasNextPage !== undefined && config.hasPreviousPage !== undefined;
    if (!hasTotals && !hasDirectional) {
      warnings.push(
        'DataGrid: `server` paginates manually, so it needs either `server.rowCount`/`server.pageCount` or both `server.hasNextPage` and `server.hasPreviousPage`. Without one of those the page count is unknown and page navigation cannot be reported honestly.'
      );
    }

    // "All-results token cannot cross a query": a token is scoped to the exact
    // request key it was issued for, so once filters produce a different key it
    // reports nothing until the owner supplies one for the new key. Rejected
    // here — at the resolve boundary — rather than at each consumer, so no
    // consumer can accidentally trust a stale token.
    const requested = config.selection;
    const staleToken =
      requested?.mode === 'all-results' &&
      requested.queryRequestKey !== config.query.requestKey;
    const selection = staleToken ? undefined : requested;

    if (staleToken) {
      warnings.push(
        `DataGrid: the all-results selection token is scoped to query request key "${
          (requested as { queryRequestKey: string }).queryRequestKey
        }" but the current query is "${config.query.requestKey}", so no all-results selection is reported. Supply a token scoped to the current key.`
      );
    }

    if (config.onSelectionChange !== undefined && requested === undefined) {
      warnings.push(
        'DataGrid: `server.onSelectionChange` reports requested changes to `server.selection`, and does nothing without it. Supply `server.selection`, or read `callbacks.onSelectionChange` instead.'
      );
    }

    // Server mode controls the query slices and pre-processes the rows. An
    // `explicit` selection joins them: it is enumerable, so it can be a
    // controlled slice, and being controlled is what makes a toggle *request* a
    // change rather than commit one. An `all-results` token cannot — its member
    // set is exactly what DataGrid has not seen.
    const controlledSlices: DataTableStateInput = {
      sorting: config.query.sorting,
      columnFilters: config.query.filters,
      ...(config.query.globalFilter !== undefined
        ? { globalFilter: config.query.globalFilter }
        : {}),
      grouping: config.query.grouping,
      pagination: config.query.pagination,
      ...(selection?.mode === 'explicit' ? { selection: selection.ids } : {}),
    };

    // The handler `callbacks.ts` composes as authoritative. Built here, closing
    // over the controlled selection so `previous` is the authoritative value
    // rather than whatever the engine last held.
    const onSelectionChange =
      selection?.mode === 'explicit' && config.onSelectionChange !== undefined
        ? (event: DataTableChangeEvent<'selection', ReadonlySet<string>>) => {
            config.onSelectionChange?.({
              previous: selection,
              selection: { mode: 'explicit', ids: event.value },
              cause: event.cause,
              query: event.query,
              requestKey: event.requestKey,
            });
          }
        : undefined;

    return {
      value: {
        config,
        controlledSlices,
        ...(selection === undefined ? {} : { selection }),
        ...(onSelectionChange === undefined ? {} : { onSelectionChange }),
      },
      warnings,
    };
  },

  controllerOptions({ resolved }) {
    const { config } = resolved.server;
    if (config === undefined) {
      return {};
    }
    return {
      manualSorting: true,
      manualFiltering: true,
      manualPagination: true,
      ...(config.rowCount !== undefined ? { rowCount: config.rowCount } : {}),
      ...(config.pageCount !== undefined
        ? { pageCount: config.pageCount }
        : {}),
    };
  },
});

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  createDataTableQuery,
  createDefaultDataTableState,
  type DataTableFilterDescriptor,
  type DataTableQuery,
  type DataTableQueryChangeEvent,
} from '../../data-table';
import {
  evaluateFilterOperator,
  type DataGridFilterOperator,
} from '../data-grid-filter-operators';

// A fake backend for the server-mode stories.
//
// ── Why this file exists at all, against the local convention ────────────────
//
// Every other story file in this package is self-contained, and that is the right
// default: a fixture read from elsewhere is a fixture you have to go and look up
// before you can read the story. The server stories are the exception because what
// they demonstrate IS the round trip — latency, refetch, a discarded response —
// and a round trip written six times is six chances for the stories to disagree
// with each other about what a server does.
//
// It is deliberately NOT a `*.stories.ts` file, so Storybook's glob
// (`__stories__/*.stories.@(ts|tsx)`) skips it, and it sits outside `__tests__`,
// so Vitest never collects it either.
//
// ── It answers the query, rather than approximating it ───────────────────────
//
// Sorting, filters, the global filter and pagination are all applied FROM the
// `DataTableQuery` the grid emits. Two consequences worth knowing:
//
//  - The operator semantics come from the grid's own
//    `evaluateFilterOperator`, not from a second implementation. A fixture with
//    its own idea of `startsWith` would make every filter story a demonstration
//    of the fixture.
//  - Anything the query cannot express, this cannot do — which is the useful
//    half. If a story looks wrong, the query is the thing to read.

/** A response is dropped unless it is still the one being awaited. */
interface Pending {
  requestKey: string;
  timer: ReturnType<typeof setTimeout>;
}

export interface FakeServerOptions {
  /** Response latency in ms. `0` resolves synchronously — use it for snapshots. */
  latency?: number;
  /** Rows per request when the story drives the page size itself. */
  pageSize?: number;
  /** Fail every request until `retry()` is called. */
  failing?: boolean;
  /** Columns the global filter matches against. */
  searchColumnIds?: readonly string[];
}

export type FakeServerStatus = 'loading' | 'loaded' | 'empty' | 'error';

export interface FakeServerState<T> {
  /** The controlled query. Feed this straight to `server.query`. */
  query: DataTableQuery;
  /** The current page of matching rows. */
  rows: readonly T[];
  status: FakeServerStatus;
  /** Matching rows across every page — `server.rowCount`. */
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  /** Every request key the grid has asked for, newest last. */
  requests: readonly string[];
  /** Requests whose response arrived after a newer one had been issued. */
  discarded: number;
  onQueryChange: (event: DataTableQueryChangeEvent) => void;
  /** Re-issues the current query. Also clears a `failing` run. */
  retry: () => void;
}

const DEFAULT_LATENCY = 500;

/** The query a story starts from, with everything else at its default. */
export function initialQuery(pageSize: number): DataTableQuery {
  return createDataTableQuery(
    createDefaultDataTableState({ pagination: { pageIndex: 0, pageSize } })
  );
}

/** Applies one column filter descriptor, through the grid's own operator table. */
function matchesFilter<T extends Record<string, unknown>>(
  row: T,
  filter: DataTableFilterDescriptor
): boolean {
  // The grid stores `{ operator, value }` as the filter value; a bare value means
  // the default operator, which is `contains` for the text controls.
  const raw = filter.value as
    { operator?: string; value?: string } | string | undefined;
  const operator = (
    typeof raw === 'object' && raw !== null ? raw.operator : 'contains'
  ) as DataGridFilterOperator;
  const value =
    typeof raw === 'object' && raw !== null ? (raw.value ?? '') : (raw ?? '');

  return evaluateFilterOperator(row[filter.id], operator, String(value));
}

/**
 * Runs a query against an in-memory table. Exported on its own because the
 * infinite-scroll story needs the matching half without the paging half.
 */
export function applyQuery<T extends Record<string, unknown>>(
  all: readonly T[],
  query: DataTableQuery,
  searchColumnIds: readonly string[] = []
): readonly T[] {
  let rows = [...all];

  for (const filter of query.filters) {
    rows = rows.filter((row) => matchesFilter(row, filter));
  }

  const search = String(query.globalFilter ?? '')
    .trim()
    .toLowerCase();
  if (search !== '') {
    const columns =
      searchColumnIds.length > 0 ? searchColumnIds : Object.keys(all[0] ?? {});
    rows = rows.filter((row) =>
      columns.some((columnId) =>
        String(row[columnId] ?? '')
          .toLowerCase()
          .includes(search)
      )
    );
  }

  // Applied in reverse so the first descriptor is the primary sort — a stable
  // sort run last-to-first is the standard way to get multi-key ordering out of
  // a single-key comparator.
  for (const descriptor of [...query.sorting].reverse()) {
    rows.sort((left, right) => {
      const a = left[descriptor.id];
      const b = right[descriptor.id];
      const order =
        typeof a === 'number' && typeof b === 'number'
          ? a - b
          : String(a ?? '').localeCompare(String(b ?? ''));

      return descriptor.desc ? -order : order;
    });
  }

  return rows;
}

/**
 * A paged backend with latency, out-of-order protection and an error switch.
 *
 * The returned `query` is authoritative: the grid never advances a page on its
 * own in server mode, so a story that forgets to feed `onQueryChange` back shows
 * a grid whose footer does nothing — which is the contract, not a bug.
 */
export function useFakeServer<T extends Record<string, unknown>>(
  all: readonly T[],
  options: FakeServerOptions = {}
): FakeServerState<T> {
  const {
    latency = DEFAULT_LATENCY,
    pageSize = 10,
    failing = false,
    searchColumnIds = [],
  } = options;

  const [query, setQuery] = useState(() => initialQuery(pageSize));
  const [rows, setRows] = useState<readonly T[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<FakeServerStatus>('loading');
  const [requests, setRequests] = useState<readonly string[]>([]);
  const [discarded, setDiscarded] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(failing);

  // The key the UI is currently waiting for. A response for anything else is a
  // straggler and is dropped — the guard `requestKey` exists for, and the reason
  // it is canonical rather than a counter: two states that serialize the same way
  // ARE the same request, so a fast round trip back to a previous query does not
  // strand the response already in flight for it.
  const awaiting = useRef<Pending | undefined>(undefined);

  // Held in a ref, and this is load-bearing rather than tidy. Callers write
  // `useFakeServer(rows, { searchColumnIds: ['resource', 'tenant'] })`, so the array
  // is a fresh identity every render; in the effect's dependency list it re-runs the
  // request on every render, and the request sets state, which renders again. That
  // is an infinite loop that presents as a frozen tab, not as an error.
  const searchRef = useRef(searchColumnIds);
  searchRef.current = searchColumnIds;

  useEffect(() => {
    const { requestKey } = query;
    setStatus('loading');
    setRequests((seen) => [...seen, requestKey]);

    const settle = () => {
      if (awaiting.current?.requestKey !== requestKey) {
        setDiscarded((count) => count + 1);

        return;
      }
      awaiting.current = undefined;
      if (failed) {
        setStatus('error');
        setRows([]);

        return;
      }
      const matching = applyQuery(all, query, searchRef.current);
      const { pageIndex, pageSize: size } = query.pagination;
      setRows(matching.slice(pageIndex * size, pageIndex * size + size));
      setTotal(matching.length);
      setStatus(matching.length === 0 ? 'empty' : 'loaded');
    };

    const timer = setTimeout(settle, latency);
    awaiting.current = { requestKey, timer };

    return () => clearTimeout(timer);
    // Every dependency here is a primitive or a stable reference. `attempt` is in
    // the list so `retry()` re-issues an identical query, which by construction has
    // an identical key and would otherwise be a no-op. `searchColumnIds` is NOT —
    // see `searchRef` above.
  }, [all, query, latency, failed, attempt]);

  const onQueryChange = useCallback(
    (event: DataTableQueryChangeEvent) => setQuery(event.query),
    []
  );

  const retry = useCallback(() => {
    setFailed(false);
    setAttempt((count) => count + 1);
  }, []);

  const { pageIndex, pageSize: size } = query.pagination;

  return {
    query,
    rows,
    status,
    total,
    hasNextPage: (pageIndex + 1) * size < total,
    hasPreviousPage: pageIndex > 0,
    requests,
    discarded,
    onQueryChange,
    retry,
  };
}

export interface InfiniteFakeServerState<T> {
  query: DataTableQuery;
  /** Every row loaded so far, in order. Grows; never replaced. */
  rows: readonly T[];
  total: number;
  hasNextPage: boolean;
  loadingMore: boolean;
  /** Pages fetched so far — the on-screen proof that the trigger is latched. */
  fetches: number;
  onQueryChange: (event: DataTableQueryChangeEvent) => void;
  /** Wire this to `server.onEndReached`. */
  loadMore: () => void;
}

/**
 * The accumulating variant, for `server.onEndReached`.
 *
 * The difference from `useFakeServer` is the whole point of the feature: a page
 * arrives and is **appended** rather than replacing the window, so the loaded row
 * count grows and the grid's own count-latch re-arms for the next call.
 *
 * The query still advances — `pagination.pageIndex` is how this asks for the next
 * slice — but nothing is ever sliced away, so the grid holds the union.
 */
export function useInfiniteFakeServer<T extends Record<string, unknown>>(
  all: readonly T[],
  options: { latency?: number; pageSize?: number } = {}
): InfiniteFakeServerState<T> {
  const { latency = 400, pageSize = 50 } = options;

  const [query, setQuery] = useState(() => initialQuery(pageSize));
  const [rows, setRows] = useState<readonly T[]>(() => all.slice(0, pageSize));
  const [loadingMore, setLoadingMore] = useState(false);
  const [fetches, setFetches] = useState(1);
  // Read inside the timeout, so a second trigger arriving mid-flight cannot
  // append the same page twice. The grid's latch already prevents that; this is
  // the belt to its braces, and it is what a real caller with a request in flight
  // would have to write anyway.
  const inFlight = useRef(false);

  const loadMore = useCallback(() => {
    if (inFlight.current || rows.length >= all.length) {
      return;
    }
    inFlight.current = true;
    setLoadingMore(true);
    setTimeout(() => {
      setRows((loaded) => all.slice(0, loaded.length + pageSize));
      setQuery((current) =>
        createDataTableQuery(
          createDefaultDataTableState({
            pagination: {
              pageIndex: current.pagination.pageIndex + 1,
              pageSize,
            },
          })
        )
      );
      setFetches((count) => count + 1);
      setLoadingMore(false);
      inFlight.current = false;
    }, latency);
  }, [all, latency, pageSize, rows.length]);

  const onQueryChange = useCallback(
    (event: DataTableQueryChangeEvent) => setQuery(event.query),
    []
  );

  return {
    query,
    rows,
    total: all.length,
    hasNextPage: rows.length < all.length,
    loadingMore,
    fetches,
    onQueryChange,
    loadMore,
  };
}

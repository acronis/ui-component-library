import { useCallback, useMemo, useRef, useState } from 'react';

// The lazy-children request machine for the `tree` feature (U2).
//
// `packages/ui-spec/components/data-table/behavior.md` — "Lazy child load handles
// stale work" — fixes four things about it:
//
//  1. `loading(requestKey)` / `loaded` / `error(error, requestKey)` metadata is
//     **keyed by row ID**.
//  2. It is **stored outside both expansion slices**. `detailExpanded` and
//     `treeExpanded` are sets of row IDs and nothing else; request status is not
//     expansion state, it is not serializable in the same way, and design §5.2's
//     no-live-row-state-by-default rule means persistence must never restore it.
//     So it lives here, in React state, not in `DataTableState`.
//  3. **Stale results do not mutate the current tree.** Every request carries a
//     key; a result whose key is no longer the row's current key is dropped.
//  4. Failure exposes **row-scoped error metadata and a retry command**. The
//     Spinner/Alert/retry UI belongs to DataGrid.
//
// ## Two keyings, deliberately
//
// Status is keyed by **row ID**, because that is what the spec fixes and what the
// row render context needs. Loaded children are keyed by **the original record
// object**, in a `WeakMap`, because that is what `getSubRows(originalRow, index)`
// receives — it gets no row ID and no parent, so an ID-keyed lookup would have to
// re-derive identity from a `getRowId` that may legitimately depend on the parent.
//
// Object identity is also the behavior we want on a data replacement: new objects
// miss the WeakMap, so children are re-fetched rather than silently reused for a
// record that may no longer have them. Entries for dropped rows are collected
// rather than pruned.

/** Where a row's lazy-children request has got to. */
export type DataTableTreeLoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

/** A row's request record. `idle` rows carry no key and no error. */
export interface DataTableTreeLoadRecord {
  readonly status: DataTableTreeLoadStatus;
  /** The key of the request this record came from. */
  readonly requestKey?: string;
  readonly error?: unknown;
}

/**
 * A lazy-children transition, for `onTreeLoad`.
 *
 * A **superseded result emits nothing**: `onTreeLoad` reports state transitions,
 * and a dropped result causes none — the newer request emits its own terminal
 * event. That keeps the event stream a faithful trace of the records below.
 */
export interface DataTableTreeLoadEvent<TData> {
  readonly rowId: string;
  readonly row: TData;
  readonly requestKey: string;
  readonly status: Exclude<DataTableTreeLoadStatus, 'idle'>;
  readonly children?: readonly TData[];
  readonly error?: unknown;
}

export interface DataTableTreeMachine<TData> {
  /**
   * This row's record; `idle` when it has never been requested.
   *
   * Keyed by **row ID** — see "Two keyings" above. Do not "unify" this with
   * `childrenOf`: an ID-keyed children lookup has to re-derive identity from a
   * `getRowId` that may depend on the parent, which is the coupling the split
   * avoids.
   */
  statusOf(rowId: string): DataTableTreeLoadRecord;
  /**
   * Lazily loaded children for a record, or `undefined` if none are held.
   *
   * Keyed by the **record object**, not the row ID, because this answers
   * `getSubRows(originalRow, index)` — which receives neither. See "Two keyings".
   */
  childrenOf(row: TData): TData[] | undefined;
  /**
   * Starts a request unless one is in flight or the row's children are already
   * loaded. Safe to call on every expand.
   */
  load(rowId: string, row: TData): void;
  /** Discards the row's record and issues a fresh request. */
  retry(rowId: string, row: TData): void;
  /** True when a loader is configured at all. */
  readonly enabled: boolean;
  /**
   * Bumped once per **arrival** of children, for `ctx.graftData(generation)`.
   *
   * `getCoreRowModel` is memoized on `data` identity alone, so children sitting in
   * the store are invisible until `data` is a different array. This counter is what
   * `engineOptions` turns into that new identity — once per arrival, never per
   * render.
   *
   * **It is a live getter over a ref, not a captured number, and that is
   * load-bearing.** `engineOptions` reads the machine published by the *previous*
   * render (its own render's `effects` has not run yet), so a value snapshotted
   * into the machine object would always be one arrival stale and the last child
   * would never appear. The ref is bumped synchronously, before the `setRecords`
   * that schedules the render which reads it.
   *
   * An `error` does not bump it: nothing arrived. A `retry` that then succeeds does.
   */
  readonly generation: number;
}

export interface DataTableTreeMachineOptions<TData> {
  readonly loadChildren?: (
    row: TData,
    requestKey: string
  ) => Promise<readonly TData[]>;
  readonly onLoad?: (event: DataTableTreeLoadEvent<TData>) => void;
}

const IDLE: DataTableTreeLoadRecord = Object.freeze({ status: 'idle' });

/**
 * Holds the machine for one controller.
 *
 * Called from the `tree` module's `effects`, which is the only contribution point
 * where a module may run a hook. The module is a singleton shared by every table,
 * so it cannot hold this itself — it publishes the instance per controller and
 * reads it back lazily. See `data-table-features/tree.ts`.
 */
export function useDataTableTreeMachine<TData>({
  loadChildren,
  onLoad,
}: DataTableTreeMachineOptions<TData>): DataTableTreeMachine<TData> {
  const [records, setRecords] = useState<
    Readonly<Record<string, DataTableTreeLoadRecord>>
  >({});
  // Refs, not state: these are bookkeeping for in-flight work, and writing them
  // must never schedule a render of its own.
  const childrenRef = useRef(new WeakMap<object, TData[]>());
  const currentKeyRef = useRef(new Map<string, string>());
  const sequenceRef = useRef(0);
  // A ref rather than state: the render that reads it is the one `setRecords`
  // already schedules, and `engineOptions` reads it through a machine object from
  // the *previous* render — see `generation` on the interface.
  const generationRef = useRef(0);
  // The latest callback, so a request started under one render resolves against
  // the current handler rather than a captured stale one.
  const onLoadRef = useRef(onLoad);
  onLoadRef.current = onLoad;

  const start = useCallback(
    (rowId: string, row: TData) => {
      if (loadChildren === undefined) {
        return;
      }

      sequenceRef.current += 1;
      const requestKey = `${rowId}#${sequenceRef.current}`;
      currentKeyRef.current.set(rowId, requestKey);
      setRecords((previous) => ({
        ...previous,
        [rowId]: { status: 'loading', requestKey },
      }));
      onLoadRef.current?.({ rowId, row, requestKey, status: 'loading' });

      loadChildren(row, requestKey).then(
        (children) => {
          // The stale check. A result whose key is no longer this row's current
          // key never reaches the tree, and never emits.
          if (currentKeyRef.current.get(rowId) !== requestKey) {
            return;
          }
          if (row !== null && typeof row === 'object') {
            childrenRef.current.set(row as object, [...children]);
          }
          // Bumped BEFORE `setRecords`, so the render that state change schedules
          // already sees the new generation. One bump per arrival — the whole
          // point of the counter is that it does not move on an idle render.
          generationRef.current += 1;
          setRecords((previous) => ({
            ...previous,
            [rowId]: { status: 'loaded', requestKey },
          }));
          onLoadRef.current?.({
            rowId,
            row,
            requestKey,
            status: 'loaded',
            children,
          });
        },
        (error: unknown) => {
          if (currentKeyRef.current.get(rowId) !== requestKey) {
            return;
          }
          setRecords((previous) => ({
            ...previous,
            [rowId]: { status: 'error', requestKey, error },
          }));
          onLoadRef.current?.({
            rowId,
            row,
            requestKey,
            status: 'error',
            error,
          });
        }
      );
    },
    [loadChildren]
  );

  return useMemo<DataTableTreeMachine<TData>>(
    () => ({
      enabled: loadChildren !== undefined,
      // A getter, not `generation: generationRef.current`. Every machine object —
      // including a stale one held in the module's store from the previous render —
      // closes over the same stable ref, so all of them read the live value. A
      // captured number would freeze at the render that built the object, which is
      // exactly the render before the arrival `engineOptions` needs to see.
      get generation() {
        return generationRef.current;
      },
      statusOf: (rowId) => records[rowId] ?? IDLE,
      childrenOf: (row) =>
        row !== null && typeof row === 'object'
          ? childrenRef.current.get(row as object)
          : undefined,
      load: (rowId, row) => {
        const status = (records[rowId] ?? IDLE).status;
        // `loading` would duplicate the request; `loaded` already has children.
        // An `error` row needs `retry`, so a repeated expand does not silently
        // re-request work that just failed.
        if (status === 'idle') {
          start(rowId, row);
        }
      },
      retry: (rowId, row) => start(rowId, row),
    }),
    [loadChildren, records, start]
  );
}

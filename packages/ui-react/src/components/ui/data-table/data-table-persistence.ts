import { useEffect, useRef, useState } from 'react';

import type {
  DataTableChangeCause,
  DataTableSlice,
  DataTableSliceValue,
  DataTableState,
  SerializableValue,
} from './data-table-contract';
// Type-only, and circular by construction — the same shape as
// `data-table-features/registry.ts` importing `DataTableViewProps`. The feature
// module owns its public `…Config` interface (features README rule 5) and the
// engine it drives has to name it. Erased at compile.
import type {
  DataTablePersistableSlice,
  DataTablePersistenceConfig,
} from './data-table-features/persistence';

// OWNERSHIP: **U10**. The restore/save *engine*, per plan §4 U10. DataGrid
// supplies only the config prop and its defaults
// (`data-grid/data-grid-config/persistence.ts`); every mechanic lives here, which
// is the existing DataTable-owns-mechanics split and is what makes persistence
// work for a direct `useDataTable` caller too.
//
// `data-table-features/persistence.ts` is the only caller: it invokes the hook
// below from its `effects` contribution point.

/* -------------------------------------------------------------------------- */
/*                            The stored envelope                             */
/* -------------------------------------------------------------------------- */

/**
 * What a persistence adapter stores, as JSON (design §8).
 *
 * The version is stored **beside** the state rather than folded into the key, so
 * a version bump can be *migrated* rather than merely missed: a key-encoded
 * version makes an old payload unreachable, and unreachable is
 * indistinguishable from absent, which is the one thing `migrate` needs to be
 * able to tell apart.
 */
export interface DataTablePersistenceEnvelope {
  readonly version: number;
  readonly state: Readonly<
    Partial<Record<DataTablePersistableSlice, SerializableValue>>
  >;
}

/**
 * The canonical slice order for a written payload.
 *
 * Iterating this rather than the caller's `include` array is what makes the
 * payload a pure function of the *values*: two callers who list the same slices
 * in different order must produce byte-identical storage, or the change
 * detection below writes on every mount for one of them.
 */
export const DATA_TABLE_PERSISTABLE_SLICES = [
  'columnVisibility',
  'columnOrder',
  'columnSizing',
  'columnPinning',
  'sorting',
  'columnFilters',
  'globalFilter',
  'grouping',
  'pagination',
] as const satisfies readonly DataTablePersistableSlice[];

/**
 * The default `include` set: the four column slices and nothing else
 * (design §5.2).
 *
 * This is the whole of "no live row state by default" as a *value*. The
 * compile-time half is `_AssertNoRowStatePersisted` below, which is the stronger
 * statement: selection, detail/tree expansion and the current row are not merely
 * absent from this default, they cannot be named in `include` at all.
 *
 * `pagination` is deliberately persistable but **not** default: design §5.2
 * excludes the page index by default, and a page index restored against a
 * different result set points at rows that are no longer there.
 */
export const DATA_TABLE_DEFAULT_PERSISTED_SLICES = [
  'columnVisibility',
  'columnOrder',
  'columnSizing',
  'columnPinning',
] as const satisfies readonly DataTablePersistableSlice[];

type AssertTrue<T extends true> = T;

/**
 * Every persistable slice names a real state slice. Without this, a typo in
 * `DataTablePersistableSlice` would produce a slice this engine restores into
 * nothing — `requestChange` would be called with a key the state does not have.
 */
export type _AssertPersistableSlicesExist = AssertTrue<
  [Exclude<DataTablePersistableSlice, DataTableSlice>] extends [never]
    ? true
    : false
>;

/**
 * **Design §5.2's no-live-row-state rule, as a compile-time assertion.**
 *
 * `ui-spec/components/data-table/behavior.md:471-476` requires that selection,
 * detail/tree expansion and the current row are excluded when persistence is
 * enabled without explicit opt-in. Enforcing that with a default value alone
 * would leave the rule one `include: ['selection']` away from being broken by a
 * caller — and row identity is exactly the state that cannot survive a data
 * change keyed by index. So the four row-keyed slices are not omitted from the
 * default, they are **unnameable**, and adding one to
 * `DataTablePersistableSlice` fails to compile here rather than shipping.
 *
 * The spec's "an adapter may persist one only through an explicit safe opt-in
 * contract" is that future opt-in. It is not P1, and this assertion is what
 * makes its absence honest instead of implicit.
 */
export type _AssertNoRowStatePersisted = AssertTrue<
  [
    Extract<
      DataTablePersistableSlice,
      'selection' | 'detailExpanded' | 'treeExpanded' | 'currentRowId'
    >,
  ] extends [never]
    ? true
    : false
>;

/* -------------------------------------------------------------------------- */
/*                          Validation and pruning                            */
/* -------------------------------------------------------------------------- */

/**
 * A stored slice value, validated and pruned — or `undefined` for "discard this
 * slice".
 *
 * **Two different failures, deliberately given two different responses**, because
 * collapsing them is the plausible-but-wrong implementation:
 *
 *  - An **unknown column id** is schema evolution. The column was renamed or
 *    removed since the payload was written, and the *other* entries are still
 *    good. So the entry is pruned and the slice restores without it
 *    (`behavior.md:466`, "the unknown column is discarded" — the column, not the
 *    slice).
 *  - A **wrong type** is corruption. `columnSizing: { name: 'wide' }` is not a
 *    payload this library ever wrote, so nothing in it can be trusted and the
 *    whole slice is discarded.
 *
 * An implementation that discards the whole slice on an unknown id passes any
 * test that only checks the unknown column is gone. `data-table-persistence.test.tsx`
 * asserts a known and an unknown id in the *same* slice for that reason.
 */
type SliceReader = (
  stored: unknown,
  isKnownColumn: (id: string) => boolean
) => SerializableValue | undefined;

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** A finite number. `JSON.parse` cannot produce `NaN`/`Infinity`, a `migrate` can. */
function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/** Prunes ids the column model no longer has; a non-string element is corruption. */
function readColumnIdList(
  stored: unknown,
  isKnownColumn: (id: string) => boolean
): readonly string[] | undefined {
  if (!Array.isArray(stored)) {
    return undefined;
  }
  const ids: string[] = [];
  for (const id of stored) {
    if (typeof id !== 'string') {
      return undefined;
    }
    if (isKnownColumn(id)) {
      ids.push(id);
    }
  }

  return ids;
}

const SLICE_READERS: Readonly<Record<DataTablePersistableSlice, SliceReader>> =
  {
    columnVisibility(stored, isKnownColumn) {
      if (!isRecord(stored)) {
        return undefined;
      }
      const visibility: Record<string, boolean> = {};
      for (const [id, visible] of Object.entries(stored)) {
        if (typeof visible !== 'boolean') {
          return undefined;
        }
        if (isKnownColumn(id)) {
          visibility[id] = visible;
        }
      }

      return visibility;
    },

    columnOrder: readColumnIdList,

    columnSizing(stored, isKnownColumn) {
      if (!isRecord(stored)) {
        return undefined;
      }
      const sizing: Record<string, number> = {};
      for (const [id, size] of Object.entries(stored)) {
        if (!isFiniteNumber(size)) {
          return undefined;
        }
        if (isKnownColumn(id)) {
          sizing[id] = size;
        }
      }

      return sizing;
    },

    columnPinning(stored, isKnownColumn) {
      if (!isRecord(stored)) {
        return undefined;
      }
      const left = readColumnIdList(stored.left, isKnownColumn);
      const right = readColumnIdList(stored.right, isKnownColumn);
      if (left === undefined || right === undefined) {
        return undefined;
      }

      return { left, right };
    },

    sorting(stored, isKnownColumn) {
      if (!Array.isArray(stored)) {
        return undefined;
      }
      const sorting: { id: string; desc: boolean }[] = [];
      for (const descriptor of stored) {
        if (
          !isRecord(descriptor) ||
          typeof descriptor.id !== 'string' ||
          typeof descriptor.desc !== 'boolean'
        ) {
          return undefined;
        }
        if (isKnownColumn(descriptor.id)) {
          sorting.push({ id: descriptor.id, desc: descriptor.desc });
        }
      }

      return sorting;
    },

    columnFilters(stored, isKnownColumn) {
      if (!Array.isArray(stored)) {
        return undefined;
      }
      const filters: {
        id: string;
        operator?: string;
        value: SerializableValue;
      }[] = [];
      for (const descriptor of stored) {
        if (
          !isRecord(descriptor) ||
          typeof descriptor.id !== 'string' ||
          !('value' in descriptor) ||
          (descriptor.operator !== undefined &&
            typeof descriptor.operator !== 'string')
        ) {
          return undefined;
        }
        if (isKnownColumn(descriptor.id)) {
          filters.push({
            id: descriptor.id,
            ...(descriptor.operator === undefined
              ? {}
              : { operator: descriptor.operator }),
            value: descriptor.value as SerializableValue,
          });
        }
      }

      return filters;
    },

    // No column id to prune against, and any JSON value is a legal global filter —
    // the slice is typed `SerializableValue`, which is what `JSON.parse` produces.
    globalFilter(stored) {
      return stored as SerializableValue;
    },

    grouping: readColumnIdList,

    pagination(stored) {
      if (
        !isRecord(stored) ||
        !isFiniteNumber(stored.pageIndex) ||
        !isFiniteNumber(stored.pageSize) ||
        stored.pageIndex < 0 ||
        stored.pageSize <= 0
      ) {
        return undefined;
      }

      return { pageIndex: stored.pageIndex, pageSize: stored.pageSize };
    },
  };

/**
 * A stored envelope, or `undefined` when the payload is not one.
 *
 * Unparseable JSON is folded into the same `undefined` rather than thrown, so
 * `planDataTableRestore` has **one** statable failure contract: it returns
 * `undefined` for any payload it cannot use, and throws only out of a caller's
 * own `migrate`. Two failure channels for "the stored bytes are bad" is one more
 * than a caller can be expected to handle.
 */
function readEnvelope(raw: string): DataTablePersistenceEnvelope | undefined {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return undefined;
  }
  if (
    !isRecord(parsed) ||
    !isFiniteNumber(parsed.version) ||
    !isRecord(parsed.state)
  ) {
    return undefined;
  }

  return {
    version: parsed.version,
    state: parsed.state as DataTablePersistenceEnvelope['state'],
  };
}

/* -------------------------------------------------------------------------- */
/*                              The restore plan                              */
/* -------------------------------------------------------------------------- */

/** One slice to restore, already validated, pruned and known to be restorable. */
export interface DataTablePersistenceRestoreEntry {
  readonly slice: DataTablePersistableSlice;
  readonly value: SerializableValue;
}

/**
 * Turns a stored payload into the list of slice writes to perform — the whole of
 * the restore decision, as a pure function.
 *
 * Pure on purpose. Every clause `behavior.md:461-476` names (migration,
 * validation, unknown-id pruning, controlled-slice exclusion, the default
 * include set) is decided here, so each is assertable without a React tree,
 * *and* the hook below has nothing left to decide that a test cannot see.
 *
 * Returns `undefined` when the payload cannot be used at all — a distinct answer
 * from "an empty plan", because the first is an error to report and the second is
 * a payload that simply had nothing applicable in it.
 */
export function planDataTableRestore(input: {
  readonly raw: string;
  readonly config: DataTablePersistenceConfig;
  readonly slices: readonly DataTablePersistableSlice[];
  readonly isKnownColumn: (id: string) => boolean;
}):
  | { readonly entries: readonly DataTablePersistenceRestoreEntry[] }
  | undefined {
  const { raw, config, slices, isKnownColumn } = input;

  const stored = readEnvelope(raw);
  if (stored === undefined) {
    return undefined;
  }

  let envelope = stored;
  if (stored.version !== config.version) {
    // No `migrate` and a version mismatch is a discard, not a best-effort read.
    // The stored shape is by definition unknown at this version, so "validate it
    // anyway" would be validating against the wrong schema — which is how a
    // half-migrated payload gets restored and looks like a rendering bug.
    if (config.migrate === undefined) {
      return undefined;
    }
    const migrated = config.migrate(stored, stored.version);
    // A migration's output is untrusted input like any other: it comes from
    // caller code operating on data this library did not write.
    if (!isRecord(migrated) || !isRecord(migrated.state)) {
      return undefined;
    }
    envelope = {
      version: config.version ?? stored.version,
      state: migrated.state as DataTablePersistenceEnvelope['state'],
    };
  }

  const entries: DataTablePersistenceRestoreEntry[] = [];
  for (const slice of slices) {
    if (!Object.prototype.hasOwnProperty.call(envelope.state, slice)) {
      continue;
    }
    const value = SLICE_READERS[slice](envelope.state[slice], isKnownColumn);
    if (value === undefined) {
      continue;
    }
    entries.push({ slice, value });
  }

  return { entries };
}

/* -------------------------------------------------------------------------- */
/*                                  The hook                                  */
/* -------------------------------------------------------------------------- */

/**
 * Which slices persistence manages: the requested set, canonically ordered and
 * with every slice the caller controls removed.
 *
 * **Controlled-slice exclusion is a decision about what the caller asked for**,
 * so it is keyed off `controlledSlices` — which the controller derives from the
 * own-keys of its `state` prop — and never off a resolved state value. The
 * resolved state has every slice populated, so it cannot express "the caller did
 * not ask for this", and the falsy face is the dangerous one: a restored-over
 * `sorting: []` reads as a deliberate empty sort.
 *
 * Excluded from **both** directions, not just restore. A controlled slice is the
 * caller's value; persistence neither overwrites it nor writes it out, so that
 * "the caller owns this slice" is one rule rather than two half-rules.
 */
export function persistedSlicesFor(
  config: DataTablePersistenceConfig,
  controlledSlices: ReadonlySet<DataTableSlice>
): readonly DataTablePersistableSlice[] {
  const requested = config.include ?? DATA_TABLE_DEFAULT_PERSISTED_SLICES;

  return DATA_TABLE_PERSISTABLE_SLICES.filter(
    (slice) => requested.includes(slice) && !controlledSlices.has(slice)
  );
}

/**
 * Of the managed slices, the ones persistence may **restore into**.
 *
 * `ui-spec/components/data-grid/behavior.md:71` — a **Target P0** precedence
 * clause — reads "persistence restores only uncontrolled slices absent from
 * `defaultState`". So a slice the caller pinned with `defaultState` is off limits
 * to a restore: the ladder is `state` > `defaultState` > config defaults, and a
 * stored payload sits below all three.
 *
 * **`controlledSlices` and `defaultedSlices` are excluded for different spans, and
 * collapsing them into one set is wrong in a way that would gut the feature.**
 *
 *  - A **controlled** slice is the caller's value for the life of the table, so
 *    persistence neither restores into it nor writes it out.
 *  - A **`defaultState`** slice is only the caller's *initial* value. After mount
 *    it is ordinary uncontrolled state that a user can change — and those changes
 *    must still be persisted. A caller who sets
 *    `defaultState: { columnSizing: … }` and thereby loses width persistence
 *    altogether would have lost the main use case for the feature.
 *
 * Hence two sets with two different effects, rather than one "pinned" set:
 * `defaultState` narrows **restore only**, `state` narrows restore **and** write.
 */
export function restorableSlicesFor(
  config: DataTablePersistenceConfig,
  controlledSlices: ReadonlySet<DataTableSlice>,
  defaultedSlices: ReadonlySet<DataTableSlice>
): readonly DataTablePersistableSlice[] {
  return persistedSlicesFor(config, controlledSlices).filter(
    (slice) => !defaultedSlices.has(slice)
  );
}

/**
 * The payload for the current state of the managed slices.
 *
 * **Iterates the canonical order rather than the `slices` argument**, so the
 * bytes are a pure function of the *values* and not of how the caller happened to
 * order its include list. That guarantee belongs here, in the function that
 * produces the payload, rather than in whichever caller supplies the list: the
 * change detection in `useDataTablePersistence` compares serialized payloads, so
 * an order-sensitive encoder writes on every mount for a caller who listed the
 * same slices differently — a permanent write loop against a caller's storage,
 * with nothing rendered to show it. Found by the test that asserts the two orders
 * agree, which failed against the argument-order version.
 */
export function persistenceEnvelopeFor<RowId extends string>(
  version: number,
  slices: readonly DataTablePersistableSlice[],
  state: DataTableState<RowId>
): DataTablePersistenceEnvelope {
  const persisted: Record<string, SerializableValue> = {};
  for (const slice of DATA_TABLE_PERSISTABLE_SLICES) {
    if (!slices.includes(slice)) {
      continue;
    }
    const value = state[slice];
    // `globalFilter` is the one optional slice; an absent value is not `null`.
    if (value === undefined) {
      continue;
    }
    persisted[slice] = value as SerializableValue;
  }

  return { version, state: persisted };
}

export interface DataTablePersistenceInput<RowId extends string = string> {
  readonly config: DataTablePersistenceConfig | undefined;
  readonly state: DataTableState<RowId>;
  /**
   * The engine's leaf column ids, read **lazily**. The column model exists only
   * once the engine does, and this is called inside an effect for that reason.
   */
  readonly columnIds: () => readonly string[];
  /** See `persistedSlicesFor`. Derived from the caller's `state` prop, never from resolved state. */
  readonly controlledSlices: ReadonlySet<DataTableSlice>;
  /** See `restorableSlicesFor`. Derived from the caller's `defaultState` prop. */
  readonly defaultedSlices: ReadonlySet<DataTableSlice>;
  readonly requestChange: <Slice extends DataTableSlice>(
    slice: Slice,
    value: DataTableSliceValue<Slice, RowId>,
    cause?: DataTableChangeCause
  ) => unknown;
}

/** `key`, `version` and `storage` are what make a config usable (design §8). */
function usableConfig(
  config: DataTablePersistenceConfig | undefined
): DataTablePersistenceConfig | undefined {
  return config !== undefined &&
    typeof config.key === 'string' &&
    config.key !== '' &&
    isFiniteNumber(config.version) &&
    config.storage !== undefined
    ? config
    : undefined;
}

function isPromise<Value>(value: unknown): value is Promise<Value> {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Promise<Value>).then === 'function'
  );
}

/**
 * Persistence, as one hook: restore once on mount, then write whenever a managed
 * slice changes.
 *
 * **Invoked from `effects`, which is the only contribution point that can host
 * it.** `engineOptions` and `renderContext` run during the controller's render,
 * so reading storage or dispatching a slice change from either would be a side
 * effect in a render path.
 *
 * Three ordering properties, each earned:
 *
 *  - **Restore lands after the column model normalizes and before interaction**
 *    (design §6.13, `behavior.md:454-458`). Both halves come from being in a
 *    mount effect: the column model exists by then, so `columnIds()` can prune
 *    against it, and the effect flushes before a user can act.
 *  - **Nothing is written before the restore attempt settles.** Otherwise the
 *    mount write clobbers the stored payload with defaults *before* it is read,
 *    and persistence deletes exactly what it exists to keep. The gate is a
 *    `useState` flag rather than a ref on purpose: a ref flipped inside the
 *    restore effect is already `true` when the save effect runs later in the
 *    **same** flush, which is a one-line difference that silently reintroduces
 *    the clobber.
 *  - **A restore itself writes nothing.** The first snapshot observed after
 *    restore is adopted as the baseline, so `write` fires only for a change a
 *    caller or a user actually made. That is what makes the rule statable in one
 *    sentence — and storage writes are not visible in the DOM, so a rule nobody
 *    can state is a rule no test checks.
 *
 * **SSR** needs no guard: every storage touch is inside an effect, and effects do
 * not run during server rendering. A caller's adapter is never invoked on the
 * server, so it may close over `localStorage` freely.
 */
export function useDataTablePersistence<RowId extends string = string>(
  input: DataTablePersistenceInput<RowId>
): void {
  const config = usableConfig(input.config);
  const enabled = config !== undefined;

  // Every effect below reads through this ref rather than through its own
  // closure. `effects` runs during the controller's render, so a value captured
  // in this function body belongs to *that* render — and `requestChange` is
  // rebuilt whenever the state snapshot changes, so the captured one would
  // request against a stale snapshot for the life of the table.
  const latest = useRef(input);
  latest.current = input;

  const [restoreSettled, setRestoreSettled] = useState(false);
  const startedRef = useRef(false);
  const writtenRef = useRef<string | undefined>(undefined);

  const key = config?.key;
  const version = config?.version;

  useEffect(() => {
    if (!enabled || startedRef.current) {
      return;
    }
    startedRef.current = true;
    let cancelled = false;

    const report = (error: unknown) => {
      const onError = latest.current.config?.onError;
      if (onError !== undefined) {
        onError(error);

        return;
      }
      /* c8 ignore next 5 -- the dev fallback for a caller with no `onError`. */
      if (process.env.NODE_ENV !== 'production') {
        console.error(
          'DataTable persistence could not restore stored preferences.',
          error
        );
      }
    };

    const settle = () => {
      if (!cancelled) {
        setRestoreSettled(true);
      }
    };

    const apply = (raw: string | null) => {
      if (cancelled) {
        return;
      }
      // Nothing stored is the ordinary first-visit path, not an error.
      if (raw === null) {
        settle();

        return;
      }
      const current = latest.current;
      const activeConfig = usableConfig(current.config);
      /* c8 ignore next 5 -- an async read whose config was removed mid-flight. */
      if (activeConfig === undefined) {
        settle();

        return;
      }

      let plan;
      try {
        const known = new Set(current.columnIds());
        plan = planDataTableRestore({
          raw,
          config: activeConfig,
          // `restorable`, not `persisted`: the write set is wider, because a
          // `defaultState` slice is excluded from a restore but still saved.
          slices: restorableSlicesFor(
            activeConfig,
            current.controlledSlices,
            current.defaultedSlices
          ),
          isKnownColumn: (id) => known.has(id),
        });
      } catch (error) {
        // A caller `migrate` that throws lands here, as does malformed JSON.
        report(error);
        settle();

        return;
      }

      if (plan === undefined) {
        report(
          new Error(
            `DataTable persistence discarded the payload stored under "${activeConfig.key}": it is not a valid envelope for version ${String(activeConfig.version)}.`
          )
        );
        settle();

        return;
      }

      // Sequential requests accumulate correctly: the controller's
      // `requestChange` folds each into its own running snapshot and each
      // `setUncontrolledState` merges its slice into the previous value, so
      // restoring four slices in one flush does not lose three of them.
      for (const entry of plan.entries) {
        current.requestChange(
          entry.slice,
          entry.value as DataTableSliceValue<DataTableSlice, RowId>,
          'restore'
        );
      }
      settle();
    };

    try {
      const read = latest.current.config!.storage!.read(key!);
      if (isPromise<string | null>(read)) {
        read.then(apply).catch((error: unknown) => {
          report(error);
          settle();
        });
      } else {
        apply(read);
      }
    } catch (error) {
      report(error);
      settle();
    }

    return () => {
      cancelled = true;
    };
    // `key` alone: a table does not re-restore because its state changed, and
    // `startedRef` makes the once-per-table guarantee independent of that anyway.
  }, [enabled, key]);

  const payload =
    enabled && version !== undefined
      ? JSON.stringify(
          persistenceEnvelopeFor(
            version,
            persistedSlicesFor(config, input.controlledSlices),
            input.state
          )
        )
      : undefined;

  useEffect(() => {
    if (!restoreSettled || payload === undefined) {
      return;
    }
    // The first snapshot after the restore attempt is the baseline, not a write:
    // a restore must not write back what it just read.
    if (writtenRef.current === undefined) {
      writtenRef.current = payload;

      return;
    }
    if (writtenRef.current === payload) {
      return;
    }
    writtenRef.current = payload;

    const current = latest.current;
    try {
      const written = current.config!.storage!.write(
        current.config!.key!,
        payload
      );
      if (isPromise(written)) {
        written.catch((error: unknown) => current.config?.onError?.(error));
      }
    } catch (error) {
      current.config?.onError?.(error);
    }
  }, [payload, restoreSettled]);
}

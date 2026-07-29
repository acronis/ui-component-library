import { useEffect, useState } from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { DataTableSlice, DataTableState } from '../data-table-contract';
import {
  DATA_TABLE_DEFAULT_PERSISTED_SLICES,
  persistedSlicesFor,
  persistenceEnvelopeFor,
  planDataTableRestore,
  restorableSlicesFor,
  useDataTablePersistence,
} from '../data-table-persistence';
import type {
  DataTablePersistableSlice,
  DataTablePersistenceConfig,
  DataTablePersistenceStorage,
} from '../data-table-features/persistence';
import { createDefaultDataTableState } from '../data-table-state';

// U10's engine. The DataGrid config prop that feeds it is covered by
// `data-grid/__tests__/data-grid-persistence.test.tsx`; this file is the
// mechanics — the envelope, migration, validation, pruning, exclusion, and the
// write discipline.
//
// **Storage writes are the observable that is not in the DOM.** Nothing rendered
// distinguishes a correct restore from one that also wrote back what it just
// read, or from one that clobbered storage on mount before reading it. So every
// write assertion below is on the recorded calls, and the counts are asserted
// exactly rather than with `toHaveBeenCalled`.

const KNOWN_COLUMNS = ['name', 'email', 'role'];
const isKnownColumn = (id: string) => KNOWN_COLUMNS.includes(id);

function envelope(
  version: number,
  state: Readonly<Partial<Record<DataTablePersistableSlice, unknown>>>
): string {
  return JSON.stringify({ version, state });
}

function configFor(
  overrides: Partial<DataTablePersistenceConfig> = {}
): DataTablePersistenceConfig {
  return {
    key: 'grid-prefs',
    version: 2,
    storage: memoryStorage(),
    ...overrides,
  };
}

interface MemoryStorage extends DataTablePersistenceStorage {
  readonly writes: { key: string; value: string }[];
}

function memoryStorage(initial?: string, async = false): MemoryStorage {
  const writes: { key: string; value: string }[] = [];
  let stored = initial ?? null;

  return {
    writes,
    read: () => (async ? Promise.resolve(stored) : stored),
    write: (key, value) => {
      stored = value;
      writes.push({ key, value });
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                     The restore plan — a pure function                     */
/* -------------------------------------------------------------------------- */

describe('planDataTableRestore', () => {
  const slices = [...DATA_TABLE_DEFAULT_PERSISTED_SLICES];

  it('restores the stored column slices at a matching version', () => {
    const plan = planDataTableRestore({
      raw: envelope(2, {
        columnVisibility: { email: false },
        columnSizing: { name: 240 },
      }),
      config: configFor(),
      slices,
      isKnownColumn,
    });

    expect(plan?.entries).toEqual([
      { slice: 'columnVisibility', value: { email: false } },
      { slice: 'columnSizing', value: { name: 240 } },
    ]);
  });

  it('discards an unknown column id and keeps the known ones in the SAME slice', () => {
    // The discriminating case for `behavior.md:466`. An implementation that
    // throws away the whole slice on an unknown id also makes the unknown column
    // disappear, so a test that only checked for its absence would pass against
    // it. Two ids in one slice is what separates the two.
    const plan = planDataTableRestore({
      raw: envelope(2, {
        columnVisibility: { email: false, deletedColumn: false },
        columnOrder: ['role', 'goneColumn', 'name'],
      }),
      config: configFor(),
      slices,
      isKnownColumn,
    });

    expect(plan?.entries).toEqual([
      { slice: 'columnVisibility', value: { email: false } },
      { slice: 'columnOrder', value: ['role', 'name'] },
    ]);
  });

  it('discards a corrupt slice whole, and keeps its valid neighbours', () => {
    // The other half of the same distinction: a wrong *type* is not schema
    // evolution, it is a payload this library never wrote.
    const plan = planDataTableRestore({
      raw: envelope(2, {
        columnSizing: { name: 'wide' },
        columnVisibility: { email: false },
      }),
      config: configFor(),
      slices,
      isKnownColumn,
    });

    expect(plan?.entries).toEqual([
      { slice: 'columnVisibility', value: { email: false } },
    ]);
  });

  it('ignores a stored slice the include set does not name', () => {
    const plan = planDataTableRestore({
      raw: envelope(2, { sorting: [{ id: 'name', desc: true }] }),
      config: configFor(),
      slices,
      isKnownColumn,
    });

    expect(plan?.entries).toEqual([]);
  });

  it('restores an opted-in slice, pruned the same way', () => {
    const plan = planDataTableRestore({
      raw: envelope(2, {
        sorting: [
          { id: 'goneColumn', desc: true },
          { id: 'name', desc: true },
        ],
      }),
      config: configFor({ include: ['sorting'] }),
      slices: ['sorting'],
      isKnownColumn,
    });

    expect(plan?.entries).toEqual([
      { slice: 'sorting', value: [{ id: 'name', desc: true }] },
    ]);
  });

  it('discards a version mismatch when no migration is supplied', () => {
    expect(
      planDataTableRestore({
        raw: envelope(1, { columnVisibility: { email: false } }),
        config: configFor(),
        slices,
        isKnownColumn,
      })
    ).toBeUndefined();
  });

  it('runs a migration for a version mismatch and restores its output', () => {
    const migrate = vi.fn((stored: unknown, fromVersion: number) => ({
      version: 2,
      state: {
        // v1 stored a hidden-column *list*; v2 stores a visibility record.
        columnVisibility: Object.fromEntries(
          ((stored as { state: { hidden: string[] } }).state.hidden ?? []).map(
            (id) => [id, false]
          )
        ),
        migratedFrom: fromVersion,
      },
    }));

    const plan = planDataTableRestore({
      raw: envelope(1, { hidden: ['email'] } as never),
      config: configFor({ migrate }),
      slices,
      isKnownColumn,
    });

    expect(migrate).toHaveBeenCalledTimes(1);
    expect(migrate.mock.calls[0]?.[1]).toBe(1);
    expect(plan?.entries).toEqual([
      { slice: 'columnVisibility', value: { email: false } },
    ]);
  });

  it('does not migrate when the version already matches', () => {
    const migrate = vi.fn(() => ({ version: 2, state: {} }));

    planDataTableRestore({
      raw: envelope(2, { columnVisibility: { email: false } }),
      config: configFor({ migrate }),
      slices,
      isKnownColumn,
    });

    expect(migrate).not.toHaveBeenCalled();
  });

  it('discards a migration that does not return an envelope', () => {
    expect(
      planDataTableRestore({
        raw: envelope(1, { columnVisibility: { email: false } }),
        config: configFor({ migrate: () => 'not an envelope' }),
        slices,
        isKnownColumn,
      })
    ).toBeUndefined();
  });

  it.each([
    ['unparseable JSON', '{ not json'],
    ['a non-object payload', '"just a string"'],
    ['a payload with no version', JSON.stringify({ state: {} })],
    ['a payload with no state', JSON.stringify({ version: 2 })],
  ])('discards %s without throwing', (_label, raw) => {
    let plan;
    expect(() => {
      plan = planDataTableRestore({
        raw,
        config: configFor(),
        slices,
        isKnownColumn,
      });
    }).not.toThrow();
    expect(plan).toBeUndefined();
  });

  it('distinguishes an unusable payload from a payload with nothing applicable', () => {
    // `undefined` and `{ entries: [] }` are different answers: the first is an
    // error to report through `onError`, the second is a valid payload that
    // happened to hold nothing this table persists. Collapsing them makes the
    // ordinary "stored under a different include set" case look like corruption.
    const unusable = planDataTableRestore({
      raw: '{ not json',
      config: configFor(),
      slices,
      isKnownColumn,
    });
    const empty = planDataTableRestore({
      raw: envelope(2, {}),
      config: configFor(),
      slices,
      isKnownColumn,
    });

    expect(unusable).toBeUndefined();
    expect(empty).toEqual({ entries: [] });
  });

  it('validates every slice reader against a wrong-typed payload', () => {
    // Each reader gets its own corrupt shape, so a reader that forgot to validate
    // shows up here rather than as a rendering oddity somewhere downstream.
    const corrupt: Record<DataTablePersistableSlice, unknown> = {
      columnVisibility: ['email'],
      columnOrder: { name: true },
      columnSizing: { name: 'wide' },
      columnPinning: { left: ['name'] },
      sorting: [{ id: 'name' }],
      columnFilters: [{ operator: 'eq', value: 1 }],
      // `globalFilter` accepts any JSON value by design — it has no schema.
      globalFilter: undefined,
      grouping: [7],
      pagination: { pageIndex: 0, pageSize: 0 },
    };

    for (const [slice, value] of Object.entries(corrupt)) {
      if (slice === 'globalFilter') {
        continue;
      }
      const plan = planDataTableRestore({
        raw: envelope(2, { [slice]: value }),
        config: configFor({ include: [slice as DataTablePersistableSlice] }),
        slices: [slice as DataTablePersistableSlice],
        isKnownColumn,
      });

      expect(plan, `${slice} accepted a corrupt payload`).toEqual({
        entries: [],
      });
    }
  });

  it('keeps a valid payload for every slice reader', () => {
    // The positive twin of the check above. Without it, a reader that rejects
    // *everything* would pass the corruption test perfectly.
    const valid: Record<DataTablePersistableSlice, unknown> = {
      columnVisibility: { email: false },
      columnOrder: ['role', 'name'],
      columnSizing: { name: 240 },
      columnPinning: { left: ['name'], right: [] },
      sorting: [{ id: 'name', desc: true }],
      columnFilters: [{ id: 'role', operator: 'eq', value: 'admin' }],
      globalFilter: 'needle',
      grouping: ['role'],
      pagination: { pageIndex: 3, pageSize: 25 },
    };

    for (const [slice, value] of Object.entries(valid)) {
      const plan = planDataTableRestore({
        raw: envelope(2, { [slice]: value }),
        config: configFor({ include: [slice as DataTablePersistableSlice] }),
        slices: [slice as DataTablePersistableSlice],
        isKnownColumn,
      });

      expect(plan?.entries, `${slice} rejected a valid payload`).toHaveLength(
        1
      );
    }
  });
});

/* -------------------------------------------------------------------------- */
/*                       Which slices persistence manages                     */
/* -------------------------------------------------------------------------- */

describe('persistedSlicesFor', () => {
  const none = new Set<DataTableSlice>();

  it('defaults to the four column slices and nothing else', () => {
    expect(persistedSlicesFor(configFor(), none)).toEqual([
      'columnVisibility',
      'columnOrder',
      'columnSizing',
      'columnPinning',
    ]);
  });

  it('leaves live row state and the page index out of the default', () => {
    // design §5.2 / `behavior.md:471-476`. The compile-time half of this rule is
    // `_AssertNoRowStatePersisted`, which makes the row-keyed slices unnameable;
    // this covers `pagination`, which is nameable but not default.
    expect(persistedSlicesFor(configFor(), none)).not.toContain('pagination');
  });

  it('excludes a controlled slice from the managed set', () => {
    expect(
      persistedSlicesFor(
        configFor({ include: ['sorting', 'columnVisibility'] }),
        new Set<DataTableSlice>(['sorting'])
      )
    ).toEqual(['columnVisibility']);
  });

  it('narrows the RESTORE set by defaultState but not the WRITE set', () => {
    // `data-grid/behavior.md:71` (Target P0): "persistence restores only
    // uncontrolled slices absent from `defaultState`".
    //
    // The discriminating pair. A version that folded `defaultState` into
    // `controlledSlices` would pass any restore-side assertion and then silently
    // stop persisting the slice forever — so the two are asserted to *disagree*
    // on the same input, which is the only thing that separates them.
    const config = configFor({ include: ['columnSizing', 'columnVisibility'] });
    const defaulted = new Set<DataTableSlice>(['columnSizing']);

    expect(
      restorableSlicesFor(config, none, defaulted),
      'a defaultState slice must not be restored into'
    ).toEqual(['columnVisibility']);
    expect(
      persistedSlicesFor(config, none),
      'a defaultState slice must still be written — after mount it is ordinary state'
    ).toEqual(['columnVisibility', 'columnSizing']);
  });

  it('excludes a controlled slice from BOTH sets', () => {
    const config = configFor({ include: ['sorting', 'columnVisibility'] });
    const controlled = new Set<DataTableSlice>(['sorting']);

    expect(restorableSlicesFor(config, controlled, none)).toEqual([
      'columnVisibility',
    ]);
    expect(persistedSlicesFor(config, controlled)).toEqual([
      'columnVisibility',
    ]);
  });

  it('canonicalizes order and dedupes, so the payload depends only on values', () => {
    // Two callers listing the same slices in different order must produce
    // byte-identical storage; otherwise change detection sees a difference on
    // every mount for one of them and writes forever.
    const forward = persistedSlicesFor(
      configFor({ include: ['columnSizing', 'columnVisibility'] }),
      none
    );
    const reverse = persistedSlicesFor(
      configFor({
        include: ['columnVisibility', 'columnSizing', 'columnSizing'],
      }),
      none
    );

    expect(forward).toEqual(['columnVisibility', 'columnSizing']);
    expect(reverse).toEqual(forward);
  });
});

describe('persistenceEnvelopeFor', () => {
  it('writes only the managed slices, in canonical order', () => {
    const state = createDefaultDataTableState({
      columnVisibility: { email: false },
      columnSizing: { name: 240 },
      sorting: [{ id: 'name', desc: true }],
    });

    expect(
      JSON.stringify(
        persistenceEnvelopeFor(2, ['columnSizing', 'columnVisibility'], state)
      )
    ).toBe(
      JSON.stringify(
        persistenceEnvelopeFor(2, ['columnVisibility', 'columnSizing'], state)
      )
    );
    expect(persistenceEnvelopeFor(2, ['columnVisibility'], state)).toEqual({
      version: 2,
      state: { columnVisibility: { email: false } },
    });
  });

  it('omits an absent optional slice rather than storing null', () => {
    const state = createDefaultDataTableState({ globalFilter: undefined });

    expect(
      persistenceEnvelopeFor(2, ['globalFilter'], state).state
    ).not.toHaveProperty('globalFilter');
  });
});

/* -------------------------------------------------------------------------- */
/*                    The hook — ordering and write discipline                */
/* -------------------------------------------------------------------------- */

interface HarnessProps {
  readonly config: DataTablePersistenceConfig | undefined;
  readonly controlledSlices?: ReadonlySet<DataTableSlice>;
  readonly defaultedSlices?: ReadonlySet<DataTableSlice>;
  readonly onRequest?: (slice: DataTableSlice, value: unknown) => void;
}

/**
 * The handle a test uses to change a slice after mount.
 *
 * A mutable **property** assigned inside an effect, not an outer variable
 * reassigned during render: `react-hooks/globals` rejects the latter, and it is
 * right to — a render-phase write to module scope is a side effect whose timing
 * depends on when React happens to re-render.
 */
const mutator: { apply: (state: Partial<DataTableState>) => void } = {
  apply: () => {},
};

/**
 * A stand-in for the controller: it owns the state, records every request, and
 * mirrors the one controller behaviour that matters here — a controlled slice
 * requests but does not commit (`data-table-controller.ts:599-613`).
 */
function Harness({
  config,
  controlledSlices,
  defaultedSlices,
  onRequest,
}: HarnessProps) {
  const controlled = controlledSlices ?? new Set<DataTableSlice>();
  const [state, setState] = useState<DataTableState>(() =>
    createDefaultDataTableState()
  );
  useEffect(() => {
    mutator.apply = (next) =>
      setState((previous) => ({ ...previous, ...next }));
  });

  useDataTablePersistence({
    config,
    state,
    columnIds: () => KNOWN_COLUMNS,
    controlledSlices: controlled,
    defaultedSlices: defaultedSlices ?? new Set<DataTableSlice>(),
    requestChange: (slice, value) => {
      onRequest?.(slice, value);
      if (!controlled.has(slice)) {
        setState((previous) => ({ ...previous, [slice]: value }));
      }

      return undefined;
    },
  });

  return null;
}

describe('useDataTablePersistence', () => {
  it('restores stored hidden columns and widths on mount, before interaction', () => {
    // `behavior.md:454-458` — legacy parity. "Before interaction" is a property of
    // being in a mount effect: this assertion runs after render with no event
    // dispatched at all.
    const onRequest = vi.fn();
    render(
      <Harness
        config={configFor({
          storage: memoryStorage(
            envelope(2, {
              columnVisibility: { email: false },
              columnSizing: { name: 240 },
            })
          ),
        })}
        onRequest={onRequest}
      />
    );

    expect(onRequest.mock.calls).toEqual([
      ['columnVisibility', { email: false }],
      ['columnSizing', { name: 240 }],
    ]);
  });

  it('never requests a controlled slice — the assertion is silence', () => {
    // `behavior.md:467`, and the reason this is a callback assertion rather than a
    // rendered one: the controller declines to *commit* a controlled slice
    // already, so a version that restored into it anyway would still render the
    // caller's value. What it would also do is fire `onStateChange` with cause
    // `restore`, which a controlled caller applies — that is the overwrite. The
    // only thing that separates correct from convincing-but-wrong is whether the
    // request happens at all.
    const onRequest = vi.fn();
    render(
      <Harness
        config={configFor({
          include: ['sorting', 'columnVisibility'],
          storage: memoryStorage(
            envelope(2, {
              sorting: [{ id: 'name', desc: true }],
              columnVisibility: { email: false },
            })
          ),
        })}
        controlledSlices={new Set<DataTableSlice>(['sorting'])}
        onRequest={onRequest}
      />
    );

    expect(onRequest.mock.calls).toEqual([
      ['columnVisibility', { email: false }],
    ]);
  });

  it('does not restore a defaultState slice, but still saves it afterwards', () => {
    // The end-to-end form of the precedence clause, and the case a single "pinned"
    // set gets wrong: no restore, then a real write once the user changes it.
    const onRequest = vi.fn();
    const storage = memoryStorage(
      envelope(2, {
        columnSizing: { name: 240 },
        columnVisibility: { email: false },
      })
    );
    render(
      <Harness
        config={configFor({ storage })}
        defaultedSlices={new Set<DataTableSlice>(['columnSizing'])}
        onRequest={onRequest}
      />
    );

    expect(onRequest.mock.calls).toEqual([
      ['columnVisibility', { email: false }],
    ]);

    act(() => mutator.apply({ columnSizing: { name: 400 } }));

    expect(storage.writes).toHaveLength(1);
    expect(JSON.parse(storage.writes[0]!.value).state.columnSizing).toEqual({
      name: 400,
    });
  });

  it('writes nothing on mount, and nothing for the restore itself', () => {
    // Two failures at once, neither visible in a DOM. A mount write *before* the
    // read deletes the payload persistence exists to keep; a write of the
    // restored value is harmless but makes "one change, one write" unstateable.
    const storage = memoryStorage(
      envelope(2, { columnVisibility: { email: false } })
    );
    render(<Harness config={configFor({ storage })} />);

    expect(storage.writes).toEqual([]);
  });

  it('writes exactly once for one change after the restore settles', () => {
    const storage = memoryStorage(
      envelope(2, { columnVisibility: { email: false } })
    );
    render(<Harness config={configFor({ storage })} />);

    act(() => mutator.apply({ columnSizing: { name: 320 } }));

    expect(storage.writes).toHaveLength(1);
    expect(JSON.parse(storage.writes[0]!.value)).toEqual({
      version: 2,
      state: {
        columnVisibility: { email: false },
        columnOrder: [],
        columnSizing: { name: 320 },
        columnPinning: { left: [], right: [] },
      },
    });
    expect(storage.writes[0]!.key).toBe('grid-prefs');
  });

  it('does not write again when a change leaves the managed slices identical', () => {
    const storage = memoryStorage();
    render(<Harness config={configFor({ storage })} />);

    // `selection` is not persistable at all, so it cannot enter the payload.
    act(() => mutator.apply({ selection: new Set(['row-1']) }));

    expect(storage.writes).toEqual([]);
  });

  it('does not write a controlled slice either', () => {
    // The exclusion is one rule in both directions: a controlled slice is the
    // caller's, so persistence neither restores into it nor stores it.
    const storage = memoryStorage();
    render(
      <Harness
        config={configFor({
          include: ['sorting', 'columnVisibility'],
          storage,
        })}
        controlledSlices={new Set<DataTableSlice>(['sorting'])}
      />
    );

    act(() => mutator.apply({ columnVisibility: { email: false } }));

    expect(storage.writes).toHaveLength(1);
    expect(JSON.parse(storage.writes[0]!.value).state).toEqual({
      columnVisibility: { email: false },
    });
  });

  it('restores from an async storage adapter', async () => {
    const onRequest = vi.fn();
    render(
      <Harness
        config={configFor({
          storage: memoryStorage(
            envelope(2, { columnVisibility: { email: false } }),
            true
          ),
        })}
        onRequest={onRequest}
      />
    );

    await waitFor(() =>
      expect(onRequest.mock.calls).toEqual([
        ['columnVisibility', { email: false }],
      ])
    );
  });

  it('reports a corrupt payload through onError and restores nothing', () => {
    const onError = vi.fn();
    const onRequest = vi.fn();
    render(
      <Harness
        config={configFor({ onError, storage: memoryStorage('{ not json') })}
        onRequest={onRequest}
      />
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onRequest).not.toHaveBeenCalled();
  });

  it('reports a throwing storage adapter and still settles', () => {
    const onError = vi.fn();
    const storage: DataTablePersistenceStorage = {
      read: () => {
        throw new Error('storage unavailable');
      },
      write: vi.fn(),
    };
    render(<Harness config={configFor({ onError, storage })} />);

    expect(onError).toHaveBeenCalledTimes(1);
    // Settling despite the failure is what lets a later change still be saved;
    // a table whose storage read failed is not a table that stops working.
    act(() => mutator.apply({ columnVisibility: { email: false } }));
    expect(storage.write).toHaveBeenCalledTimes(1);
  });

  it('reports a throwing migration rather than letting it escape the effect', () => {
    const onError = vi.fn();
    render(
      <Harness
        config={configFor({
          onError,
          migrate: () => {
            throw new Error('migration failed');
          },
          storage: memoryStorage(
            envelope(1, { columnVisibility: { email: false } })
          ),
        })}
      />
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect((onError.mock.calls[0]?.[0] as Error).message).toBe(
      'migration failed'
    );
  });

  it('reports nothing and touches no storage when there is nothing stored', () => {
    const onError = vi.fn();
    const storage = memoryStorage();
    render(<Harness config={configFor({ onError, storage })} />);

    // A first visit is the ordinary path, not an error to report.
    expect(onError).not.toHaveBeenCalled();
    expect(storage.writes).toEqual([]);
  });

  it('touches no storage during server rendering', async () => {
    // Design §6.13's SSR clause. The engine has **no** `typeof window` guard, and
    // the claim that it needs none — every storage touch is inside an effect, and
    // effects do not run on the server — was a comment until this test. A comment
    // is not a check, and this one is cheap: `renderToString` exercises the real
    // code path with the real adapter.
    const { renderToString } = await import('react-dom/server');
    const onError = vi.fn();
    const onRequest = vi.fn();
    const storage = memoryStorage(
      envelope(2, { columnVisibility: { email: false } })
    );
    const read = vi.spyOn(storage, 'read');

    const html = renderToString(
      <Harness config={configFor({ onError, storage })} onRequest={onRequest} />
    );

    expect(html).toBe('');
    expect(read).not.toHaveBeenCalled();
    expect(storage.writes).toEqual([]);
    expect(onRequest).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('is inert without key, version or storage', () => {
    // §8 makes all three required at the DataGrid layer; the DataTable interface
    // keeps them optional so the controller's options union can name it. A
    // partially-configured direct caller gets nothing rather than a crash.
    const onRequest = vi.fn();
    for (const config of [
      undefined,
      { version: 2, storage: memoryStorage() },
      { key: 'k', storage: memoryStorage() },
      { key: 'k', version: 2 },
      { key: '', version: 2, storage: memoryStorage() },
    ] as (DataTablePersistenceConfig | undefined)[]) {
      const view = render(<Harness config={config} onRequest={onRequest} />);
      view.unmount();
    }

    expect(onRequest).not.toHaveBeenCalled();
  });
});

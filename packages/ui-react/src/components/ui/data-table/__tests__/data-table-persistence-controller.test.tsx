import { act, renderHook } from '@testing-library/react';
import type { ColumnDef } from '@tanstack/react-table';
import { describe, expect, it, vi } from 'vitest';

import type {
  DataTableChangeEvent,
  DataTableSlice,
} from '../data-table-contract';
import {
  useDataTable,
  type DataTableControllerOptions,
} from '../data-table-controller';
import type { DataTablePersistenceStorage } from '../data-table-features/persistence';

// U10, through a **direct `useDataTable` caller** rather than through DataGrid.
//
// This layer is where `ui-spec/components/data-table/behavior.md:454-476` places
// its guarantees, so a DataGrid-only test would leave the layer that *owes* them
// unverified. `data-table-persistence.test.tsx` covers the engine's mechanics in
// isolation; this file covers the wiring — that the feature module reaches the
// engine, that the controller's `gates.controlledSlices`/`defaultedSlices` carry
// the caller's intent, and that a restore actually lands in controller state.

interface Person {
  id: string;
  name: string;
  email: string;
  role: string;
}

const columns: ColumnDef<Person, unknown>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
  { id: 'email', accessorKey: 'email', header: 'Email' },
  { id: 'role', accessorKey: 'role', header: 'Role' },
];

const data: Person[] = [
  { id: 'p1', name: 'Ada', email: 'ada@example.com', role: 'admin' },
  { id: 'p2', name: 'Grace', email: 'grace@example.com', role: 'user' },
];

function envelope(version: number, state: Record<string, unknown>): string {
  return JSON.stringify({ version, state });
}

function storageWith(initial?: string) {
  const writes: string[] = [];
  let stored = initial ?? null;
  const storage: DataTablePersistenceStorage = {
    read: () => stored,
    write: (_key, value) => {
      stored = value;
      writes.push(value);
    },
  };

  return { storage, writes };
}

function renderController(
  options: Partial<DataTableControllerOptions<Person>> & {
    persistence: DataTableControllerOptions<Person>['persistence'];
  }
) {
  const events: DataTableChangeEvent<DataTableSlice, unknown>[] = [];
  const onStateChange = vi.fn(
    (event: DataTableChangeEvent<DataTableSlice, unknown>) => {
      events.push(event);
    }
  );
  const view = renderHook(() =>
    useDataTable<Person>({
      columns,
      data,
      getRowId: (row) => row.id,
      onStateChange,
      ...options,
    } as DataTableControllerOptions<Person>)
  );

  return { ...view, events, onStateChange };
}

describe('persistence through a direct useDataTable caller', () => {
  it('restores hidden columns and widths before any interaction', () => {
    // `behavior.md:454-458` — the legacy-parity clause, at the layer that owes it.
    // Nothing is dispatched between render and assertion, which is what "before
    // interaction" means for a mount effect.
    const { storage } = storageWith(
      envelope(2, {
        columnVisibility: { email: false },
        columnSizing: { name: 240 },
      })
    );
    const { result } = renderController({
      persistence: { key: 'k', version: 2, storage },
    });

    expect(result.current.getState().columnVisibility).toEqual({
      email: false,
    });
    expect(result.current.getState().columnSizing).toEqual({ name: 240 });
    // And it reached the engine, not just the state store.
    expect(result.current.table.getState().columnVisibility).toEqual({
      email: false,
    });
  });

  it('reports the restore with cause "restore"', () => {
    // `'restore'` has been a first-class `DataTableChangeCause` that nothing
    // emitted since F1. This is the first emitter, so assert the cause rather
    // than assuming the enum member is self-justifying.
    const { storage } = storageWith(
      envelope(2, { columnVisibility: { email: false } })
    );
    const { events } = renderController({
      persistence: { key: 'k', version: 2, storage },
    });

    expect(events.map((event) => [event.slice, event.cause])).toEqual([
      ['columnVisibility', 'restore'],
    ]);
  });

  it('does NOT overwrite a controlled slice, and stays silent about it', () => {
    // `behavior.md:462-468`, the clause `gates.controlledSlices` exists for.
    //
    // **The assertion has to be silence.** The controller already declines to
    // *commit* a controlled slice, so a version that requested the change anyway
    // would leave `getState().sorting` looking perfectly correct — and would fire
    // `onStateChange` with cause `restore`, which a controlled caller applies.
    // That emission is the overwrite. Nothing rendered distinguishes the two.
    const { storage } = storageWith(
      envelope(2, { sorting: [{ id: 'email', desc: true }] })
    );
    const { result, events } = renderController({
      state: { sorting: [{ id: 'name', desc: false }] },
      persistence: {
        key: 'k',
        version: 2,
        storage,
        include: ['sorting'],
      },
    });

    expect(
      events.filter((event) => event.slice === 'sorting'),
      'a controlled slice must not even be requested'
    ).toEqual([]);
    expect(result.current.getState().sorting).toEqual([
      { id: 'name', desc: false },
    ]);
  });

  it('does not restore a defaultState slice, but still saves later changes to it', () => {
    // `data-grid/behavior.md:71` (Target P0), through the controller. The second
    // half is what separates `defaultedSlices` from `controlledSlices`: a
    // `defaultState` slice is only an initial value, so it stays persistable.
    const { storage, writes } = storageWith(
      envelope(2, { columnSizing: { name: 240 } })
    );
    const { result } = renderController({
      defaultState: { columnSizing: { name: 100 } },
      persistence: { key: 'k', version: 2, storage },
    });

    expect(
      result.current.getState().columnSizing,
      'defaultState outranks a stored payload'
    ).toEqual({ name: 100 });
    expect(writes).toEqual([]);

    act(
      () =>
        void result.current.requestChange(
          'columnSizing',
          { name: 320 },
          'pointer'
        )
    );

    expect(writes).toHaveLength(1);
    expect(JSON.parse(writes[0]!).state.columnSizing).toEqual({ name: 320 });
  });

  it('pins that the two column lists actually disagree here', () => {
    // Kept because it is the premise the next test rests on: pruning against the
    // visible list can only be *wrong* if the two lists differ, and if they ever
    // stop differing here the next test becomes vacuous while still passing.
    //
    // It exists because swapping the feature module's `getAllLeafColumns` for
    // `getVisibleLeafColumns` appeared not to fail anything — which turned out to
    // be a broken negative control (a substitution with no `/g` hit the identifier
    // in a comment instead of the call). Re-aimed at the call, it fails the next
    // test. The premise is pinned anyway, because "my control was wrong" and "the
    // paths are equivalent" look identical from the outside.
    const { storage } = storageWith();
    const { result } = renderController({
      state: { columnVisibility: { email: false } },
      persistence: { key: 'k', version: 2, storage },
    });
    const all = result.current.table.getAllLeafColumns().map((c) => c.id);
    const visible = result.current.table
      .getVisibleLeafColumns()
      .map((c) => c.id);

    expect(all).toEqual(['name', 'email', 'role']);
    expect(
      visible,
      'a hidden column is absent from the visible leaf columns'
    ).toEqual(['name', 'role']);
  });

  it('prunes an unknown column id while keeping a HIDDEN one', () => {
    // Closes the `getAllLeafColumns` vs `getVisibleLeafColumns` choice, which no
    // engine-level test can see because those pass a column-id list directly.
    //
    // `email` is hidden by a controlled `columnVisibility`, so it is **not** a
    // visible leaf column — but it is still a column the table has, and its stored
    // width must restore. `getVisibleLeafColumns` would prune it, which is a
    // restore that silently drops preferences for every hidden column. `goneColumn`
    // is the genuinely unknown id and must be dropped in the same slice.
    const { storage } = storageWith(
      envelope(2, {
        columnSizing: { email: 300, name: 200, goneColumn: 999 },
      })
    );
    const { result } = renderController({
      state: { columnVisibility: { email: false } },
      persistence: {
        key: 'k',
        version: 2,
        storage,
        include: ['columnSizing'],
      },
    });

    expect(result.current.getState().columnSizing).toEqual({
      email: 300,
      name: 200,
    });
  });

  it('runs a migration and restores its output', () => {
    const { storage } = storageWith(
      envelope(1, { hidden: ['email', 'goneColumn'] })
    );
    const migrate = vi.fn((stored: unknown) => ({
      version: 2,
      state: {
        columnVisibility: Object.fromEntries(
          (stored as { state: { hidden: string[] } }).state.hidden.map((id) => [
            id,
            false,
          ])
        ),
      },
    }));
    const { result } = renderController({
      persistence: { key: 'k', version: 2, storage, migrate },
    });

    expect(migrate).toHaveBeenCalledTimes(1);
    // Migrated *and* pruned — the unknown id does not survive a migration either.
    expect(result.current.getState().columnVisibility).toEqual({
      email: false,
    });
  });

  it('reports corruption through onError and leaves state at its defaults', () => {
    const onError = vi.fn();
    const { storage } = storageWith('{ not json');
    const { result, events } = renderController({
      persistence: { key: 'k', version: 2, storage, onError },
    });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(events).toEqual([]);
    expect(result.current.getState().columnVisibility).toEqual({});
  });

  it('persists nothing and reads nothing when the group is absent', () => {
    // The inert path. `objectConfig` hands the feature `undefined`, and a table
    // with no `persistence` prop must not touch storage at all.
    const { storage, writes } = storageWith(
      envelope(2, { columnVisibility: { email: false } })
    );
    const read = vi.spyOn(storage, 'read');
    const { result } = renderController({ persistence: undefined });

    act(
      () =>
        void result.current.requestChange(
          'columnVisibility',
          { email: false },
          'api'
        )
    );

    expect(read).not.toHaveBeenCalled();
    expect(writes).toEqual([]);
  });

  it('does not persist live row state, even when the caller changes it', () => {
    // `behavior.md:471-476`. `selection` cannot be named in `include` at all — the
    // engine's `_AssertNoRowStatePersisted` makes that a compile error — so this
    // asserts the runtime consequence: selecting a row writes nothing.
    const { storage, writes } = storageWith();
    const { result } = renderController({
      persistence: { key: 'k', version: 2, storage },
    });

    act(
      () =>
        void result.current.requestChange(
          'selection',
          new Set(['p1']),
          'pointer'
        )
    );
    act(
      () =>
        void result.current.requestChange(
          'treeExpanded',
          new Set(['p1']),
          'pointer'
        )
    );

    expect(writes).toEqual([]);
  });
});

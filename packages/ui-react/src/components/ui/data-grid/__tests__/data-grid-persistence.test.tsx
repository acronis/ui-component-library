import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DataGrid } from '../data-grid';
import type { DataTablePersistenceStorage } from '../../data-table/data-table-features/persistence';

// U10 — `persistence`, the DataGrid half. Acceptance target:
//   packages/ui-spec/components/data-grid/behavior.md  "Column features restore together"
//
// Rule 7b: every member the config module declares is exercised **in the
// configuration a caller writes** — `persistence={{ … }}` on a real `<DataGrid>`,
// not through the resolver in isolation. The engine's mechanics live in
// `../../data-table/__tests__/data-table-persistence.test.tsx`; the wiring at the
// DataTable layer in `…/data-table-persistence-controller.test.tsx`. This file is
// about the resolver, its warnings, and the prop actually reaching the engine.

interface Task {
  id: string;
  name: string;
  status: string;
}

const columns: ColumnDef<Task, unknown>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
  { id: 'status', accessorKey: 'status', header: 'Status' },
];

const rows: Task[] = [
  { id: 't1', name: 'Restore me', status: 'active' },
  { id: 't2', name: 'And me', status: 'done' },
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

const headerNames = () =>
  screen.getAllByRole('columnheader').map((node) => node.textContent ?? '');

// `data-grid.tsx:118` reports resolver warnings through `console.error`, not
// `console.warn` — checked rather than assumed, because spying on the wrong one
// yields a test that passes for the wrong reason (the assertion never runs and the
// warning goes to the real console).
let reported: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  reported = vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('DataGrid persistence', () => {
  it('restores a hidden column from storage, so a caller sees it in the DOM', () => {
    // The end-to-end claim: the prop reaches the controller, the controller reaches
    // the feature module, the module reaches the engine, and the restore is visible
    // in rendered output. Any broken link in that chain leaves `Status` rendered.
    const { storage } = storageWith(
      envelope(1, { columnVisibility: { status: false } })
    );

    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        persistence={{ key: 'grid', version: 1, storage }}
      />
    );

    expect(headerNames()).toEqual(['Name']);
  });

  it('writes exactly the four column slices when a slice changes', async () => {
    // The write half, driven through a **public** route: external chrome hands a
    // caller the shared controller (`DataGridChromeContext`), which is how a screen
    // is documented to compose its own toolbar. No private handle, no reaching into
    // the grid.
    //
    // The payload shape is the default `include` set as a caller observes it — the
    // four column slices and nothing else. Asserted with `toEqual` on the whole
    // object rather than `toContain`, because the claim being made is about what is
    // *absent*: no selection, no pagination, no global filter.
    const user = userEvent.setup();
    const { storage, writes } = storageWith();

    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        persistence={{ key: 'grid', version: 3, storage }}
        chrome={{
          mode: 'external',
          render: ({ controller }) => (
            <button
              type="button"
              onClick={() => {
                controller.requestChange(
                  'columnVisibility',
                  { status: false },
                  'pointer'
                );
                controller.requestChange(
                  'selection',
                  new Set(['t1']),
                  'pointer'
                );
              }}
            >
              hide status
            </button>
          ),
        }}
      />
    );

    expect(writes, 'no write before a change').toEqual([]);

    await user.click(screen.getByRole('button', { name: 'hide status' }));

    expect(writes.length).toBeGreaterThan(0);
    expect(JSON.parse(writes[writes.length - 1]!)).toEqual({
      version: 3,
      state: {
        columnVisibility: { status: false },
        columnOrder: [],
        columnSizing: {},
        columnPinning: { left: [], right: [] },
      },
    });
  });

  it('reads nothing when the group is omitted or false', () => {
    for (const persistence of [undefined, false as const]) {
      const { storage } = storageWith(
        envelope(1, { columnVisibility: { status: false } })
      );
      const read = vi.spyOn(storage, 'read');
      const view = render(
        <DataGrid
          columns={columns}
          rows={rows}
          getRowId={(row) => row.id}
          persistence={persistence}
        />
      );

      expect(read).not.toHaveBeenCalled();
      expect(headerNames()).toEqual(['Name', 'Status']);
      view.unmount();
    }
  });

  it('warns and disables itself when a JS caller omits storage', () => {
    // Type-level already; this is the JS path. Disabling rather than
    // half-configuring matters because a persistence group missing its key would
    // otherwise read and write under `undefined`.
    // Cast the whole config rather than spreading `as never` into JSX: spreading
    // `never` makes every other prop on the element `unknown` too, so the escape
    // hatch would have quietly broken `getRowId`'s inference. Casting only the one
    // deliberately-invalid value keeps the rest of the element honestly typed.
    const incomplete = { key: 'grid', version: 1 } as unknown as NonNullable<
      Parameters<typeof DataGrid<Task, unknown>>[0]
    >['persistence'];

    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        persistence={incomplete}
      />
    );

    expect(reported).toHaveBeenCalledWith(
      expect.stringContaining('`persistence` requires `storage`')
    );
    expect(headerNames()).toEqual(['Name', 'Status']);
  });

  it('warns about an include entry it does not recognise, and still restores the rest', () => {
    // The engine drops an unknown slice name silently, which is the right runtime
    // behaviour and a terrible diagnostic — this warning is the only signal a
    // caller gets that their `include` entry did nothing.
    const { storage } = storageWith(
      envelope(1, { columnVisibility: { status: false } })
    );

    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        persistence={{
          key: 'grid',
          version: 1,
          storage,
          include: ['columnVisibility', 'selection' as never],
        }}
      />
    );

    expect(reported).toHaveBeenCalledWith(
      expect.stringContaining('does not recognise `selection`')
    );
    // …and the recognised entry still worked.
    expect(headerNames()).toEqual(['Name']);
  });
});

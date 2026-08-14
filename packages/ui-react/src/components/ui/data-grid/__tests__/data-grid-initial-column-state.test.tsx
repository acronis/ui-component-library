// PLTFRM-93016 — the three declarative capabilities a consumer reported missing.
//
// Two of them were already here and one was not, and the interesting part is why
// the ticket could not tell:
//
//   1. **Initial pinning.** `defaultState.columnPinning` worked. `meta.pin` — the
//      form `DataTable` honours, so the form a migrating consumer already has on
//      their column defs — was read by nothing. That is the gap this file's first
//      two blocks cover, and it was a *silent* no-op: their pinned actions column
//      simply became the last column. It now seeds the slice when pinning is
//      enabled, and warns when it is not, because the engine renders pinned
//      styling only then (`pinningSeedOf` in `columns-features.tsx` has the
//      full reasoning, including why the edge vocabulary is the DS's and not ours).
//   2. **Initial visibility.** `defaultState.columnVisibility` worked, including
//      the part that matters — the hidden column still appears in the View menu,
//      so a user can reveal it. The consumer deleted the column from their array
//      instead, because nothing said this was possible.
//   3. **Multi-column global search.** `filters.global.columnIds` worked, and is
//      covered by `data-grid-filters-facets.test.tsx` (matching across columns, OR
//      semantics, the deprecated single-column form, server round-trip). Not
//      duplicated here; the pointer is the point.
//
// What made 1's `defaultState` half and all of 2 and 3 invisible was PLTFRM-93014:
// the published `.d.ts` had dropped all 19 config augmentations, so on `0.0.0-20`
// a consumer's compiler saw neither `defaultState` nor `filters`. The runtime read
// them the whole time. `published-config-types.test.ts` is what keeps that fixed;
// these are the behaviours it makes reachable.

import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DataGrid } from '../data-grid';

interface Appliance {
  id: string;
  name: string;
  vendor: string;
  ip: string;
  connect: string;
}

const rows: Appliance[] = [
  { id: '1', name: 'alpha', vendor: 'Dell', ip: '10.0.0.1', connect: 'open' },
  { id: '2', name: 'beta', vendor: 'HPE', ip: '10.0.0.2', connect: 'open' },
];
const getRowId = (row: Appliance) => row.id;

/**
 * Columns with `meta.pin` on the trailing action column — the ticket's case.
 *
 * `pin` is `unknown` and cast at the assignment because two tests pass values the
 * type rejects, which is the point of them: the design system types `meta.pin` as
 * `'left' | 'right'`, and the runtime guard exists for JS callers and for a future
 * widening. The typed path is asserted without a cast in `compiles as the design
 * system types it` below.
 */
function columnsWithPin(
  pin: unknown,
  overrides: Partial<ColumnDef<Appliance, unknown>> = {}
): ColumnDef<Appliance, unknown>[] {
  return [
    { id: 'name', accessorKey: 'name', header: 'Name' },
    { id: 'vendor', accessorKey: 'vendor', header: 'Vendor' },
    { id: 'ip', accessorKey: 'ip', header: 'IP' },
    {
      id: 'connect',
      accessorKey: 'connect',
      header: 'Connect',
      meta: { pin } as ColumnDef<Appliance, unknown>['meta'],
      ...overrides,
    },
  ];
}

const plainColumns = columnsWithPin(undefined).map(
  ({ meta: _meta, ...rest }) => rest
);

/**
 * Is this header pinned to an edge?
 *
 * Asserted on the rendered effect rather than on a state object: the engine makes
 * a pinned column `sticky` and sets the inline inset, and that pair is what a user
 * would see. `inset-inline-*` rather than `left`/`right` — the grid pins by
 * logical edge, so a physical assertion would pass in LTR and lie in RTL.
 */
function pinnedEdge(name: string): 'start' | 'end' | undefined {
  const header = screen.getByRole('columnheader', { name });
  if (!header.className.includes('sticky')) return undefined;
  const style = header.getAttribute('style') ?? '';
  if (style.includes('inset-inline-start')) return 'start';
  if (style.includes('inset-inline-end')) return 'end';
  return undefined;
}

/** Pinning has to be on for pinned styling to render — see `pinningSeedOf`. */
const PINNING_ON = { pinning: true } as const;

describe('DataGrid initial pinning from `meta.pin`', () => {
  it.each([
    ['right', 'end'],
    ['left', 'start'],
  ] as const)('pins on `meta.pin: %s`', (pin, edge) => {
    render(
      <DataGrid
        columns={columnsWithPin(pin)}
        rows={rows}
        getRowId={getRowId}
        columnsFeatures={PINNING_ON}
      />
    );
    expect(pinnedEdge('Connect')).toBe(edge);
  });

  it('derives the id from `accessorKey` when the def has no `id`', () => {
    const columns: ColumnDef<Appliance, unknown>[] = [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'connect', header: 'Connect', meta: { pin: 'right' } },
    ];
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        columnsFeatures={PINNING_ON}
      />
    );
    expect(pinnedEdge('Connect')).toBe('end');
  });

  it('leaves every other column unpinned', () => {
    render(
      <DataGrid
        columns={columnsWithPin('right')}
        rows={rows}
        getRowId={getRowId}
        columnsFeatures={PINNING_ON}
      />
    );
    expect(pinnedEdge('Name')).toBeUndefined();
    expect(pinnedEdge('Vendor')).toBeUndefined();
  });

  it('lets a caller `defaultState.columnPinning` replace the seed', () => {
    // Design §5.1: the caller is more explicit than a group default. Per slice,
    // not merged edge-by-edge — `connect` asked for `end` via `meta.pin` and the
    // caller's slice does not mention it, so it ends up unpinned.
    render(
      <DataGrid
        columns={columnsWithPin('right')}
        rows={rows}
        getRowId={getRowId}
        columnsFeatures={PINNING_ON}
        defaultState={{ columnPinning: { left: ['name'], right: [] } }}
      />
    );
    expect(pinnedEdge('Name')).toBe('start');
    expect(pinnedEdge('Connect')).toBeUndefined();
  });

  it('warns on an unrecognised edge rather than ignoring it', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <DataGrid
        columns={columnsWithPin('trailing')}
        rows={rows}
        getRowId={getRowId}
        columnsFeatures={PINNING_ON}
      />
    );
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining("expected 'left' or 'right'")
    );
    expect(pinnedEdge('Connect')).toBeUndefined();
    error.mockRestore();
  });

  it('warns when the def has no id to pin by', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const columns: ColumnDef<Appliance, unknown>[] = [
      { accessorKey: 'name', header: 'Name' },
      { header: 'Connect', cell: () => 'open', meta: { pin: 'right' } },
    ];
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        columnsFeatures={PINNING_ON}
      />
    );
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('`id` or a string `accessorKey`')
    );
    error.mockRestore();
  });

  it('compiles as the design system types it', () => {
    // No cast anywhere: `@constructor-lab/ui-react` augments TanStack's
    // `ColumnMeta` with `pin?: 'left' | 'right'`, so this is the surface a
    // consumer actually writes against. `tsc` over this file is the assertion —
    // an attempt at `pin: 'end'` here would not compile, which is how the
    // constraint was found.
    const columns: ColumnDef<Appliance, unknown>[] = [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'connect', header: 'Connect', meta: { pin: 'right' } },
    ];
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        columnsFeatures={PINNING_ON}
      />
    );
    expect(pinnedEdge('Connect')).toBe('end');
  });

  it('adds no pinning when no column carries `meta.pin`', () => {
    render(
      <DataGrid
        columns={plainColumns}
        rows={rows}
        getRowId={getRowId}
        columnsFeatures={PINNING_ON}
      />
    );
    expect(pinnedEdge('Connect')).toBeUndefined();
    expect(pinnedEdge('Name')).toBeUndefined();
  });
});

describe('DataGrid `meta.pin` when pinning is off', () => {
  // The migration case, and the reason the seed is read before this group's early
  // return: a consumer arriving from `DataTable` has `meta.pin` and no
  // `columnsFeatures`. They used to get silence. The engine applies pinned styling
  // only when the feature is on, so the honest answer is a message naming the line
  // to add — not a state seed that renders nothing.
  it.each([
    ['omitted', undefined],
    ['false', false as const],
    ['pinning: false', { pinning: false } as const],
  ])(
    'warns naming the fix when `columnsFeatures` is %s',
    (_label, features) => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      render(
        <DataGrid
          columns={columnsWithPin('right')}
          rows={rows}
          getRowId={getRowId}
          columnsFeatures={features}
        />
      );
      expect(error).toHaveBeenCalledWith(
        expect.stringContaining('columnsFeatures={{ pinning: true }}')
      );
      expect(error.mock.calls.flat().join(' ')).toContain('`connect`');
      expect(pinnedEdge('Connect')).toBeUndefined();
      error.mockRestore();
    }
  );

  it('says nothing when no column asked to be pinned', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<DataGrid columns={plainColumns} rows={rows} getRowId={getRowId} />);
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });
});

describe('DataGrid default-hidden columns', () => {
  it('ships a column hidden from `defaultState.columnVisibility`', () => {
    render(
      <DataGrid
        columns={plainColumns}
        rows={rows}
        getRowId={getRowId}
        defaultState={{ columnVisibility: { ip: false } }}
      />
    );
    expect(
      screen.getAllByRole('columnheader').map((header) => header.textContent)
    ).toEqual(['Name', 'Vendor', 'Connect']);
  });

  it('still offers it in the View menu, so the user can reveal it', async () => {
    // This is the half that made the capability worth having: the consumer's
    // Convert-to-VM column was meant to ship hidden and be revealable, and they
    // removed it from the column array instead. A seed that hid the column but
    // dropped it from the menu would not have solved their problem.
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={plainColumns}
        rows={rows}
        getRowId={getRowId}
        columnsFeatures={{ visibility: true }}
        toolbar={{ viewOptions: true }}
        defaultState={{ columnVisibility: { ip: false } }}
      />
    );

    await user.click(screen.getByRole('button', { name: /view|column/i }));
    const item = screen.getByRole('menuitemcheckbox', { name: 'ip' });
    expect(item).toHaveAttribute('aria-checked', 'false');

    await user.click(item);
    expect(screen.getByRole('columnheader', { name: 'IP' })).toBeVisible();
  });
});

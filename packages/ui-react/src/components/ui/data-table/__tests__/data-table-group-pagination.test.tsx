// Per-group pagination (PLTFRM-93295): each group pages its own members.
//
// The design was chosen in review over two alternatives — paginating the groups
// themselves, and lazy per-group loading — so these tests pin the chosen behaviour
// rather than "pagination happens somewhere".
//
// ── WHY THE SLICING LIVES IN THE ROW WALK ───────────────────────────────────
// TanStack's `getPaginationRowModel` slices the flat row list *after* grouping, so
// its page 1 is "the first N rows wherever they fall". Per-group paging is a
// different question — which of *this group's* members are visible — and that is the
// question `flattenGroups` already answers for collapse. Hence one walk, two
// decisions, and `groupPageWindow` shared with the pager so the window is computed
// once.

import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DataGrid } from '../../data-grid';
import {
  DATA_TABLE_DEFAULT_PERSISTED_SLICES,
  DATA_TABLE_PERSISTABLE_SLICES,
} from '../data-table-persistence';
import type { DataTablePersistenceStorage } from '../data-table-features/persistence';

type Alert = { id: string; tenant: string; device: string };

/** Two tenants: one with five members, one with two. */
const alerts: Alert[] = [
  ...Array.from({ length: 5 }, (_, index) => ({
    id: `c${index}`,
    tenant: 'Contoso',
    device: `contoso-0${index}`,
  })),
  { id: 'f0', tenant: 'Fabrikam', device: 'fabrikam-00' },
  { id: 'f1', tenant: 'Fabrikam', device: 'fabrikam-01' },
];

const columns = [
  { accessorKey: 'tenant', header: 'Tenant' },
  { accessorKey: 'device', header: 'Device' },
];

function grid(pageSize?: number) {
  return render(
    <DataGrid
      columns={columns}
      rows={alerts}
      getRowId={(alert: Alert) => alert.id}
      grouping={{
        allowedColumns: ['tenant'],
        ...(pageSize === undefined ? {} : { pageSize }),
      }}
      defaultState={{ grouping: ['tenant'] }}
    />
  );
}

/** Device names rendered, in order — the members actually visible. */
const devices = (container: HTMLElement) =>
  [...container.querySelectorAll('td')]
    .map((cell) => (cell.textContent ?? '').trim())
    .filter((text) => /^(contoso|fabrikam)-\d+$/.test(text));

/**
 * The pager rows, as their "Page X of Y" text.
 *
 * Matched rather than prefix-tested: the cell also holds the two arrow buttons, so
 * its text is `‹Page 1 of 3›` and a `startsWith` finds nothing. That cost an hour of
 * debugging the component when the assertion was the wrong thing.
 */
const pagers = (container: HTMLElement) =>
  [...container.querySelectorAll('td')]
    .map((cell) => (cell.textContent ?? '').match(/Page \d+ of \d+/)?.[0])
    .filter((text): text is string => text !== undefined);

describe('per-group pagination', () => {
  it('renders every member when paging is off', () => {
    const { container } = grid();

    expect(devices(container)).toHaveLength(7);
    expect(pagers(container)).toEqual([]);
  });

  it('shows only the first page of each group', () => {
    const { container } = grid(2);

    // Contoso has five members, Fabrikam two, so page one is two of each.
    expect(devices(container)).toEqual([
      'contoso-00',
      'contoso-01',
      'fabrikam-00',
      'fabrikam-01',
    ]);
  });

  it('gives a pager only to groups that need one', () => {
    const { container } = grid(2);

    // Contoso spans three pages; Fabrikam fits exactly on one, and a pager that can
    // never move is furniture.
    expect(pagers(container)).toEqual(['Page 1 of 3']);
  });

  it('pages one group without touching the other', () => {
    const { container } = grid(2);

    fireEvent.click(
      container.querySelector('button[aria-label^="Next page of group"]')!
    );

    expect(devices(container)).toEqual([
      'contoso-02',
      'contoso-03',
      // Fabrikam is untouched — the whole point of per-group state.
      'fabrikam-00',
      'fabrikam-01',
    ]);
    expect(pagers(container)).toEqual(['Page 2 of 3']);
  });

  it('walks to the last, partial page and stops', () => {
    const { container } = grid(2);
    const next = () =>
      fireEvent.click(
        container.querySelector('button[aria-label^="Next page of group"]')!
      );

    next();
    next();

    // Five members at two per page: the third page holds one.
    expect(devices(container)).toEqual([
      'contoso-04',
      'fabrikam-00',
      'fabrikam-01',
    ]);
    expect(pagers(container)).toEqual(['Page 3 of 3']);
    expect(
      container
        .querySelector('button[aria-label^="Next page of group"]')
        ?.hasAttribute('disabled')
    ).toBe(true);
  });

  it('starts on the page a caller asked for', () => {
    const { container } = render(
      <DataGrid
        columns={columns}
        rows={alerts}
        getRowId={(alert: Alert) => alert.id}
        grouping={{ allowedColumns: ['tenant'], pageSize: 2 }}
        defaultState={{
          grouping: ['tenant'],
          groupPagination: new Map([['tenant:Contoso', 1]]),
        }}
      />
    );

    expect(devices(container)).toEqual([
      'contoso-02',
      'contoso-03',
      'fabrikam-00',
      'fabrikam-01',
    ]);
  });

  it('collapsing a group hides its pager with its rows', () => {
    const { container } = grid(2);

    fireEvent.click(
      container.querySelector('button[aria-label^="Collapse group"]')!
    );

    // Contoso's rows and its pager go together — a pager for rows nobody can see
    // would still be clickable, silently changing state behind a closed group.
    expect(devices(container)).toEqual(['fabrikam-00', 'fabrikam-01']);
    expect(pagers(container)).toEqual([]);
  });
});

// ── PERSISTENCE ──────────────────────────────────────────────────────────────
//
// PLTFRM-93295's acceptance criteria say per-group state must go through the existing
// `state` / `persistence` groups rather than a parallel mechanism. It goes through
// `state` and `defaultState`. It does **not** get persisted, and that is a decision:
// the slice is keyed by `${columnId}:${value}`, so a restore against a changed dataset
// would restore pages for groups that no longer exist.
//
// The compile-time half of that lives with the other slice rules, in
// `data-table-persistence.ts` (`_AssertNoGroupStatePersisted`) — naming the slice in
// `include` does not type-check. What is left to test at runtime is that the slice
// stays out of what actually reaches storage, and that paging a group with persistence
// enabled does not disturb the slices that *are* persisted.
describe('per-group pagination and persistence', () => {
  const persistable: readonly string[] = DATA_TABLE_PERSISTABLE_SLICES;

  it('is not a persistable slice', () => {
    // Asserted against the runtime list, not only the type: the type assertion in
    // `data-table-persistence.ts` is erased by `vitest run` and only fires under
    // `test:types`, so on its own it would pass here whatever the value said.
    expect(persistable).not.toContain('groupPagination');
    expect(persistable).not.toContain('groupCollapsed');
    expect([...DATA_TABLE_DEFAULT_PERSISTED_SLICES]).not.toContain(
      'groupPagination'
    );
  });

  it('paging a group writes nothing to storage', () => {
    const writes: string[] = [];
    const storage: DataTablePersistenceStorage = {
      read: () => null,
      write: (_key, value) => void writes.push(value),
    };

    const { container } = render(
      <DataGrid
        columns={columns}
        rows={alerts}
        getRowId={(alert: Alert) => alert.id}
        grouping={{ allowedColumns: ['tenant'], pageSize: 2 }}
        sorting={{}}
        defaultState={{ grouping: ['tenant'] }}
        persistence={{
          key: 'group-pages',
          version: 1,
          storage,
          include: ['grouping', 'sorting'],
        }}
      />
    );

    // A control first: sorting *is* persisted, so activating a header proves the write
    // path is live under this config. Without it, the assertion below would pass just
    // as happily on a persistence feature that was inert all along.
    fireEvent.click(container.querySelector('th button')!);
    // Named rather than counted: `th button` is the Tenant sort header today, and a
    // markup change that made it something else would otherwise leave this "control"
    // silently controlling nothing.
    expect(writes).toHaveLength(1);
    expect(JSON.parse(writes[0]!).state.sorting).toEqual([
      { id: 'tenant', desc: false },
    ]);
    const beforePaging = writes.length;

    fireEvent.click(
      container.querySelector('button[aria-label^="Next page of group"]')!
    );

    // The page moved...
    expect(pagers(container)).toEqual(['Page 2 of 3']);
    // ...and storage did not, because the only slice that changed is not persisted.
    expect(writes).toHaveLength(beforePaging);
    // And nothing that was written mentions a group page under any name — the failure
    // to guard against is a `Map` stringified into the envelope, which yields `{}`.
    for (const value of writes) {
      expect(value).not.toContain('groupPagination');
      expect(value).not.toContain('tenant:Contoso');
    }
  });

  it('restores without carrying a group page over', () => {
    // A payload written by an earlier session, plus a `groupPagination` key that no
    // version of this library writes — the shape a hand-edited or future payload
    // could have. Restore must ignore it rather than half-apply it.
    const stored = JSON.stringify({
      version: 1,
      state: { grouping: ['tenant'], groupPagination: { 'tenant:Contoso': 2 } },
    });

    const { container } = render(
      <DataGrid
        columns={columns}
        rows={alerts}
        getRowId={(alert: Alert) => alert.id}
        grouping={{ allowedColumns: ['tenant'], pageSize: 2 }}
        persistence={{
          key: 'group-pages',
          version: 1,
          storage: { read: () => stored, write: () => {} },
          include: ['grouping'],
        }}
      />
    );

    // Grouping restored from the payload...
    expect(pagers(container)).toEqual(['Page 1 of 3']);
    // ...and the group is on page one, not the stored page three.
    expect(devices(container)).toEqual([
      'contoso-00',
      'contoso-01',
      'fabrikam-00',
      'fabrikam-01',
    ]);
  });
});

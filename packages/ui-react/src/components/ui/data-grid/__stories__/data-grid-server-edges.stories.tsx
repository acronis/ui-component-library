import { useCallback, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ColumnDef } from '@tanstack/react-table';

import { Button } from '../../button';
import {
  createDataTableQuery,
  createDefaultDataTableState,
  type DataTableQuery,
  type DataTableQueryChangeEvent,
} from '../../data-table';
import type { DataTablePersistenceStorage } from '../../data-table/data-table-features/persistence';
import { DataGrid } from '../data-grid';
import type { DataGridServerSelectionChangeEvent } from '../data-grid-config';

// The server-mode edges: the misconfigurations the grid reports, selection across
// page swaps, what persistence does and does not restore, and who owns the query
// on a cold load.
//
// These are the parts a screen meets on its second week rather than its first, and
// each one has a wrong answer that looks right — which is why they are stories
// rather than a paragraph in the README.

interface Device {
  id: string;
  hostname: string;
  site: string;
  status: string;
}

const devices: Device[] = Array.from({ length: 36 }, (_, index) => ({
  id: `d-${index + 1}`,
  hostname: `edge-${String(index + 1).padStart(2, '0')}`,
  site: ['Berlin', 'Boston', 'Singapore'][index % 3]!,
  status: index % 4 === 0 ? 'At risk' : 'Protected',
}));

const columns: ColumnDef<Device>[] = [
  { id: 'hostname', accessorKey: 'hostname', header: 'Host' },
  { id: 'site', accessorKey: 'site', header: 'Site' },
  { id: 'status', accessorKey: 'status', header: 'Status' },
];

const gridColumns = columns as ColumnDef<Device, unknown>[];

const PAGE_SIZE = 6;

const queryFor = (pageIndex = 0): DataTableQuery =>
  createDataTableQuery(
    createDefaultDataTableState({
      pagination: { pageIndex, pageSize: PAGE_SIZE },
    })
  );

const meta = {
  title: 'Internal/DataGrid/Server edges',
  component: DataGrid,
  parameters: { layout: 'padded' },
  // Every story renders its own grid, so these args only satisfy `DataGrid`'s two
  // required props.
  args: {
    columns: gridColumns as ColumnDef<unknown, unknown>[],
    rows: devices,
  },
  argTypes: {
    columns: { control: false },
    rows: { control: false },
    server: { control: false },
    selection: { control: false },
    persistence: { control: false },
  },
} satisfies Meta<typeof DataGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

/* ─────────────────────────────────────────────── The misconfiguration gallery */

/** One misconfigured grid, beside the warning it produces. */
function Case({
  title,
  warning,
  children,
}: {
  title: string;
  warning: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="rounded-md bg-[var(--ui-background-subtle)] p-3 text-xs text-muted-foreground">
        {warning}
      </p>
      {children}
    </section>
  );
}

/**
 * Every server-mode warning, each next to the console text it emits. **Open the
 * console** — these grids render, and rendering is the problem: each one is wrong in
 * a way that produces a plausible screen, which is exactly why the grid says so out
 * loud rather than failing.
 */
function MisconfiguredGallery() {
  const query = queryFor();

  return (
    <div className="flex flex-col gap-8">
      <Case
        title="No totals and no directional capabilities"
        warning={
          '`server` paginates manually, so it needs either `server.rowCount`/`server.pageCount` or both `server.hasNextPage` and `server.hasPreviousPage`. — Without either, TanStack derives the page count from the loaded window: this 36-row result served 6 at a time announces "Page 1 of 1" and disables Next.'
        }
      >
        <DataGrid
          columns={gridColumns}
          rows={devices.slice(0, PAGE_SIZE)}
          getRowId={(row) => row.id}
          server={{ query, onQueryChange: () => {} }}
        />
      </Case>

      <Case
        title="unknownTotal alongside a known total"
        warning="`pagination.unknownTotal` cannot be combined with `server.rowCount`/`server.pageCount`; the total is either known or it is not."
      >
        <DataGrid
          columns={gridColumns}
          rows={devices.slice(0, PAGE_SIZE)}
          getRowId={(row) => row.id}
          pagination={{ unknownTotal: true }}
          server={{
            query,
            rowCount: devices.length,
            hasNextPage: true,
            hasPreviousPage: false,
            onQueryChange: () => {},
          }}
        />
      </Case>

      <Case
        title="all-results select-all with no server token"
        warning={
          '`selection.selectAll: "all-results"` requires an application-issued `server.selection` token in `all-results` mode. DataGrid never invents one, so the header select-all covers the loaded rows instead.'
        }
      >
        <DataGrid
          columns={gridColumns}
          rows={devices.slice(0, PAGE_SIZE)}
          getRowId={(row) => row.id}
          selection={{ mode: 'multiple', selectAll: 'all-results' }}
          server={{
            query,
            rowCount: devices.length,
            onQueryChange: () => {},
          }}
        />
      </Case>

      <Case
        title="A token issued for a different query"
        warning={
          'the all-results selection token is scoped to query request key "…" but the current query is "…", so no all-results selection is reported. — A filter change invalidates a token; the owner must issue one for the new key.'
        }
      >
        <DataGrid
          columns={gridColumns}
          rows={devices.slice(0, PAGE_SIZE)}
          getRowId={(row) => row.id}
          selection={{ mode: 'multiple', selectAll: 'all-results' }}
          server={{
            query,
            rowCount: devices.length,
            selection: {
              mode: 'all-results',
              // Deliberately stale: issued for page 2's key, presented against page 1's.
              queryRequestKey: queryFor(1).requestKey,
              excludedIds: new Set(),
              token: 'srv-token-stale',
            },
            onQueryChange: () => {},
          }}
        />
      </Case>

      <Case
        title="A selection handler with no controlled selection"
        warning="`server.onSelectionChange` reports requested changes to `server.selection`, and does nothing without it. Supply `server.selection`, or read `callbacks.onSelectionChange` instead."
      >
        <DataGrid
          columns={gridColumns}
          rows={devices.slice(0, PAGE_SIZE)}
          getRowId={(row) => row.id}
          selection={{ mode: 'multiple' }}
          server={{
            query,
            rowCount: devices.length,
            onSelectionChange: () => {},
            onQueryChange: () => {},
          }}
        />
      </Case>

      <Case
        title="A scroll fetch trigger with no window to reach the end of"
        warning="`server.onEndReached` needs `virtualization` — the trigger is the rendered row range, and an unwindowed grid renders every row, so there is no range to reach the end of."
      >
        <DataGrid
          columns={gridColumns}
          rows={devices.slice(0, PAGE_SIZE)}
          getRowId={(row) => row.id}
          pagination={false}
          server={{
            query,
            rowCount: devices.length,
            onEndReached: () => {},
            onQueryChange: () => {},
          }}
        />
      </Case>
    </div>
  );
}

export const Misconfigured: Story = {
  // Taller than the 720px capture viewport, so the clipped screenshot would drop
  // content off the bottom and the baseline would silently omit it. The visual
  // regression runner aborts rather than writing a truncated PNG.
  parameters: { snapshot: { fullPage: true } },
  render: () => <MisconfiguredGallery />,
};

/* ─────────────────────────────────────────────────── Selection across the pages */

/**
 * A controlled `explicit` selection survives paging, because it is keyed by row id
 * and the ids outlive the window. Select a row, page forward, page back — it is
 * still ticked, and the ids you collected on page 1 are still in the set while you
 * are looking at page 3.
 *
 * ⚠ **The footer's count is the honest one only because `server.selection` is
 * supplied.** It reads `ids.size`, which includes ids outside the loaded window. A
 * grid that tracks selection itself has only the window to count, and undercounts.
 */
function SelectionAcrossPages() {
  const [query, setQuery] = useState<DataTableQuery>(() => queryFor());
  const [ids, setIds] = useState<ReadonlySet<string>>(() => new Set());

  const { pageIndex } = query.pagination;
  const page = devices.slice(
    pageIndex * PAGE_SIZE,
    pageIndex * PAGE_SIZE + PAGE_SIZE
  );

  const onQueryChange = useCallback(
    (event: DataTableQueryChangeEvent) => setQuery(event.query),
    []
  );
  const onSelectionChange = useCallback(
    (event: DataGridServerSelectionChangeEvent) => {
      if (event.selection?.mode === 'explicit') {
        setIds(event.selection.ids);
      } else if (event.selection === undefined) {
        setIds(new Set());
      }
    },
    []
  );

  const offPage = [...ids].filter(
    (id) => !page.some((device) => device.id === id)
  );

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Selected <strong>{ids.size}</strong>, of which{' '}
        <strong>{offPage.length}</strong> are not on this page
        {offPage.length > 0 ? ` (${offPage.join(', ')})` : ''}.
      </p>
      <DataGrid
        columns={gridColumns}
        rows={page}
        getRowId={(row) => row.id}
        selection={{ mode: 'multiple' }}
        server={{
          query,
          rowCount: devices.length,
          selection: { mode: 'explicit', ids },
          onSelectionChange,
          onQueryChange,
        }}
      />
    </div>
  );
}

export const SelectionAcrossPageSwaps: Story = {
  render: () => <SelectionAcrossPages />,
};

/* ──────────────────────────────────────────────── Persistence, and its boundary */

/** A pre-seeded adapter, as in `data-grid-persistence.stories.tsx`. */
function seeded(payload?: unknown): DataTablePersistenceStorage {
  let stored = payload === undefined ? null : JSON.stringify(payload);

  return {
    read: () => stored,
    write: (_key, value) => {
      stored = value;
    },
  };
}

/**
 * What a reload restores in server mode, and what it cannot.
 *
 * **Restored:** the Site column is hidden and Host is wide, straight out of storage.
 *
 * **Not restored, and not restorable:** sorting, filters and the page. Persistence
 * skips every slice the caller controls, and server mode controls all of those
 * through `server.query` — so the stored payload below asks for
 * `sorting: [{ id: 'status' }]` and nothing happens.
 *
 * That is a boundary rather than a gap: the query is the caller's, so restoring it
 * is the caller's too. `DeepLinkedQuery` below is the other half.
 */
export const PersistenceInServerMode: Story = {
  render: () => (
    <DataGrid
      columns={gridColumns}
      rows={devices.slice(0, PAGE_SIZE)}
      getRowId={(row) => row.id}
      columnsFeatures={{ resizing: true }}
      persistence={{
        key: 'story-server-persistence',
        version: 1,
        include: ['sorting', 'columnVisibility', 'columnSizing'],
        storage: seeded({
          version: 1,
          state: {
            columnVisibility: { site: false },
            columnSizing: { hostname: 320 },
            // Ignored: `sorting` is controlled by `server.query`.
            sorting: [{ id: 'status', desc: true }],
          },
        }),
      }}
      server={{
        query: queryFor(),
        rowCount: devices.length,
        onQueryChange: () => {},
      }}
    />
  ),
};

/* ─────────────────────────────────────────────────────── The query on cold load */

/**
 * The caller's half: rebuilding a query from a URL. `createDefaultDataTableState`
 * fills every slice, the overrides carry what the link encoded, and
 * `createDataTableQuery` derives the canonical `requestKey` from the result — so a
 * link and a click that produce the same state produce the same key, and therefore
 * the same cache entry.
 *
 * Switch links and watch the key change. Nothing about this is grid API; it is the
 * three exported functions and ordinary state, which is the point — deep linking
 * needed no feature.
 */
function DeepLinked() {
  const [link, setLink] = useState('?sort=hostname:asc&page=1');

  const query = useMemo(() => {
    const params = new URLSearchParams(link.slice(1));
    const sort = params.get('sort');
    const [id, direction] = sort?.split(':') ?? [];
    const page = Number(params.get('page') ?? '1') - 1;
    const site = params.get('site');

    return createDataTableQuery(
      createDefaultDataTableState({
        ...(id === undefined
          ? {}
          : { sorting: [{ id, desc: direction === 'desc' }] }),
        ...(site === null
          ? {}
          : {
              columnFilters: [
                { id: 'site', value: { operator: 'equals', value: site } },
              ],
            }),
        pagination: { pageIndex: Math.max(0, page), pageSize: PAGE_SIZE },
      })
    );
  }, [link]);

  const rows = useMemo(() => {
    const params = new URLSearchParams(link.slice(1));
    const site = params.get('site');
    const matching =
      site === null ? devices : devices.filter((row) => row.site === site);
    const { pageIndex } = query.pagination;

    return matching.slice(
      pageIndex * PAGE_SIZE,
      pageIndex * PAGE_SIZE + PAGE_SIZE
    );
  }, [link, query.pagination]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {[
          '?sort=hostname:asc&page=1',
          '?sort=status:desc&page=3',
          '?site=Berlin&page=1',
        ].map((candidate) => (
          <Button
            key={candidate}
            variant={candidate === link ? 'default' : 'secondary'}
            onClick={() => setLink(candidate)}
          >
            {candidate}
          </Button>
        ))}
      </div>
      <p className="break-all text-xs text-muted-foreground">
        requestKey: <code>{query.requestKey}</code>
      </p>
      <DataGrid
        columns={gridColumns}
        rows={rows}
        getRowId={(row) => row.id}
        sorting={{}}
        server={{
          query,
          rowCount: devices.length,
          onQueryChange: () => {},
        }}
      />
    </div>
  );
}

export const DeepLinkedQuery: Story = {
  render: () => <DeepLinked />,
};

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ColumnDef } from '@tanstack/react-table';

import { TableCell } from '../../table';
import { DataGrid } from '../data-grid';
import type { DataTableRowRange } from '../../data-table/data-table-features/virtualization';
import {
  initialQuery,
  useFakeServer,
  useInfiniteFakeServer,
} from './server-fixture';

// LOCAL(ui_tools) — fetch-as-you-scroll, and the paged combination it is not.
//
// ── What was missing, and what was already there ─────────────────────────────
//
// Server mode is page-based and `virtualization` only windows rows the caller has
// already supplied, so both halves of "load more as the user scrolls" existed
// except the trigger: nothing published the rendered range, so nothing could say
// "the window is near the end". `server.onEndReached` is that signal.
//
// Everything else is the caller's, unchanged: it owns the query, appends the new
// page to its own row array, and stops answering when there is nothing left. The
// grid holds the union and windows it.
//
// ── Three things that are easy to get wrong ──────────────────────────────────
//
//  1. **`pagination: false`.** Server mode turns the page footer on by itself, and
//     a footer that replaces the window contradicts a trigger that extends it. The
//     grid warns if you leave both on.
//  2. **Not `dataState: 'loading'` for the load-more spinner.** That status clears
//     the rows and renders skeletons — it would blank the list the user is reading.
//     The indicator belongs in `footer.render`, which is a real display row: it
//     windows with everything else and can be sticky.
//  3. **A bounded height.** The trigger is the rendered range, so it needs a
//     virtualizer, which needs `appearance.height`/`maxHeight`.

interface Event {
  [key: string]: unknown;
  id: string;
  occurred: string;
  actor: string;
  action: string;
}

const ACTIONS = [
  'signed in',
  'created a backup plan',
  'revoked a token',
  'restored a workload',
  'changed a policy',
];

const events: Event[] = Array.from({ length: 4821 }, (_, index) => ({
  id: `E-${100000 + index}`,
  occurred: `2026-07-${String((index % 28) + 1).padStart(2, '0')} 09:${String(
    index % 60
  ).padStart(2, '0')}`,
  actor: `user-${(index % 97) + 1}@example.com`,
  action: ACTIONS[index % ACTIONS.length]!,
}));

const columns: ColumnDef<Event>[] = [
  { accessorKey: 'id', header: 'Event' },
  { accessorKey: 'occurred', header: 'Occurred' },
  { accessorKey: 'actor', header: 'Actor' },
  { accessorKey: 'action', header: 'Action' },
];

const gridColumns = columns as ColumnDef<Event, unknown>[];

const meta = {
  title: 'Internal/DataGrid/Server infinite scroll',
  component: DataGrid,
  parameters: {
    layout: 'padded',
    // ── THE CAPTURE MUST OUTLAST THE FIXTURE'S LATENCY ───────────────────────
    // Every story here drives `useInfiniteFakeServer` with a latency of 350–400ms, and
    // that delay is a `setTimeout` — so `waitForLoadState('networkidle')` never sees it
    // and the screenshot races the response.
    //
    // Without this, `Paged And Virtualized` failed the FIRST gating CI run by 70 pixels
    // (0.0099%) in dark mode while passing locally: small enough to look like
    // antialiasing jitter, but it is the same two-application-states bug that hit
    // `data-grid-server.stories.tsx` at 11.3%. A diff that size is only small because
    // the racing region is small, and no threshold should paper over it.
    //
    // The sibling file has carried this since phase 3; the fix was applied to that file
    // rather than to the condition, so this one — added later — inherited the race. If a
    // third file starts driving the fixture, it needs this too.
    snapshot: { animationDelay: 2000 },
  },
  // Every story renders its own grid, so these args only satisfy `DataGrid`'s two
  // required props.
  args: { columns: gridColumns as ColumnDef<unknown, unknown>[], rows: [] },
  argTypes: {
    columns: { control: false },
    rows: { control: false },
    server: { control: false },
    virtualization: { control: false },
    footer: { control: false },
  },
} satisfies Meta<typeof DataGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * **Server pagination + virtualization** — the combination that already worked, and
 * the one most server grids actually want. Shown first so the difference from
 * infinite scroll is visible.
 *
 * Each request returns a 250-row page; the grid windows it to ~15 rendered rows and
 * the footer pages through 4,821 results. Two behaviours worth watching:
 *
 * - **Paging replaces the window rather than extending it**, and the scroll position
 *   goes back to the top with it — because the row array is new, so display row 0 is
 *   a different record than it was a moment ago. That is the honest behaviour for a
 *   page, and the exact thing infinite scroll trades away.
 * - **`aria-rowcount` describes the loaded page, not the result set.** It is a
 *   property of the table, and the table holds 250 rows; the 4,821 lives in the
 *   footer's own count. A screen reader announcing "row 12 of 250" on page 3 is
 *   correct.
 */
function PagedAndWindowed() {
  const server = useFakeServer(events, { latency: 350, pageSize: 250 });

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Page {server.query.pagination.pageIndex + 1} · {server.rows.length} rows
        loaded of {server.total} · <strong>{server.requests.length}</strong>{' '}
        requests
      </p>
      <DataGrid
        columns={gridColumns}
        rows={[...server.rows]}
        getRowId={(row) => row.id}
        sorting={{}}
        appearance={{ maxHeight: 420, stickyHeader: true }}
        virtualization={{ estimateRowHeight: 40 }}
        dataState={
          server.status === 'loading'
            ? { status: 'loading', skeletonRows: 10 }
            : {}
        }
        server={{
          query: server.query,
          rowCount: server.total,
          onQueryChange: server.onQueryChange,
        }}
      />
    </div>
  );
}

export const PagedAndVirtualized: Story = {
  render: () => <PagedAndWindowed />,
};

/**
 * The same idea without a live backend: one 500-row page, statically supplied. Kept
 * as the minimal reference — it is the shortest correct spelling of "server mode
 * plus windowing", with nothing else in the way.
 */
export const LargePageWindowed: Story = {
  render: () => (
    <DataGrid
      columns={gridColumns}
      rows={events.slice(0, 500)}
      getRowId={(row) => row.id}
      appearance={{ maxHeight: 420, stickyHeader: true }}
      virtualization={{ estimateRowHeight: 40 }}
      server={{
        query: initialQuery(500),
        rowCount: events.length,
        onQueryChange: () => {},
      }}
    />
  ),
};

/**
 * The new path. Scroll and rows append; the fetch counter rises **once per page**,
 * not once per scroll frame, because the trigger latches on the loaded row count
 * and re-arms only when that count moves.
 *
 * Read the counter rather than the rows: an unlatched implementation looks
 * identical until you notice it fetched forty times.
 */
function InfiniteList({ threshold }: { threshold?: number }) {
  const server = useInfiniteFakeServer(events, { latency: 400, pageSize: 50 });

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Loaded <strong>{server.rows.length}</strong> of {server.total} ·{' '}
        <strong>{server.fetches}</strong> requests
        {threshold === undefined ? '' : ` · threshold ${threshold} rows`}
      </p>
      <DataGrid
        columns={gridColumns}
        rows={[...server.rows]}
        getRowId={(row) => row.id}
        appearance={{ maxHeight: 420, stickyHeader: true }}
        virtualization={{ estimateRowHeight: 40 }}
        // The footer is the wrong affordance here — see the note at the top.
        pagination={false}
        footer={{
          sticky: true,
          // A real display row, so it windows with the rest and never blanks the
          // list the way `dataState: 'loading'` would.
          //
          // ⚠ `render`'s output lands directly inside the footer `<TableRow>`, so
          // it has to BE cells. Returning a `<span>` renders (and looks right) while
          // producing invalid table markup — React reports it as
          // `validateDOMNesting: <span> cannot appear as a child of <tr>`.
          render: () => (
            <TableCell
              colSpan={columns.length}
              className="text-sm text-muted-foreground"
            >
              {server.loadingMore
                ? 'Loading more…'
                : server.hasNextPage
                  ? `${server.total - server.rows.length} more`
                  : 'End of results'}
            </TableCell>
          ),
        }}
        server={{
          query: server.query,
          rowCount: server.total,
          onQueryChange: server.onQueryChange,
          onEndReached: server.loadMore,
          ...(threshold === undefined
            ? {}
            : { endReachedThreshold: threshold }),
        }}
      />
    </div>
  );
}

export const InfiniteScroll: Story = {
  render: () => <InfiniteList />,
};

/**
 * The threshold, side by side. `0` waits until the last loaded row is inside the
 * rendered window; `20` fetches while the end is still below the fold — so the left
 * grid stutters at each page boundary and the right one usually does not.
 *
 * Two things about the number:
 *
 * The lead is larger than it says. The trigger measures against the last
 * **overscanned** row, so the effective distance is the threshold plus
 * `virtualization.overscan` (8 by default).
 *
 * ⚠ **Keep `endReachedThreshold + overscan` below the page size.** Appending a page
 * re-arms the trigger; if the window is still inside the band after the append, the
 * next call fires immediately and the list loads every page in one cascade. At the
 * 50-row page here, anything past ~40 does that.
 */
export const EndReachedThreshold: Story = {
  render: () => (
    <div className="grid gap-8 xl:grid-cols-2">
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">
          endReachedThreshold: 0 — fetch at the very end.
        </h3>
        <InfiniteList threshold={0} />
      </section>
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">
          endReachedThreshold: 20 — fetch ahead of the fold.
        </h3>
        <InfiniteList threshold={20} />
      </section>
    </div>
  ),
};

/**
 * The same signal with nothing fetching on it. `virtualization.onRangeChange` is the
 * observing half — a "showing rows N–M of T" readout, a scroll-position indicator,
 * an analytics ping.
 *
 * Two things the numbers are not, and both are ordinary mistakes: they are
 * **display-row** indices, so group headers, detail rows and the footer row are
 * counted along with records; and `endIndex` is the last *rendered* row, which is
 * past the last *visible* one by the overscan.
 */
function RangeReadout() {
  const [range, setRange] = useState<DataTableRowRange | undefined>(undefined);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        {range === undefined
          ? 'Scroll the grid.'
          : `Rendering display rows ${range.startIndex + 1}–${
              range.endIndex + 1
            } of ${range.count}.`}
      </p>
      <DataGrid
        columns={gridColumns}
        rows={events.slice(0, 1000)}
        getRowId={(row) => row.id}
        appearance={{ maxHeight: 420, stickyHeader: true }}
        virtualization={{ estimateRowHeight: 40, onRangeChange: setRange }}
      />
    </div>
  );
}

export const RangeObserver: Story = {
  render: () => <RangeReadout />,
};

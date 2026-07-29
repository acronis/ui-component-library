import { useCallback, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ColumnDef } from '@tanstack/react-table';

import {
  createDataTableQuery,
  createDefaultDataTableState,
  type DataTableQuery,
  type DataTableQueryChangeEvent,
} from '../../data-table';
import { DataGrid } from '../data-grid';
import type { DataGridServerSelectionChangeEvent } from '../data-grid-config';

// `server.selection` (U8): a controlled, server-owned selection.
//
// The story exists to show the thing that is easy to get wrong by reading the
// types alone — **a click does not change the selection.** The controlled value
// stays authoritative, `server.onSelectionChange` reports what the user asked for,
// and the selection only moves when the owner supplies a new `server.selection`.
// Here the story component plays the owner and accepts every request, so it looks
// ordinary; the counter is what shows the round trip actually happened.
//
// The `all-results` story below **was** deliberately absent while that mode had no
// visual consumer; `selection.selectAll: 'all-results'` gave it one, so it is here
// now. Rendering "everything except these exclusions" needs a row id per checkbox,
// which is why the consumer had to be the selection column's cell renderer.

interface Device {
  id: string;
  hostname: string;
  status: string;
}

const devices: Device[] = [
  { id: 'd-1', hostname: 'web-01', status: 'Protected' },
  { id: 'd-2', hostname: 'web-02', status: 'Protected' },
  { id: 'd-3', hostname: 'db-01', status: 'At risk' },
  { id: 'd-4', hostname: 'db-02', status: 'Protected' },
];

const columns: ColumnDef<Device>[] = [
  { accessorKey: 'hostname', header: 'Host' },
  { accessorKey: 'status', header: 'Status' },
];

function ControlledServerSelection({ accept }: { accept: boolean }) {
  const [query, setQuery] = useState<DataTableQuery>(() =>
    createDataTableQuery(
      createDefaultDataTableState({
        pagination: { pageIndex: 0, pageSize: 10 },
      })
    )
  );
  const [ids, setIds] = useState<ReadonlySet<string>>(() => new Set(['d-2']));
  const [requests, setRequests] = useState(0);

  const onQueryChange = useCallback(
    (event: DataTableQueryChangeEvent) => setQuery(event.query),
    []
  );

  const onSelectionChange = useCallback(
    (event: DataGridServerSelectionChangeEvent) => {
      setRequests((count) => count + 1);
      // The owner decides. `accept: false` below is the honest demonstration that
      // the controlled value wins: the request is heard and refused, and the
      // checkbox does not move.
      if (accept && event.selection?.mode === 'explicit') {
        setIds(event.selection.ids);
      }
    },
    [accept]
  );

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        {accept
          ? 'The owner accepts every request.'
          : 'The owner refuses every request — the controlled value wins.'}{' '}
        Requests seen: <strong>{requests}</strong>. Selected:{' '}
        <strong>{ids.size === 0 ? 'none' : [...ids].join(', ')}</strong>.
      </p>
      <DataGrid
        columns={columns as ColumnDef<Device, unknown>[]}
        rows={devices}
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

const meta = {
  title: 'Components/DataGrid/Server selection',
  component: DataGrid,
  parameters: { layout: 'padded' },
  // Every story renders its own grid, so these args only satisfy `DataGrid`'s
  // two required props.
  args: { columns: columns as ColumnDef<unknown, unknown>[], rows: devices },
  argTypes: {
    columns: { control: false },
    rows: { control: false },
    selection: { control: false },
    server: { control: false },
  },
} satisfies Meta<typeof DataGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The owner accepts each request, so selection behaves as a caller expects. */
export const OwnerAccepts: Story = {
  render: () => <ControlledServerSelection accept />,
};

/**
 * The same grid with the owner refusing. Clicking a checkbox raises the request
 * count and changes nothing else — which is what "controlled" means here, and the
 * one behavior a reader is most likely to assume works the other way.
 */
export const OwnerRefuses: Story = {
  render: () => <ControlledServerSelection accept={false} />,
};

/**
 * `selection.selectAll: 'all-results'` — the scope DataGrid cannot enumerate.
 *
 * The owner issues a token scoped to `query.requestKey` and DataGrid never invents
 * one. Every box is ticked because the token says "everything matches except these
 * exclusions", and a click sends an **exclusion delta** rather than a selection:
 * the count below is the server's total, not the four rows on screen, which is the
 * whole distinction — DataGrid must never label the loaded window as all results.
 */
function AllResultsSelection() {
  const [query] = useState<DataTableQuery>(() =>
    createDataTableQuery(
      createDefaultDataTableState({
        pagination: { pageIndex: 0, pageSize: 10 },
      })
    )
  );
  const [excludedIds, setExcludedIds] = useState<ReadonlySet<string>>(
    () => new Set()
  );

  const TOTAL = 4821;

  const onSelectionChange = useCallback(
    (event: DataGridServerSelectionChangeEvent) => {
      setExcludedIds(
        event.selection?.mode === 'all-results'
          ? event.selection.excludedIds
          : // Deselect-all arrives as `selection: undefined`. A real owner would
            // drop the token; this story keeps it and excludes everything it has,
            // which is enough to show the control returning to its mixed state.
            new Set(devices.map((device) => device.id))
      );
    },
    []
  );

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        <strong>{TOTAL - excludedIds.size}</strong> of {TOTAL} results selected
        {excludedIds.size > 0 ? ` (${excludedIds.size} excluded)` : ''}. Only 4
        rows are loaded — the count comes from the server, never from them.
      </p>
      <DataGrid
        columns={columns as ColumnDef<Device, unknown>[]}
        rows={devices}
        getRowId={(row) => row.id}
        selection={{ mode: 'multiple', selectAll: 'all-results' }}
        server={{
          query,
          rowCount: TOTAL,
          selection: {
            mode: 'all-results',
            queryRequestKey: query.requestKey,
            excludedIds,
            token: 'srv-token-demo',
          },
          onSelectionChange,
          onQueryChange: () => {},
        }}
      />
    </div>
  );
}

/** Everything the query matches, minus exclusions the owner tracks. */
export const AllResults: Story = {
  render: () => <AllResultsSelection />,
};

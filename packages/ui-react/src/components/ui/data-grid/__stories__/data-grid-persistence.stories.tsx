import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ColumnDef } from '@tanstack/react-table';

import { DataGrid } from '../data-grid';
import type { DataTablePersistenceStorage } from '../../data-table/data-table-features/persistence';

// The `persistence` group (U10): stored column preferences behind a versioned
// envelope (design §8).
//
// **This group renders nothing of its own, and that is why it has stories at all.**
// A restore is only visible as the *ordinary* chrome of the slice it restored into
// — a column that is absent because storage said it was hidden, a column that is
// wide because storage said so. So each story below is a grid that looks
// hand-configured and is not: every difference from `NothingStored` comes out of
// the adapter.
//
// The stories use a pre-seeded in-memory adapter rather than `localStorage`,
// deliberately: a story that read real browser storage would render differently on
// its second visit and could not be a visual-regression case at all.

interface Server {
  id: string;
  name: string;
  region: string;
  status: string;
  owner: string;
}

const servers: Server[] = [
  {
    id: '1',
    name: 'api-gateway-01',
    region: 'eu-central-1',
    status: 'Healthy',
    owner: 'Platform',
  },
  {
    id: '2',
    name: 'worker-pool-eu',
    region: 'eu-west-1',
    status: 'Degraded',
    owner: 'Data',
  },
  {
    id: '3',
    name: 'cache-redis-03',
    region: 'us-east-1',
    status: 'Healthy',
    owner: 'Platform',
  },
];

const columns: ColumnDef<Server, unknown>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
  { id: 'region', accessorKey: 'region', header: 'Region' },
  { id: 'status', accessorKey: 'status', header: 'Status' },
  { id: 'owner', accessorKey: 'owner', header: 'Owner' },
];

/** A pre-seeded adapter. `write` is kept so the save path is exercised in the UI. */
function seeded(payload?: unknown): DataTablePersistenceStorage {
  let stored = payload === undefined ? null : JSON.stringify(payload);

  return {
    read: () => stored,
    write: (_key, value) => {
      stored = value;
    },
  };
}

const meta = {
  title: 'Components/DataGrid/Persistence',
  component: DataGrid,
  parameters: { layout: 'padded' },
  args: {
    // The casts follow `data-grid-columns-features.stories.tsx`: `satisfies
    // Meta<typeof DataGrid>` erases the row generic, so meta args are checked
    // against `unknown` rows.
    columns: columns as ColumnDef<unknown, unknown>[],
    rows: servers,
    getRowId: (row: unknown) => (row as Server).id,
    sorting: {},
  },
  argTypes: {
    columns: { control: false },
    rows: { control: false },
    persistence: { control: false },
  },
} satisfies Meta<typeof DataGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Nothing stored: the grid renders exactly as if `persistence` were absent. */
export const NothingStored: Story = {
  args: {
    persistence: { key: 'story-empty', version: 1, storage: seeded() },
  },
};

/**
 * Legacy parity: stored hidden columns and widths, restored before interaction.
 * `Region` is absent and `Name` is wide because storage said so.
 */
export const RestoredColumnPreferences: Story = {
  args: {
    columnsFeatures: { resizing: true },
    persistence: {
      key: 'story-restored',
      version: 1,
      storage: seeded({
        version: 1,
        state: {
          columnVisibility: { region: false },
          columnSizing: { name: 320 },
        },
      }),
    },
  },
};

/**
 * An opted-in `include` set. Sorting is not persisted by default, so this story is
 * the only one whose sort indicator comes out of storage.
 */
export const RestoredSorting: Story = {
  args: {
    persistence: {
      key: 'story-sorting',
      version: 1,
      include: ['sorting', 'columnVisibility'],
      storage: seeded({
        version: 1,
        state: { sorting: [{ id: 'status', desc: true }] },
      }),
    },
  },
};

/**
 * A payload written at an older version with no `migrate`: discarded, and the grid
 * renders its defaults. `onError` is where a caller would log it.
 *
 * Visually identical to `NothingStored` **on purpose** — that is the point of the
 * story, and it is also why this one cannot be verified by screenshot alone. The
 * discard is asserted in
 * `../__tests__/data-grid-persistence.test.tsx` and the engine suite.
 */
export const StalePayloadDiscarded: Story = {
  args: {
    persistence: {
      key: 'story-stale',
      version: 2,
      storage: seeded({
        version: 1,
        state: { columnVisibility: { region: false } },
      }),
      onError: () => undefined,
    },
  },
};

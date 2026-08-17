import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ColumnDef } from '@tanstack/react-table';

import { Button } from '../../button';
import { DataGrid } from '../data-grid';

// PLTFRM-93130's rendered cases, for the layer that can see them.
//
// `docs/contributing/regression-tests.md` routes "visible — colour, spacing,
// alignment" to a story captured by visual regression, and this ticket was a spacing
// defect three times over: a row that changed height when a selection started, a 32px
// control overhanging a 40px cell, and a search box painted on top of a filter
// trigger. `data-grid-toolbar-bulk.browser.test.tsx` asserts each as a measurement;
// these stories are what a diff can show a human.
//
// The pairing is the point. Idle and selected are two stories rather than one story
// with an interaction, because a baseline is a still: two stills of the *same* grid
// with the same fixtures make a height change between them visible as a diff on both,
// and neither one alone could be read as "the table moved".
//
// Every story renders inside a fixed-width host. Width is the variable in two of the
// three defects, so leaving it to the viewport would file a baseline that shifts
// whenever the capture geometry does.

interface Disk {
  readonly id: string;
  readonly name: string;
  readonly status: 'Healthy' | 'Slow';
  readonly type: 'HDD' | 'SSD' | 'NVMe';
  readonly role: 'Cache' | 'Storage' | 'Unassigned';
}

const disks: Disk[] = [
  { id: 'k1', name: 'VDA_1', status: 'Slow', type: 'HDD', role: 'Cache' },
  { id: 'k2', name: 'SDA_1', status: 'Healthy', type: 'SSD', role: 'Storage' },
  { id: 'k3', name: 'SDA_3', status: 'Healthy', type: 'SSD', role: 'Storage' },
  {
    id: 'k4',
    name: 'NVDA_1',
    status: 'Healthy',
    type: 'NVMe',
    role: 'Storage',
  },
  {
    id: 'k5',
    name: 'VDA_2',
    status: 'Healthy',
    type: 'HDD',
    role: 'Unassigned',
  },
];

const columns: ColumnDef<Disk>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'role', header: 'Role' },
];

const bulkActions = [
  { id: 'release', label: 'Release', onAction: () => {} },
  { id: 'blink', label: 'Blink', onAction: () => {} },
  { id: 'unblink', label: 'Unblink', onAction: () => {} },
  {
    id: 'delete',
    label: 'Delete',
    destructive: true,
    onAction: () => {},
  },
];

const filters = {
  columns: [
    { columnId: 'status', label: 'Status', facet: 'unique' as const },
    { columnId: 'type', label: 'Type', facet: 'unique' as const },
  ],
  global: { columnIds: ['name', 'role'], placeholder: 'Search' },
};

const trailing = (
  <>
    <span className="text-sm text-[var(--ui-text-on-surface-secondary)]">
      {disks.length} loaded
    </span>
    <Button>+ Add iSCSI</Button>
  </>
);

/** Fixed width, so the baseline does not move with the capture viewport. */
function Host({
  width,
  children,
}: {
  width: number;
  children: React.ReactNode;
}) {
  return <div style={{ width }}>{children}</div>;
}

const meta = {
  title: 'Internal/DataGrid/Toolbar states',
  component: DataGrid,
  parameters: { layout: 'padded' },
  // Every story renders its own grid inside a fixed-width host, so these args exist
  // only to satisfy `DataGrid`'s two required props — the same shape
  // `data-grid-selection.stories.tsx` uses for the same reason.
  args: { columns: columns as ColumnDef<unknown, unknown>[], rows: disks },
  argTypes: {
    columns: { control: false },
    rows: { control: false },
  },
} satisfies Meta<typeof DataGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The idle row: filter triggers, search, the loaded count and the screen's primary
 * action, all at one height. The gear sits in the trailing column's header, centred in
 * a 40px cell.
 *
 * Read together with `Selected` below — the two baselines are the same grid, so the
 * row's height and the table's position have to match across them.
 */
export const Idle: Story = {
  render: () => (
    <Host width={900}>
      <DataGrid
        columns={columns}
        rows={disks}
        getRowId={(disk) => disk.id}
        selection={{ mode: 'multiple' }}
        filters={filters}
        toolbar={{
          columnFilters: true,
          globalSearch: true,
          viewOptions: true,
          bulkActions,
          trailing,
        }}
      />
    </Host>
  ),
};

/**
 * The same grid with two rows already selected, so the capture lands on the bulk
 * strip: ghost actions with `Delete` last, the count, and the ✕ that clears.
 *
 * Selected through `defaultState` rather than a play function, because a baseline of a
 * post-interaction state depends on the interaction having settled — and the thing
 * being pinned here is the layout, not the click.
 */
export const Selected: Story = {
  render: () => (
    <Host width={900}>
      <DataGrid
        columns={columns}
        rows={disks}
        getRowId={(disk) => disk.id}
        selection={{ mode: 'multiple' }}
        defaultState={{ selection: new Set(['k1', 'k3']) }}
        filters={filters}
        toolbar={{
          columnFilters: true,
          globalSearch: true,
          viewOptions: true,
          bulkActions,
          trailing,
        }}
      />
    </Host>
  ),
};

/**
 * The width where the row used to break: the filter-trigger wrapper overflowed its own
 * box and the search input was drawn on top of a trigger. Nothing here may overlap, and
 * the search is the member that gives way.
 */
export const NarrowIdle: Story = {
  render: () => (
    <Host width={460}>
      <DataGrid
        columns={columns}
        rows={disks}
        getRowId={(disk) => disk.id}
        selection={{ mode: 'multiple' }}
        filters={filters}
        toolbar={{
          columnFilters: true,
          globalSearch: true,
          viewOptions: true,
          bulkActions,
          trailing,
        }}
      />
    </Host>
  ),
};

/**
 * The same narrow width with a selection, where the bulk actions cannot all fit: they
 * collapse into a **More** menu rather than wrapping, because a second line would grow
 * the row and move the table — the defect this ticket fixed.
 */
export const NarrowSelected: Story = {
  render: () => (
    <Host width={460}>
      <DataGrid
        columns={columns}
        rows={disks}
        getRowId={(disk) => disk.id}
        selection={{ mode: 'multiple' }}
        defaultState={{ selection: new Set(['k1', 'k3', 'k4']) }}
        filters={filters}
        toolbar={{
          columnFilters: true,
          globalSearch: true,
          viewOptions: true,
          bulkActions,
          trailing,
        }}
      />
    </Host>
  ),
};

/**
 * The chrome-column gutters that share the 40px cap: the selection checkbox, the row
 * actions `⋯`, and the `⚙` above them. Each control is centred in its own cell, which
 * is what keeps the cell's min-content under the cap — a 32px control with the table's
 * 16px-a-side padding measures 64 and overhangs.
 */
export const ChromeColumns: Story = {
  render: () => (
    <Host width={700}>
      <DataGrid
        columns={columns}
        rows={disks}
        getRowId={(disk) => disk.id}
        selection={{ mode: 'multiple' }}
        actions={{
          items: [
            { id: 'release', label: 'Release' },
            { id: 'delete', label: 'Delete', destructive: true },
          ],
          onAction: () => {},
        }}
        toolbar={{ viewOptions: true }}
      />
    </Host>
  ),
};

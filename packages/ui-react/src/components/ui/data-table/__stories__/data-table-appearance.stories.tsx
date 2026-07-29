import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ColumnDef } from '@tanstack/react-table';

import { useDataTable } from '../data-table-controller';
import { DataTableRoot } from '../data-table-root';
import { DataTableView, type DataTableViewProps } from '../data-table-view';

// `DataTableView` used to render `<Table>` bare inside a hardcoded wrapper, so the
// Table primitive's presentation and scroll-container props were reachable from a
// hand-written composition and unreachable from DataGrid (NB-6). These stories
// exercise the pass-through that closes that gap.
//
// The bounded-height story matters beyond appearance: a bounded scroll container
// is the one precondition windowed rendering cannot supply for itself, and it is
// what makes sticky sections work. The DataGrid-side `appearance` wiring is U9's.

interface Backup {
  id: string;
  plan: string;
  status: string;
  size: string;
}

const backups: Backup[] = [
  { id: 'b-1', plan: 'Daily — Finance', status: 'Completed', size: '412 GB' },
  { id: 'b-2', plan: 'Daily — Legal', status: 'Completed', size: '96 GB' },
  { id: 'b-3', plan: 'Weekly — Archive', status: 'Running', size: '2.1 TB' },
  { id: 'b-4', plan: 'Weekly — Images', status: 'Completed', size: '780 GB' },
  { id: 'b-5', plan: 'Monthly — Vault', status: 'Failed', size: '1.4 TB' },
  { id: 'b-6', plan: 'Hourly — Mail', status: 'Completed', size: '18 GB' },
  { id: 'b-7', plan: 'Hourly — CRM', status: 'Completed', size: '44 GB' },
  { id: 'b-8', plan: 'Daily — Ops', status: 'Running', size: '310 GB' },
];

const columns: ColumnDef<Backup, unknown>[] = [
  { accessorKey: 'plan', header: 'Plan' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'size', header: 'Size' },
];

function AppearanceView(props: DataTableViewProps<Backup>) {
  const controller = useDataTable({
    columns,
    data: backups,
    getRowId: (row) => row.id,
  });

  return (
    <DataTableRoot table={controller}>
      <DataTableView<Backup> {...props} />
    </DataTableRoot>
  );
}

const meta = {
  title: 'Components/DataTable/Appearance pass-through',
  component: AppearanceView,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof AppearanceView>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every pass-through prop omitted — the shipped default output. */
export const Default: Story = { args: {} };

export const SizeSmall: Story = { args: { size: 'small' } };

export const SizeLarge: Story = { args: { size: 'large' } };

/** The four surface variants. Each also publishes the sticky-cell surface. */
export const BackgroundAccent: Story = { args: { background: 'accent' } };

export const BackgroundSubtle: Story = { args: { background: 'subtle' } };

export const BackgroundSurface: Story = { args: { background: 'surface' } };

/** Border dimensions are independent (design §5.2 `BorderConfig`). */
export const BordersVerticalOnly: Story = {
  args: {
    borders: { top: false, bottom: false, horizontal: false, vertical: true },
  },
};

export const BordersAll: Story = {
  args: {
    borders: { top: true, bottom: true, horizontal: true, vertical: true },
  },
};

/**
 * A bounded container plus a pinned header. `maxHeight` is what sets
 * `data-bounded` on the scroll container, which is both the sticky precondition
 * and the seam U6's windowing keys off.
 */
export const BoundedWithStickyHeader: Story = {
  args: { maxHeight: 220, stickyHeader: true },
};

/** Hides the header row while keeping the column model and body semantics. */
export const HeaderHidden: Story = { args: { showHeader: false } };

/**
 * The class/style resolvers, each receiving its own typed render context — the
 * row's data for `rowClassName`, the column id for `cellClassName`/`headerStyle`.
 */
export const ClassAndStyleResolvers: Story = {
  args: {
    rowClassName: (row) =>
      row.data.status === 'Failed'
        ? 'bg-[var(--ui-background-status-critical)]'
        : undefined,
    cellClassName: (cell) =>
      cell.columnId === 'size' ? 'text-end tabular-nums' : undefined,
    headerClassName: (header) =>
      header.columnId === 'size' ? 'text-end' : undefined,
    headerStyle: (header) =>
      header.columnId === 'status' ? { width: '30%' } : undefined,
  },
};

/** Everything at once, to catch interactions between the clusters. */
export const Combined: Story = {
  args: {
    size: 'small',
    background: 'surface',
    borders: { top: false, bottom: false, horizontal: true, vertical: true },
    maxHeight: 200,
    stickyHeader: true,
    striped: true,
  },
};

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

// The `pagination` group's three presentation members (U8) and the two
// directional capabilities on `server` they depend on.
//
// The controls live in `../data-grid-pagination.tsx`, DataGrid's own pagination
// row, rather than in the frozen `DataTablePagination` adapter — the same reason
// the toolbar row is DataGrid's (plan §0.1). At the defaults the two render
// identical markup, which is what keeps the existing DataGrid baselines valid;
// only the stories below opt into a difference.

interface Incident {
  id: string;
  summary: string;
  severity: string;
}

const PAGE_SIZE = 5;

const incidents: Incident[] = Array.from({ length: 23 }, (_, index) => ({
  id: `INC-${1000 + index}`,
  summary: `Backup task ${index + 1} failed to complete`,
  severity: index % 3 === 0 ? 'Critical' : index % 3 === 1 ? 'Warning' : 'Info',
}));

const columns: ColumnDef<Incident>[] = [
  { accessorKey: 'id', header: 'Incident' },
  { accessorKey: 'summary', header: 'Summary' },
  { accessorKey: 'severity', header: 'Severity' },
];

/**
 * A cursor-style backend: it answers "is there another page" but never "how
 * many". That is the whole case for `unknownTotal` — and note what the grid would
 * otherwise show, because it is not a blank: with manual pagination and no
 * totals, TanStack derives a page count from the rows it was handed, so a 23-row
 * result served 5 at a time announces "Page 1 of 1" and disables Next.
 */
function UnknownTotalGrid({ showPageSize = true }: { showPageSize?: boolean }) {
  const [query, setQuery] = useState<DataTableQuery>(() =>
    createDataTableQuery(
      createDefaultDataTableState({
        pagination: { pageIndex: 0, pageSize: PAGE_SIZE },
      })
    )
  );

  const onQueryChange = useCallback(
    (event: DataTableQueryChangeEvent) => setQuery(event.query),
    []
  );

  const { pageIndex } = query.pagination;
  const window = incidents.slice(
    pageIndex * PAGE_SIZE,
    pageIndex * PAGE_SIZE + PAGE_SIZE
  );

  return (
    <DataGrid
      columns={columns as ColumnDef<Incident, unknown>[]}
      rows={window}
      getRowId={(row) => row.id}
      pagination={{ unknownTotal: true, showPageSize }}
      server={{
        query,
        // The capabilities the owner can answer without knowing the total.
        hasNextPage: (pageIndex + 1) * PAGE_SIZE < incidents.length,
        hasPreviousPage: pageIndex > 0,
        onQueryChange,
      }}
    />
  );
}

const meta = {
  title: 'Components/DataGrid/Pagination',
  component: DataGrid,
  parameters: { layout: 'padded' },
  // Every story renders its own grid, so these args only satisfy `DataGrid`'s
  // two required props.
  args: { columns: columns as ColumnDef<unknown, unknown>[], rows: incidents },
  argTypes: {
    columns: { control: false },
    rows: { control: false },
    pagination: { control: false },
    server: { control: false },
  },
} satisfies Meta<typeof DataGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The defaults: page-size select and first/last both present, total known. */
export const Default: Story = {
  render: () => (
    <DataGrid
      columns={columns as ColumnDef<Incident, unknown>[]}
      rows={incidents}
      getRowId={(row) => row.id}
      pagination={{ pageSize: PAGE_SIZE }}
    />
  ),
};

/** `showPageSize: false` — a screen that fixes the page size itself. */
export const WithoutPageSize: Story = {
  render: () => (
    <DataGrid
      columns={columns as ColumnDef<Incident, unknown>[]}
      rows={incidents}
      getRowId={(row) => row.id}
      pagination={{ pageSize: PAGE_SIZE, showPageSize: false }}
    />
  ),
};

/** `showFirstLast: false` — previous/next only, for a narrow footer. */
export const WithoutFirstLast: Story = {
  render: () => (
    <DataGrid
      columns={columns as ColumnDef<Incident, unknown>[]}
      rows={incidents}
      getRowId={(row) => row.id}
      pagination={{ pageSize: PAGE_SIZE, showFirstLast: false }}
    />
  ),
};

/**
 * `unknownTotal` in the only configuration where it is valid: server mode with
 * both directional capabilities. No page count is announced and first/last are
 * gone — there is no last page to address. Paging forward works to the end of the
 * data, at which point Next disables from `hasNextPage` rather than from any
 * count.
 */
export const UnknownTotal: Story = {
  render: () => <UnknownTotalGrid />,
};

/** The same, with the page-size select dropped as a cursor API usually would. */
export const UnknownTotalWithoutPageSize: Story = {
  render: () => <UnknownTotalGrid showPageSize={false} />,
};

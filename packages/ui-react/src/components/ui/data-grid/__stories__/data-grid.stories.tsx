import { useRef, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../button';
import {
  createDataTableQuery,
  createDefaultDataTableState,
} from '../../data-table';
import { Tag } from '../../tag';
import { DataGrid } from '../data-grid';

type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

const payments: Payment[] = [
  { id: 'p1', amount: 316, status: 'success', email: 'ken99@example.com' },
  { id: 'p2', amount: 242, status: 'success', email: 'abe45@example.com' },
  {
    id: 'p3',
    amount: 837,
    status: 'processing',
    email: 'monserrat@example.com',
  },
  { id: 'p4', amount: 721, status: 'failed', email: 'carmella@example.com' },
  { id: 'p5', amount: 459, status: 'pending', email: 'silas22@example.com' },
];

const columns: ColumnDef<Payment>[] = [
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <Tag>{row.original.status}</Tag>,
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(row.original.amount),
  },
];

const meta = {
  title: 'Components/DataGrid',
  component: DataGrid,
  parameters: { layout: 'padded' },
  args: { columns: columns as ColumnDef<unknown, unknown>[], rows: payments },
  argTypes: {
    columns: { control: false, table: { category: 'Data' } },
    rows: { control: false, table: { category: 'Data' } },
    state: {
      control: 'inline-radio',
      options: ['loaded', 'loading', 'empty', 'error'],
      description:
        'Data state — rows, skeletons, the empty message, or an error alert.',
      table: { category: 'State' },
    },
    error: { control: 'text', table: { category: 'State' } },
    server: { control: false, table: { category: 'Data' } },
    chrome: { control: false, table: { category: 'Features' } },
    selection: { control: false, table: { category: 'Config' } },
    sorting: { control: false, table: { category: 'Config' } },
    appearance: { control: false, table: { category: 'Config' } },
    dataState: { control: false, table: { category: 'Config' } },
    rowInteraction: { control: false, table: { category: 'Config' } },
    presets: { control: false, table: { category: 'Config' } },
    callbacks: { control: false, table: { category: 'Events' } },
    selectable: {
      control: 'boolean',
      description: 'Prepend a selection checkbox column.',
      table: { category: 'Features' },
    },
    selectionMode: {
      control: 'inline-radio',
      options: ['multiple', 'single'],
      description: 'Selection mode when selectable.',
      table: { category: 'Features' },
    },
    sortable: {
      control: 'boolean',
      description: 'Present sortable column headers (single-column sort).',
      table: { category: 'Features' },
    },
    actions: { control: false, table: { category: 'Features' } },
    bulkActions: { control: false, table: { category: 'Features' } },
    getRowId: { control: false, table: { category: 'Data' } },
    isRowSelectable: { control: false, table: { category: 'Features' } },
    multiSort: {
      control: 'boolean',
      description: 'Allow multi-column sort (Shift-activate a header to add).',
      table: { category: 'Features' },
    },
    filters: { control: false, table: { category: 'Features' } },
    toolbar: {
      control: 'boolean',
      description:
        'Show the built-in toolbar. The object form picks its members: ' +
        '`globalSearch` (default false), `columnFilters` (default false), ' +
        '`viewOptions` (default true), `bulkActions`.',
      table: { category: 'Features' },
    },
    searchKey: { control: 'text', table: { category: 'Features' } },
    pagination: {
      control: 'boolean',
      description: 'Show the built-in pagination footer.',
      table: { category: 'Features' },
    },
    striped: { control: 'boolean', table: { category: 'Appearance' } },
    onRowClick: { control: false, table: { category: 'Events' } },
  },
} satisfies Meta<typeof DataGrid>;
export default meta;
type Story = StoryObj<typeof meta>;

// The plain grid: columns + rows, nothing else.
export const Default: Story = {};

// Batteries-included: toolbar (search + column visibility), selection, pagination.
export const FullFeatured: Story = {
  args: {
    selectable: true,
    toolbar: true,
    searchKey: 'email',
    searchPlaceholder: 'Filter emails…',
    pagination: true,
    pageSize: 10,
  },
};

// Leading selection checkbox column.
export const Selectable: Story = { args: { selectable: true } };

// Loading placeholder rows.
export const Loading: Story = { args: { state: 'loading' } };

// Empty state.
export const Empty: Story = {
  args: { rows: [], emptyMessage: 'No payments yet.' },
};

// Error state with a retry action.
export const ErrorState: Story = {
  args: {
    state: 'error',
    error: 'Could not load payments. Check your connection and try again.',
    onRetry: () => {},
  },
};

// Grouped-config API: the preferred object-form props (the flat props are
// deprecated aliases that normalize into these).
export const GroupedConfig: Story = {
  args: {
    getRowId: (row) => (row as Payment).id,
    selection: { mode: 'multiple' },
    sorting: { mode: 'multiple' },
    appearance: { striped: true },
    rowInteraction: { current: true },
    filters: {
      columns: [{ columnId: 'email', label: 'Email', operators: ['contains'] }],
      global: { columnId: 'email', placeholder: 'Search emails…' },
    },
    toolbar: { globalSearch: true, columnFilters: true },
    pagination: { pageSize: 3, pageSizeOptions: [3, 5] },
  },
};

// External chrome: DataGrid suppresses its built-in toolbar/pagination and hands
// the shared controller to a custom renderer.
export const ExternalChrome: Story = {
  args: {
    selectable: true,
    getRowId: (row) => (row as Payment).id,
    chrome: {
      mode: 'external',
      render: (context) => (
        <div className="text-sm font-medium text-foreground">
          {context.selectedRows.length} selected · custom chrome owns the
          toolbar
        </div>
      ),
    },
  },
};

// All-manual server mode: the story owns the query and pre-slices the rows;
// DataGrid emits onQueryChange as the user paginates/sorts.
export const Server: Story = {
  render: (args) => {
    const pageSize = 2;
    const [query, setQuery] = useState(() =>
      createDataTableQuery(
        createDefaultDataTableState({ pagination: { pageIndex: 0, pageSize } })
      )
    );
    const { pageIndex } = query.pagination;
    const pageRows = payments.slice(
      pageIndex * pageSize,
      pageIndex * pageSize + pageSize
    );

    return (
      <DataGrid
        {...args}
        columns={columns as ColumnDef<unknown, unknown>[]}
        rows={pageRows}
        getRowId={(row) => (row as Payment).id}
        sortable
        server={{
          query,
          pageCount: Math.ceil(payments.length / pageSize),
          onQueryChange: (event) => setQuery(event.query),
        }}
      />
    );
  },
};

// Alternating row backgrounds.
export const Striped: Story = { args: { striped: true } };

// Sortable column headers — click to cycle a single column's sort.
export const Sortable: Story = { args: { sortable: true } };

// Multi-column sort — Shift-activate additional headers; each sorted header
// shows its 1-based priority.
export const MultiSort: Story = { args: { multiSort: true } };

// Current-row roving focus — click or arrow-key a row; Enter activates it.
export const CurrentRow: Story = {
  args: { currentRow: true, getRowId: (row) => (row as Payment).id },
};

// Single-select mode — no header select-all; one row at a time.
export const SingleSelection: Story = {
  args: {
    selectable: true,
    selectionMode: 'single',
    getRowId: (row) => (row as Payment).id,
  },
};

// Per-row action menu; the destructive action routes through a confirm dialog.
export const RowActions: Story = {
  args: {
    getRowId: (row) => (row as Payment).id,
    actions: {
      items: [
        { id: 'view', label: 'View details' },
        { id: 'copy', label: 'Copy email' },
        {
          id: 'delete',
          label: 'Delete',
          destructive: true,
          confirm: {
            title: 'Delete payment?',
            description: 'This permanently removes the payment record.',
            confirmLabel: 'Delete',
          },
        },
      ],
      onAction: () => {},
    },
  },
};

// Selection + bulk-action bar (destructive action confirmed).
export const BulkActions: Story = {
  args: {
    selectable: true,
    getRowId: (row) => (row as Payment).id,
    bulkActions: [
      { id: 'export', label: 'Export', onAction: () => {} },
      {
        id: 'delete',
        label: 'Delete',
        destructive: true,
        confirm: { title: 'Delete selected payments?', confirmLabel: 'Delete' },
        onAction: () => {},
      },
    ],
  },
};

// The typed actions escape hatch: `render` owns the whole cell (here inline
// controls instead of a menu) and still isolates row click/selection.
export const CustomRowActions: Story = {
  args: {
    getRowId: (row) => (row as Payment).id,
    actions: {
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="secondary" className="h-8">
            Refund
          </Button>
          <Button variant="ghost" className="h-8">
            {(row as Payment).status === 'failed' ? 'Retry' : 'View'}
          </Button>
        </div>
      ),
      onAction: () => {},
    },
  },
};

// Presets: named grouped-config bundles. `apply` composes them left-to-right and
// `detect` infers one from the initial data; anything passed explicitly wins.
export const Presets: Story = {
  args: {
    getRowId: (row) => (row as Payment).id,
    presets: {
      definitions: [
        {
          id: 'reviewable',
          config: {
            selection: { mode: 'multiple' },
            sorting: { mode: 'single' },
            toolbar: { globalSearch: true },
            filters: { global: { columnId: 'email', placeholder: 'Search…' } },
          },
        },
        {
          id: 'paged',
          config: { pagination: { pageSize: 3, pageSizeOptions: [3, 5] } },
        },
      ],
      apply: ['reviewable'],
      // Long result sets page themselves without the caller asking.
      detect: ({ rows }) => (rows.length > 3 ? ['paged'] : []),
    },
  },
};

// Named callbacks: what a screen binds to. Each carries the enriched event, so
// the log below shows the slice/cause a real screen would react to.
export const NamedCallbacks: Story = {
  render: (args) => {
    const [log, setLog] = useState<{ id: number; text: string }[]>([]);
    // Entries repeat (two identical selection events), so they carry their own
    // id rather than keying off the array index.
    const nextId = useRef(0);
    const note = (text: string) =>
      setLog((previous) =>
        [{ id: nextId.current++, text }, ...previous].slice(0, 4)
      );

    return (
      <div className="flex flex-col gap-3">
        <DataGrid
          {...args}
          columns={columns as ColumnDef<unknown, unknown>[]}
          rows={payments}
          getRowId={(row) => (row as Payment).id}
          selection={{ mode: 'multiple' }}
          sorting={{ mode: 'single' }}
          pagination={{ pageSize: 3 }}
          callbacks={{
            onSelectionChange: (event) =>
              note(`selection (${event.cause}) → ${event.value.size} row(s)`),
            onPaginationChange: (event) =>
              note(`pagination → page ${event.value.pageIndex + 1}`),
            onQueryChange: (event) =>
              note(`query → ${event.query.sorting.length} sort(s)`),
            onRowClick: (event) => note(`rowClick → ${event.row.id}`),
          }}
        />
        <ul className="text-sm text-[var(--ui-text-on-surface-secondary)]">
          {log.length === 0 ? (
            <li>No events yet — select, sort, or page the grid.</li>
          ) : (
            log.map((entry) => <li key={entry.id}>{entry.text}</li>)
          )}
        </ul>
      </div>
    );
  },
};

// Operator-driven column filters with applied-filter chips and reset.
// `filters` *defines* the controls; `toolbar.columnFilters` *surfaces* them
// (design §5.2 defaults it to false).
export const ColumnFilters: Story = {
  args: {
    toolbar: { columnFilters: true },
    filters: [
      {
        columnId: 'email',
        label: 'Email',
        operators: ['contains', 'startsWith', 'equals'],
      },
      {
        columnId: 'status',
        label: 'Status',
        operators: ['equals', 'in', 'isNotEmpty'],
      },
      {
        columnId: 'amount',
        label: 'Amount',
        operators: ['greaterThan', 'lessThan', 'equals'],
      },
    ],
  },
};

// The toolbar's own members (design §5.2). `columnFilters` defaults to false and
// `viewOptions` to true; this picks search + filter controls and drops the
// column-visibility menu, which shipped code always rendered.
export const ToolbarMembers: Story = {
  args: {
    getRowId: (row) => (row as Payment).id,
    filters: {
      columns: [
        { columnId: 'status', label: 'Status', operators: ['equals', 'in'] },
      ],
      global: { columnId: 'email', placeholder: 'Search emails…' },
    },
    toolbar: { globalSearch: true, columnFilters: true, viewOptions: false },
  },
};

// Controlled state: the screen owns the selection slice. A slice present in
// `state` is controlled — DataGrid emits the change event but commits nothing, so
// the checkbox only moves once the screen applies it (design §3.2). Toggling
// "reject every request" shows the difference.
export const ControlledState: Story = {
  render: (args) => {
    const [selection, setSelection] = useState<ReadonlySet<string>>(
      () => new Set(['p1'])
    );
    const [apply, setApply] = useState(true);

    return (
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={apply}
            onChange={(event) => setApply(event.target.checked)}
          />
          Apply requested changes
        </label>
        <DataGrid
          {...args}
          columns={columns as ColumnDef<unknown, unknown>[]}
          rows={payments}
          getRowId={(row) => (row as Payment).id}
          selection={{ mode: 'multiple' }}
          state={{ selection }}
          callbacks={{
            onSelectionChange: (event) => {
              if (apply) setSelection(event.value);
            },
          }}
        />
        <p className="text-sm text-[var(--ui-text-on-surface-secondary)]">
          {selection.size} selected · the grid holds no selection state of its
          own
        </p>
      </div>
    );
  },
};

// Uncontrolled with an initial value: `defaultState` seeds a slice once, then the
// grid owns it. A caller slice here beats a group default, so this page size wins
// over `pagination.pageSize`.
export const DefaultState: Story = {
  args: {
    getRowId: (row) => (row as Payment).id,
    selection: { mode: 'multiple' },
    pagination: { pageSize: 5 },
    defaultState: {
      selection: new Set(['p2', 'p4']),
      pagination: { pageIndex: 0, pageSize: 3 },
    },
  },
};

// Detail expansion: a caller-rendered panel beneath an expanded record. The
// expander is a system column behind the selection checkbox; `aria-controls`
// points at the panel only while it is mounted (design §7). A detail row consumes
// no pagination slot — page size counts records, not panels.
export const DetailExpansion: Story = {
  args: {
    getRowId: (row) => (row as Payment).id,
    selection: { mode: 'multiple' },
    pagination: { pageSize: 3 },
    detailExpansion: {
      render: (row) => {
        const payment = row as Payment;
        return (
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
            <dt className="text-[var(--ui-text-on-surface-secondary)]">
              Payment id
            </dt>
            <dd className="font-medium">{payment.id}</dd>
            <dt className="text-[var(--ui-text-on-surface-secondary)]">
              Email
            </dt>
            <dd>{payment.email}</dd>
            <dt className="text-[var(--ui-text-on-surface-secondary)]">
              Status
            </dt>
            <dd>{payment.status}</dd>
          </dl>
        );
      },
    },
  },
};

// Accordion mode keeps at most one panel open — opening a second closes the
// first. Proposed-only in the design; `multiple` is the shipped default.
export const DetailExpansionAccordion: Story = {
  args: {
    getRowId: (row) => (row as Payment).id,
    detailExpansion: {
      mode: 'accordion',
      // Only failed payments carry a reason to inspect.
      isExpandable: (row) => (row as Payment).status !== 'success',
      render: (row) => (
        <span className="text-sm">
          Latest attempt for {(row as Payment).email} —{' '}
          {(row as Payment).status}
        </span>
      ),
    },
  },
};

// Faceted filter options: `facet: 'unique'` asks the engine for a column's
// distinct values *and their counts*, taken from the pre-filter row model — so the
// option list keeps showing every choice, with accurate counts, while a filter is
// applied. `facet` can also be a fixed list, which offers options that occur in no
// row (here `refunded`).
export const FacetedFilters: Story = {
  args: {
    getRowId: (row) => (row as Payment).id,
    toolbar: { columnFilters: true },
    filters: {
      columns: [
        {
          columnId: 'status',
          label: 'Status',
          operators: ['equals'],
          facet: ['pending', 'processing', 'success', 'failed', 'refunded'],
        },
        {
          columnId: 'email',
          label: 'Email',
          operators: ['equals'],
          facet: 'unique',
        },
      ],
    },
  },
};

// Multi-column global search: one query, matched case-insensitively across every
// column in `columnIds`. Typing `success` matches on status; typing `ken` matches
// on email — the caller never says which column a term belongs to. The query
// descriptor stays `{ q, columnIds }`, so server mode round-trips it unchanged.
export const GlobalSearchAcrossColumns: Story = {
  args: {
    getRowId: (row) => (row as Payment).id,
    filters: {
      global: {
        columnIds: ['email', 'status'],
        placeholder: 'Search email or status…',
      },
    },
    toolbar: { globalSearch: true },
  },
};

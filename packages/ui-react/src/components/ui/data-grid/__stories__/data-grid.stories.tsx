import type { ColumnDef } from '@tanstack/react-table';
import type { Meta, StoryObj } from '@storybook/react-vite';

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
      options: ['loaded', 'loading', 'empty'],
      description:
        'Data state — renders rows, skeletons, or the empty message.',
      table: { category: 'State' },
    },
    selectable: {
      control: 'boolean',
      description: 'Prepend a selection checkbox column.',
      table: { category: 'Features' },
    },
    toolbar: {
      control: 'boolean',
      description: 'Show the built-in toolbar (search + column visibility).',
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

// Alternating row backgrounds.
export const Striped: Story = { args: { striped: true } };

import type { ColumnDef } from '@tanstack/react-table';
import { Tag } from '@constructor-lab/ui-react';

// Shared fixture + columns for the DataTable state demos. DataTable is the
// headless engine composed over the Table primitives; these demos exercise its
// shipped presentational props (expansion, current-row, striped/bordered,
// skeleton) against one dataset.

export interface Invoice {
  id: string;
  customer: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  amount: number;
  note: string;
}

export const invoices: Invoice[] = [
  {
    id: 'INV-1001',
    customer: 'Acme Corp',
    status: 'Paid',
    amount: 1250,
    note: 'Annual subscription renewal.',
  },
  {
    id: 'INV-1002',
    customer: 'Globex',
    status: 'Pending',
    amount: 480,
    note: 'Awaiting PO confirmation.',
  },
  {
    id: 'INV-1003',
    customer: 'Initech',
    status: 'Overdue',
    amount: 2100,
    note: 'Second reminder sent.',
  },
  {
    id: 'INV-1004',
    customer: 'Umbrella',
    status: 'Paid',
    amount: 760,
    note: 'Paid via wire transfer.',
  },
  {
    id: 'INV-1005',
    customer: 'Soylent',
    status: 'Pending',
    amount: 340,
    note: 'Net 30 terms.',
  },
];

const statusVariant: Record<
  Invoice['status'],
  'success' | 'warning' | 'danger'
> = {
  Paid: 'success',
  Pending: 'warning',
  Overdue: 'danger',
};

export const invoiceColumns: ColumnDef<Invoice>[] = [
  { accessorKey: 'id', header: 'Invoice' },
  { accessorKey: 'customer', header: 'Customer' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Tag size="sm" variant={statusVariant[row.original.status]}>
        {row.original.status}
      </Tag>
    ),
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

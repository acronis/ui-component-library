'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { DataGrid, Tag } from '@constructor-lab/ui-react';

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

export function DataGridDemo() {
  return (
    <DataGrid
      columns={columns}
      rows={payments}
      getRowId={(row) => row.id}
      selection={{ mode: 'multiple' }}
      sorting={{ mode: 'multiple' }}
      toolbar={{ globalSearch: true }}
      filters={{ global: { columnId: 'email', placeholder: 'Filter emails…' } }}
      pagination={{ pageSize: 3, pageSizeOptions: [3, 5] }}
    />
  );
}

import type { ColumnDef } from '@tanstack/react-table';
import { Tag } from '@constructor-lab/ui-react';

// Shared fixture + columns for the DataGrid demos. DataGrid is the
// batteries-included composite: you hand it `columns` + `rows` and it assembles
// the whole approved layout (toolbar, grid, selection, states, pagination).

export interface Device {
  id: string;
  name: string;
  type: 'Server' | 'Workstation' | 'Mobile';
  status: 'Protected' | 'At risk' | 'Error';
  lastBackup: string;
  storage: number;
}

export const devices: Device[] = [
  {
    id: 'd1',
    name: 'web-server-01',
    type: 'Server',
    status: 'Protected',
    lastBackup: '2 min ago',
    storage: 128,
  },
  {
    id: 'd2',
    name: 'db-primary',
    type: 'Server',
    status: 'Protected',
    lastBackup: '11 min ago',
    storage: 512,
  },
  {
    id: 'd3',
    name: 'laptop-anna',
    type: 'Workstation',
    status: 'At risk',
    lastBackup: '3 days ago',
    storage: 64,
  },
  {
    id: 'd4',
    name: 'kiosk-lobby',
    type: 'Workstation',
    status: 'Protected',
    lastBackup: '1 hour ago',
    storage: 32,
  },
  {
    id: 'd5',
    name: 'mail-relay',
    type: 'Server',
    status: 'Error',
    lastBackup: 'Failed',
    storage: 96,
  },
  {
    id: 'd6',
    name: 'phone-ceo',
    type: 'Mobile',
    status: 'Protected',
    lastBackup: '5 min ago',
    storage: 12,
  },
  {
    id: 'd7',
    name: 'build-agent-2',
    type: 'Server',
    status: 'Protected',
    lastBackup: '20 min ago',
    storage: 200,
  },
  {
    id: 'd8',
    name: 'desktop-support',
    type: 'Workstation',
    status: 'At risk',
    lastBackup: '2 days ago',
    storage: 48,
  },
];

const statusVariant: Record<
  Device['status'],
  'success' | 'warning' | 'danger'
> = {
  Protected: 'success',
  'At risk': 'warning',
  Error: 'danger',
};

export const deviceColumns: ColumnDef<Device>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'type', header: 'Type' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Tag size="sm" variant={statusVariant[row.original.status]}>
        {row.original.status}
      </Tag>
    ),
  },
  { accessorKey: 'lastBackup', header: 'Last backup' },
  {
    accessorKey: 'storage',
    header: 'Storage',
    cell: ({ row }) => `${row.original.storage} GB`,
  },
];

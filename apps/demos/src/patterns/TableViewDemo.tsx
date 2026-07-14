import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Button,
  DataTable,
  Filter,
  InputSearch,
  PageHeader,
  PageHeaderActions,
  PageHeaderRow,
  PageHeaderTitle,
  Tag,
} from '@constructor-lab/ui-react';

type Device = {
  id: string;
  name: string;
  type: string;
  status: 'protected' | 'at-risk' | 'offline';
};

const devices: Device[] = [
  { id: 'd1', name: 'db-prod-01', type: 'Server', status: 'protected' },
  { id: 'd2', name: 'web-eu-03', type: 'Server', status: 'at-risk' },
  { id: 'd3', name: 'laptop-ada', type: 'Workstation', status: 'protected' },
  { id: 'd4', name: 'nas-backup-1', type: 'Storage', status: 'offline' },
  {
    id: 'd5',
    name: 'vm-staging-7',
    type: 'Virtual machine',
    status: 'protected',
  },
];

const STATUS_VARIANT = {
  protected: 'success',
  'at-risk': 'warning',
  offline: 'neutral',
} as const;

const columns: ColumnDef<Device>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'type', header: 'Type' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Tag variant={STATUS_VARIANT[row.original.status]}>
        {row.original.status}
      </Tag>
    ),
  },
];

export function TableViewDemo() {
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return devices;
    return devices.filter(
      (d) =>
        d.name.toLowerCase().includes(q) || d.type.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="flex w-full flex-col gap-4">
      <PageHeader>
        <PageHeaderRow>
          <PageHeaderTitle>Devices</PageHeaderTitle>
          <PageHeaderActions>
            <Button>Add device</Button>
          </PageHeaderActions>
        </PageHeaderRow>
      </PageHeader>
      <div className="flex items-center gap-2">
        <InputSearch
          className="max-w-xs"
          placeholder="Search devices…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Filter count={2}>Status</Filter>
        <Filter>Type</Filter>
      </div>
      <DataTable columns={columns} data={rows} />
    </div>
  );
}

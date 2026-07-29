import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@constructor-lab/ui-react';

// "Default table / Sortable by default" + the A-Z / Z-A sorted states from the
// Figma "Basic table behavior" section. Columns are sortable by default; the
// header owns the affordance (icon + `aria-sort`) via the Table primitive's
// `sortable` / `sortDirection` / `onSort` props, while the consumer owns the
// sorting logic. Clicking a header cycles asc -> desc -> unsorted.

interface Server {
  name: string;
  location: string;
  size: number;
}

const servers: Server[] = [
  { name: 'web-server-01', location: 'Frankfurt', size: 128 },
  { name: 'db-primary', location: 'Dublin', size: 512 },
  { name: 'cache-node-3', location: 'Singapore', size: 64 },
  { name: 'api-gateway', location: 'Oregon', size: 256 },
  { name: 'backup-vault', location: 'Frankfurt', size: 1024 },
];

type SortKey = keyof Server;
type SortDirection = 'asc' | 'desc' | false;

export function TableColumnSort() {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [direction, setDirection] = useState<SortDirection>('asc');

  // Cycle the clicked column asc -> desc -> unsorted; switching columns starts
  // a fresh ascending sort.
  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setDirection('asc');
      return;
    }
    setDirection((prev) =>
      prev === 'asc' ? 'desc' : prev === 'desc' ? false : 'asc'
    );
  };

  const sorted = useMemo(() => {
    if (!direction) return servers;
    return [...servers].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv));
      return direction === 'asc' ? cmp : -cmp;
    });
  }, [sortKey, direction]);

  const dirFor = (key: SortKey): SortDirection =>
    sortKey === key ? direction : false;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              sortable
              sortDirection={dirFor('name')}
              onSort={() => toggleSort('name')}
            >
              Name
            </TableHead>
            <TableHead
              sortable
              sortDirection={dirFor('location')}
              onSort={() => toggleSort('location')}
            >
              Location
            </TableHead>
            <TableHead
              sortable
              sortDirection={dirFor('size')}
              onSort={() => toggleSort('size')}
              className="text-right"
            >
              Size (GB)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((server) => (
            <TableRow key={server.name}>
              <TableCell className="font-medium">{server.name}</TableCell>
              <TableCell>{server.location}</TableCell>
              <TableCell className="text-right">{server.size}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

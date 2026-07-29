// Shared fixture for the scroll demos (TableScrollable, TableSticky). Enough
// rows and wide-enough columns that the table overflows both axes inside a
// bounded viewport, so the scrollbars are actually exercised.

export interface ScrollRow {
  id: number;
  hostname: string;
  ip: string;
  os: string;
  agent: string;
  lastBackup: string;
  plan: string;
  storage: string;
  location: string;
}

export interface ScrollColumn {
  key: keyof ScrollRow;
  label: string;
  minWidth: number;
}

export const scrollColumns: ScrollColumn[] = [
  { key: 'hostname', label: 'Hostname', minWidth: 180 },
  { key: 'ip', label: 'IP address', minWidth: 140 },
  { key: 'os', label: 'Operating system', minWidth: 200 },
  { key: 'agent', label: 'Agent version', minWidth: 140 },
  { key: 'lastBackup', label: 'Last backup', minWidth: 140 },
  { key: 'plan', label: 'Protection plan', minWidth: 160 },
  { key: 'storage', label: 'Storage used', minWidth: 140 },
  { key: 'location', label: 'Location', minWidth: 160 },
];

const OSES = [
  'Ubuntu 22.04',
  'Windows Server 2022',
  'Alpine 3.19',
  'macOS 14',
  'RHEL 9',
];
const PLANS = ['Advanced', 'Standard', 'Essentials'];
const LOCATIONS = ['Frankfurt', 'Dublin', 'Singapore', 'Oregon', 'São Paulo'];
const BACKUPS = [
  '2 min ago',
  '11 min ago',
  '1 hour ago',
  '3 hours ago',
  'Yesterday',
];

export const scrollRows: ScrollRow[] = Array.from({ length: 30 }, (_, i) => {
  const n = i + 1;
  return {
    id: n,
    hostname: `host-${String(n).padStart(2, '0')}`,
    ip: `10.0.${Math.floor(i / 10)}.${(i % 254) + 1}`,
    os: OSES[i % OSES.length],
    agent: `15.0.${34120 - (i % 5) * 10}`,
    lastBackup: BACKUPS[i % BACKUPS.length],
    plan: PLANS[i % PLANS.length],
    storage: `${64 + i * 8} GB`,
    location: LOCATIONS[i % LOCATIONS.length],
  };
});

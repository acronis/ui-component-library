import { Fragment, type ReactNode, useMemo, useState } from 'react';
import {
  ButtonIcon,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@constructor-lab/ui-react';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CircleBanIcon,
  CircleCheckIcon,
  CirclePlayIcon,
  CircleTimesIcon,
  CircleWarningIcon,
  CloudIcon,
  FlagIcon,
  MonitorIcon,
  UsersIcon,
} from '@constructor-lab/icons-react/stroke-mono';

// "Compliance - expandable rows" (Figma node 6443-18980): a compliance
// safeguard table whose rows expand into a detail panel — description,
// standards, estimated effort, and a nested collapsible "How to fix?" step.
// Built from the Table primitive with local expansion state (Table stays
// presentational; the owner drives expansion). The expander lives in the
// Safeguard cell; the detail renders in a full-width row beneath the parent.

type StatusKind =
  'implemented' | 'not-implemented' | 'partial' | 'plan' | 'not-applicable';

interface Fix {
  title: string;
  detail: string;
}

interface Safeguard {
  id: string;
  title: string;
  status: StatusKind;
  statusLabel: string;
  type: 'Detect' | 'Protect' | 'Recover' | 'Respond' | 'Identify';
  responsible: 'MSP' | 'Customer';
  asset: 'monitor' | 'users' | 'cloud';
  assetCount: number;
  description: string;
  standards: string;
  effort: string;
  fix: Fix;
}

const safeguards: Safeguard[] = [
  {
    id: 's1',
    title:
      'Implement the ability to remotely erase data on both personal and company devices',
    status: 'not-implemented',
    statusLabel: 'Not implemented',
    type: 'Detect',
    responsible: 'MSP',
    asset: 'monitor',
    assetCount: 40,
    description:
      'Remotely wipe enterprise data from enterprise-owned, portable, end-user devices when deemed appropriate, such as lost or stolen devices, or when an individual no longer supports the enterprise.',
    standards: 'CIS Implementation Group 3',
    effort: '2-3 weeks',
    fix: {
      title: 'Enable Endpoint Security',
      detail:
        'Configure advanced security to enable the ability to remotely wipe sensitive data from company devices when necessary.',
    },
  },
  {
    id: 's2',
    title: 'Deploy and maintain anti-malware software',
    status: 'partial',
    statusLabel: '60/100',
    type: 'Protect',
    responsible: 'MSP',
    asset: 'monitor',
    assetCount: 48,
    description:
      'Ensure anti-malware software is installed, running, and kept up to date across all managed endpoints.',
    standards: 'CIS Implementation Group 1',
    effort: '1 week',
    fix: {
      title: 'Roll out managed anti-malware',
      detail:
        'Push the managed anti-malware agent to the remaining endpoints and enable automatic signature updates.',
    },
  },
  {
    id: 's3',
    title: 'Establish and maintain a data recovery process',
    status: 'implemented',
    statusLabel: 'Implemented',
    type: 'Recover',
    responsible: 'MSP',
    asset: 'users',
    assetCount: 102,
    description:
      'Maintain a documented, tested process for recovering in-scope enterprise data.',
    standards: 'CIS Implementation Group 1',
    effort: 'Complete',
    fix: {
      title: 'Review recovery runbook',
      detail:
        'Verify the recovery runbook is current and schedule the next restore test.',
    },
  },
  {
    id: 's4',
    title: 'Develop an incident response plan to address security breaches.',
    status: 'implemented',
    statusLabel: 'Implemented',
    type: 'Respond',
    responsible: 'Customer',
    asset: 'cloud',
    assetCount: 2,
    description:
      'Document and maintain an incident response plan that defines roles, responsibilities, and escalation paths.',
    standards: 'CIS Implementation Group 2',
    effort: 'Complete',
    fix: {
      title: 'Rehearse the response plan',
      detail: 'Run a tabletop exercise to validate the escalation paths.',
    },
  },
  {
    id: 's5',
    title:
      'Perform vulnerability assessments and penetration testing regularly.',
    status: 'plan',
    statusLabel: 'Plan of action',
    type: 'Identify',
    responsible: 'Customer',
    asset: 'monitor',
    assetCount: 2,
    description:
      'Schedule recurring vulnerability assessments and periodic penetration tests against in-scope assets.',
    standards: 'CIS Implementation Group 2',
    effort: '4-6 weeks',
    fix: {
      title: 'Engage a testing vendor',
      detail:
        'Select an assessment vendor and agree the scope and cadence for testing.',
    },
  },
  {
    id: 's6',
    title: 'Implement physical security measures to protect assets.',
    status: 'not-applicable',
    statusLabel: 'Not applicable',
    type: 'Protect',
    responsible: 'MSP',
    asset: 'cloud',
    assetCount: 23,
    description:
      'Physical controls are managed by the hosting provider and are out of scope for this environment.',
    standards: '—',
    effort: '—',
    fix: {
      title: 'No action required',
      detail: 'This safeguard is covered by the hosting provider’s controls.',
    },
  },
  {
    id: 's7',
    title: 'Ensure third-party vendors comply with security standards.',
    status: 'implemented',
    statusLabel: 'Implemented',
    type: 'Identify',
    responsible: 'Customer',
    asset: 'users',
    assetCount: 100,
    description:
      'Assess and monitor third-party vendors against the enterprise security requirements.',
    standards: 'CIS Implementation Group 2',
    effort: 'Complete',
    fix: {
      title: 'Refresh vendor attestations',
      detail: 'Collect updated attestations from vendors due for review.',
    },
  },
  {
    id: 's8',
    title: 'Utilize logging and monitoring to detect security incidents.',
    status: 'not-implemented',
    statusLabel: 'Not implemented',
    type: 'Respond',
    responsible: 'MSP',
    asset: 'users',
    assetCount: 12,
    description:
      'Centralize logs and configure alerting so security-relevant events are detected and triaged.',
    standards: 'CIS Implementation Group 1',
    effort: '2 weeks',
    fix: {
      title: 'Connect a log collector',
      detail:
        'Forward endpoint and network logs to the monitoring platform and enable detection rules.',
    },
  },
];

const STATUS_ICON = {
  implemented: {
    Icon: CircleCheckIcon,
    color: 'var(--ui-tag-success-icon-color)',
  },
  'not-implemented': {
    Icon: CircleTimesIcon,
    color: 'var(--ui-tag-danger-icon-color)',
  },
  partial: {
    Icon: CircleWarningIcon,
    color: 'var(--ui-tag-warning-icon-color)',
  },
  plan: { Icon: FlagIcon, color: 'var(--ui-tag-info-icon-color)' },
  'not-applicable': {
    Icon: CircleBanIcon,
    color: 'var(--ui-tag-neutral-icon-color)',
  },
} as const;

const ASSET_ICON = {
  monitor: MonitorIcon,
  users: UsersIcon,
  cloud: CloudIcon,
} as const;

type SortKey = 'status' | 'type' | 'responsible' | 'assets';
type SortDirection = 'asc' | 'desc' | false;

// How each sortable column reads its value; Assets sorts numerically.
const SORT_ACCESSOR: Record<SortKey, (row: Safeguard) => string | number> = {
  status: (row) => row.statusLabel,
  type: (row) => row.type,
  responsible: (row) => row.responsible,
  assets: (row) => row.assetCount,
};

function SortableHead({
  children,
  className,
  direction,
  onSort,
}: {
  children: ReactNode;
  className?: string;
  direction: SortDirection;
  onSort: () => void;
}) {
  return (
    <TableHead
      className={className}
      sortable
      sortDirection={direction}
      onSort={onSort}
    >
      {children}
    </TableHead>
  );
}

function HowToFix({ fix }: { fix: Fix }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-[var(--ui-tag-info-label-color)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)]"
      >
        {open ? (
          <ChevronDownIcon className="h-4 w-4" />
        ) : (
          <ChevronRightIcon className="h-4 w-4" />
        )}
        <CirclePlayIcon className="h-4 w-4" />
        {fix.title}
      </button>
      {open && (
        <p className="mt-2 pl-10 text-sm text-muted-foreground">{fix.detail}</p>
      )}
    </div>
  );
}

export function TableExpandableCompliance() {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(['s1']));
  const [sort, setSort] = useState<{
    key: SortKey;
    direction: 'asc' | 'desc';
  } | null>(null);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // Cycle the clicked column asc -> desc -> unsorted; expansion is keyed by id,
  // so it survives reordering.
  const toggleSort = (key: SortKey) =>
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return null;
    });

  const dirFor = (key: SortKey): SortDirection =>
    sort?.key === key ? sort.direction : false;

  const rows = useMemo(() => {
    if (!sort) return safeguards;
    const read = SORT_ACCESSOR[sort.key];
    return [...safeguards].sort((a, b) => {
      const av = read(a);
      const bv = read(b);
      const cmp =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sort.direction === 'asc' ? cmp : -cmp;
    });
  }, [sort]);

  return (
    <div className="rounded-md border">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead>Safeguard</TableHead>
            <SortableHead
              className="w-[170px]"
              direction={dirFor('status')}
              onSort={() => toggleSort('status')}
            >
              Status
            </SortableHead>
            <SortableHead
              className="w-[120px]"
              direction={dirFor('type')}
              onSort={() => toggleSort('type')}
            >
              Type
            </SortableHead>
            <SortableHead
              className="w-[150px]"
              direction={dirFor('responsible')}
              onSort={() => toggleSort('responsible')}
            >
              Responsible
            </SortableHead>
            <SortableHead
              className="w-[110px]"
              direction={dirFor('assets')}
              onSort={() => toggleSort('assets')}
            >
              Assets
            </SortableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const isOpen = expanded.has(row.id);
            const { Icon: StatusIcon, color } = STATUS_ICON[row.status];
            const AssetIcon = ASSET_ICON[row.asset];
            return (
              <Fragment key={row.id}>
                <TableRow
                  className={isOpen ? 'hover:bg-transparent' : undefined}
                >
                  <TableCell>
                    <div className="flex min-w-0 items-center gap-2">
                      <ButtonIcon
                        variant="ghost"
                        aria-label={isOpen ? 'Collapse row' : 'Expand row'}
                        aria-expanded={isOpen}
                        onClick={() => toggle(row.id)}
                        className={
                          isOpen
                            ? 'shrink-0 text-[var(--ui-tag-info-icon-color)]'
                            : 'shrink-0'
                        }
                      >
                        {isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
                      </ButtonIcon>
                      <span className="truncate font-medium">{row.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                      <StatusIcon
                        className="h-4 w-4 shrink-0"
                        style={{ color }}
                      />
                      {row.statusLabel}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {row.type}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {row.responsible}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-2">
                      <AssetIcon className="h-4 w-4 shrink-0 text-[var(--ui-tag-info-icon-color)]" />
                      <Link href="#">{row.assetCount}</Link>
                    </span>
                  </TableCell>
                </TableRow>
                {isOpen && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="h-auto py-4 align-top">
                      <div className="space-y-3 pl-10 pr-4 text-sm">
                        <p className="max-w-3xl text-muted-foreground">
                          {row.description}
                        </p>
                        <p>
                          Standards:{' '}
                          <span className="font-semibold">{row.standards}</span>
                        </p>
                        <p>
                          Estimated effort:{' '}
                          <span className="font-semibold">{row.effort}</span>
                        </p>
                        <p className="pt-1 font-semibold">How to fix?</p>
                        <HowToFix fix={row.fix} />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

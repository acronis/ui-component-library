import { Fragment, type ReactNode, useMemo, useState } from 'react';
import {
  ButtonIcon,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
  CogIcon,
  EllipsisIcon,
  RectangleImageIcon,
} from '@constructor-lab/icons-react/stroke-mono';

// "Reports - grouping by category" (Figma node 5183-2011): a reports table whose
// rows are bucketed under collapsible category headers (General, Billing,
// Security…). Built from the Table primitive with local state (Table stays
// presentational; the owner drives grouping, expansion, selection, and sorting).
// The category header is a full-width row with a chevron toggle; its member rows
// render beneath while the group is expanded.

type Category =
  | 'General'
  | 'Billing'
  | 'Security'
  | 'Protection'
  | 'Monitoring'
  | 'Remote support'
  | 'Compliance';

// Category order as shown in the design; groups render in this sequence.
const CATEGORIES: Category[] = [
  'General',
  'Billing',
  'Security',
  'Protection',
  'Monitoring',
  'Remote support',
  'Compliance',
];

interface Report {
  id: string;
  name: string;
  category: Category;
  scheduled: boolean;
  /** Formatted timestamp, or null when the report has never run. */
  lastSent: string | null;
  lastUpdate: string | null;
}

const DATE = '26 Dec 2021, 12:05:54';

const reports: Report[] = [
  {
    id: 'r1',
    name: 'Overview Report',
    category: 'General',
    scheduled: true,
    lastSent: DATE,
    lastUpdate: DATE,
  },
  {
    id: 'r2',
    name: 'Gross profit per customer',
    category: 'Billing',
    scheduled: true,
    lastSent: DATE,
    lastUpdate: DATE,
  },
  {
    id: 'r3',
    name: 'Expense report',
    category: 'Billing',
    scheduled: false,
    lastSent: null,
    lastUpdate: null,
  },
  {
    id: 'r4',
    name: 'Comprehensive and Detailed Summary Report of Customer Activity',
    category: 'Billing',
    scheduled: false,
    lastSent: null,
    lastUpdate: null,
  },
  {
    id: 'r5',
    name: 'MDR report',
    category: 'Security',
    scheduled: true,
    lastSent: DATE,
    lastUpdate: DATE,
  },
  {
    id: 'r6',
    name: 'Daily Analytics Results',
    category: 'Security',
    scheduled: true,
    lastSent: DATE,
    lastUpdate: DATE,
  },
  {
    id: 'r7',
    name: 'Endpoint protection summary',
    category: 'Protection',
    scheduled: true,
    lastSent: DATE,
    lastUpdate: DATE,
  },
  {
    id: 'r8',
    name: 'Threats blocked',
    category: 'Protection',
    scheduled: false,
    lastSent: null,
    lastUpdate: null,
  },
  {
    id: 'r9',
    name: 'System health',
    category: 'Monitoring',
    scheduled: true,
    lastSent: DATE,
    lastUpdate: DATE,
  },
  {
    id: 'r10',
    name: 'Remote sessions',
    category: 'Remote support',
    scheduled: false,
    lastSent: null,
    lastUpdate: null,
  },
  {
    id: 'r11',
    name: 'CIS compliance status',
    category: 'Compliance',
    scheduled: true,
    lastSent: DATE,
    lastUpdate: DATE,
  },
];

type SortKey = 'name' | 'scheduled' | 'lastSent' | 'lastUpdate';
type SortDirection = 'asc' | 'desc' | false;

// How each sortable column reads its value; rows are sorted within their group.
const SORT_ACCESSOR: Record<SortKey, (row: Report) => string | number> = {
  name: (row) => row.name,
  scheduled: (row) => (row.scheduled ? 1 : 0),
  lastSent: (row) => row.lastSent ?? '',
  lastUpdate: (row) => row.lastUpdate ?? '',
};

function ScheduleStatus({ scheduled }: { scheduled: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      {scheduled ? (
        <CircleCheckIcon
          className="h-4 w-4 shrink-0"
          style={{ color: 'var(--ui-tag-success-icon-color)' }}
        />
      ) : (
        <CircleBanIcon
          className="h-4 w-4 shrink-0"
          style={{ color: 'var(--ui-tag-neutral-icon-color)' }}
        />
      )}
      {scheduled ? 'Scheduled' : 'Not scheduled'}
    </span>
  );
}

export function TableGrouping() {
  // Groups start expanded except the empty-of-interest lower categories, matching
  // the design where the first three groups are open and the rest collapsed.
  const [collapsed, setCollapsed] = useState<Set<Category>>(
    () =>
      new Set<Category>([
        'Protection',
        'Monitoring',
        'Remote support',
        'Compliance',
      ])
  );
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [sort, setSort] = useState<{
    key: SortKey;
    direction: 'asc' | 'desc';
  } | null>(null);

  const toggleGroup = (category: Category) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });

  const toggleRow = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // Cycle the clicked column asc -> desc -> unsorted.
  const toggleSort = (key: SortKey) =>
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return null;
    });

  const dirFor = (key: SortKey): SortDirection =>
    sort?.key === key ? sort.direction : false;

  // Reports bucketed by category, then sorted within each bucket. Grouping is a
  // stable partition; sorting only reorders rows inside a group.
  const grouped = useMemo(() => {
    const read = sort ? SORT_ACCESSOR[sort.key] : null;
    return CATEGORIES.map((category) => {
      const rows = reports.filter((report) => report.category === category);
      if (read) {
        rows.sort((a, b) => {
          const av = read(a);
          const bv = read(b);
          const cmp =
            typeof av === 'number' && typeof bv === 'number'
              ? av - bv
              : String(av).localeCompare(String(bv));
          return sort!.direction === 'asc' ? cmp : -cmp;
        });
      }
      return { category, rows };
    }).filter((group) => group.rows.length > 0);
  }, [sort]);

  const allIds = reports.map((report) => report.id);
  const allSelected = selected.size === allIds.length;
  const someSelected = selected.size > 0 && !allSelected;

  const toggleAll = (checked: boolean) =>
    setSelected(checked ? new Set(allIds) : new Set());

  return (
    <div className="rounded-md border">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                aria-label="Select all reports"
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={(checked) => toggleAll(Boolean(checked))}
              />
            </TableHead>
            <SortableHead
              direction={dirFor('name')}
              onSort={() => toggleSort('name')}
            >
              Name
            </SortableHead>
            <SortableHead
              className="w-[180px]"
              direction={dirFor('scheduled')}
              onSort={() => toggleSort('scheduled')}
            >
              Active schedules
            </SortableHead>
            <SortableHead
              className="w-[200px]"
              direction={dirFor('lastSent')}
              onSort={() => toggleSort('lastSent')}
            >
              Last sent
            </SortableHead>
            <SortableHead
              className="w-[200px]"
              direction={dirFor('lastUpdate')}
              onSort={() => toggleSort('lastUpdate')}
            >
              Last update
            </SortableHead>
            <TableHead className="w-[150px]">
              <span className="flex justify-end">
                <ButtonIcon variant="ghost" aria-label="Column settings">
                  <CogIcon />
                </ButtonIcon>
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grouped.map(({ category, rows }) => {
            const isOpen = !collapsed.has(category);
            return (
              <Fragment key={category}>
                <TableRow className="bg-[var(--ui-background-surface-secondary)] hover:bg-[var(--ui-background-surface-secondary)]">
                  <TableCell colSpan={6} className="py-0">
                    <button
                      type="button"
                      onClick={() => toggleGroup(category)}
                      aria-expanded={isOpen}
                      className="-mx-1 flex h-10 w-full items-center gap-2 rounded-sm px-1 text-start font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)] [&_svg]:size-4 [&_svg]:text-[var(--ui-tag-info-icon-color)]"
                    >
                      {isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
                      {category}
                      <span className="font-normal text-muted-foreground">
                        ({rows.length})
                      </span>
                    </button>
                  </TableCell>
                </TableRow>
                {isOpen &&
                  rows.map((row) => {
                    const isSelected = selected.has(row.id);
                    return (
                      <TableRow key={row.id} selected={isSelected}>
                        <TableCell className="w-12">
                          <Checkbox
                            aria-label={`Select ${row.name}`}
                            checked={isSelected}
                            onCheckedChange={() => toggleRow(row.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <span className="block truncate font-medium">
                            {row.name}
                          </span>
                        </TableCell>
                        <TableCell>
                          <ScheduleStatus scheduled={row.scheduled} />
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {row.lastSent ?? '—'}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {row.lastUpdate ?? '—'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-between gap-2">
                            <Link href="#" className="whitespace-nowrap">
                              <RectangleImageIcon />
                              Preview
                            </Link>
                            <RowActions name={row.name} />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

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

function RowActions({ name }: { name: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <ButtonIcon variant="ghost" aria-label={`Actions for ${name}`} />
        }
      >
        <EllipsisIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuItem>Send now</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

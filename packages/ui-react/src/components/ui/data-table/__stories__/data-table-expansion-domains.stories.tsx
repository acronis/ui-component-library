import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ColumnDef } from '@tanstack/react-table';
import {
  ChevronDownIcon,
  ChevronRightIcon,
} from '@constructor-lab/icons-react/stroke-mono';

import {
  createRowContext,
  type DataTableRowContext,
} from '../data-table-render-context';
import { useDataTable } from '../data-table-controller';
import { DataTableRoot } from '../data-table-root';
import { DataTableView } from '../data-table-view';

// Detail expansion and tree expansion are two independent domains: `tree` owns
// TanStack's expand row model (descendant visibility over `treeExpanded`) and
// detail expansion is a render-layer projection over `detailExpanded`. Opening
// one never touches the other, and the same row can hold both open at once.
// See .ai/plans/adr/ADR-0001-expansion-domain-row-model-ownership.md.
//
// The expander affordances below are hand-rolled column cells; the standard
// chrome for each domain is a DataGrid concern and lands with its feature group.

interface Workload {
  id: string;
  name: string;
  kind: string;
  size: string;
  children?: Workload[];
}

const workloads: Workload[] = [
  {
    id: 'w-servers',
    name: 'Servers',
    kind: 'Group',
    size: '12 TB',
    children: [
      { id: 'w-db-01', name: 'db-01', kind: 'Machine', size: '4 TB' },
      { id: 'w-db-02', name: 'db-02', kind: 'Machine', size: '8 TB' },
    ],
  },
  {
    id: 'w-workstations',
    name: 'Workstations',
    kind: 'Group',
    size: '3 TB',
    children: [{ id: 'w-ws-01', name: 'ws-01', kind: 'Machine', size: '3 TB' }],
  },
  { id: 'w-archive', name: 'archive-01', kind: 'Machine', size: '900 GB' },
];

const disclosureClass =
  'flex size-4 items-center justify-center text-muted-foreground [&_svg]:size-4';

function TreeDisclosure({ row }: { row: DataTableRowContext<Workload> }) {
  if (!row.tree.canExpand) {
    return <span className="size-4" />;
  }

  return (
    <button
      type="button"
      onClick={() => row.tree.toggle()}
      aria-expanded={row.tree.isExpanded}
      aria-label={
        row.tree.isExpanded
          ? `Collapse children of ${row.data.name}`
          : `Expand children of ${row.data.name}`
      }
      className={disclosureClass}
    >
      {row.tree.isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
    </button>
  );
}

const columns: ColumnDef<Workload>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'kind', header: 'Kind' },
  { accessorKey: 'size', header: 'Size' },
];

function ExpansionDomainsView() {
  const controller = useDataTable({
    columns: columns as ColumnDef<Workload, unknown>[],
    data: workloads,
    getRowId: (row) => row.id,
    getSubRows: (row) => row.children,
    detailExpansion: {},
    tree: {},
    defaultState: {
      treeExpanded: new Set(['w-servers']),
      detailExpanded: new Set(['w-db-01']),
    },
  });

  return (
    <DataTableRoot table={controller}>
      <DataTableView<Workload>
        renderCell={(context) => {
          const row = context.row;

          if (context.columnId !== 'name') {
            return String(context.value);
          }

          return (
            <div
              className="flex items-center gap-1"
              style={{ paddingLeft: `${row.tree.depth * 1.25}rem` }}
            >
              <TreeDisclosure row={row} />
              <button
                type="button"
                onClick={() => row.detail.toggle()}
                aria-expanded={row.detail.isExpanded}
                className="underline-offset-2 hover:underline"
              >
                {row.data.name}
              </button>
            </div>
          );
        }}
        renderExpandedRow={(row) => {
          // The engine hands the view a record row; project the same typed row
          // context the cells use.
          const context = createRowContext(row, controller);

          return (
            <div className="text-sm text-muted-foreground">
              Detail panel for{' '}
              <span className="font-medium text-foreground">
                {context.data.name}
              </span>{' '}
              — {context.data.kind}, {context.data.size}. Depth{' '}
              {context.tree.depth}; children{' '}
              {context.tree.hasChildren ? 'attached' : 'none'}.
            </div>
          );
        }}
      />
    </DataTableRoot>
  );
}

const meta = {
  title: 'Components/DataTable/Expansion domains',
  component: ExpansionDomainsView,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ExpansionDomainsView>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `w-servers` has its tree branch open and `w-db-01` — one of its descendants —
 * has its detail panel open. Neither disclosure closes the other.
 */
export const DetailAndTreeTogether: Story = {};

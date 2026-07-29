import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ColumnDef } from '@tanstack/react-table';

import { Tag } from '../../tag';
import { DataGrid } from '../data-grid';

// The `grouping` group (U4). Root records collapse under a synthetic group header
// while each root's descendant tree stays attached (design §3.5/§6.6).
//
// **How grouping is switched on is worth seeing here rather than reading about.**
// `grouping.allowedColumns` says which columns *may* group; the columns actually
// grouped are the `grouping` **state slice**, so every story below pairs the config
// with `defaultState={{ grouping: [...] }}`. That mirrors `sorting`: the config
// carries behavior, the slice carries the current value. There is no built-in
// group-by control in P1 — design §5.2 gives grouping no toolbar member — so a
// caller drives the slice, and `allowedColumns` is what a future column-menu entry
// will read.
//
// Checked in light and dark mode.

interface Task {
  id: string;
  title: string;
  status: string | null;
  owner: string;
  subtasks?: Task[];
}

const backlog: Task[] = [
  // Ungrouped records FIRST, so the `position` policy is visibly doing something:
  // the row model buckets groups in first-encounter order, and the default `'last'`
  // has to move this one to the bottom.
  { id: 't1', title: 'Triage inbound reports', status: null, owner: 'Ada' },
  { id: 't2', title: 'Rotate signing keys', status: null, owner: 'Grace' },
  {
    id: 't3',
    title: 'Migrate backup agents',
    status: 'active',
    owner: 'Alan',
    subtasks: [
      {
        id: 't3a',
        title: 'Audit agent versions',
        status: 'active',
        owner: 'Alan',
      },
      {
        id: 't3b',
        title: 'Stage the rollout',
        status: 'active',
        owner: 'Katherine',
      },
    ],
  },
  {
    id: 't4',
    title: 'Tune retention policy',
    status: 'active',
    owner: 'Radia',
  },
  { id: 't5', title: 'Archive Q1 snapshots', status: 'done', owner: 'Barbara' },
  { id: 't6', title: 'Retire legacy vault', status: 'done', owner: 'Margaret' },
];

const columns: ColumnDef<Task>[] = [
  { accessorKey: 'title', header: 'Task' },
  { accessorKey: 'owner', header: 'Owner' },
  { accessorKey: 'status', header: 'Status' },
];

const allowedColumns = ['status', 'owner'];

/**
 * The default group header: a disclosure, the group's name, and its member count.
 *
 * Note the column order — `status` is the third declared column and stays third.
 * TanStack's `groupedColumnMode` defaults to `'reorder'`, which would hoist it to
 * the front the moment grouping activated; the group row shows the value already,
 * so the caller's order is kept instead.
 */
function Standard() {
  return (
    <DataGrid
      columns={columns as ColumnDef<Task>[]}
      rows={backlog}
      getRowId={(row) => row.id}
      grouping={{ allowedColumns }}
      defaultState={{ grouping: ['status'] }}
    />
  );
}

/**
 * The ungrouped bucket's three policies, side by side. Every grid holds the same
 * records; only `ungrouped` differs.
 */
function UngroupedPolicy() {
  const cases = [
    { label: 'default — visible, "Ungrouped", last', ungrouped: undefined },
    {
      label: "position: 'first'",
      ungrouped: { position: 'first' as const },
    },
    { label: "name: 'No status'", ungrouped: { name: 'No status' } },
    {
      label: 'show: false — the bucket and its records are dropped',
      ungrouped: { show: false },
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {cases.map(({ label, ungrouped }) => (
        <section className="flex flex-col gap-2" key={label}>
          <h3 className="text-sm font-medium">{label}</h3>
          <DataGrid
            columns={columns as ColumnDef<Task>[]}
            rows={backlog}
            getRowId={(row) => row.id}
            grouping={{
              allowedColumns,
              ...(ungrouped === undefined ? {} : { ungrouped }),
            }}
            defaultState={{ grouping: ['status'] }}
          />
        </section>
      ))}
    </div>
  );
}

/**
 * Grouping over a tree. **Only roots group** — each root keeps its own descendants,
 * one level deeper than the group (§6.6). Expand "Migrate backup agents" to see its
 * subtasks stay under it rather than being regrouped as peers.
 */
function WithTree() {
  return (
    <DataGrid
      columns={columns as ColumnDef<Task>[]}
      rows={backlog}
      getRowId={(row) => row.id}
      tree={{ getChildren: (row: Task) => row.subtasks }}
      grouping={{ allowedColumns }}
      defaultState={{ grouping: ['status'], treeExpanded: new Set(['t3']) }}
    />
  );
}

/**
 * The group-scoped select-all, and the two scopes.
 *
 * Under the default `'all-loaded-leaves'` a group's checkbox targets every loaded
 * descendant, so a collapsed group is still selectable. Under `'visible-leaves'` it
 * targets only what is on screen, so collapsing a group empties and disables its
 * control — visible rather than inert.
 *
 * Selecting one of a group's two members puts that group's checkbox in the mixed
 * state; activating a mixed box completes the group, or clears it under
 * `selection.selectAllOnIndeterminate: false`. That is the same policy the header
 * control uses, threaded through so the two cannot disagree.
 */
function GroupSelection() {
  return (
    <div className="flex flex-col gap-8">
      {(['all-loaded-leaves', 'visible-leaves'] as const).map((scope) => (
        <section className="flex flex-col gap-2" key={scope}>
          <h3 className="text-sm font-medium">selectionScope: {scope}</h3>
          <DataGrid
            columns={columns as ColumnDef<Task>[]}
            rows={backlog}
            getRowId={(row) => row.id}
            selection={{ mode: 'multiple' }}
            tree={{ getChildren: (row: Task) => row.subtasks }}
            grouping={{ allowedColumns, selectionScope: scope }}
            defaultState={{ grouping: ['status'] }}
          />
        </section>
      ))}
    </div>
  );
}

/**
 * A caller's `renderGroup` replaces the whole header, disclosure included — the
 * group is theirs to compose, and `toggle`, `collapsed` and `rowCount` are on the
 * context. This is also where a per-group background belongs: the standard header
 * deliberately paints none.
 */
function CustomRenderer() {
  return (
    <DataGrid
      columns={columns as ColumnDef<Task>[]}
      rows={backlog}
      getRowId={(row) => row.id}
      grouping={{
        allowedColumns,
        renderGroup: (group) => (
          <span className="flex items-center gap-2">
            <button
              type="button"
              aria-expanded={!group.collapsed}
              className="text-muted-foreground text-xs underline"
              onClick={group.toggle}
            >
              {group.collapsed ? 'Show' : 'Hide'}
            </button>
            <span className="font-medium">
              {group.isUngrouped ? 'Not started' : group.name}
            </span>
            <Tag size="sm">{String(group.rowCount)}</Tag>
          </span>
        ),
      }}
      defaultState={{ grouping: ['status'] }}
    />
  );
}

/**
 * `sticky` pins group headers to the top of the scroll container while their members
 * scroll past. It needs `appearance.height` or `appearance.maxHeight` — without a
 * bounded container nothing scrolls and nothing can stick, and the resolver warns.
 *
 * With `appearance.stickyHeader` as well, F3's z-ladder puts the table header
 * (z 40) above a sticky group row (z 20), so the group row slides *under* the
 * header rather than stacking below it. Clearing the header would need its measured
 * height, which design §5.2 gives `sticky` no member for.
 */
function StickyHeaders() {
  return (
    <DataGrid
      columns={columns as ColumnDef<Task>[]}
      rows={backlog}
      getRowId={(row) => row.id}
      appearance={{ maxHeight: 220, stickyHeader: true }}
      grouping={{ allowedColumns, sticky: true }}
      defaultState={{ grouping: ['status'] }}
    />
  );
}

/**
 * `collapsible: false` pins every group open and drops the disclosure, keeping a
 * same-size spacer so labels stay aligned with a collapsible grid's.
 */
function NotCollapsible() {
  return (
    <DataGrid
      columns={columns as ColumnDef<Task>[]}
      rows={backlog}
      getRowId={(row) => row.id}
      grouping={{ allowedColumns, collapsible: false }}
      defaultState={{ grouping: ['status'] }}
    />
  );
}

/** Two grouping columns: the second level nests inside the first. */
function MultipleColumns() {
  return (
    <DataGrid
      columns={columns as ColumnDef<Task>[]}
      rows={backlog}
      getRowId={(row) => row.id}
      grouping={{ allowedColumns }}
      defaultState={{ grouping: ['status', 'owner'] }}
    />
  );
}

const meta = {
  title: 'Components/DataGrid/Grouping',
  component: DataGrid,
  parameters: { layout: 'padded' },
  // Every story renders its own grid, so these args only satisfy `DataGrid`'s two
  // required props.
  args: { columns: columns as ColumnDef<unknown, unknown>[], rows: backlog },
  argTypes: {
    columns: { control: false },
    rows: { control: false },
    grouping: { control: false },
  },
} satisfies Meta<typeof DataGrid>;

export default meta;

export const StandardGroupHeader: StoryObj<typeof meta> = {
  render: () => <Standard />,
};

// Four stacked grids overflow the 720px capture viewport. Without `fullPage` the
// clip is capped at the viewport and cases 3 (`name: 'No status'`) and 4
// (`show: false`) fall entirely outside the baseline — a comparison story whose
// baseline guards half the comparison (#89).
export const UngroupedBucket: StoryObj<typeof meta> = {
  parameters: { snapshot: { fullPage: true } },
  render: () => <UngroupedPolicy />,
};

export const WithTreeRows: StoryObj<typeof meta> = {
  render: () => <WithTree />,
};

// Both scopes stacked overflow the capture viewport; without `fullPage` the tail of
// the `visible-leaves` grid is clipped away (#89).
export const GroupScopedSelection: StoryObj<typeof meta> = {
  parameters: { snapshot: { fullPage: true } },
  render: () => <GroupSelection />,
};

export const CustomGroupRenderer: StoryObj<typeof meta> = {
  render: () => <CustomRenderer />,
};

export const StickyGroupHeaders: StoryObj<typeof meta> = {
  render: () => <StickyHeaders />,
};

export const NonCollapsibleGroups: StoryObj<typeof meta> = {
  render: () => <NotCollapsible />,
};

export const MultipleGroupingColumns: StoryObj<typeof meta> = {
  render: () => <MultipleColumns />,
};

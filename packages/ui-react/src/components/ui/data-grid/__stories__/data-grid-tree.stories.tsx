import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ColumnDef } from '@tanstack/react-table';

import { DataGrid } from '../data-grid';

// The `tree` group (U2), eager half. The disclosure is an **in-cell** control on
// the tree column, not a system column of its own: indentation and disclosure have
// to move together, and a fixed leading column cannot indent. Compare the
// `detailExpansion` stories in `data-grid.stories.tsx`, where the expander *is* a
// system column — that asymmetry is deliberate and visible here.
//
// `loadChildren` is covered by the last story: with a loader configured, every
// not-yet-resolved row gets a disclosure, because the library cannot know whether a
// childless record has children until it asks.

interface Unit {
  id: string;
  name: string;
  owner: string;
  seats: number;
  reports?: Unit[];
}

const inventory: Unit[] = [
  {
    id: 'emea',
    name: 'EMEA',
    owner: 'Ada Lovelace',
    seats: 1240,
    reports: [
      {
        id: 'emea-uk',
        name: 'United Kingdom',
        owner: 'Grace Hopper',
        seats: 610,
        reports: [
          {
            id: 'emea-uk-lon',
            name: 'London',
            owner: 'Alan Turing',
            seats: 430,
          },
          {
            id: 'emea-uk-mcr',
            name: 'Manchester',
            owner: 'Alan Turing',
            seats: 180,
          },
        ],
      },
      {
        id: 'emea-de',
        name: 'Germany',
        owner: 'Katherine Johnson',
        seats: 630,
      },
    ],
  },
  {
    id: 'apac',
    name: 'APAC',
    owner: 'Radia Perlman',
    seats: 880,
    reports: [
      { id: 'apac-jp', name: 'Japan', owner: 'Barbara Liskov', seats: 500 },
      { id: 'apac-au', name: 'Australia', owner: 'Barbara Liskov', seats: 380 },
    ],
  },
  // A childless root, so the leaf spacer is visible next to expandable siblings.
  { id: 'latam', name: 'LATAM', owner: 'Margaret Hamilton', seats: 210 },
];

const columns: ColumnDef<Unit>[] = [
  { accessorKey: 'name', header: 'Region' },
  { accessorKey: 'owner', header: 'Owner' },
  { accessorKey: 'seats', header: 'Seats' },
];

const getChildren = (row: Unit) => row.reports;

/** Three indent steps at once, so the depth arithmetic is comparable by eye. */
function IndentSteps() {
  return (
    <div className="flex flex-col gap-8">
      {[undefined, 8, 40].map((indent) => (
        <section className="flex flex-col gap-2" key={String(indent)}>
          <h3 className="text-sm font-medium">
            {indent === undefined
              ? 'indent: default (20px)'
              : `indent: ${indent}px`}
          </h3>
          <DataGrid
            columns={columns as ColumnDef<Unit>[]}
            rows={inventory}
            getRowId={(row) => row.id}
            tree={{ getChildren, ...(indent === undefined ? {} : { indent }) }}
            defaultState={{
              treeExpanded: new Set(['emea', 'emea-uk', 'apac']),
            }}
          />
        </section>
      ))}
    </div>
  );
}

/**
 * `column` moves the disclosure off the first declared column. The default is the
 * first **declared** data column, which reorder and visibility can move — and
 * hiding the tree column removes the disclosure entirely, so the tree becomes
 * unexpandable rather than merely un-indented. This is the escape hatch.
 */
function NamedColumn() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">
          Default — the first declared column (Region)
        </h3>
        <DataGrid
          columns={columns as ColumnDef<Unit>[]}
          rows={inventory}
          getRowId={(row) => row.id}
          tree={{ getChildren }}
          defaultState={{ treeExpanded: new Set(['apac']) }}
        />
      </section>
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">column: &apos;owner&apos;</h3>
        <DataGrid
          columns={columns as ColumnDef<Unit>[]}
          rows={inventory}
          getRowId={(row) => row.id}
          tree={{ getChildren, column: 'owner' }}
          defaultState={{ treeExpanded: new Set(['apac']) }}
        />
      </section>
    </div>
  );
}

/**
 * Tree and detail expansion open at the same time, on the same rows. They share no
 * slice, no callback and no id namespace (ADR-0001), which is what lets the panel
 * and the descendants coexist — and why the log below never crosses the two.
 */
function BothDomains() {
  // Entries carry their own id: the same text can repeat (collapse then re-expand
  // the same row), so neither the text nor its index is a stable key.
  const [log, setLog] = useState<{ id: number; text: string }[]>([]);
  const append = (text: string) =>
    setLog((entries) => [{ id: (entries[0]?.id ?? 0) + 1, text }, ...entries]);

  return (
    <div className="flex flex-col gap-4">
      <DataGrid
        columns={columns as ColumnDef<Unit>[]}
        rows={inventory}
        getRowId={(row) => row.id}
        tree={{ getChildren }}
        detailExpansion={{
          render: (row) => (
            <span className="text-sm">
              {row.name} — {row.seats} seats, owned by {row.owner}
            </span>
          ),
        }}
        callbacks={{
          onTreeExpansionChange: (event) =>
            append(`tree → ${[...event.value].join(', ') || '(none)'}`),
          onDetailExpansionChange: (event) =>
            append(`detail → ${[...event.value].join(', ') || '(none)'}`),
        }}
      />
      <ol className="text-muted-foreground flex flex-col gap-1 text-xs">
        {log.slice(0, 6).map((entry) => (
          <li key={entry.id}>{entry.text}</li>
        ))}
      </ol>
    </div>
  );
}

/** A tree inside a page: descendants consume page slots, roots do not survive. */
function Paginated() {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium">
        pageSize: 4 — an expanded parent&apos;s children take slots, so a
        sibling root is pushed to page two (ADR-0001 OQ-2)
      </h3>
      <DataGrid
        columns={columns as ColumnDef<Unit>[]}
        rows={inventory}
        getRowId={(row) => row.id}
        tree={{ getChildren }}
        pagination={{ pageSize: 4 }}
        defaultState={{ treeExpanded: new Set(['emea']) }}
      />
    </div>
  );
}

/**
 * Lazy children. `emea` resolves after a delay, `apac` always fails so the Alert and
 * its Retry are reachable, and `latam` resolves empty — after which it becomes a
 * proven leaf and loses its disclosure. `renderLoadError` is not used here, so this
 * shows the default Spinner/Alert chrome.
 */
function LazyChildren() {
  const [log, setLog] = useState<{ id: number; text: string }[]>([]);
  const roots: Unit[] = [
    { id: 'emea', name: 'EMEA', owner: 'Ada Lovelace', seats: 1240 },
    { id: 'apac', name: 'APAC', owner: 'Radia Perlman', seats: 880 },
    { id: 'latam', name: 'LATAM', owner: 'Margaret Hamilton', seats: 210 },
  ];

  const loadChildren = (row: Unit) =>
    new Promise<readonly Unit[]>((resolve, reject) => {
      setTimeout(() => {
        if (row.id === 'apac') {
          reject(new Error('Region service unreachable'));

          return;
        }
        resolve(
          row.id === 'latam'
            ? []
            : [
                {
                  id: `${row.id}-a`,
                  name: 'United Kingdom',
                  owner: 'Grace Hopper',
                  seats: 610,
                },
                {
                  id: `${row.id}-b`,
                  name: 'Germany',
                  owner: 'Katherine Johnson',
                  seats: 630,
                },
              ]
        );
      }, 900);
    });

  return (
    <div className="flex flex-col gap-4">
      <DataGrid
        columns={columns as ColumnDef<Unit>[]}
        rows={roots}
        getRowId={(row) => row.id}
        tree={{ getChildren, loadChildren }}
        callbacks={{
          onTreeLoad: (event) =>
            setLog((entries) => [
              {
                id: (entries[0]?.id ?? 0) + 1,
                text: `${event.rowId} → ${event.status} (${event.requestKey})`,
              },
              ...entries,
            ]),
        }}
      />
      <ol className="text-muted-foreground flex flex-col gap-1 text-xs">
        {log.slice(0, 8).map((entry) => (
          <li key={entry.id}>{entry.text}</li>
        ))}
      </ol>
    </div>
  );
}

const meta = {
  title: 'Components/DataGrid/Tree',
  component: DataGrid,
  parameters: { layout: 'padded' },
  // Every story renders its own grids, so these args only satisfy `DataGrid`'s
  // two required props.
  args: { columns: columns as ColumnDef<unknown, unknown>[], rows: inventory },
  argTypes: {
    columns: { control: false },
    rows: { control: false },
    tree: { control: false },
  },
} satisfies Meta<typeof DataGrid>;

export default meta;

// Three indent steps stacked overflow the 720px capture viewport. Without
// `fullPage` the `indent: 40px` case — the most visually distinct of the three, and
// the reason the story exists — falls entirely outside the baseline (#89).
export const IndentStep: StoryObj<typeof meta> = {
  parameters: { snapshot: { fullPage: true } },
  render: () => <IndentSteps />,
};

export const TreeColumn: StoryObj<typeof meta> = {
  render: () => <NamedColumn />,
};

export const WithDetailExpansion: StoryObj<typeof meta> = {
  render: () => <BothDomains />,
};

export const WithPagination: StoryObj<typeof meta> = {
  render: () => <Paginated />,
};

export const LazyLoadedChildren: StoryObj<typeof meta> = {
  render: () => <LazyChildren />,
};

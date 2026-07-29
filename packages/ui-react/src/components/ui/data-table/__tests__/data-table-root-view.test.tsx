import { useLayoutEffect } from 'react';
import type { ColumnDef, SortingState, Table } from '@tanstack/react-table';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DataTableColumnHeader } from '../data-table-column-header';
import type { DataTableSortDescriptor } from '../data-table-contract';
import {
  useDataTable,
  type DataTableController,
} from '../data-table-controller';
import { DataTableRoot, useDataTableRoot } from '../data-table-root';
import { DataTableView } from '../data-table-view';
import { DataTable } from '../data-table';

interface Person {
  id: string;
  name: string;
  rank: number;
}

const people: Person[] = Array.from({ length: 12 }, (_, index) => ({
  id: `person-${index + 1}`,
  name: `Person ${index + 1}`,
  rank: index + 1,
}));

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'rank', header: 'Rank' },
];

function PaginatedView() {
  const controller = useDataTable({
    columns,
    data: people,
    pagination: true,
  });

  return (
    <DataTableRoot table={controller}>
      <DataTableView<Person> />
    </DataTableRoot>
  );
}

function ControllerCapture({
  onCapture,
}: {
  onCapture(controller: DataTableController<Person>): void;
}) {
  const controller = useDataTableRoot<Person>();

  useLayoutEffect(() => {
    onCapture(controller);
  }, [controller, onCapture]);

  return null;
}

describe('private DataTable Root/View projection', () => {
  it('rejects DataTable context consumers outside DataTableRoot', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      expect(() => render(<DataTableView<Person> />)).toThrow(
        'DataTable components must be rendered inside DataTableRoot.'
      );
    } finally {
      error.mockRestore();
    }
  });

  it('renders every processed row when pagination is not requested', () => {
    render(<DataTable columns={columns} data={people} />);

    expect(screen.getByText('Person 12')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(13);
  });

  it('renders only the current page when pagination is explicit', () => {
    render(<PaginatedView />);

    expect(screen.getByText('Person 10')).toBeInTheDocument();
    expect(screen.queryByText('Person 11')).not.toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(11);
  });

  it('shares one controller and TanStack instance across root, headers, and cells', () => {
    let headerTable: Table<Person> | undefined;
    let cellTable: Table<Person> | undefined;
    const onCapture = vi.fn();
    const instanceColumns: ColumnDef<Person>[] = [
      {
        accessorKey: 'name',
        header: ({ table }) => {
          headerTable = table;
          return 'Name';
        },
        cell: ({ getValue, table }) => {
          cellTable = table;
          return String(getValue());
        },
      },
    ];

    function SharedInstanceView() {
      const controller = useDataTable({
        columns: instanceColumns,
        data: people.slice(0, 1),
      });

      return (
        <DataTableRoot table={controller}>
          <ControllerCapture onCapture={onCapture} />
          <DataTableView<Person> />
        </DataTableRoot>
      );
    }

    render(<SharedInstanceView />);

    const controller = onCapture.mock.calls[0]?.[0] as
      DataTableController<Person> | undefined;
    expect(controller).toBeDefined();
    expect(headerTable).toBe(controller?.table);
    expect(cellTable).toBe(controller?.table);
  });
});

const sortableColumns: ColumnDef<Person>[] = [
  {
    accessorKey: 'rank',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rank" />
    ),
  },
];
const unsortedPeople = [people[2], people[0], people[1]] as Person[];

function SortingView({
  sorting,
  onStateChange,
}: {
  sorting?: readonly DataTableSortDescriptor[];
  onStateChange: NonNullable<
    Parameters<typeof useDataTable<Person>>[0]['onStateChange']
  >;
}) {
  const controller = useDataTable({
    columns: sortableColumns,
    data: unsortedPeople,
    sorting: true,
    ...(sorting === undefined ? {} : { state: { sorting } }),
    onStateChange,
  });

  return (
    <DataTableRoot table={controller}>
      <DataTableView<Person> />
    </DataTableRoot>
  );
}

describe('DataTable View controller state projection', () => {
  it('commits uncontrolled sorting through the shared table', async () => {
    render(<SortingView onStateChange={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: 'Sort by Rank' }));

    expect(screen.getAllByRole('cell').map((cell) => cell.textContent)).toEqual(
      ['3', '2', '1']
    );
  });

  it('requests controlled sorting without committing until the owner updates', async () => {
    const onStateChange = vi.fn();
    const view = render(
      <SortingView sorting={[]} onStateChange={onStateChange} />
    );

    await userEvent.click(screen.getByRole('button', { name: 'Sort by Rank' }));

    expect(screen.getAllByRole('cell').map((cell) => cell.textContent)).toEqual(
      ['3', '1', '2']
    );
    expect(onStateChange).toHaveBeenCalledOnce();
    const event = onStateChange.mock.calls[0]?.[0];
    expect(event).toMatchObject({
      slice: 'sorting',
      cause: 'api',
      value: [{ id: 'rank', desc: true }],
      state: {
        sorting: [{ id: 'rank', desc: true }],
        pagination: { pageIndex: 0, pageSize: 10 },
      },
    });
    expect(event?.requestKey).toBe(event?.query.requestKey);

    view.rerender(
      <SortingView
        sorting={event?.value as SortingState}
        onStateChange={onStateChange}
      />
    );
    expect(screen.getAllByRole('cell').map((cell) => cell.textContent)).toEqual(
      ['3', '2', '1']
    );
  });

  it('preserves same-ID selection through immutable data replacement', () => {
    function SelectionView({ data }: { data: Person[] }) {
      const controller = useDataTable({
        columns,
        data,
        getRowId: (row) => row.id,
        selection: {},
        defaultState: { selection: new Set(['person-1']) },
      });

      return (
        <DataTableRoot table={controller}>
          <DataTableView<Person> />
        </DataTableRoot>
      );
    }

    const view = render(<SelectionView data={people.slice(0, 2)} />);
    const selectedRow = screen.getByText('Person 1').closest('tr');
    expect(selectedRow).toHaveAttribute('data-state', 'selected');

    view.rerender(
      <SelectionView
        data={people.slice(0, 2).map((person) => ({ ...person }))}
      />
    );
    expect(screen.getByText('Person 1').closest('tr')).toHaveAttribute(
      'data-state',
      'selected'
    );
  });
});

describe('DataTable View typed render contexts', () => {
  function HooksView({
    onCapture,
  }: {
    onCapture?: (controller: DataTableController<Person>) => void;
  }) {
    const controller = useDataTable({
      columns,
      data: people.slice(0, 3),
      getRowId: (row) => row.id,
      sorting: true,
    });

    useLayoutEffect(() => {
      onCapture?.(controller);
    }, [controller, onCapture]);

    return (
      <DataTableRoot table={controller}>
        <DataTableView<Person>
          renderHeader={(context) => (
            <button
              type="button"
              data-testid={`head-${context.columnId}`}
              onClick={() => context.toggleSort()}
            >
              {context.columnId}:{context.sortDirection || 'none'}
            </button>
          )}
          renderCell={(context) => (
            <button
              type="button"
              data-testid={`cell-${context.columnId}-${context.row.id}`}
              onClick={() => context.row.toggleSelected()}
            >
              {String(context.value)}
              {context.row.isSelected ? ' *' : ''}
            </button>
          )}
        />
      </DataTableRoot>
    );
  }

  it('projects header context and routes its sort command through the one controller', async () => {
    const user = userEvent.setup();
    let controller: DataTableController<Person> | undefined;
    render(<HooksView onCapture={(instance) => (controller = instance)} />);

    expect(screen.getByTestId('head-name')).toHaveTextContent('name:none');

    await user.click(screen.getByTestId('head-name'));

    expect(screen.getByTestId('head-name')).toHaveTextContent('name:asc');
    expect(controller?.getState().sorting).toEqual([
      { id: 'name', desc: false },
    ]);
  });

  it('projects cell context and routes its selection command through the one controller', async () => {
    const user = userEvent.setup();
    let controller: DataTableController<Person> | undefined;
    render(<HooksView onCapture={(instance) => (controller = instance)} />);

    expect(screen.getByTestId('cell-name-person-1')).toHaveTextContent(
      'Person 1'
    );

    await user.click(screen.getByTestId('cell-name-person-1'));

    expect([...(controller?.getState().selection ?? [])]).toEqual(['person-1']);
    expect(screen.getByTestId('cell-name-person-1')).toHaveTextContent(
      'Person 1 *'
    );
  });

  it('projects the empty state through renderState', () => {
    function EmptyView() {
      const controller = useDataTable({ columns, data: [] });

      return (
        <DataTableRoot table={controller}>
          <DataTableView<Person>
            renderState={(context) => (
              <span>
                custom-{context.status}-{context.rowCount}
              </span>
            )}
          />
        </DataTableRoot>
      );
    }

    render(<EmptyView />);
    expect(screen.getByText('custom-empty-0')).toBeInTheDocument();
  });

  it('projects the loading state through renderState', () => {
    function LoadingView() {
      const controller = useDataTable({ columns, data: people.slice(0, 2) });

      return (
        <DataTableRoot table={controller}>
          <DataTableView<Person>
            skeleton
            renderState={(context) => <span>state-{context.status}</span>}
          />
        </DataTableRoot>
      );
    }

    render(<LoadingView />);
    expect(screen.getByText('state-loading')).toBeInTheDocument();
  });

  it('invokes onRowClick with the clicked row context', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();

    function ClickableView() {
      const controller = useDataTable({
        columns,
        data: people.slice(0, 2),
        getRowId: (row) => row.id,
      });

      return (
        <DataTableRoot table={controller}>
          <DataTableView<Person> onRowClick={onRowClick} />
        </DataTableRoot>
      );
    }

    render(<ClickableView />);
    await user.click(screen.getByText('Person 1'));

    expect(onRowClick).toHaveBeenCalledOnce();
    expect(onRowClick.mock.calls[0]?.[0]?.row).toMatchObject({
      id: 'person-1',
      data: { id: 'person-1', name: 'Person 1' },
    });
  });
});

describe('DataTable View pointer/cell events and roving focus', () => {
  function InteractiveView(props: {
    currentRow?: boolean;
    onRowActivate?: (event: unknown) => void;
    onRowHover?: (event: unknown) => void;
    onCellClick?: (event: unknown) => void;
  }) {
    const controller = useDataTable({
      columns,
      data: people.slice(0, 3),
      getRowId: (row) => row.id,
    });

    return (
      <DataTableRoot table={controller}>
        <DataTableView<Person>
          currentRow={props.currentRow}
          onRowActivate={props.onRowActivate}
          onRowHover={props.onRowHover}
          onCellClick={props.onCellClick}
        />
      </DataTableRoot>
    );
  }

  it('moves the current row with arrow keys via roving focus', async () => {
    const user = userEvent.setup();
    render(<InteractiveView currentRow />);

    const bodyRows = screen.getAllByRole('row').slice(1);
    bodyRows[0].focus();
    expect(bodyRows[0]).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(bodyRows[1]).toHaveAttribute('aria-current', 'true');
    expect(bodyRows[1]).toHaveFocus();

    await user.keyboard('{End}');
    expect(bodyRows[2]).toHaveAttribute('aria-current', 'true');
    expect(bodyRows[2]).toHaveFocus();
  });

  it('gives the focusable row the kit focus treatment, not the UA outline', () => {
    render(<InteractiveView currentRow />);

    // Roving tabindex focuses the row itself, so it must carry a tokenized focus
    // ring — without this the browser paints its own default (black) outline.
    for (const row of screen.getAllByRole('row').slice(1)) {
      expect(row).toHaveClass(
        'outline-none',
        'focus-visible:outline-2',
        'focus-visible:outline-[var(--ui-focus-primary)]'
      );
    }
  });

  it('leaves rows unstyled for focus when row navigation is off', () => {
    render(<InteractiveView />);
    expect(screen.getAllByRole('row')[1]).not.toHaveClass('outline-none');
  });

  it('activates a row on Enter and on double-click', async () => {
    const user = userEvent.setup();
    const onRowActivate = vi.fn();
    render(<InteractiveView currentRow onRowActivate={onRowActivate} />);

    const bodyRows = screen.getAllByRole('row').slice(1);
    bodyRows[0].focus();
    await user.keyboard('{Enter}');
    expect(onRowActivate).toHaveBeenLastCalledWith(
      expect.objectContaining({ via: 'keyboard' })
    );

    await user.dblClick(bodyRows[0]);
    expect(onRowActivate).toHaveBeenLastCalledWith(
      expect.objectContaining({ via: 'pointer' })
    );
  });

  it('emits row hover and cell click events with typed contexts', async () => {
    const user = userEvent.setup();
    const onRowHover = vi.fn();
    const onCellClick = vi.fn();
    render(
      <InteractiveView onRowHover={onRowHover} onCellClick={onCellClick} />
    );

    await user.hover(screen.getAllByRole('row')[1]);
    expect(onRowHover).toHaveBeenCalled();

    await user.click(screen.getByText('Person 1'));
    expect(onCellClick).toHaveBeenCalledWith(
      expect.objectContaining({
        cell: expect.objectContaining({ columnId: 'name' }),
      })
    );
  });
});

interface TreePerson extends Person {
  children?: TreePerson[];
}

const treeColumns: ColumnDef<TreePerson>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'rank', header: 'Rank' },
];

const forest: TreePerson[] = [
  {
    id: 'person-1',
    name: 'Person 1',
    rank: 1,
    children: [{ id: 'person-1-a', name: 'Child A', rank: 11 }],
  },
  { id: 'person-2', name: 'Person 2', rank: 2 },
];

const rowFor = (text: string) => screen.getByText(text).closest('tr')!;

describe('DataTable View expansion domains (ADR-0001)', () => {
  function DetailView() {
    const controller = useDataTable({
      columns,
      data: people.slice(0, 3),
      getRowId: (row) => row.id,
      detailExpansion: {},
      defaultState: { detailExpanded: new Set(['person-1']) },
    });

    return (
      <DataTableRoot table={controller}>
        <DataTableView<Person>
          currentRow
          renderExpandedRow={(row) => <span>Detail for {row.original.id}</span>}
        />
      </DataTableRoot>
    );
  }

  // ADR-0001 consequence 6: roving focus indexes records, not display rows. The
  // detail panel sits between two record rows in the DOM, so Arrow-Down out of
  // an expanded row must skip it.
  it('keeps arrow navigation on record rows across an open detail panel', async () => {
    const user = userEvent.setup();
    render(<DetailView />);

    const detail = rowFor('Detail for person-1');
    const second = rowFor('Person 2');
    expect(rowFor('Person 1').nextElementSibling).toBe(detail);

    rowFor('Person 1').focus();
    await user.keyboard('{ArrowDown}');

    expect(second).toHaveAttribute('aria-current', 'true');
    expect(second).toHaveFocus();
    expect(detail).not.toHaveAttribute('aria-current');
    expect(detail).not.toHaveFocus();

    await user.keyboard('{ArrowUp}');

    expect(rowFor('Person 1')).toHaveAttribute('aria-current', 'true');
    expect(rowFor('Person 1')).toHaveFocus();
  });

  function TreeAndDetailView({
    onCapture,
  }: {
    onCapture: (controller: DataTableController<TreePerson>) => void;
  }) {
    const controller = useDataTable({
      columns: treeColumns as ColumnDef<TreePerson, unknown>[],
      data: forest,
      getRowId: (row) => row.id,
      getSubRows: (row) => row.children,
      detailExpansion: {},
      tree: {},
    });

    useLayoutEffect(() => {
      onCapture(controller);
    }, [controller, onCapture]);

    return (
      <DataTableRoot table={controller}>
        <DataTableView<TreePerson>
          renderExpandedRow={(row) => <span>Detail for {row.original.id}</span>}
        />
      </DataTableRoot>
    );
  }

  it('opens a detail panel and a tree branch on the same row independently', () => {
    let controller: DataTableController<TreePerson> | undefined;
    render(<TreeAndDetailView onCapture={(value) => (controller = value)} />);

    expect(screen.queryByText('Child A')).not.toBeInTheDocument();
    expect(screen.queryByText('Detail for person-1')).not.toBeInTheDocument();

    act(() => {
      controller?.toggle({
        type: 'expand-row',
        id: 'person-1',
        domain: 'detail',
      });
    });

    expect(screen.getByText('Detail for person-1')).toBeInTheDocument();
    expect(screen.queryByText('Child A')).not.toBeInTheDocument();

    act(() => {
      controller?.toggle({
        type: 'expand-row',
        id: 'person-1',
        domain: 'tree',
      });
    });

    // The descendant is a record row from the engine; the detail panel is a
    // render-layer projection. Neither closes the other.
    expect(screen.getByText('Child A')).toBeInTheDocument();
    expect(screen.getByText('Detail for person-1')).toBeInTheDocument();

    act(() => {
      controller?.toggle({
        type: 'expand-row',
        id: 'person-1',
        domain: 'detail',
        expanded: false,
      });
    });

    expect(screen.queryByText('Detail for person-1')).not.toBeInTheDocument();
    expect(screen.getByText('Child A')).toBeInTheDocument();
  });
});

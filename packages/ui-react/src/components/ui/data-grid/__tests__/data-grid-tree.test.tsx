import type { ColumnDef } from '@tanstack/react-table';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DataGrid } from '../data-grid';

// U2 — `tree`, eager half. Acceptance targets:
//   packages/ui-spec/components/data-table/behavior.md  "Nested rows sort within their tree level"
//   packages/ui-spec/components/data-grid/behavior.md   "Tree rows"
//
// Rule 7: every member the config module declares is exercised here in the
// configuration a caller writes — `tree: { getChildren, indent, column }` on a real
// `<DataGrid>`, not a hand-built controller. The lazy members are absent from the
// config surface, so there is nothing here for them either.

interface Unit {
  id: string;
  name: string;
  owner: string;
  reports?: Unit[];
}

const columns: ColumnDef<Unit, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'owner', header: 'Owner' },
];

const rows: Unit[] = [
  {
    id: 'servers',
    name: 'Servers',
    owner: 'Ada',
    reports: [{ id: 'db', name: 'Database', owner: 'Grace' }],
  },
  { id: 'laptops', name: 'Laptops', owner: 'Alan' },
];

const tree = { getChildren: (row: Unit) => row.reports };

const grid = (config: object = tree) => (
  <DataGrid
    columns={columns}
    rows={rows}
    getRowId={(row: Unit) => row.id}
    tree={config as typeof tree}
  />
);

/** The disclosure carries the level in its accessible name (a11y ruling). */
const expander = (name: RegExp) => screen.getByRole('button', { name });

describe('DataGrid tree', () => {
  it('reveals descendants from an in-cell disclosure, not a system column', async () => {
    const user = userEvent.setup();
    render(grid());

    expect(screen.queryByText('Database')).not.toBeInTheDocument();
    await user.click(expander(/^Expand children, level 1$/));
    expect(screen.getByText('Database')).toBeVisible();

    // The disclosure lives INSIDE the first data column's cell. A system column
    // would add a cell to every row and put the control outside the name cell —
    // this is the assertion that tells the two designs apart.
    const nameCell = screen.getByText('Servers').closest('td');
    expect(nameCell).not.toBeNull();
    expect(nameCell!.querySelector('button[aria-expanded]')).not.toBeNull();
    // Two columns declared, two cells rendered: nothing was prepended.
    expect(nameCell!.parentElement!.querySelectorAll('td')).toHaveLength(2);
  });

  it('reports state on the button and emits no aria-controls', async () => {
    const user = userEvent.setup();
    render(grid());

    const button = expander(/^Expand children, level 1$/);
    expect(button).toHaveAttribute('aria-expanded', 'false');

    await user.click(button);

    const open = expander(/^Collapse children, level 1$/);
    expect(open).toHaveAttribute('aria-expanded', 'true');
    // A tree parent discloses a VARIABLE set of sibling rows and several <tr>
    // elements cannot share one id, so there is no single target. Detail
    // expansion controls exactly one projected row and does emit it — that
    // asymmetry is the ruling, so assert it rather than leaving it to drift.
    expect(open).not.toHaveAttribute('aria-controls');
  });

  it('carries the descendant’s level in the disclosure name', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={[
          {
            id: 'a',
            name: 'A',
            owner: 'x',
            reports: [
              {
                id: 'b',
                name: 'B',
                owner: 'y',
                reports: [{ id: 'c', name: 'C', owner: 'z' }],
              },
            ],
          },
        ]}
        getRowId={(row: Unit) => row.id}
        tree={tree}
      />
    );

    await user.click(expander(/^Expand children, level 1$/));
    // Depth is presentational only in a plain grid — `aria-level` is meaningful
    // solely inside a `treegrid` — so the accessible name is the only place a
    // screen reader learns the nesting. A stated limitation, hence asserted.
    expect(expander(/^Expand children, level 2$/)).toBeInTheDocument();
  });

  it('gives a leaf no disclosure', () => {
    render(grid());

    // `Laptops` has no children, so it gets a spacer rather than a control —
    // otherwise its label would slide left under a sibling parent's chevron.
    const leafCell = screen.getByText('Laptops').closest('td');
    expect(leafCell!.querySelector('button')).toBeNull();
    expect(
      screen.getAllByRole('button', { name: /children, level/ })
    ).toHaveLength(1);
  });

  it('indents from the row properties, at the configured step', async () => {
    const user = userEvent.setup();
    const { container } = render(grid({ ...tree, indent: 32 }));
    await user.click(expander(/^Expand children, level 1$/));

    const bodyRows = [
      ...container.querySelectorAll('tbody tr'),
    ] as HTMLElement[];
    // The engine half emits both properties; the cell multiplies them in CSS. A
    // non-default step, so this cannot pass on the hard-coded 20.
    expect(bodyRows[0]!.style.getPropertyValue('--table-tree-indent')).toBe(
      '32px'
    );
    expect(bodyRows[0]!.style.getPropertyValue('--table-tree-depth')).toBe('0');
    expect(bodyRows[1]!.style.getPropertyValue('--table-tree-depth')).toBe('1');
  });

  it('moves the disclosure to a named column', () => {
    render(grid({ ...tree, column: 'owner' }));

    // `column` is the escape hatch for when the first DECLARED column is not
    // where the disclosure belongs.
    expect(
      screen.getByText('Ada').closest('td')!.querySelector('button')
    ).not.toBeNull();
    expect(
      screen.getByText('Servers').closest('td')!.querySelector('button')
    ).toBeNull();
  });

  it('leaves every column alone when the named column does not exist', () => {
    render(grid({ ...tree, column: 'nope' }));

    // Deliberate: silently falling back to the first column would hide a typo
    // behind a tree that looks like it works. The symptom is the documented one —
    // no disclosure at all, same as hiding the tree column.
    expect(
      screen.queryAllByRole('button', { name: /children, level/ })
    ).toHaveLength(0);
    expect(screen.getByText('Servers')).toBeVisible();
  });

  it('reports expansion on onTreeExpansionChange, and never on the detail one', async () => {
    const user = userEvent.setup();
    const onTreeExpansionChange = vi.fn();
    const onDetailExpansionChange = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row: Unit) => row.id}
        tree={tree}
        detailExpansion={{ render: () => <span>panel</span> }}
        callbacks={{ onTreeExpansionChange, onDetailExpansionChange }}
      />
    );

    await user.click(expander(/^Expand children, level 1$/));

    // ADR-0001's payload, asserted from the caller's side: the two domains share
    // no slice and no callback, so a screen subscribed to one must never be woken
    // by the other. Both groups are enabled here on purpose — with only `tree`
    // configured this assertion would pass for the wrong reason.
    expect(onTreeExpansionChange).toHaveBeenCalledTimes(1);
    expect(onDetailExpansionChange).not.toHaveBeenCalled();

    const event = onTreeExpansionChange.mock.calls[0]![0] as {
      slice: string;
      value: ReadonlySet<string>;
    };
    expect(event.slice).toBe('treeExpanded');
    expect([...event.value]).toEqual(['servers']);
  });

  it('preserves the tree column’s own cell renderer', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={[
          {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ getValue }) => (
              <b data-testid="custom">{String(getValue())}</b>
            ),
          },
          { accessorKey: 'owner', header: 'Owner' },
        ]}
        rows={rows}
        getRowId={(row: Unit) => row.id}
        tree={tree}
      />
    );

    // The transform WRAPS the caller's renderer rather than replacing it — the
    // failure mode is a tree that quietly discards custom cell content.
    expect(screen.getAllByTestId('custom')[0]).toHaveTextContent('Servers');
    await user.click(expander(/^Expand children, level 1$/));
    expect(
      screen.getAllByTestId('custom').map((node) => node.textContent)
    ).toEqual(['Servers', 'Database', 'Laptops']);
  });
});

describe('DataGrid tree — lazy children', () => {
  const lazyRows: Unit[] = [
    {
      id: 'servers',
      name: 'Servers',
      owner: 'Ada',
      reports: [{ id: 'db', name: 'Database', owner: 'Grace' }],
    },
    // No `reports`, so expanding it is what starts a request.
    { id: 'remote', name: 'Remote', owner: 'Alan' },
  ];

  const deferred = () => {
    let resolve!: (value: readonly Unit[]) => void;
    let reject!: (error: unknown) => void;
    const promise = new Promise<readonly Unit[]>((res, rej) => {
      resolve = res;
      reject = rej;
    });

    return { promise, resolve, reject };
  };

  const lazyGrid = (config: object, callbacks?: object) => (
    <DataGrid
      columns={columns}
      rows={lazyRows}
      getRowId={(row: Unit) => row.id}
      tree={config as typeof tree}
      {...(callbacks ? { callbacks } : {})}
    />
  );

  it('shows the spinner shell, then the fetched children as real rows', async () => {
    const user = userEvent.setup();
    const gate = deferred();
    const loadChildren = vi.fn(() => gate.promise);
    render(lazyGrid({ ...tree, loadChildren }));

    // With a loader configured BOTH roots get a disclosure — the library cannot
    // know whether `Remote` has children until it asks. Index 1 is `Remote`.
    await user.click(
      screen.getAllByRole('button', { name: /children, level 1/ })[1]!
    );

    // DataGrid owns the Spinner/Alert/retry chrome; the engine renders none of it.
    expect(loadChildren).toHaveBeenCalledOnce();
    // Assert the a11y contract, not just a string: the shell must expose a live
    // region, which is what makes an async row change announce at all.
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading child items…')).toBeInTheDocument();

    await act(async () => {
      gate.resolve([
        { id: 'remote-a', name: 'Branch office', owner: 'Katherine' },
      ]);
      await gate.promise;
    });

    // The whole point: a fetched child becomes a record row, not a status row.
    expect(screen.getByText('Branch office')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="tree-status-row"]')).toBeNull();
  });

  it('renders the default Alert with a working retry on failure', async () => {
    const user = userEvent.setup();
    const first = deferred();
    const second = deferred();
    let attempt = 0;
    render(
      lazyGrid({
        ...tree,
        loadChildren: () => {
          attempt += 1;

          return attempt === 1 ? first.promise : second.promise;
        },
      })
    );

    await user.click(
      screen.getAllByRole('button', { name: /children, level 1/ })[1]!
    );
    await act(async () => {
      first.reject(new Error('network down'));
      await first.promise.catch(() => undefined);
    });

    expect(screen.getByText('Could not load child items')).toBeInTheDocument();
    expect(screen.getByText(/network down/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(attempt).toBe(2);

    await act(async () => {
      second.resolve([
        { id: 'remote-a', name: 'Branch office', owner: 'Katherine' },
      ]);
      await second.promise;
    });
    expect(screen.getByText('Branch office')).toBeInTheDocument();
  });

  it('lets renderLoadError replace the failure branch but not the spinner', async () => {
    const user = userEvent.setup();
    const gate = deferred();
    render(
      lazyGrid({
        ...tree,
        loadChildren: () => gate.promise,
        renderLoadError: ({ row, retry }: { row: Unit; retry: () => void }) => (
          <button type="button" onClick={retry}>
            Custom failure for {row.name}
          </button>
        ),
      })
    );

    await user.click(
      screen.getAllByRole('button', { name: /children, level 1/ })[1]!
    );
    // The spinner is NOT overridable — a caller replacing the failure state should
    // not have to reimplement loading.
    expect(screen.getByText('Loading child items…')).toBeInTheDocument();

    await act(async () => {
      gate.reject(new Error('nope'));
      await gate.promise.catch(() => undefined);
    });

    expect(screen.getByText('Custom failure for Remote')).toBeInTheDocument();
    expect(
      screen.queryByText('Could not load child items')
    ).not.toBeInTheDocument();
  });

  it('reports transitions on onTreeLoad, which has no slice projection', async () => {
    const user = userEvent.setup();
    const gate = deferred();
    const onTreeLoad = vi.fn();
    const onStateChange = vi.fn();
    render(
      lazyGrid(
        { ...tree, loadChildren: () => gate.promise },
        { onTreeLoad, onStateChange }
      )
    );

    await user.click(
      screen.getAllByRole('button', { name: /children, level 1/ })[1]!
    );
    await act(async () => {
      gate.resolve([
        { id: 'remote-a', name: 'Branch office', owner: 'Katherine' },
      ]);
      await gate.promise;
    });

    expect(
      onTreeLoad.mock.calls.map(
        (call) => (call[0] as { status: string }).status
      )
    ).toEqual(['loading', 'loaded']);
    // And it is genuinely not slice-derived: no `treeLoad` slice exists, so
    // `onStateChange` reports the expansion and never a load.
    expect(
      onStateChange.mock.calls.map(
        (call) => (call[0] as { slice: string }).slice
      )
    ).not.toContain('treeLoad');
  });

  it('emits no status row and no request without a loader', async () => {
    const user = userEvent.setup();
    render(lazyGrid(tree));

    await user.click(
      screen.getAllByRole('button', { name: /children, level 1/ })[1]!
    );

    // An eager tree is a complete configuration. Expanding a childless row in one
    // reveals nothing and must not synthesise a status row.
    expect(document.querySelector('[data-slot="tree-status-row"]')).toBeNull();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  // F4's required regression assertion. `graftData` closes over the POST-`dataState`
  // array, so an error state must stay empty; if the copy ever came from the
  // caller's rows instead, an error grid would show data. That is the specific bug
  // the read-only `graftData` binding exists to make unrepresentable, and nothing
  // else in the suite would catch it.
  it('renders no data rows when dataState is in error, tree configured', () => {
    const { container } = render(
      <DataGrid
        columns={columns}
        rows={lazyRows}
        getRowId={(row: Unit) => row.id}
        tree={{ ...tree, loadChildren: () => deferred().promise }}
        dataState={{ status: 'error', error: 'boom' }}
      />
    );

    expect(screen.queryByText('Servers')).not.toBeInTheDocument();
    expect(
      container.querySelectorAll('tbody tr [data-slot="tree-status-row"]')
    ).toHaveLength(0);
    expect(screen.getByText('boom')).toBeInTheDocument();
  });
});

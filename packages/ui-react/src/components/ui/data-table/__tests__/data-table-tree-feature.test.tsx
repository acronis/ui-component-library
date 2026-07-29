import { useLayoutEffect, type ReactElement } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';

import { TableCell, TableRow } from '../../table';
import {
  useDataTable,
  type DataTableController,
} from '../data-table-controller';
import {
  DATA_TABLE_TREE_DEFAULT_INDENT,
  DATA_TABLE_TREE_DEPTH_PROPERTY,
  DATA_TABLE_TREE_INDENT_PROPERTY,
  type DataTableTreeStatusContext,
} from '../data-table-features/tree';
import type {
  DataTableFeatureContext,
  DataTableFeatureModule,
} from '../data-table-features/registry';
import { createRowContext } from '../data-table-render-context';
import { DataTableRoot } from '../data-table-root';
import { DataTableView } from '../data-table-view';

// Rule 7: every contribution point `tree.ts` declares has its consumer and its
// assertion here, **in the configuration a real caller produces** — a DataTable
// with `tree: { getChildren, indent }` for the eager half and
// `tree: { getChildren, loadChildren, renderStatus }` for the lazy one, never
// `getSubRows` alone. The deprecated raw-`getSubRows` route has its own coverage in
// `data-table-controller.test.tsx`; asserting the config route against it is what
// this file is for.
//
// Driving the machine directly (`data-table-tree.test.tsx`) verifies the machine. It
// does not verify that `effects` publishes it, that the expand→fetch wire exists,
// that `renderContext` reads it, that the status row reaches the DOM, or — the one
// that took four analyses to get right — that fetched children ever become rows.

interface Node {
  id: string;
  name: string;
  children?: Node[];
}

const columns: ColumnDef<Node, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
];

const forest: Node[] = [
  { id: 'p', name: 'Parent', children: [{ id: 'c', name: 'Child' }] },
  { id: 'leaf', name: 'Leaf' },
];

/** `p` has a static child; `lazy` has none until a fetch supplies them. */
const lazyForest: Node[] = [
  { id: 'p', name: 'Parent', children: [{ id: 'c', name: 'Child' }] },
  { id: 'lazy', name: 'Lazy' },
];

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

function renderStatusRow({
  status,
  error,
  retry,
  colSpan,
  domId,
}: DataTableTreeStatusContext<Node>) {
  // One ref-forwarding element, per the body-window seam's measurement contract.
  return (
    <TableRow id={domId} data-testid="tree-status">
      <TableCell colSpan={colSpan}>
        {status === 'loading' ? (
          <span>Loading children…</span>
        ) : (
          <span>Failed: {String(error)}</span>
        )}
        {/* Reachable in BOTH states on purpose: a caller may offer "try again" on a
            slow branch, and it is the only way two requests for one row overlap. */}
        <button type="button" onClick={retry}>
          Retry
        </button>
      </TableCell>
    </TableRow>
  );
}

/** Renders the lazy configuration and exposes the controller. */
function LazyTreeView({
  loadChildren,
  withRenderer = true,
  withDetail = false,
  onCapture,
}: {
  loadChildren?: (row: Node, requestKey: string) => Promise<readonly Node[]>;
  withRenderer?: boolean;
  withDetail?: boolean;
  onCapture?: (controller: DataTableController<Node>) => void;
}) {
  const controller = useDataTable({
    columns,
    data: lazyForest,
    getRowId: (row) => row.id,
    tree: {
      getChildren: (row: Node) => row.children,
      ...(loadChildren === undefined ? {} : { loadChildren }),
      ...(withRenderer ? { renderStatus: renderStatusRow } : {}),
    },
    ...(withDetail ? { detailExpansion: { render: () => null } } : {}),
    defaultState: { treeExpanded: new Set(['p']) },
  });

  useLayoutEffect(() => {
    onCapture?.(controller);
  }, [controller, onCapture]);

  return (
    <DataTableRoot table={controller}>
      <DataTableView<Node> />
    </DataTableRoot>
  );
}

describe('tree feature — engineOptions', () => {
  it('feeds getSubRows from the config route, not only the deprecated one', () => {
    const { result } = renderHook(() =>
      useDataTable({
        columns,
        data: forest,
        getRowId: (row) => row.id,
        tree: { getChildren: (row: Node) => row.children },
        defaultState: { treeExpanded: new Set(['p']) },
      })
    );

    // No `getSubRows` prop anywhere — relationships came from `tree.getChildren`.
    expect(
      result.current.table.getRowModel().rows.map((row) => row.id)
    ).toEqual(['p', 'c', 'leaf']);
    expect(result.current.table.options.getExpandedRowModel).toBeTypeOf(
      'function'
    );
  });

  it('prefers the config route over the caller’s raw getSubRows', () => {
    const rawGetSubRows = vi.fn<(row: Node) => Node[] | undefined>(
      () => undefined
    );
    const { result } = renderHook(() =>
      useDataTable({
        columns,
        data: forest,
        getRowId: (row) => row.id,
        getSubRows: rawGetSubRows,
        tree: { getChildren: (row: Node) => row.children },
        defaultState: { treeExpanded: new Set(['p']) },
      })
    );

    expect(
      result.current.table.getRowModel().rows.map((row) => row.id)
    ).toEqual(['p', 'c', 'leaf']);
    // The config route answered first for every record it could resolve, so the
    // raw accessor was consulted only for records the config returned nothing for.
    expect(rawGetSubRows).not.toHaveBeenCalledWith(
      forest[0],
      expect.anything()
    );
  });

  // behavior.md — "Nested rows sort within their tree level". A test rather than
  // an implementation: getSortedRowModel() already sorts within each level.
  it('sorts siblings within their parent instead of flattening them', () => {
    interface Ranked {
      id: string;
      rank: number;
      children?: Ranked[];
    }
    const ranked: Ranked[] = [
      {
        id: 'b',
        rank: 2,
        children: [
          { id: 'b2', rank: 20 },
          { id: 'b1', rank: 10 },
        ],
      },
      {
        id: 'a',
        rank: 1,
        children: [
          { id: 'a2', rank: 200 },
          { id: 'a1', rank: 100 },
        ],
      },
    ];
    const { result } = renderHook(() =>
      useDataTable({
        columns: [{ accessorKey: 'rank', header: 'Rank' }] as ColumnDef<
          Ranked,
          unknown
        >[],
        data: ranked,
        getRowId: (row) => row.id,
        tree: { getChildren: (row: Ranked) => row.children },
        sorting: true,
        defaultState: {
          treeExpanded: new Set(['a', 'b']),
          sorting: [{ id: 'rank', desc: false }],
        },
      })
    );
    const rows = result.current.table.getRowModel().rows;

    // Flattened into one root order this would be 1,2,10,20,100,200.
    expect(rows.map((row) => row.id)).toEqual([
      'a',
      'a1',
      'a2',
      'b',
      'b1',
      'b2',
    ]);
    expect(rows.map((row) => row.depth)).toEqual([0, 1, 1, 0, 1, 1]);
  });

  // ADR-0001 OQ-2, decided the opposite way from detail rows and asserted here
  // because until now it lived only in a comment claiming it was "established by
  // experiment". A descendant is a real record entering the row model before
  // pagination; a detail row is a presentation of a record already on the page.
  it('lets tree descendants consume pagination slots, displacing a sibling root', () => {
    const controllerWith = (pageSize: number) =>
      renderHook(() =>
        useDataTable({
          columns,
          data: [
            {
              id: 'p1',
              name: 'First',
              children: [
                { id: 'c1', name: 'C1' },
                { id: 'c2', name: 'C2' },
              ],
            },
            { id: 'p2', name: 'Second' },
          ] as Node[],
          getRowId: (row) => row.id,
          tree: { getChildren: (row: Node) => row.children },
          pagination: true,
          defaultState: {
            treeExpanded: new Set(['p1']),
            pagination: { pageIndex: 0, pageSize },
          },
        })
      ).result.current;

    // Two slots: the parent takes one, its first child the other, and the sibling
    // ROOT is pushed to page two. `paginateExpandedRows` stays unset deliberately.
    expect(
      controllerWith(2)
        .table.getRowModel()
        .rows.map((row) => row.id)
    ).toEqual(['p1', 'c1']);
    expect(
      controllerWith(4)
        .table.getRowModel()
        .rows.map((row) => row.id)
    ).toEqual(['p1', 'c1', 'c2', 'p2']);
  });
});

describe('tree feature — rowPresentation carries the indentation', () => {
  const rowsOf = (element: ReactElement) => {
    const { container } = render(element);

    return [...container.querySelectorAll('tbody tr')] as HTMLElement[];
  };

  const TreeView = ({ indent }: { indent?: number }) => {
    const controller = useDataTable({
      columns,
      data: forest,
      getRowId: (row) => row.id,
      tree: {
        getChildren: (row: Node) => row.children,
        ...(indent === undefined ? {} : { indent }),
      },
      defaultState: { treeExpanded: new Set(['p']) },
    });

    return (
      <DataTableRoot table={controller}>
        <DataTableView<Node> />
      </DataTableRoot>
    );
  };

  it('puts the nesting depth on every record row', () => {
    // Parent, its child, then the sibling root — depth 0, 1, 0.
    expect(
      rowsOf(<TreeView />).map((row) =>
        row.style.getPropertyValue(DATA_TABLE_TREE_DEPTH_PROPERTY)
      )
    ).toEqual(['0', '1', '0']);
  });

  // `indent` asserted at a NON-default value first: with 20 the assertion cannot
  // tell a wired config from the hard-coded default, which is the "check that
  // cannot fail" shape. 32 can only come from the config.
  it('carries a configured indent step as a length, next to the depth', () => {
    const rows = rowsOf(<TreeView indent={32} />);

    expect(
      rows.map((row) =>
        row.style.getPropertyValue(DATA_TABLE_TREE_INDENT_PROPERTY)
      )
    ).toEqual(['32px', '32px', '32px']);
    // Both properties on the same element, which is what makes the documented
    // `calc(var(--table-tree-depth) * var(--table-tree-indent))` resolvable from
    // one selector.
    expect(
      rows[1]!.style.getPropertyValue(DATA_TABLE_TREE_DEPTH_PROPERTY)
    ).toBe('1');
  });

  it('falls back to the design §5.2 default indent step', () => {
    expect(
      rowsOf(<TreeView />)[0]!.style.getPropertyValue(
        DATA_TABLE_TREE_INDENT_PROPERTY
      )
    ).toBe(`${DATA_TABLE_TREE_DEFAULT_INDENT}px`);
  });

  it('contributes no row presentation when no tree is configured', () => {
    const Flat = () => {
      const controller = useDataTable({
        columns,
        data: [{ id: 'only', name: 'Only' }] as Node[],
        getRowId: (row) => row.id,
      });

      return (
        <DataTableRoot table={controller}>
          <DataTableView<Node> />
        </DataTableRoot>
      );
    };

    expect(
      rowsOf(<Flat />)[0]!.style.getPropertyValue(
        DATA_TABLE_TREE_DEPTH_PROPERTY
      )
    ).toBe('');
  });
});

// ───────────────────────────────────────────────────────────────────────────────
// THIS IS THE ONLY COVERAGE OF THE ONE-LEVEL-DEEP NAMESPACE MERGE. Do not delete
// it, and do not replace it with a test-only stand-in feature.
//
// `data-table-render-context.ts` declares
//   const NESTED_CONTEXT_NAMESPACES = ['detail', 'tree'] as const;
// — a CLOSED constant. A test-only feature contributing a FRESH namespace is not
// nested-mergeable at all; it is a plain top-level replace, which does not
// exercise the merge. Both members of that constant are owned by production
// modules, so the merge has no test-only surface BY DESIGN.
//
// It is asserted through `detail-expansion` rather than `tree` because `tree`
// contributes no render-context field while lazy children are unshipped —
// `detail-expansion` is the only live nested contributor in the tree today. If
// you change which keys `detail-expansion` contributes, you must MOVE this
// coverage, not drop it. Nothing else will fail.
//
// Verified to fail on the defect it guards: renaming `detail` in
// `NESTED_CONTEXT_NAMESPACES` turns it red with `expected undefined to be false`
// — `isExpanded` gone with the replaced namespace.
// ───────────────────────────────────────────────────────────────────────────────
describe('renderContext merges into a namespace instead of replacing it', () => {
  it('keeps the base members of a namespace a feature contributes into', () => {
    let controller: DataTableController<Node> | undefined;
    const Both = () => {
      // Captured in an effect, not assigned during render: reassigning an outer
      // variable while rendering is a side effect in a render path, which is what
      // `react-hooks/globals` catches.
      const table = useDataTable({
        columns,
        data: forest,
        getRowId: (row) => row.id,
        // Both domains at once: independent slices, independent callbacks,
        // independent display-row kinds (ADR-0001).
        tree: { getChildren: (row: Node) => row.children },
        detailExpansion: { render: () => null },
        defaultState: { treeExpanded: new Set(['p']) },
      });
      useLayoutEffect(() => {
        controller = table;
      }, [table]);

      return (
        <DataTableRoot table={table}>
          <DataTableView<Node> />
        </DataTableRoot>
      );
    };
    render(<Both />);

    const parent = controller!.table.getRowModel().rows[0]!;
    const context = createRowContext(parent, controller!);

    // `detail-expansion`'s `renderContext` contributes `detail.canExpand` and
    // nothing else. Without the one-level-deep merge the other two members are
    // discarded along with the namespace they live in.
    expect(context.detail.canExpand).toBe(true);
    expect(context.detail.isExpanded).toBe(false);
    expect(typeof context.detail.toggle).toBe('function');

    // The sibling namespace is untouched, and still carries the base defaults the
    // tree module leaves in place.
    expect(context.tree.isExpanded).toBe(true);
    expect(context.tree.depth).toBe(0);
    expect(context.tree.hasChildren).toBe(true);
    expect(context.tree.loadState).toBe('idle');
  });
});

describe('tree feature — effects publishes the machine and wires expand→fetch', () => {
  // THE TWO ASSERTIONS THAT FOUND THE DEFECT. Both failed for weeks on
  // `getByText('Fetched')` — never on the status row, which always worked — because
  // `getCoreRowModel` is `memo(() => [table.options.data], …)` and a machine
  // consulted from inside `getSubRows` cannot invalidate that memo. They are
  // unchanged from the form that caught it. Do not weaken them: the temptation is
  // to assert `childrenOf` instead of the rendered row, and that is precisely the
  // assertion that would have passed throughout the bug.
  it('fetches children when a childless row is expanded, and shows them', async () => {
    const gate = deferred<readonly Node[]>();
    const loadChildren = vi.fn(() => gate.promise);
    let controller: DataTableController<Node> | undefined;
    render(
      <LazyTreeView
        loadChildren={loadChildren}
        onCapture={(value) => (controller = value)}
      />
    );

    // `lazy` has no children, so expanding it is what starts a request. Without
    // the effects wire this never fires and `loadChildren` is inert.
    expect(loadChildren).not.toHaveBeenCalled();

    await act(async () => {
      controller!.toggle({ type: 'expand-row', id: 'lazy', domain: 'tree' });
    });

    expect(loadChildren).toHaveBeenCalledOnce();
    expect(screen.getByText('Loading children…')).toBeInTheDocument();

    await act(async () => {
      gate.resolve([{ id: 'lazy-a', name: 'Fetched' }]);
      await gate.promise;
    });

    // The fetched child is a real record row in the model, not a status row.
    expect(screen.getByText('Fetched')).toBeInTheDocument();
    expect(screen.queryByTestId('tree-status')).not.toBeInTheDocument();
    expect(controller!.table.getRowModel().rows.map((row) => row.id)).toContain(
      'lazy-a'
    );
  });

  it('copies data once per arrival, not once per render', async () => {
    const gate = deferred<readonly Node[]>();
    let controller: DataTableController<Node> | undefined;
    const { rerender } = render(
      <LazyTreeView
        loadChildren={() => gate.promise}
        onCapture={(value) => (controller = value)}
      />
    );

    const identity = () => controller!.table.options.data;
    const before = identity();

    // An idle re-render must NOT produce a new array. This is the half of the
    // mechanism no correctness assertion covers: copying every render works and
    // rebuilds the core row model continuously, on a component whose whole purpose
    // is large datasets. Only an identity assertion can see it.
    rerender(
      <LazyTreeView
        loadChildren={() => gate.promise}
        onCapture={(value) => (controller = value)}
      />
    );
    expect(identity()).toBe(before);

    await act(async () => {
      controller!.toggle({ type: 'expand-row', id: 'lazy', domain: 'tree' });
    });
    // Still nothing has ARRIVED — a request is in flight, which is not an arrival.
    expect(identity()).toBe(before);

    await act(async () => {
      gate.resolve([{ id: 'lazy-a', name: 'Fetched' }]);
      await gate.promise;
    });
    const afterArrival = identity();
    expect(afterArrival).not.toBe(before);

    // And one arrival buys exactly one new identity, not one per render after it.
    rerender(
      <LazyTreeView
        loadChildren={() => gate.promise}
        onCapture={(value) => (controller = value)}
      />
    );
    expect(identity()).toBe(afterArrival);
  });

  it('leaves data untouched when no loader is configured', () => {
    const { result, rerender } = renderHook(() =>
      useDataTable({
        columns,
        data: forest,
        getRowId: (row) => row.id,
        tree: { getChildren: (row: Node) => row.children },
      })
    );

    // Generation 0 returns the caller's array itself. The inert path has to be
    // genuinely inert — a grid with no `loadChildren` must not pay for a copy.
    expect(result.current.table.options.data).toBe(forest);
    rerender();
    expect(result.current.table.options.data).toBe(forest);
  });

  it('keeps loadState keyed per row', async () => {
    const gate = deferred<readonly Node[]>();
    let controller: DataTableController<Node> | undefined;
    render(
      <LazyTreeView
        loadChildren={() => gate.promise}
        onCapture={(value) => (controller = value)}
      />
    );

    await act(async () => {
      controller!.toggle({ type: 'expand-row', id: 'lazy', domain: 'tree' });
    });

    const contextFor = (id: string) =>
      createRowContext(
        controller!.table.getRowModel().rows.find((row) => row.id === id)!,
        controller!
      );

    expect(contextFor('lazy').tree.loadState).toBe('loading');
    // `p` already had children, so it was never requested.
    expect(contextFor('p').tree.loadState).toBe('idle');
  });
});

describe('tree feature — the tree-status display row', () => {
  it('renders a failed branch with a working retry command', async () => {
    const user = userEvent.setup();
    const first = deferred<readonly Node[]>();
    const second = deferred<readonly Node[]>();
    let attempt = 0;
    let controller: DataTableController<Node> | undefined;
    render(
      <LazyTreeView
        loadChildren={() => {
          attempt += 1;
          return attempt === 1 ? first.promise : second.promise;
        }}
        onCapture={(value) => (controller = value)}
      />
    );

    await act(async () => {
      controller!.toggle({ type: 'expand-row', id: 'lazy', domain: 'tree' });
    });
    await act(async () => {
      first.reject(new Error('offline'));
      await first.promise.catch(() => undefined);
    });

    // The status row carries the §7 ARIA id scheme for the tree domain.
    const statusRow = screen.getByTestId('tree-status');
    expect(statusRow.id).toContain('--tree--');
    expect(screen.getByText(/offline/)).toBeInTheDocument();

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Retry' }));
    });
    expect(attempt).toBe(2);
    expect(screen.getByText('Loading children…')).toBeInTheDocument();

    await act(async () => {
      second.resolve([{ id: 'lazy-a', name: 'Fetched' }]);
      await second.promise;
    });
    expect(screen.getByText('Fetched')).toBeInTheDocument();
  });

  it('drops a superseded result instead of letting it overwrite a newer one', async () => {
    const user = userEvent.setup();
    const first = deferred<readonly Node[]>();
    const second = deferred<readonly Node[]>();
    let attempt = 0;
    let controller: DataTableController<Node> | undefined;
    render(
      <LazyTreeView
        loadChildren={() => {
          attempt += 1;
          return attempt === 1 ? first.promise : second.promise;
        }}
        onCapture={(value) => (controller = value)}
      />
    );

    await act(async () => {
      controller!.toggle({ type: 'expand-row', id: 'lazy', domain: 'tree' });
    });
    // Request #1 is in flight and unsettled. Retrying now supersedes it with a new
    // key while the old one is still pending — two live requests for one row.
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Retry' }));
    });
    expect(attempt).toBe(2);

    await act(async () => {
      second.resolve([{ id: 'lazy-newer', name: 'Newer' }]);
      await second.promise;
    });
    expect(screen.getByText('Newer')).toBeInTheDocument();

    await act(async () => {
      // #1 resolves LAST, with different children. Its key is no longer the row's
      // current key, so it must reach nothing. `behavior.md` assigns stale
      // rejection to the library, which is why this cannot be the caller's job —
      // and the negative here is real: these children genuinely resolved.
      first.resolve([{ id: 'lazy-stale', name: 'Stale' }]);
      await first.promise;
    });

    expect(screen.queryByText('Stale')).not.toBeInTheDocument();
    expect(screen.getByText('Newer')).toBeInTheDocument();
    expect(
      controller!.table.getRowModel().rows.map((row) => row.id)
    ).not.toContain('lazy-stale');
  });

  it('emits no status row when no renderer is configured', async () => {
    const gate = deferred<readonly Node[]>();
    let controller: DataTableController<Node> | undefined;
    render(
      <LazyTreeView
        withRenderer={false}
        loadChildren={() => gate.promise}
        onCapture={(value) => (controller = value)}
      />
    );

    await act(async () => {
      controller!.toggle({ type: 'expand-row', id: 'lazy', domain: 'tree' });
    });

    // The request is running — the row is just not projected, mirroring the
    // shipped detail projection with no `render`.
    expect(
      createRowContext(
        controller!.table.getRowModel().rows.find((row) => row.id === 'lazy')!,
        controller!
      ).tree.loadState
    ).toBe('loading');
    expect(screen.queryByTestId('tree-status')).not.toBeInTheDocument();
  });

  it('reports each transition on onLoad, with the request key', async () => {
    const gate = deferred<readonly Node[]>();
    const onLoad = vi.fn();
    let controller: DataTableController<Node> | undefined;
    const Harness = () => {
      const table = useDataTable({
        columns,
        data: lazyForest,
        getRowId: (row) => row.id,
        tree: {
          getChildren: (row: Node) => row.children,
          loadChildren: () => gate.promise,
          renderStatus: renderStatusRow,
          onLoad,
        },
      });
      useLayoutEffect(() => {
        controller = table;
      }, [table]);

      return (
        <DataTableRoot table={table}>
          <DataTableView<Node> />
        </DataTableRoot>
      );
    };
    render(<Harness />);

    await act(async () => {
      controller!.toggle({ type: 'expand-row', id: 'lazy', domain: 'tree' });
    });
    await act(async () => {
      gate.resolve([{ id: 'lazy-a', name: 'Fetched' }]);
      await gate.promise;
    });

    // `onLoad` is what DataGrid's `onTreeLoad` maps to, and it is deliberately NOT
    // slice-derived — there is no `treeLoad` slice — so this is the only place its
    // reach is provable.
    const statuses = onLoad.mock.calls.map(
      (call) => (call[0] as { status: string }).status
    );
    expect(statuses).toEqual(['loading', 'loaded']);
    const [loading, loaded] = onLoad.mock.calls.map(
      (call) => call[0] as { rowId: string; requestKey: string }
    );
    expect(loading!.rowId).toBe('lazy');
    // Same request, so the same key on both transitions — that is what makes a
    // superseded result identifiable at all.
    expect(loaded!.requestKey).toBe(loading!.requestKey);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// THE SEAM'S RETURN TYPE, CHECKED AGAINST ITS ONLY REAL CONSUMER.
//
// `graftedData` has four assertions of its own and they all call it **directly**,
// so its return type had never been checked against the thing it exists to feed:
// an `engineOptions` contribution. That gap is why `tree.ts` needs a cast, and why
// the need for one was discovered by a `tsc` error rather than by a test.
//
// These two assertions close the class rather than the instance. A future member
// added to the seam's output that does not fit `Partial<TableOptions>` would
// otherwise fail in whichever feature happened to use it next, which is the
// attribution problem this programme keeps paying for.
// ─────────────────────────────────────────────────────────────────────────────
describe('graftData’s output vs the engine option it feeds', () => {
  type EngineContribution = ReturnType<
    NonNullable<DataTableFeatureModule<Node>['engineOptions']>
  >;
  type Grafted = ReturnType<DataTableFeatureContext<Node>['graftData']>;

  it('is readonly, so it does NOT satisfy the mutable `data` option unaided', () => {
    // This is the assertion that documents the cast in `tree.ts`. `graftData`
    // returns `readonly` deliberately: at generation 0 it hands back the
    // controller's own array, and a mutable type would give every feature a
    // writable reference to it. TanStack's `data` is mutable.
    //
    // **If this ever starts failing, the cast is dead** and should be deleted
    // deliberately rather than left as noise — which is the outcome this assertion
    // exists to force, because nothing else would notice.
    expectTypeOf<{ data: Grafted }>().not.toExtend<EngineContribution>();
  });

  it('satisfies the option once the boundary cast is applied', () => {
    // The positive half. `defineDataTableFeature` already enforces this on
    // `tree.ts` itself, so this is the *stated* version of what that enforcement
    // means — and it is what makes the pair above readable as a boundary rather
    // than as a curiosity.
    expectTypeOf<{
      data: Grafted extends readonly (infer T)[] ? T[] : never;
    }>().toExtend<EngineContribution>();
  });
});

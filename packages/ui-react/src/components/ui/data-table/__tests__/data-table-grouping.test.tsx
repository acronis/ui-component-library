import { useLayoutEffect } from 'react';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import {
  useDataTable,
  type DataTableController,
} from '../data-table-controller';
import { UNSHIPPED_DISPLAY_ROW_KINDS } from '../data-table-display-rows';
import { DATA_TABLE_FEATURES } from '../data-table-features';
import { groupingFeature } from '../data-table-features/grouping';
import type { DataTableGroupContext } from '../data-table-features/grouping';
import {
  renderDisplayRow,
  type DataTableFeatureContext,
} from '../data-table-features/registry';
import { treeFeature } from '../data-table-features/tree';
import { DataTableRoot } from '../data-table-root';
import { DataTableView } from '../data-table-view';

// Rule 7 for `grouping.tsx`: every contribution point, in the configuration a real
// caller produces — `grouping: { allowedColumns }` plus a non-empty `grouping`
// state slice, which is how a grid is actually grouped — never by poking the row
// model.
//
// The one thing this file exists for above all others: **`getGroupedRowModel()`
// alone renders group headers and no members.** The grouped model nests each
// group's members in `subRows`, and the stock expand stage returns early while
// `state.expanded` is `{}`. So an implementation that installs the grouped model
// and stops looks plausible, groups "work", and every member row is missing. Every
// row-model assertion below therefore names the members as well as the headers,
// and in order.

interface Task {
  readonly id: string;
  readonly name: string;
  readonly status: string | null;
  readonly children?: readonly Task[];
}

const columns: ColumnDef<Task, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
];

/**
 * The ungrouped records come **first** deliberately.
 *
 * `groupBy` keys its map in first-encounter order, so the null-status bucket lands
 * first naturally — which means the default `position: 'last'` has to *move* it.
 * Put those records last instead and an implementation that ignores `position`
 * entirely passes the ordering assertion.
 *
 * Two eligible members per group, also deliberately: one-of-one can never produce
 * the mixed selection state, so a single-member group cannot exercise it at all.
 */
const tasks: Task[] = [
  { id: 'u1', name: 'U-one', status: null },
  { id: 'u2', name: 'U-two', status: null },
  {
    id: 'a1',
    name: 'A-one',
    status: 'active',
    children: [{ id: 'a1c', name: 'A-one child', status: 'active' }],
  },
  { id: 'a2', name: 'A-two', status: 'active' },
  { id: 'd1', name: 'D-one', status: 'done' },
  { id: 'd2', name: 'D-two', status: 'done' },
];

interface GroupedOptions {
  readonly grouping?: readonly string[];
  readonly config?: Record<string, unknown> | false;
  readonly tree?: boolean;
  readonly treeExpanded?: readonly string[];
  readonly selection?: Record<string, unknown> | false;
  readonly manualGrouping?: boolean;
  readonly data?: readonly Task[];
  readonly currentRowId?: string;
}

function controllerOptionsFor({
  grouping = ['status'],
  config = { allowedColumns: ['status'] },
  tree = false,
  treeExpanded = [],
  selection,
  manualGrouping = false,
  data = tasks,
  currentRowId,
}: GroupedOptions) {
  return {
    columns,
    data,
    getRowId: (row: Task) => row.id,
    grouping: config as never,
    ...(tree ? { tree: { getChildren: (row: Task) => row.children } } : {}),
    ...(selection === undefined ? {} : { selection: selection as never }),
    ...(manualGrouping ? { manualGrouping: true } : {}),
    defaultState: {
      grouping: [...grouping],
      treeExpanded: new Set(treeExpanded),
      ...(currentRowId === undefined ? {} : { currentRowId }),
    },
  } as never;
}

function useGrouped(options: GroupedOptions = {}) {
  return useDataTable<Task>(controllerOptionsFor(options));
}

function rowIds(controller: DataTableController<Task>): string[] {
  return controller.table.getRowModel().rows.map((row) => row.id);
}

/** The latest captured controller. (`Array.prototype.at` is outside this target.) */
function last<T>(values: readonly T[]): T {
  return values[values.length - 1]!;
}

function GroupedView({
  onCapture,
  currentRow = false,
  ...options
}: GroupedOptions & {
  readonly onCapture?: (controller: DataTableController<Task>) => void;
  readonly currentRow?: boolean;
}) {
  const controller = useDataTable<Task>(controllerOptionsFor(options));

  useLayoutEffect(() => {
    onCapture?.(controller);
  }, [controller, onCapture]);

  return (
    <DataTableRoot table={controller}>
      <DataTableView<Task> currentRow={currentRow} />
    </DataTableRoot>
  );
}

/* -------------------------------------------------------------------------- */
/*                   The expanded-row-model handover with tree                 */
/* -------------------------------------------------------------------------- */

/** A module-facing context, for asking each module what it contributes. */
function moduleContext(
  grouping: readonly string[],
  treeEnabled: boolean,
  config: unknown
): DataTableFeatureContext<Task, string> {
  return {
    table: () => {
      throw new Error('engineOptions must not call table() in its body');
    },
    state: { grouping, treeExpanded: new Set<string>() } as never,
    gates: {
      treeEnabled,
      hasSubRows: treeEnabled,
      manualGrouping: false,
      expandedSlice: 'treeExpanded',
    } as never,
    tableId: 'T',
    requestChange: (() => undefined) as never,
    config,
    graftData: () => tasks,
  };
}

describe('grouping — the getExpandedRowModel owner', () => {
  // The expand stage is needed by two features and can be claimed by only one, so
  // `grouping.tsx` owns it OUTRIGHT and `tree.ts` no longer contributes it.
  //
  // A *dynamic* handover was tried first — complementary guards on
  // `state.grouping.length`, each module claiming the option only in its own state
  // — and the per-module assertion below passed in both states while the feature
  // was broken. `table.getExpandedRowModel()` resolves the option **once** and
  // caches it on `table._getExpandedRowModel`, which nothing clears, so a
  // controller that starts ungrouped keeps tree's stock model forever. The
  // runtime-crossing test at the end of this block is what caught it, and it is the
  // reason these per-module assertions are not on their own sufficient.
  it.each([
    ['nothing grouped', [] as readonly string[]],
    ['grouped', ['status'] as readonly string[]],
  ])('is claimed by exactly one module when %s', (_label, grouping) => {
    const owners = (
      [
        ['tree', treeFeature],
        ['grouping', groupingFeature],
      ] as const
    ).filter(([, module]) => {
      const contribution = module.engineOptions!(
        moduleContext(grouping, true, { allowedColumns: ['status'] }) as never
      );

      return contribution.getExpandedRowModel !== undefined;
    });

    // Names the owner rather than counting it, so a failure says which side moved.
    expect(owners.map(([id]) => id)).toEqual(['grouping']);
  });

  it('is claimed by grouping for a plain tree, which no longer claims it itself', () => {
    // The configuration a config-gated version would break: a tree, no `grouping`
    // prop. If this ever returns `undefined`, every tree table silently loses its
    // expand stage.
    expect(
      groupingFeature.engineOptions!(
        moduleContext([], true, undefined) as never
      ).getExpandedRowModel
    ).toBeTypeOf('function');
    expect(
      treeFeature.engineOptions!(moduleContext([], true, undefined) as never)
        .getExpandedRowModel
    ).toBeUndefined();
  });

  it('installs no expand stage when neither feature is configured', () => {
    // Design §3.5: a disabled stage is an identity transform and installs no
    // client model. `data-table-controller.test.tsx` asserts the same thing for
    // this option, which is what caught an earlier unconditional version.
    const { result } = renderHook(() =>
      useDataTable<Task>({
        columns,
        data: tasks,
        getRowId: (row: Task) => row.id,
      } as never)
    );

    expect(result.current.table.options.getExpandedRowModel).toBeUndefined();
  });

  it('installs the expand stage when grouping arrives after mount', () => {
    // The property the single-owner design rests on, and the one worth a test of
    // its own: the option may go **absent → present**, because
    // `_getExpandedRowModel` is only cached once the option exists. What it may
    // never do is change owner — and the collision check makes that impossible
    // rather than merely unlikely.
    const { result, rerender } = renderHook(
      ({ configured }: { configured: boolean }) =>
        useDataTable<Task>({
          columns,
          data: tasks,
          getRowId: (row: Task) => row.id,
          ...(configured ? { grouping: { allowedColumns: ['status'] } } : {}),
        } as never),
      { initialProps: { configured: false } }
    );

    expect(result.current.table.options.getExpandedRowModel).toBeUndefined();

    rerender({ configured: true });
    expect(result.current.table.options.getExpandedRowModel).toBeTypeOf(
      'function'
    );

    // Grouping through the slice, not through `defaultState` — that is a
    // first-render initializer and a rerender never reaches it, which is worth
    // knowing here because it silently made an earlier version of this test assert
    // nothing about grouping at all.
    act(() => {
      result.current.requestChange('grouping', ['status']);
    });

    // Grouped, and flattened — the part that would still be broken if the stage
    // resolved to a stale closure.
    expect(rowIds(result.current)).toEqual([
      'status:active',
      'a1',
      'a2',
      'status:done',
      'd1',
      'd2',
      'status:null',
      'u1',
      'u2',
    ]);
  });

  // A "the composer throws if both contribute" control USED TO SIT HERE, and it was
  // removed rather than kept, which is worth a line so nobody re-adds it. Under a
  // two-guard handover it would have been the control on the guard. Under a single
  // owner there is no second claimant, so it asserted a configuration the design
  // makes unreachable — an unfalsifiable test that reads as coverage. The collision
  // *mechanism* is already asserted where it belongs, over synthetic modules, in
  // `data-table-features.test.tsx` ("throws when two modules set the same engine
  // option, naming both"), so nothing was lost by deleting it.

  it('keeps tree descendants attached under their grouped root', () => {
    // Design §6.6: only roots group, each root keeps its descendant tree. The
    // child must sit under its own root INSIDE the group, not be regrouped as a
    // peer — so the order is what carries the claim, not mere presence.
    const { result } = renderHook(() =>
      useGrouped({ tree: true, treeExpanded: ['a1'] })
    );

    expect(rowIds(result.current)).toEqual([
      'status:active',
      'a1',
      'a1c',
      'a2',
      'status:done',
      'd1',
      'd2',
      'status:null',
      'u1',
      'u2',
    ]);
    // The child is one level below its root, which is one level below the group.
    const byId = result.current.table.getRowModel().rowsById;
    expect(byId['status:active']!.depth).toBe(0);
    expect(byId['a1']!.depth).toBe(1);
    expect(byId['a1c']!.depth).toBe(2);
  });

  it('still expands the tree when nothing is grouped', () => {
    // The other direction of the boundary. With the handover backwards this
    // returns the roots only, and nothing else in the suite notices.
    const { result } = renderHook(() =>
      useGrouped({ grouping: [], tree: true, treeExpanded: ['a1'] })
    );

    expect(rowIds(result.current)).toEqual([
      'u1',
      'u2',
      'a1',
      'a1c',
      'a2',
      'd1',
      'd2',
    ]);
  });

  it('keeps the tree expanding across a grouping change in one controller', () => {
    // Crossing the boundary at runtime rather than in two separate controllers:
    // the guards are read per render, so this is what proves the handover is not
    // a first-render-only decision.
    const { result } = renderHook(() =>
      useGrouped({ grouping: [], tree: true, treeExpanded: ['a1'] })
    );

    expect(rowIds(result.current)).toContain('a1c');

    act(() => {
      result.current.requestChange('grouping', ['status']);
    });
    expect(rowIds(result.current)).toEqual([
      'status:active',
      'a1',
      'a1c',
      'a2',
      'status:done',
      'd1',
      'd2',
      'status:null',
      'u1',
      'u2',
    ]);

    act(() => {
      result.current.requestChange('grouping', []);
    });
    expect(rowIds(result.current)).toEqual([
      'u1',
      'u2',
      'a1',
      'a1c',
      'a2',
      'd1',
      'd2',
    ]);
  });
});

/* -------------------------------------------------------------------------- */
/*                        The grouped row model itself                        */
/* -------------------------------------------------------------------------- */

describe('grouping — engineOptions', () => {
  it('installs the grouped model and reaches the members, not only the headers', () => {
    const { result } = renderHook(() => useGrouped());

    expect(result.current.table.options.getGroupedRowModel).toBeTypeOf(
      'function'
    );
    expect(rowIds(result.current)).toEqual([
      'status:active',
      'a1',
      'a2',
      'status:done',
      'd1',
      'd2',
      'status:null',
      'u1',
      'u2',
    ]);
  });

  it('installs no grouped model without a config, and groups nothing', () => {
    // A caller may drive `state.grouping` with no `grouping` config — the slice
    // has shipped since F2. That must stay a no-op rather than half-grouping.
    const { result } = renderHook(() => useGrouped({ config: false }));

    expect(result.current.table.options.getGroupedRowModel).toBeUndefined();
    expect(rowIds(result.current)).toEqual([
      'u1',
      'u2',
      'a1',
      'a2',
      'd1',
      'd2',
    ]);
  });

  it('installs no grouped model under manual grouping', () => {
    // A manual stage consumes caller-processed rows (design §3.5). The expand
    // stage is still contributed, which is what keeps the handover complementary.
    const { result } = renderHook(() => useGrouped({ manualGrouping: true }));

    expect(result.current.table.options.getGroupedRowModel).toBeUndefined();
    expect(result.current.table.options.manualGrouping).toBe(true);
    expect(result.current.table.options.getExpandedRowModel).toBeTypeOf(
      'function'
    );
    expect(rowIds(result.current)).toEqual([
      'u1',
      'u2',
      'a1',
      'a2',
      'd1',
      'd2',
    ]);
  });

  it('leaves the caller’s column order alone when grouping activates', () => {
    // `groupedColumnMode` defaults to `'reorder'`, which hoists every grouped
    // column to the front of the leaf-column order. `status` is declared SECOND
    // here precisely so the default would be visible: leave the option unset and
    // this reads `['status', 'name']`.
    const { result } = renderHook(() => useGrouped());

    expect(
      result.current.table.getVisibleLeafColumns().map((column) => column.id)
    ).toEqual(['name', 'status']);
    expect(result.current.table.options.groupedColumnMode).toBe(false);
  });

  it('filters a disallowed column out of a grouping change', () => {
    const { result } = renderHook(() =>
      useGrouped({ grouping: [], config: { allowedColumns: ['status'] } })
    );

    act(() => {
      result.current.table.setGrouping(['name', 'status']);
    });

    expect(result.current.getState().grouping).toEqual(['status']);
  });

  it('passes a grouping change through when no column list is configured', () => {
    // The negative half of the same guard: `allowedColumns` absent must not mean
    // "allow nothing", which is the falsy-default class of defect.
    const { result } = renderHook(() =>
      useGrouped({ grouping: [], config: {} })
    );

    act(() => {
      result.current.table.setGrouping(['name']);
    });

    expect(result.current.getState().grouping).toEqual(['name']);
  });
});

/* -------------------------------------------------------------------------- */
/*                             The ungrouped bucket                           */
/* -------------------------------------------------------------------------- */

describe('grouping — the ungrouped policy', () => {
  const groupRowText = () =>
    Array.from(document.querySelectorAll('[data-slot="group-row"]')).map(
      (node) => node.textContent ?? ''
    );

  it('shows the bucket named "Ungrouped" and places it last by default', () => {
    render(<GroupedView />);

    // The bucket is FIRST in the data, so `position: 'last'` has to move it.
    expect(groupRowText()).toEqual(['active (2)', 'done (2)', 'Ungrouped (2)']);
  });

  it('places the bucket first when asked', () => {
    render(
      <GroupedView
        config={{
          allowedColumns: ['status'],
          ungrouped: { position: 'first' },
        }}
      />
    );

    expect(groupRowText()).toEqual(['Ungrouped (2)', 'active (2)', 'done (2)']);
  });

  it('renames the bucket without touching the real groups', () => {
    render(
      <GroupedView
        config={{
          allowedColumns: ['status'],
          ungrouped: { name: 'No status' },
        }}
      />
    );

    expect(groupRowText()).toEqual(['active (2)', 'done (2)', 'No status (2)']);
  });

  it('drops the bucket and its members when show is false', () => {
    const capture: DataTableController<Task>[] = [];
    render(
      <GroupedView
        config={{ allowedColumns: ['status'], ungrouped: { show: false } }}
        onCapture={(controller) => capture.push(controller)}
      />
    );

    expect(groupRowText()).toEqual(['active (2)', 'done (2)']);
    // The members go with it — a hidden header over visible orphans would be
    // worse than either.
    expect(screen.queryByText('U-one')).not.toBeInTheDocument();
    expect(rowIds(last(capture))).toEqual([
      'status:active',
      'a1',
      'a2',
      'status:done',
      'd1',
      'd2',
    ]);
  });

  it('merges a real null with the string "null", because the row model already has', () => {
    // A characterization, not an endorsement, and it corrects what this test first
    // claimed. `groupBy` keys its map by `` `${value}` ``, so `null` and `'null'`
    // produce the same key ABOVE this feature — they are one group before anything
    // here runs and cannot be separated from here.
    //
    // The consequence worth recording is the classification: the group is judged by
    // its first member's *value*, so a group led by the string is a normal group
    // named "null" rather than the bucket. Led by the real null it would be the
    // bucket, and both members would sit under "Ungrouped".
    const stringly: readonly Task[] = [
      { id: 's1', name: 'S-one', status: 'null' },
      { id: 's2', name: 'S-two', status: null },
    ];
    render(<GroupedView data={stringly} />);

    expect(
      Array.from(document.querySelectorAll('[data-slot="group-row"]')).map(
        (node) => node.textContent
      )
    ).toEqual(['null (2)']);
  });
});

/* -------------------------------------------------------------------------- */
/*                                  Collapse                                  */
/* -------------------------------------------------------------------------- */

describe('grouping — collapse', () => {
  const groupRow = (groupId: string) =>
    document.querySelector(`[data-group-id="${CSS.escape(groupId)}"]`);

  it('hides a collapsed group’s members and keeps its header', () => {
    const capture: DataTableController<Task>[] = [];
    render(<GroupedView onCapture={(c) => capture.push(c)} />);

    expect(screen.getByText('A-one')).toBeInTheDocument();

    act(() => {
      last(capture).requestChange('groupCollapsed', new Set(['status:active']));
    });

    expect(screen.queryByText('A-one')).not.toBeInTheDocument();
    expect(screen.queryByText('A-two')).not.toBeInTheDocument();
    // The header stays, and says so on the element.
    expect(groupRow('status:active')).not.toBeNull();
    expect(groupRow('status:active')).not.toHaveAttribute(
      'data-expanded',
      'true'
    );
    // A sibling group is untouched.
    expect(screen.getByText('D-one')).toBeInTheDocument();
  });

  it('reflects the open state as data-expanded, never aria-expanded', () => {
    // `aria-expanded` on a row inside `role="table"` is invalid ARIA, so the row
    // carries the styling hook and the disclosure control carries the semantics.
    render(<GroupedView />);

    expect(groupRow('status:active')).toHaveAttribute('data-expanded', 'true');
    expect(groupRow('status:active')).not.toHaveAttribute('aria-expanded');
  });

  it('omits the open state entirely when collapse is disabled', () => {
    render(
      <GroupedView
        config={{ allowedColumns: ['status'], collapsible: false }}
      />
    );

    expect(groupRow('status:active')).not.toHaveAttribute('data-expanded');
  });

  it('collapses and expands through the toggle-group action', () => {
    const capture: DataTableController<Task>[] = [];
    render(<GroupedView onCapture={(c) => capture.push(c)} />);

    // The pre-declared action used to throw "requires the grouping feature,
    // which is not implemented yet" — a message that becomes false the moment the
    // feature ships.
    act(() => {
      last(capture).toggle({ type: 'toggle-group', groupId: 'status:done' });
    });
    expect(screen.queryByText('D-one')).not.toBeInTheDocument();
    expect(last(capture).getState().groupCollapsed).toEqual(
      new Set(['status:done'])
    );

    // Omitting `expanded` toggles back …
    act(() => {
      last(capture).toggle({ type: 'toggle-group', groupId: 'status:done' });
    });
    expect(screen.getByText('D-one')).toBeInTheDocument();

    // … and an explicit value is absolute rather than a toggle.
    act(() => {
      last(capture).toggle({
        type: 'toggle-group',
        groupId: 'status:done',
        expanded: true,
      });
    });
    expect(screen.getByText('D-one')).toBeInTheDocument();
    act(() => {
      last(capture).toggle({
        type: 'toggle-group',
        groupId: 'status:done',
        expanded: false,
      });
    });
    expect(screen.queryByText('D-one')).not.toBeInTheDocument();
  });

  it('starts every group open, so the empty default shows everything', () => {
    const { result } = renderHook(() => useGrouped());

    expect(result.current.getState().groupCollapsed).toEqual(new Set());
    expect(rowIds(result.current)).toHaveLength(9);
  });
});

/* -------------------------------------------------------------------------- */
/*                            Group-scoped selection                          */
/* -------------------------------------------------------------------------- */

describe('grouping — group-scoped selection', () => {
  /** The group context the feature hands a renderer, captured from a render. */
  function captureContexts(options: GroupedOptions = {}) {
    const seen = new Map<string, DataTableGroupContext<Task>>();
    const controllers: DataTableController<Task>[] = [];
    render(
      <GroupedView
        {...options}
        config={{
          allowedColumns: ['status'],
          ...(typeof options.config === 'object' ? options.config : {}),
          renderGroup: (context: DataTableGroupContext<Task>) => {
            seen.set(context.groupId, context);

            return context.name;
          },
        }}
        onCapture={(controller) => controllers.push(controller)}
      />
    );

    return { seen, controller: () => last(controllers) };
  }

  it('selects the group’s descendant data rows, never the synthetic group row', () => {
    const { seen, controller } = captureContexts({
      selection: { mode: 'multiple' },
      // `tree` on, `treeExpanded` empty on purpose: `a1c` is a loaded descendant
      // that is NOT on screen, and `'all-loaded-leaves'` is defined to include it.
      // Without `tree` the child is not a row at all and this asserts nothing about
      // descendants — which is what the first version of this test did.
      tree: true,
    });

    act(() => seen.get('status:active')!.selection.toggle());

    // Design §6.6 / `data-table/behavior.md:414`: eligible leaf records, group row
    // excluded. The group ID is not a record ID and must never enter the selection
    // slice (§6.5).
    expect(controller().getState().selection).toEqual(
      new Set(['a1', 'a1c', 'a2'])
    );
    expect(
      controller()
        .getState()
        .selection.has('status:active' as never)
    ).toBe(false);
  });

  it('reports the mixed state, which needs two eligible members to reach', () => {
    const { seen, controller } = captureContexts({
      selection: { mode: 'multiple' },
    });

    act(() => controller().requestChange('selection', new Set(['d1'])));

    // One of `status:done`'s two members. `getIsAllPageRowsSelected()` would
    // report a one-eligible group as fully checked here, which is the bug this
    // three-way count avoids.
    expect(seen.get('status:done')!.selection.state).toBe('some');
    expect(seen.get('status:done')!.selection.eligibleCount).toBe(2);
    expect(seen.get('status:active')!.selection.state).toBe('none');
  });

  it('skips an ineligible member and counts only what it can change', () => {
    const { seen, controller } = captureContexts({
      selection: {
        mode: 'multiple',
        isRowSelectable: (row: Task) => row.id !== 'd2',
      },
    });

    expect(seen.get('status:done')!.selection.eligibleCount).toBe(1);

    act(() => seen.get('status:done')!.selection.toggle());

    expect(controller().getState().selection).toEqual(new Set(['d1']));
    // One-of-one-eligible reads as `all`, and that is correct here — every row it
    // is allowed to touch is selected.
    expect(seen.get('status:done')!.selection.state).toBe('all');
  });

  it('resolves the mixed state per selectAllOnIndeterminate', () => {
    const { seen, controller } = captureContexts({
      selection: { mode: 'multiple' },
      config: { selectAllOnIndeterminate: false },
    });

    act(() => controller().requestChange('selection', new Set(['d1'])));
    expect(seen.get('status:done')!.selection.state).toBe('some');

    act(() => seen.get('status:done')!.selection.toggle());

    // `false` clears from mixed instead of completing the group.
    expect(controller().getState().selection).toEqual(new Set());
  });

  it('scopes to the visible members only when asked, and says so when there are none', () => {
    const { seen, controller } = captureContexts({
      selection: { mode: 'multiple' },
      config: { selectionScope: 'visible-leaves' },
    });

    expect(seen.get('status:done')!.selection.eligibleCount).toBe(2);

    act(() =>
      controller().requestChange('groupCollapsed', new Set(['status:done']))
    );

    // A collapsed group has nothing on screen, so the control is empty rather
    // than quietly selecting rows the user cannot see. The chrome disables it.
    expect(seen.get('status:done')!.selection.eligibleCount).toBe(0);
    expect(seen.get('status:done')!.selection.state).toBe('none');
  });

  it('keeps a collapsed group selectable under the default scope', () => {
    // The contrast with the case above, and the reason the default is
    // `'all-loaded-leaves'`: the opt-in scope is allowed to be empty, the default
    // is not allowed to leave the control dead.
    const { seen, controller } = captureContexts({
      selection: { mode: 'multiple' },
    });

    act(() =>
      controller().requestChange('groupCollapsed', new Set(['status:done']))
    );

    expect(seen.get('status:done')!.selection.eligibleCount).toBe(2);
    act(() => seen.get('status:done')!.selection.toggle());
    expect(controller().getState().selection).toEqual(new Set(['d1', 'd2']));
  });
});

/* -------------------------------------------------------------------------- */
/*                        The group context and dispatch                      */
/* -------------------------------------------------------------------------- */

describe('grouping — the group row', () => {
  it('dispatches kind "group" to the module that owns it', () => {
    // The positive half of what `UNSHIPPED_DISPLAY_ROW_KINDS` used to assert.
    // That list is empty now, so its `it.each` asserts nothing — this is what
    // replaces it, and the assertion below keeps the two facts tied together.
    expect(UNSHIPPED_DISPLAY_ROW_KINDS).toHaveLength(0);

    const groupRow = {
      id: 'status:done',
      depth: 0,
      subRows: [],
      groupingColumnId: 'status',
      groupingValue: 'done',
      getIsGrouped: () => true,
      getGroupingValue: () => 'done',
    } as unknown as Row<Task>;

    expect(() =>
      renderDisplayRow(
        DATA_TABLE_FEATURES,
        {
          kind: 'group',
          row: groupRow,
          groupId: 'status:done',
          depth: 0,
          recordIndex: 0,
        },
        {
          table: () => ({}) as never,
          state: { groupCollapsed: new Set<string>() } as never,
          gates: {} as never,
          tableId: 'T',
          requestChange: (() => undefined) as never,
          data: tasks,
          visibleColumnCount: 2,
          recordRows: [],
          viewProps: {},
        },
        { grouping: { allowedColumns: ['status'] } }
      )
    ).not.toThrow();
  });

  it('renders the name and member count without a renderer, and nothing else', () => {
    render(<GroupedView />);

    // Values, never formatting (§4.3) — a direct DataTable composition gets text.
    const rows = Array.from(
      document.querySelectorAll('[data-slot="group-row"]')
    );
    expect(rows).toHaveLength(3);
    expect(rows[0]!.querySelectorAll('td')).toHaveLength(1);
    expect(rows[0]!.querySelector('td')).toHaveAttribute('colspan', '2');
  });

  it('describes the group to a renderer, tree descendants counted', () => {
    const seen = new Map<string, DataTableGroupContext<Task>>();
    render(
      <GroupedView
        tree
        treeExpanded={['a1']}
        config={{
          allowedColumns: ['status'],
          renderGroup: (context: DataTableGroupContext<Task>) => {
            seen.set(context.groupId, context);

            return context.name;
          },
        }}
      />
    );

    const active = seen.get('status:active')!;
    expect(active.columnId).toBe('status');
    expect(active.value).toBe('active');
    expect(active.name).toBe('active');
    expect(active.isUngrouped).toBe(false);
    expect(active.depth).toBe(0);
    expect(active.colSpan).toBe(2);
    // The count follows the loaded rows, so a tree descendant is a member.
    expect(active.rowCount).toBe(3);
    expect(active.rows.map((row) => row.id)).toEqual(['a1', 'a1c', 'a2']);

    const bucket = seen.get('status:null')!;
    expect(bucket.isUngrouped).toBe(true);
    expect(bucket.name).toBe('Ungrouped');
    // `undefined`, not the string the row model keyed the bucket by.
    expect(bucket.value).toBeUndefined();
  });

  it('gives a caller’s renderer the row, and renders nothing standard beside it', () => {
    render(
      <GroupedView
        config={{
          allowedColumns: ['status'],
          renderGroup: () => <span data-testid="custom">mine</span>,
        }}
      />
    );

    expect(screen.getAllByTestId('custom')).toHaveLength(3);
    expect(screen.queryByText('active (2)')).not.toBeInTheDocument();
  });

  it('marks the group row sticky only when configured', () => {
    const groupRowClass = () =>
      document.querySelector('[data-slot="group-row"]')!.className;

    const { unmount } = render(<GroupedView />);
    // `TableRow` applies `STICKY_ROW` through `cn()`, so the observable is the
    // class list rather than an attribute. Asserted in both directions, because a
    // class assertion that only ever runs on the positive case cannot tell a
    // conditional apart from an unconditional one.
    expect(groupRowClass()).not.toContain('[&>td]:sticky');
    unmount();

    render(
      <GroupedView config={{ allowedColumns: ['status'], sticky: true }} />
    );
    expect(groupRowClass()).toContain('[&>td]:sticky');
  });
});

/* -------------------------------------------------------------------------- */
/*                        Roving focus across group rows                      */
/* -------------------------------------------------------------------------- */

describe('grouping — roving focus', () => {
  // A group row is in `getRowModel().rows` and cannot hold roving focus: it is
  // synthetic (no record id, §6.5) and is rendered by `renderDisplayRow`, so it
  // never registers in the view's `rowNodesRef`. Before the fix, Arrow-Down across a
  // boundary wrote a SYNTHETIC GROUP ID into `currentRowId` — an identity slice,
  // which is the collision ADR-0001's own-slice decision exists to prevent — and
  // `.focus()` found no node, stranding the keyboard user at every group.
  //
  // **Every assertion below reads the SLICE, not where focus ended up.** The
  // plausible-wrong fix skips the header visually while still writing its id into
  // `currentRowId`: focus looks right and the identity slice is still poisoned. The
  // DOM cannot see that difference.
  function renderRoving(
    options: GroupedOptions & { currentRowId?: string } = {}
  ) {
    const { currentRowId, ...rest } = options;
    const seen: DataTableController<Task>[] = [];
    render(
      <GroupedView
        {...rest}
        {...(currentRowId === undefined ? {} : { currentRowId })}
        currentRow
        onCapture={(controller) => seen.push(controller)}
      />
    );

    return () => last(seen);
  }

  const arrow = async (from: string, key: 'ArrowDown' | 'ArrowUp') => {
    const user = userEvent.setup();
    const row = screen.getByText(from).closest('tr')!;
    row.focus();
    await user.keyboard(`{${key}}`);
  };

  it('steps over a group header onto the next record, not onto the header', async () => {
    const controller = renderRoving({ currentRowId: 'a2' });
    // Display order: header, a1, a2, header, d1, d2, header, u1, u2.
    expect(controller().getState().currentRowId).toBe('a2');

    await arrow('A-two', 'ArrowDown');

    // `'status:done'` before the fix.
    expect(controller().getState().currentRowId).toBe('d1');
  });

  it('steps back over a group header the same way', async () => {
    const controller = renderRoving({ currentRowId: 'd1' });

    await arrow('D-one', 'ArrowUp');

    expect(controller().getState().currentRowId).toBe('a2');
  });

  it('skips a collapsed group entirely, whose members are not in the model', async () => {
    // The next record is not adjacent in the display list: `status:done` is
    // collapsed, so `d1`/`d2` are absent from the row model and the record after
    // `a2` is `u1`, two headers away.
    const controller = renderRoving({ currentRowId: 'a2' });
    act(
      () =>
        void controller().requestChange(
          'groupCollapsed',
          new Set(['status:done'])
        )
    );
    expect(rowIds(controller())).toEqual([
      'status:active',
      'a1',
      'a2',
      'status:done',
      'status:null',
      'u1',
      'u2',
    ]);

    await arrow('A-two', 'ArrowDown');

    expect(controller().getState().currentRowId).toBe('u1');
  });

  it('puts Home and End on records, not on the first and last group headers', async () => {
    const user = userEvent.setup();
    const controller = renderRoving({ currentRowId: 'd1' });

    screen.getByText('D-one').closest('tr')!.focus();
    await user.keyboard('{Home}');
    // `'status:active'` is the first row of the model; `a1` is the first record.
    expect(controller().getState().currentRowId).toBe('a1');

    screen.getByText('A-one').closest('tr')!.focus();
    await user.keyboard('{End}');
    expect(controller().getState().currentRowId).toBe('u2');
  });

  it('gives the body a tab stop even though the first row is a group header', () => {
    // The second defect the same list fixes. With no current row the single tab stop
    // was keyed off `recordRows[0]` — a group header, which is not rendered by
    // `renderRecordRow`, so NOTHING matched and the body had no tab stop at all.
    renderRoving();

    const tabbable = Array.from(
      document.querySelectorAll('tbody tr[tabindex="0"]')
    );
    expect(tabbable).toHaveLength(1);
    expect(tabbable[0]!.textContent).toContain('A-one');
  });
});

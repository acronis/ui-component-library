import type { ColumnDef } from '@tanstack/react-table';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useDataTable } from '../data-table-controller';
import { createRowContext } from '../data-table-render-context';

// `renderContext` is the ninth contribution point and was the only one whose
// end-to-end reach nothing asserted. `mergeRenderContextFields` had a collision
// unit test and the audit block in `data-table-seams.test.tsx` covered
// `rowPresentation`/`columnPresentation`, but nothing proved a contributed field
// arrives on a real row context — nor that the one-level-deep `detail`/`tree`
// namespace merge keeps the rest of the namespace.
//
// **Scope correction (#50).** The merge cases below carry that weight; the first case
// does not, and its own comment now says why. The claim "nothing proved a contributed
// field arrives" is discharged by `data-table-tree-feature.test.tsx:543-565`, not by
// this file's first assertion — see the note on it.
//
// **Verified to fail on the defect it guards.** Renaming `tree` to `treeTYPO` in
// `NESTED_CONTEXT_NAMESPACES` — a type-preserving break, so `tsc` stays silent —
// turns the merge assertions red with `expected undefined to be +0`: that is
// `tree.depth`, gone with the replaced namespace. Before this file existed the
// same break passed 2084 tests and reported `Type Errors  no errors`. Written as a
// negative control by U2's developer, re-verified here.
//
// **No `vi.mock` needed, deliberately.** The handoff version registered a
// stand-in feature contributing `tree`; U2's real `tree` module now contributes
// that same field, so a stand-in collides with it — correctly, since the composer
// forbids two modules setting one field. Exercising the shipped module instead is
// both simpler and stronger. If a later unit *does* need a stand-in here, note the
// trap U2 hit: `vi.mock` hoists above every top-level declaration, and this file
// imports the controller as a **value**, so a top-level `defineDataTableFeature`
// const is still uninitialized when the factory runs — `ReferenceError`, surfacing
// as `Failed Suites 1` and `(0 test)`. Define it inside the factory.
//
// The discriminator is `depth`, not `loadState`: `loadState` is `'idle'` from both
// the base context and the shipped contribution, so only the *surviving siblings*
// distinguish a merge from a replacement.

interface Node {
  id: string;
  name: string;
  children?: Node[];
}

const columns: ColumnDef<Node, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
];

const data: Node[] = [
  { id: 'p', name: 'Parent', children: [{ id: 'c', name: 'Child' }] },
];

describe('renderContext reaches the row context, not just the composer', () => {
  const controllerFor = () =>
    renderHook(() =>
      useDataTable({
        columns,
        data,
        getRowId: (row) => row.id,
        getSubRows: (row) => row.children,
        tree: {},
        defaultState: { treeExpanded: new Set(['p']) },
      })
    ).result.current;

  // **This case cannot fail on the defect its name suggests, and that is recorded
  // rather than fixed here.** `loadState` is `'idle'` from the base context —
  // `data-table-render-context.ts` must set it, because the member is required on
  // `DataTableRowTreeContext` — AND `'idle'` from `tree.ts` in this configuration,
  // which has no `loadChildren`. Two sources, one value: delete the contribution and
  // this assertion still passes. An earlier comment here claimed the base "no longer
  // sets `loadState` at all", which was false and contradicted the note at the top of
  // this file; found by #50's reverse sweep of the surface 7d was auditing.
  //
  // **The discriminating assertion already exists**, so this is not duplicated here:
  // `data-table-tree-feature.test.tsx:543-565` configures `loadChildren`, expands, and
  // asserts `loadState` is `'loading'` for the fetching row while a sibling stays
  // `'idle'`. The base can only ever produce `'idle'`, so `'loading'` proves the
  // contribution arrived and the sibling proves it resolves per row. Discriminating
  // here too would mean a second lazy harness for coverage that is already stronger
  // elsewhere.
  //
  // What this case does prove is narrower and still worth keeping: the field is
  // **present and typed** on a real row context built through the composer, rather
  // than only inside `mergeRenderContextFields`.
  it('exposes loadState on a row context built through the composer', () => {
    const controller = controllerFor();
    const parent = controller.table.getRowModel().rows[0]!;

    expect(createRowContext(parent, controller).tree.loadState).toBe('idle');
  });

  it('merges into the tree namespace instead of replacing it', () => {
    const controller = controllerFor();
    const parent = controller.table.getRowModel().rows[0]!;
    const tree = createRowContext(parent, controller).tree;

    expect(tree.loadState).toBe('idle');
    // Without the one-level-deep merge every assertion below is undefined. This is
    // the invariant U2's lazy-children machine is built on: contributing
    // `loadState` must not discard depth, child presence, or the toggle command.
    expect(tree.depth).toBe(0);
    expect(tree.hasChildren).toBe(true);
    expect(tree.isExpanded).toBe(true);
    expect(typeof tree.toggle).toBe('function');
  });

  it('leaves the detail namespace untouched by a tree contribution', () => {
    const controller = controllerFor();
    const parent = controller.table.getRowModel().rows[0]!;
    const detail = createRowContext(parent, controller).detail;

    expect(detail.isExpanded).toBe(false);
    expect(typeof detail.toggle).toBe('function');
  });

  it('resolves per row, so a descendant gets its own value', () => {
    const controller = controllerFor();
    const child = controller.table.getRowModel().rows[1]!;
    const tree = createRowContext(child, controller).tree;

    // The point is a per-subject resolver, not a per-table constant.
    expect(tree.depth).toBe(1);
    expect(tree.hasChildren).toBe(false);
  });
});

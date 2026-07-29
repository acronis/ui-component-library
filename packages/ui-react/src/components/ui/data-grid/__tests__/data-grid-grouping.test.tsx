import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DataGrid } from '../data-grid';

// U4 — `grouping`, the DataGrid half. Acceptance targets:
//   packages/ui-spec/components/data-grid/behavior.md  "Groups sort and select leaves"
//   packages/ui-spec/components/data-grid/behavior.md  "Group roots preserve trees and ungrouped policy"
//
// Rule 7: every member the config module declares is exercised here in the
// configuration a caller writes — `grouping: { … }` on a real `<DataGrid>` with the
// grouped columns arriving through `defaultState.grouping`, which is how a grid is
// actually grouped. The engine half's own behaviour lives in
// `../../data-table/__tests__/data-table-grouping.test.tsx`; this file is about the
// resolver, the warnings, and the chrome.

interface Task {
  id: string;
  name: string;
  status: string | null;
  children?: Task[];
}

const columns: ColumnDef<Task, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
];

/** Two eligible members per group, so the mixed selection state is reachable. */
const rows: Task[] = [
  { id: 'u1', name: 'U-one', status: null },
  { id: 'a1', name: 'A-one', status: 'active' },
  { id: 'a2', name: 'A-two', status: 'active' },
  { id: 'd1', name: 'D-one', status: 'done' },
  { id: 'd2', name: 'D-two', status: 'done' },
];

const groupRowText = () =>
  Array.from(document.querySelectorAll('[data-slot="group-row"]')).map(
    (node) => node.textContent ?? ''
  );

describe('DataGrid grouping — resolution and warnings', () => {
  let errors: string[];

  beforeEach(() => {
    errors = [];
    vi.spyOn(console, 'error').mockImplementation((message: unknown) => {
      errors.push(String(message));
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('warns when `allowedColumns` is empty, because it permits nothing', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        grouping={{ allowedColumns: [] }}
        defaultState={{ grouping: ['status'] }}
      />
    );

    expect(errors.join('\n')).toContain(
      '`grouping.allowedColumns` is required'
    );
  });

  it('warns that `sticky` needs a bounded height', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        grouping={{ allowedColumns: ['status'], sticky: true }}
        defaultState={{ grouping: ['status'] }}
      />
    );

    expect(errors.join('\n')).toContain('`grouping.sticky` needs');
  });

  it('does not warn about `sticky` once a bounded height is present', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        appearance={{ maxHeight: 300 }}
        grouping={{ allowedColumns: ['status'], sticky: true }}
        defaultState={{ grouping: ['status'] }}
      />
    );

    expect(errors.join('\n')).not.toContain('`grouping.sticky` needs');
  });

  it('warns that `selectionScope` is inert with no group select-all', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        selection={{ mode: 'single' }}
        grouping={{
          allowedColumns: ['status'],
          selectionScope: 'visible-leaves',
        }}
        defaultState={{ grouping: ['status'] }}
      />
    );

    expect(errors.join('\n')).toContain('`grouping.selectionScope` governs');
  });

  it('stays silent about `selectionScope` when the caller never set it', () => {
    // The #60 rule, and the one a resolved-value check gets wrong: the resolved
    // default is a real value (`'all-loaded-leaves'`), so keying the warning off
    // the resolved shape would fire it for every single-selection grid in the kit.
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        selection={{ mode: 'single' }}
        grouping={{ allowedColumns: ['status'] }}
        defaultState={{ grouping: ['status'] }}
      />
    );

    expect(errors.join('\n')).not.toContain('`grouping.selectionScope`');
  });

  it('stays silent about the ungrouped defaults, which are all truthy', () => {
    // Same class: `{ show: true, name: 'Ungrouped', position: 'last' }` resolves to
    // three truthy values, so nothing may be inferred from the resolved shape about
    // whether the caller asked for any of them.
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        grouping={{ allowedColumns: ['status'] }}
        defaultState={{ grouping: ['status'] }}
      />
    );

    expect(errors.join('\n')).not.toContain('ungrouped');
    // And the defaults did apply, which is the other half of the claim.
    expect(groupRowText()[2]).toContain('Ungrouped');
  });
});

describe('DataGrid grouping — the standard group header', () => {
  it('renders a disclosure, the group name, and its member count', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        grouping={{ allowedColumns: ['status'] }}
        defaultState={{ grouping: ['status'] }}
      />
    );

    // DataGrid formats where the engine half emits plain text (§4.3): the name and
    // the count are separate nodes with the disclosure beside them.
    expect(
      screen.getByRole('button', { name: 'Collapse group active' })
    ).toBeInTheDocument();
    expect(groupRowText()).toEqual(['active2', 'done2', 'Ungrouped1']);
  });

  // ── WHAT THIS TEST CANNOT SEE, stated because it passed throughout a freeze it
  //    looks like it would have caught ────────────────────────────────────────────
  //
  // A group toggle used to lock the browser in an endless render loop, and this test
  // was green the whole time. It is not a weak test — **it exercises a different code
  // path than a person does.** `user.click()` under happy-dom dispatches a
  // programmatic click; the loop only closed on React's DISCRETE-EVENT flush path,
  // which only a *trusted* click or keypress takes (`dispatchDiscreteEvent` was in the
  // stack). A synthetic click returns cleanly and even collapses correctly.
  //
  // Reproduced only in a real browser, with a real `Enter`: 11,293 controller state
  // writes in 8 seconds, DOM stable at 8 rows, heap flat at 81.4 MB — a render loop,
  // not a leak. Cause: TanStack's automatic `resetExpanded` met a `requestChange` that
  // allocated a new state object even for an unchanged value. Both halves are fixed
  // (`data-table-features/tree.ts` `autoResetExpanded: false`, and the equality guard
  // in `data-table-controller.ts`), and the guard has its own unit tests.
  //
  // **So do not read this block as coverage for termination.** It asserts the collapse
  // CONTRACT. Nothing in CI asserts that the interaction terminates; the reproduction
  // lives at `test/behavioural/group-toggle-terminates.mjs` and is run by hand. See #78.
  it('collapses and re-expands from the disclosure', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        grouping={{ allowedColumns: ['status'] }}
        defaultState={{ grouping: ['status'] }}
      />
    );

    expect(screen.getByText('A-one')).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Collapse group active' })
    );

    expect(screen.queryByText('A-one')).not.toBeInTheDocument();
    // The control carries the disclosure semantics, and its name follows the state
    // so a screen reader is told what activating it will do.
    const reopen = screen.getByRole('button', { name: 'Expand group active' });
    expect(reopen).toHaveAttribute('aria-expanded', 'false');

    await user.click(reopen);
    expect(screen.getByText('A-one')).toBeInTheDocument();
  });

  it('replaces the disclosure with a spacer when collapse is disabled', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        grouping={{ allowedColumns: ['status'], collapsible: false }}
        defaultState={{ grouping: ['status'] }}
      />
    );

    expect(
      screen.queryByRole('button', { name: /group active/ })
    ).not.toBeInTheDocument();
    // A spacer, so a non-collapsible group's label still lines up.
    expect(
      document.querySelector('[data-slot="group-static"]')
    ).toBeInTheDocument();
  });

  it('hands a caller’s renderer the group and drops the standard header', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        grouping={{
          allowedColumns: ['status'],
          renderGroup: (group) => (
            <span data-testid="mine">
              {group.name}/{group.rowCount}/{String(group.isUngrouped)}
            </span>
          ),
        }}
        defaultState={{ grouping: ['status'] }}
      />
    );

    expect(
      screen.getAllByTestId('mine').map((node) => node.textContent)
    ).toEqual(['active/2/false', 'done/2/false', 'Ungrouped/1/true']);
    // The caller's renderer replaces the whole header, disclosure included — the
    // group is theirs to compose, and `toggle` is on the context.
    expect(
      screen.queryByRole('button', { name: /group active/ })
    ).not.toBeInTheDocument();
  });
});

describe('DataGrid grouping — the group select-all', () => {
  const groupBox = (name: string) =>
    screen.getByRole('checkbox', { name: `Select all rows in group ${name}` });

  const gridWith = (grouping: Record<string, unknown>) => (
    <DataGrid
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id}
      selection={{ mode: 'multiple' }}
      grouping={{ allowedColumns: ['status'], ...grouping }}
      defaultState={{ grouping: ['status'] }}
    />
  );

  it('selects the group’s members and reports the mixed state', async () => {
    const user = userEvent.setup();
    render(gridWith({}));

    await user.click(groupBox('done'));
    expect(groupBox('done')).toBeChecked();

    // Clearing one member leaves the group mixed — reachable only because the
    // group has two eligible members. `getIsAllPageRowsSelected()` would have
    // reported a one-member group as fully checked here.
    await user.click(
      screen.getAllByRole('checkbox', { name: 'Select row' })[3]!
    );
    expect(groupBox('done')).toHaveAttribute('aria-checked', 'mixed');
  });

  it('completes a mixed group by default, and clears it when told to', async () => {
    const user = userEvent.setup();
    const { unmount } = render(gridWith({}));

    await user.click(
      screen.getAllByRole('checkbox', { name: 'Select row' })[3]!
    );
    expect(groupBox('done')).toHaveAttribute('aria-checked', 'mixed');
    await user.click(groupBox('done'));
    expect(groupBox('done')).toBeChecked();
    unmount();

    // The policy is `selection.selectAllOnIndeterminate`, threaded down — the group
    // control must not resolve a mixed state the opposite way from the header one.
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        selection={{ mode: 'multiple', selectAllOnIndeterminate: false }}
        grouping={{ allowedColumns: ['status'] }}
        defaultState={{ grouping: ['status'] }}
      />
    );

    await user.click(
      screen.getAllByRole('checkbox', { name: 'Select row' })[3]!
    );
    expect(groupBox('done')).toHaveAttribute('aria-checked', 'mixed');
    await user.click(groupBox('done'));
    expect(groupBox('done')).not.toBeChecked();
  });

  it('disables the control when the group has nothing it may select', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        selection={{ mode: 'multiple' }}
        grouping={{
          allowedColumns: ['status'],
          selectionScope: 'visible-leaves',
        }}
        defaultState={{ grouping: ['status'] }}
      />
    );

    // `aria-disabled`, not `toBeDisabled()`. Base UI's `Checkbox` puts the
    // `disabled` attribute on its hidden native input and the ARIA state on the
    // visible `role="checkbox"` span — two different elements, which is the same
    // split behind the propagation trap in `data-grid-config/selection.tsx`.
    // `toBeDisabled()` looks at the queried element and reports "not disabled" for
    // a control that plainly is.
    expect(groupBox('done')).not.toHaveAttribute('aria-disabled', 'true');

    // Under `'visible-leaves'` a collapsed group has nothing on screen. Stated on
    // the control rather than left as a checkbox that does nothing.
    await user.click(
      screen.getByRole('button', { name: 'Collapse group done' })
    );
    expect(groupBox('done')).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders no group control without multiple selection', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        selection={{ mode: 'single' }}
        grouping={{ allowedColumns: ['status'] }}
        defaultState={{ grouping: ['status'] }}
      />
    );

    expect(
      screen.queryByRole('checkbox', { name: /Select all rows in group/ })
    ).not.toBeInTheDocument();
  });

  it('renders no group control when the caller hid select-all', () => {
    // One intent, one switch: honouring `showSelectAll: false` for the header while
    // adding a bulk control to every group row would be the opposite of the ask.
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        selection={{ mode: 'multiple', showSelectAll: false }}
        grouping={{ allowedColumns: ['status'] }}
        defaultState={{ grouping: ['status'] }}
      />
    );

    expect(
      screen.queryByRole('checkbox', { name: /Select all rows in group/ })
    ).not.toBeInTheDocument();
  });

  it('renders no group control at all without selection', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        grouping={{ allowedColumns: ['status'] }}
        defaultState={{ grouping: ['status'] }}
      />
    );

    expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
  });
});

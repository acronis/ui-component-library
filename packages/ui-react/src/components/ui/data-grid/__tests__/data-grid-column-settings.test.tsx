import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { useDataTable } from '../../data-table';
import { DataGridColumnAnnouncer } from '../data-grid-column-announcer';
import { DataGridColumnSettings } from '../data-grid-column-settings';

// U3's column-settings menu, which replaced `DataTableViewOptions` in DataGrid's
// toolbar. The move is a layer correction (design §1 and §4.3 put this chrome on
// the DataGrid side), and the control is strictly larger than the one it replaced:
// visibility **plus** pinning and a reset, each gated by `columnsFeatures`.
//
// Every assertion opens the menu first. The trigger is identical to the old
// control's, so anything asserted on the closed menu would pass on the component
// this replaced — the content is the only place the difference exists.

interface Person {
  readonly id: string;
  readonly name: string;
  readonly team: string;
}

const columns: ColumnDef<Person, unknown>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
  { id: 'team', accessorKey: 'team', header: 'Team' },
  // A display-only column: no accessor, so not a column anyone can act on.
  { id: '__select__', header: 'Select' },
];

const rows: Person[] = [{ id: 'p0', name: 'Ada', team: 'Engine' }];

function renderSettings(
  props: Partial<
    React.ComponentProps<typeof DataGridColumnSettings<Person>>
  > = {},
  pinning?: { left?: string[] }
) {
  function Harness() {
    const controller = useDataTable({
      columns,
      data: rows,
      getRowId: (row) => row.id,
      columnsFeatures: { visibility: true, pinning: true },
      ...(pinning === undefined
        ? {}
        : {
            defaultState: {
              columnPinning: { left: pinning.left ?? [], right: [] },
            },
          }),
    });
    return (
      <>
        <DataGridColumnSettings table={controller.table} {...props} />
        {/* The grid mounts this once from `columns-features.tsx`'s chrome. It is
            here because the menu announces *into* it — a callback assertion would
            pass on a component whose announcements reach no region at all, which
            is exactly the state this replaced. */}
        <DataGridColumnAnnouncer table={controller.table} />
      </>
    );
  }
  return render(<Harness />);
}

/**
 * The grid's live region. Queried by `data-slot` because it is deliberately not a
 * `role="status"` — that role would collide with `Spinner`'s in any grid that
 * renders one, and two suites query it as a single element.
 */
const liveRegion = (container: HTMLElement) =>
  container.querySelector('[data-slot="data-grid-column-announcer"]');

// "Column settings", not /view/i: the trigger is icon-only since PLTFRM-93130
// moved it into the trailing column's header, where a labelled button does not
// fit, so `aria-label` is now the only source of its accessible name.
const openMenu = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: 'Column settings' }));
};

describe('DataGridColumnSettings', () => {
  it('offers visibility only when pinning is off — what the old control did', async () => {
    const user = userEvent.setup();
    renderSettings({ visibility: true, pinning: false });
    await openMenu(user);

    expect(screen.getByText('Toggle columns')).toBeInTheDocument();
    expect(screen.queryByText('Pin columns')).not.toBeInTheDocument();
  });

  it('adds a pinning section when pinning is on — the reason this replaced it', async () => {
    const user = userEvent.setup();
    renderSettings({ visibility: true, pinning: true });
    await openMenu(user);

    expect(screen.getByText('Toggle columns')).toBeInTheDocument();
    expect(screen.getByText('Pin columns')).toBeInTheDocument();
  });

  it('excludes system and display-only columns from both sections', async () => {
    const user = userEvent.setup();
    renderSettings({
      visibility: true,
      pinning: true,
      lockedColumnIds: ['__select__'],
    });
    await openMenu(user);

    // `__select__` is both locked and accessor-less; neither section may offer it.
    expect(
      screen.queryByRole('menuitemcheckbox', { name: '__select__' })
    ).toBeNull();
    expect(
      screen.getAllByRole('menuitemcheckbox', { name: 'name' }).length
    ).toBeGreaterThan(0);
  });

  it('shows the reset only once something is pinned', async () => {
    const user = userEvent.setup();
    const { unmount } = renderSettings({ pinning: true });
    await openMenu(user);
    expect(screen.queryByText('Unpin all')).not.toBeInTheDocument();
    unmount();

    renderSettings({ pinning: true }, { left: ['name'] });
    await openMenu(user);
    expect(screen.getByText('Unpin all')).toBeInTheDocument();
  });

  it('announces a visibility change in the logical vocabulary', async () => {
    const user = userEvent.setup();
    const { container } = renderSettings({ visibility: true, pinning: false });
    await openMenu(user);

    await user.click(screen.getByRole('menuitemcheckbox', { name: 'team' }));
    expect(liveRegion(container)).toHaveTextContent('team column hidden');
  });

  it('announces a pin in start/end terms, not TanStack left/right', async () => {
    const user = userEvent.setup();
    const { container } = renderSettings({ visibility: false, pinning: true });
    await openMenu(user);

    await user.click(screen.getByRole('menuitemcheckbox', { name: 'name' }));
    // The call underneath is `column.pin('left')`; the announcement must use the
    // neutral vocabulary, because "left" is wrong in a right-to-left locale.
    expect(liveRegion(container)).toHaveTextContent(
      'name column pinned to start'
    );
  });
});

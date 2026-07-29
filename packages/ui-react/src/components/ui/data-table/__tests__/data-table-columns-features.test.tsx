import type { ColumnDef } from '@tanstack/react-table';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  useDataTable,
  type DataTableColumnsFeaturesConfig,
} from '../data-table-controller';
import type { DataTableColumnControls } from '../data-table-features/columns';
import { DataTableRoot } from '../data-table-root';
import { DataTableView } from '../data-table-view';
import type { DataTableHeaderContext } from '../data-table-render-context';

// U3's `columnPresentation` contribution. These assert the *rendered* result
// rather than the contribution object, because the whole point of the seam is
// that it reaches the DOM: a presentation member the view forwards faithfully and
// no feature fills passes every other kind of check.
//
// The pin assertions are on `data-pinned` specifically. Pin geometry is also
// expressible as `style`, and a style-only version renders identically while
// silently losing the Table primitive's z-ladder steps and the row's
// hover/selected tint rules, which all key off that attribute. So asserting
// position would pass on the broken implementation; asserting the attribute is
// what discriminates.

interface Person {
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly site: string;
}

const columns: ColumnDef<Person, unknown>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name', size: 120 },
  { id: 'team', accessorKey: 'team', header: 'Team', size: 80 },
  { id: 'site', accessorKey: 'site', header: 'Site' },
];

const rows: Person[] = [
  { id: 'person-0', name: 'Ada', team: 'Engine', site: 'eu-central-1' },
];

function renderGrid(options: {
  columnsFeatures?: false | DataTableColumnsFeaturesConfig;
  pinning?: { left?: string[]; right?: string[] };
  /** Give `name` a caller-supplied `maxSize`, to separate it from the default. */
  capNameAt?: number;
}) {
  function Harness() {
    const controller = useDataTable({
      columns:
        options.capNameAt === undefined
          ? columns
          : columns.map((column) =>
              column.id === 'name'
                ? { ...column, maxSize: options.capNameAt }
                : column
            ),
      data: rows,
      getRowId: (row) => row.id,
      ...(options.columnsFeatures === undefined
        ? {}
        : { columnsFeatures: options.columnsFeatures }),
      ...(options.pinning === undefined
        ? {}
        : {
            defaultState: {
              columnPinning: {
                left: options.pinning.left ?? [],
                right: options.pinning.right ?? [],
              },
            },
          }),
    });

    return (
      <DataTableRoot table={controller}>
        <DataTableView<Person> />
      </DataTableRoot>
    );
  }

  return render(<Harness />);
}

/** A column's header cell, by its visible label. */
const head = (name: string) => screen.getByRole('columnheader', { name });

describe('columnsFeatures — pin presentation', () => {
  it('sets data-pinned on the header and the body cell, not just a style', () => {
    const { container } = renderGrid({
      columnsFeatures: { pinning: true },
      pinning: { left: ['name'] },
    });

    // The attribute is the contract: every pin-related specificity step in the
    // primitive selects on it.
    expect(head('Name')).toHaveAttribute('data-pinned', 'start');
    const bodyCell = container.querySelector('tbody td[data-pinned="start"]');
    expect(bodyCell).toBeInTheDocument();
    expect(bodyCell).toHaveTextContent('Ada');

    // An unpinned column must not carry it.
    expect(head('Site')).not.toHaveAttribute('data-pinned');
  });

  it('accumulates start-pinned offsets left to right', () => {
    renderGrid({
      columnsFeatures: { pinning: true },
      pinning: { left: ['name', 'team'] },
    });

    // First pinned column sits at the edge; the second clears the first's width.
    expect(head('Name').style.insetInlineStart).toBe('0px');
    expect(head('Team').style.insetInlineStart).toBe('120px');
  });

  it('accumulates end-pinned offsets right to left', () => {
    renderGrid({
      columnsFeatures: { pinning: true },
      pinning: { right: ['team', 'site'] },
    });

    // The column nearest the end edge is the *last* one, so it gets offset 0 and
    // the one before it clears its width. Accumulating in declaration order here
    // would reverse them — which looks like a rendering bug, not arithmetic.
    expect(head('Site').style.insetInlineEnd).toBe('0px');
    expect(head('Team').style.insetInlineEnd).toBe('150px');
  });

  it('does not pin when pinning is off, even with a pinning state', () => {
    renderGrid({
      columnsFeatures: { pinning: false },
      pinning: { left: ['name'] },
    });
    // The slice is still tracked — the feature only governs presentation.
    expect(head('Name')).not.toHaveAttribute('data-pinned');
  });
});

describe('columnsFeatures — width and §6.10', () => {
  it('treats an explicit size as a fixed width, not a floor', () => {
    renderGrid({ columnsFeatures: { resizing: true } });
    // §6.10: explicit size constraints win.
    expect(head('Name').style.width).toBe('120px');
    expect(head('Name').style.minWidth).toBe('120px');
  });

  it('leaves an unsized column a floor so a minimum scrolls instead of compressing', () => {
    renderGrid({ columnsFeatures: { resizing: true } });
    // `Site` has no `size`, so it gets TanStack's resolved default as a *minimum*
    // and no `width` — §6.10's "minimums cause horizontal scroll instead of
    // compression".
    expect(head('Site').style.width).toBe('');
    expect(head('Site').style.minWidth).not.toBe('');
  });

  it('lets fit=container release the floor it would otherwise set', () => {
    renderGrid({ columnsFeatures: { fit: 'container' } });
    // Fitting to the container means the browser distributes the remaining
    // width, so an unsized column must not carry a minimum that prevents it.
    expect(head('Site').style.minWidth).toBe('');
    // An explicit size still wins over fit.
    expect(head('Name').style.width).toBe('120px');
  });

  // The assertion that was missing when this file emitted
  // `max-width: 9007199254740991px`. TanStack's resolved def carries `maxSize`
  // (`Number.MAX_SAFE_INTEGER`), `minSize` (20) and `size` (150) whether the
  // caller set them or not, so `!== undefined` is always true. Asserting the
  // *absence* of a constraint is what discriminates reading the caller's input
  // from reading the resolved object — a version that reads the resolved def
  // renders a width that looks plausible until you read the number.
  it('emits no max-width for a column the caller never capped', () => {
    renderGrid({ columnsFeatures: { resizing: true } });
    for (const label of ['Name', 'Team', 'Site']) {
      expect(head(label).style.maxWidth).toBe('');
    }
  });

  it('emits a max-width only for a column the caller did cap', () => {
    renderGrid({ columnsFeatures: { resizing: true }, capNameAt: 300 });
    expect(head('Name').style.maxWidth).toBe('300px');
    expect(head('Team').style.maxWidth).toBe('');
  });

  // #91 changed this contract deliberately, and the old form of this test is why
  // the defect survived: it asserted that an absent group contributes *nothing*,
  // which was true and was the bug. A caller's `size` reached no element at all
  // unless an unrelated feature (`visibility`/`pinning`/`resizing`/`reordering`)
  // happened to be switched on, and the generated chrome columns could not be
  // narrowed in the default configuration for the same reason.
  it('publishes a DECLARED size when the group is absent, and nothing else', () => {
    renderGrid({});

    // `Name` declares `size: 120`, so it is published — this is the part that
    // used to be missing.
    expect(head('Name').style.width).toBe('120px');
    expect(head('Name').style.minWidth).toBe('120px');

    // `Team` declares `size: 80` in this fixture, so it is published too — every
    // column here is sized, which is why the group-absent case looked like "no
    // widths at all" rather than "no widths for sized columns".
    expect(head('Team').style.width).toBe('80px');

    // Everything the group itself owns stays absent.
    expect(head('Name')).not.toHaveAttribute('data-pinned');

    // **The `min-width` fallback for an UNSIZED column must stay gated**, since it
    // is TanStack's 150px default and publishing it unconditionally would re-flow
    // every table in the kit. There is no unsized column in this fixture to show
    // that with — it is asserted in
    // `data-grid/__tests__/data-grid-chrome-column-width.test.tsx`.
  });
});

/* -------------------------------------------------------------------------- */
/*                    The header-control commands (§6.9, §6.10)               */
/* -------------------------------------------------------------------------- */

// These drive the commands the way the spec's "custom composer" does — straight
// off the header render context — because that is the level the constraints live
// at. The DataGrid chrome that maps keys onto them is asserted separately in
// `data-grid/__tests__/data-grid-column-header-controls.test.tsx`.
//
// Every case here is one a DataGrid caller can reach: `columnsFeatures.reordering`
// with `pinning`, and `lockSystemColumns` (which resolves to `lockedColumnIds`).

/** The `columns` namespace this feature contributes to the header context. */
type WithControls = DataTableHeaderContext & {
  readonly columns: DataTableColumnControls;
};

function renderCapturing(options: {
  columnsFeatures?: DataTableColumnsFeaturesConfig;
  pinning?: { left?: string[]; right?: string[] };
  columns?: ColumnDef<Person, unknown>[];
  hidden?: string[];
}) {
  const captured = new Map<string, DataTableColumnControls>();

  function Harness() {
    const controller = useDataTable({
      columns: options.columns ?? columns,
      data: rows,
      getRowId: (row) => row.id,
      ...(options.columnsFeatures === undefined
        ? {}
        : { columnsFeatures: options.columnsFeatures }),
      defaultState: {
        ...(options.pinning === undefined
          ? {}
          : {
              columnPinning: {
                left: options.pinning.left ?? [],
                right: options.pinning.right ?? [],
              },
            }),
        ...(options.hidden === undefined
          ? {}
          : {
              columnVisibility: Object.fromEntries(
                options.hidden.map((id) => [id, false])
              ),
            }),
      },
    });

    return (
      <DataTableRoot table={controller}>
        <DataTableView<Person>
          sortable
          renderHeader={(context, defaultContent) => {
            captured.set(context.columnId, (context as WithControls).columns);
            return defaultContent;
          }}
        />
      </DataTableRoot>
    );
  }

  const result = render(<Harness />);
  const controls = (columnId: string): DataTableColumnControls => {
    const found = captured.get(columnId);
    if (found === undefined) {
      throw new Error(`no header context captured for '${columnId}'`);
    }
    return found;
  };
  return { ...result, controls };
}

/** The visible header labels, in DOM order — what a reorder has to change. */
const headerOrder = () =>
  screen.getAllByRole('columnheader').map((cell) => cell.textContent);

describe('columnsFeatures — resize commands', () => {
  it('commits a width and reports it, so a composer can announce it', () => {
    const { controls } = renderCapturing({
      columnsFeatures: { resizing: true },
    });

    // `Site` is unsized, so it starts at TanStack's resolved default.
    const before = controls('site').size;
    let intent;
    act(() => {
      intent = controls('site').resizeTo(before + 16);
    });

    expect(intent).toEqual({
      kind: 'resize',
      columnId: 'site',
      size: before + 16,
    });
    // The rendered result, not just the report: the width has to reach the cell.
    expect(head('Site').style.minWidth).toBe(`${before + 16}px`);
  });

  it('clamps up to the minimum, and reports nothing once it is already there', () => {
    const { controls } = renderCapturing({
      columnsFeatures: { resizing: true },
      columns: [
        {
          id: 'name',
          accessorKey: 'name',
          header: 'Name',
          size: 120,
          minSize: 100,
        },
        { id: 'team', accessorKey: 'team', header: 'Team', size: 80 },
        { id: 'site', accessorKey: 'site', header: 'Site' },
      ],
    });

    let clamped;
    act(() => {
      // §6.10: a minimum causes horizontal scroll rather than compression, so a
      // narrower request lands *at* the minimum instead of below it.
      clamped = controls('name').resizeTo(40);
    });
    expect(clamped).toEqual({ kind: 'resize', columnId: 'name', size: 100 });

    let again;
    act(() => {
      again = controls('name').resizeTo(40);
    });
    // Nothing changed, so nothing is reported — the difference between "clamped"
    // and "clamped again" is what stops a composer announcing a move that did not
    // happen.
    expect(again).toBeUndefined();
  });

  it('publishes the caller cap and no cap at all when there is none', () => {
    const { controls } = renderCapturing({
      columnsFeatures: { resizing: true },
      columns: [
        { id: 'name', accessorKey: 'name', header: 'Name', maxSize: 300 },
        { id: 'team', accessorKey: 'team', header: 'Team', size: 80 },
        { id: 'site', accessorKey: 'site', header: 'Site' },
      ],
    });

    expect(controls('name').maxSize).toBe(300);
    // The resolved def carries `Number.MAX_SAFE_INTEGER` here. Publishing that is
    // how `max-width: 9007199254740991px` reached the DOM once; as the handle's
    // `aria-valuemax` it would be the same defect read out loud.
    expect(controls('team').maxSize).toBeUndefined();
    // The minimum is real, though — a resize genuinely stops there.
    expect(controls('team').minSize).toBeGreaterThan(0);
  });

  it('refuses every resize command when resizing is off', () => {
    const { controls } = renderCapturing({
      columnsFeatures: { visibility: true },
    });

    expect(controls('site').canResize).toBe(false);
    expect(controls('site').resizeHandleProps).toBeUndefined();
    let intent;
    act(() => {
      intent = controls('site').resizeTo(400);
    });
    expect(intent).toBeUndefined();
    expect(head('Site').style.width).toBe('');
  });
});

describe('columnsFeatures — reorder commands (§6.9)', () => {
  it('moves one visible position and reports the new position', () => {
    const { controls } = renderCapturing({
      columnsFeatures: { reordering: true },
    });

    expect(headerOrder()).toEqual(['Name', 'Team', 'Site']);
    let intent;
    act(() => {
      intent = controls('name').moveBy(1);
    });

    expect(intent).toEqual({
      kind: 'reorder',
      columnId: 'name',
      position: 2,
      total: 3,
    });
    expect(headerOrder()).toEqual(['Team', 'Name', 'Site']);
  });

  it('refuses at the edge of the column set rather than wrapping', () => {
    const { controls } = renderCapturing({
      columnsFeatures: { reordering: true },
    });

    let intent;
    act(() => {
      intent = controls('name').moveBy(-1);
    });
    expect(intent).toBeUndefined();
    expect(headerOrder()).toEqual(['Name', 'Team', 'Site']);
  });

  it('steps over a hidden column instead of into it', () => {
    // `Team` is hidden, so one keypress on `Name` has to land past it. Counting
    // hidden columns would apply a reorder nobody can see and read as a dead key.
    const { controls } = renderCapturing({
      columnsFeatures: { reordering: true, visibility: true },
      hidden: ['team'],
    });

    expect(headerOrder()).toEqual(['Name', 'Site']);
    let intent;
    act(() => {
      intent = controls('name').moveBy(1);
    });

    expect(intent).toEqual({
      kind: 'reorder',
      columnId: 'name',
      position: 2,
      total: 2,
    });
    expect(headerOrder()).toEqual(['Site', 'Name']);
  });

  it('keeps the move inside the pin region — pin beats order', () => {
    const { controls } = renderCapturing({
      columnsFeatures: { reordering: true, pinning: true },
      pinning: { left: ['name'] },
    });

    // `name` is alone in the start region, so there is nowhere legal to go. The
    // next column in DOM order is in the middle region, and moving there would
    // silently unpin the column — a pin change nobody asked for.
    let stepped;
    act(() => {
      stepped = controls('name').moveBy(1);
    });
    expect(stepped).toBeUndefined();

    let named;
    act(() => {
      named = controls('name').moveTo('team');
    });
    expect(named).toBeUndefined();
    expect(head('Name')).toHaveAttribute('data-pinned', 'start');
  });

  it('offers nothing on a locked column, and refuses a move onto one', () => {
    const { controls } = renderCapturing({
      // What `lockSystemColumns` resolves to on the DataGrid side.
      columnsFeatures: {
        reordering: true,
        resizing: true,
        lockedColumnIds: ['team'],
      },
    });

    expect(controls('team').canReorder).toBe(false);
    // Locked means locked: a resize handle on a system column is not what "stays
    // locked unless explicitly unlocked" means.
    expect(controls('team').canResize).toBe(false);

    let ontoLocked;
    act(() => {
      ontoLocked = controls('name').moveTo('team');
    });
    expect(ontoLocked).toBeUndefined();
    expect(headerOrder()).toEqual(['Name', 'Team', 'Site']);
  });

  it('refuses every reorder command when reordering is off', () => {
    const { controls } = renderCapturing({
      columnsFeatures: { resizing: true },
    });

    expect(controls('name').canReorder).toBe(false);
    let intent;
    act(() => {
      intent = controls('name').moveBy(1);
    });
    expect(intent).toBeUndefined();
    expect(headerOrder()).toEqual(['Name', 'Team', 'Site']);
  });
});

describe('columnsFeatures — the header-control seam', () => {
  it('renders nothing in the header until a composer supplies a renderer', () => {
    // The engine's half of "DataTable renders no handle": the seam is a slot, and
    // an empty slot leaves the header exactly as it was.
    renderCapturing({ columnsFeatures: { resizing: true, reordering: true } });
    const name = head('Name');
    expect(name.querySelectorAll('[role="separator"]')).toHaveLength(0);
    expect(name.querySelectorAll('button')).toHaveLength(1); // the sort button
  });

  it('mounts a supplied renderer as a sibling of the sort button', () => {
    renderCapturing({
      columnsFeatures: {
        resizing: true,
        renderHeaderControls: (controls) => (
          <button
            type="button"
            aria-label={`Resize ${controls.columnId} column`}
          />
        ),
      },
    });

    const name = head('Name');
    const control = screen.getByRole('button', { name: 'Resize name column' });
    expect(name).toContainElement(control);
    // The assertion that discriminates the seam from the placement that looks the
    // same: a `before-label`/`after-label` adornment lands *inside* the sort
    // button, where the control's own name is absorbed and its Enter sorts.
    const sortButton = name.querySelector('button');
    expect(sortButton).not.toContainElement(control);
    // And the header still names itself from its label alone — otherwise the
    // control's name is announced on every cell of the column, on every row.
    expect(head('Name')).toHaveAccessibleName('Name');
  });
});

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ColumnDef } from '@tanstack/react-table';

import { useDataTable } from '../data-table-controller';
import { DataTableRoot } from '../data-table-root';
import { DataTableView } from '../data-table-view';

// U6a — the body-window seam. These stories drive it at the **DataTable** level,
// because that is the only level it is reachable from today: the public
// `DataGrid` `virtualization` prop is U6b's, deliberately held until §7's focus
// clauses 3–4 land so the prop never ships with a focus gap its own grammar would
// flag.
//
// **A bounded container is a precondition, not a preference.** These stories pass
// `height`, which is the unambiguous way to express it.
//
// They used to say `maxHeight` *could not* work, and that is no longer true — the
// correction matters more than the original claim, because the old text carried a real
// measurement and a reader would rightly trust it. What was measured, before
// `4be051e1`: `maxHeight` clamped the ScrollArea root but left its `height` at `auto`,
// so the viewport's `height: 100%` had no definite parent to resolve against and grew
// to its content. At `maxHeight={400}` over 10,000 rows the root measured 400px, the
// **viewport measured 400040px**, no spacers rendered, and the table could not scroll.
//
// `4be051e1` moved the height constraints onto the viewport — the element that actually
// scrolls — so a definite `maxHeight` now bounds windowing exactly as `height` does.
// `table.stories.tsx` demonstrates it positively rather than by absence of churn:
// `BoundedByHeightOverflowing` and `BoundedByMaxHeightOverflowing` differ only in which
// prop expresses the bound and are required to be pixel-identical (`81d68585`).
// Separately, `37fe7043` requires the value to be *definite* and warns on a percentage.
//
// So: **do not "re-fix" the viewport bug — it is fixed.** The seam keeps a geometry
// guard for it, deliberately, as a regression detector rather than a live-bug one; see
// the note at that guard in `data-table-body-window.ts`.
//
// These are also the browser-verification harness. Scroll geometry, sticky ancestors,
// the overlay scrollbar and stacking order are not expressible as happy-dom
// assertions, so the unit tests do not discharge them.

interface Event {
  id: string;
  seq: number;
  resource: string;
  status: string;
  detail: string;
}

const STATUSES = ['Completed', 'Running', 'Failed', 'Queued'];

/** Long enough that windowing is the only way this renders at interactive speed. */
const events = (count: number, longEvery = 0): Event[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `e-${index}`,
    seq: index,
    resource: `workload-${String(index).padStart(5, '0')}`,
    status: STATUSES[index % STATUSES.length]!,
    detail:
      longEvery > 0 && index % longEvery === 0
        ? 'Retried after a transient network fault; the agent reconnected and resumed the incremental chain from the last consistent recovery point, then verified the archive.'
        : 'Completed normally.',
  }));

const columns: ColumnDef<Event, unknown>[] = [
  { accessorKey: 'seq', header: '#' },
  { accessorKey: 'resource', header: 'Resource' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'detail', header: 'Detail' },
];

function VirtualizedTable({
  count,
  longEvery = 0,
  virtualization,
  stickyHeader = false,
  striped = false,
}: {
  count: number;
  longEvery?: number;
  virtualization: object;
  stickyHeader?: boolean;
  striped?: boolean;
}) {
  const controller = useDataTable({
    columns,
    data: events(count, longEvery),
    getRowId: (row) => row.id,
    virtualization,
  });

  return (
    <DataTableRoot table={controller}>
      <DataTableView<Event>
        height={400}
        stickyHeader={stickyHeader}
        striped={striped}
        // Without a width bound the long `detail` text stays on one line and every row
        // measures the same, which would make `DynamicHeight` indistinguishable from
        // `FixedHeight` — a story that demonstrates nothing while appearing to.
        cellClassName={(cell) =>
          cell.columnId === 'detail'
            ? 'max-w-[280px] whitespace-normal'
            : undefined
        }
      />
    </DataTableRoot>
  );
}

const meta = {
  title: 'Components/DataTable/Virtualization',
  component: VirtualizedTable,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof VirtualizedTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 10,000 rows at the shipped defaults — 40px estimate, `fixed`, overscan 8.
 *
 * The scrollbar should describe the whole 10,000, not the rendered window: the seam
 * reserves the rows outside it as two spacer rows.
 */
export const FixedHeight: Story = {
  args: { count: 10_000, virtualization: {} },
};

/**
 * `measure: 'dynamic'` with every 7th row wrapping to several lines.
 *
 * Fixed mode would place every row on the 40px estimate and the scroll position
 * would drift as you travel; dynamic re-measures each rendered row and corrects the
 * reserved height. The seam supplies the `data-index` the virtualizer needs to
 * identify a measured row — without it measurement silently keeps the estimate.
 */
export const DynamicHeight: Story = {
  args: {
    count: 5_000,
    longEvery: 7,
    virtualization: { measure: 'dynamic', estimateRowHeight: 44 },
  },
};

/**
 * Windowing under a **sticky header** — the interaction happy-dom cannot see.
 *
 * The header must stay pinned while the window recycles beneath it, and the spacer
 * rows must not disturb it. Sticky positioning depends on the ancestor chain, and
 * the spacers are ordinary `<tr>`s inside the same `<tbody>`.
 */
export const StickyHeaderWhileWindowed: Story = {
  args: { count: 10_000, stickyHeader: true, virtualization: {} },
};

/**
 * Striping plus windowing, which is where a naive implementation shows itself:
 * stripes must follow the row's **record index**, not its position in the window,
 * or the banding inverts as you scroll.
 */
export const StripedWhileWindowed: Story = {
  args: { count: 10_000, striped: true, virtualization: {} },
};

/**
 * A small overscan against a large list — the configuration that makes the focus
 * pin observable.
 *
 * Focus a cell with the keyboard, then scroll it out of view: the row stays mounted
 * and keeps focus while it is within the pin budget, because losing focus to
 * `<body>` mid-scroll strands the keyboard user. Scroll far enough and focus is
 * handed to the scroll container instead, which keeps arrow keys working without
 * changing the logical current row.
 */
export const FocusPinWithTightOverscan: Story = {
  args: { count: 10_000, virtualization: { overscan: 2 } },
};

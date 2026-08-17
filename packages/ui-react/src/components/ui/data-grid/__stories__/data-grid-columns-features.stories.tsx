import { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ColumnDef } from '@tanstack/react-table';

import { DataGrid } from '../data-grid';

// The `columnsFeatures` group (U3): pinning, resizing, reordering, fit, and the
// column-settings menu. Every story is `sorting`-enabled, because sortable **and**
// resizable is the ordinary records grid and it is what the header chrome has to
// coexist with — the resize handle and reorder grip are siblings of the sort
// button, not children of it.
//
// The handle and the grip are keyboard-operable, which is not visible in a
// screenshot: Tab to a handle and press Left/Right to resize; activate a grip and
// press Left/Right to move the column, then Enter or Escape to finish. Each change
// is announced through the grid's single live region. The grip also takes a pointer
// drag onto another column, which is equally invisible here — see `Reordering`.
//
// ── THE VISUAL SUITE DOES NOT GUARD THE DRAG INDICATOR ───────────────────────
// The line that shows a column's prospective width while a handle is being dragged
// (F19) exists only *during* a pointer drag, and a screenshot cannot capture a
// drag: these baselines are byte-identical with the feature present and with it
// removed. So a green visual run says nothing at all about it — stated here rather
// than left to be inferred from the suite passing.
//
// Guarding it visually would need a play-function interaction on one of these
// stories, which is deliberately not added here: it belongs with whoever takes the
// interaction-coverage gap, not bolted onto one feature. Until then the offset
// arithmetic is covered by unit tests
// (`data-table/__tests__/data-table-resize-indicator.test.tsx`) and the *rendered*
// line is verified by hand in a browser.

interface Server {
  id: string;
  name: string;
  region: string;
  status: string;
  owner: string;
}

const servers: Server[] = [
  {
    id: '1',
    name: 'api-gateway-01',
    region: 'eu-central-1',
    status: 'Healthy',
    owner: 'Platform',
  },
  {
    id: '2',
    name: 'worker-pool-eu',
    region: 'eu-west-1',
    status: 'Degraded',
    owner: 'Data',
  },
  {
    id: '3',
    name: 'edge-cache-us',
    region: 'us-east-1',
    status: 'Healthy',
    owner: 'Platform',
  },
  {
    id: '4',
    name: 'batch-runner-ap',
    region: 'ap-south-1',
    status: 'Offline',
    owner: 'Data',
  },
];

/**
 * The same four servers with values long enough to overflow their column.
 *
 * `OverflowTooltipOnly` needs them: `truncate` only shows when something is being
 * clipped, and every other row set in this file fits comfortably, so the flag would
 * be present in the DOM and absent from the image.
 */
const verboseServers: Server[] = [
  {
    id: '1',
    name: 'api-gateway-01.eu-central-1.internal.example.com',
    region: 'eu-central-1 (Frankfurt, primary availability zone)',
    status: 'Healthy — last probe 2s ago, 0 consecutive failures',
    owner: 'Platform Infrastructure / Edge Networking',
  },
  {
    id: '2',
    name: 'worker-pool-eu.batch.eu-west-1.internal.example.com',
    region: 'eu-west-1 (Dublin, secondary availability zone)',
    status: 'Degraded — 3 of 12 workers unreachable since 14:02 UTC',
    owner: 'Data Platform / Batch Processing',
  },
  {
    id: '3',
    name: 'edge-cache-us.pop.us-east-1.internal.example.com',
    region: 'us-east-1 (N. Virginia, primary availability zone)',
    status: 'Healthy — last probe 1s ago, 0 consecutive failures',
    owner: 'Platform Infrastructure / Content Delivery',
  },
  {
    id: '4',
    name: 'batch-runner-ap.ap-south-1.internal.example.com',
    region: 'ap-south-1 (Mumbai, single availability zone)',
    status: 'Offline — drained for maintenance, returns 15:30 UTC',
    owner: 'Data Platform / Scheduled Jobs',
  },
];

const columns: ColumnDef<Server>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name', size: 200 },
  { id: 'region', accessorKey: 'region', header: 'Region' },
  { id: 'status', accessorKey: 'status', header: 'Status' },
  { id: 'owner', accessorKey: 'owner', header: 'Owner' },
];

/** `Name` is capped, so its handle publishes a maximum; the others do not. */
const cappedColumns: ColumnDef<Server>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    size: 200,
    minSize: 120,
    maxSize: 320,
  },
  ...columns.slice(1),
];

/**
 * Every column capped, so `overflowTooltip`'s `truncate` has an edge to clip against.
 *
 * See `OverflowTooltipOnly`: without a `maxSize`, `white-space: nowrap` makes the
 * column's min-content the whole string and auto-layout widens the column to fit it,
 * so nothing clips and the ellipsis never appears.
 */
const cappedForTooltipColumns: ColumnDef<Server>[] = [
  // ── WHY OWNER, WITH THE SHORTEST CONTENT, CARRIES THE LARGEST NUMBER ─────────
  //
  // These are not caps. Measured: a column's rendered width is
  // `cap / sum(caps) * tableWidth` — 150/690 * 1246 = 270.9px, and 200/740 * 1246 =
  // 336.8px, both to the decimal. `maxSize` acts as a **proportional weight** under
  // `table-layout: auto`, which is #108's "floors and no caps" seen from the other
  // side. So the four numbers only matter relative to each other.
  //
  // The three verbose columns are therefore weighted DOWN and `owner` UP, because the
  // table's width is fixed and tightening one column loosens another: a first attempt
  // narrowed `name` alone and pushed 22px into `region`, whose last row then stopped
  // clipping. `owner`'s values are short, so the width parked there is whitespace and
  // costs nothing, and every verbose column keeps a margin.
  { id: 'name', accessorKey: 'name', header: 'Name', size: 150, maxSize: 150 },
  {
    id: 'region',
    accessorKey: 'region',
    header: 'Region',
    size: 140,
    maxSize: 140,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    size: 150,
    maxSize: 150,
  },
  {
    id: 'owner',
    accessorKey: 'owner',
    header: 'Owner',
    size: 160,
    maxSize: 160,
  },
];

const meta = {
  title: 'Components/DataGrid/Columns features',
  component: DataGrid,
  parameters: { layout: 'padded' },
  args: {
    columns: columns as ColumnDef<unknown, unknown>[],
    rows: servers,
    getRowId: (row: unknown) => (row as Server).id,
    sorting: {},
  },
  argTypes: {
    columns: { control: false },
    rows: { control: false },
    columnsFeatures: { control: false },
  },
} satisfies Meta<typeof DataGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Resizing on its own. Every column carries a handle at its trailing edge; the
 * sort affordance is unaffected, because the handle is a sibling of the sort
 * button rather than part of it.
 *
 * **Drag a handle to see the indicator** — a thin vertical line marking where the
 * column's edge will land, spanning the whole table. It is not a nicety: the
 * default `columnResizeMode` is `'onEnd'`, so the column itself does not move
 * until you release, and the line is the interaction's only visible half. It stops
 * where the width will stop, so at a column's minimum the pointer keeps going and
 * the line does not.
 */
export const Resizing: Story = {
  args: { columnsFeatures: { resizing: true } },
};

/**
 * Resizing with caller-set constraints. `Name` is 120–320px, so its handle
 * publishes both bounds and the width stops at them; the other columns publish a
 * minimum only, because an unset maximum is `Number.MAX_SAFE_INTEGER` and
 * announcing that would be nonsense.
 *
 * This is the story that shows the drag indicator obeying those bounds: drag
 * `Name` past either end and the line halts at 120 or 320 while the pointer
 * carries on. A line that followed the pointer instead would be asserting a width
 * the release cannot produce.
 */
export const ResizingWithinCallerLimits: Story = {
  args: {
    columns: cappedColumns as ColumnDef<unknown, unknown>[],
    columnsFeatures: { resizing: true },
  },
};

/**
 * Reordering on its own — the grip, which takes either a pointer or the keyboard.
 *
 * **Drag it onto another column**: the column under the pointer is outlined as the
 * drop target, release moves the dragged column into its place, and Escape abandons
 * the drag with nothing moved. **Or activate it and use the arrow keys**: each move
 * is applied immediately and announced, and Enter or Escape ends the interaction.
 * A click below the 4px drag threshold is still a click, so both live on one grip.
 *
 * ⚠ **Neither this baseline nor any other guards the drag.** The drop outline
 * exists only while a pointer is down, and a screenshot cannot capture a drag — the
 * same reason stated for the resize indicator at the top of this file. The gesture's
 * arithmetic is unit-tested (`columnAtClientX`, and the gesture-to-command mapping
 * in `data-grid-column-header-controls.test.tsx`); the *rendered* drag is verified
 * by hand in a browser and by nothing in CI.
 */
export const Reordering: Story = {
  args: { columnsFeatures: { reordering: true } },
};

/**
 * Both, which is the configuration a records grid actually ships: grip then handle
 * at the trailing edge of a sortable header.
 */
export const ResizingAndReordering: Story = {
  args: { columnsFeatures: { resizing: true, reordering: true } },
};

/**
 * The column-settings menu, with the sections `columnsFeatures` turns on:
 * visibility, pinning, and the reset that appears once something is pinned. This
 * is the control that replaced `DataTableViewOptions` in DataGrid's toolbar.
 */
export const ColumnSettingsMenu: Story = {
  args: {
    columnsFeatures: { visibility: true, pinning: true },
    toolbar: { viewOptions: true },
  },
};

/**
 * The whole group. The selection and actions columns are locked by default
 * (`lockSystemColumns`), so they carry no handle and no grip — pin one of the data
 * columns from the menu to see the header and body cells travel together.
 */
export const EveryAffordance: Story = {
  args: {
    columnsFeatures: {
      visibility: true,
      pinning: true,
      resizing: true,
      reordering: true,
    },
    selection: { mode: 'multiple' },
    actions: {
      items: [{ id: 'restart', label: 'Restart' }],
      onAction: () => undefined,
    },
    toolbar: { viewOptions: true },
  },
};

/**
 * `fit: 'container'` releases the width floor an unsized column would otherwise
 * carry, so the browser distributes the remaining width. An explicit size still
 * wins (§6.10): `Name` stays at 200px.
 */
export const FitToContainer: Story = {
  args: { columnsFeatures: { resizing: true, fit: 'container' } },
};

/**
 * `fit` on its own, with **no affordance switched on** — the configuration that was
 * silently inert until #96, because `fit` and `overflowTooltip` are absent from
 * `columnsFeatures.enabled`'s disjunction and the controller then discarded the whole
 * config. No story exercised this shape, which is why the defect survived; this is
 * that story.
 *
 * ── WHERE THE EVIDENCE IS, AND WHERE IT IS NOT ───────────────────────────────
 * **Not** in a `content`-vs-`container` comparison. Measured, the two arms are
 * byte-identical (0 of 1,024,000 px) and their column widths agree to the decimal:
 * `min-width: fit-content` is a *floor*, and a floor below the width auto-layout
 * already distributes is inert — the same mechanism that had a `min-width: 150px`
 * column rendering 209px. So #96 made these props **reach the engine**; it did not
 * make `content` and `container` mean different things on screen.
 *
 * The comparison that does carry pixels is **fit vs no fit**, and both its controls
 * are already committed baselines on this same data, which is what makes this new
 * image reviewable rather than merely new:
 *
 *  - `Resizing` and `Reordering` leave `fit` unset, so the three unsized columns take
 *    the default `min-width: 150px` floor and auto-layout hands them **equal** widths
 *    — measured 348.7 each.
 *  - `FitToContainer` has `fit` set, and its three render **unevenly**, content-driven
 *    — measured 374.6 / 334.8 / 336.6.
 *
 * This story must match the second set to the decimal while showing **no resize
 * handle and no grip**, because no affordance is on. Widths from the one, header
 * chrome from the other: that pair is the evidence that the config reached the engine
 * with nothing else switched on. `Name` declares `size: 200` and holds it throughout
 * (§6.10).
 *
 * ── WHAT "UNEVEN" LOOKS LIKE, STATED SO A REVIEWER DOES NOT CALL THIS BROKEN ──
 * **The evidence is `Region`'s width against the default's even 348.7 — not three
 * visibly different columns.** `Status` and `Owner` land ~4px apart (334.8 vs 336.6),
 * which nobody would perceive as unequal. So: **unequal, and visibly so for `Region`.**
 * A reviewer checking for three distinct widths will conclude the story regressed when
 * it has not.
 *
 * ⚠ **Two of the three numbers here are below the visual gate's 0.5% threshold as
 * comparisons.** Measured against the committed images: this story differs from
 * `FitToContainer` by **0.096%** and from `Resizing` by **1.508%**. Only the second
 * leg is above the gate and therefore load-bearing — `FitToContainer` and this story
 * could drift into each other and the gate would not report it (#101).
 */
export const FitContentOnly: Story = {
  args: { columnsFeatures: { fit: 'content' } },
};

/**
 * `overflowTooltip` on its own — the other half of the path #96 repaired. The flag
 * puts `truncate` on every header and body cell, so an over-long value clips with an
 * ellipsis instead of wrapping and the tooltip has something to reveal.
 *
 * ── WHY THIS STORY CAPS EVERY COLUMN, WHICH LOOKS LIKE AN UNRELATED DETAIL ───
 * **`truncate` on its own cannot clip anything here, and that is measured rather
 * than argued.** `truncate` sets `white-space: nowrap`, which makes each column's
 * min-content width the entire string; under `w-full` + `table-layout: auto` the
 * browser then widens the column to fit it, so nothing ever reaches its overflow
 * edge. With these same verbose rows and no `maxSize`, the table grew from 1246.0px
 * to 1438.9px — overflowing its container — and **0 of 16 body cells clipped**.
 * `appearance.width` does not help either: the width lands on the bordered box and
 * the table simply scrolls inside it, still 1438.9px, still 0 clipped.
 *
 * A `maxSize` is what makes the ellipsis reachable, so every column declares one
 * here. Measured in this configuration: **12 of 16 body cells clip — `name`, `region`
 * and `status` on all four rows, `owner` on none — and the tightest of the twelve
 * overflows its cell by 30px.** That is the story's evidence, and it is why the
 * weights are load-bearing rather than decorative: remove them and the baseline stops
 * showing the feature.
 *
 * ── THE MARGIN IS PART OF THE CLAIM, NOT A DETAIL ────────────────────────────
 * **An earlier version of this story clipped 11 of 16 in the committed Linux baseline
 * while measuring 12 on the host**, because `name`'s last row cleared its cell by only
 * 19px and Linux renders that 47-character string narrower than macOS does. The count
 * was true where it was measured and false where it is compared — and **one ellipsis
 * appearing or disappearing is far below the visual gate's 0.5% threshold, so a font
 * change in the Docker image would have altered the demonstration silently** (#101).
 *
 * Hence the 30px: it is ~1.5x the discrepancy that flipped it, so the count survives
 * the renderer. **Any pixel number in a docblock measured on the host and compared in
 * Docker is exposed the same way** — state the margin, so the next person can re-check
 * the claim rather than re-measure the conclusion.
 *
 * ── HOW TO VERIFY THE COUNT, BECAUSE THE OBVIOUS METHOD IS WRONG ─────────────
 * **Do not compare where each row's text ends.** In the 11-of-16 baseline the three
 * clipped rows ended at x=332/335/333 and the row that FIT ended at x=334 — so "they
 * all stop at the same x, therefore all are clipped" is not merely unreliable, it is
 * wrong in the confident direction. Use **glyph shape**: an ellipsis is ~2 scanlines of
 * ink in 3 clusters, a word ending is 6-10 scanlines in 1-2. `owner` is the control —
 * its unclipped row-ends scatter (1170-1229) where a clipped column's cluster within
 * 3px.
 *
 * ⚠ **The tooltip itself is not in this baseline.** It appears on hover or focus and
 * a screenshot captures neither — the same limitation the drag indicator has, noted
 * at the top of this file. The image guards the truncation; the tooltip is covered by
 * unit tests and verified by hand.
 */
export const OverflowTooltipOnly: Story = {
  args: {
    rows: verboseServers,
    columns: cappedForTooltipColumns as ColumnDef<unknown, unknown>[],
    columnsFeatures: { overflowTooltip: true },
  },
};

/* -------------------------------------------------------------------------- */
/*                    Pinned-region divider (PLTFRM-93276)                    */
/* -------------------------------------------------------------------------- */

interface WideServer {
  id: string;
  host: string;
  role: string;
  region: string;
  ip: string;
  os: string;
  agent: string;
  status: string;
}

const wideServers: WideServer[] = [
  {
    id: 's1',
    host: 'db-primary-01',
    role: 'Database',
    region: 'Frankfurt',
    ip: '10.14.2.11',
    os: 'Ubuntu 24.04',
    agent: '15.0.38',
    status: 'Protected',
  },
  {
    id: 's2',
    host: 'db-replica-01',
    role: 'Database',
    region: 'Frankfurt',
    ip: '10.14.2.12',
    os: 'Ubuntu 24.04',
    agent: '15.0.38',
    status: 'Protected',
  },
  {
    id: 's3',
    host: 'web-edge-07',
    role: 'Web',
    region: 'Berlin',
    ip: '10.22.7.4',
    os: 'Debian 12',
    agent: '14.9.02',
    status: 'Warning',
  },
  {
    id: 's4',
    host: 'batch-runner-02',
    role: 'Batch',
    region: 'Hamburg',
    ip: '10.31.1.9',
    os: 'RHEL 9',
    agent: '15.0.38',
    status: 'Protected',
  },
];

// Wide enough that the middle columns cannot all fit, which is the only situation
// the divider is about.
const wideColumns: ColumnDef<WideServer>[] = [
  { accessorKey: 'host', header: 'Host', size: 200 },
  { accessorKey: 'role', header: 'Role', size: 160 },
  { accessorKey: 'region', header: 'Region', size: 160 },
  { accessorKey: 'ip', header: 'IP address', size: 160 },
  { accessorKey: 'os', header: 'Operating system', size: 200 },
  { accessorKey: 'agent', header: 'Agent', size: 160 },
  { accessorKey: 'status', header: 'Status', size: 160 },
];

/**
 * Starts part-scrolled, so both dividers show on the first frame — the state worth
 * looking at, and the state the baseline captures.
 *
 * The scroll is set in an **effect, not a play function**: a play function races the
 * screenshot, which upstream recorded as CI non-determinism. An effect runs before
 * the first frame a capture can see.
 *
 * `DataGrid` exposes no ref for `ScrollArea`'s viewport, so it is found by the
 * property that defines it — the descendant that actually overflows.
 */
function ScrolledGrid(props: {
  readonly pinnedDivider?: 'auto' | 'always';
  readonly scrollTo: number;
  readonly stickyHeader?: boolean;
}) {
  const wrapper = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scroller = [...(wrapper.current?.querySelectorAll('div') ?? [])].find(
      (element) => element.scrollWidth > element.clientWidth + 1
    );
    scroller?.scrollTo({ left: props.scrollTo });
  }, [props.scrollTo]);

  return (
    <div ref={wrapper}>
      <DataGrid
        columns={wideColumns as ColumnDef<unknown, unknown>[]}
        rows={wideServers}
        getRowId={(row: unknown) => (row as WideServer).id}
        appearance={
          props.stickyHeader === true
            ? // `stickyHeader` warns without a bounded height — the header would have
              // nothing to stick to.
              { width: 720, height: 220, stickyHeader: true }
            : { width: 720 }
        }
        columnsFeatures={{
          pinning: true,
          ...(props.pinnedDivider === undefined
            ? {}
            : { pinnedDivider: props.pinnedDivider }),
        }}
        // `host` stays readable while scrolling; `status` stays reachable. Both are
        // region boundaries, so both take a divider.
        defaultState={{
          columnPinning: { left: ['host'], right: ['status'] },
        }}
      />
    </div>
  );
}

/**
 * A pinned column keeps a 1px divider on its inner edge **while columns are hidden
 * underneath it**. Without it those columns simply stop existing: a pinned cell
 * paints an opaque surface, so there is no seam saying the table continues under
 * there.
 *
 * Nothing here switches it on — `pinnedDivider` defaults to `'auto'`, and `'auto'`
 * means "while something is hidden past that edge". Scroll back to the start and
 * the start divider disappears, because then nothing is under it.
 */
export const PinnedColumnDivider: Story = {
  render: () => <ScrolledGrid scrollTo={220} />,
};

/**
 * The composition case: a boundary pinned cell inside a **sticky header** carries
 * the header's bottom line and the divider at once.
 *
 * This is why the cell shadow is composed from custom-property slots rather than
 * written directly — `box-shadow` is one property, and before the slots whichever
 * feature wrote it last silently erased the other.
 */
export const PinnedAndSticky: Story = {
  render: () => (
    <ScrolledGrid pinnedDivider="always" scrollTo={0} stickyHeader />
  ),
};

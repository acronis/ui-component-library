import { Fragment } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from '../../checkbox';
import { Tag } from '../../tag';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../table';

const meta = {
  title: 'UI/Table',
  component: Table,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description:
        'Composed parts — `TableHeader`/`TableBody`/`TableFooter` with `TableRow`, `TableHead`, `TableCell`, and an optional `TableCaption`.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    className: {
      control: false,
      description: 'Additional classes merged onto the `<table>`.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
      description:
        'Cell density. Applied from the root, so every cell follows.',
      table: {
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: 'medium' },
        category: 'Appearance',
      },
    },
    background: {
      control: 'inline-radio',
      options: ['transparent', 'accent', 'subtle', 'surface'],
      description:
        'Surface variant. Also publishes the background sticky and pinned cells paint.',
      table: {
        type: { summary: "'transparent' | 'accent' | 'subtle' | 'surface'" },
        defaultValue: { summary: 'transparent' },
        category: 'Appearance',
      },
    },
    borders: {
      control: false,
      description:
        'Independent `top` / `bottom` / `horizontal` / `vertical` dimensions, each `false | true | "subtle" | "default" | "strong"`. Only `horizontal` is on by default.',
      table: { type: { summary: 'TableBorders' }, category: 'Appearance' },
    },
    width: {
      control: false,
      description: 'Width of the scroll container. A bare number is px.',
      table: { type: { summary: 'number | string' }, category: 'Layout' },
    },
    height: {
      control: false,
      description:
        'Height of the scroll container. Bounding the container is the precondition for sticky sections and windowed rendering.',
      table: { type: { summary: 'number | string' }, category: 'Layout' },
    },
    maxHeight: {
      control: false,
      description:
        'Maximum height of the scroll container. A bare number is px.',
      table: { type: { summary: 'number | string' }, category: 'Layout' },
    },
    containerRef: {
      control: false,
      description:
        'Ref to the scroll container — what an owner scrolls or observes.',
      table: { type: { summary: 'Ref<HTMLDivElement>' }, category: 'Layout' },
    },
    containerClassName: {
      control: false,
      description: 'Additional classes merged onto the scroll container.',
      table: { type: { summary: 'string' }, category: 'Layout' },
    },
    containerProps: {
      control: false,
      description:
        'Escape hatch for the scroll container — `onScroll`, `tabIndex`, `data-*`.',
      table: {
        type: { summary: 'HTMLAttributes<HTMLDivElement>' },
        category: 'Layout',
      },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table className="w-[520px]">
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV002</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>PayPal</TableCell>
          <TableCell className="text-right">$150.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV003</TableCell>
          <TableCell>Unpaid</TableCell>
          <TableCell>Bank Transfer</TableCell>
          <TableCell className="text-right">$350.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$750.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

// Sortable headers render the sort affordance (inactive ⇅ / active ↑ / active ↓)
// and set `aria-sort`. Wire `onSort` to your own sorting; the direction is fixed
// here for the snapshot.
export const SortableHeaders: Story = {
  render: () => (
    <Table className="w-[520px]">
      <TableHeader>
        <TableRow>
          <TableHead sortable sortDirection="asc">
            Name
          </TableHead>
          <TableHead sortable>Created</TableHead>
          <TableHead sortable sortDirection="desc" className="text-right">
            Size
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Backup archive</TableCell>
          <TableCell>26 Jan, 2026</TableCell>
          <TableCell className="text-right">4 567 890</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Disk image</TableCell>
          <TableCell>24 Jan, 2026</TableCell>
          <TableCell className="text-right">1 204 050</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

// Selection: a leading checkbox column and a `selected` row (active token).
export const Selectable: Story = {
  render: () => (
    <Table className="w-[520px]">
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox aria-label="Select all" />
          </TableHead>
          <TableHead>Workload</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow selected>
          <TableCell>
            <Checkbox defaultChecked aria-label="Select row" />
          </TableCell>
          <TableCell>web-server-01</TableCell>
          <TableCell>
            <Tag>Protected</Tag>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Checkbox aria-label="Select row" />
          </TableCell>
          <TableCell>db-primary</TableCell>
          <TableCell>
            <Tag>Protected</Tag>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

/* ── Presentation + scroll/sticky container (table-parity P1, unit F3) ─────── */

const WORKLOADS = [
  { name: 'web-server-01', plan: 'Advanced', size: '4.2 TB' },
  { name: 'db-primary', plan: 'Standard', size: '11.8 TB' },
  { name: 'file-share-eu', plan: 'Advanced', size: '2.1 TB' },
  { name: 'mail-gateway', plan: 'Essentials', size: '640 GB' },
  { name: 'build-agent-07', plan: 'Standard', size: '1.4 TB' },
  { name: 'vpn-concentrator', plan: 'Essentials', size: '210 GB' },
  { name: 'analytics-worker', plan: 'Advanced', size: '8.9 TB' },
  { name: 'backup-proxy-02', plan: 'Standard', size: '3.3 TB' },
];

function WorkloadRows({ from = 0, to = WORKLOADS.length }) {
  return WORKLOADS.slice(from, to).map((w) => (
    <TableRow key={w.name}>
      <TableCell className="font-medium">{w.name}</TableCell>
      <TableCell>{w.plan}</TableCell>
      <TableCell className="text-right">{w.size}</TableCell>
    </TableRow>
  ));
}

function WorkloadHeader() {
  return (
    <TableRow>
      <TableHead scope="col">Workload</TableHead>
      <TableHead scope="col">Plan</TableHead>
      <TableHead scope="col" className="text-right">
        Size
      </TableHead>
    </TableRow>
  );
}

// Density. The parts keep emitting the shipped `--ui-table-global-cell-*`
// metrics; `size` overrides them from the root, so a whole grid re-densifies
// from one prop.
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(['small', 'medium', 'large'] as const).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground">
            size=&quot;{size}&quot;
          </span>
          <Table size={size} className="w-[420px]">
            <TableHeader>
              <WorkloadHeader />
            </TableHeader>
            <TableBody>
              <WorkloadRows to={3} />
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  ),
};

// The four surfaces legacy `backgroundColor` normalizes onto. Each also picks
// the background a sticky/pinned cell paints — see StickyHeader below.
// Four stacked tables overflow the 720px capture viewport, cutting the `surface`
// case down to a label and a sliced header row. `fullPage` also drops the bbox clip,
// so this baseline goes 500px wide (shrink-wrapped by `layout: 'centered'`) to the
// full 1280px viewport — reframed, not merely taller (#89).
export const Backgrounds: Story = {
  parameters: { snapshot: { fullPage: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      {(['transparent', 'accent', 'subtle', 'surface'] as const).map(
        (background) => (
          <div key={background} className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground">
              background=&quot;{background}&quot;
            </span>
            <Table background={background} className="w-[420px]">
              <TableHeader>
                <WorkloadHeader />
              </TableHeader>
              <TableBody>
                <WorkloadRows to={3} />
              </TableBody>
            </Table>
          </div>
        )
      )}
    </div>
  ),
};

// Every dimension resolves on its own — enabling one never implies another.
// Only `horizontal` is on by default, which is the shipped row divider.
// Five stacked tables overflow the 720px capture viewport: `strong frame, subtle
// dividers` survives only as a label and a sliced header row, and `none` is outside
// the frame entirely, so the baseline guards 3 of the 5 border configurations it
// compares. Same reframing as `Backgrounds` — 500px wide becomes 1280px (#89).
export const Borders: Story = {
  parameters: { snapshot: { fullPage: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      {(
        [
          ['default (horizontal only)', undefined],
          [
            'all four, default strength',
            { top: true, bottom: true, horizontal: true, vertical: true },
          ],
          ['vertical only', { horizontal: false, vertical: true }],
          [
            'strong frame, subtle dividers',
            { top: 'strong', bottom: 'strong', horizontal: 'subtle' },
          ],
          ['none', { horizontal: false }],
        ] as const
      ).map(([label, borders]) => (
        <div key={label} className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground">
            {label}
          </span>
          <Table borders={borders} className="w-[420px]">
            <TableHeader>
              <WorkloadHeader />
            </TableHeader>
            <TableBody>
              <WorkloadRows to={3} />
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  ),
};

// A bounded container is what makes the header stickable — and it is the same
// precondition windowed/virtual rendering needs. `background` drives the
// surface the pinned header paints over the scrolling rows.
export const StickyHeader: Story = {
  render: () => (
    <div className="flex gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-muted-foreground">
          transparent (falls back to the page surface)
        </span>
        <Table maxHeight={200} className="w-[420px]" borders={{ bottom: true }}>
          <TableHeader sticky>
            <WorkloadHeader />
          </TableHeader>
          <TableBody>
            <WorkloadRows />
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-muted-foreground">
          background=&quot;subtle&quot;
        </span>
        <Table
          background="subtle"
          maxHeight={200}
          className="w-[420px]"
          borders={{ bottom: true }}
        >
          <TableHeader sticky>
            <WorkloadHeader />
          </TableHeader>
          <TableBody>
            <WorkloadRows />
          </TableBody>
        </Table>
      </div>
    </div>
  ),
};

// Both ends pinned at once. `border-collapse` paints row borders on the table's
// border grid, so the collapsed divider would scroll away — the sticky sections
// draw an inset hairline in the same token instead.
export const StickyHeaderAndFooter: Story = {
  render: () => (
    <Table height={240} className="w-[420px]">
      <TableHeader sticky>
        <WorkloadHeader />
      </TableHeader>
      <TableBody>
        <WorkloadRows />
      </TableBody>
      <TableFooter sticky>
        <TableRow>
          <TableCell colSpan={2}>8 workloads</TableCell>
          <TableCell className="text-right">32.5 TB</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

// Group headers pin below a sticky column header. The owner supplies the
// offset; Table holds no column model and cannot measure the header for you.
export const StickyGroupRows: Story = {
  render: () => (
    <Table maxHeight={240} background="surface" className="w-[420px]">
      <TableHeader sticky>
        <WorkloadHeader />
      </TableHeader>
      <TableBody>
        <TableRow sticky stickyOffset={40}>
          <TableCell colSpan={3} className="font-semibold">
            Advanced (3)
          </TableCell>
        </TableRow>
        <WorkloadRows to={3} />
        <TableRow sticky stickyOffset={40}>
          <TableCell colSpan={3} className="font-semibold">
            Standard (5)
          </TableCell>
        </TableRow>
        <WorkloadRows from={3} />
      </TableBody>
    </Table>
  ),
};

// `current` is the current record, `selected` is set membership: independent
// axes, so all four combinations are legal. `current` draws a layout-neutral
// leading marker rather than a border, and never emits `aria-selected`.
export const CurrentAndExpandedRows: Story = {
  render: () => (
    <Table className="w-[460px]">
      <TableHeader>
        <TableRow>
          <TableHead scope="col">Workload</TableHead>
          <TableHead scope="col">Row state</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">web-server-01</TableCell>
          <TableCell>idle</TableCell>
        </TableRow>
        <TableRow selected>
          <TableCell className="font-medium">db-primary</TableCell>
          <TableCell>selected</TableCell>
        </TableRow>
        <TableRow current>
          <TableCell className="font-medium">file-share-eu</TableCell>
          <TableCell>current</TableCell>
        </TableRow>
        <TableRow current selected>
          <TableCell className="font-medium">mail-gateway</TableCell>
          <TableCell>current + selected</TableCell>
        </TableRow>
        <TableRow expanded>
          <TableCell className="font-medium">build-agent-07</TableCell>
          <TableCell>expanded</TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={2} className="text-muted-foreground">
            Detail content for build-agent-07 — the owner renders it; Table only
            reflects <code>aria-expanded</code>.
          </TableCell>
        </TableRow>
        <TableRow expanded={false}>
          <TableCell className="font-medium">vpn-concentrator</TableCell>
          <TableCell>collapsed</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

// The pin hook: Table presents the pin, the owner decides which columns are
// pinned and supplies the accumulated offset. A pinned header cell sits one z
// step above the header cells that follow it, so it stays legible while the
// middle columns scroll under it.
export const PinnedColumns: Story = {
  render: () => (
    <Table width={520} maxHeight={220} background="surface">
      <TableHeader sticky>
        <TableRow>
          <TableHead scope="col" pinned="start" className="w-[160px]">
            Workload
          </TableHead>
          <TableHead scope="col" className="w-[160px]">
            Plan
          </TableHead>
          <TableHead scope="col" className="w-[160px]">
            Location
          </TableHead>
          <TableHead scope="col" className="w-[160px]">
            Last backup
          </TableHead>
          <TableHead scope="col" pinned="end" className="w-[120px] text-right">
            Size
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {WORKLOADS.map((w) => (
          <TableRow key={w.name}>
            <TableCell pinned="start" className="font-medium">
              {w.name}
            </TableCell>
            <TableCell>{w.plan}</TableCell>
            <TableCell>eu-central-1</TableCell>
            <TableCell>26 Jan, 2026</TableCell>
            <TableCell pinned="end" className="text-right">
              {w.size}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

// `trailing` puts a control in the header cell *outside* the sort button. Passing
// one as `children` would nest it inside that button, where a pointer release
// fires the sort and the button's accessible name absorbs the control's label —
// and a records grid is normally sortable and resizable at once. The resize grip
// below is the shape U3's column resizing mounts through.
export const HeaderTrailingControl: Story = {
  render: () => (
    <Table className="w-[460px]">
      <TableHeader>
        <TableRow>
          {(['Workload', 'Plan', 'Size'] as const).map((label) => (
            <TableHead
              key={label}
              scope="col"
              sortable
              sortDirection={label === 'Workload' ? 'asc' : false}
              className={label === 'Size' ? 'relative text-right' : 'relative'}
              trailing={
                <button
                  type="button"
                  aria-label={`Resize ${label} column`}
                  className="absolute inset-y-1 end-0 w-1 cursor-col-resize rounded-full bg-[var(--ui-border-on-surface-border)] hover:bg-[var(--ui-border-on-surface-border-active)] focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)] focus-visible:outline-none"
                />
              }
            >
              {label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <WorkloadRows to={3} />
      </TableBody>
    </Table>
  ),
};

/* ── Bounded containers whose content actually overflows (#76) ─────────────── */

// **The stories that were missing, and their absence is why a real defect
// shipped.** Every bounded story above holds eight rows in a 200–240px box, so
// none of them overflows — and a story that cannot exhibit a failure certifies
// its absence. `maxHeight` alone left the scrolling element unbounded: the
// container clipped at its bound and `scrollTop` never left zero, with
// `data-bounded="true"` reading correctly throughout.
//
// Both members get a story, because the two are not interchangeable here and the
// original measurement that said they were was taken with `height` only.
//
// **`BoundedByHeightOverflowing` and `BoundedByMaxHeightOverflowing` must be
// pixel-identical to each other.** They differ only in which prop expresses the
// bound, so the pair is a *positive* demonstration that `maxHeight` bounds exactly
// as `height` does — rather than the usual "did anything unexpected move", which
// can never show a feature works. Keep them identical in every other respect.
//
// These headers briefly carried per-story probe tokens, so a browser measurement
// could prove which story it had read. `__STORYBOOK_PREVIEW__.currentRender.id`
// does that directly and paints nothing, so the tokens are gone: scaffolding in
// rendered text would have been baked into every baseline, and it was what made
// the two stories above non-comparable.

const OVERFLOW_ROWS = Array.from({ length: 60 }, (_, index) => ({
  name: `workload-${String(index).padStart(3, '0')}`,
  plan: index % 3 === 0 ? 'Advanced' : 'Standard',
  size: `${(index % 9) + 1}.${index % 10} TB`,
}));

function OverflowRows() {
  return OVERFLOW_ROWS.map((row) => (
    <TableRow key={row.name}>
      <TableCell className="font-medium">{row.name}</TableCell>
      <TableCell>{row.plan}</TableCell>
      <TableCell className="text-right">{row.size}</TableCell>
    </TableRow>
  ));
}

function OverflowHeader() {
  return (
    <TableRow>
      <TableHead scope="col">Workload</TableHead>
      <TableHead scope="col">Plan</TableHead>
      <TableHead scope="col" className="text-right">
        Size
      </TableHead>
    </TableRow>
  );
}

/** 60 rows in a 320px box, bounded by `height`. Scrolls. */
export const BoundedByHeightOverflowing: Story = {
  render: () => (
    <Table height={320} className="w-[420px]" background="surface">
      <TableHeader sticky>
        <OverflowHeader />
      </TableHeader>
      <TableBody>
        <OverflowRows />
      </TableBody>
    </Table>
  ),
};

/**
 * The same 60 rows bounded by `maxHeight` instead. This is the case that used to
 * clip rather than scroll — the box stopped at 320px while the scrolling element
 * grew to its content.
 */
export const BoundedByMaxHeightOverflowing: Story = {
  render: () => (
    <Table maxHeight={320} className="w-[420px]" background="surface">
      <TableHeader sticky>
        <OverflowHeader />
      </TableHeader>
      <TableBody>
        <OverflowRows />
      </TableBody>
    </Table>
  ),
};

/**
 * `maxHeight` with pinned columns and a sticky header, overflowing on **both**
 * axes — the interaction that has to survive wherever the height constraint
 * lands, since sticky resolves against the scrolling element.
 */
export const BoundedByMaxHeightBothAxes: Story = {
  render: () => (
    // `min-w` on the `<table>` is what makes the horizontal axis real: without it
    // the table shrinks to the container and `scrollWidth === clientWidth`, so a
    // story that looks like it tests two axes tests one. Measured before trusting
    // it — the first version of this story had exactly that hole.
    <Table
      width={420}
      maxHeight={320}
      background="surface"
      className="min-w-[900px]"
    >
      <TableHeader sticky>
        <TableRow>
          <TableHead scope="col" pinned="start" className="w-[200px]">
            Workload
          </TableHead>
          <TableHead scope="col" className="w-[200px]">
            Plan
          </TableHead>
          <TableHead scope="col" className="w-[200px]">
            Location
          </TableHead>
          <TableHead scope="col" pinned="end" className="w-[140px] text-right">
            Size
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {OVERFLOW_ROWS.map((row) => (
          <TableRow key={row.name}>
            <TableCell pinned="start" className="font-medium">
              {row.name}
            </TableCell>
            <TableCell>{row.plan}</TableCell>
            <TableCell>eu-central-1</TableCell>
            <TableCell pinned="end" className="text-right">
              {row.size}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/**
 * A sticky **footer** at a bound that actually scrolls, with a sticky header
 * above it. Both existing sticky-footer stories hold eight rows in a 240px box,
 * so neither has ever had content to scroll — the same hole that hid the bound
 * defect, one section down.
 */
export const StickyFooterOverflowing: Story = {
  render: () => (
    <Table maxHeight={320} className="w-[420px]" background="surface">
      <TableHeader sticky>
        <OverflowHeader />
      </TableHeader>
      <TableBody>
        <OverflowRows />
      </TableBody>
      <TableFooter sticky>
        <TableRow>
          <TableCell className="font-medium">Total</TableCell>
          <TableCell>{OVERFLOW_ROWS.length} workloads</TableCell>
          <TableCell className="text-right">271.0 TB</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

/**
 * Sticky **group rows** below a sticky header, at a bound that scrolls. The group
 * row's `stickyOffset` is the header's height, so it pins under rather than over
 * it — which only means anything once there is enough content for a second group
 * to arrive while the first is still pinned.
 */
export const StickyGroupRowsOverflowing: Story = {
  render: () => (
    <Table maxHeight={320} className="w-[420px]" background="surface">
      <TableHeader sticky>
        <OverflowHeader />
      </TableHeader>
      <TableBody>
        {['Advanced', 'Standard'].map((plan) => (
          <Fragment key={plan}>
            <TableRow sticky stickyOffset={40}>
              <TableCell colSpan={3} className="font-semibold">
                {plan}
              </TableCell>
            </TableRow>
            {OVERFLOW_ROWS.filter((row) => row.plan === plan).map((row) => (
              <TableRow key={row.name}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>{row.plan}</TableCell>
                <TableCell className="text-right">{row.size}</TableCell>
              </TableRow>
            ))}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ColumnDef } from '@tanstack/react-table';

import { DataGrid } from '../data-grid';

// #90. **`appearance.width` was exercised by exactly ONE story in the whole
// package**, and that is how it shipped broken: the bordered box was a wrapper
// `<div>` that took no width while `width` landed on the scroll container inside
// it, so the border drew at full width around a narrow scroll region. Nobody saw
// it because the only story that could show it had never been captured before.
//
// So this file exists to make the prop *visible*, on the narrow-and-bordered
// combination that failed, without virtualization or dynamic row heights in the
// frame to confuse a reviewer about which thing moved.
//
// `layout: 'centered'` rather than the DataGrid convention of `'padded'`, and that
// is deliberate: under `'padded'` the visual runner's clip is
// `#storybook-root`'s box, which is a full-width block, so **the captured image is
// 1280px wide no matter how wide the grid is** and a width regression is invisible
// in the baseline. Centred, the root shrink-wraps and the clip becomes
// `content + 80` — so the width is legible in the PNG's own dimensions. That
// identity was verified against two `ui-table--*` baselines (600 = 520 + 80,
// 500 = 420 + 80) and *falsified* for padded stories; see F17-P5 in
// `.ai/team/table-parity-p1/integration/F3-baseline-predictions.md`.

interface Server {
  readonly id: string;
  readonly host: string;
  readonly region: string;
  readonly status: string;
}

const columns: ColumnDef<Server>[] = [
  { accessorKey: 'host', header: 'Host' },
  { accessorKey: 'region', header: 'Region' },
  { accessorKey: 'status', header: 'Status' },
];

const servers: Server[] = [
  { id: '1', host: 'api-01', region: 'eu-central-1', status: 'Healthy' },
  { id: '2', host: 'api-02', region: 'eu-west-1', status: 'Degraded' },
  { id: '3', host: 'edge-01', region: 'us-east-1', status: 'Healthy' },
];

const meta = {
  title: 'Components/DataGrid/Appearance width',
  component: DataGrid,
  parameters: { layout: 'centered' },
  args: {
    columns: columns as ColumnDef<unknown, unknown>[],
    rows: servers,
    getRowId: (row: unknown) => (row as Server).id,
  },
  argTypes: { columns: { control: false }, rows: { control: false } },
} satisfies Meta<typeof DataGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * `appearance.width` bounds the scroll container, and **the border is drawn on that
 * same element** — so a narrower grid has a narrower box, not a full-width box with
 * empty space in it.
 *
 * The width *includes* the border, because the container is `box-sizing:
 * border-box`: `width: 420` is a 420px box holding 418px of content.
 */
export const Bounded: Story = { args: { appearance: { width: 420 } } };

/**
 * The same width with vertical cell dividers, so the container's own border and the
 * cell borders are in frame together. They have to agree about where the region
 * ends, and while the width and the border sat on different elements they did not.
 */
export const BoundedAndBordered: Story = {
  args: { appearance: { width: 420, borders: { vertical: true } } },
};

/**
 * Narrow enough that the columns cannot fit, so the container scrolls
 * horizontally. **The scrollbar sits flush inside the border** — measured at a 0px
 * gap. Before #90 it ended 592px short of the border, because the two were
 * different elements.
 */
export const BoundedAndScrolling: Story = {
  args: { appearance: { width: 260 } },
};

/**
 * The negative control, and the reason it is a story rather than a comment: with no
 * `appearance.width` the grid fills its parent exactly as it always did. This is
 * the case that must stay pixel-identical, since collapsing the wrapper could have
 * changed the unconstrained layout too — measured, it does not.
 */
export const UnboundedForComparison: Story = { args: {} };

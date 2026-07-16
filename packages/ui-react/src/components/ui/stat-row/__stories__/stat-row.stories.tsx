import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CircleCheckIcon,
  CircleClockIcon,
  CircleInfoIcon,
} from '@constructor-lab/icons-react/stroke-mono';

import { StatRow, type StatRowStat } from '../stat-row';

const STATS: StatRowStat[] = [
  {
    label: 'Protected',
    value: '982',
    icon: (
      <CircleCheckIcon style={{ color: 'var(--ui-glyph-on-status-success)' }} />
    ),
    onClick: () => {},
  },
  {
    label: 'At risk',
    value: '17',
    icon: (
      <CircleInfoIcon style={{ color: 'var(--ui-glyph-on-status-warning)' }} />
    ),
    onClick: () => {},
  },
  {
    label: 'Last scan',
    value: '2h ago',
    icon: (
      <CircleClockIcon style={{ color: 'var(--ui-glyph-on-status-neutral)' }} />
    ),
  },
  { label: 'Quarantined', value: '3' },
  { label: 'Pending review', empty: true },
];

const meta = {
  title: 'Components/StatRow',
  component: StatRow,
  parameters: { layout: 'padded' },
  args: { stats: STATS },
  argTypes: {
    stats: { control: false, table: { category: 'Data' } },
    columns: {
      control: { type: 'number', min: 1 },
      description:
        'Equal-width columns (grid). Omit for a wrapping row of fixed-width cards.',
      table: { category: 'Layout' },
    },
  },
} satisfies Meta<typeof StatRow>;
export default meta;
type Story = StoryObj<typeof meta>;

// A wrapping row of fixed-width tiles: clickable filters, static tiles, and an
// empty placeholder — with status icons.
export const Default: Story = {};

// Equal-width columns via the `columns` grid.
export const Columns: Story = { args: { columns: 4 } };

// Plain KPI tiles — static, no icons.
export const Plain: Story = {
  args: {
    columns: undefined,
    stats: [
      { label: 'Devices', value: '1,284' },
      { label: 'Alerts', value: '42' },
      { label: 'Policies', value: '9' },
      { label: 'Uptime', value: '99.98%' },
    ],
  },
};

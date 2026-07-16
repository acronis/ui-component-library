import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CircleCheckIcon,
  CircleClockIcon,
  CircleInfoIcon,
} from '@constructor-lab/icons-react/stroke-mono';

import { Link } from '../../link';
import { DetailList, type DetailListItem } from '../detail-list';

const ITEMS: DetailListItem[] = [
  {
    label: 'Status',
    value: 'Operational',
    icon: (
      <CircleCheckIcon style={{ color: 'var(--ui-glyph-on-status-success)' }} />
    ),
    description: 'All checks passing.',
  },
  {
    label: 'Owner',
    value: 'Ada Lovelace',
    description: 'ada@example.com',
  },
  { label: 'Region', value: 'EU (Frankfurt)' },
  {
    label: 'Plan',
    value: 'Business',
    icon: (
      <CircleInfoIcon style={{ color: 'var(--ui-glyph-on-status-info)' }} />
    ),
    description: 'Renews on 1 Aug 2026.',
    actions: <Link href="#billing">Manage billing</Link>,
  },
  {
    label: 'Last backup',
    value: '2 hours ago',
    icon: (
      <CircleClockIcon style={{ color: 'var(--ui-glyph-on-status-neutral)' }} />
    ),
    actions: (
      <>
        <Link href="#run">Run now</Link>
        <Link href="#history">History</Link>
      </>
    ),
  },
];

const meta = {
  title: 'Components/DetailList',
  component: DetailList,
  parameters: { layout: 'padded' },
  args: { items: ITEMS },
  argTypes: {
    items: { control: false, table: { category: 'Data' } },
    columns: {
      control: 'inline-radio',
      options: [1, 2],
      description: 'Column count (2 collapses to 1 on narrow widths).',
      table: { category: 'Layout' },
    },
    labelWidth: {
      control: 'text',
      description: 'Width of the label column (CSS length).',
      table: { category: 'Layout' },
    },
  },
} satisfies Meta<typeof DetailList>;
export default meta;
type Story = StoryObj<typeof meta>;

// Single-column key/value list with status icons, descriptions, and actions.
export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 520 }}>
      <DetailList {...args} />
    </div>
  ),
};

// Responsive two-column detail grid.
export const TwoColumn: Story = {
  render: (args) => (
    <div style={{ maxWidth: 720 }}>
      <DetailList {...args} columns={2} />
    </div>
  ),
};

// A compact list of plain properties (no icons / descriptions).
export const Plain: Story = {
  render: () => (
    <div style={{ maxWidth: 520 }}>
      <DetailList
        items={[
          { label: 'Name', value: 'acme-prod-01' },
          { label: 'Type', value: 'Virtual machine' },
          { label: 'Created', value: '12 Jun 2026' },
          { label: 'ID', value: 'i-0a1b2c3d4e5f' },
        ]}
      />
    </div>
  ),
};

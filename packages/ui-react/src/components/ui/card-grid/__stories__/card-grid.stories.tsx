import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../button';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../card';
import { Tag } from '../../tag';
import { CardGrid } from '../card-grid';

type Integration = {
  id: string;
  name: string;
  summary: string;
  status: 'Connected' | 'Available';
};

const ITEMS: Integration[] = [
  {
    id: 'slack',
    name: 'Slack',
    summary: 'Send alerts to channels.',
    status: 'Connected',
  },
  {
    id: 'github',
    name: 'GitHub',
    summary: 'Sync issues and PRs.',
    status: 'Connected',
  },
  {
    id: 'jira',
    name: 'Jira',
    summary: 'Create tickets from findings.',
    status: 'Available',
  },
  {
    id: 'pagerduty',
    name: 'PagerDuty',
    summary: 'Page on-call for incidents.',
    status: 'Available',
  },
  {
    id: 'datadog',
    name: 'Datadog',
    summary: 'Stream metrics and logs.',
    status: 'Available',
  },
  {
    id: 'okta',
    name: 'Okta',
    summary: 'Provision users via SCIM.',
    status: 'Connected',
  },
];

const renderItem = (item: Integration) => (
  <>
    <CardHeader>
      <CardTitle>{item.name}</CardTitle>
      <CardDescription>{item.summary}</CardDescription>
    </CardHeader>
    <CardContent>
      <Tag>{item.status}</Tag>
    </CardContent>
    <CardFooter>
      <Button variant="secondary">
        {item.status === 'Connected' ? 'Configure' : 'Connect'}
      </Button>
    </CardFooter>
  </>
);

const meta = {
  title: 'Components/CardGrid',
  component: CardGrid,
  parameters: { layout: 'padded' },
  args: { items: ITEMS, renderItem, getKey: (i: Integration) => i.id },
  argTypes: {
    items: { control: false, table: { category: 'Data' } },
    renderItem: { control: false, table: { category: 'Data' } },
    getKey: { control: false, table: { category: 'Data' } },
    cols: {
      control: 'inline-radio',
      options: [1, 2, 3, 4],
      description:
        'Responsive column count (ignored when minColumnWidth is set).',
      table: { category: 'Layout' },
    },
    gap: {
      control: 'inline-radio',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      table: { category: 'Layout' },
    },
    minColumnWidth: {
      control: 'text',
      description: 'Auto-fill columns at least this wide (overrides cols).',
      table: { category: 'Layout' },
    },
  },
} satisfies Meta<typeof CardGrid<Integration>>;
export default meta;
type Story = StoryObj<typeof meta>;

// A responsive 3-column grid of uniform cards (header + status + action).
export const Default: Story = {};

// Two columns.
export const TwoColumns: Story = { args: { cols: 2 } };

// Auto-filling track sized by a minimum column width.
export const AutoFill: Story = { args: { minColumnWidth: '16rem' } };

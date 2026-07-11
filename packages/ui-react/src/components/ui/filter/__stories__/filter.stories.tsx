import type { Meta, StoryObj } from '@storybook/react-vite';

import { Filter } from '../filter';

const meta = {
  title: 'UI/Filter',
  component: Filter,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost'],
      table: {
        type: { summary: "'default' | 'outline' | 'ghost'" },
        defaultValue: { summary: 'ghost' },
      },
    },
    count: {
      control: 'number',
      description: 'Shows a count badge instead of the filter icon when > 0.',
    },
    active: {
      control: 'boolean',
    },
    children: {
      control: 'text',
      description: 'Label. Defaults to "Filter".',
    },
  },
  args: {
    variant: 'ghost',
  },
} satisfies Meta<typeof Filter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithCount: Story = {
  args: { count: 3, children: 'Status' },
};

export const NoCount: Story = {
  args: { count: 0, children: 'Status' },
};

export const Active: Story = {
  args: { active: true, count: 2, children: 'Status' },
};

export const Outline: Story = {
  args: { variant: 'outline' },
};

export const DefaultVariant: Story = {
  args: { variant: 'default' },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Filter variant="ghost">Filter</Filter>
      <Filter variant="outline">Filter</Filter>
      <Filter variant="default">Filter</Filter>
      <Filter variant="ghost" count={3}>
        Status
      </Filter>
    </div>
  ),
};

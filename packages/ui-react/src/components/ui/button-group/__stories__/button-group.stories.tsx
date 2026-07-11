import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@spec-lab/icons-react/stroke-mono';

import { Button } from '../../button';
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from '../button-group';

const meta = {
  title: 'UI/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  args: { orientation: 'horizontal' },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description:
        'Layout axis. `horizontal` collapses left radii/borders of adjacent children; `vertical` stacks them and collapses top radii/borders.',
      table: {
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: 'horizontal' },
        category: 'Appearance',
      },
    },
    children: {
      control: false,
      description:
        'The grouped controls (Buttons, ButtonGroupText, ButtonGroupSeparator).',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    className: {
      control: false,
      description: 'Additional classes merged onto the group root.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="secondary">Day</Button>
      <Button variant="secondary">Week</Button>
      <Button variant="secondary">Month</Button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="secondary">Top</Button>
      <Button variant="secondary">Middle</Button>
      <Button variant="secondary">Bottom</Button>
    </ButtonGroup>
  ),
};

export const IconButtons: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="secondary" aria-label="First page">
        <ChevronFirstIcon />
      </Button>
      <Button variant="secondary" aria-label="Previous page">
        <ChevronLeftIcon />
      </Button>
      <Button variant="secondary" aria-label="Next page">
        <ChevronRightIcon />
      </Button>
      <Button variant="secondary" aria-label="Last page">
        <ChevronLastIcon />
      </Button>
    </ButtonGroup>
  ),
};

export const WithTextAddon: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupText>https://</ButtonGroupText>
      <Button variant="secondary">example.com</Button>
    </ButtonGroup>
  ),
};

export const WithSeparator: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="secondary">Copy</Button>
      <ButtonGroupSeparator />
      <Button variant="secondary">Paste</Button>
    </ButtonGroup>
  ),
};

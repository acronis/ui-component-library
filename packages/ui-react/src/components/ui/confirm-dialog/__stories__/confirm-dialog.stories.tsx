import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../button';
import { ConfirmDialog } from '../confirm-dialog';

const meta = {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  parameters: { layout: 'centered' },
  args: {
    title: 'Discard changes?',
    description: 'Your unsaved edits will be lost. This cannot be undone.',
  },
  argTypes: {
    title: { control: 'text', table: { category: 'Content' } },
    description: { control: 'text', table: { category: 'Content' } },
    confirmLabel: { control: 'text', table: { category: 'Content' } },
    cancelLabel: { control: 'text', table: { category: 'Content' } },
    destructive: {
      control: 'boolean',
      description: 'Style the confirm action as destructive.',
      table: { category: 'Appearance' },
    },
    open: { control: false, table: { category: 'State' } },
    defaultOpen: { control: 'boolean', table: { category: 'State' } },
    onOpenChange: { control: false, table: { category: 'Events' } },
    onConfirm: { control: false, table: { category: 'Events' } },
    onCancel: { control: false, table: { category: 'Events' } },
    trigger: { control: false, table: { category: 'Content' } },
    portalContainer: { control: false, table: { category: 'Behavior' } },
  },
} satisfies Meta<typeof ConfirmDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

// Neutral confirmation, shown open for review.
export const Default: Story = {
  args: {
    defaultOpen: true,
    confirmLabel: 'Discard',
    cancelLabel: 'Keep editing',
  },
};

// Destructive confirmation — the confirm action is styled destructive.
export const Destructive: Story = {
  args: {
    defaultOpen: true,
    title: 'Delete project?',
    description:
      'This permanently removes the project and its data. This action cannot be undone.',
    confirmLabel: 'Delete',
    destructive: true,
  },
};

// Uncontrolled, opened from a trigger button.
export const WithTrigger: Story = {
  args: {
    title: 'Delete account?',
    description: 'This permanently deletes your account.',
    confirmLabel: 'Delete',
    destructive: true,
    trigger: <Button variant="destructive">Delete account</Button>,
  },
};

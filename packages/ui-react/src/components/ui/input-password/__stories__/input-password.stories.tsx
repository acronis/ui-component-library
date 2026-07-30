import type { Meta, StoryObj } from '@storybook/react-vite';

import { InputPassword } from '../input-password';

const meta = {
  title: 'UI/InputPassword',
  component: InputPassword,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Field label rendered above the input.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder shown while the field is empty.',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    required: {
      control: 'boolean',
      description:
        'Appends a `*` to the label and sets `aria-required` on the input.',
      table: { type: { summary: 'boolean' }, category: 'Content' },
    },
    description: {
      control: 'text',
      description: 'Helper text below the input. Hidden while `error` is set.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    error: {
      control: 'text',
      description:
        'Error message below the input. Its presence switches the whole field — box border, reveal icon, message — to the error treatment.',
      table: { type: { summary: 'ReactNode' }, category: 'State' },
    },
    revealed: {
      control: 'boolean',
      description:
        'Controlled reveal state. Leave undefined to let the component own it.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    defaultRevealed: {
      control: 'boolean',
      description: 'Initial reveal state when uncontrolled.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input and its reveal toggle.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    onRevealedChange: {
      control: false,
      description: 'Called with the next reveal state when the eye is pressed.',
      table: {
        type: { summary: '(revealed: boolean) => void' },
        category: 'Events',
      },
    },
  },
  args: {
    label: 'Label',
    placeholder: 'Password',
  },
} satisfies Meta<typeof InputPassword>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: 'correct horse battery' },
};

export const Revealed: Story = {
  args: { defaultValue: 'correct horse battery', defaultRevealed: true },
};

export const Required: Story = {
  args: { required: true },
};

export const WithDescription: Story = {
  args: { description: 'At least 8 characters.' },
};

export const WithError: Story = {
  args: {
    defaultValue: 'short',
    error: 'Error message',
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

// The full Figma matrix: variant (normal / error) × content (placeholder / value),
// in both password states.
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex gap-6">
        <InputPassword label="Label" placeholder="Password" />
        <InputPassword label="Label" defaultValue="correct horse battery" />
      </div>
      <div className="flex gap-6">
        <InputPassword label="Label" placeholder="Password" defaultRevealed />
        <InputPassword
          label="Label"
          defaultValue="correct horse battery"
          defaultRevealed
        />
      </div>
      <div className="flex gap-6">
        <InputPassword
          label="Label"
          placeholder="Password"
          error="Error message"
        />
        <InputPassword
          label="Label"
          defaultValue="short"
          error="Error message"
        />
      </div>
      <div className="flex gap-6">
        <InputPassword label="Label" placeholder="Password" disabled />
        <InputPassword
          label="Label"
          defaultValue="correct horse battery"
          disabled
        />
      </div>
    </div>
  ),
};

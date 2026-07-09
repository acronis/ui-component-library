import type { Meta, StoryObj } from '@storybook/react-vite';

import { OTPField, OTPFieldInput, OTPFieldSeparator } from '../otp-field';

const meta = {
  title: 'UI/OTPField',
  component: OTPField,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof OTPField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { length: 6 },
  render: (args) => (
    <OTPField {...args}>
      {Array.from({ length: args.length }).map((_, i) => (
        <OTPFieldInput key={i} />
      ))}
    </OTPField>
  ),
};

export const WithSeparator: Story = {
  args: { length: 6 },
  render: () => (
    <OTPField length={6}>
      <OTPFieldInput />
      <OTPFieldInput />
      <OTPFieldInput />
      <OTPFieldSeparator />
      <OTPFieldInput />
      <OTPFieldInput />
      <OTPFieldInput />
    </OTPField>
  ),
};

export const Masked: Story = {
  args: { length: 4 },
  render: () => (
    <OTPField length={4} mask defaultValue="1234">
      {Array.from({ length: 4 }).map((_, i) => (
        <OTPFieldInput key={i} />
      ))}
    </OTPField>
  ),
};

export const Disabled: Story = {
  args: { length: 4 },
  render: () => (
    <OTPField length={4} disabled defaultValue="12">
      {Array.from({ length: 4 }).map((_, i) => (
        <OTPFieldInput key={i} />
      ))}
    </OTPField>
  ),
};

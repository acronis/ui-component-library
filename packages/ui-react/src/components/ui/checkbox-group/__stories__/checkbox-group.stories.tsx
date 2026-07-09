import type { Meta, StoryObj } from '@storybook/react-vite';

import { CheckboxGroup } from '../checkbox-group';
import { Checkbox } from '../../checkbox';

const meta = {
  title: 'UI/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <CheckboxGroup defaultValue={['email']}>
      <Checkbox name="email" label="Email" />
      <Checkbox name="sms" label="SMS" />
      <Checkbox name="push" label="Push notifications" />
    </CheckboxGroup>
  ),
};

export const WithDescriptions: Story = {
  render: () => (
    <CheckboxGroup defaultValue={['product']}>
      <Checkbox
        name="product"
        label="Product updates"
        description="News about features and improvements."
      />
      <Checkbox
        name="security"
        label="Security alerts"
        description="Important notices about your account."
      />
      <Checkbox
        name="marketing"
        label="Marketing"
        description="Tips, offers, and announcements."
      />
    </CheckboxGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <CheckboxGroup defaultValue={['email']} disabled>
      <Checkbox name="email" label="Email" />
      <Checkbox name="sms" label="SMS" />
      <Checkbox name="push" label="Push notifications" />
    </CheckboxGroup>
  ),
};

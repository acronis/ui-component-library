import type { Meta, StoryObj } from '@storybook/vue3';
import { ALERT_VARIANT } from '@/components/index.ts';
import AcvButton from '../button/button.vue';
import AcvAlert from './alert.vue';

type Story = StoryObj<typeof AcvAlert>;
type Args = NonNullable<Story['args']>;

export default {
  component: AcvAlert,
  title: 'Components/AcvAlert',
  tags: ['autodocs'],
  render,
  args: {
    title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit and do it.',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit and do it.',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit and do it.',
    showIcon: true,
    showClose: true
  },
} as Meta;

export const Default: Story = {};

export const NoBorder: Story = {
  args: {
    showBorder: false
  },
};

export const NoClose: Story = {
  args: {
    showClose: false
  },
};

export const NoIcon: Story = {
  args: {
    showIcon: false
  },
};

export const Info: Story = {
  args: {
    color: ALERT_VARIANT.info
  },
};

export const Success: Story = {
  args: {
    color: ALERT_VARIANT.success
  },
};

export const Warning: Story = {
  args: {
    color: ALERT_VARIANT.warning
  },
};

export const Critical: Story = {
  args: {
    color: ALERT_VARIANT.critical
  },
};

export const Danger: Story = {
  args: {
    color: ALERT_VARIANT.danger
  },
};

export const Neutral: Story = {
  args: {
    color: ALERT_VARIANT.neutral
  },
};

function render(args: Args) {
  return {
    components: { AcvAlert, AcvButton },
    setup: () => ({ args }),
    template: `
      <AcvAlert v-bind="args">
        <template v-if="args.title" #title>${args.title}</template>
        <template v-if="args.description" #description>${args.description}</template>
        <template v-if="args.icon" #icon>${args.icon}</template>
        <template v-if="args.actions" #actions>${args.actions}</template>
        <template v-if="args.right" #right>${args.right}</template>
        ${args.default ? args.default : ''}
      </AcvAlert>`,
  };
}

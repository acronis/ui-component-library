import type { Meta, StoryObj } from '@storybook/vue3';
import AcvNotification from '@/components/notification/notification.vue';

type Story = StoryObj<typeof AcvNotification>;
type Args = NonNullable<Story['args']>;

export default {
  component: AcvNotification,
  title: 'Components/Notification',
  tags: ['autodocs'],
  args: {
    message: 'test message'
  },
  render
} as Meta;

function render(args: Args) {
  return {
    components: { AcvNotification },
    setup: () => ({ args }),
    template: `
      <AcvNotification v-bind="args"></AcvNotification>`,
  };
}

export const Default: Story = {};

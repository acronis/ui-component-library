import { IconPlus16 } from '@acronis-platform/icons/plus';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import AcvPagination from './AcvPagination.vue';

type Story = StoryObj<typeof AcvPagination>;
type Args = NonNullable<Story['args']>;

export default {
  component: AcvPagination,
  title: 'Components/AcvPagination',
  tags: ['autodocs'],
  render,
  args: {
    modelValue: ref(2),
    total: 7,
    limit: 1,
  },
} as Meta;

export const Default: Story = {};

function render(args: Args) {
  return {
    components: { AcvPagination, IconPlus16 },
    setup: () => ({ args }),
    template: `
      <AcvPagination v-bind="args"></AcvPagination>`,
  };
}

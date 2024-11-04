import type { Meta, StoryObj } from '@storybook/vue3';
import AcvStepperItem from './stepperItem.vue';

type Story = StoryObj<typeof AcvStepperItem>;
type Args = NonNullable<Story['args']>;

export default {
  component: AcvStepperItem,
  title: 'Components/AcvStepperItem',
  tags: ['autodocs'],
  argTypes: {
    selected: {
      control: {
        type: 'boolean',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    selected: false,
    disabled: false,
  },
  render,
} as Meta;

export const Default: Story = {};

function render(args: Args) {
  return {
    components: { AcvStepperItem },
    setup: () => ({ args }),
    template: `
      <AcvStepperItem v-bind="args">
        1. Menu item
      </AcvStepperItem>`,
  };
}

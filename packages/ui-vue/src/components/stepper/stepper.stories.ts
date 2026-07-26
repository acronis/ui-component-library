import type { Meta, StoryObj } from '@storybook/vue3';
import AcvStepperItem from '../stepper-item/stepperItem.vue';
import AcvStepper from './stepper.vue';

type Story = StoryObj<typeof AcvStepper>;
type Args = NonNullable<Story['args']>;

export default {
  component: AcvStepper,
  title: 'Components/AcvStepper',
  tags: ['autodocs'],
  render,
  args: {},
} as Meta;

export const Default: Story = {};

function render(args: Args) {
  return {
    components: { AcvStepper, AcvStepperItem },
    setup: () => ({ args }),
    template: `
      <AcvStepper v-bind="args">
        <AcvStepperItem>
          1. Menu item
        </AcvStepperItem>
        <AcvStepperItem>
          2. Menu item
        </AcvStepperItem>
        <AcvStepperItem>
          3. Menu item
        </AcvStepperItem>
      </AcvStepper>`,
  };
}

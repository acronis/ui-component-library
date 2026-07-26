import type { Meta, StoryObj } from '@storybook/vue3';
import AcvDivider from './divider.vue';

type Story = StoryObj<typeof AcvDivider>;
type Args = NonNullable<Story['args']>;

export default {
  component: AcvDivider,
  title: 'Components/AcvDivider',
  tags: ['autodocs'],
  render,
  argTypes: {
    textPosition: {
      control: {
        type: 'select',
      },
      options: ['center', 'left', 'right'] satisfies Args['textPosition'][],
    },
    color: {
      control: {
        type: 'select',
      },
      options: ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger', 'info'] satisfies Args['color'][],
    },
  }
} as Meta;

export const Default: Story = {};

export const Vertical: Story = {
  args: {
    vertical: true
  },
};

export const WithSlot: Story = {
  args: {
    default: 'I\'m Divider'
  },
};

export const Secondary: Story = {
  args: {
    color: 'secondary'
  },
};

export const Success: Story = {
  args: {
    color: 'success'
  },
};

function render(args: Args) {
  return {
    components: { AcvDivider },
    setup: () => ({ args }),
    template: `
      <div style="width: var(--acv-size-relative-30);height: var(--acv-size-relative-30);display:inline-grid;place-items: center">
        <AcvDivider v-bind="args">
          ${args.default ? args.default : ''}
        </AcvDivider>
      </div>`,
  };
}

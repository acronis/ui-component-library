import type { Meta, StoryObj } from '@storybook/vue3';
import AcvScrollbar from './scrollbar.vue';

type Story = StoryObj<typeof AcvScrollbar>;
type Args = NonNullable<Story['args']>;

export default {
  component: AcvScrollbar,
  title: 'Components/AcvScrollbar',
  tags: ['autodocs'],
  render,
} as Meta;

export const Default: Story = {};

export const Dark: Story = {
  parameters: {
    cssUserPrefs: {
      'prefers-color-scheme': 'dark',
    },
  }
};

function render(args: Args) {
  return {
    components: { AcvScrollbar },
    setup: () => ({ args }),
    template: `
      <AcvScrollbar v-bind="args" style="width:300px;height:300px;">
        <div style="width:600px;height:600px;background-color: white" />
      </AcvScrollbar>`,
  };
}

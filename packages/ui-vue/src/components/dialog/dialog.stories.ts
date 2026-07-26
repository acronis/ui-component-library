import type { Meta, StoryObj } from '@storybook/vue3';
import AcvButton from '../button/button.vue';
import AcvDialog from './dialog.vue';

type Story = StoryObj<typeof AcvDialog>;
type Args = NonNullable<Story['args']>;

export default {
  component: AcvDialog,
  title: 'Components/AcvDialog',
  tags: ['autodocs'],
  render,
  argTypes: {
    width: {
      control: {
        type: 'select',
      },
      options: ['small', 'medium', 'large', 'x-large'] satisfies Args['width'][],
    },
    height: {
      control: {
        type: 'select',
      },
      options: ['auto', 'fit', 'small', 'medium', 'large'] satisfies Args['height'][],
    },
  },
  args: {
    title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit and do it.'
  },
} as Meta;

export const Default: Story = {};

export const Draggable: Story = {
  args: {
    draggable: true
  },
};

function render(args: Args) {
  return {
    components: { AcvDialog, AcvButton },
    setup: () => ({ args }),
    template: `
      <AcvButton @click="args.dialogBasicVisible = true">
        Show Dialog
      </AcvButton>
      <AcvDialog v-bind="args"
                 v-model="args.dialogBasicVisible">
        <template v-if="args.footer" #footer>${args.footer}</template>
        <template v-if="args['footer-aside']" #footer-aside>${args['footer-aside']}</template>
        <div class="px-24 py-16">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit and do it. Autem commodi deleniti dolorem dolorum eligendi
        </div>
      </AcvDialog>`,
  };
}

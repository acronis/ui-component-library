import type { Meta, StoryObj } from '@storybook/vue3';
import { IconPlus16 } from '@acronis-platform/icons/plus';
import AcvMenuItem from '../menu-item/menuItem.vue';
import AcvMenu from './menu.vue';

type Story = StoryObj<typeof AcvMenu>;
type Args = NonNullable<Story['args']>;

export default {
  component: AcvMenu,
  title: 'Components/AcvMenu',
  tags: ['autodocs'],
  render,
  argTypes: {
    type: {
      control: {
        type: 'select',
      },
      options: ['primary', 'secondary', 'tertiary'] satisfies Args['type'][],
    },
  },
  args: {
    default: 'Text',
    disabled: false,
    loading: false,
    autofocus: false,
    icon: false,
  },
} as Meta;

export const Default: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/LTyCXsL7eUj5fHmMMGcEUj/Components-anatomy?node-id=57-137886',
    },
  },
  args: {
    type: 'primary',
    modelValue: 'first',
  }
};

export const Secondary: Story = {
  args: {
    type: 'secondary',
    modelValue: 'second',
  },
};

export const Tertiary: Story = {
  args: {
    type: 'tertiary',
    modelValue: 'third',
  },
};

function render(args: Args) {
  return {
    components: { AcvMenu, AcvMenuItem, IconPlus16 },
    setup: () => ({ args }),
    template: `
      <AcvMenu v-bind="args"
               v-model="args.modelValue">
        <template v-if="args.prepend" #prepend>${args.prepend}</template>
        <template v-if="args.append" #append>${args.append}</template>
        <AcvMenuItem index="first" v-bind="args">FIRST 1</AcvMenuItem>
        <AcvMenuItem index="second" v-bind="args">SECOND 2</AcvMenuItem>
        <AcvMenuItem index="third" v-bind="args">THIRD 3</AcvMenuItem>
      </AcvMenu>`,
  };
}

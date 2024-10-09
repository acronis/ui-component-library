import type { Meta, StoryObj } from '@storybook/vue3';
import { IconPlus16 } from '@acronis-platform/icons/plus';
import AcvButton from './button.vue';

type Story = StoryObj<typeof AcvButton>;
type Args = NonNullable<Story['args']>;

export default {
  component: AcvButton,
  title: 'Components/AcvButton',
  tags: ['autodocs'],
  render,
  argTypes: {
    type: {
      control: {
        type: 'select',
      },
      options: ['primary', 'secondary', 'ghost', 'inverted', 'danger'] satisfies Args['type'][],
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['small', 'medium', 'large'] satisfies Args['size'][],
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

export const Default: Story = {};

export const WithIcon: Story = {
  args: {
    icon: IconPlus16
  },
};
export const Danger: Story = {
  args: {
    color: 'danger'
  },
};

export const Info: Story = {
  args: {
    color: 'info'
  },
};

export const Inverted: Story = {
  args: {
    color: 'info'
  },
};

export const Primary: Story = {
  args: {
    color: 'primary'
  },
};

export const Secondary: Story = {
  args: {
    type: 'secondary'
  },
};

export const Ghost: Story = {
  args: {
    type: 'ghost'
  },
};

export const WithPrependAndAppend: Story = {
  args: {
    prepend: '<IconPlus16 />',
    append: '<IconPlus16 />'
  },
};

export const SmallSize: Story = {
  args: {
    size: 'small'
  },
};

export const LargeSize: Story = {
  args: {
    size: 'large'
  },
};

export const Pill: Story = {
  args: {
    pill: true
  },
};

export const Squared: Story = {
  args: {
    squared: true
  },
};

export const Disabled: Story = {
  args: {
    disabled: true
  },
};

export const Pressed: Story = {
  args: {
    selected: true
  },
};

export const WithSingleIcon: Story = {
  args: {
    default: '<IconPlus16 />'
  },
};

export const GhostWithSingleIcon: Story = {
  args: {
    type: 'ghost',
    default: '<IconPlus16 />'
  },
};

function render(args: Args) {
  return {
    components: { AcvButton, IconPlus16 },
    setup: () => ({ args }),
    template: `
      <AcvButton v-bind="args">
        <template v-if="args.prepend" #prepend>${args.prepend}</template>
        <template v-if="args.append" #append>${args.append}</template>
        ${args.default}
      </AcvButton>`,
  };
}

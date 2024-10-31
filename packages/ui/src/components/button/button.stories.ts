import type { Meta, StoryObj } from '@storybook/vue3';
import { BUTTON_VARIANT } from '@/components/index.ts';
import { IconPlus16 } from '@acronis-platform/icons/plus';
import { h } from 'vue';
import AcvButton from './button.vue';

type Story = StoryObj<typeof AcvButton>;
type Args = NonNullable<Story['args']>;

export default {
  component: AcvButton,
  title: 'Components/AcvButton',
  tags: ['autodocs'],
  render,
  argTypes: {
    variant: {
      control: {
        type: 'select',
      },
      options: BUTTON_VARIANT as unknown as Args['variant'],
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
  },
  /**
   * Using explicit source code parameters because looks like Storybook's docs addon can't properly
   * serialize Vue 3 render functions (h()) with imported components like icons.
   * Without this, icons can't be displayed in docs (but work fine in stories).
   */
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: `<AcvButton><IconPlus16 /></AcvButton>`
      }
    }
  }
} as Meta;

export const Default: Story = {};

export const Inverted: Story = {
  args: {
    variant: BUTTON_VARIANT.inverted
  },
};

export const Primary: Story = {
  args: {
    variant: BUTTON_VARIANT.primary
  },
};

export const Secondary: Story = {
  args: {
    variant: BUTTON_VARIANT.secondary
  },
};

export const Status: Story = {
  args: {
    variant: BUTTON_VARIANT.status
  },
};

export const Ghost: Story = {
  args: {
    variant: BUTTON_VARIANT.ghost
  },
};

export const WithPrependAndAppend: Story = {
  args: {
    prepend: h(IconPlus16),
    append: h(IconPlus16)
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
    default: h(IconPlus16)
  },
};

export const GhostWithSingleIcon: Story = {
  args: {
    variant: BUTTON_VARIANT.ghost,
    default: h(IconPlus16)
  },
};

function render(args: Args) {
  const parentStyle = args.variant === BUTTON_VARIANT.inverted
    ? { backgroundColor: '#243143e6', padding: '10px' }
    : {};

  return {
    components: { AcvButton, IconPlus16 },
    setup: () => ({ args, parentStyle }),
    template: `
      <div :style="parentStyle">
      <AcvButton v-bind="args">
        <template v-if="args.prepend" #prepend><Component :is="args.prepend" /></template>
        <template v-if="args.append" #append><Component :is="args.append" /></template>
        <Component v-if="typeof args.default === 'object'" :is="args.default" />
        <template v-else>{{ args.default }}</template>
      </AcvButton>
      </div>
    `,
  };
}

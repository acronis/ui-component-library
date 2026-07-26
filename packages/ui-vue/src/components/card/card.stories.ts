import type { Meta, StoryObj } from '@storybook/vue3';
import AcvCard from './card.vue';

type Story = StoryObj<typeof AcvCard>;
type Args = NonNullable<Story['args']>;

export default {
  component: AcvCard,
  title: 'Components/AcvCard',
  tags: ['autodocs'],
  render,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/6nFlVmwDwvGloglQHxyElh/Syntax-UI-3.0?node-id=587-56795',
    },
  },
  argTypes: {
    shadow: {
      options: ['regular', 'modal', undefined],
      control: { type: 'inline-radio' },
    },
    border: {
      options: ['secondary', 'active', undefined],
      control: { type: 'inline-radio' },
    },
  },
} as Meta<Args>;

export const Default: Story = {
  args: {
    withPadding: true,
    border: 'secondary',
    shadow: 'regular',
  },
};

export const PaddingBorderSecondary: Story = {
  args: {
    withPadding: true,
    border: 'secondary',
  },
};

export const PaddingBorderActive: Story = {
  args: {
    withPadding: true,
    border: 'active',
  },
};

export const BoxShadowRegular: Story = {
  args: {
    withPadding: true,
    border: 'secondary',
    shadow: 'regular',
  },
};

export const BoxShadowModal: Story = {
  args: {
    withPadding: true,
    border: 'secondary',
    shadow: 'modal',
  },
};

const contentTemplate = `
  <div style="
    width: 300px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--acv-color-nav-active-secondary, #E9F0F9);
  ">Content</div>
`;

function render(args: Args) {
  return {
    components: { AcvCard },
    setup: () => ({ args }),
    template: `
      <AcvCard v-bind="args">
        ${contentTemplate}
        ${args.default ? args.default : ''}
      </AcvCard>`,
  };
}

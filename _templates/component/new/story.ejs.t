---
to: "packages/ui/src/components/<%= h.changeCase.kebab(name) %>/<%= h.changeCase.camel(name) %>.stories.ts"
---
import type { Meta, StoryObj } from '@storybook/vue3';
import <%= h.changeCase.pascal(name) %> from './<%= h.changeCase.camel(name) %>.vue';

type Story = StoryObj<typeof <%= h.changeCase.pascal(name) %>>;
type Args = NonNullable<Story['args']>;

export default {
  component: <%= h.changeCase.pascal(name) %>,
  title: 'Components/<%= h.changeCase.pascal(name) %>',
  tags: ['autodocs'],
  render,
  argTypes: {
    type: {
      control: {
        type: 'select',
      },
      options: ['primary', 'secondary', 'ghost', 'inverted', 'danger'] satisfies Args['title'][],
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['small', 'medium', 'large'] satisfies Args['title'][],
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

function render(args: Args) {
  return {
    components: { <%= h.changeCase.pascal(name) %> },
    setup: () => ({ args }),
    template: `
      <<%= h.changeCase.pascal(name) %> v-bind="args">
        <template v-if="args.description" #description>${args.description}</template>
        ${args.default}
      </<%= h.changeCase.pascal(name) %>>`,
  };
}

import type { Meta, StoryObj } from '@storybook/vue3';
import { IconChevronRight16 } from '@acronis-platform/icons/chevron';
import AcvBreadcrumbItem from './breadcrumbItem.vue';
import AcvBreadcrumbs from './breadcrumbs.vue';

type Story = StoryObj<typeof AcvBreadcrumbs>;
type Args = NonNullable<Story['args']>;

export default {
  component: AcvBreadcrumbs,
  title: 'Components/AcvBreadcrumbs',
  tags: ['autodocs'],
  render,
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['md', 'lg'] satisfies Args['size'][],
    },
    separator: {
      control: { type: 'select' },
      options: ['/', '-', '>', '|', IconChevronRight16],
    },
    maxItems: {
      control: { type: 'number' },
    },
  },
  args: {
    size: 'md',
    maxItems: Infinity,
    separator: IconChevronRight16,
  },
} as Meta;

// export const Default: Story = {
//   args: {
//     items: [
//       { to: '/', text: 'Home' },
//       { to: '/about', text: 'About' },
//       { to: '/services', text: 'Services' },
//     ],
//   },
// };

// Example variant for breadcrumbs with a different separator
// export const WithCustomSeparator: Story = {
//   args: {
//     items: [
//       { to: '/', text: 'Home' },
//       { to: '/about', text: 'About' },
//       { to: '/services', text: 'Services' },
//     ],
//     separator: '/',
//   },
// };

// Example variant for breadcrumbs with a limit on visible items
// export const LimitedItems: Story = {
//   args: {
//     items: [
//       { to: '/', text: 'Home' },
//       { to: '/about', text: 'About' },
//       { to: '/services', text: 'Services' },
//       { to: '/contact', text: 'Contact' },
//     ],
//     maxItems: 3,
//   },
// };

function render(args: Args) {
  return {
    components: { AcvBreadcrumbs, AcvBreadcrumbItem, IconChevronRight16 },
    setup: () => ({ args }),
    template: `
      <AcvBreadcrumbs :max-items="args.maxItems" :separator="args.separator">
        <AcvBreadcrumbItem
          v-for="item in args.items"
          :key="item.to"
          :to="item.to"
        >
          <template v-if="item.icon" #icon>
            <component :is="item.icon" />
          </template>
          {{ item.text }}
        </AcvBreadcrumbItem>
      </AcvBreadcrumbs>`,
  };
}

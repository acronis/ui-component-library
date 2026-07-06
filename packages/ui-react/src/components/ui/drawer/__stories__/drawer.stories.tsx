import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../button';
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerCloseButton,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerSwipeArea,
  DrawerTitle,
  DrawerTrigger,
} from '../drawer';

const meta = {
  title: 'UI/Drawer',
  component: Drawer,
  // Edge-anchored panel with swipe-to-dismiss — capture the whole page so the
  // full panel + the dimmed backdrop are in frame.
  parameters: { layout: 'fullscreen', snapshot: { fullPage: true } },
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description:
        'Screen edge the panel anchors to. Maps to Base UI `swipeDirection`.',
      table: {
        type: { summary: "'top' | 'bottom' | 'left' | 'right'" },
        defaultValue: { summary: "'bottom'" },
        category: 'Layout',
      },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Open on mount, uncontrolled.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    open: {
      control: 'boolean',
      description: 'Controlled open state. Pair with `onOpenChange`.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    modal: {
      control: 'boolean',
      description:
        'Modal behavior — focus trap and scroll lock while open. Default `true`.',
      table: {
        type: { summary: "boolean | 'trap-focus'" },
        defaultValue: { summary: 'true' },
        category: 'Behavior',
      },
    },
    disablePointerDismissal: {
      control: 'boolean',
      description: 'Prevent the drawer from closing on an outside press.',
      table: { type: { summary: 'boolean' }, category: 'Behavior' },
    },
    onOpenChange: {
      control: false,
      description: 'Fires when the drawer opens or closes.',
      table: { type: { summary: '(open, eventDetails) => void' }, category: 'Events' },
    },
    children: {
      control: false,
      description:
        'Composed parts — `DrawerTrigger`, `DrawerContent` (wrapping header/body/footer parts).',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

const PanelBody = () => (
  <DrawerBody>
    <DrawerDescription>
      Review and act on the selection without leaving the page. Swipe the panel to
      dismiss it.
    </DrawerDescription>
    <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
      <dt className="text-muted-foreground">Status</dt>
      <dd className="font-medium">Protected</dd>
      <dt className="text-muted-foreground">Last backup</dt>
      <dd className="font-medium">5 minutes ago</dd>
      <dt className="text-muted-foreground">Owner</dt>
      <dd className="font-medium">ken99@example.com</dd>
    </dl>
  </DrawerBody>
);

export const Default: Story = {
  render: () => (
    <Drawer defaultOpen>
      <DrawerTrigger render={<Button variant="secondary">Open drawer</Button>} />
      <DrawerContent>
        <DrawerSwipeArea />
        <DrawerHeader>
          <DrawerTitle>Notifications</DrawerTitle>
          <DrawerCloseButton />
        </DrawerHeader>
        <PanelBody />
        <DrawerFooter>
          <DrawerClose render={<Button variant="ghost">Close</Button>} />
          <Button>Mark all read</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const Top: Story = {
  render: () => (
    <Drawer defaultOpen side="top">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Notifications</DrawerTitle>
          <DrawerCloseButton />
        </DrawerHeader>
        <PanelBody />
      </DrawerContent>
    </Drawer>
  ),
};

export const Left: Story = {
  render: () => (
    <Drawer defaultOpen side="left">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerCloseButton />
        </DrawerHeader>
        <PanelBody />
      </DrawerContent>
    </Drawer>
  ),
};

export const Right: Story = {
  render: () => (
    <Drawer defaultOpen side="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Workload details</DrawerTitle>
          <DrawerCloseButton />
        </DrawerHeader>
        <PanelBody />
      </DrawerContent>
    </Drawer>
  ),
};

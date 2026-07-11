import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '../navigation-menu';

const meta = {
  title: 'UI/NavigationMenu',
  component: NavigationMenu,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: false,
      description:
        'Uncontrolled value of the item that should be initially active (opens its content).',
      table: { type: { summary: 'unknown' }, category: 'State' },
    },
    value: {
      control: false,
      description: 'Controlled value of the currently active item.',
      table: { type: { summary: 'unknown' }, category: 'State' },
    },
    children: {
      control: false,
      description:
        'Composed parts — `NavigationMenuList` wrapping `NavigationMenuItem`s.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
  },
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem value="getting-started">
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3 p-4">
              <li>
                <NavigationMenuLink
                  href="#"
                  className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="text-sm font-medium leading-none">
                    Introduction
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Re-usable components built with Base UI and Tailwind CSS.
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink
                  href="#"
                  className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="text-sm font-medium leading-none">
                    Installation
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm leading-snug text-muted-foreground">
                    How to install dependencies and structure your app.
                  </p>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="components">
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3 p-4">
              <li>
                <NavigationMenuLink
                  href="#"
                  className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="text-sm font-medium leading-none">Button</div>
                  <p className="mt-1 line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Displays a button or a component that looks like a button.
                  </p>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

// `defaultValue` opens an item's content on mount — useful to inspect the
// floating popup/animation without a hover or click interaction.
export const OpenByDefault: Story = {
  render: () => (
    <NavigationMenu defaultValue="getting-started">
      <NavigationMenuList>
        <NavigationMenuItem value="getting-started">
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[300px] p-4 text-sm text-foreground">
              Panel content for &quot;Getting started&quot;.
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

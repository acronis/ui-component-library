import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '../navigation-menu';

function DemoMenu(props: { defaultValue?: string } = {}) {
  return (
    <NavigationMenu defaultValue={props.defaultValue}>
      <NavigationMenuList>
        <NavigationMenuItem value="item-1">
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="/docs">Documentation</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/pricing">Pricing</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

describe('NavigationMenu', () => {
  it('renders the trigger and a plain link item', () => {
    render(<DemoMenu />);
    expect(
      screen.getByRole('button', { name: 'Getting started' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Pricing' })).toBeInTheDocument();
  });

  it("keeps a trigger's content out of the DOM until activated", () => {
    render(<DemoMenu />);
    expect(
      screen.queryByRole('link', { name: 'Documentation' })
    ).not.toBeInTheDocument();
  });

  it('renders the active item content via defaultValue (uncontrolled)', () => {
    render(<DemoMenu defaultValue="item-1" />);
    expect(screen.getByRole('link', { name: 'Documentation' })).toBeInTheDocument();
  });

  it('opens the trigger content on click', async () => {
    const user = userEvent.setup();
    render(<DemoMenu />);
    await user.click(screen.getByRole('button', { name: 'Getting started' }));
    expect(
      await screen.findByRole('link', { name: 'Documentation' })
    ).toBeInTheDocument();
  });

  it('themes the trigger from the bridged semantic tokens', () => {
    render(<DemoMenu />);
    expect(screen.getByRole('button', { name: 'Getting started' })).toHaveClass(
      'bg-background'
    );
  });

  it('exposes navigationMenuTriggerStyle for styling plain links as triggers', () => {
    expect(navigationMenuTriggerStyle()).toContain('inline-flex');
  });

  it('forwards the ref to the root nav element', () => {
    const ref = createRef<HTMLElement>();
    render(
      <NavigationMenu ref={ref}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/">Home</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

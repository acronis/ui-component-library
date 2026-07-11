import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerSwipeArea,
  DrawerTitle,
  DrawerTrigger,
  type DrawerSide,
} from '../index';

// The default portal renders the popup into document.body, which Testing
// Library's `screen` queries — Base UI requires the popup to sit in a portal.
function OpenDrawer(props: { side?: DrawerSide } = {}) {
  return (
    <Drawer open side={props.side}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Notifications</DrawerTitle>
          <DrawerCloseButton />
        </DrawerHeader>
        <DrawerBody>
          <DrawerDescription>You are all caught up.</DrawerDescription>
        </DrawerBody>
        <DrawerFooter>Footer</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

describe('Drawer', () => {
  it('renders the open drawer with its title, description, and footer', () => {
    render(<OpenDrawer />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('You are all caught up.')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('defaults to the bottom side', () => {
    render(<OpenDrawer />);
    expect(screen.getByRole('dialog')).toHaveClass('w-full', 'border-t');
  });

  it('anchors to the requested side', () => {
    render(<OpenDrawer side="right" />);
    expect(screen.getByRole('dialog')).toHaveClass('h-full', 'border-l');
  });

  it('drives the panel surface from the bridged semantic tokens', () => {
    render(<OpenDrawer />);
    expect(screen.getByRole('dialog')).toHaveClass(
      'bg-muted',
      'text-foreground'
    );
  });

  it('exposes an accessible Close button', () => {
    render(<OpenDrawer />);
    const close = screen.getByRole('button', { name: 'Close' });
    expect(close).toBeInTheDocument();
    expect(close).toHaveClass('text-muted-foreground');
  });

  it('forwards the ref to the popup element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Drawer open>
        <DrawerContent ref={ref}>
          <DrawerTitle>Title</DrawerTitle>
        </DrawerContent>
      </Drawer>
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('renders the swipe-area grab handle', () => {
    render(
      <Drawer open>
        <DrawerContent>
          <DrawerSwipeArea data-testid="handle" />
          <DrawerTitle>Title</DrawerTitle>
        </DrawerContent>
      </Drawer>
    );
    expect(screen.getByTestId('handle')).toHaveClass(
      'rounded-full',
      'bg-border'
    );
  });

  it('opens from the trigger and closes via onOpenChange', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Drawer onOpenChange={onOpenChange}>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Title</DrawerTitle>
          <DrawerCloseButton />
        </DrawerContent>
      </Drawer>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });
});

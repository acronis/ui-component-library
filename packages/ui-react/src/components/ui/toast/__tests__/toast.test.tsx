import { act } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Toaster, toast } from '../toast';
import {
  Toaster as ToasterFromComponentIndex,
  toast as toastFromComponentIndex,
} from '../index';
import {
  Notification,
  notification,
  Toaster as ToasterFromRootIndex,
  toast as toastFromRootIndex,
} from '@/index';
import {
  Toaster as ToasterFromReactEntry,
  toast as toastFromReactEntry,
} from '@/react';

// The manager is module-level, so clear any leftover toasts between tests and
// wait for them to leave the DOM — otherwise a lingering toast pushes the next
// test's toast behind it, where Base UI marks it aria-hidden (invisible to
// getByRole).
afterEach(async () => {
  act(() => {
    toast.dismiss();
  });
  await waitFor(() => {
    // Anchored on a tier class the card always carries — `shadow-lg` was the old
    // anchor and matches nothing now, which made this guard silently pass
    // without ever waiting for the toast to leave.
    expect(
      document.body.querySelectorAll(
        '[class*="ui-toast-global-container-border-radius"]'
      )
    ).toHaveLength(0);
  });
});

describe('Toast', () => {
  it('keeps toast and Toaster wired through component and package exports', () => {
    expect(ToasterFromComponentIndex).toBe(Toaster);
    expect(toastFromComponentIndex).toBe(toast);
    expect(ToasterFromRootIndex).toBe(Toaster);
    expect(toastFromRootIndex).toBe(toast);
    expect(ToasterFromReactEntry).toBe(Toaster);
    expect(toastFromReactEntry).toBe(toast);
  });

  it('exposes the Notification alias (= Toaster / toast)', () => {
    expect(Notification).toBe(Toaster);
    expect(notification).toBe(toast);
  });

  it('renders no toast until one is added', () => {
    render(<Toaster />);
    expect(screen.queryByText('Nothing here')).not.toBeInTheDocument();
  });

  it('shows the title and description of an added toast', async () => {
    render(<Toaster />);
    act(() => {
      toast('Event created', { description: 'Monday at 6:00 PM' });
    });
    expect(await screen.findByText('Event created')).toBeInTheDocument();
    expect(screen.getByText('Monday at 6:00 PM')).toBeInTheDocument();
  });

  it('renders a variant toast with its status icon', async () => {
    const { container } = render(<Toaster />);
    act(() => {
      toast.success('Profile saved');
    });
    expect(await screen.findByText('Profile saved')).toBeInTheDocument();
    // the leading status icon is an svg
    expect(container.ownerDocument.querySelector('svg')).toBeTruthy();
  });

  it('binds the card and status bar to the --ui-toast-* tier', async () => {
    const { container } = render(<Toaster />);
    act(() => {
      toast.error('Delete failed');
    });
    await screen.findByText('Delete failed');
    const card = container.ownerDocument.querySelector(
      '[class*="ui-toast-global-container-border-radius"]'
    ) as HTMLElement;
    expect(card).toBeTruthy();
    // The design's card metrics come from the tier, not hardcoded utilities.
    expect(card.className).toContain(
      'bg-[var(--ui-toast-global-container-color-background)]'
    );
    expect(card.className).toContain(
      'min-w-[var(--ui-toast-global-container-width-min)]'
    );
    // `error` is the API name for the design's `danger` status.
    expect(card.className).toContain(
      'border-[var(--ui-toast-danger-border-color)]'
    );
    const bar = card.querySelector(
      '[class*="ui-toast-global-container-status-width"]'
    );
    expect(bar?.className).toContain('bg-[var(--ui-toast-danger-left-line)]');
  });

  it("renders the design's critical status with its own tokens", async () => {
    const { container } = render(<Toaster />);
    act(() => {
      toast.critical('Backup at risk');
    });
    await screen.findByText('Backup at risk');
    const card = container.ownerDocument.querySelector(
      '[class*="ui-toast-critical-border-color"]'
    );
    expect(card).toBeTruthy();
    expect(
      card?.querySelector('[class*="ui-toast-critical-left-line"]')
    ).toBeTruthy();
  });

  it('leaves a neutral toast without a status bar', async () => {
    const { container } = render(<Toaster />);
    act(() => {
      toast('Just so you know');
    });
    await screen.findByText('Just so you know');
    // `loading` and the untyped default have no design status.
    expect(
      container.ownerDocument.querySelector(
        '[class*="ui-toast-global-container-status-width"]'
      )
    ).toBeNull();
  });

  it('dismisses a toast via its close button', async () => {
    render(<Toaster />);
    act(() => {
      toast('Dismiss me');
    });
    const title = await screen.findByText('Dismiss me');
    // The visible toast's controls are aria-hidden (Base UI announces via an
    // offscreen copy), so they have no accessible name — query by attribute.
    const root = title.closest(
      '[class*="ui-toast-global-container-border-radius"]'
    ) as HTMLElement;
    const close = root.querySelector(
      'button[aria-label="Close"]'
    ) as HTMLElement;
    await userEvent.click(close);
    await waitFor(() => {
      expect(screen.queryByText('Dismiss me')).not.toBeInTheDocument();
    });
  });

  it('renders both controls as the shipped ghost components', async () => {
    render(<Toaster />);
    act(() => {
      toast.info('Event created', { action: { label: 'Undo' } });
    });
    const title = await screen.findByText('Event created');
    const root = title.closest(
      '[class*="ui-toast-global-container-border-radius"]'
    ) as HTMLElement;
    // The design makes both an instance of a shipped component, so they must wear
    // those tiers' own state tokens — not a local copy of the idle value. The
    // action previously took ButtonIcon's *icon* colour as its label colour.
    const action = within(root).getByText('Undo');
    expect(action.className).toContain(
      'text-[var(--ui-button-ghost-label-color-idle)]'
    );
    expect(action.className).toContain(
      'hover:text-[var(--ui-button-ghost-label-color-hover)]'
    );
    expect(action.className).toContain(
      'h-[var(--ui-button-global-container-height)]'
    );
    const close = root.querySelector(
      'button[aria-label="Close"]'
    ) as HTMLElement;
    expect(close.className).toContain(
      'size-[var(--ui-button-icon-global-container-height)]'
    );
    expect(close.className).toContain(
      'hover:bg-[var(--ui-button-icon-global-container-color-hover)]'
    );
  });

  it('renders an action button and invokes its handler', async () => {
    const onClick = vi.fn();
    render(<Toaster />);
    act(() => {
      toast.info('Event created', {
        action: { label: 'Undo', onClick },
      });
    });
    const title = await screen.findByText('Event created');
    const root = title.closest(
      '[class*="ui-toast-global-container-border-radius"]'
    ) as HTMLElement;
    await userEvent.click(within(root).getByText('Undo'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

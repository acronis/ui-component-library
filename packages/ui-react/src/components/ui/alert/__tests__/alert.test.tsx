import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  Alert,
  AlertClose,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '../index';

describe('Alert', () => {
  it('renders role="alert", the default info strong border, and an accent bar', () => {
    render(<Alert>Heads up</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Heads up');
    expect(alert.className).toContain(
      'border-[var(--ui-border-on-status-info-strong)]'
    );
    expect(alert.className).toContain('bg-background');
    const accent = alert.querySelector('[data-slot="alert-accent"]');
    expect(accent).not.toBeNull();
    expect(accent?.className).toContain(
      'bg-[var(--ui-background-status-strong-info)]'
    );
  });

  it('applies the destructive variant (strong danger border + accent bar)', () => {
    render(<Alert variant="destructive">Error</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert.className).toContain(
      'border-[var(--ui-border-on-status-danger-strong)]'
    );
    const accent = alert.querySelector('[data-slot="alert-accent"]');
    expect(accent?.className).toContain(
      'bg-[var(--ui-background-status-strong-danger)]'
    );
  });

  it('renders a compact dismiss button that fires onClick', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <Alert>
        <AlertContent>
          <AlertTitle>Heads up!</AlertTitle>
        </AlertContent>
        <AlertClose onClick={onDismiss} />
      </Alert>
    );
    const close = screen.getByRole('button', { name: 'Dismiss' });
    expect(close).toHaveAttribute('data-slot', 'alert-close');
    expect(close.className).toContain('size-8');
    await user.click(close);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders the variant-driven default icon and honors an override', () => {
    const { rerender } = render(
      <Alert variant="success">
        <AlertIcon />
        <AlertContent>
          <AlertTitle>Done</AlertTitle>
        </AlertContent>
      </Alert>
    );
    const iconSlot = document.querySelector('[data-slot="alert-icon"]');
    expect(iconSlot?.querySelector('svg')).not.toBeNull();

    rerender(
      <Alert variant="success">
        <AlertIcon>
          <svg data-testid="custom-icon" />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>Done</AlertTitle>
        </AlertContent>
      </Alert>
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders title (h5) and description', () => {
    render(
      <Alert>
        <AlertIcon />
        <AlertContent>
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>You can add components.</AlertDescription>
        </AlertContent>
      </Alert>
    );
    expect(screen.getByText('Heads up!').tagName).toBe('H5');
    expect(screen.getByText('You can add components.')).toBeInTheDocument();
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Alert ref={ref}>x</Alert>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

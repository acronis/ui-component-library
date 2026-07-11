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
  it('renders with role="alert" and the default info variant', () => {
    render(<Alert>Heads up</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Heads up');
    expect(alert.className).toContain('bg-[var(--ui-background-status-info)]');
  });

  it('applies the destructive variant (danger surface + border tokens)', () => {
    render(<Alert variant="destructive">Error</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert.className).toContain(
      'bg-[var(--ui-background-status-danger)]'
    );
    // The retheme uses the subtle border-on-status token, not the strong fill.
    expect(alert.className).toContain(
      'border-[var(--ui-border-on-status-danger)]'
    );
  });

  it('renders a dismiss button that fires onClick', async () => {
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
    await user.click(close);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders the icon / content / title / description parts', () => {
    render(
      <Alert>
        <AlertIcon>
          <svg data-testid="icon" />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>You can add components.</AlertDescription>
        </AlertContent>
      </Alert>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Heads up!').tagName).toBe('H5');
    expect(screen.getByText('You can add components.')).toBeInTheDocument();
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Alert ref={ref}>x</Alert>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

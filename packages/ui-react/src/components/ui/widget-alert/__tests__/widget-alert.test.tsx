import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  WidgetAlert,
  WidgetAlertActions,
  WidgetAlertContent,
  WidgetAlertDate,
  WidgetAlertDescription,
  WidgetAlertIcon,
  WidgetAlertTitle,
} from '../widget-alert';

describe('WidgetAlert', () => {
  it('renders a composed alert with role="alert"', () => {
    render(
      <WidgetAlert>
        <WidgetAlertIcon>
          <svg data-testid="icon-svg" />
        </WidgetAlertIcon>
        <WidgetAlertContent>
          <WidgetAlertTitle>Backup completed</WidgetAlertTitle>
          <WidgetAlertDate>Today, 10:32 AM</WidgetAlertDate>
          <WidgetAlertDescription>All good.</WidgetAlertDescription>
        </WidgetAlertContent>
        <WidgetAlertActions>
          <svg data-testid="actions-svg" />
        </WidgetAlertActions>
      </WidgetAlert>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Backup completed')).toBeInTheDocument();
    expect(screen.getByText('Today, 10:32 AM')).toBeInTheDocument();
    expect(screen.getByText('All good.')).toBeInTheDocument();
    expect(screen.getByTestId('icon-svg')).toBeInTheDocument();
    expect(screen.getByTestId('actions-svg')).toBeInTheDocument();
  });

  it('defaults to the info variant', () => {
    render(<WidgetAlert data-testid="wa">content</WidgetAlert>);
    expect(screen.getByTestId('wa').className).toContain(
      'bg-[var(--ui-background-status-info)]'
    );
  });

  it.each([
    ['success', '--ui-background-status-success'],
    ['warning', '--ui-background-status-warning'],
    ['danger', '--ui-background-status-danger'],
  ] as const)('applies the %s variant surface + border tokens', (variant, token) => {
    render(
      <WidgetAlert data-testid="wa" variant={variant}>
        content
      </WidgetAlert>
    );
    const el = screen.getByTestId('wa');
    expect(el.className).toContain(`bg-[var(${token})]`);
    expect(el.className).toContain(
      `border-[var(--ui-border-on-status-${variant})]`
    );
  });

  it('is not focusable by default', () => {
    render(<WidgetAlert data-testid="wa">content</WidgetAlert>);
    expect(screen.getByTestId('wa')).not.toHaveAttribute('tabindex');
  });

  it('becomes focusable and interactive when interactive', () => {
    render(
      <WidgetAlert data-testid="wa" interactive>
        content
      </WidgetAlert>
    );
    const wa = screen.getByTestId('wa');
    expect(wa).toHaveAttribute('tabindex', '0');
    expect(wa).toHaveClass('cursor-pointer');
  });

  it('does not leak the interactive prop to the DOM', () => {
    render(
      <WidgetAlert data-testid="wa" interactive>
        content
      </WidgetAlert>
    );
    expect(screen.getByTestId('wa')).not.toHaveAttribute('interactive');
  });

  it('forwards the ref on the root', () => {
    const ref = createRef<HTMLDivElement>();
    render(<WidgetAlert ref={ref}>content</WidgetAlert>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges a custom className on parts', () => {
    render(<WidgetAlertTitle className="custom-x">Title</WidgetAlertTitle>);
    expect(screen.getByText('Title')).toHaveClass('custom-x', 'truncate');
  });
});

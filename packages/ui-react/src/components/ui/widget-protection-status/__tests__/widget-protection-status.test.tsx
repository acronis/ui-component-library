import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  WidgetProtectionStatus,
  WidgetProtectionStatusContent,
  WidgetProtectionStatusFooter,
  WidgetProtectionStatusHeader,
  WidgetProtectionStatusIcon,
  WidgetProtectionStatusIndicator,
  WidgetProtectionStatusLabel,
  WidgetProtectionStatusTitle,
  WidgetProtectionStatusValue,
} from '../widget-protection-status';

describe('WidgetProtectionStatus', () => {
  it('renders a composed protection-status widget', () => {
    render(
      <WidgetProtectionStatus>
        <WidgetProtectionStatusHeader>
          <WidgetProtectionStatusTitle>Protection</WidgetProtectionStatusTitle>
        </WidgetProtectionStatusHeader>
        <WidgetProtectionStatusContent>
          <WidgetProtectionStatusIndicator status="success">
            <WidgetProtectionStatusValue>128</WidgetProtectionStatusValue>
          </WidgetProtectionStatusIndicator>
          <WidgetProtectionStatusLabel>
            devices protected
          </WidgetProtectionStatusLabel>
        </WidgetProtectionStatusContent>
        <WidgetProtectionStatusFooter>
          Last checked: 2 min ago
        </WidgetProtectionStatusFooter>
      </WidgetProtectionStatus>
    );

    expect(screen.getByText('Protection')).toBeInTheDocument();
    expect(screen.getByText('128')).toBeInTheDocument();
    expect(screen.getByText('devices protected')).toBeInTheDocument();
    expect(screen.getByText('Last checked: 2 min ago')).toBeInTheDocument();
  });

  it('is not focusable by default', () => {
    render(
      <WidgetProtectionStatus data-testid="wps">content</WidgetProtectionStatus>
    );
    expect(screen.getByTestId('wps')).not.toHaveAttribute('tabindex');
  });

  it('becomes focusable and interactive when interactive', () => {
    render(
      <WidgetProtectionStatus data-testid="wps" interactive>
        content
      </WidgetProtectionStatus>
    );
    const widget = screen.getByTestId('wps');
    expect(widget).toHaveAttribute('tabindex', '0');
    expect(widget).toHaveClass('cursor-pointer');
  });

  it('does not leak the interactive prop to the DOM', () => {
    render(
      <WidgetProtectionStatus data-testid="wps" interactive>
        content
      </WidgetProtectionStatus>
    );
    expect(screen.getByTestId('wps')).not.toHaveAttribute('interactive');
  });

  it('forwards the ref on the root', () => {
    const ref = createRef<HTMLDivElement>();
    render(<WidgetProtectionStatus ref={ref}>content</WidgetProtectionStatus>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders the icon slot with the text-secondary accent', () => {
    render(
      <WidgetProtectionStatusIcon data-testid="icon">
        <svg data-testid="icon-svg" />
      </WidgetProtectionStatusIcon>
    );
    expect(screen.getByTestId('icon')).toHaveClass('text-secondary');
    expect(screen.getByTestId('icon-svg')).toBeInTheDocument();
  });

  it('defaults the indicator status to success', () => {
    render(<WidgetProtectionStatusIndicator data-testid="indicator" />);
    const dot = screen.getByTestId('indicator').firstElementChild;
    expect(dot).toHaveClass('bg-[var(--ui-background-status-strong-success)]');
  });

  it.each([
    ['warning', 'bg-[var(--ui-background-status-strong-warning)]'],
    ['critical', 'bg-[var(--ui-background-status-strong-critical)]'],
    ['danger', 'bg-[var(--ui-background-status-strong-danger)]'],
    ['info', 'bg-[var(--ui-background-status-strong-info)]'],
    ['neutral', 'bg-[var(--ui-background-status-strong-neutral)]'],
  ] as const)(
    'renders the %s status dot with its token',
    (status, expectedClass) => {
      render(
        <WidgetProtectionStatusIndicator
          data-testid="indicator"
          status={status}
        />
      );
      const dot = screen.getByTestId('indicator').firstElementChild;
      expect(dot).toHaveClass(expectedClass);
    }
  );

  it('renders indicator children alongside the dot', () => {
    render(
      <WidgetProtectionStatusIndicator status="info">
        <span>50 devices</span>
      </WidgetProtectionStatusIndicator>
    );
    expect(screen.getByText('50 devices')).toBeInTheDocument();
  });

  it('merges a custom className on parts', () => {
    render(
      <WidgetProtectionStatusTitle className="custom-x">
        Title
      </WidgetProtectionStatusTitle>
    );
    expect(screen.getByText('Title')).toHaveClass('custom-x', 'truncate');
  });
});

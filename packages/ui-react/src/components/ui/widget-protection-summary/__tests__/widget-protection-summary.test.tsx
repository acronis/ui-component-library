import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  WidgetProtectionSummary,
  WidgetProtectionSummaryContent,
  WidgetProtectionSummaryDivider,
  WidgetProtectionSummaryFooter,
  WidgetProtectionSummaryHeader,
  WidgetProtectionSummaryIcon,
  WidgetProtectionSummaryRow,
  WidgetProtectionSummaryTitle,
} from '../widget-protection-summary';

describe('WidgetProtectionSummary', () => {
  it('renders a composed protection-summary widget', () => {
    render(
      <WidgetProtectionSummary>
        <WidgetProtectionSummaryHeader>
          <WidgetProtectionSummaryTitle>Summary</WidgetProtectionSummaryTitle>
        </WidgetProtectionSummaryHeader>
        <WidgetProtectionSummaryContent>
          <WidgetProtectionSummaryRow
            label="Protected"
            value={128}
            status="success"
          />
          <WidgetProtectionSummaryDivider />
          <WidgetProtectionSummaryRow
            label="At risk"
            value={3}
            status="critical"
          />
        </WidgetProtectionSummaryContent>
        <WidgetProtectionSummaryFooter>
          Updated 2 min ago
        </WidgetProtectionSummaryFooter>
      </WidgetProtectionSummary>
    );

    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Protected')).toBeInTheDocument();
    expect(screen.getByText('128')).toBeInTheDocument();
    expect(screen.getByText('At risk')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Updated 2 min ago')).toBeInTheDocument();
  });

  it('is not focusable by default', () => {
    render(
      <WidgetProtectionSummary data-testid="wps">
        content
      </WidgetProtectionSummary>
    );
    expect(screen.getByTestId('wps')).not.toHaveAttribute('tabindex');
  });

  it('becomes focusable and interactive when interactive', () => {
    render(
      <WidgetProtectionSummary data-testid="wps" interactive>
        content
      </WidgetProtectionSummary>
    );
    const widget = screen.getByTestId('wps');
    expect(widget).toHaveAttribute('tabindex', '0');
    expect(widget).toHaveClass('cursor-pointer');
  });

  it('does not leak the interactive prop to the DOM', () => {
    render(
      <WidgetProtectionSummary data-testid="wps" interactive>
        content
      </WidgetProtectionSummary>
    );
    expect(screen.getByTestId('wps')).not.toHaveAttribute('interactive');
  });

  it('forwards the ref on the root', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <WidgetProtectionSummary ref={ref}>content</WidgetProtectionSummary>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders the icon slot with the text-secondary accent', () => {
    render(
      <WidgetProtectionSummaryIcon data-testid="icon">
        <svg data-testid="icon-svg" />
      </WidgetProtectionSummaryIcon>
    );
    expect(screen.getByTestId('icon')).toHaveClass('text-secondary');
    expect(screen.getByTestId('icon-svg')).toBeInTheDocument();
  });

  it('omits the status dot when no status is passed', () => {
    render(
      <WidgetProtectionSummaryRow data-testid="row" label="Total" value={5} />
    );
    const [labelWrapper] = screen.getByTestId('row').children;
    expect(labelWrapper.children).toHaveLength(1);
  });

  it.each([
    ['success', 'bg-[var(--ui-background-status-strong-success)]'],
    ['warning', 'bg-[var(--ui-background-status-strong-warning)]'],
    ['critical', 'bg-[var(--ui-background-status-strong-critical)]'],
    ['danger', 'bg-[var(--ui-background-status-strong-danger)]'],
    ['info', 'bg-[var(--ui-background-status-strong-info)]'],
    ['neutral', 'bg-[var(--ui-background-status-strong-neutral)]'],
  ] as const)(
    'renders the %s row status dot with its token',
    (status, expectedClass) => {
      render(
        <WidgetProtectionSummaryRow
          data-testid="row"
          label="Total"
          value={5}
          status={status}
        />
      );
      const [labelWrapper] = screen.getByTestId('row').children;
      expect(labelWrapper.firstElementChild).toHaveClass(expectedClass);
    }
  );

  it('merges a custom className on parts', () => {
    render(
      <WidgetProtectionSummaryTitle className="custom-x">
        Title
      </WidgetProtectionSummaryTitle>
    );
    expect(screen.getByText('Title')).toHaveClass('custom-x', 'truncate');
  });
});

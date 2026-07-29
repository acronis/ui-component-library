import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TrendIndicator } from '../trend-indicator';

describe('TrendIndicator', () => {
  it('renders the value and comparison label', () => {
    render(
      <TrendIndicator
        direction="up"
        sentiment="positive"
        value="12%"
        comparisonLabel="vs last quarter"
      />
    );
    expect(screen.getByText('12%')).toBeInTheDocument();
    expect(screen.getByText('vs last quarter')).toBeInTheDocument();
  });

  it('reflects direction and sentiment on data attributes', () => {
    const { container } = render(
      <TrendIndicator direction="down" sentiment="negative" value="3%" />
    );
    const root = container.firstElementChild;
    expect(root).toHaveAttribute('data-direction', 'down');
    expect(root).toHaveAttribute('data-sentiment', 'negative');
  });

  it('defaults sentiment to neutral', () => {
    const { container } = render(
      <TrendIndicator direction="flat" value="0%" />
    );
    expect(container.firstElementChild).toHaveAttribute(
      'data-sentiment',
      'neutral'
    );
  });

  // `direction` and `sentiment` are independent axes — up can be bad, down can
  // be good. This is the whole reason the two props exist, so it is pinned.
  it('keeps direction independent of sentiment', () => {
    const { container } = render(
      <>
        <TrendIndicator direction="up" sentiment="negative" value="35%" />
        <TrendIndicator direction="down" sentiment="positive" value="1.4 h" />
      </>
    );
    const [up, down] = Array.from(container.children);
    expect(up).toHaveAttribute('data-direction', 'up');
    expect(up).toHaveAttribute('data-sentiment', 'negative');
    expect(up?.className).toContain('text-[var(--ui-text-on-status-danger)]');
    expect(down).toHaveAttribute('data-direction', 'down');
    expect(down).toHaveAttribute('data-sentiment', 'positive');
    expect(down?.className).toContain(
      'text-[var(--ui-text-on-status-success)]'
    );
  });

  it('renders a decorative direction glyph by default and hides it with showIcon={false}', () => {
    const { container, rerender } = render(
      <TrendIndicator direction="up" value="5%" />
    );
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden');

    rerender(<TrendIndicator direction="up" value="5%" showIcon={false} />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('exposes an explicit ariaLabel as a labelled image', () => {
    render(
      <TrendIndicator
        direction="up"
        sentiment="positive"
        value="12%"
        ariaLabel="Revenue increased 12% compared with the previous quarter"
      />
    );
    expect(
      screen.getByRole('img', {
        name: 'Revenue increased 12% compared with the previous quarter',
      })
    ).toBeInTheDocument();
  });

  it('renders a qualitative value (not just numeric)', () => {
    render(
      <TrendIndicator direction="up" sentiment="positive" value="Improving" />
    );
    expect(screen.getByText('Improving')).toBeInTheDocument();
  });

  it('applies the badge variant tint class', () => {
    const { container } = render(
      <TrendIndicator
        direction="up"
        sentiment="positive"
        value="12%"
        variant="badge"
      />
    );
    expect(container.firstElementChild?.className).toContain(
      'bg-[var(--ui-background-status-success)]'
    );
  });

  it('does not tint the inline variant', () => {
    const { container } = render(
      <TrendIndicator direction="up" sentiment="positive" value="12%" />
    );
    expect(container.firstElementChild?.className).not.toContain(
      'bg-[var(--ui-background-status-success)]'
    );
  });

  it('renders as a keyboard-reachable tooltip trigger', () => {
    const { container } = render(
      <TrendIndicator
        direction="up"
        sentiment="positive"
        value="12%"
        tooltip="Up 12% vs the previous quarter"
      />
    );
    const trigger = container.querySelector('[data-direction="up"]');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('tabindex', '0');
  });

  it('is not focusable without a tooltip', () => {
    const { container } = render(<TrendIndicator direction="up" value="12%" />);
    expect(container.firstElementChild).not.toHaveAttribute('tabindex');
  });

  it('forwards a ref to the root element', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<TrendIndicator direction="up" value="1%" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('merges a caller className onto the root', () => {
    const { container } = render(
      <TrendIndicator direction="up" value="1%" className="mt-2" />
    );
    expect(container.firstElementChild).toHaveClass('mt-2');
  });
});

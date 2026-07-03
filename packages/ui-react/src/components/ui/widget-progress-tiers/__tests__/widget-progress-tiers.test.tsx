import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  WidgetProgressTiers,
  WidgetProgressTiersBar,
  WidgetProgressTiersFooter,
  WidgetProgressTiersHeader,
  WidgetProgressTiersIcon,
  WidgetProgressTiersLegend,
  WidgetProgressTiersLegendItem,
  WidgetProgressTiersTitle,
} from '../widget-progress-tiers';

describe('WidgetProgressTiers', () => {
  it('renders a composed widget with a stacked bar and legend', () => {
    render(
      <WidgetProgressTiers>
        <WidgetProgressTiersHeader>
          <WidgetProgressTiersIcon>
            <svg data-testid="icon-svg" />
          </WidgetProgressTiersIcon>
          <WidgetProgressTiersTitle>Ticket breakdown</WidgetProgressTiersTitle>
        </WidgetProgressTiersHeader>
        <WidgetProgressTiersBar
          tiers={[
            { label: 'Open', value: 30, color: 'red' },
            { label: 'Closed', value: 70, color: 'green' },
          ]}
        />
        <WidgetProgressTiersLegend>
          <WidgetProgressTiersLegendItem color="red" label="Open" value={30} />
          <WidgetProgressTiersLegendItem color="green" label="Closed" value={70} />
        </WidgetProgressTiersLegend>
        <WidgetProgressTiersFooter>100 tickets total</WidgetProgressTiersFooter>
      </WidgetProgressTiers>
    );

    expect(screen.getByText('Ticket breakdown')).toBeInTheDocument();
    expect(screen.getByTestId('icon-svg')).toBeInTheDocument();
    expect(screen.getAllByText('Open')).toHaveLength(1);
    expect(screen.getAllByText('Closed')).toHaveLength(1);
    expect(screen.getByText('100 tickets total')).toBeInTheDocument();
  });

  it('renders one bar segment per tier sized by its share of the total', () => {
    const { container } = render(
      <WidgetProgressTiersBar
        tiers={[
          { label: 'A', value: 25, color: 'red' },
          { label: 'B', value: 75, color: 'blue' },
        ]}
      />
    );
    const segments = container.querySelectorAll('[title]');
    expect(segments).toHaveLength(2);
    expect(segments[0]).toHaveStyle({ width: '25%', backgroundColor: 'red' });
    expect(segments[0]).toHaveAttribute('title', 'A: 25');
    expect(segments[1]).toHaveStyle({ width: '75%', backgroundColor: 'blue' });
  });

  it('uses an explicit total instead of summing tier values when provided', () => {
    const { container } = render(
      <WidgetProgressTiersBar total={200} tiers={[{ label: 'A', value: 50, color: 'red' }]} />
    );
    const segment = container.querySelector('[title]') as HTMLElement;
    expect(segment).toHaveStyle({ width: '25%' });
  });

  it('treats a zero total as 0% instead of dividing by zero', () => {
    const { container } = render(<WidgetProgressTiersBar tiers={[]} total={0} />);
    expect(container.querySelectorAll('[title]')).toHaveLength(0);
  });

  it('renders the legend value only when provided', () => {
    render(<WidgetProgressTiersLegendItem color="blue" label="No value" />);
    expect(screen.getByText('No value')).toBeInTheDocument();
  });

  it('is not focusable by default and becomes interactive when requested', () => {
    const { rerender } = render(
      <WidgetProgressTiers data-testid="widget">content</WidgetProgressTiers>
    );
    expect(screen.getByTestId('widget')).not.toHaveAttribute('tabindex');

    rerender(
      <WidgetProgressTiers data-testid="widget" interactive>
        content
      </WidgetProgressTiers>
    );
    const widget = screen.getByTestId('widget');
    expect(widget).toHaveAttribute('tabindex', '0');
    expect(widget).toHaveClass('cursor-pointer');
    expect(widget).not.toHaveAttribute('interactive');
  });

  it('forwards the ref on the root', () => {
    const ref = createRef<HTMLDivElement>();
    render(<WidgetProgressTiers ref={ref}>content</WidgetProgressTiers>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges a custom className on parts', () => {
    render(
      <WidgetProgressTiersTitle className="custom-x">Title</WidgetProgressTiersTitle>
    );
    expect(screen.getByText('Title')).toHaveClass('custom-x', 'truncate');
  });
});

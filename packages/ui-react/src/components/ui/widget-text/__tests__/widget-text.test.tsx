import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  WidgetText,
  WidgetTextContent,
  WidgetTextDivider,
  WidgetTextFooter,
  WidgetTextHeader,
  WidgetTextIcon,
  WidgetTextLabel,
  WidgetTextTitle,
  WidgetTextTrend,
  WidgetTextValue,
} from '../widget-text';

describe('WidgetText', () => {
  it('renders a composed text widget', () => {
    render(
      <WidgetText>
        <WidgetTextHeader>
          <WidgetTextIcon>
            <svg data-testid="icon-svg" />
          </WidgetTextIcon>
          <WidgetTextTitle>Total Backups</WidgetTextTitle>
        </WidgetTextHeader>
        <WidgetTextContent>
          <WidgetTextValue>1,284</WidgetTextValue>
          <WidgetTextLabel>Backups completed this month</WidgetTextLabel>
        </WidgetTextContent>
        <WidgetTextDivider />
        <WidgetTextFooter>Updated 5 min ago</WidgetTextFooter>
      </WidgetText>
    );
    expect(screen.getByText('Total Backups')).toBeInTheDocument();
    expect(screen.getByText('1,284')).toBeInTheDocument();
    expect(screen.getByText('Backups completed this month')).toBeInTheDocument();
    expect(screen.getByText('Updated 5 min ago')).toBeInTheDocument();
    expect(screen.getByTestId('icon-svg')).toBeInTheDocument();
  });

  it('is not focusable by default', () => {
    render(<WidgetText data-testid="wt">content</WidgetText>);
    expect(screen.getByTestId('wt')).not.toHaveAttribute('tabindex');
  });

  it('becomes focusable and interactive when interactive', () => {
    render(
      <WidgetText data-testid="wt" interactive>
        content
      </WidgetText>
    );
    const wt = screen.getByTestId('wt');
    expect(wt).toHaveAttribute('tabindex', '0');
    expect(wt).toHaveClass('cursor-pointer');
  });

  it('does not leak the interactive prop to the DOM', () => {
    render(
      <WidgetText data-testid="wt" interactive>
        content
      </WidgetText>
    );
    expect(screen.getByTestId('wt')).not.toHaveAttribute('interactive');
  });

  it('forwards the ref on the root', () => {
    const ref = createRef<HTMLDivElement>();
    render(<WidgetText ref={ref}>content</WidgetText>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges a custom className on parts', () => {
    render(<WidgetTextTitle className="custom-x">Title</WidgetTextTitle>);
    expect(screen.getByText('Title')).toHaveClass('custom-x', 'truncate');
  });

  describe('WidgetTextTrend', () => {
    it('defaults to the neutral direction with no arrow glyph', () => {
      render(<WidgetTextTrend data-testid="trend">No change</WidgetTextTrend>);
      const trend = screen.getByTestId('trend');
      expect(trend.className).toContain('--ui-text-on-status-neutral');
      expect(trend.querySelector('svg')).not.toBeInTheDocument();
    });

    it('renders an up arrow and the success color for direction="up"', () => {
      render(
        <WidgetTextTrend data-testid="trend" direction="up">
          +12%
        </WidgetTextTrend>
      );
      const trend = screen.getByTestId('trend');
      expect(trend.className).toContain('--ui-text-on-status-success');
      expect(trend.querySelector('svg')).toBeInTheDocument();
    });

    it('renders a down arrow and the danger color for direction="down"', () => {
      render(
        <WidgetTextTrend data-testid="trend" direction="down">
          -5%
        </WidgetTextTrend>
      );
      const trend = screen.getByTestId('trend');
      expect(trend.className).toContain('--ui-text-on-status-danger');
      expect(trend.querySelector('svg')).toBeInTheDocument();
    });
  });
});

import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Widget,
  WidgetActions,
  WidgetContent,
  WidgetDivider,
  WidgetFooter,
  WidgetHeader,
  WidgetIcon,
  WidgetLabel,
  WidgetTitle,
  WidgetValue,
} from '../widget';

describe('Widget', () => {
  it('renders a composed widget', () => {
    render(
      <Widget>
        <WidgetHeader>
          <WidgetIcon>
            <svg data-testid="icon-svg" />
          </WidgetIcon>
          <WidgetTitle>Backup usage</WidgetTitle>
          <WidgetActions>
            <button type="button">More</button>
          </WidgetActions>
        </WidgetHeader>
        <WidgetContent>
          <WidgetValue>1.2 TB</WidgetValue>
          <WidgetLabel>of 2 TB used</WidgetLabel>
        </WidgetContent>
        <WidgetDivider />
        <WidgetFooter>Last checked: today</WidgetFooter>
      </Widget>
    );
    expect(screen.getByText('Backup usage')).toBeInTheDocument();
    expect(screen.getByText('1.2 TB')).toBeInTheDocument();
    expect(screen.getByText('of 2 TB used')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'More' })).toBeInTheDocument();
    expect(screen.getByText('Last checked: today')).toBeInTheDocument();
    expect(screen.getByTestId('icon-svg')).toBeInTheDocument();
  });

  it('renders WidgetDivider as an hr', () => {
    const { container } = render(<WidgetDivider data-testid="divider" />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('is not focusable by default', () => {
    render(<Widget data-testid="w">content</Widget>);
    expect(screen.getByTestId('w')).not.toHaveAttribute('tabindex');
  });

  it('becomes focusable and interactive when interactive', () => {
    render(
      <Widget data-testid="w" interactive>
        content
      </Widget>
    );
    const w = screen.getByTestId('w');
    expect(w).toHaveAttribute('tabindex', '0');
    expect(w).toHaveClass('cursor-pointer');
  });

  it('does not leak the interactive or size props to the DOM', () => {
    render(
      <Widget data-testid="w" interactive size="lg">
        content
      </Widget>
    );
    const w = screen.getByTestId('w');
    expect(w).not.toHaveAttribute('interactive');
    expect(w).not.toHaveAttribute('size');
  });

  it('applies the size variant classes', () => {
    render(
      <Widget data-testid="w" size="xl">
        content
      </Widget>
    );
    expect(screen.getByTestId('w')).toHaveClass('min-h-[352px]');
  });

  it('defaults to the md size', () => {
    render(<Widget data-testid="w">content</Widget>);
    expect(screen.getByTestId('w')).toHaveClass('min-h-[176px]');
  });

  it('forwards the ref on the root', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Widget ref={ref}>content</Widget>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges a custom className on parts', () => {
    render(<WidgetTitle className="custom-x">Title</WidgetTitle>);
    expect(screen.getByText('Title')).toHaveClass('custom-x', 'truncate');
  });
});

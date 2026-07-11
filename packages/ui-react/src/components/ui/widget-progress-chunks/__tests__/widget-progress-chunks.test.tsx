import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  WidgetProgressChunkRow,
  WidgetProgressChunks,
  WidgetProgressChunksBody,
  WidgetProgressChunksFooter,
  WidgetProgressChunksHeader,
  WidgetProgressChunksIcon,
  WidgetProgressChunksTitle,
} from '../widget-progress-chunks';

describe('WidgetProgressChunks', () => {
  it('renders a composed widget with chunk rows', () => {
    render(
      <WidgetProgressChunks>
        <WidgetProgressChunksHeader>
          <WidgetProgressChunksIcon>
            <svg data-testid="icon-svg" />
          </WidgetProgressChunksIcon>
          <WidgetProgressChunksTitle>Storage usage</WidgetProgressChunksTitle>
        </WidgetProgressChunksHeader>
        <WidgetProgressChunksBody>
          <WidgetProgressChunkRow
            label="Photos"
            value={30}
            total={100}
            color="red"
          />
          <WidgetProgressChunkRow
            label="Videos"
            value={50}
            total={100}
            color="blue"
          />
        </WidgetProgressChunksBody>
        <WidgetProgressChunksFooter>
          80 / 100 GB used
        </WidgetProgressChunksFooter>
      </WidgetProgressChunks>
    );

    expect(screen.getByText('Storage usage')).toBeInTheDocument();
    expect(screen.getByTestId('icon-svg')).toBeInTheDocument();
    expect(screen.getByText('Photos')).toBeInTheDocument();
    expect(screen.getByText('30 / 100')).toBeInTheDocument();
    expect(screen.getByText('Videos')).toBeInTheDocument();
    expect(screen.getByText('50 / 100')).toBeInTheDocument();
    expect(screen.getByText('80 / 100 GB used')).toBeInTheDocument();
  });

  const fillSelector = '.h-full.rounded.transition-all';

  it('computes the fill width from value/total and clamps to 100%', () => {
    const { container, rerender } = render(
      <WidgetProgressChunkRow
        label="Over"
        value={30}
        total={40}
        color="green"
      />
    );
    const fill = container.querySelector(fillSelector) as HTMLElement;
    expect(fill).toHaveStyle({ width: '75%', backgroundColor: 'green' });

    rerender(
      <WidgetProgressChunkRow
        label="Over"
        value={60}
        total={40}
        color="green"
      />
    );
    const clampedFill = container.querySelector(fillSelector) as HTMLElement;
    expect(clampedFill).toHaveStyle({ width: '100%' });
  });

  it('treats a zero total as 0% instead of dividing by zero', () => {
    const { container } = render(
      <WidgetProgressChunkRow label="Empty" value={0} total={0} color="gray" />
    );
    const fill = container.querySelector(fillSelector) as HTMLElement;
    expect(fill).toHaveStyle({ width: '0%' });
  });

  it('formats value/total with the provided formatters', () => {
    render(
      <WidgetProgressChunkRow
        label="Bytes"
        value={1024}
        total={2048}
        color="blue"
        formatValue={(v) => `${v}B`}
        formatTotal={(t) => `${t}B`}
      />
    );
    expect(screen.getByText('1024B / 2048B')).toBeInTheDocument();
  });

  it('is not focusable by default and becomes interactive when requested', () => {
    const { rerender } = render(
      <WidgetProgressChunks data-testid="widget">content</WidgetProgressChunks>
    );
    expect(screen.getByTestId('widget')).not.toHaveAttribute('tabindex');

    rerender(
      <WidgetProgressChunks data-testid="widget" interactive>
        content
      </WidgetProgressChunks>
    );
    const widget = screen.getByTestId('widget');
    expect(widget).toHaveAttribute('tabindex', '0');
    expect(widget).toHaveClass('cursor-pointer');
    expect(widget).not.toHaveAttribute('interactive');
  });

  it('forwards the ref on the root', () => {
    const ref = createRef<HTMLDivElement>();
    render(<WidgetProgressChunks ref={ref}>content</WidgetProgressChunks>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges a custom className on parts', () => {
    render(
      <WidgetProgressChunksTitle className="custom-x">
        Title
      </WidgetProgressChunksTitle>
    );
    expect(screen.getByText('Title')).toHaveClass('custom-x', 'truncate');
  });
});

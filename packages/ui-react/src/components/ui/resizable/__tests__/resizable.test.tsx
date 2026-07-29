import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../resizable';

const Group = ({
  orientation = 'horizontal',
  handleClassName,
}: {
  orientation?: 'horizontal' | 'vertical';
  handleClassName?: string;
}) => (
  <ResizablePanelGroup orientation={orientation}>
    <ResizablePanel defaultSize={50}>One</ResizablePanel>
    <ResizableHandle className={handleClassName} />
    <ResizablePanel defaultSize={50}>Two</ResizablePanel>
  </ResizablePanelGroup>
);

describe('Resizable', () => {
  it('renders the panels and a separator handle', () => {
    render(<Group />);
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('renders the handle as a line only (no grip child)', () => {
    render(<Group />);
    expect(screen.getByRole('separator').children).toHaveLength(0);
  });

  it('forwards className to the handle', () => {
    render(<Group handleClassName="custom-handle" />);
    expect(screen.getByRole('separator')).toHaveClass('custom-handle');
  });

  it('reflects orientation on the separator (vertical group → horizontal divider)', () => {
    const { rerender } = render(<Group orientation="horizontal" />);
    expect(screen.getByRole('separator')).toHaveAttribute(
      'aria-orientation',
      'vertical'
    );

    rerender(<Group orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute(
      'aria-orientation',
      'horizontal'
    );
  });

  it('keeps the separator keyboard-focusable', async () => {
    render(<Group />);
    const handle = screen.getByRole('separator');
    await userEvent.tab();
    expect(handle).toHaveFocus();
    expect(handle).toHaveAttribute('tabindex', '0');
  });

  it('uses tokenized divider/focus colors', () => {
    render(<Group />);
    const handle = screen.getByRole('separator');
    expect(handle).toHaveClass(
      'after:[border-color:var(--ui-border-on-surface-border)]',
      'hover:after:[border-color:var(--ui-resizable-border-color-hover)]',
      'active:after:[border-color:var(--ui-resizable-border-color-active)]',
      'focus-visible:after:[border-color:var(--ui-resizable-border-color-active)]',
      'focus-visible:after:[box-shadow:0_0_0_3px_var(--ui-focus-primary)]'
    );
  });

  it('draws the vertical divider with the inline-start border', () => {
    render(<Group />);
    // Zero-width box painted by its inline-start border → the browser pixel-snaps
    // the 1px line instead of translating a background across a fractional edge.
    expect(screen.getByRole('separator')).toHaveClass(
      'after:w-0',
      'after:[border-inline-start-width:var(--ui-resizable-border-width)]'
    );
  });

  it('draws the stacked divider with the block-start (top) border', () => {
    render(<Group />);
    // orientation=horizontal resets the inline-start border and paints the
    // block-start (top) border so the full-width line renders.
    expect(screen.getByRole('separator')).toHaveClass(
      'aria-[orientation=horizontal]:after:[border-inline-start-width:0]',
      'aria-[orientation=horizontal]:after:[border-block-start-width:var(--ui-resizable-border-width)]'
    );
  });
});

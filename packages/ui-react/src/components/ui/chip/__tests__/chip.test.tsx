import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Chip } from '../chip';

describe('Chip', () => {
  it('renders its label', () => {
    render(<Chip>Label</Chip>);
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('defaults to the removable variant with a remove button', () => {
    render(<Chip>Label</Chip>);
    expect(
      screen.getByRole('button', { name: 'Remove' })
    ).toBeInTheDocument();
  });

  it('calls onRemove when the remove button is pressed', async () => {
    const onRemove = vi.fn();
    const user = userEvent.setup();
    render(<Chip onRemove={onRemove}>Label</Chip>);
    await user.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('uses a custom remove label', () => {
    render(<Chip removeLabel="Dismiss filter">Label</Chip>);
    expect(
      screen.getByRole('button', { name: 'Dismiss filter' })
    ).toBeInTheDocument();
  });

  it('exposes the selectable variant as a toggle button', () => {
    const { container } = render(
      <Chip variant="selectable" selected>
        Label
      </Chip>
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('role', 'button');
    expect(root).toHaveAttribute('aria-pressed', 'true');
    expect(root).toHaveAttribute('data-selected', 'true');
    expect(root).toHaveClass(
      'data-[selected=true]:bg-[var(--ui-chip-global-box-color-active)]'
    );
    // No remove button on a selectable chip.
    expect(screen.queryByRole('button', { name: 'Remove' })).toBeNull();
  });

  it('exposes the operational variant as an action button (no toggle, no remove)', () => {
    const { container } = render(<Chip variant="operational">Action</Chip>);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('role', 'button');
    expect(root).not.toHaveAttribute('aria-pressed');
    expect(root).toHaveClass('text-[var(--ui-chip-operational-label-color)]');
    // No remove button on an operational chip.
    expect(screen.queryByRole('button', { name: 'Remove' })).toBeNull();
  });

  it('activates an operational chip with the keyboard', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Chip variant="operational" onClick={onClick}>
        Action
      </Chip>
    );
    await user.tab();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('reflects the unselected state', () => {
    const { container } = render(<Chip variant="selectable">Label</Chip>);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('aria-pressed', 'false');
    expect(root).not.toHaveAttribute('data-selected');
  });

  it('activates a selectable chip with the keyboard', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Chip variant="selectable" onClick={onClick}>
        Label
      </Chip>
    );
    await user.tab();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('renders an optional leading icon before the label', () => {
    const { container } = render(
      <Chip icon={<svg data-testid="icon" />}>Label</Chip>
    );
    const root = container.firstElementChild!;
    expect(root.querySelector('[data-testid="icon"]')).toBeInTheDocument();
    expect(root.firstElementChild?.getAttribute('data-testid')).toBe('icon');
  });

  it('forwards the ref to the underlying div', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Chip ref={ref}>Label</Chip>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

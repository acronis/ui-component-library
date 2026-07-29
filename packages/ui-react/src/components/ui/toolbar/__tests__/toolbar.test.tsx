import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import {
  Toolbar,
  ToolbarActions,
  ToolbarButton,
  ToolbarGroup,
  ToolbarLink,
  ToolbarSeparator,
  ToolbarStatus,
} from '../index';

function Sample(props: React.ComponentProps<typeof Toolbar>) {
  return (
    <Toolbar aria-label="Selection actions" {...props}>
      <ToolbarGroup>
        <ToolbarButton>First action</ToolbarButton>
        <ToolbarButton>Second action</ToolbarButton>
        <ToolbarSeparator />
        <ToolbarLink href="#docs">Docs</ToolbarLink>
      </ToolbarGroup>
      <ToolbarGroup className="ms-auto">
        <ToolbarStatus>6 items selected:</ToolbarStatus>
        <ToolbarButton>Deselect</ToolbarButton>
      </ToolbarGroup>
    </Toolbar>
  );
}

describe('Toolbar', () => {
  it('renders a toolbar landmark with its actions and status', () => {
    render(<Sample />);
    const toolbar = screen.getByRole('toolbar', { name: 'Selection actions' });
    expect(toolbar).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'First action' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute(
      'href',
      '#docs'
    );
    expect(screen.getByText('6 items selected:')).toBeInTheDocument();
  });

  it('uses roving tabindex — only the first item is in the tab order', () => {
    render(<Sample />);
    expect(
      screen.getByRole('button', { name: 'First action' })
    ).toHaveAttribute('tabindex', '0');
    expect(
      screen.getByRole('button', { name: 'Second action' })
    ).toHaveAttribute('tabindex', '-1');
  });

  it('moves focus between items with the arrow keys', async () => {
    const user = userEvent.setup();
    render(<Sample />);
    const first = screen.getByRole('button', { name: 'First action' });
    first.focus();
    expect(first).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: 'Second action' })).toHaveFocus();
  });

  it('disables its actions when the toolbar is disabled', () => {
    render(<Sample disabled />);
    const button = screen.getByRole('button', { name: 'First action' });
    expect(button).toHaveAttribute('data-disabled');
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('does not fire a disabled action on click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Toolbar disabled aria-label="t">
        <ToolbarButton onClick={onClick}>Act</ToolbarButton>
      </Toolbar>
    );
    await user.click(screen.getByRole('button', { name: 'Act' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards the root ref and merges className', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Toolbar ref={ref} className="custom" aria-label="t">
        <ToolbarButton>x</ToolbarButton>
      </Toolbar>
    );
    expect(ref.current).toBe(screen.getByRole('toolbar'));
    expect(screen.getByRole('toolbar')).toHaveClass('custom');
  });
});

describe('ToolbarActions', () => {
  const actions = [
    { id: 'a', label: 'First action' },
    { id: 'b', label: 'Second action' },
    { id: 'c', label: 'Third action', disabled: true },
  ];

  it('renders each action as a roving ghost toolbar button (unmeasured)', () => {
    // happy-dom reports zero widths, so nothing overflows and no menu appears.
    render(
      <Toolbar aria-label="t">
        <ToolbarActions actions={actions} />
      </Toolbar>
    );
    expect(screen.getByRole('button', { name: 'First action' })).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'More actions' })
    ).not.toBeInTheDocument();
    // Disabled action is disabled via the toolbar.
    expect(
      screen.getByRole('button', { name: 'Third action' })
    ).toHaveAttribute('data-disabled');
  });

  it('fires an inline action onSelect', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Toolbar aria-label="t">
        <ToolbarActions actions={[{ id: 'a', label: 'Run', onSelect }]} />
      </Toolbar>
    );
    await user.click(screen.getByRole('button', { name: 'Run' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});

import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Filter } from '../filter';

describe('Filter', () => {
  it('renders the default "Filter" label with the filter icon when no count is given', () => {
    render(<Filter />);
    const button = screen.getByRole('button', { name: 'Filter' });
    expect(button).toBeInTheDocument();
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('renders custom children as the label', () => {
    render(<Filter>Status</Filter>);
    expect(screen.getByRole('button', { name: 'Status' })).toBeInTheDocument();
  });

  it('renders a count badge instead of the icon when count > 0', () => {
    render(<Filter count={3}>Status</Filter>);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Status');
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(button.querySelector('svg')).not.toBeInTheDocument();
  });

  it('renders the icon (not the badge) when count is 0', () => {
    render(<Filter count={0}>Status</Filter>);
    const button = screen.getByRole('button', { name: 'Status' });
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('themes the label and icon from the brand action-blue token', () => {
    render(<Filter />);
    expect(screen.getByRole('button')).toHaveClass('text-secondary');
  });

  it('themes the count badge from the secondary brand tokens', () => {
    render(<Filter count={5} />);
    expect(screen.getByText('5')).toHaveClass('bg-secondary', 'text-primary-foreground');
  });

  it('applies the outline variant background', () => {
    render(<Filter variant="outline" />);
    expect(screen.getByRole('button')).toHaveClass('border-border', 'bg-background');
  });

  it('forwards the ref to the button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Filter ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('fires onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Filter onClick={onClick} />);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

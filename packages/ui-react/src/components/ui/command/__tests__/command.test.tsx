import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Command, type CommandGroup } from '../command';

const commands: CommandGroup[] = [
  {
    heading: 'Suggestions',
    items: [
      { value: 'calendar', label: 'Calendar' },
      { value: 'search', label: 'Search', shortcut: '⌘S' },
    ],
  },
  {
    heading: 'Settings',
    items: [{ value: 'profile', label: 'Profile' }],
  },
];

describe('Command', () => {
  it('renders an always-open list with the search input and grouped items', () => {
    render(<Command commands={commands} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Suggestions')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('filters items as the user types', async () => {
    const user = userEvent.setup();
    render(<Command commands={commands} />);
    await user.type(screen.getByRole('combobox'), 'cal');
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    expect(screen.queryByText('Search')).not.toBeInTheDocument();
  });

  it('shows the empty state when nothing matches', async () => {
    const user = userEvent.setup();
    render(<Command commands={commands} emptyMessage="No results found." />);
    await user.type(screen.getByRole('combobox'), 'zzzzz');
    expect(screen.getByText('No results found.')).toBeInTheDocument();
    expect(screen.queryByText('Calendar')).not.toBeInTheDocument();
  });

  it('fires onSelect with the option value on click', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Command commands={commands} onSelect={onSelect} />);
    await user.click(screen.getByText('Calendar'));
    expect(onSelect).toHaveBeenCalledWith('calendar');
  });
});

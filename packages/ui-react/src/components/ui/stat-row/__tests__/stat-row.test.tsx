import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { StatRow, type StatRowStat } from '../stat-row';

const STATS: StatRowStat[] = [
  { label: 'Protected', value: '982' },
  { label: 'At risk', value: '17' },
  { label: 'Pending', empty: true },
];

describe('StatRow', () => {
  it('renders a tile per stat with its label and value', () => {
    render(<StatRow stats={STATS} />);
    expect(screen.getByText('Protected')).toBeVisible();
    expect(screen.getByText('982')).toBeVisible();
    expect(screen.getByText('At risk')).toBeVisible();
    expect(screen.getByText('17')).toBeVisible();
  });

  it('renders an empty stat as a non-interactive placeholder', () => {
    render(<StatRow stats={STATS} />);
    // The em-dash placeholder value; the empty tile is not a button.
    expect(screen.getByText('Pending')).toBeVisible();
    expect(
      screen.queryByRole('button', { name: /pending/i })
    ).not.toBeInTheDocument();
  });

  it('renders a stat with onClick as an interactive button and fires it', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<StatRow stats={[{ label: 'Protected', value: '982', onClick }]} />);
    const button = screen.getByRole('button');
    await user.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('keeps non-interactive stats out of the tab order (no button)', () => {
    render(<StatRow stats={[{ label: 'Protected', value: '982' }]} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies an equal-width grid when columns is set', () => {
    const { container } = render(<StatRow stats={STATS} columns={3} />);
    const row = container.firstElementChild as HTMLElement;
    expect(row.className).toContain('grid');
    expect(row.style.gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))');
  });

  it('is a wrapping flex row by default', () => {
    const { container } = render(<StatRow stats={STATS} />);
    const row = container.firstElementChild as HTMLElement;
    expect(row.className).toContain('flex');
    expect(row.className).toContain('flex-wrap');
  });

  it('renders a leading icon', () => {
    render(
      <StatRow
        stats={[
          { label: 'Protected', value: '982', icon: <svg data-testid="i" /> },
        ]}
      />
    );
    expect(screen.getByTestId('i')).toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Calendar } from '../calendar';

const JAN_2024 = new Date(2024, 0, 1);

describe('Calendar', () => {
  it('renders the calendar root and a month grid', () => {
    const { container } = render(
      <Calendar mode="single" defaultMonth={JAN_2024} />
    );
    expect(
      container.querySelector('[data-slot="calendar"]')
    ).toBeInTheDocument();
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('shows the previous / next month navigation', () => {
    render(<Calendar mode="single" defaultMonth={JAN_2024} />);
    expect(
      screen.getByRole('button', { name: /previous month/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /next month/i })
    ).toBeInTheDocument();
  });

  it('calls onSelect when a day is clicked (single mode)', () => {
    const onSelect = vi.fn();
    render(
      <Calendar mode="single" defaultMonth={JAN_2024} onSelect={onSelect} />
    );
    // Day cells are gridcells containing a button; click the "15" button.
    fireEvent.click(screen.getByText('15'));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0][0]).toBeInstanceOf(Date);
  });

  it('marks the selected day with the strong-info (blue) fill class', () => {
    render(
      <Calendar
        mode="single"
        defaultMonth={JAN_2024}
        selected={new Date(2024, 0, 15)}
        onSelect={() => {}}
      />
    );
    const selected = screen.getByText('15').closest('button');
    expect(selected).toHaveAttribute('data-selected-single', 'true');
    expect(selected).toHaveClass(
      'data-[selected-single=true]:bg-[var(--ui-background-status-strong-info)]'
    );
  });

  it('advances the month when Next is clicked', () => {
    render(<Calendar mode="single" defaultMonth={JAN_2024} />);
    expect(screen.getByText(/January 2024/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /next month/i }));
    expect(screen.getByText(/February 2024/i)).toBeInTheDocument();
  });
});

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

  it('insets the grid in the design’s padded body band', () => {
    render(<Calendar mode="single" defaultMonth={JAN_2024} />);
    // The padding belongs to a WRAPPER around the <table>; on the table itself
    // it does not inset the grid, and the panel collapses to 7×32 = 224px
    // instead of the design's 248px.
    const body = screen.getByRole('grid').parentElement as HTMLElement;
    expect(body).toHaveClass(
      'px-[var(--ui-calendar-body-padding-x)]',
      'py-[var(--ui-calendar-body-padding-y)]'
    );
  });

  it('mutes days outside the shown month with the disabled value color', () => {
    render(<Calendar mode="single" defaultMonth={JAN_2024} />);
    // January 2024 starts on a Monday, so the trailing cells are February's.
    const outside = screen.getByText('1', {
      selector: '[data-outside="true"]',
    });
    expect(outside).toHaveClass(
      'data-[outside=true]:text-[var(--ui-calendar-value-color-disabled)]'
    );
    // An in-month day keeps the primary value color and is not marked outside.
    expect(screen.getByText('15').closest('button')).toHaveAttribute(
      'data-outside',
      'false'
    );
  });

  it('keeps day cells square — the design gives radius to the panel only', () => {
    render(
      <Calendar
        mode="single"
        defaultMonth={JAN_2024}
        selected={new Date(2024, 0, 15)}
        onSelect={() => {}}
      />
    );
    const selected = screen.getByText('15').closest('button') as HTMLElement;
    expect(selected.className).not.toMatch(/(^|\s)rounded/);
  });

  it('captions with month + year selects and no chevron nav (the design default)', () => {
    render(<Calendar mode="single" defaultMonth={JAN_2024} />);
    expect(screen.getByRole('combobox', { name: 'Month' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Year' })).toBeInTheDocument();
    // The design's caption navigates via the selects, so the chevrons are gone.
    expect(
      screen.queryByRole('button', { name: /next month/i })
    ).not.toBeInTheDocument();
  });

  it('opts back into the label caption + chevron nav with captionLayout="label"', () => {
    render(
      <Calendar mode="single" defaultMonth={JAN_2024} captionLayout="label" />
    );
    expect(
      screen.getByRole('button', { name: /previous month/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /next month/i })
    ).toBeInTheDocument();
  });

  it('starts weeks on Monday with two-letter labels, matching the design', () => {
    const { container } = render(
      <Calendar mode="single" defaultMonth={JAN_2024} />
    );
    // react-day-picker puts the weekday row in an `aria-hidden` <thead>, so it
    // carries no columnheader role — read the cells from the DOM.
    const weekdays = [...container.querySelectorAll('thead th')].map(
      (cell) => cell.textContent
    );
    expect(weekdays).toEqual(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']);
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

  it('marks the selected day with the Calendar tier’s active fill', () => {
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
      'data-[selected-single=true]:bg-[var(--ui-calendar-item-color-active)]',
      'data-[selected-single=true]:text-[var(--ui-calendar-value-color-active)]'
    );
  });

  it('advances the month when Next is clicked (label caption)', () => {
    render(
      <Calendar mode="single" defaultMonth={JAN_2024} captionLayout="label" />
    );
    expect(screen.getByText(/January 2024/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /next month/i }));
    expect(screen.getByText(/February 2024/i)).toBeInTheDocument();
  });

  it('shows two months in range mode, per the design', () => {
    render(<Calendar mode="range" defaultMonth={JAN_2024} />);
    expect(screen.getAllByRole('grid')).toHaveLength(2);
  });
});

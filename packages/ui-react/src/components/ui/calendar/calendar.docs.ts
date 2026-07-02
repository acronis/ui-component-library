// Curated prop summary for AutoTypeTable. The real `CalendarProps` is
// `React.ComponentProps<typeof DayPicker>` — react-day-picker's full (large)
// surface — which AutoTypeTable can't render usefully. This documents the key
// props; see the react-day-picker docs for the rest.
import type { DateRange, Matcher } from 'react-day-picker';

export interface CalendarProps {
  /** Selection mode — one date, many dates, or a contiguous range. */
  mode?: 'single' | 'multiple' | 'range';
  /** The controlled selected value (shape depends on `mode`). */
  selected?: Date | Date[] | DateRange;
  /** Fires when the selection changes (shape depends on `mode`). */
  onSelect?: (value: Date | Date[] | DateRange | undefined) => void;
  /** The month shown on first render (uncontrolled month). */
  defaultMonth?: Date;
  /** Static month/year label, or month/year `<select>` dropdowns. */
  captionLayout?: 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years';
  /** Render the trailing/leading days of adjacent months. Defaults to `true`. */
  showOutsideDays?: boolean;
  /** How many months to display side by side. */
  numberOfMonths?: number;
  /** Days to disable (a date, range, day-of-week, or predicate). */
  disabled?: Matcher | Matcher[];
}

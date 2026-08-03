'use client';

import * as React from 'react';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@constructor-lab/icons-react/stroke-mono';
import {
  type ChevronProps,
  DayButton,
  DayPicker,
  getDefaultClassNames,
  type MonthCaptionProps,
  type RootProps,
  useDayPicker,
  type WeekNumberProps,
} from 'react-day-picker';

import { cn } from '@/lib/utils';
import {
  InputSelect,
  InputSelectContent,
  InputSelectItem,
  InputSelectTrigger,
  InputSelectValue,
} from '../input-select';

// A themed wrapper around `react-day-picker` (`DayPicker`), matching Figma node
// 8148:10167 (Calendar, variants single | multiple | range).
//
// What the design dictates, and how it maps here:
// - **A bordered panel**, not a bare grid: container background + 1px border +
//   4px radius from the `--ui-calendar-container-*` tier.
// - **A select-driven caption**: month and year are two `InputSelect`s, so there
//   are no prev/next chevrons (`hideNavigation` defaults to `true`). Pass
//   `captionLayout="label"` to get react-day-picker's own label + nav back.
// - **Monday-first weeks** (`weekStartsOn` defaults to 1) with two-letter
//   weekday abbreviations.
// - **`range` shows two months** side by side (`numberOfMonths` defaults to 2 in
//   that mode), matching the design's range variant.
// - **The day cell is a 32×32 box** (`--ui-calendar-item-*`): transparent idle,
//   surface-hover on hover, brand-secondary when selected, with the value colors
//   split idle-primary (in month) / idle-secondary (outside) / active (selected)
//   / disabled. Numerals use the tier's tabular-nums text style.
// - **The footer** (the design's Cancel/Apply row) is react-day-picker's own
//   `footer` slot, styled from the `--ui-footer-*` tier. The buttons themselves
//   belong to the composition around the calendar, not here.
//
// No color is hand-authored; every value resolves to a `--ui-*` token.

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// A day / nav cell: the tier's 32px box, tokenized fill + border per state and a
// token focus ring. Text color is set per modifier by the callers below.
// SQUARE, not rounded — the design's CalendarItem has no corner radius (only the
// container does); the selected day is a flush 32×32 block.
const CELL_BASE =
  // The design gives the item border a COLOR per state but no width variable, so
  // the width is Tailwind's 1px `border` and only the color is tokenized.
  'inline-flex select-none items-center justify-center border border-solid border-[var(--ui-calendar-item-border-idle)] bg-[var(--ui-calendar-item-color-idle)] transition-colors hover:border-[var(--ui-calendar-item-border-hover)] hover:bg-[var(--ui-calendar-item-color-hover)] focus-visible:relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)] aria-disabled:pointer-events-none aria-disabled:text-[var(--ui-calendar-value-color-disabled)]';

/** Header row: the design's caption band — 12px padding, 16px gap, 1px rule. */
const CAPTION_BASE =
  'flex w-full items-center gap-[var(--ui-calendar-header-gap)] px-[var(--ui-calendar-header-padding-x)] py-[var(--ui-calendar-header-padding-y)]';

/**
 * The design's Body band: the grid sits inside 12px padding. It has to be a
 * WRAPPER — react-day-picker's grid element is a `<table>`, and padding on the
 * table is what silently collapsed the panel to 224px (7×32 with no inset)
 * instead of the design's 248px.
 */
const BODY_BASE =
  'px-[var(--ui-calendar-body-padding-x)] py-[var(--ui-calendar-body-padding-y)]';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'dropdown',
  weekStartsOn = 1,
  formatters,
  components,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();
  // `mode` lives on the discriminated members of DayPickerProps, so read it
  // without narrowing the whole union.
  const mode = 'mode' in props ? props.mode : undefined;
  const isRange = mode === 'range';
  // The design's caption is our own InputSelect pair; react-day-picker's chevron
  // nav has no place in it. `label` opts back into its built-in caption + nav.
  const selectCaption = captionLayout === 'dropdown';

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      weekStartsOn={weekStartsOn}
      numberOfMonths={isRange ? 2 : undefined}
      hideNavigation={selectCaption || undefined}
      className={cn(
        'group/calendar w-fit [--cell-size:var(--ui-calendar-item-width-min)]',
        // The design's panel: 1px border, 4px radius, container fill and the
        // shared md elevation (Figma `shadow-md`, as on Popover / the select
        // dropdown). `overflow-hidden` keeps the month divider inside the radius.
        'overflow-hidden rounded-[var(--ui-calendar-container-border-radius)] border-[length:var(--ui-calendar-container-border-width)] border-solid border-[var(--ui-calendar-container-border-color)] bg-[var(--ui-calendar-container-color)] shadow-md',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString('default', { month: 'long' }),
        // The design labels weekdays with two letters (Mo, Tu, …).
        formatWeekdayName: (date) =>
          date.toLocaleString('default', { weekday: 'short' }).slice(0, 2),
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn(
          'relative flex flex-col md:flex-row',
          defaultClassNames.months
        ),
        // In a multi-month view the design separates the months with a 1px rule
        // (the `body/border` tokens) and no gap — 2 × 248px = the 496px range
        // variant.
        month: cn(
          'flex w-full flex-col',
          '[&:not(:first-child)]:border-l-[length:var(--ui-calendar-body-border-width)] [&:not(:first-child)]:border-l-[var(--ui-calendar-body-border-color)]',
          defaultClassNames.month
        ),
        nav: cn(
          'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1 px-[var(--ui-calendar-header-padding-x)] py-[var(--ui-calendar-header-padding-y)]',
          defaultClassNames.nav
        ),
        button_previous: cn(
          CELL_BASE,
          'h-[var(--cell-size)] w-[var(--cell-size)] p-0 text-[var(--ui-calendar-value-color-idle-primary)]',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          CELL_BASE,
          'h-[var(--cell-size)] w-[var(--cell-size)] p-0 text-[var(--ui-calendar-value-color-idle-primary)]',
          defaultClassNames.button_next
        ),
        month_caption: cn(
          CAPTION_BASE,
          'border-b-[length:var(--ui-calendar-header-border-width)] border-b-[var(--ui-calendar-header-border-color)]',
          !selectCaption && 'justify-center',
          defaultClassNames.month_caption
        ),
        // Padding lives on the Body wrapper (see CalendarMonthGrid), never on
        // this `<table>`.
        month_grid: cn('w-full border-collapse', defaultClassNames.month_grid),
        weekdays: cn('flex', defaultClassNames.weekdays),
        // A weekday label is a 32×32 item like a day, in the secondary value
        // color (design row 1 of the Body grid).
        weekday: cn(
          'ui-calendar-value-text-style w-[var(--ui-calendar-item-width-min)] flex-1 select-none font-normal text-[var(--ui-calendar-value-color-idle-secondary)]',
          defaultClassNames.weekday
        ),
        week: cn('flex w-full', defaultClassNames.week),
        week_number_header: cn(
          'w-[var(--cell-size)] select-none',
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          'ui-calendar-value-text-style select-none text-[var(--ui-calendar-value-color-idle-secondary)]',
          defaultClassNames.week_number
        ),
        day: cn(
          'group/day relative aspect-square h-full w-full select-none p-0 text-center',
          defaultClassNames.day
        ),
        // Square, flush cells — the design's range track is an unbroken band
        // with square endpoints (no radius anywhere on an item).
        range_start: cn(defaultClassNames.range_start),
        range_middle: cn(defaultClassNames.range_middle),
        range_end: cn(defaultClassNames.range_end),
        today: cn(
          'font-semibold underline data-[selected=true]:no-underline',
          defaultClassNames.today
        ),
        // Design: a day outside the shown month takes the DISABLED value color
        // (not the secondary one, which is the weekday header's).
        outside: cn(
          'text-[var(--ui-calendar-value-color-disabled)]',
          defaultClassNames.outside
        ),
        disabled: cn(
          'text-[var(--ui-calendar-value-color-disabled)]',
          defaultClassNames.disabled
        ),
        hidden: cn('invisible', defaultClassNames.hidden),
        // The design's Cancel/Apply row: the Footer tier's band.
        footer: cn(
          'flex items-center justify-end gap-[var(--ui-footer-global-gap)] px-[var(--ui-footer-global-padding-x)]',
          'min-h-[var(--ui-footer-global-height)] border-t-[length:var(--ui-footer-default-border-width)] border-t-[var(--ui-footer-default-border-color)] bg-[var(--ui-footer-default-color)]',
          defaultClassNames.footer
        ),
        ...classNames,
      }}
      components={{
        Root: CalendarRoot,
        Chevron: CalendarChevron,
        DayButton: CalendarDayButton,
        MonthGrid: CalendarMonthGrid,
        WeekNumber: CalendarWeekNumber,
        ...(selectCaption ? { MonthCaption: CalendarMonthCaption } : {}),
        ...components,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

function CalendarRoot({ className, rootRef, ...props }: RootProps) {
  return (
    <div
      data-slot="calendar"
      ref={rootRef}
      className={cn(className)}
      {...props}
    />
  );
}
CalendarRoot.displayName = 'CalendarRoot';

/** How many years the caption's year select offers around the shown one. */
const YEAR_SPAN = 10;

/**
 * The design's caption: a month `InputSelect` + a year `InputSelect`. In a
 * multi-month view each caption drives its own month, so picking a value shifts
 * the *first* displayed month by this caption's offset.
 */
function CalendarMonthCaption({
  calendarMonth,
  displayIndex,
  className,
  ...props
}: MonthCaptionProps) {
  const { goToMonth } = useDayPicker();
  const shown = calendarMonth.date;
  const month = shown.getMonth();
  const year = shown.getFullYear();

  const months = React.useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        value: index,
        label: new Date(2000, index, 1).toLocaleString('default', {
          month: 'long',
        }),
      })),
    []
  );
  const years = React.useMemo(
    () =>
      Array.from({ length: YEAR_SPAN * 2 + 1 }, (_, index) => {
        const value = year - YEAR_SPAN + index;
        return { value, label: String(value) };
      }),
    [year]
  );

  const go = (nextMonth: number, nextYear: number) =>
    goToMonth(new Date(nextYear, nextMonth - displayIndex, 1));

  return (
    <div className={cn(CAPTION_BASE, className)} {...props}>
      <InputSelect
        items={months}
        value={month}
        onValueChange={(value) => go(Number(value), year)}
      >
        {/* The month name is the long form ("January"), so this trigger takes
            the spare width and the year one sizes to its four digits. */}
        <InputSelectTrigger aria-label="Month" className="flex-1">
          <InputSelectValue />
        </InputSelectTrigger>
        <InputSelectContent>
          {months.map((item) => (
            <InputSelectItem key={item.value} value={item.value}>
              {item.label}
            </InputSelectItem>
          ))}
        </InputSelectContent>
      </InputSelect>
      <InputSelect
        items={years}
        value={year}
        onValueChange={(value) => go(month, Number(value))}
      >
        <InputSelectTrigger aria-label="Year" className="w-auto shrink-0">
          <InputSelectValue />
        </InputSelectTrigger>
        <InputSelectContent>
          {years.map((item) => (
            <InputSelectItem key={item.value} value={item.value}>
              {item.label}
            </InputSelectItem>
          ))}
        </InputSelectContent>
      </InputSelect>
    </div>
  );
}
CalendarMonthCaption.displayName = 'CalendarMonthCaption';

/**
 * The design's Body: the month grid inside 12px padding. The padding must sit on
 * a wrapper — putting it on the `<table>` itself does not inset the grid, which
 * is what made the panel 224px wide instead of 248px.
 */
function CalendarMonthGrid({
  className,
  ...props
}: React.ComponentProps<'table'>) {
  return (
    <div className={BODY_BASE}>
      <table className={className} {...props} />
    </div>
  );
}
CalendarMonthGrid.displayName = 'CalendarMonthGrid';

function CalendarChevron({ className, orientation, ...props }: ChevronProps) {
  if (orientation === 'left')
    return <ChevronLeftIcon className={cn('size-4', className)} {...props} />;
  if (orientation === 'right')
    return <ChevronRightIcon className={cn('size-4', className)} {...props} />;
  return <ChevronDownIcon className={cn('size-4', className)} {...props} />;
}
CalendarChevron.displayName = 'CalendarChevron';

function CalendarWeekNumber({ children, ...props }: WeekNumberProps) {
  return (
    <td {...props}>
      <div className="flex size-[var(--cell-size)] items-center justify-center text-center">
        {children}
      </div>
    </td>
  );
}
CalendarWeekNumber.displayName = 'CalendarWeekNumber';

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <button
      ref={ref}
      type="button"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      // The cell's own text color wins over the `outside` / `disabled` classes
      // react-day-picker puts on the parent `<td>`, so those states have to be
      // keyed here too — otherwise a day from the adjacent month renders in the
      // in-month color.
      data-outside={modifiers.outside}
      data-disabled={modifiers.disabled}
      className={cn(
        CELL_BASE,
        'ui-calendar-value-text-style flex aspect-square h-auto w-full min-h-[var(--ui-calendar-item-height-min)] min-w-[var(--ui-calendar-item-width-min)] flex-col p-0 text-[var(--ui-calendar-value-color-idle-primary)]',
        // Design: both adjacent-month and disabled days take the disabled value.
        'data-[outside=true]:text-[var(--ui-calendar-value-color-disabled)]',
        'data-[disabled=true]:text-[var(--ui-calendar-value-color-disabled)]',
        // Selected day / range endpoints: the tier's active fill + value color.
        'data-[selected-single=true]:border-[var(--ui-calendar-item-border-active)] data-[selected-single=true]:bg-[var(--ui-calendar-item-color-active)] data-[selected-single=true]:text-[var(--ui-calendar-value-color-active)]',
        'data-[range-start=true]:border-[var(--ui-calendar-item-border-active)] data-[range-start=true]:bg-[var(--ui-calendar-item-color-active)] data-[range-start=true]:text-[var(--ui-calendar-value-color-active)]',
        'data-[range-end=true]:border-[var(--ui-calendar-item-border-active)] data-[range-end=true]:bg-[var(--ui-calendar-item-color-active)] data-[range-end=true]:text-[var(--ui-calendar-value-color-active)]',
        // The in-between track is the hover surface, per the design's grey band.
        'data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-[var(--ui-calendar-item-color-hover)] data-[range-middle=true]:text-[var(--ui-calendar-value-color-idle-primary)]',
        '[&>span]:text-xs [&>span]:opacity-70',
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  );
}
CalendarDayButton.displayName = 'CalendarDayButton';

export { Calendar, CalendarDayButton, CalendarMonthCaption };

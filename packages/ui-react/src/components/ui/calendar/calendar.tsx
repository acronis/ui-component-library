'use client';

import * as React from 'react';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@spec-lab/icons-react/stroke-mono';
import {
  DayButton,
  DayPicker,
  getDefaultClassNames,
} from 'react-day-picker';

import { cn } from '@/lib/utils';

// Ported from the legacy shadcn UI kit's `calendar` — a themed wrapper around `react-day-picker`
// (`DayPicker`). It supports single/multiple/range selection, month/dropdown
// caption layouts, outside/disabled days, and keyboard navigation, all handled
// by react-day-picker.
//
// Adaptations from legacy:
// - The day + nav cells are styled as plain neutral buttons via `--ui-*` tokens
//   rather than the ui-react `Button` — ui-react's `ghost` variant is a *link*
//   style (`--ui-text-on-surface-link`, blue), which is wrong for day numbers,
//   and its Button has no `size` prop. The today marker uses an underline; hover
//   uses the surface-hover token (`bg-accent`).
// - Selection uses the **blue (electricblue/info) gamma**, not the acronis brand
//   navy (`--ui-background-brand-primary` = `blue-13`, near-black): selected days
//   and range endpoints get the strong-info fill
//   (`--ui-background-status-strong-info`, a vivid blue) with a white glyph, and
//   the range track (endpoints' cell + range-middle) uses the soft-info surface
//   (`--ui-background-status-info`) with a blue glyph (`--ui-text-on-status-info`).
//   A dedicated `--ui-calendar-*` tier would supersede these later.
// - `text-white` → `--ui-glyph-on-brand-primary` (white token, not a raw color);
//   the invisible native `<select>` overlay drops its dead `bg-popover` bridge.
// - No color is hand-authored; all names resolve to `--ui-*`.
//
// Design-pending v1: there is no dedicated `--ui-calendar-*` tier yet.

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// A day / nav cell: neutral text, surface-hover on hover, brand fill when
// selected/in-range, token focus ring.
const CELL_BASE =
  'inline-flex select-none items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent focus-visible:relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)] aria-disabled:pointer-events-none aria-disabled:opacity-50';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  formatters,
  components,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'group/calendar bg-background p-3 [--cell-size:2rem]',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn('relative flex flex-col gap-4 md:flex-row', defaultClassNames.months),
        month: cn('flex w-full flex-col gap-4', defaultClassNames.month),
        nav: cn(
          'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
          defaultClassNames.nav
        ),
        button_previous: cn(
          CELL_BASE,
          'h-[var(--cell-size)] w-[var(--cell-size)] p-0',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          CELL_BASE,
          'h-[var(--cell-size)] w-[var(--cell-size)] p-0',
          defaultClassNames.button_next
        ),
        month_caption: cn(
          'flex h-[var(--cell-size)] w-full items-center justify-center px-[var(--cell-size)]',
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          'flex h-[var(--cell-size)] w-full items-center justify-center gap-1.5 text-sm font-medium',
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          'relative rounded-md border border-input shadow-xs has-focus:border-ring has-focus:ring-[3px] has-focus:ring-ring/50',
          defaultClassNames.dropdown_root
        ),
        dropdown: cn('absolute inset-0 opacity-0', defaultClassNames.dropdown),
        caption_label: cn(
          'select-none font-medium',
          captionLayout === 'label'
            ? 'text-sm'
            : 'flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground',
          defaultClassNames.caption_label
        ),
        month_grid: cn('w-full border-collapse', defaultClassNames.month_grid),
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'flex-1 select-none rounded-md text-[0.8rem] font-normal text-muted-foreground',
          defaultClassNames.weekday
        ),
        week: cn('mt-2 flex w-full', defaultClassNames.week),
        week_number_header: cn('w-[var(--cell-size)] select-none', defaultClassNames.week_number_header),
        week_number: cn('select-none text-[0.8rem] text-muted-foreground', defaultClassNames.week_number),
        day: cn(
          'group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md',
          defaultClassNames.day
        ),
        range_start: cn(
          'rounded-l-md bg-[var(--ui-background-status-info)]',
          defaultClassNames.range_start
        ),
        range_middle: cn('rounded-none', defaultClassNames.range_middle),
        range_end: cn(
          'rounded-r-md bg-[var(--ui-background-status-info)]',
          defaultClassNames.range_end
        ),
        today: cn(
          'rounded-md font-semibold underline data-[selected=true]:rounded-none data-[selected=true]:no-underline',
          defaultClassNames.today
        ),
        outside: cn('text-muted-foreground aria-selected:text-muted-foreground', defaultClassNames.outside),
        disabled: cn('text-muted-foreground opacity-50', defaultClassNames.disabled),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => (
          <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />
        ),
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left')
            return <ChevronLeftIcon className={cn('size-4', className)} {...props} />;
          if (orientation === 'right')
            return <ChevronRightIcon className={cn('size-4', className)} {...props} />;
          return <ChevronDownIcon className={cn('size-4', className)} {...props} />;
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => (
          <td {...props}>
            <div className="flex size-[var(--cell-size)] items-center justify-center text-center">
              {children}
            </div>
          </td>
        ),
        ...components,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

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
      className={cn(
        CELL_BASE,
        'flex aspect-square h-auto w-full min-w-[var(--cell-size)] flex-col gap-1 p-0 font-normal leading-none',
        'data-[selected-single=true]:bg-[var(--ui-background-status-strong-info)] data-[selected-single=true]:text-[var(--ui-glyph-on-brand-primary)]',
        'data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-[var(--ui-background-status-info)] data-[range-middle=true]:text-[var(--ui-text-on-status-info)]',
        'data-[range-start=true]:rounded-md data-[range-start=true]:bg-[var(--ui-background-status-strong-info)] data-[range-start=true]:text-[var(--ui-glyph-on-brand-primary)]',
        'data-[range-end=true]:rounded-md data-[range-end=true]:bg-[var(--ui-background-status-strong-info)] data-[range-end=true]:text-[var(--ui-glyph-on-brand-primary)]',
        '[&>span]:text-xs [&>span]:opacity-70',
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  );
}
CalendarDayButton.displayName = 'CalendarDayButton';

export { Calendar, CalendarDayButton };

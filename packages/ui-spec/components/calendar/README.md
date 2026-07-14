# Calendar

An inline date **calendar** — pick a single date, multiple dates, or a range.
Wraps [`react-day-picker`](https://daypicker.dev) (`DayPicker`) with `--ui-*`
token styling and the design system's chevron icons. Ported from the legacy shadcn UI kit as
a **design-pending v1** (no Figma node yet; reconcile with
`/figma-component Calendar <url> --update` when mockups land).

## When to use

- An always-visible date/range picker (booking, scheduling, filters).
- The month-view inside a date-input popover — compose with `Popover` +
  `InputDatePicker` (which is trigger-only by design).

## When not to use

- **Just a date text field** → `InputDatePicker` (the trigger); wire this
  Calendar into its popover.
- **A time picker** → out of scope (date only).

## Anatomy

`root` (`data-slot="calendar"`) → `nav` (prev/next) + `caption` (month label or
dropdowns) → `grid` of `weekday` headers and `day` cells.

## Notes

- It's **controlled** in the common case: hold `selected` in state and update it
  from `onSelect`.
- Props are `react-day-picker`'s `DayPicker` props (`CalendarProps`) — `mode`,
  `selected`, `captionLayout`, `showOutsideDays`, `numberOfMonths`, `disabled`,
  formatters, locale, etc.
- `react-day-picker@10` is a dependency of `@constructor-lab/ui-react`.

## Examples

```tsx
import { Calendar } from '@constructor-lab/ui-react';

// Single date (controlled)
const [date, setDate] = React.useState<Date>();
<Calendar mode="single" selected={date} onSelect={setDate} />

// Range with dropdown caption
<Calendar mode="range" captionLayout="dropdown" selected={range} onSelect={setRange} />
```

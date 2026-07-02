# Calendar — behavior

Calendar delegates its date logic to `react-day-picker`; this section covers the
contract a consumer sees. It is typically **controlled** (`selected` + `onSelect`).

## Selection

- **Given** `mode="single"` **when** a day is clicked **then** `onSelect` fires
  with that `Date` (or `undefined` when the same day is clicked to clear).
- **Given** `mode="range"` **when** two days are picked **then** `onSelect` fires
  with a `{ from, to }` range; the endpoints show the brand fill and the days
  between show the range-middle (surface-hover) fill.
- **Given** `mode="multiple"` **when** days are toggled **then** `onSelect` fires
  with the array of selected `Date`s.
- **Given** a `selected` value **when** rendered **then** the matching day(s) show
  the brand fill; the `today` day is underlined (and loses the underline when it
  is also selected).

## Month navigation

- **Given** the previous/next buttons **when** clicked **then** the view moves one
  month (uncontrolled) — or, with a controlled `month`, `onMonthChange` fires.
- **Given** `captionLayout="dropdown"` **when** rendered **then** the caption
  becomes month/year `<select>`s for fast navigation.

## Disabled & outside days

- **Given** a `disabled` matcher **when** rendered **then** matching days are
  muted, non-interactive, and skipped by keyboard navigation.
- **Given** `showOutsideDays` (default true) **when** rendered **then** the
  trailing/leading days of adjacent months appear muted.

## Non-goals

- Calendar is the **inline** month view only; it does not render a popover or a
  text field — compose it with `Popover` + `InputDatePicker` for a date-input.

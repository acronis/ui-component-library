// Figma Code Connect — status: COMPLETE
// Mapped to the "Calendar" component set in the ui-react Figma file
// (node 8148:10167). Its `variant` property (single | multiple | range —
// confirmed via get_context_for_code_connect) is the React `mode` prop, 1:1 with
// react-day-picker's. The set's other property, `state` (idle | selected), is
// *data* in code — whether `selected` holds a date — not a prop, so it is not
// mapped.
//
// The design node draws the whole picker assembly: two InputSelect instances for
// the month/year caption, the CalendarItem grid, and a DialogFooterDefault with
// Buttons. Only the grid + caption is this component; the footer belongs to the
// surrounding composition (see the `InInputDatePicker` story).
//
// NOTE: the node references a full `components/Calendar/*` variable tier
// (item/value/header/body/container) that `@constructor-lab/tokens` does not
// generate yet — `DEFAULT_COMPONENTS` in
// tools/token-emit/helpers/emit-components-builder.mjs omits 'Calendar', so the
// tier is filtered out of tiers/components.json. Until it is emitted this
// component stays themed from semantic tokens and the design's exact
// item/value colours are unreachable. Re-run
// `/figma-component calendar <url> --update` after that sync.
import figma from '@figma/code-connect';

import { Calendar } from './calendar';

figma.connect(
  Calendar,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=8148-10167',
  {
    props: {
      // Mapped as enum → JSX, not as a `mode` string: `DayPickerProps` is a
      // discriminated union, so a union-typed `mode` value fails to assign
      // (each mode carries its own `selected`/`required` shape).
      calendar: figma.enum('variant', {
        single: <Calendar mode="single" />,
        multiple: <Calendar mode="multiple" />,
        range: <Calendar mode="range" />,
      }),
    },
    example: ({ calendar }) => calendar,
  }
);

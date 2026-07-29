# Timeline — behavior

## Renders a list in the caller's order

- **Given** three `TimelineItem`s
  **Then** an `<ol>` renders three `<li>`s in exactly the order given — Timeline
  never sorts, reverses, groups by day, or fetches. "Newest first" is the
  caller's decision (the design pairs the list with its own `Order:` select).

## The event card

- **Given** a `title` and a `timestamp`
  **Then** the header shows the title on the leading edge and the timestamp,
  muted and unwrapped, on the trailing edge.
- **Given** a `tag`
  **Then** it renders inline, immediately after the title.
- **Given** none of `title` / `tag` / `timestamp`
  **Then** no header renders at all — a body-only item is legitimate.
- **Given** `children`
  **Then** they render as the event body below the header. The body is
  free-form: a paragraph, an `Alert`, a `DescriptionList` of properties, a
  `Collapsible`, or a nested `Timeline`.
- **Given** an `actions` node
  **Then** a footer row renders below the body (the design's `FooterActions`
  slot). Without it, no footer row exists.

## The marker

- **Given** neither `marker` nor `icon`
  **Then** the built-in mark shows a centred dot in the resolved status color.
- **Given** an `icon`
  **Then** it renders inside the built-in status-tinted circle.
- **Given** a `marker`
  **Then** it replaces the built-in mark entirely and `status` / `icon` no longer
  affect the mark. This is the design's own case: the marker there is an `Avatar`
  instance, showing initials for a person or a type icon on a tinted circle.

## Status is subtle

- `status` is one of `neutral | info | success | warning | danger | critical`.
- **Given** a non-neutral `status`
  **Then** only the marker is tinted —
  `--ui-background-status-<status>-pressed` fill +
  `--ui-text-on-status-<status>` glyph, the same pairing `Metric`'s icon badge
  uses. The content card keeps the plain surface, so a long feed of mixed
  statuses stays readable.
- **Given** a `marker` slot **and** a `status`
  **Then** nothing is tinted (the slot owns its own appearance); `data-status`
  still reflects the resolved value for styling hooks and tests.

## The connector

- **Given** two or more items
  **Then** a 1px rail runs from each marker's bottom edge, centred under it,
  down through the 16px inter-item gap to the next marker.
- **Given** the last item (or a single item)
  **Then** its rail is hidden — there is nothing to connect to.
- **Given** `dir="rtl"`
  **Then** the marker moves to the trailing edge and the rail follows it, because
  the rail is positioned with a logical inset rather than `left`.

## What Timeline does not do

- No sorting, grouping, filtering, paging, or data fetching.
- No date formatting or localization — `timestamp` arrives ready to render.
- No domain event types: an "event" is whatever nodes the caller passes.

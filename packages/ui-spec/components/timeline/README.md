# Timeline

A chronological event list: activity feeds, audit logs, ticket histories, status
histories. A semantic `<ol>` of items, each a 32px marker + a connector rail + a
bordered content card.

## When to use

- A ticket's or asset's activity feed (comments, internal notes, status updates).
- An audit log or run history, where each entry can expand into properties, an
  alert, or sub-events.
- Any "what happened, in order" surface.

## When not to use

- For a plain key/value read-out — use [DescriptionList](../description-list/README.md)
  or [DetailList](../detail-list/README.md).
- For a stepped wizard/progress indicator — that is a different pattern with
  completed/current/upcoming semantics. Timeline has **no `current` state**
  (see below).
- To sort, group by day, paginate, or fetch — Timeline renders the order it is
  given.

## Parts

| Part             | Element | Notes                                                                |
| ---------------- | ------- | -------------------------------------------------------------------- |
| `Timeline`       | `ol`    | The list; 16px gap between items.                                    |
| `TimelineItem`   | `li`    | marker + connector + content card.                                   |
| `TimelineMarker` | `span`  | The built-in 32px status circle. Decorative; also usable standalone. |

## Example

```tsx
<Timeline>
  <TimelineItem
    marker={
      <Avatar color="green">
        <AvatarFallback>SJ</AvatarFallback>
      </Avatar>
    }
    title="Sarah Johnson"
    timestamp="Dec 22, 08:30 AM"
    tag={
      <Tag variant="success" size="sm">
        To customer
      </Tag>
    }
  >
    Confirmed the storage outage with the hosting provider.
  </TimelineItem>

  <TimelineItem
    status="critical"
    icon={<DiamondWarningIcon size={16} />}
    title="Error — Protection plan failed"
    timestamp="01:54 AM – 03:54 AM (2 hrs 0 min)"
    actions={<Link href="/support">Get support</Link>}
  >
    <p>The cloud storage is temporarily unavailable.</p>
    <DescriptionList>…</DescriptionList>
  </TimelineItem>
</Timeline>
```

## The marker is a slot

In the design, the marker is an **`Avatar` instance** — initials for a
person-authored event, or a type/status icon on a tinted circle. So `marker` here
is a slot: pass whatever mark the event deserves.

Omit it and you get the built-in `TimelineMarker`: a status-tinted circle holding
`icon`, or a centred dot. Its tint is the same
`--ui-background-status-<s>-pressed` + `--ui-text-on-status-<s>` pairing
[Metric](../metric/README.md)'s icon badge uses, so the two agree.

## Deliberately absent from v1

**No `size`, no `density`, no `current` state.** The Figma `TimelineItem`
(`7615:7791`) is a single symbol with **no variant set** — nothing on page
`6025:24403` gives those axes design authority, and an unbacked variant is
spec-conformance and visual-regression surface with no design behind it. Add them
when Figma introduces them; this is a decision, not an oversight.

Two further cases the design _sketches_ in hand-drawn frames (not published
components), so they are **not** API: a collapsible item with a disclosure
chevron, and a nested timeline inside an item. Both are reachable today by
composing into `children` (a `Collapsible`, or another `Timeline`) — the content
slot is deliberately wide enough that neither needs a new prop later.

## Notes

- **Design authority**: Figma page "Timeline" `6025:24403`, component
  `TimelineItem` `7615:7791`. Code Connect:
  `packages/ui-react/src/components/ui/timeline/timeline.figma.tsx`.
- No `--ui-timeline-*` tier — every color in the design resolves to an existing
  shared semantic token, including the connector rail, whose vector is stroked
  with exactly `--ui-border-on-surface-border`.
- The `timestamp` is rendered verbatim; the kit never formats or localizes dates.

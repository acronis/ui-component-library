# Timeline — accessibility

- **Semantic list.** `Timeline` is an `<ol>` and each item an `<li>`, so
  assistive tech announces the item count and each item's position — the
  chronology is conveyed structurally, not just visually by the rail.
- **The marker and the connector are decorative** (`aria-hidden`). The status is
  therefore never carried by the mark alone: the meaning must be in the item's
  `title` / `children` (e.g. title "Error — protection plan failed", not a red
  dot). A consumer-supplied `marker` is the consumer's to label — if it carries
  meaning (an avatar identifying a person not named in the title), give it an
  accessible name.
- **Status is not color-only.** It tints the marker only, and the marker is
  hidden from assistive tech, so any status meaning has to appear in text.
- **Reading order matches visual order**: marker → title → tag → timestamp →
  content → actions, so an item reads as a coherent sentence.
- **The timestamp is plain text.** Wrap it in a `<time datetime="…">` via the
  `timestamp` node when a machine-readable value matters — the kit does not
  synthesize one, because it never parses or formats the date.
- **Timeline itself adds no tab stops.** Only what the caller puts in `children`
  or `actions` is focusable, and those keep their own semantics (a `Link` stays a
  link, a `Collapsible` keeps its disclosure behavior).
- **Nested timelines nest their lists**, so the inner list is announced as a
  sub-list of its item — which is what a run-with-sub-events is.
- The title truncates when the row is narrow. Where truncation would lose
  meaning, widen the container or move the full text into the body.

## Keyboard

Timeline defines no keys of its own — it is not a composite widget and does not
manage focus. Tab order follows DOM order through whatever interactive content
the caller composes.

## Contrast

The card uses the primary surface with the shared border token; the title resolves
the primary surface-text token and the timestamp the secondary one. Each marker
pairs a light status background (`--ui-background-status-<s>-pressed`) with its
readable status glyph color (`--ui-text-on-status-<s>`) — both halves from the
same designed status family, so the pairing is not arbitrary. All meet contrast in
light and dark.

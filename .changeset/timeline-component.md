---
'@constructor-lab/ui-react': minor
---

Add `Timeline` — a chronological event list for activity feeds, audit logs and
status history. `Timeline` is a semantic `<ol>`; each `TimelineItem` is an `<li>`
laying out a 32px marker, a 1px connector rail (hidden on the last item, and
positioned with a logical inset so it follows the marker under RTL), and a
bordered content card holding a header (title + optional inline `tag` ·
right-aligned `timestamp`) over a free-form body, with an optional `actions` row.
Purely presentational — it never sorts, groups, paginates, fetches, or formats a
date. `TimelineMarker` is exported for standalone use.

Derived from the Figma `TimelineItem` component (page `6025:24403`, node
`7615:7791`) with a real Code Connect mapping. Because the marker there is an
`Avatar` **instance**, `marker` is a slot; omitting it renders the built-in
status-tinted mark, whose `--ui-background-status-<s>-pressed` +
`--ui-text-on-status-<s>` pairing matches `Metric`'s icon badge. No
`--ui-timeline-*` tier — every colour in the design resolves to an existing shared
semantic token.

v1 ships **no `size` / `density` / `current` axes**: the Figma component is a
single symbol with no variant set, so nothing in the design backs them.

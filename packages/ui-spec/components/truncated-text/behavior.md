# TruncatedText — Behavior

## Truncation detection

### Reveals a tooltip only when the text is clipped

**Given** a TruncatedText whose text overflows its container
**When** it renders (or the container resizes so the text no longer fits)
**Then** the text is clipped with an ellipsis
**And** the text element becomes a tooltip trigger that reveals the full,
untruncated value on hover / focus.

### Attaches no tooltip when the text fits

**Given** a TruncatedText whose text fits within its container
**When** it renders
**Then** it renders as plain text with no tooltip trigger — so short cells do
not get a pointless hover target.

### Re-checks on resize

**Given** a rendered TruncatedText
**When** its container is resized (e.g. a table column narrows or the viewport
changes)
**Then** the truncated state is re-evaluated (via a ResizeObserver), so the
tooltip appears or disappears to match whether the text is currently clipped.

## Single vs multi-line

### Single-line ellipsis by default

**Given** a TruncatedText with no `lines` (or `lines = 1`)
**When** it renders
**Then** it uses a single-line ellipsis (`truncate`) and detects overflow by
comparing scroll vs client **width**.

### Multi-line clamp when `lines > 1`

**Given** a TruncatedText with `lines` greater than 1
**When** it renders
**Then** it clamps to that many lines (`-webkit-box` line-clamp) with an ellipsis
on the last line, and detects overflow by comparing scroll vs client **height**.

## Tooltip placement

**Given** a truncated TruncatedText with `side`
**When** the tooltip opens
**Then** it opens on the requested side (defaulting to `top`)
**And** it portals into `portalContainer` when provided (else the document body).

## Content

**Given** a string child
**When** it renders
**Then** that exact string is both the visible (possibly clipped) text and the
tooltip body.

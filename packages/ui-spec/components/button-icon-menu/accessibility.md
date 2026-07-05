# ButtonIconMenu — Accessibility

## Roles

- The control is a native `<button>` (or the element supplied via `render`).
- It sets `aria-haspopup="menu"` to announce that it opens a menu.

## Name

- Icon-only: it has **no visible text**, so it must carry an accessible name.
  `aria-label` defaults to **"More options"**; override it with something
  contextual when there are several on a screen (e.g. "Backup actions").

## State

- `aria-expanded` reflects the `open` prop — `"true"` while the menu is open, and
  is omitted while closed. Keep `open` in sync with the actual menu.

## Keyboard

- Tab moves focus to the button; Enter / Space activate it (native button
  behavior). Menu navigation itself belongs to the menu the button controls.

## Focus

- A visible 3px `--ui-focus-primary` ring marks keyboard focus, flush to the
  button edge. Focus is never suppressed without a replacement indicator.

## Contrast

- Fill, icon, and border colors come from the `--ui-button-icon-*` tokens that
  meet the contrast bar per theme; do not override them with ad-hoc colors.

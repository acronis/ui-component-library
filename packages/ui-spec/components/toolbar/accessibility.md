# Toolbar — accessibility

- The root is a **`role="toolbar"`** landmark (set by Base UI Toolbar.Root).
  Provide an accessible name with **`aria-label`** (or `aria-labelledby`) — e.g.
  `aria-label="Selection actions"` — so the toolbar is distinguishable when a
  page has more than one.
- **Keyboard model** (Base UI roving tabindex):
  - `Tab` enters/leaves the toolbar as a single stop (only one item is tabbable).
  - `ArrowRight` / `ArrowLeft` move between items in a horizontal toolbar
    (`ArrowDown` / `ArrowUp` when `orientation="vertical"`).
  - `Home` / `End` jump to the first / last item.
  - `loopFocus` (default `true`) wraps focus at the ends.
- **Disabled items stay focusable** (`aria-disabled="true"` rather than the native
  `disabled` attribute) so assistive-tech users can still discover them; activation
  is a no-op.
- **Actions** are real `<button>` / `<a>` elements — give each a clear label
  (icon-only actions need an `aria-label`).
- **`ToolbarStatus`** is plain secondary text, not focusable and not part of the
  roving order; keep the selection/count wording meaningful on its own.
- **Separators** are decorative (`role="separator"`, no focus).
- **Contrast:** action and status colors come from the shared `--ui-*` tokens,
  which meet contrast in both light and dark themes.

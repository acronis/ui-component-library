# FittedActions — accessibility

- Inline actions are real `<button>` elements (default a ghost `Button`), so they
  are focusable and operable by keyboard. Give each action a clear `label`;
  icon-only actions need an accessible name.
- The **overflow trigger** is a menu button — it exposes `aria-haspopup` /
  `aria-expanded` and opens the `ButtonMenuDropdown`, which owns roving focus,
  `Escape` to close, and type-ahead (Base UI Menu).
- The **tracing layer** used for measurement is `aria-hidden` and removed from the
  focus order, so the duplicate action clones are never announced or tabbed to.
- A `divided` overflow item is only a visual separator; it carries no role of its
  own.
- When embedded in a `Toolbar`, pass a roving `ToolbarButton` via `renderAction`
  so the inline actions join the toolbar's single-tab-stop arrow-key model.
- **Contrast:** action and menu colors come from the shared `--ui-*` tokens, which
  meet contrast in both light and dark themes.

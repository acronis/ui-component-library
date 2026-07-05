# ButtonIconMenu — Behavior

## Rendering

**Given** a `ButtonIconMenu`
**Then** it is a 32×32 bordered square with the built-in ellipsis ("more") glyph
centered at 16px, and an accessible name (default "More options").

## Opening a menu

**Given** a `ButtonIconMenu` wired to a menu
**When** the user activates it (click, Enter, or Space)
**Then** it fires `click` — the consumer toggles the menu and sets `open`
accordingly.

**Given** `open` is `true`
**Then** the container and border take their `*-active` colors and
`aria-expanded="true"` is reflected; `data-open` is present.

**Given** `open` is `false` (or unset)
**Then** no `data-open` is present and `aria-expanded` is omitted.

> ButtonIconMenu is **presentational** — it renders the trigger and reflects
> `open`; it does not own the menu. Keep `open` in sync with the menu you control,
> or compose it onto a menu trigger via the `render` prop.

## Disabled

**Given** `disabled` is `true`
**When** the user attempts to activate it
**Then** no `click` fires and the disabled token set applies (fill, icon,
border).

## Press & focus

**When** pressed (`:active`) the container/icon take the `*-active` colors.
**When** focused via keyboard (`:focus-visible`) a 3px `--ui-focus-primary` ring
is shown flush to the edge.

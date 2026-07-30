# ButtonIconInput — Behavior

## Rendering

**Given** an icon as `children`
**When** the button renders
**Then** the glyph is centered in a 20×20 container and sized to 16px from the
variant's `icon-size` token.

**Given** no explicit `type`
**When** the button renders
**Then** it is `type="button"` — the control lives inside a form field and must
not submit it.

## Variant

**Given** `variant="normal"` (the default)
**Then** the container fill and glyph come from the
`--ui-button-icon-input-normal-*` tokens and keyboard focus paints a 3px
`--ui-focus-primary` ring.

**Given** `variant="error"`
**Then** the container fill and glyph come from the
`--ui-button-icon-input-error-*` tokens and keyboard focus paints a 3px
`--ui-focus-error` ring — matching the error column of the Figma field designs.

## Interaction

**Given** the button is enabled
**When** the pointer hovers / presses it
**Then** the container fill and glyph shift to their `-hover` / `-active` tokens.

**Given** the button
**When** it is activated (click, Enter, or Space)
**Then** `click` fires.

**Given** `disabled`
**Then** pointer events are suppressed, `click` does not fire, and the disabled
tokens apply. In the `error` variant the glyph falls back to the `normal`
disabled color, which is the only disabled glyph token the tier emits.

## Composition

**Given** a `render` prop
**When** the button renders
**Then** the underlying `<button>` is replaced by the supplied element with the
component's props and classes merged onto it (Base UI `useRender`).

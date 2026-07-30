---
'@constructor-lab/ui-react': minor
---

Add `ButtonIconInput` and `InputPassword`, the two components behind the Track 3
token tiers.

`ButtonIconInput` is the 20×20 icon affordance that lives inside an input box (a
clear ✕, a reveal eye, a search trigger) — a distinct component from
`ButtonIcon`, not a size of it: a smaller container, 2px padding around a 16px
glyph, and a `normal` / `error` variant so the affordance follows its field into
the error treatment (including the focus ring, which switches to
`--ui-focus-error`).

`InputPassword` is the password field: label, required marker, masked box, the
reveal toggle, and a description or error message. It consumes its own
`--ui-input-password-*` tier rather than the `Input` primitive's
`--ui-input-text-*` one, and its box reserves inline-end room for the toggle
computed from tokens. The reveal state is uncontrolled by default and can be
driven via `revealed` / `onRevealedChange`.

---
'@constructor-lab/tokens': minor
---

**Figma re-sync of the typography scale. Contains a breaking removal** — read
the first section before upgrading.

## Removed

Two heading styles were deleted in Figma and no longer emit a class:

- `.ui-typography-headings-heading` (was `16px / 500 / 24px`)
- `.ui-typography-headings-caption-heading` (was `14px / 700 / 16px`)

These are not renames. `headings/lead` and `headings/lead-numeric` keep their
original Figma style ids (`S:654373…`, `S:984c…`); the two above are gone and
`headings/section` is new. The re-ordering in `dtcg/` and `tiers/` reads like a
rename only because the keys are serialized alphabetically.

A consumer still applying either class **loses all five declarations silently**
— no build error, no missing-variable warning, just inherited typography. This
repo's own Toast hit exactly that; see the `@constructor-lab/ui-react` changeset.
Migrate `.ui-typography-headings-heading` to `.ui-typography-headings-lead`
(`18px / 400 / 24px`) or, if the 16/500 metrics matter more than the semantic
slot, pin them locally.

## Added

- `.ui-typography-headings-section` — `20px / 500 / 24px`, a new Figma style
  sitting between `lead` and `title`.
- `--ui-font-font-size-20` — the `20px` primitive `section` resolves through.

## Changed

- `Toast`'s `content/textContainer/title/textStyle` now binds to
  `typography.headings.lead`, so
  `.ui-toast-global-content-text-container-title-text-style` renders
  `18px / 400` instead of `16px / 500`. The Figma hint used to name a token that
  did not exist, which the emitter dropped rather than emit as a dangling alias;
  the corrected hint now resolves.
- The `Notification` component group is gone. It held only the malformed
  `content/gap 2` duplicate that the emitter already skipped as an invalid CSS
  custom-property name, so nothing was ever emitted for it — this just removes
  the resulting empty `:root, :host {}` block from `scss/_tokens.scss`.

## Not a change

The bulk of the diff is Figma metadata with no effect on generated output:
`com.figma.hiddenFromPublishing` flags, and `com.figma.scopes` narrowed from
`ALL_SCOPES` to specific scopes (`GAP`, `WIDTH_HEIGHT`, `STROKE_COLOR`,
`EFFECT_FLOAT`) or with a stray `FONT_VARIATIONS` dropped. **No colour value
changed anywhere in this sync.** Rebuilding from `tiers/` reproduces the
committed `css/`, `scss/` and `js/` byte-for-byte.

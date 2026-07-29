---
'@constructor-lab/tokens': minor
---

feat(tokens): emit the ButtonIconInput, InputPassword, Footer and Popover component tiers

Adds four component token tiers that already existed in the Figma variable snapshot
but were absent from the emitter allowlist (`DEFAULT_COMPONENTS` in
`tools/token-emit/helpers/emit-components-builder.mjs`, now 32 names / 28 emitting).

- **`--ui-button-icon-input-*`** and **`--ui-input-password-*`** gate the
  `ButtonIconInput` + `InputPassword` components — neither can be themed without them.
- **`--ui-popover-*`** and **`--ui-footer-*`** are emitted alongside because they gate
  four separately-confirmed fixes (Popover's Figma sync, and Dialog's footer tier).
  No component consumes them yet; they are published so that work can proceed.

Six component groups present in the snapshot remain deliberately ungated:
`ButtonGroup`, `Carousel`, `Chat`, `InputOTP`, `SegmentControl`, `SearchGlobal`.

**Strictly additive — verified at the value level, not the text level.** The
re-emit reflows JSON lines, so `git diff` reports deletions that are pure
re-serialization. Flattening every modified file to leaf paths and comparing
against `HEAD` gives, across all 22 changed JSON files: **3375 leaves added, 0
removed, 0 changed, and 0 additions outside the four new groups.** A control emit
with the allowlist unchanged reproduced the committed tiers byte-for-byte first,
which is what makes that attribution sound — it rules out the snapshot being ahead
of `main`.

Output: four new `css/components/*.css` files, four `@import` lines in
`css/index.css`, plus additive-only entries in `tiers/components.json`,
`scss/_tokens.scss`, `js/tokens.js` and `dtcg/components-*.json` (×21 brands).
No existing token's name or value moves, so no consumer needs to change.

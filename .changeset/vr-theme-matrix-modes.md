---
'@constructor-lab/ui-react': patch
---

**Visual regression**: complete the `[data-theme]` × OS `prefers-color-scheme`
cross product with two new capture profiles, `system-light` and `forced-dark`.

Light/dark is decided by two independent inputs — the `[data-theme]` attribute a
consumer sets, and the OS preference the tokens' `color-scheme: light dark`
defers to when that attribute is absent. Six states are reachable; four were
captured. The two that were not:

- **`system-light`** — no attribute, OS light, compares against the light
  baselines. The control for `system-dark`: a `prefers-color-scheme` fallback
  that over-reaches or inverts its condition renders dark here, and `system-dark`
  passing cannot distinguish that from a correct implementation.
- **`forced-dark`** — `[data-theme='dark']` with the OS **also** dark and no
  inline `color-scheme`. Not a duplicate of `dark`, which pins `color-scheme`
  inline and leaves the OS at light: this is the only profile where the
  stylesheet's `[data-theme='dark']` rule and a `prefers-color-scheme: dark`
  fallback are both live, so a fallback that fights the attribute shows up here
  and nowhere else.

Both own no baselines and run the same curated ~16% story subset as the existing
two, so each costs a fraction of a full leg. Verified against the current corpus:
all four subset profiles pass 127/127 stories with 0 snapshots written.

Also in the capture script (`scripts/visual-capture.mjs`):

- `--mode themes` runs all four non-baseline profiles, `--mode all` runs all six;
  `--mode both` keeps its meaning (light + dark). Mode resolution is now a pure,
  unit-tested function that throws — naming the whole vocabulary — instead of a
  scattered `includes` check.
- Its mode lists are now exported and **cross-checked against `VISUAL_PROFILES`**
  in a test. The mirror was previously a comment; the two halves fail
  asymmetrically, because a subset profile the script does not know to be one is
  treated as a baseline owner, and then `--update` is no longer refused for it.
- The CI matrix routes a leg by a `subset: true` field rather than by listing
  profile names in each step's `if:`, so adding a profile cannot silently run it
  as a baseline-owning leg.

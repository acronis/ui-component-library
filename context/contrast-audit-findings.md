# Contrast audit — findings, causes, and fix options

**Date:** 2026-07-31 · **Tool:** `pnpm --filter @constructor-lab/ui-spec story-audit`
**Last updated:** 2026-07-31, after fixing A and re-classifying C.

**Status**

| cause                             | state                                                                           |
| --------------------------------- | ------------------------------------------------------------------------------- |
| **A** — secondary text token      | **fixed** — see §4A. Token retargeted, guard test added, changeset written.     |
| **C** — dark-on-dark table header | **withdrawn** — it was an artifact of this tool, not a product defect. See §4C. |
| B, D, E, F                        | open. Design decisions; B and E touch brand colour.                             |

Everything still marked open is a **proposal**, not a recommendation to act
unilaterally.

---

## 1. Why this audit exists

The visual-regression suite compares a render against a committed PNG. That
detects **change**. It cannot detect **wrongness**, because the baseline is its
own oracle — a screenshot that was wrong the day it was recorded passes forever.

Two live examples, both found in the session that produced this report:

- **Autodocs rendered Accordion's triggers white on white.** VR could not have
  caught it at any threshold: `@storybook/test-runner` filters `type === 'docs'`
  out of its index before generating tests, so docs pages are structurally
  unreachable by that harness.
- **`ui-toast--default.png` was recorded mid-animation**, before the toast
  painted. It showed a bare button for months and passed every run — while its
  own dark counterpart showed the toast.

A contrast assertion needs no baseline. It compares foreground against the
colour actually painted behind it and gets the answer from WCAG.

## 2. Method

`story-audit` renders every Storybook page in four theme states and runs the
existing `accessibility/contrast` detector (grammar rule **I5**, severity
`must`) over a `collectScreenSnapshot` capture.

|           |                                                                    |
| --------- | ------------------------------------------------------------------ |
| pages     | 286 (181 story titles, first story each + 105 autodocs pages)      |
| profiles  | `light`, `dark`, `system-dark`, `forced-light`                     |
| renders   | 1144                                                               |
| threshold | WCAG AA — 4.5:1 normal text, 3:1 large (≥24px, or ≥18.66px at 700) |

Exempt, matching the detector's existing rules: icons, disabled subtrees (WCAG
1.4.3 places no contrast requirement on inactive components), and elements that
paint no text of their own.

CSS transitions and animations are disabled before the theme is switched, so
every measurement is of a settled colour. Skipping that step invents findings —
see §5.

**Declared coverage limits** — none of these are silent:

- One story per title. A second story of the same title almost always re-tests
  the same token pairs.
- Docs pages are measured at `.docs-story`, the first rendered story block. This
  deliberately excludes Storybook's own chrome (headings, args tables, syntax
  highlighting) — see §6.
- Static capture only: no hover, focus, or open-overlay states.
- Single brand (`acronis`) for the main sweep. The other 20 are now covered by
  the `Foundations/Brand Matrix` stories and by `brand-contrast` — see §4G — but
  only through one schematic frame, not the whole corpus.

## 3. Results

Numbers below are the **pre-fix** sweep, kept as the record of what was found.
Cause A has since been fixed and cause C withdrawn, so a re-run measures
substantially less; the post-fix totals are recorded in §9.

```
424 findings · 27 distinct colour pairs · 109 of 286 pages
```

| profile / view         | findings |
| ---------------------- | -------: |
| `dark` / story         |      146 |
| `system-dark` / story  |      146 |
| `dark` / docs          |       54 |
| `system-dark` / docs   |       54 |
| `light` / story        |       11 |
| `forced-light` / story |       11 |
| `light` / docs         |        1 |
| `forced-light` / docs  |        1 |

**400 of 424 findings are dark-mode.** `dark` and `system-dark` agree exactly, as
do `light` and `forced-light` — which is itself a useful result: it means the two
OS-driven profiles resolve identically to their attribute-driven counterparts, so
the `prefers-color-scheme` wiring is correct and this is a _palette_ problem, not
a theme-switching one.

424 findings collapse to **six causes**:

| #   |       ratio | count | pages | cause                                                           |
| --- | ----------: | ----: | ----: | --------------------------------------------------------------- |
| A   |   3.08–3.86 |   287 |   43+ | secondary text token has no dark value                          |
| B   |   2.80–2.90 |    49 |    22 | white on brand blue                                             |
| C   |   1.36–1.42 |    17 |     3 | dark-on-dark table header text                                  |
| D   | 2.13 / 2.66 |    16 |     6 | input placeholder, both themes                                  |
| E   |        4.36 |     6 |     3 | white on danger red                                             |
| F   |        1.00 |     2 |     1 | inverse button on a light story canvas                          |
| G   |   1.00–4.34 |   416 |   all | fixed white foreground over per-brand fills (found later — §4G) |

---

## 4. Causes and fix options

### A — `--ui-text-on-surface-secondary` has no dark value (287 findings, 68%)

`--ui-palette-grayscale-*` is a **mirrored** ramp: index _N_'s light value is
index _14−N_'s dark value.

| token             | light             | dark              | mirrors   |
| ----------------- | ----------------- | ----------------- | --------- |
| `grayscale-5`     | `175 178 182`     | `85 89 94`        | 5 ↔ 9     |
| `grayscale-6`     | `135 139 146`     | `97 101 107`      | 6 ↔ 8     |
| **`grayscale-7`** | **`109 114 120`** | **`109 114 120`** | **7 ↔ 7** |

7 is the midpoint of a 15-step ramp, so the mirror maps it onto itself. **Its
dark value equals its light value by construction, not by mistake.**

`--ui-text-on-surface-secondary: var(--ui-palette-grayscale-7)` — so the
secondary text colour is the one grey that never changes, while every surface
behind it does:

| surface                      | ratio | verdict         |
| ---------------------------- | ----: | --------------- |
| `#ffffff` (light)            |  4.85 | passes, by 0.35 |
| `rgb(31,32,34)` dark surface |  3.36 | **fails**       |
| `rgb(18,18,18)` dark canvas  |  3.86 | **fails**       |

**Options**

1. **Retarget the semantic to `grayscale-8`** _(recommended)_ — 5.86 light /
   4.77 dark surface / 5.48 dark canvas. Clears AA everywhere, one step along the
   existing ramp, invents no colour value.
2. **Give `grayscale-7` a distinct dark value.** Wider blast radius: three other
   semantics ride the same palette entry —
   `--ui-background-status-strong-neutral`,
   `--ui-border-on-surface-border-active`,
   `--ui-glyph-on-backdrop-element-primary` — and would all shift.
3. **Accept and waive.** Only defensible if this text is classed as
   non-essential; at 3.36:1 it is visibly dim, not merely non-compliant.

**Where the change belongs:** `packages/tokens/css/` is **generated**. The edit
goes in the DTCG source tier (ultimately the Figma variable), never the emitted
CSS. Option 1 is a semantics-tier change; option 2 is a primitives-tier change.

#### Resolved — option 1, 2026-07-31

`packages/tokens/tiers/semantics.json`: `colors.text.onSurface.secondary` now
aliases `{palette.grayscale.8}`. Rebuilt through `tools/style-dictionary`;
propagated to all 21 brands. Changeset: `.changeset/olive-pumas-repeat.md`
(`minor` on `@constructor-lab/tokens`).

**Visual-regression churn:** 30 of 766 light baselines and 35 of 766 dark. That
undercounts the components affected — secondary text appears on far more stories,
but on most it covers too little area to cross the 0.5% gate, so those baselines
legitimately do not move (the `#101` floor).

**Guard:** `packages/ui-react/src/styles/__tests__/token-contrast.test.ts`
computes contrast from the generated CSS and fails if `grayscale-7` returns. This
matters because `tiers/` is re-emitted from Figma by `pnpm tokens:sync`, and the
sync is one-way — the next design sync will re-propose the old alias as a diff.
The guard also asserts the general property: `grayscale-7` is the ramp's only
fixed point, and **no** text semantic may target it. Negative-controlled by
reverting the tier, which reproduced exactly the ratios the browser measured
(3.36 and 3.63).

**Still owed:** the Figma variable is unchanged, so the repo carries a deliberate
deviation and the guard will go red on every token sync until design updates it.
Request drafted at
`.ai/explorations/design-request-secondary-text-contrast.md`.

### B — white on brand blue (49 findings, 22 pages)

> **Superseded in scope by §4G.** B is what this defect looks like under the
> default brand alone. The general form — a fixed white foreground over a
> per-brand fill — affects all 21 brands and is far worse on the light ones.

White text on `rgb(79,155,245)` / `rgb(81,157,246)` / `rgb(78,154,244)` — the
dark-mode value of `--ui-palette-blue-4` — measures **2.80–2.90:1**.

Affects the primary action across the library: Button, ButtonMenu, Toast,
AlertDialog, Card, Form, Tabs, AppShell, AuthLayout, PageHeader, SidebarPrimary.

**Options**

1. **Darken the dark-mode brand blue** until white clears 4.5:1. Changes brand
   colour — needs design sign-off.
2. **Switch the label to a dark foreground** on that fill. Usually worse: light
   text on a mid-blue is the established look.
3. **Waive as large-text** where it applies. Only legitimate for ≥18.66px/700
   labels; standard button text is 14px, so this covers few cases.
4. **Accept as a documented brand exception**, recorded in
   `packages/ui-spec/grammar/overrides/` with an expiry.

This one is worth a deliberate decision rather than a default: it is the most
visible control in the library, and 2.8:1 is a real readability cost, not a
rounding error.

### C — WITHDRAWN: dark-on-dark table header text was a measurement artifact

Originally reported as 17 findings at ~1.4:1 on
`tr > th:nth-of-type(N) > button > span` in `components-datatable--default` and
`components-datagrid-columns-features--resizing`, and called "the most likely
genuine defect in the list".

**It is not a defect.** Measured directly in the browser after letting the page
settle:

| theme | colour             | background         |  contrast |
| ----- | ------------------ | ------------------ | --------: |
| light | `rgb(24,25,27)`    | `rgb(255,255,255)` | **17.59** |
| dark  | `rgb(244,245,245)` | `rgb(18,18,18)`    | **17.15** |

The element carries `transition: all`, so switching `[data-theme]` animates
`color` and the audit's 120 ms settle wait sampled mid-transition — reading a
value that belongs to neither theme.

**The tell was in the original report and was missed:** `rgb(44,45,47)`,
`rgb(45,46,48)` and `rgb(47,48,50)` are three near-identical greys that match no
palette entry. A real finding names a colour the palette actually contains;
values between two token colours mean something was caught in motion.

Fixed in the tool, not the component — `story-audit` now injects
`transition: none !important` before flipping the theme. Waiting longer was
rejected: a wait is a guess that goes stale against the next animation, and this
failure mode is silent, producing a plausible number rather than an error.

### D — input placeholder text (16 findings)

`rgb(175,178,182)` on white (**2.13**) and `rgb(85,89,94)` on the dark canvas
(**2.66**) across InputText, InputPassword, InputSearch, InputTextArea,
InputDatePicker.

These are `grayscale-5` / `grayscale-9` — a correctly-mirrored pair, so both
themes are equally low by design.

**Options**

1. Move the placeholder token one or two steps toward the ramp's centre.
2. **Waive.** WCAG treats placeholder text as ordinary text, but a placeholder
   that matches body-text contrast stops reading as a placeholder. Many design
   systems accept this deliberately — if so, record it as an override rather
   than leaving it to resurface every run.

### E — white on danger red (6 findings, 4.36:1)

`rgb(226,54,54)` — `--ui-palette-red-7` light. Misses 4.5 by **0.14**. A minimal
darkening clears it.

### F — inverse button on a light story canvas (2 findings, 1.00:1)

`ui-button-all-states-generated--variants`, 5th button, light and forced-light:
white on white.

Most likely a **story-fixture** problem, not a component one — an inverse/on-brand
variant rendered on the default light canvas with no dark backdrop behind it. Fix
the generated story to place that variant on an appropriate surface. Worth
confirming before treating it as a component defect.

---

### G — a fixed white foreground over 21 different brand fills

**Every one of the 21 brands is affected, including the default.** This was
invisible to everything above: `story-audit` renders the `acronis` brand only, so
the whole brand axis was unmeasured.

`--ui-text-on-brand-primary` resolves to white for all brands, while
`--ui-background-brand-*` resolves to each brand's own colour. That is safe on a
dark brand and unreadable on a light one. `SidebarPrimary` menu items are the
worst case; the primary Button and Tag share the pattern.

Measured in a real render (light mode, `Foundations/Brand Matrix`):

| brand               | foreground on background                      |    ratio |
| ------------------- | --------------------------------------------- | -------: |
| `telstra`           | `rgba(255,255,255,0.6)` on `rgb(255,255,255)` | **1.00** |
| `light-gray`        | white on `rgb(195,231,249)`                   | **1.30** |
| `yellow-1c`         | white on `rgb(236,193,9)`                     | **1.72** |
| `virtual-one`       | white on `rgb(101,190,236)`                   | **2.07** |
| `red-home-pl`       | white on `rgb(255,194,194)`                   | **1.53** |
| `acronis` (default) | white on `rgb(23,99,207)`                     |   5.64 ✓ |

`telstra` is white text on a white sidebar — completely invisible, not merely
low-contrast.

**Scale.** `brand-contrast` (see §8) checks the component tier statically:
**416 pairs below threshold, 27 distinct, 21/21 brands.** The rendered audit
confirms 24 findings across 16 of 21 brands in light mode alone.

**Options**

1. **Make the on-brand foreground vary with its fill** — the same shape as A's
   fix: a foreground pinned to one value cannot serve backgrounds chosen for
   brand identity. Requires a per-brand `text-on-brand` value, or a token that
   selects light/dark text by the fill's luminance.
2. **Constrain brand fills** to a luminance range where white clears 4.5:1.
   Rejects several shipped brands outright — a brand governance decision, not a
   token one.
3. **Waive per brand.** Defensible only for brands not used in production.

This is squarely a design decision and touches 21 brand identities. Not actioned.

**Two caveats on the numbers.** `brand-contrast` infers which foreground pairs
with which background from token naming — findings are candidates until rendered
(the SidebarPrimary predictions were confirmed at 1.30 and 1.72, but other
component families are unverified). And the rendered figures cover light mode
across the brand-matrix frame, not every component in every brand.

## 5. Three tool bugs found while building this

Recorded because each one produced confident, plausible, wrong numbers rather
than an error — and the first two were latent in the **shared** probe that
`screen-audit` also uses.

| bug                                                                | effect                                                                                                                          | fix                                                                                                                                                    |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `effectiveBg` fell back to white when nothing painted a background | On a Storybook story the UA canvas _is_ the background, so every light-on-dark label scored ~1:1 against an imaginary white     | Derive from the used `color-scheme`; dark canvas is `rgb(18,18,18)`, measured from the corner pixel of the committed `ui-accordion--default--dark.png` |
| Alpha was never composited                                         | An `rgba(0,0,0,0.01)` hairline wash counted as an opaque **black** background — **4536 false findings, 74% of the first sweep** | Collect layers to the first opaque one and blend with the `over` operator                                                                              |

| bug                                         | effect                                                                                                                                        | fix                                                                  |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Theme flipped without disabling transitions | `color` animates, so measurements landed mid-transition and invented **cause C** — 17 findings at ~1.4:1 on elements that really measure 17:1 | Inject `transition: none !important` before switching `[data-theme]` |

First sweep: 6117 findings / 44 pairs / 172 pages.
After the two probe fixes and the docs rescope: 424 / 27 / 109 — 93% of the
original was measurement error. After the transition fix, cause C's 17 go too.

**The pattern is worth naming.** All three failed silently, and the audit's own
output contained the evidence in each case: a background colour that no rule
sets, a "docs" run whose URL said `viewMode=story`, foreground colours absent
from the palette. A number that cannot be traced to a token is the signal that
the measurement, not the product, is wrong.

## 6. Why Storybook's own chrome is excluded

Measuring `body` on a docs page audits Storybook's UI too — its headings, args
tables, and syntax-highlighted code blocks. That contributed 224 findings of
`rgb(255,68,0)` on white at 3.45:1 across 18 docs pages, all of it Storybook's
code-block palette.

We cannot fix those without forking Storybook's docs theme, and they are not this
library's components. Gating on them would mean a permanently red check nobody
can clear — so the docs pass measures `.docs-story`, the rendered story block.

## 7. CI

`accessibility/contrast` is severity **`must`** in the grammar registry, so
wiring `story-audit` into CI as-is fails every PR on 424 pre-existing findings.

**A is now fixed and C withdrawn**, which together account for 304 of the
original 424. What remains is B (49), D (16), E (6), F (2) plus the long tail.

Options, in rough order of preference:

1. **Gate now on the remaining set**, waiving B/D/E explicitly. This is newly
   realistic — the bulk is gone.
2. **Gate on new findings only** — commit a baseline count or a finding
   fingerprint set, fail when it grows. Cheap, but a baseline of known-bad is the
   same "wrong oracle" pattern this tool exists to escape, so it should be
   temporary.
3. **Record overrides** in `packages/ui-spec/grammar/overrides/` for B, D, E and
   gate immediately. Per that registry's own rules, **only a human may add an
   override**, and each needs `reason`, `approvedBy`, `date`.
4. **Report-only** — run it, print findings, never fail. Honest, and better than
   nothing, but this repo's own experience is that a check which cannot fail gets
   ignored.

Each resolution should also get a `grammar/ledger/` entry, per the ledger's rule
that a finding is done only once a permanent check exists so it cannot recur.

## 8. Reproducing

```bash
pnpm --filter @constructor-lab/ui-react storybook:build
pnpm --filter @constructor-lab/ui-spec story-audit

# narrow while iterating
pnpm --filter @constructor-lab/ui-spec story-audit --title Accordion
pnpm --filter @constructor-lab/ui-spec story-audit --profiles dark --views story
pnpm --filter @constructor-lab/ui-spec story-audit --all      # every story
```

No Docker. Contrast reads computed values and applies WCAG arithmetic — both
platform-independent. Only _pixel_ comparison needs the pinned Linux renderer.

Implementation: `packages/ui-spec/scripts/story-audit.ts` (browser driver) and
`packages/ui-spec/screens/audit/story-audit.ts` (pure selection + reporting),
reusing `screens/audit/probe.ts` and the `accessibility/contrast` detector in
`screens/audit/detectors.ts`.

## 9. Post-fix sweep — measured 2026-07-31

```
102 findings · 10 distinct colour pairs · 36 of 286 pages
```

Down from 424 / 27 / 109. **Cause A: 0 remaining. Cause C: 0 remaining** — both
confirmed gone by measurement rather than by assumption.

| profile / view         | findings |
| ---------------------- | -------: |
| `dark` / story         |       28 |
| `system-dark` / story  |       28 |
| `light` / story        |       11 |
| `forced-light` / story |       11 |
| `dark` / docs          |       11 |
| `system-dark` / docs   |       11 |
| `light` / docs         |        1 |
| `forced-light` / docs  |        1 |

| ratio | count | pages | foreground on background                 | cause   |
| ----: | ----: | ----: | ---------------------------------------- | ------- |
|  2.80 |    56 |    28 | white on `rgb(81,157,246)`               | B       |
|  2.13 |     8 |     4 | `rgb(175,178,182)` on white              | D       |
|  2.66 |     8 |     4 | `rgb(85,89,94)` on `rgb(18,18,18)`       | D       |
|  4.36 |     6 |     3 | white on `rgb(226,54,54)`                | E       |
|  3.82 |     6 |     3 | white on `rgb(229,77,77)`                | E       |
|  1.89 |     6 |     1 | `rgb(175,178,182)` on `rgb(238,242,247)` | D (new) |
|  1.90 |     6 |     1 | `rgb(85,89,94)` on `rgb(46,47,50)`       | D (new) |
|  1.00 |     2 |     1 | white on white                           | F       |
|  1.48 |     2 |     1 | `rgb(190,215,244)` on white              | tail    |
|  2.28 |     2 |     1 | `rgb(41,81,122)` on `rgb(18,18,18)`      | tail    |

**B is now 55% of what is left** and the clear next decision: white on the
dark-mode brand blue, 2.80:1, across 28 pages.

Two rows are newly visible rather than new: placeholder text on a _raised_
surface (`1.89` / `1.90`) was previously buried under cause A's volume. Same
token pair as D, worse backdrop.

The remaining 102 are small enough that gating CI is now practical — see §7.

### Visual-regression cost of the A fix

`--mode both --update` rewrote **65 baselines**: 30 light, 35 dark. That matches
the check run's failure counts exactly, so nothing moved that was not predicted.

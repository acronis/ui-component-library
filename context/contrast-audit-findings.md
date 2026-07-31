# Contrast audit — findings, causes, and fix options

**Date:** 2026-07-31 · **Tool:** `pnpm --filter @constructor-lab/ui-spec story-audit`
**Status:** findings reported, nothing fixed. Every remedy below is a **proposal**;
the token changes are design decisions and two of them touch brand colour.

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

**Declared coverage limits** — none of these are silent:

- One story per title. A second story of the same title almost always re-tests
  the same token pairs.
- Docs pages are measured at `.docs-story`, the first rendered story block. This
  deliberately excludes Storybook's own chrome (headings, args tables, syntax
  highlighting) — see §6.
- Static capture only: no hover, focus, or open-overlay states.
- Single brand (`acronis`). The other 20 `[data-brand]` blocks are unmeasured.

## 3. Results

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

| #   |       ratio | count | pages | cause                                  |
| --- | ----------: | ----: | ----: | -------------------------------------- |
| A   |   3.08–3.86 |   287 |   43+ | secondary text token has no dark value |
| B   |   2.80–2.90 |    49 |    22 | white on brand blue                    |
| C   |   1.36–1.42 |    17 |     3 | dark-on-dark table header text         |
| D   | 2.13 / 2.66 |    16 |     6 | input placeholder, both themes         |
| E   |        4.36 |     6 |     3 | white on danger red                    |
| F   |        1.00 |     2 |     1 | inverse button on a light story canvas |

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

### B — white on brand blue (49 findings, 22 pages)

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

### C — dark-on-dark table header text (17 findings, ratio ~1.4)

`rgb(44,45,47)` / `rgb(45,46,48)` / `rgb(47,48,50)` on the `rgb(18,18,18)`
canvas, at `tr > th:nth-of-type(N) > button > span` in `components-datatable--default`
and `components-datagrid-columns-features--resizing`, dark mode only.

Near-invisible — a dark foreground that did not flip with the theme, on a header
row whose own background is also unpainted so the canvas shows through.

**This is the most likely genuine defect in the list** and the one to
investigate first: unlike A and B it is not a palette trade-off, it reads as a
wiring mistake. Needs a look at the DataTable header's colour token before a fix
is proposed.

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

## 5. Two probe bugs found while building this

Recorded because both inflated the first sweep enormously, and both were latent
in the **shared** probe that `screen-audit` also uses.

| bug                                                                | effect                                                                                                                          | fix                                                                                                                                                    |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `effectiveBg` fell back to white when nothing painted a background | On a Storybook story the UA canvas _is_ the background, so every light-on-dark label scored ~1:1 against an imaginary white     | Derive from the used `color-scheme`; dark canvas is `rgb(18,18,18)`, measured from the corner pixel of the committed `ui-accordion--default--dark.png` |
| Alpha was never composited                                         | An `rgba(0,0,0,0.01)` hairline wash counted as an opaque **black** background — **4536 false findings, 74% of the first sweep** | Collect layers to the first opaque one and blend with the `over` operator                                                                              |

First sweep: 6117 findings / 44 pairs / 172 pages.
After both fixes and the docs rescope: **424 / 27 / 109**. 93% of the original
was measurement error.

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

Options, in rough order of preference:

1. **Fix A + C first** (304 of 424, and C is a probable defect), then gate. The
   remainder is small enough to waive explicitly.
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

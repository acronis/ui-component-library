# Design request — three contrast defects in the shared token set

**To:** design systems · **Cc:** `acronis/uikit`
**Figma file:** `lrU3ydIyvPYQNE6ixdsKtJ` · **Variable:** `text/onSurface/secondary` (`VariableID:50:1434`)
**Raised by:** contrast audit, 2026-07-31 · **Repo fix:** already landed, see §5

---

## 1. Ask

**Three items**, in increasing order of how much design input they need. The
first is specified and ready; the second needs values; the third needs a
decision.

1. **Retarget** the semantic variable `text/onSurface/secondary` to alias
   `palette/grayscale/8` instead of `palette/grayscale/7`. Please do **not**
   change `palette/grayscale/7`'s own value — see §4.
2. **Supply** `sidebarprimary-label-*` and `-icon-*` for the **13 brands** that
   lack them, the way `telstra`, `light-gray` and `yellow-1c` already have. See
   §9 — those three are now fixed in code; the rest cannot be.
3. **Confirm or correct** that every brand's sidebar collapses to the same blue
   in dark mode, which drops brand identity and fails contrast. See §10.

Item 1 is ready to apply. Items 2 and 3 need values or a decision from you.

## 2. The problem

`text/onSurface/secondary` currently aliases `palette/grayscale/7`, and that
palette entry has **the same value in light and dark**: `rgb(109 114 120)`.

Secondary/muted text therefore keeps one colour while the surface behind it
flips, and it lands below the WCAG AA minimum (4.5:1 for normal text) on every
dark surface:

| surface                      | value              | contrast | AA             |
| ---------------------------- | ------------------ | -------: | -------------- |
| light surface `#ffffff`      | `rgb(109 114 120)` |     4.85 | pass (by 0.35) |
| dark surface `rgb(31 32 34)` | `rgb(109 114 120)` | **3.36** | **fail**       |
| dark canvas `rgb(18 18 18)`  | `rgb(109 114 120)` | **3.86** | **fail**       |

## 3. Why it happens — it is structural, not a typo

The grayscale ramp is **mirrored**: index _N_'s light value is index _14−N_'s
dark value.

| token             | light             | dark              | mirrors   |
| ----------------- | ----------------- | ----------------- | --------- |
| `grayscale-5`     | `175 178 182`     | `85 89 94`        | 5 ↔ 9     |
| `grayscale-6`     | `135 139 146`     | `97 101 107`      | 6 ↔ 8     |
| **`grayscale-7`** | **`109 114 120`** | **`109 114 120`** | **7 ↔ 7** |
| `grayscale-8`     | `97 101 107`      | `135 139 146`     | 8 ↔ 6     |

7 is the midpoint of a 15-step ramp, so the mirror maps it onto itself. It is
the **only fixed point** in the ramp — correct by the ramp's own logic, and for
that same reason the one entry that cannot serve as a foreground, because a
colour that never changes cannot contrast against surfaces that do.

Nothing is wrong with `grayscale-7`. What is wrong is a _text_ semantic pointing
at it.

## 4. Why `grayscale-8`, and why not edit `grayscale-7`

`grayscale-8` is one step along the existing ramp and clears AA everywhere. No
new colour value is introduced:

| surface                      | `grayscale-7` (now) | `grayscale-8` (proposed) |
| ---------------------------- | ------------------: | -----------------------: |
| light `#ffffff`              |                4.85 |                 **5.86** |
| dark surface `rgb(31 32 34)` |              3.36 ✗ |                 **4.77** |
| dark canvas `rgb(18 18 18)`  |              3.86 ✗ |                 **5.48** |

**Please change the semantic alias, not the palette entry.** Three other
semantics ride `grayscale-7` and would move with it:

- `background/status/strong-neutral`
- `border/onSurface/border-active`
- `glyph/onBackdrop/element-primary`

Those are fills, borders and glyphs, and none of them has the failure this is
about. Editing the palette entry would take a one-semantic fix and give it a
four-semantic blast radius.

**Visible change if accepted:** secondary/muted text becomes one ramp step
darker in light mode and one step lighter in dark mode.

## 5. Current state in code

The repo has **already made this change by hand** in
`packages/tokens/tiers/semantics.json`, because it was blocking accessibility
compliance in shipped components. That is a sanctioned path
(`packages/tokens/CONTRIBUTING.md` documents by-hand tier edits), but it creates
a divergence that matters to you:

- The Figma → repo sync is **one-way**, so every future `pnpm tokens:sync` will
  re-propose `grayscale-7` as a diff for a human to reject.
- A regression guard (`packages/ui-react/src/styles/__tests__/token-contrast.test.ts`)
  fails CI if `grayscale-7` comes back. **Until Figma is updated, that test will
  go red on every token sync.** It is deliberate — it forces this conversation
  rather than letting the fix disappear — but it is friction that only a Figma
  change removes.

## 6. Why this affects `acronis/uikit` too

Per `context/roadmap.md`, `acronis/uikit` renders from **this same Figma file**.
It therefore ships the same 3.36:1 failure. Fixing the variable in Figma fixes
both products; fixing it only in this repo means the two diverge on a token both
teams read.

Flagging so the change is not a surprise on their side.

## 7. Impact — what the audit measured

A contrast sweep over 286 Storybook pages × 4 theme states (1144 renders) found
this single token responsible for:

- **298 findings** — the largest single cause, ~70% of all real findings
- **84 pages**, spanning **40 component families**

Including: Calendar, Command, Breadcrumb, DescriptionList, AppShell, CardGrid,
Timeline, CardFilter, InputDatePicker, StatRow, DataGrid, Metric, Toolbar,
Card, DetailList, Empty, InputSelect, and more.

Method: WCAG 2.x relative-luminance ratio between each element's computed
`color` and the composited colour actually painted behind it. Icons, disabled
subtrees (WCAG 1.4.3 exempts inactive components) and elements painting no text
of their own are excluded. Full report:
`context/contrast-audit-findings.md`.

## 8. Open questions on item 1

1. Is `grayscale-8` the right choice, or would you rather introduce a dedicated
   secondary-text entry with a value tuned per theme?
2. Is muted/secondary text considered essential content? If it is deliberately
   de-emphasised below AA, we should record that as an approved exception in
   `packages/ui-spec/grammar/overrides/` rather than leaving it to resurface on
   every audit.
3. Input placeholder text measures **2.13:1** light / **2.66:1** dark. If that
   dimness is deliberate, it should be recorded as an approved exception rather
   than resurfacing on every audit. (The other big one — white on the dark-mode
   brand blue — is now §10.)

---

## 9. Second item — 13 brands need a sidebar foreground

### What has already been fixed, and why it was not a design problem

`SidebarPrimary` menu items took their label and icon colour from
`text/onBrand/*` — white for all 21 brands — while their container took each
brand's own fill. Fine on a dark brand; on a light one it produced unreadable or
invisible text. `telstra` rendered **white on white**: three of four nav items
gone.

The token set already contained the answer.
`palette/branding/<brand>/sidebarprimary/{label,icon}/{idle,active}` exists for
exactly three brands — `telstra`, `light-gray`, `yellow-1c` — which are exactly
the three with light sidebar fills. **Design had solved this; the component tier
simply never referenced it.** Now wired:

| brand                 | before |     after |
| --------------------- | -----: | --------: |
| `telstra` unselected  |   1.00 |  **7.09** |
| `light-gray` selected |   1.30 | **13.19** |
| `yellow-1c` selected  |   1.72 |  **9.98** |

No design input was needed and none was assumed — the values are yours,
unchanged.

### What is still broken, and why code cannot fix it

Thirteen brands ship **no** sidebar foreground, so their menu items fall back to
white. Measured in light mode on `Foundations/Brand Matrix`:

| brand                    | white on its fill |     | brand                  | white on its fill |
| ------------------------ | ----------------: | --- | ---------------------- | ----------------: |
| `red-home-pl`            |          **1.53** |     | `sand`                 |          **2.85** |
| `blue-yellow-uss-signal` |          **1.73** |     | `pinky`                |          **2.92** |
| `virtual-one`            |          **2.07** |     | `light-blue-hp`        |          **3.32** |
| `deep-sky-itkontoret`    |          **2.52** |     | `ingram-micro`         |          **3.47** |
| `orange-tsukaeru-helpox` |          **2.66** |     | `deep-purple`          |          **3.98** |
| `dark-gray`              |          **4.39** |     | `green-also-choise-df` |          **4.00** |
| `red-fire-brick`         |          **4.34** |     |                        |                   |

There is nothing to wire: the values do not exist. **This is the ask** — add
`sidebarprimary-label-{idle,active}` and `sidebarprimary-icon-{idle,active}` for
these brands, matching the pattern the three fixed brands already follow.

`label-idle` pairs with `background-idle` (the unselected row) and `label-active`
with `background-active` (the selected row); the two are different fills and need
different foregrounds. Getting that split wrong is easy — our first attempt
covered only the unselected row and left `light-gray` and `yellow-1c` failing at
1.30 and 1.72 on the selected one.

### A guard is in place

`brand-foreground-wiring.test.ts` asserts that any brand shipping these entries
has them wired. It fails if a Figma re-emit unwires them, and it **extends
itself**: the day you add `sidebarprimary-label-*` for `pinky`, the test starts
requiring it to be used, so a shipped fix cannot sit unwired.

## 10. Third item — brand identity disappears in dark mode

Every brand's sidebar colour is declared as, for example:

```
palette/branding/telstra/sidebarprimary/background/active
  = light-dark(rgb(163 26 117), rgb(81 157 246))
```

The dark side is `rgb(81 157 246)` — **the same blue for all 21 brands**. In dark
mode the sidebar therefore shows no brand identity at all, and white on that blue
measures **2.80:1** for every brand, failing AA uniformly.

Two questions:

1. **Is the collapse intentional?** If brand identity is meant to be light-mode
   only, that is a legitimate choice but should be stated, because it currently
   reads as missing dark values.
2. **Either way the shared blue fails.** Whether it stays shared or becomes
   per-brand, white on `rgb(81 157 246)` is 2.80:1 and needs either a darker fill
   or a non-white foreground.

This is the same defect as §4B of the audit report, seen from the brand axis.

## 11. How to see all of it

`Foundations/Brand Matrix` in Storybook renders a schematic app frame — sidebar,
header, content — once per brand, and is covered by visual regression. Two
commands reproduce the numbers above:

```bash
pnpm --filter @constructor-lab/ui-spec brand-contrast
pnpm --filter @constructor-lab/ui-spec story-audit --title "Brand Matrix" --all
```

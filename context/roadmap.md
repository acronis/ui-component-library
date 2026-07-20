# UI Components library — Roadmap

> Status: **planning doc** · Owner: Leonid Romanov · Last updated: 2026-07-05
> The roadmap substance below is current, but its GitHub tracking is **inherited
> from the upstream `acronis/uikit` project** ("User Interface Kit Development"):
> the 7 epics as issues **#102–108** and ~98 task sub-issues with Status / Phase
> (P1–P5) / Size. That board and those issues are **not set up in
> `constructor-lab/ui-component-library`** (which currently has no issues or project board), so
> treat every `#nnn` in these context docs as a historical reference, not a live
> link.

## North star

A single, token-driven UI Kit where **design tokens → theme → components →
icons/assets** form one pipeline, Figma is the upstream source of truth, and
**`@constructor-lab/ui-react` (Base UI) is the one component library teams
build on.** `ui-legacy` (`shadcn-uikit`) has been removed from this repo;
`ui-react` is the sole library.

## Decisions locked (2026-06-05)

1. **`ui-react` replaces `ui-legacy`.** _(History: `ui-legacy` /
   `shadcn-uikit` has since been removed from this repo; `ui-react` is now the
   sole library.)_ All work — **including the Table cluster** — targets
   `ui-react`.
2. **Foundational-first buildout.** Components ship bottom-up: primitives before
   composites before data/complex components, so higher-order components always
   have their building blocks.
3. **Theming on the new pipeline.** Brand themes are **generated CSS exports**
   from `tokens` → `tokens` (built by `tools/style-dictionary`), paired
   with the new icon/illustration **assets**, not hand-authored SCSS. Brand set
   = the legacy brand family **plus any new brand Figma introduces** — generation
   is data-driven, so a new Figma brand needs no code change.
   _Amended 2026-06-10 (see [`e1-theme-delivery.md`](./e1-theme-delivery.md)):_
   the runtime model is `--ui-*` + `[data-theme]` + `light-dark()` (as already
   shipped in `tokens`), **not** the legacy `--av-*` + class toggle; and
   white-label brands are authored as **full Figma brand modes**, not generated
   by a color-derivation script.
4. **Timeline — Q3 2026 (Jul–Sep).** Consumers need a usable set of base
   components in Q3 2026. **v1 scope** = all basic Base UI components + our
   design-system components + selected complex components (Table & friends).
5. **A11y bar + browser support matrix (issue #193).** `ui-react` v1 targets
   **WCAG 2.1 AA** for shipped components and docs surfaces (keyboard operation,
   visible focus, semantic name/role/value, and contrast: 4.5:1 text, 3:1
   non-text indicators). Supported browsers for v1 and per-component DoD
   verification: **Chrome 123+ · Edge 123+ · Firefox 120+ · Safari 17.5+**
   (desktop), matching the `light-dark()` + `color-scheme` token delivery
   baseline used by `tokens`.
6. **External consumer migration path (issue #194).** For any team still on the
   old `shadcn-uikit` outside this repo, migration to `ui-react` is
   **manual-first via the guide (#184)**. Automation scope is limited to
   optional, targeted codemod recipes (for low-risk import/symbol rewrites), not
   a fully automated end-to-end codemod.

---

## Current state (baseline)

| Area            | Package                                      | Version | Maturity                                              |
| --------------- | -------------------------------------------- | ------- | ----------------------------------------------------- |
| **Library**     | `ui-react`                                   | 0.54.0  | **~79 components in tree** (Tier 1–3 broadly covered) |
| Tokens          | `tokens`                                     | 1.9.0   | DTCG JSON, Figma-synced, ajv-validated                |
| Token artifacts | `tokens` (built by `tools/style-dictionary`) | 1.9.0   | Per-brand CSS + Tailwind presets                      |
| Icons           | `icons-react`                                | 0.5.0   | Generated from `icons-svg`                            |
| Apps            | demo · docs · demos                          | 0.1–0.4 | Scaffolded showcases                                  |

**Where the plan now stands:** ui-react has grown from 2 to **~79 components**
(virtually all have a Vitest test and a Storybook story; ~66 carry Figma Code
Connect). Tier 1 (form/overlay) and Tier 2 (composites) are in tree, and most of
Tier 3 (layout/shell/design-system) has landed. The complex set
(Calendar · Tree · Carousel · Command) has shipped. The remaining roadmap work is
**depth/polish per component to the full DoD and the v1 hardening pass** (a11y,
visual regression, docs) — not greenfield primitives.

---

## Epics

### E1 — Foundation: tokens & theming · #102 _(enabler — leads everything)_

ui-react components render `--ui-*` custom properties, so the token/theme
contract must be stable before the component ladder accelerates. Implementation
plan: [`e1-theme-delivery.md`](./e1-theme-delivery.md).

- [ ] **Theme delivery (#172)** — `tokens` ships per-brand CSS exports
      (`--ui-*`, `[data-theme]` + `light-dark()`), consumed by `ui-react` via
      `@theme inline` (Tailwind CSS v4 theme directive that maps CSS custom properties into theme tokens at build time; see https://tailwindcss.com/docs/theme#referencing-other-variables).
      Generation is already wired; remaining work is consumer ergonomics + the
      per-brand Storybook switch.
- [ ] **Data-driven brand generation (#173 / #174)** — a new Figma brand mode →
      `values.<brand>` → a generated `<brand>.css`, **no code change** (data-driven
      discovery shipped, PR #258). Brand set = the legacy brand family **plus any
      new brand Figma introduces**; track light/dark per brand. Remaining work is
      authoring the legacy brands as **full Figma modes** + sync.
      See `packages/tokens/context/brand-matrix.md`.
- [ ] **White-label fonts per brand** (#101) — brand-scoped font tokens + fallback stack.
- [ ] **New icons wired to themes** (#175) — `icons-react` icons paired per brand.
- [x] **Token contract & versioning** (#176) — define what a breaking token change is; how
      `tokens` semver maps to `tokens` and consumers.
      See `packages/tokens/context/token-contract.md`.
- [ ] **Style Dictionary hardening** — test coverage for normalization, light-dark,
      gradients, brand scoping (partly done).
- [ ] **Design context → design-grammar package** (#88) — relocate design context.

### E2 — `ui-react` component buildout · #103 _(main thrust, foundational-first ladder)_

Per-component DoD (from `packages/ui-react/AGENTS.md`): Vitest test · Storybook
story (all variants, **light + dark**) · Changeset · optional Figma Code Connect.

- **Tier 0 — done:** Button ✅, Switch ✅
- **Tier 1 — form & overlay primitives** (unblocks most composites) — **in tree ✅**
  - [x] Input · Label · Field · Textarea
  - [x] Checkbox · Radio Group · Select
  - [x] Separator · Popover · Tooltip · Dialog (+ Sheet)
- **Tier 2 — composites on primitives** — **in tree ✅**
  - [x] Combobox · Dropdown Menu · Number Field · Slider
  - [x] Tabs · Accordion · Toggle Group · Collapsible
  - [x] Avatar · Chip/Tag · Alert · Progress (+ Progress Circle) · Skeleton · Spinner
  - [x] Toast/Sonner — verify imperative `toast()` export split (#100) is resolved
- **Tier 3 — design-system / layout / shell** (list below) — **mostly in tree ✅**
- **Tier 4 — complex / data** → see E3, E5

> **Status note (2026-06-29):** the components above exist in
> `packages/ui-react/src/components/ui` with tests + stories. Remaining per-component
> work is bringing each to the full DoD (all variants light+dark, changeset, Code
> Connect) and the v1 hardening pass — not building them from scratch.

#### Tier 3 — proposed list (the main scope lever)

Grouped; **★ = recommended must-have for v1**, others trimmable if capacity is tight.
`✅ = in tree` (per the 2026-06-29 audit).

- **Layout & structure:** ★Card ✅ · ★Stack ✅ · ★Grid ✅ · ★Section ✅ · Aspect Ratio ·
  ★Scroll Area ✅ · Resizable ✅
- **App shell & navigation:** ★App Shell ✅ · ★Sidebar ✅ (primary/secondary) ·
  Secondary Menu ✅ · ★Navigation Menu · ★Breadcrumb ✅ · ★Pagination ✅ ·
  ★Page Header ✅ · ★Page Content ✅ · Auth Layout ✅ · Dashboard Layout · Split Layout
- **Feedback & status:** ★Empty ✅ _(Skeleton/Spinner/Alert/Chip/Tag/Progress/
  Toast live in Tier 2)_
- **Form composition:** ★Form ✅ · Filter ✅ (Card Filter)
- **UI Components library dashboard widgets:** Widget Placeholder ✅ · Widget (base) · Widget Alert ·
  Widget Text · Widget Progress (chunks / tiers) · Widget Protection Status ·
  Widget Protection Summary · Widget Table Data — _widget family still the main
  remaining Tier-3 work._

> The **widget family** (8 components) and the three extra layout templates
> (Auth/Dashboard/Split) are the most natural trim candidates — they're composed
> from lower tiers and are app-specific, so consumers can compose them locally if
> v1 slips. Keep them in scope, cut here first if needed.

### E3 — Data components / Table · #104 _(highest value, hardest — now in ui-react)_

Depends on Tier 1–2 primitives (Tooltip, Dropdown, Checkbox, Scroll Area).

- [x] Table base + scroll-friendly layout primitives (#45, #49) — `table` in tree
- [ ] Sticky / frozen columns (#44)
- [ ] Resizable columns (#46) — `resizable` primitive landed; wire into Table
- [ ] Column header sort — inline-toggle variant, not Dropdown-only (#48)
- [ ] Tooltip portal escape hatch (#47) — port as ui-react Tooltip feature
- [x] Data Table (composition layer) (#86) — `data-table` in tree
- [x] **Complex set for v1:** Calendar ✅ · Tree ✅ · Carousel ✅ · Command ✅ —
      all in tree _(Chart ✅ and Date Picker ✅ (`input-date-picker`) too)_

### E4 — Figma ↔ Code · #105 _(force-multiplier)_

- [x] Code Connect rollout beyond Button — ~66 `*.figma.tsx` across shipped ui-react components
- [ ] Figma connect template (#87)
- [ ] Document/automate one-way token sync (Figma → `tokens`)
- [ ] design-to-code workflow guidance for contributors

### E5 — Icons & assets · #106

- [ ] Complete icon pack generation coverage from `icons-svg` → `icons-react`
- [ ] Icon manifest validation & per-pack subpath export audit
- [ ] Tree-shaking / bundle-size checks for `icons-react`

### E6 — Docs & adoption · #107

- [ ] **Migration guide for external consumers: `shadcn-uikit` → ui-react**
      (component mapping + manual flow; optional codemod recipes where viable)
- [ ] Docs site (apps/docs) coverage tracks ui-react component ladder
      (including the token reference, typography, and icon catalog pages)

### E7 — Quality & release engineering · #108

- [ ] CI gates: typecheck + lint + test green per workspace (some in flight)
- [ ] Accessibility testing baseline (keyboard, ARIA, contrast) per component
- [ ] Visual regression (Storybook-based) light + dark
- [ ] Changesets discipline + release pipeline reliability
- [x] Define and ratify **ui-react 1.0 criteria** (#191) — component set, a11y bar, stable token contract.
- [x] Ratify a11y bar + browser support matrix (#193) — WCAG 2.1 AA; Chrome/Edge
      123+, Firefox 120+, Safari 17.5+.

---

## v1 definition (target: end of Q3 2026)

ui-react v1 = **all basic Base UI components** (E2 Tier 1 + Tier 2) **+ our
design-system components** (layout/shell, brand-specific elements — E2 Tier 3)
**+ selected complex components** led by **Table** (E3). Backed by the stable
token/theme contract (E1), a11y baseline and visual regression (E7), and a
migration guide for external consumers (E6).

Ratified v1.0 criteria (#191):

- **Component set:** E2 Tier 1 + Tier 2 shipped; Tier 3 must-haves (★) shipped;
  E3 Table cluster delivered to its scoped DoD.
- **Accessibility bar:** WCAG 2.1 AA and browser matrix from #193 applied to
  shipped components/docs and per-component DoD verification.
- **Stable token contract:** E1 token contract/versioning (#176) is in force for
  `tokens` → `tokens` → `ui-react`, with no unresolved breaking-contract
  gaps for the v1 component surface.

## Sequencing (calendar — today is 2026-07-05)

| Phase                                    | When          | Focus                                                                     | Exit criteria                                |
| ---------------------------------------- | ------------- | ------------------------------------------------------------------------- | -------------------------------------------- |
| **P1 — Foundation** ✅                   | **Jun 2026**  | E1 theme delivery + brand matrix + token contract                         | Brand themes generated from new pipeline     |
| **P2 — Primitives** ✅                   | **Jun–Jul**   | E2 Tier 1 + a11y baseline (E7) + Code Connect rollout (E4)                | Form/overlay primitives shipped to DoD       |
| **🎯 Q3 consumer drop** ✅               | **early Jul** | Usable base set (Tier 1 + core Tier 2) published for consuming teams      | Consumers can build real screens on ui-react |
| **P3 — Composites + DS** _(in progress)_ | **Jul–Aug**   | E2 Tier 2 + Tier 3 design-system/layout + E5 icons + migration guide (E6) | Composite + layout surface complete          |
| **P4 — Data/Table**                      | **Aug–Sep**   | E3 Table cluster (#44–49, #86); complex components already shipped        | Table: sticky/resizable/sort + Data Table    |
| **🎯 v1 GA**                             | **end Sep**   | E7 1.0 criteria + visual regression                                       | ui-react v1 released                         |

> **Reality check (updated 2026-07-05).** ui-react has reached **~79 components in
> tree** — the breadth target for v1 is largely met, well ahead of the original
> "2/82" baseline. The complex set (Calendar · Tree · Carousel · Command) has
> shipped. The remaining risk has shifted from _breadth_ to _depth_: bringing each
> component to the full DoD, finishing the Table cluster (#44/#46/#48), and the
> v1 hardening pass (a11y, visual regression, docs). If capacity is limited, the
> lever is still **narrowing the widget family**, not slipping the date.

---

## Resolved scope (2026-06-05)

- **Brands**: legacy four + any new Figma brand (data-driven generation). ✔
- **Capacity**: **2 full-time + 2 part-time ≈ 3 FTE.** Matches the comfortable
  baseline for end-Q3 v1 including the trim buffer. Aim part-timers at the
  well-scoped S/M tasks (widgets, layout, docs); reserve full-timers for the
  critical path (E1, then Select/Combobox/Table cluster/Chart). ✔
- **Tier-3**: proposed above (★ must-haves; widgets + extra layouts trimmable). ✔
- **Complex set**: full — Table, Calendar, Date Picker, Tree, Chart, Carousel, Command. ✔

## Open decisions — now tracked as issues

To ratify early (they shape APIs/scope); tracked on the board under their epic:

1. **RSC/Next support** → #192 (E2, P2) — settle before primitive detail.

---

## Issue → epic map

| Issue     | Title                                    | Epic            |
| --------- | ---------------------------------------- | --------------- |
| #101      | White-label brand fonts                  | E1              |
| #88       | Move design context to design-grammar    | E1              |
| #100      | sonner toast() imperative API split      | E2 (Tier 2)     |
| #87       | Figma connect template                   | E4              |
| #86       | Complete Table implementation            | E3              |
| #49 / #45 | Scroll-friendly table layout primitives  | E3              |
| #48       | Column header inline-toggle sort         | E3              |
| #47       | Tooltip portal escape hatch              | E3 / E2 Tooltip |
| #46       | Resizable columns                        | E3              |
| #44       | Sticky / frozen columns                  | E3              |
| #192      | RSC/Next support                         | E2              |
| #193      | A11y level + browser matrix              | E7              |
| #191      | Define and ratify ui-react v1.0 criteria | E7              |
| #194      | Codemods vs manual migration             | E6              |

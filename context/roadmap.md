# UI Components library — Roadmap

> Status: **planning doc** · Owner: Leonid Romanov · Last updated: 2026-07-30
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

| Area            | Package                                      | Version | Maturity                                                                                                                        |
| --------------- | -------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Library**     | `ui-react`                                   | 2.3.0   | **115 directories under `components/ui`** (Tier 1–3 covered; charts + dashboard primitives added by the upstream borrow, below) |
| Tokens          | `tokens`                                     | 3.0.0   | DTCG JSON, Figma-synced, ajv-validated                                                                                          |
| Token artifacts | `tokens` (built by `tools/style-dictionary`) | 3.0.0   | Per-brand CSS + Tailwind bridge                                                                                                 |
| Icons           | `icons-react`                                | 0.5.0   | Generated from `icons-svg`                                                                                                      |
| Apps            | demo · docs · demos                          | 0.1–0.4 | Scaffolded showcases                                                                                                            |

**Where the plan now stands:** ui-react has grown from 2 to **115 component
directories** (virtually all have a Vitest test and a Storybook story; most carry Figma
Code Connect). Tier 1 (form/overlay) and Tier 2 (composites) are in tree, and most of
Tier 3 (layout/shell/design-system) has landed. The complex set
(Calendar · Tree · Carousel · Command) has shipped, and the upstream harvest below
added the chart family and the dashboard primitives. The remaining roadmap work is
**depth/polish per component to the full DoD and the v1 hardening pass** (a11y,
visual regression, docs) — not greenfield primitives.

One caveat that now shapes the hardening pass: **visual-regression capture is not
reliably runnable on an arm64 dev machine** (amd64 emulation plus an 8 GB Docker
ceiling), so VR belongs on CI. Four consecutive local capture attempts failed for
four _different_ environmental reasons and none was a code defect — see the
outstanding-work notes below.

_Amended 2026-07-30:_ unreliable, but **not impossible** — a full both-mode capture
(765 stories × light + dark, 0 failures, 64 baselines written) did complete locally
on arm64 with Docker at 8.3 GB / 14 CPUs. The precondition is mundane and worth
stating because it reads as a code failure when missed: **the Docker daemon must
actually be running** (`docker info` before invoking the runner, `open -a Docker` if
not). So a local capture is a legitimate fallback while CI runners are down; it just
cannot be assumed to work.

---

## Upstream harvest from `acronis/uikit` (2026-07-29)

**Why:** `acronis/uikit` is an actively-developed sibling that **renders from the same
Figma file** (`lrU3ydIyvPYQNE6ixdsKtJ`). It merged ~37 PRs in a month while this repo
spent that month on the DataTable/DataGrid cluster (#74). Because the design source is
shared, a divergence they corrected is a **candidate defect here** — which is what made
their small per-component "sync with Figma" fixes the highest value-per-line thing to
mine. Full plan and audit addendum: `.ai/explorations/upstream-borrow-audit.md`.

### Landed on `main`

|                                |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cross-cutting** (#76)        | A first-ever `@layer base` reset (font-smoothing, global `text-underline-offset`, shadow-root-safe `font-family`) · a pinned `--ui-breakpoint-*` scale published as CSS **and** JS constants, with a drift-guard test across all three representations · `PortalContainerProvider` + `usePortalContainer` wired into 13 portalling components (explicit prop still wins) · the RTL residue sweep                                                                                                                                                                  |
| **Design parity** (#78)        | Six confirmed Figma divergences, plus a **systemic** fix: `cursor-pointer` was missing from the base class of eight interactive surfaces. Fixed at the base and guarded by a new grammar rule `interaction/interactive-cursor` (checklist I7, severity `should`), whose detector immediately found three more cases beyond the audit's list. Also card-filter's invalid `type` on a render-prop anchor, clear-button hover states, the chart tooltip rewired to the Tooltip tier, a menu focus ring, and the resizable divider pixel-snapped via a logical border |
| **Charts 2a** (#78)            | `ChartState` · `BarChart` · `LineChart` · `AreaChart` · `PieChart` — typed recharts compositions consuming the existing `chart/` primitives unchanged, with series marks bound to our `--ui-chart-*` palette (upstream has no such palette)                                                                                                                                                                                                                                                                                                                       |
| **Dashboard primitives** (#79) | `TrendIndicator` · `Metric` · `Timeline` (the last derived from Figma node `7615:7791`, not ported) plus the `Avatar` fix that exposed three colour schemes whose tokens were already emitted but unreachable                                                                                                                                                                                                                                                                                                                                                     |
| **Release gate** (#76)         | `release.yml`'s "Validate design packages" step matched **no package** and silently exited 0 — every release reported a validation it never ran                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Charts 2b** (#80, #81)       | `scatter` · `composed` · `funnel` · `radar` · `radialBar` · `treemap` · `histogram` · `confidenceCone`, plus #81's prettier fix for three chart `.mdx` pages. **Merged 2026-07-30 without the 36 dark baselines that were its own stated merge blocker** — six of the eight types shipped light-only, so the dark CI job had no coverage for them at all. Baselines captured and landed after the fact (below)                                                                                                                                                    |

### On `feat/track3-input-password` — not yet merged

|                            |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Track 3 components**     | `ButtonIconInput` (Figma `5304:5404`) — the 20×20 in-box affordance (clear ✕ / reveal eye / search trigger); a **distinct component from `ButtonIcon`, not a size of it** (smaller container, 2px padding round a 16px glyph, and a `normal`/`error` variant whose focus ring switches with it). `InputPassword` (Figma `6325:11375`) — the password field, consuming its own `--ui-input-password-*` tier rather than the `InputBox` primitive's `--ui-input-text-*`, matching the five components that already write their own input for the same reason |
| **The four token tiers**   | `ButtonIconInput` · `InputPassword` · `Footer` · `Popover`, cherry-picked off the agent worktree branch they were stranded on                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Dark VR backfill**       | The 36 missing charts-2b dark baselines, plus the 28 for the two Track 3 components. Captured in Docker (linux/amd64), both modes, 765/765 green                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Ledger fix**             | The duplicate `interactive-base-cursor-missing` entry that held `ui-spec` red                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ⚠️ **Also on this branch** | `d19f42e0 feat(tokens): update typography and add shadow color tokens` — committed by a **concurrent session** onto the shared worktree while this branch was checked out. Unrelated to Track 3. It changed no VR baseline (visually inert across all 765 stories), but decide whether it belongs here before merging                                                                                                                                                                                                                                      |

### Outstanding

- **GitHub Actions runners are not starting** (observed 2026-07-30). Every workflow run
  since 2026-07-29 fails in 2–13 s with **zero steps executed** and no logs — the job
  record exists, the runner never picks it up, which matches the unpaid-Actions-billing
  note below. **Nothing merged in that window was verified by CI**, and that is not a
  theoretical risk: it is how two real defects reached `main` in a week — see "two defects
  reached `main` … purely because runners stopped starting" under the audit findings. Fix
  this before trusting any green-looking merge.
- **`Loading`** — approved. Its token tier emits 20 values, **all dead**, plus 5 backdrop
  semantics dead beneath it (25 total). Invisible to both existing guards because the tier
  is named `Loading` while the shipped component is `spinner`.
- **`ui-toast--default` is a non-deterministic VR case.** Its baseline oscillates between
  two stable renders — 13198 B with the toast visible and 6473 B captured before the toast
  appears — so it flips on roughly every recapture (`78b1d691` flipped it one way, the
  2026-07-30 capture flipped it back). It will fail the VR job intermittently until the
  story's capture waits for the toast. Left uncommitted rather than flipped again.
- **Track 3 — remaining half.** `ButtonIconInput` and `InputPassword` are **built** (on
  `feat/track3-input-password`, above). The `Footer` and `Popover` tiers are emitted but
  still **unconsumed**; they unblock Popover's Figma sync and Dialog's footer tier.
- **Deferred with decisions recorded** — the sidebar label-overflow mechanism; the
  kit-wide Figma-stroke-vs-CSS-border convention (two alignments, one CSS mechanism, no
  translation rule); a reverse-direction token guard; the `release.yml` → `ci.yml`
  dependency (approved, but landing it while Actions billing is unpaid would freeze
  releases).

### What the audits found, beyond the components

- **369 emitted-but-unconsumed `--ui-*` tokens**, and no guard for that direction at all:
  component→token is covered (grammar T6 `no-dangling-var`, `must`), Figma→token is covered
  (`/token-gap-check`), **token→any consumer is not**. A dangling `var()` fails silently; an
  unconsumed token fails _invisibly_, and in two confirmed cases it capped a component's
  public API below its own design.
- **A dark CI job cannot fail on a baseline that does not exist.** #80's own merge
  blocker was "36 missing dark baselines", and it merged without them — the dark job
  passed because a story with no committed baseline has nothing to compare against, so
  absent coverage reports identically to green coverage. Counting the dark PNGs already in
  the tree does **not** detect this either (two of the eight chart types had theirs, which
  makes the directory look populated). The reliable check is per-story: every story id in
  `index.json` must have both `<id>.png` and `<id>--dark.png`. Worth a drift test — it is
  the same class of invisible-absence bug as the unconsumed-token gap above and the
  release gate's no-match glob.
- **Two defects reached `main` in one week purely because runners stopped starting.** #80's
  missing baselines, and a duplicate `interactive-base-cursor-missing` ledger entry that
  held the whole `ui-spec` suite red (`validateLedger()` → `duplicate ledger id`; fixed
  2026-07-30). Both would have been caught by the existing checks on any PR. The lesson is
  about the gate, not the code: when CI cannot run, the guards this repo has invested
  heavily in are all simultaneously offline, and merges proceed looking clean.
- **An accessibility defect no test could see.** Treemap tile labels were white on
  `--ui-chart-*` fills — failing WCAG on **13 of 15** palette colours (worst 1.63:1 against
  the yellow). A fixed on-chart text token cannot exist, because the palette spans 1.63:1 to
  5.70:1 against white; the adopted convention is a `paint-order: stroke` halo, recorded in
  the grammar ledger. An audit of all 13 chart types confirmed treemap was the only instance.

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

> **Reality check (updated 2026-07-29).** ui-react has reached **105 components in
> tree** — the breadth target for v1 is comfortably met, well ahead of the original
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

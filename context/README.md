# `context/` — cross-cutting topics

Markdown instructions read by both LLMs and humans, covering topics that span
more than one workspace. Anything specific to how a single workspace is built,
tested, or styled lives inside that workspace's own `AGENTS.md` +
`context/`, never here.

The root [`AGENTS.md`](../AGENTS.md) links here with one line per document.
This file holds the full annotations — read it when you need to decide _which_
document to open.

## Required reading

Before doing any work in this repository, read both of these:

- `conventions.md` — coding and editing conventions
- `commits.md` — commit and pull-request conventions

## Read on demand

- `ecosystem-vision/` — **north-star vision & governance** for the whole
  Cyber ecosystem: the 8-layer model (`Console → App → Screen → Template →
Pattern → Composite → Primitive` over ambient Tokens + Icons, sourced from
  Figma), the per-layer schema/validation contract, the new **Template** layer
  (the `common-template` generalization), the PM/designer/dev authoring workflow,
  and the **RFC discussion board** (`rfcs/`). Unifies the layer/pattern/screen
  proposals below into one picture; draft, nothing adopted. Start at its
  `README.md`.
- `releasing.md` — Changesets workflow that applies to any published workspace
  in the monorepo.
- `roadmap.md` — product roadmap (epics, phases, v1 scope/timeline).
  Epic/issue numbers (#102–108, etc.) are inherited from the upstream
  `acronis/uikit` project and are not live in this repo — see the doc's tracking
  note.
- `e1-theme-delivery.md` — E1 theme-delivery implementation proposal: how the
  theme-delivery work gets built on the shipped `tokens` pipeline, and what's
  reused from the legacy stack.
- `project-board.md` — inherited operating model (epic/task model, status
  lifecycle + gates, fields, views, automation) for when the board is recreated in
  this repo; not yet set up here.
- `next-gen-components-migration.md` — migrating the component token tier
  to Figma's next-gen `brand.components` (Option A naming, emitter rework,
  tokens impact, ui-react per-component re-theme). §9 tracks execution status,
  the remaining ui-react backlog, and the Radio/Search/Select token gap.
- `../packages/ui-spec/context/component-specs-proposal.md` — the proposal behind
  `packages/ui-spec`: framework-agnostic component specs + a machine-readable
  design grammar, to support future non-React implementations and agent tooling.
  **Phase 0 spike in progress** — see the workspace's `AGENTS.md`.
- `kit-consistency-audit-proposal.md` — cross-component consistency
  rules (grammar), a common-inconsistency checklist, a complete-screen
  consistency audit (render real screens → structural + AI detectors),
  reference-implementation diffing, and a self-improving feedback loop + AI
  skills. Extends the component-specs proposal above; landing incrementally in
  `packages/ui-spec` (`grammar/`, `screens/audit/`, the `kit-lint` and
  `screen-audit` scripts).
- `contrast-audit-findings.md` — results of the first repo-wide WCAG contrast
  sweep (`story-audit`: 286 Storybook pages × 4 theme profiles). **424 findings,
  400 of them dark-mode, collapsing to six causes** — the largest being that
  `--ui-palette-grayscale-7` sits at the midpoint of a mirrored ramp and so has
  the same value in light and dark. Records each cause, fix options with measured
  ratios, and the CI-gating choices. **Nothing is fixed** — the token changes are
  design decisions.
- `design-request-brand-and-text-contrast.md` — the outbound ask to design +
  `acronis/uikit`, arising from the contrast audit. Three items: retarget
  `text/onSurface/secondary` (specified, already applied in code); supply
  `sidebarprimary-label/icon` for the **13 brands** that ship none (values
  needed); and confirm whether every brand's sidebar collapsing to one blue in
  dark mode is intentional (decision needed). **Nothing has been sent** — this is
  a draft, and the Figma file is shared with `acronis/uikit`.
- `component-layers-proposal.md` — the **Primitive vs Composite** layer
  model for components (jargon-free; no atoms/molecules), the classify-don't-move
  mechanism (a `layer` field on each `ui-spec` `index.yaml`, non-breaking), the
  pattern→composite graduation pipeline, and the future templates gallery in
  `apps/demo`. Proposed; not yet adopted.
- `opinionated-composites-proposal.md` — extends the layers work: an
  **opinionated, config-driven composite** layer (`<DataGrid columns rows/>`-style
  components that trade flexibility for consistency) over the flexible primitives,
  a **config-driven vs compositional** API decision rule, a prioritized slate of
  candidate composites anchored to existing `ui-spec/patterns` (DataGrid,
  ConfirmDialog, FormLayout, DetailList, …), how to **insist on their use** by
  growing the `acronis-patterns` ESLint plugin into
  `@constructor-lab/eslint-plugin-patterns`, and why there is **no separate package**
  (a `ui-react/composites` subpath instead). Proposed; not yet adopted.
- `demo-console-portal-proposal.md` — Phase 4 of the layers work: turn
  `apps/demo` into one **console portal** (an `AppShell` realizing the
  `protection-dashboard` screen, routes from root) that surfaces
  screens/patterns/component-demos **driven by a committed `spec-index.json`** in
  `ui-spec`. Evolves toward the demo being **generated/updated from an app-level
  spec** (`apps/<slug>/app.yaml`: spa | single-screen | microfrontend) via a
  future `/generate-app` skill (build reference → formalize `app.yaml` → generate,
  like pattern→composite), plus a dedicated **coach-mark tour component**
  (stepped `Popover` + beacon "green light" + spotlight). Hand-built 4a; generic
  `screen.yaml` renderer + generator deferred to 4b. Proposed; not yet adopted.
- `uikitless-workflow-proposal.md` — the **"uikitless" (rules-over-components)**
  question: can consistent UIs be delivered from tokens + patterns + grammar
  rules + AI generation instead of a large maintained component surface? Reframes
  it as **presentation vs behavior** (the presentational/layout/screen-assembly
  layers fit a rules workflow; the interactive ~20% stays component-shaped),
  argues the **verification loop — not the prompt — is load-bearing**, and reports
  a **generate → lint → audit prototype** (`prototypes/generate-lint-audit/`) on
  `protection-dashboard` that both caught injected drift and surfaced a real
  `screen-audit` false-positive (fixed + laddered into the grammar ledger).
  Proposes a layered delivery contract on top of the existing grammar / kit-lint /
  screen-audit / ledger machinery. Proposed; not yet adopted.
- `pattern-first-screens-proposal.md` — the next step of the uikitless
  line: build/update **whole screens from patterns, never from primitives**. The
  **pattern becomes the mandatory unit** of screen construction (schema requires
  `regions[].pattern`; a `require-pattern` ESLint rule + a
  `composition/pattern-conformance` audit detector enforce it; a `patternless`
  escape hatch feeds graduation). PMs describe intent + logic (PRD →
  `screen.yaml` `stateMachine`); a `/screen-from-spec` skill decouples that into a
  pattern-composed spec and generates a rule-true implementation via the
  generate→lint→audit loop, so every interface shares one visual representation by
  construction. Reframes **Figma as a weak/discovery source, not the authority** —
  the implementation can be _rule-truer than the mockup_ — with a
  `mockup-vs-pattern` skill that classifies each divergence (correct / graduate /
  override). Includes a questions-and-solutions section. Proposed; not yet adopted.
- `demo-pattern-screens-proposal.md` — the pattern-first **pilot** in
  `apps/demo`: rebuild the demo's Dashboard, Data-table (+ detail sheet, filters,
  new-item, bulk ops), Settings, and Login as **pattern-composed screens** (each
  with a `screen.yaml`), so the demo becomes the reviewable, correctable reference
  corpus that exercises ~15 of the 19 patterns. Maps each screen to concrete
  patterns/composites, per-screen region tree + state machine (D1/D3), and the
  files it replaces. **The screens are built and specced** — pattern-composed
  routes in `apps/demo` plus a `screen.yaml` each in
  `ui-spec/screens/{dashboard,data-table,settings,login}`. Proposed; not yet
  adopted.

## Not yet annotated

These live in `context/` but have no annotation above — open them directly:

- `table-feature-parity-design.md`
- `table-feature-parity-implementation-plan.md`

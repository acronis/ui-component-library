# AGENTS.md

Single source of truth for AI agents working in `constructor-lab/ui-component-library`.

This file is the **root index**. It is intentionally short (~120 lines) so
it fits in any context window. Specifics live in:

- `./context/*.md` — cross-cutting topics shared across workspaces
- `<workspace>/AGENTS.md` — quirks specific to one workspace

Each workspace also has a sibling `CLAUDE.md` containing only `@AGENTS.md`
so Claude Code's nested auto-load (it walks up from CWD) picks the
workspace's context when you work inside that subtree.

## Repository overview

`constructor-lab/ui-component-library` is a pnpm monorepo containing a React component
library, its framework-agnostic component specs, a demo SPA, a
documentation site, a shared demos package, a design-tokens package, an
icon set (SVG sources + generated React components), and a build-tooling
tier. The library, the tokens package, and the React icons are published;
the specs, the apps, and the tools are private.

The repo is organized into four top-level directories, each with a
distinct role:

- **`context/`** — Markdown instructions read by both LLMs and humans
  (cross-workspace conventions; each workspace also has its own).
- **`apps/`** — applications that get deployed (e.g. the demo and docs
  sites). Private.
- **`packages/`** — packages published to the npm registry.
- **`tools/`** — scripts that automate, translate, or execute operations
  (e.g. token→CSS builds). Private; never published.

## Workspaces

| Path                          | Package                                 | Published? | Stack                                                                                                                      | Workspace docs                                    |
| ----------------------------- | --------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `packages/ui-react/`          | `@constructor-lab/ui-react`             | **yes**    | Base UI library, Vite, Storybook 10, Vitest + RTL, Tailwind v4                                                             | [AGENTS.md](packages/ui-react/AGENTS.md)          |
| `packages/ui-spec/`           | `@constructor-lab/ui-spec`              | no         | Framework-agnostic component specs (YAML/MD) + cva conformance, Vitest, ajv-validated                                      | [AGENTS.md](packages/ui-spec/AGENTS.md)           |
| `packages/icons-react/`       | `@constructor-lab/icons-react`          | **yes**    | React icons generated from `icons-svg`, Vite, Storybook, Vitest                                                            | [AGENTS.md](packages/icons-react/AGENTS.md)       |
| `packages/icons-svg/`         | `@constructor-lab/icons-svg`            | no         | Raw SVG sources for the **next-gen** icon set (Figma `icon-packs` strategy)                                                | [AGENTS.md](packages/icons-svg/AGENTS.md)         |
| `apps/demo/`                  | `@constructor-lab/ui-kit-demo`          | no         | Vite SPA, React Router v7, Zustand                                                                                         | [AGENTS.md](apps/demo/AGENTS.md)                  |
| `apps/docs/`                  | `@constructor-lab/uikit-docs`           | no         | Next.js 15 + Fumadocs                                                                                                      | [AGENTS.md](apps/docs/AGENTS.md)                  |
| `apps/demos/`                 | `@constructor-lab/ui-kit-demos`         | no         | source-only (no build, no dev server)                                                                                      | [AGENTS.md](apps/demos/AGENTS.md)                 |
| `packages/tokens/`            | `@constructor-lab/tokens`               | **yes**    | DTCG source tiers + generated (committed) CSS/SCSS/JS + Tailwind bridge, built by the tool                                 | [AGENTS.md](packages/tokens/AGENTS.md)            |
| `tools/style-dictionary/`     | `@constructor-lab/style-dictionary`     | no         | Style Dictionary v5 build: `@constructor-lab/tokens` tiers → CSS/SCSS/JS                                                   | [AGENTS.md](tools/style-dictionary/AGENTS.md)     |
| `tools/figma-icons-fetcher/`  | `@constructor-lab/figma-icons-fetcher`  | no         | Fetches + SVGO-optimizes icons from Figma into `icons-svg` (tsx, Vitest)                                                   | [AGENTS.md](tools/figma-icons-fetcher/AGENTS.md)  |
| `tools/figma-token-exporter/` | `@constructor-lab/figma-token-exporter` | no         | Self-hosted Figma plugin + local receiver: exports variables/styles → the `@constructor-lab/tokens` snapshot (tsx, Vitest) | [AGENTS.md](tools/figma-token-exporter/AGENTS.md) |

`packages/` holds the published workspaces:

- `packages/ui-react/` houses the published **Base UI**
  library (`@base-ui/react` as a direct dep), themed by
  `@constructor-lab/tokens`. New component work goes here.
- `packages/ui-spec/` — **private** framework-agnostic component specs for
  the kit (the 7-file YAML/MD format). Validates each spec against JSON
  Schemas and checks `cva` variant/size conformance against the `ui-react`
  source. Currently a Phase 0 spike (`button`, `button-icon`, `switch`).
- `packages/icons-react/` — published React icon components, **generated**
  from `@constructor-lab/icons-svg` (scale/stroke rules baked into a `size`
  prop). Per-pack subpath exports, tree-shakeable.
- `packages/icons-svg/` — **private, source-only** raw SVG icon sources
  (monocolor + multicolor) for the **next-gen** icon set, pulled from Figma
  with the fetcher's `icon-packs` selection strategy. No build; it is the
  generated source for `@constructor-lab/icons-react`. Synced via its `pull-icons`
  script or the `Fetch Figma Icons (next)` workflow.
- `packages/tokens/` — the published tokens package (**merges the former
  `design-tokens` source + `tokens-pd` output**). It holds the DTCG source
  `tiers/*.json` (ajv-`validate`d) **and** the generated, committed
  `css/` + `scss/` + `js/` + `dtcg/`. Its `build` delegates to
  `tools/style-dictionary`. The CSS is **reference-based**: `css/primitives.css`
  is the sole raw-value/`light-dark()` theme layer; semantics and per-component
  tiers are `var(--…)` references. Brand = `[data-brand]`, light/dark =
  `[data-theme]`; one import (`@constructor-lab/tokens/css`) pulls in everything.

`tools/` holds private (unpublished) build tooling:

- `tools/style-dictionary/` — a Style Dictionary v5 translation pipeline
  that builds `@constructor-lab/tokens`'s DTCG tiers into the package's generated
  (committed) reference-based `css/`, `scss/`, and `js/` (+ the Tailwind bridge).
  Its real script is `build`; asset output lands in a gitignored `dist/`.
- `tools/figma-icons-fetcher/` — fetches SVG icons from a Figma file,
  SVGO-optimizes them, and writes them (with JSON manifests + mono/multicolor
  categorization) into `packages/icons-svg`. Node selection is pluggable
  (`frames-by-name` / `new-frames` / `icon-packs`). Run via `tsx` (no build
  step); drives the `Fetch Figma Icons (next)` workflow and the package's
  `pull-icons` script.
- `tools/figma-token-exporter/` — a **self-hosted Figma plugin + local
  receiver** that exports design-token variables/styles into
  `packages/tokens/.tmp/figma-tokens/` (the snapshot the sync emitters
  consume). It replaces the third-party figma-console Desktop Bridge for the
  bulk token pull; its `src/convert.ts` faithfully ports figma-console's
  variable→DTCG serialization so the snapshot stays a drop-in. Run the receiver
  via `tsx`; the plugin is imported into Figma Desktop from its `manifest.json`.
  Used by the `/sync-tokens` flow.
- `tools/eslint-rules/` — a **local ESLint plugin** (`acronis-patterns`) that
  encodes approved-pattern rules from `packages/ui-spec/patterns/` (currently
  `no-adhoc-sheet`), wired directly into the root `eslint.config.js`. **Not a pnpm
  workspace** — it has no `package.json` and none of the standard scripts; it's a
  plain JS module imported by the flat config. The seed of an eventual
  `@constructor-lab/eslint-plugin-patterns`.

## Scripts vocabulary

Every workspace exposes the same script names. Run any of them as:

- `pnpm -r <name>` — all workspaces, topological order
- `pnpm --filter <package> <name>` — single workspace

Names: `dev` · `build` · `test` · `test:watch` · `lint` · `lint:fix` · `typecheck` · `clean`

Root-only scripts (from the repo root):

- `format`, `format:check` — Prettier across the tree
- `changeset`, `version`, `release` — Changesets CLI passthroughs
- `husky` — runs lint-staged + typecheck (used by the pre-commit hook)

`apps/demos` is intentionally source-only: its `dev`/`build` scripts are
no-ops because the package is consumed via source-file exports. Tools
follow the same vocabulary too: `tools/style-dictionary`'s real work is
`build` (with `test`/`test:watch` running vitest); only `dev` is a no-op.

## How agents should navigate this repo

1. **Always read this file first** — it tells you which workspace owns
   your task.
2. **Read the workspace's `AGENTS.md`** for the area you're editing.
   The workspace owns its own conventions, testing, theming, etc. in a
   workspace-local `context/` directory.
3. **Pull from this repo's root `./context/<topic>.md`** when relevant
   — it holds only the truly cross-workspace topics.

Cross-workspace context is intentionally minimal. Anything specific to
how a particular workspace is built, tested, or styled lives **inside
that workspace**, never here.

## Always-loaded cross-cutting context

@context/conventions.md
@context/commits.md

## Cross-cutting context (read on demand)

- `context/releasing.md` — Changesets workflow that applies to any
  published workspace in the monorepo.
- `context/roadmap.md` — product roadmap (epics, phases, v1 scope/timeline).
  Epic/issue numbers (#102–108, etc.) are inherited from the upstream
  `acronis/uikit` project and are not live in this repo — see the doc's tracking
  note.
- `context/e1-theme-delivery.md` — E1 theme-delivery implementation proposal:
  how the theme-delivery work gets built on the shipped `tokens` pipeline, and
  what's reused from the legacy stack.
- `context/project-board.md` — inherited operating model (epic/task model, status
  lifecycle + gates, fields, views, automation) for when the board is recreated in
  this repo; not yet set up here.
- `context/next-gen-components-migration.md` — migrating the component token tier
  to Figma's next-gen `brand.components` (Option A naming, emitter rework,
  tokens impact, ui-react per-component re-theme). §9 tracks execution status,
  the remaining ui-react backlog, and the Radio/Search/Select token gap.
- `packages/ui-spec/context/component-specs-proposal.md` — the proposal behind
  `packages/ui-spec`: framework-agnostic component specs + a machine-readable
  design grammar, to support future non-React implementations and agent tooling.
  **Phase 0 spike in progress** — see the workspace's `AGENTS.md`.
- `context/kit-consistency-audit-proposal.md` — cross-component consistency
  rules (grammar), a common-inconsistency checklist, a complete-screen
  consistency audit (render real screens → structural + AI detectors),
  reference-implementation diffing, and a self-improving feedback loop + AI
  skills. Extends the component-specs proposal above; landing incrementally in
  `packages/ui-spec` (`grammar/`, `screens/audit/`, the `kit-lint` and
  `screen-audit` scripts).
- `context/component-layers-proposal.md` — the **Primitive vs Composite** layer
  model for components (jargon-free; no atoms/molecules), the classify-don't-move
  mechanism (a `layer` field on each `ui-spec` `index.yaml`, non-breaking), the
  pattern→composite graduation pipeline, and the future templates gallery in
  `apps/demo`. Proposed; not yet adopted.
- `context/opinionated-composites-proposal.md` — extends the layers work: an
  **opinionated, config-driven composite** layer (`<DataGrid columns rows/>`-style
  components that trade flexibility for consistency) over the flexible primitives,
  a **config-driven vs compositional** API decision rule, a prioritized slate of
  candidate composites anchored to existing `ui-spec/patterns` (DataGrid,
  ConfirmDialog, FormLayout, DetailList, …), how to **insist on their use** by
  growing the `acronis-patterns` ESLint plugin into
  `@constructor-lab/eslint-plugin-patterns`, and why there is **no separate package**
  (a `ui-react/composites` subpath instead). Proposed; not yet adopted.
- `context/demo-console-portal-proposal.md` — Phase 4 of the layers work: turn
  `apps/demo` into one **console portal** (an `AppShell` realizing the
  `protection-dashboard` screen, routes from root) that surfaces
  screens/patterns/component-demos **driven by a committed `spec-index.json`** in
  `ui-spec`. Evolves toward the demo being **generated/updated from an app-level
  spec** (`apps/<slug>/app.yaml`: spa | single-screen | microfrontend) via a
  future `/generate-app` skill (build reference → formalize `app.yaml` → generate,
  like pattern→composite), plus a dedicated **coach-mark tour component**
  (stepped `Popover` + beacon "green light" + spotlight). Hand-built 4a; generic
  `screen.yaml` renderer + generator deferred to 4b. Proposed; not yet adopted.
- `context/uikitless-workflow-proposal.md` — the **"uikitless" (rules-over-components)**
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
- `context/pattern-first-screens-proposal.md` — the next step of the uikitless
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

## Tooling preconditions

- **Package manager**: pnpm `10.27.0` (declared in root `packageManager`).
  Enable via `corepack enable` or `npm install -g pnpm@10.27.0`.
- **Node**: 22.x (CI uses Node 22).
- **TypeScript** for all new source code.
- The catalog block in `pnpm-workspace.yaml` is the single source of
  truth for shared dependency versions — bump there, not per workspace.
  Respect intentional drift noted in catalog comments.
- Use `pnpm --filter <package> <script>` over `cd <workspace> && pnpm <script>`.
- **Never** use `--no-verify` to bypass commit hooks; fix the underlying
  issue. The pre-commit hook runs `lint-staged` + `typecheck`.

## What this repo does NOT have

To prevent agents inventing things from outdated knowledge:

- **No Vue**. The repo is React-only. Any `.vue` reference is stale.
- **No VitePress**. Docs are Next.js + Fumadocs at `apps/docs/`.
- **No `packages/documentation/` or `packages/examples/`**. Those paths
  never existed in this repo.

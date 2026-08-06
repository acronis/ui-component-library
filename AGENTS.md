# AGENTS.md

Single source of truth for AI agents working in `acronis/ui-component-library`.

This file is the **root index**. It is intentionally short (~120 lines) so
it fits in any context window. Specifics live in:

- `./context/*.md` — cross-cutting topics shared across workspaces
- `<workspace>/AGENTS.md` — quirks specific to one workspace

Each workspace also has a sibling `CLAUDE.md` containing only `@AGENTS.md`
so Claude Code's nested auto-load (it walks up from CWD) picks the
workspace's context when you work inside that subtree.

## Repository overview

`acronis/ui-component-library` is a pnpm monorepo containing a React component
library, its framework-agnostic component specs, a demo SPA, a
documentation site, a shared demos package, a design-tokens package, an
icon set (SVG sources + generated React components), and a build-tooling
tier.

Each top-level directory has a distinct **role**, which is what decides
where new work goes:

- **`context/`** — Markdown instructions read by both LLMs and humans.
- **`apps/`** — applications that get deployed. Private.
- **`packages/`** — packages published to the npm registry.
- **`tools/`** — scripts that automate, translate, or execute operations.
  Private; **never published**.

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

## Workspace gotchas

Things the code alone will teach you wrong, or too slowly:

- **`packages/ui-react/`** — `@base-ui/react` is a **direct dep**, themed by
  `@constructor-lab/tokens`. **New component work goes here.**
- **`packages/ui-spec/`** — currently a Phase 0 spike (`button`, `button-icon`,
  `switch`) only; do not assume full coverage.
- **`packages/icons-react/`** — **generated** from `@constructor-lab/icons-svg`;
  scale/stroke rules are baked into a `size` prop. Never hand-edit the output.
- **`packages/icons-svg/`** — source-only, **no build**. It is the generated
  source for `icons-react`. Sync via its `pull-icons` script or the
  `Fetch Figma Icons (next)` workflow.
- **`packages/tokens/`** — merges the former `design-tokens` source +
  `tokens-pd` output. Its generated `css/` + `scss/` + `js/` + `dtcg/` are
  **committed**, and its `build` delegates to `tools/style-dictionary`. The CSS
  is **reference-based**: `css/primitives.css` is the sole raw-value/`light-dark()`
  theme layer; semantics and per-component tiers are `var(--…)` references.
  Brand = `[data-brand]`, light/dark = `[data-theme]`; one import
  (`@constructor-lab/tokens/css`) pulls in everything.
- **`tools/style-dictionary/`** — its real script is `build`; asset output lands
  in a **gitignored `dist/`**.
- **`tools/figma-icons-fetcher/`** — run via `tsx` (no build step). Node
  selection is pluggable: `frames-by-name` / `new-frames` / `icon-packs`.
- **`tools/figma-token-exporter/`** — a **self-hosted Figma plugin + local
  receiver** writing into `packages/tokens/.tmp/figma-tokens/` (the snapshot the
  sync emitters consume). It replaces the third-party figma-console Desktop
  Bridge for the bulk token pull; `src/convert.ts` faithfully ports
  figma-console's variable→DTCG serialization so the snapshot stays a drop-in.
  Run the receiver via `tsx`; the plugin is imported into Figma Desktop from its
  `manifest.json`. Used by the `/sync-tokens` flow.
- **`tools/eslint-rules/`** — a local ESLint plugin (`acronis-patterns`) encoding
  approved-pattern rules from `packages/ui-spec/patterns/` (currently
  `no-adhoc-sheet`), wired directly into the root `eslint.config.js`. **Not a
  pnpm workspace** — no `package.json`, none of the standard scripts; a plain JS
  module imported by the flat config.

## Scripts vocabulary

Every workspace exposes the same script names — run them with
`pnpm -r <name>` (all workspaces, topological order) or
`pnpm --filter <package> <name>` (one workspace).

Non-obvious cases:

- `apps/demos` is intentionally **source-only**: its `dev`/`build` are no-ops
  because the package is consumed via source-file exports.
- `tools/style-dictionary`'s real work is `build`; only `dev` is a no-op.

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

## Required cross-cutting context

Before doing any work in this repository, read both of these files:

- `context/conventions.md` — coding and editing conventions
- `context/commits.md` — commit and pull-request conventions

## Cross-cutting context (read on demand)

**[`context/README.md`](context/README.md) is the annotated catalog** — read it
to decide which of these to open. One line each here:

- `context/ecosystem-vision/` — north-star vision & governance for the whole
  Cyber ecosystem (8-layer model, RFC board). Draft, nothing adopted.
- `context/releasing.md` — Changesets workflow for any published workspace.
- `context/roadmap.md` — product roadmap. **Epic/issue numbers are inherited
  from upstream `acronis/uikit` and are not live in this repo.**
- `context/e1-theme-delivery.md` — E1 theme-delivery implementation proposal.
- `context/project-board.md` — inherited board operating model; **not set up
  in this repo yet.**
- `context/next-gen-components-migration.md` — migrating the component token
  tier to Figma's next-gen `brand.components`. §9 tracks execution status.
- `packages/ui-spec/context/component-specs-proposal.md` — the proposal behind
  `packages/ui-spec`. Phase 0 spike in progress.
- `context/kit-consistency-audit-proposal.md` — cross-component consistency
  rules + complete-screen audit. Landing incrementally in `packages/ui-spec`.
- `context/component-layers-proposal.md` — Primitive vs Composite layer model.
  Proposed; not adopted.
- `context/opinionated-composites-proposal.md` — config-driven composite layer
  over the primitives. Proposed; not adopted.
- `context/demo-console-portal-proposal.md` — turn `apps/demo` into one console
  portal driven by a committed `spec-index.json`. Proposed; not adopted.
- `context/uikitless-workflow-proposal.md` — the rules-over-components question;
  reports a generate → lint → audit prototype. Proposed; not adopted.
- `context/pattern-first-screens-proposal.md` — build whole screens from
  patterns, never primitives; **Figma as a weak source, not the authority.**
  Proposed; not adopted.
- `context/demo-pattern-screens-proposal.md` — the pattern-first pilot in
  `apps/demo`. **Screens are built and specced**; proposal not adopted.

## Tooling preconditions

- Enable pnpm via `corepack enable` (the pinned version is in the root
  `packageManager` field).
- **TypeScript** for all new source code.
- The catalog block in `pnpm-workspace.yaml` is the single source of
  truth for shared dependency versions — bump there, not per workspace.
  Respect intentional drift noted in catalog comments.
- Use `pnpm --filter <package> <script>` over `cd <workspace> && pnpm <script>`.
- **Never** use `--no-verify` to bypass commit hooks; fix the underlying
  issue. The pre-commit hook runs **`lint-staged` only** — it does not
  typecheck, so run `pnpm -r typecheck` yourself (see `context/commits.md`).

## What this repo does NOT have

To prevent agents inventing things from outdated knowledge:

- **No Vue**. The repo is React-only. Any `.vue` reference is stale.
- **No VitePress**. Docs are Next.js + Fumadocs at `apps/docs/`.
- **No `packages/documentation/` or `packages/examples/`**. Those paths
  never existed in this repo.
- **No `.agents/skills/` mirror**. `.claude/skills/` is the **sole home** for
  skills. A stale, unreferenced `.agents/` snapshot was removed (it had drifted
  from `.claude/skills/`); do not recreate a second copy — maintain skills only
  under `.claude/skills/`.

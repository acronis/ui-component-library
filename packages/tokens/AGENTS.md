# AGENTS.md — `packages/tokens`

`@constructor-lab/tokens` — the **published** tokens package. It **merges** the former
`@constructor-lab/design-tokens` (DTCG source) and `@constructor-lab/tokens-pd` (generated CSS)
into one workspace:

- **Source of truth**: DTCG-2025.10-conformant JSON under `tiers/` (ajv-validated
  against `schemas/tier.schema.json`). Consumes the vendored DTCG-2025-10 spec
  snapshot under `context/DTCG-2025-10/`.
- **Generated, committed output**: `css/`, `scss/`, `js/`, `dtcg/` — built from
  `tiers/` by [`tools/style-dictionary`](../../tools/style-dictionary). Never
  hand-edit these (they carry a DO-NOT-EDIT header); change a value in `tiers/`
  and rebuild.

Repo-wide rules (TypeScript, file naming, Conventional Commits,
Changesets) live in the repo root's [`../../context/`](../../context/)
and apply on top. This file documents only what is specific to this
workspace; the deeper conceptual reference lives in
[`./context/`](./context/).

## The delivered CSS (reference-based)

The build emits one bundle, not a per-brand/per-component fan-out:

- `css/primitives.css` — the **only** layer with raw values + `light-dark()`
  (the theme axis lives here). `css/semantics.css` + `css/components/<C>.css`
  emit `var(--…)` **references** onto primitives, so each value is stated once.
- Brand switches via **`[data-brand]`**, light/dark via **`[data-theme]`** — every
  brand is carried in the one bundle (the default brand under `:root`, others as
  `[data-brand='…']` override blocks). No per-brand files, no runtime injection.
- `css/index.css` is the single import (`@constructor-lab/tokens/css`) pulling in
  primitives + semantics + every component. `css/tailwind-theme.css` is the
  generated Tailwind v4 `@theme inline` bridge. `scss/_mixins.scss` exposes
  `@include tokens.ui-theme`; `js/tokens.js` is a name→`var()` map.

## Build

```bash
pnpm --filter @constructor-lab/tokens build    # delegates to @constructor-lab/style-dictionary (pd-css)
```

Regenerates `css/`, `scss/`, `js/`, `dtcg/` from `tiers/`. Output is committed;
CI fails if a tier change isn't rebuilt + committed.

## Validate

```bash
pnpm --filter @constructor-lab/tokens test       # alias for validate
pnpm --filter @constructor-lab/tokens validate    # ajv-compiles the schema, validates the tier files
```

`--strict=false` is required for the tokens schema — a known ajv quirk from the `properties`/`patternProperties` overlap on `$extensions`. It is already baked into the `validate` script; keep it.

## Emit (re-emit tiers from a Figma snapshot)

```bash
pnpm --filter @constructor-lab/tokens emit
```

One-command re-emit: builds the normalized snapshot from the
figma-token-exporter output in `.tmp/figma-tokens/`
(`figma-snapshot-build.mjs --tmp`), runs the three tier emitters in dependency
order (`emit-primitives` → `emit-semantics` → `emit-components`), then
`validate` — fail-fast (`&&`-chained). All scripts live in the
[`/figma-to-design-tokens`](../../.claude/skills/figma-to-design-tokens/SKILL.md)
skill; this is the **figma-console-free** path (it reads `.tmp/figma-tokens/`,
which the exporter writes — no MCP pull). Requires a populated
`.tmp/figma-tokens/` snapshot. It does **not** rebuild `tokens`, review the
diff, or fix consumers — run the skill for a diff-gated full sync.

`build` regenerates the output (above). `dev` / `clean` / `lint` / `typecheck`
are intentional no-ops — there is no TypeScript to compile here. `test` runs the
ajv validation so `pnpm -r test` covers this workspace in CI.

## Loading context

This index is **not a knowledge base**. Before doing any non-trivial work, find the matching row below and **read every listed file in full** before acting. Do not load files that aren't listed; do not skip files that are.

When a new file lands under `context/`, add a row here in the same change. An unlisted file is invisible to the agent.

### Context — hand-authored

| When the task involves…                                                                                                                                          | Load                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Grounding vocabulary (Tier, Group, Mode, Theme, Brand, Collection, token)                                                                                        | [`context/glossary.md`](context/glossary.md)     |
| Running the canonical one-way Figma → repo sync (export snapshot, `pnpm tokens:sync`, diff review)                                                               | [`context/figma-sync.md`](context/figma-sync.md) |
| Writing/reading a `.tokens.json` — the files, token shape (`$value`/`$type`/`values`/`platforms`/`$extensions`), modes & themes, the alias chain, platform scope | [`context/manifest.md`](context/manifest.md)     |
| DTCG conformance & divergence, the `$schema`/Figma discriminator, `$extensions` namespaces (`com.acronis.*`/`com.figma.*`), naming / `$`-prefix / `$type` rules  | [`context/spec.md`](context/spec.md)             |
| Sizing a token change — whether a change is a major / minor / patch bump, and how to record it                                                                   | [`context/versioning.md`](context/versioning.md) |

### DTCG 2025.10 spec — vendored snapshot

Authoritative for all format questions. Read the relevant module's `index.md` (which lists its chapters) before answering rather than relying on memory.

| When the task involves…                                                                                | Load                                                                           |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Token-file structure, token anatomy, `$type`, `$extensions`, groups, aliases, composite types          | [`context/DTCG-2025-10/format/index.md`](context/DTCG-2025-10/format/index.md) |
| Color semantics — `colorSpace`, `components`, `alpha`, gamut mapping, interpolation, naming strategies | [`context/DTCG-2025-10/color/index.md`](context/DTCG-2025-10/color/index.md)   |

## Changesets

This is a **published** workspace, so a change to its published surface
(`tiers/`, `schemas/`, the `exports` map) needs a changeset. See
[`../../context/releasing.md`](../../context/releasing.md).

## Conventions for new context files

- **Project rules**: `context/<name>.md`, lowercase-hyphen-separated. Each file owns one concept; do not duplicate content across files. Cross-link with relative paths.
- **Reference snapshots** (vendored specs, large data dumps): their own directory under `context/`, with their own `index.md`.
- **Never** inline rules into this file — extract to a file under `context/` and add a table row.

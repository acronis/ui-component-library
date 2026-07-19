# 03 — Layer Contracts

- **Status:** Draft for discussion
- **Part of:** [Cyber Ecosystem — Vision & Governance](README.md)

> The heart of the "maximum strict rules" requirement. **Every layer is a
> validated artifact.** This document is the contract table: for each layer, the
> artifact, its schema, its validator, who owns it, and which merge gate it must
> pass. Items marked **(new)** don't exist yet and are proposed by this vision;
> everything else is verified present in the repo today.

## 1. The contract, per layer

### 0b — Tokens

- **Artifact:** `packages/tokens/tiers/*.json` (DTCG) → generated, committed
  `css/`, `scss/`, `js/`.
- **Schema/validation:** ajv `validate` against DTCG; the reference-based CSS
  invariant (`primitives.css` is the only raw-value layer, everything else is
  `var(--…)`); `token-emit` orphan-coverage gate.
- **Edge into Figma:** `sync-tokens` — diff-gated pull; **no tier file is written
  without explicit human approval**.
- **Owner:** design-system / tokens maintainers.
- **Gate:** `pnpm --filter @constructor-lab/tokens validate` + build must be green;
  downstream `--ui-*` references must resolve.

### 0c — Icons

- **Artifact:** `packages/icons-svg/**` (SVG) → generated `packages/icons-react`.
- **Schema/validation:** SVGO-normalized sources + JSON manifests; generated
  React components are reproducible from source.
- **Owner:** icons maintainers.
- **Gate:** icons-react build + tests green; legacy-name map stays resolvable.

### 1 — Primitive · 2 — Composite (the 7-file component spec)

- **Artifact:** `packages/ui-react/src/components/<name>/` (component + tests +
  stories + `.figma.tsx`) **paired 1:1 with** `packages/ui-spec/components/<name>/`
  (the 7 files below).
- **Schema/validation:**

  | Spec file          | Schema                | Enforces                                                                                                                           |
  | ------------------ | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
  | `index.yaml`       | `index.schema.json`   | identity + `status`, `category`, **`layer: primitive\|composite`**, `figma.node`, `figma.codeConnect`, `dependencies.components[]` |
  | `anatomy.yaml`     | `anatomy.schema.json` | `root`, `parts[]`, `layout`, `states[]`, `internal_state[]`, `transitions[]` (the state machine)                                   |
  | `api.yaml`         | `api.schema.json`     | `contract` (properties/events/content/methods) + `adapters` (react/vue/wc, `status: implemented\|planned`)                         |
  | `tokens.yaml`      | `tokens.schema.json`  | token **names only** (`^--ui-[a-z0-9-]+$`); a `value` key is **forbidden** (single source of truth)                                |
  | `behavior.md`      | —                     | Given/When/Then scenarios                                                                                                          |
  | `accessibility.md` | —                     | ARIA / keyboard / focus / contrast                                                                                                 |
  | `README.md`        | —                     | when to use / not use                                                                                                              |

- **The anti-rot check:** `lib/cva.ts` `extractCvaGroups()` parses the real
  `ui-react` source AST and `specs.test.ts` asserts each `api.yaml` variant/size
  enum **equals** the component's actual `cva()` keys. A spec can't drift from code.
- **Layer discipline:** primitives wrap ≤1 Base UI primitive; composites carry
  `layer: composite` and, if they realize a pattern, are named by that pattern's
  `implementedBy`.
- **Owner:** kit developers (`developer-react`); design owns the Figma node +
  Code Connect.
- **Gate:** `pnpm --filter @constructor-lab/ui-spec validate` (schema + cva
  conformance) · `kit-lint` (static grammar detectors) · ui-react build + Vitest.
- **Pre-flight:** the `component-readiness` skill audits token/spec/test/Figma
  completeness before `/figma-component`.

### 3 — Pattern

- **Artifact:** `packages/ui-spec/patterns/<name>/pattern.yaml` (20 exist).
- **Schema:** `pattern.schema.json` — `intent`, `description`, `when_to_use[]`,
  `when_not_to_use[]`, `anti_patterns[]`, `components[]` (each must exist in
  `ui-react`), `replaces` (legacy element), **`implementedBy`** (must be a
  `layer: composite` component), `example` (approved copy-paste composition).
- **Validation:** `patterns.test.ts` — schema + every `components[]` entry and
  the `implementedBy` target resolve to real components.
- **Growth:** `patterns/GRADUATION.md` — a pattern graduates to a composite when
  it recurs in ≥2 screens with a stable API and no token gaps.
- **Owner:** kit maintainers (ratify) + designers (propose from mockups, jointly).
- **Gate:** `patterns.test.ts` green.

### 4 — Template **(new)**

- **Artifact:** `packages/ui-spec/templates/<name>/template.yaml` **(proposed)**.
- **Schema:** `template.schema.json` **(new)** — a fixed layout skeleton, a set
  of named **pattern slots**, a typed **config contract** (e.g. `columns`,
  `actions`, `dataSource`), and `slots[]` escape hatches. Full field list in
  [`04-common-template-layer.md`](04-common-template-layer.md).
- **Validation:** `templates.test.ts` **(new)** — each slot resolves to an
  approved pattern; the realizing composite exists; the config contract typechecks.
- **Owner:** kit maintainers.
- **Gate:** `templates.test.ts` **(new)**.

### 5 — Screen

- **Artifact:** `packages/ui-spec/screens/<slug>/screen.yaml` (6 exist) +
  `audit-snapshot.json`.
- **Schema:** `screen.schema.json` — `route`, `story` (Storybook id), `permissions[]`,
  `figma.{file,node}`, **`pattern`**, **`regions[]`** (`regionId`, `ariaRole`,
  `visibleWhen`, `pattern`, `rules[]` (grammar-rule ids), `layout.{type,position,width,scroll}`,
  `components[]`, recursive `children[]`), **`components[]`** (componentInstance:
  `component` must exist in `ui-react`; `props` accept literals, `{$bind}`,
  `{$token}`), and **`stateMachine`** (`states[]` with `category`, one `initial`;
  `transitions[]` with `from/to/trigger/guard`).
- **New fields (this vision):** `template` (slug → the layer-4 template) and
  `patternless: { reason }` / `templateless: { reason }` tracked escapes.
- **Validation:** `screens.test.ts` — schema + component refs resolve + grammar
  rule refs resolve + `pattern` slug exists + exactly one initial state + all
  states reachable.
- **Rendered audit:** `screen-audit` renders the `story` in light + dark, probes
  a serializable snapshot, and runs the `screen/*` detectors (control-height
  parity, accessible name, contrast — `must`; edge alignment, no-clipping,
  icon-size, radius, vertical rhythm, disabled parity, tab order — `should`).
- **Owner:** PM (logic) + AI skill (`/screen-from-spec`) + dev (review).
- **Gate:** `screens.test.ts` · `require-pattern` ESLint **(new)** · `screen-audit`.

### 6 — App / MFE

- **Artifact:** `app.yaml` (schema exists) per app/MFE.
- **Schema:** `app.schema.json` — `kind: spa | single-screen | microfrontend`,
  `shell`, `primaryNav`, `sections`, `screens[]` (each resolving to a `screen.yaml`),
  `patterns[]`.
- **Validation:** `app.yaml` screens resolve; the shell realizes an `app-shell`
  pattern; nav derives from screen metadata.
- **Reality gap:** Cyber Console currently describes MFEs with GTS `mfe.json` +
  zod at **runtime**, not `app.yaml` at design time. Reconciling the two is
  [RFC-0005](rfcs/0005-cross-repo-governance.md).
- **Owner:** app team.
- **Gate:** app-level schema validation + the MFE's own CI.

### 7 — Console (host)

- **Artifact:** the shell in `@ui/cyber-console` (`apps/shell`) — layout frame +
  screen domain + MF handlers.
- **Contract:** mounts MFEs via Module Federation / GTS; nav derived from each
  MFE's screen extensions; runtime `ScreenExtensionSchema` (zod) validates what's
  mounted.
- **Owner:** console/platform team.
- **Gate:** console CI (oxlint boundaries, vitest) + the aggregated MFE manifest
  validates.

## 2. The three gates (summary)

Every change to layers 1–7 passes, in order:

1. **Schema gate** — the artifact validates against its JSON Schema, and every
   cross-layer reference (slug/name) resolves. (`validate` / `*.test.ts`)
2. **Static gate** — ESLint. `acronis-patterns` today: `no-adhoc-sheet`,
   `prefer-confirm-dialog`, `prefer-stat-row`. **(new)** `require-pattern` at
   screen/app scope: errors on new/changed screens, grandfathers existing ones
   as warnings (per `pattern-first-screens-proposal.md` D2).
3. **Rendered gate** — `kit-lint` (components) and `screen-audit` (screens) run
   the grammar detectors; `must`-severity findings block, `should` warn, and any
   waiver is a scoped, dated **override** logged to the **ledger**.

`must` is only ever set by a human, via a ratified RFC.

## 3. Cross-layer reference integrity (the validated edges)

| Edge                     | The reference                                 | Checked by                              |
| ------------------------ | --------------------------------------------- | --------------------------------------- |
| Component → Base UI      | primitive wraps ≤1 Base UI primitive          | review + `layer` discipline             |
| Component → Tokens       | `tokens.yaml` names `--ui-*` (names only)     | `tokens.schema.json`, `--ui-*` resolves |
| Composite → Pattern      | `pattern.implementedBy` = composite name      | `patterns.test.ts`                      |
| Pattern → Component      | `pattern.components[]` exist in `ui-react`    | `patterns.test.ts`                      |
| Template → Pattern (new) | each template slot → approved pattern slug    | `templates.test.ts` (new)               |
| Screen → Pattern         | `regions[].pattern` slug resolves             | `screens.test.ts`                       |
| Screen → Template (new)  | `screen.template` slug resolves               | `screens.test.ts` (extended)            |
| Screen → Component       | `components[].component` exists in `ui-react` | `screens.test.ts`                       |
| Screen → Grammar         | `regions[].rules[]` ids resolve               | `screens.test.ts`                       |
| Screen → Storybook       | `story` id renders                            | `screen-audit`                          |
| Screen → Figma           | `figma.node` reachable                        | `design-snapshot-review`                |
| App → Screen             | `app.yaml screens[]` resolve to `screen.yaml` | app schema validation                   |
| Console → App            | MFE manifest / GTS extension validates        | zod `ScreenExtensionSchema` (runtime)   |

The design goal is that **no edge is uncheckable**. Where a check is missing
today it's listed **(new)**; where a check is only advisory it ships `should`
first and earns `must` through the ledger.

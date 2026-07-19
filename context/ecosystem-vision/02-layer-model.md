# 02 — The Layer Model

- **Status:** Draft for discussion
- **Part of:** [Cyber Ecosystem — Vision & Governance](README.md)

## 1. The layers

The ecosystem is one ladder. Each rung is a named layer with a single job. Read
top-down (product) or bottom-up (design system):

| #   | Layer         | The artifact                                                | One-line job                                                              | Home (today)                                        |
| --- | ------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------- |
| 0a  | **Figma**     | design file (frames, variables, styles)                     | Where design is authored & patterns are discovered.                       | Figma                                               |
| 0b  | **Tokens**    | `tiers/*.json` (DTCG) → generated `css/scss/js`             | The values (color, space, type, radius) — ambient.                        | `packages/tokens`                                   |
| 0c  | **Icons**     | SVG sources → generated React components                    | The marks — ambient.                                                      | `packages/icons-svg` → `packages/icons-react`       |
| 1   | **Primitive** | `ui-react` component + 7-file spec (`layer: primitive`)     | One cohesive control; wraps ≤1 Base UI primitive.                         | `packages/ui-react` + `packages/ui-spec/components` |
| 2   | **Composite** | `ui-react` component + 7-file spec (`layer: composite`)     | An approved, often config-driven, assembly of primitives.                 | `packages/ui-react` + `packages/ui-spec/components` |
| 3   | **Pattern**   | `pattern.yaml`                                              | An approved recipe for a screen region; may `implementedBy` a composite.  | `packages/ui-spec/patterns`                         |
| 4   | **Template**  | `template.yaml` (**new — §5**)                              | A repeatable, config-driven **page skeleton** reused across many screens. | `packages/ui-spec/templates` (proposed)             |
| 5   | **Screen**    | `screen.yaml` (regions → patterns/template, `stateMachine`) | One route: patterns on a template, plus data + logic.                     | `packages/ui-spec/screens`                          |
| 6   | **App / MFE** | `app.yaml` (kind, shell, primaryNav, sections, screens[])   | A microfrontend: routes → screens + shared shell + state.                 | `packages/ui-spec` (per app) + the app repo         |
| 7   | **Console**   | the host shell that mounts MFEs                             | The product frame that composes MFEs into one experience.                 | `@ui/cyber-console` (`apps/shell`)                  |

Layers 0b/0c (tokens, icons) are **ambient** — any layer may reference them, and
only them, across the ladder. Everything else obeys the strict rule below.

## 2. The one rule that makes it enforceable

> **A layer may compose only the layer directly below it** (plus ambient
> tokens/icons). Reaching two rungs down is a defect.

Concretely:

- **Only primitives touch Base UI.** Composites/patterns/screens never import
  `@base-ui/react` directly.
- **Composites assemble primitives.** Not other composites-as-a-crutch, and
  never raw Base UI.
- **Patterns reference composites (and primitives where a composite doesn't
  exist yet).** A pattern's `components[]` list resolves to real `ui-react`
  components; when it graduates, `implementedBy` names the composite.
- **Templates are built from patterns** and expose typed config + slots.
- **Screens are built from templates and patterns — never hand-wired
  primitives.** This is the load-bearing rule from
  `pattern-first-screens-proposal.md`.
- **Apps compose screens** into routes with a shared shell.
- **Console composes apps (MFEs).**

Why this rule and not "anything goes": it is the property that lets a machine
prove consistency. If a screen may only speak in patterns, then every screen
that uses `table-view` looks like `table-view` — there is no other way for it to
have rendered. Consistency stops being a review opinion and becomes a
grammatical fact.

## 3. The strict chain, end to end

```
┌──────────────────────────────────────────────────────────────────────────┐
│  FIGMA  ── variables/styles ──▶  TOKENS (tiers/*.json → css)               │
│    │            (sync-tokens, diff-gated)                                   │
│    │  frames ── discovery ──▶  PATTERNS / TEMPLATES  (figma-screen-drafts)  │
│    ▼                                                                        │
│  ICONS (svg → react)                                                        │
└──────────────────────────────────────────────────────────────────────────┘
        │ tokens + icons are ambient (referenced by every layer below)
        ▼
   PRIMITIVE  ──cva/anatomy/api/tokens spec──┐
        ▲  Base UI                            │ (composes ▼, validated by 7-file spec)
        │                                     ▼
   COMPOSITE  ──layer: composite, implementedBy target──┐
        │                                                ▼
   PATTERN  (pattern.yaml: components[], example, implementedBy)
        │                                                ▼
   TEMPLATE  (template.yaml: regions as pattern slots + typed config)   ← NEW
        │                                                ▼
   SCREEN  (screen.yaml: regions→patterns/template, components[], stateMachine)
        │                                                ▼
   APP / MFE  (app.yaml: kind, shell, primaryNav, sections, screens[])
        │                                                ▼
   CYBER CONSOLE  (host shell mounts MFEs via Module Federation / GTS)
```

Every arrow is a **validated edge**: the child artifact names its parent by a
slug/name that must resolve, and a test asserts it resolves. See
[`03-layer-contracts.md`](03-layer-contracts.md) for the per-edge checks.

## 4. What already exists vs. what's new

Grounding the vision in the current repo (verified 2026-07-19):

**Already built in `packages/ui-spec`:**

- 7-file component spec + JSON Schemas (`index`, `anatomy`, `api`, `tokens`) and
  **cva ↔ contract conformance** (`lib/cva.ts`) so specs can't rot.
- `layer: primitive | composite` on every component (**65 primitives, 17
  composites** today).
- **20 patterns** (`pattern.yaml`) with `intent`, `components[]`, `anti_patterns`,
  `example`, and `implementedBy` linking a pattern to its graduated composite.
- **`screen.yaml`** schema + 6 screens (`dashboard`, `data-table`, `settings`,
  `settings-form`, `login`, `protection-dashboard`): `regions[]` (each with
  `pattern`, `rules[]`, `layout`, `components[]`, recursive `children[]`), and a
  `stateMachine`.
- **`app.yaml`** schema (`kind: spa | single-screen | microfrontend`, `shell`,
  `primaryNav`, `sections`, `screens[]`, `patterns[]`).
- The **grammar**: typed `KitRule`s (`severity: must|should|may`, `detector`),
  `CHECKLIST.md`, `kit-lint` (static) + `screen-audit` (rendered) detectors,
  scoped dated **overrides**, and a **ledger** of findings.
- ESLint `acronis-patterns`: `no-adhoc-sheet`, `prefer-confirm-dialog`,
  `prefer-stat-row`.

**New in this vision (the gaps):**

1. **Template layer (§5)** — a `template.yaml` artifact + schema + `templates/`
   directory. Does not exist yet; the `common-template` precedent motivates it.
   See [`04-common-template-layer.md`](04-common-template-layer.md).
2. **`require-pattern` / `no-adhoc-composition` ESLint rule** — screen-scope
   enforcement of "no hand-wired primitives." Proposed in
   `pattern-first-screens-proposal.md`; not yet built.
3. **`layer` on the App edge** — screens declare `template`; templates are a
   resolvable slug like patterns.
4. **Cross-repo governance** — today the gates live only in this repo.
   Cyber Console consumes `@acronis-platform/ui-react` (a _different_ npm scope
   from this repo's `@constructor-lab/ui-react`) and defines screens as GTS
   `mfe.json` extensions validated by **zod at runtime**, not `screen.yaml` at
   design time. Making the ladder bind there is the biggest open item — see
   [RFC-0005](rfcs/0005-cross-repo-governance.md).

## 5. Where the Template layer sits (preview)

The `common-template` in `pstorage-ui-hci` proved that an entire page archetype
("resource list with search, batch actions, and a detail flyout") can be a
**single config-driven template** reused across ~50 pages, where each page is
just declarative config (columns + an actions map + slot overrides).

In our ladder that is **layer 4 — Template**: below Screen, above Pattern. A
template is a **config-driven composite of patterns** with a fixed layout
skeleton and typed slots. A `screen.yaml` picks a template and fills its config;
the template guarantees the geometry. This is the one structural addition the
vision makes to the existing `ui-spec` model. Full design in
[`04-common-template-layer.md`](04-common-template-layer.md).

## 5b. Alignment with pattern-first (read this if you own the pattern layer)

This model **is** `pattern-first-screens-proposal.md`, not a departure from it.
The pattern stays **the mandatory unit** of screen construction: screens compose
patterns, screen/app code never touches primitives, and the same three gates
(schema `regions[].pattern` + `require-pattern` + `pattern-conformance`) apply.

The Template layer does not compete with "the pattern is the unit" — a **template
is a page-level pattern**: a named, reusable arrangement of patterns whose slots
resolve _only_ to approved patterns. In pattern-first's own terms it is a screen
composition that **graduated** (the pattern → composite pipeline from
`component-layers-proposal.md`), which is why [RFC-0002](rfcs/0002-template-layer.md)
proposes realizing it as `layer: composite` + `category: page` rather than a new
`layer` kind.

So the honest framing: whether "Template" is a genuine 4th rung or just a
friendly name for "a graduated page-pattern + its composite" is **left open for
ratification** (RFC-0001/0002) — it is deliberately not pre-decided. Either way
the downward-only rule and the pattern-as-unit thesis hold unchanged.

## 6. Anti-patterns (what the model forbids)

- A screen importing `Button` from `ui-react` directly to place it in a toolbar
  (should go through a `toolbar` pattern / template slot). → `require-pattern`.
- A composite importing another composite to avoid building the right primitive.
- A pattern whose `components[]` name a component that doesn't exist, or a screen
  region whose `pattern` slug doesn't resolve. → schema/registry test.
- A hand-rolled fixed side panel instead of `Sheet` / `sheet-detail-panel`. →
  `no-adhoc-sheet` (already enforced).
- Two `CardFilter` tiles where `StatRow` exists. → `prefer-stat-row` (enforced).
- A token literal (`#0b5cff`) anywhere above the primitives layer. → grammar T1/T2.

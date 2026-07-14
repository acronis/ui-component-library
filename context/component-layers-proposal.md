# Proposal: Component layers — Primitive vs Composite (+ the pattern→composite pipeline)

- **Status:** Proposed (not yet adopted)
- **Date:** 2026-07-06
- **Owner:** Leonid Romanov
- **Affects:** `packages/ui-spec` (schema + every `components/*/index.yaml`),
  `apps/docs` (component nav grouping), `apps/demo` (future templates gallery);
  **no source moves or public-export changes** in `packages/ui-react`.
- **Builds on:** `packages/ui-spec/context/component-specs-proposal.md`
  (the framework-agnostic specs + grammar) and
  `context/kit-consistency-audit-proposal.md` (grammar / patterns / screens).

---

## 1. Problem

`@constructor-lab/ui-react` ships **single-purpose primitives** (`button`, `input`,
`dialog`, `drawer`, `menu`) and **assembled composite components** (`card-filter`,
`app-shell`, `auth-layout`, `sidebar-*`, the `widget-*` family, `filter`) in one
flat `components/ui/` tree with no explicit distinction between the two. That
blurs three things we actually want to do:

1. **Consistency / governance** — approved compositions should be discoverable and
   enforced, not re-invented per team.
2. **App-assembly speed** — teams want ready-made, reusable building blocks, not
   just atoms.
3. **Copy-paste starters** — a "real app" gallery of full screens to lift and tweak.

We already have the raw material spread across layers — `ui-spec/patterns` (recipes),
a growing set of composite components, `ui-spec/screens` (assembled screens) — but
no **named layer model** that ties them together, and no machine-readable signal
for "is this a primitive or a composite?". Without that signal, docs, the demo
gallery, and agent tooling can't group or reason about the kit by altitude.

Two non-goals, already decided:

- **No separate `ui-blocks` package.** A shadcn-blocks-style package fits shadcn
  because shadcn ships no library; we publish `@constructor-lab/ui-react`, so composites
  are published components and recipes are `ui-spec/patterns`. A parallel package
  would duplicate those and fight the grammar/audit consistency machinery.
- **No atomic-design jargon** (atoms/molecules/organisms). We use terms grounded
  in this repo's existing vocabulary.

## 2. Decision — the layer ladder

One coherent ladder, four rungs, reusing terms the repo already uses
("primitive", "pattern", "screen"):

| Layer         | Definition                                                                                | Examples                                                                       | Home                            |
| ------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------- |
| **Primitive** | Single-purpose. Wraps one Base UI primitive or is one styled element; ~one job.           | `button`, `input`, `checkbox`, `switch`, `dialog`, `menu`, `drawer`, `tooltip` | `ui-react`                      |
| **Composite** | Assembles multiple primitives into a reusable, **approved solution**.                     | `card-filter`, `app-shell`, `auth-layout`, `sidebar-*`, `widget-*`, `filter`   | `ui-react`                      |
| **Pattern**   | The framework-agnostic spec/recipe for an approved composition (may precede a composite). | `filter-popover`, `data-table-bulk-actions`, `sheet-detail-panel`              | `ui-spec/patterns`              |
| **Template**  | A full-page assembly — the "real app" gallery.                                            | `protection-dashboard`                                                         | `ui-spec/screens` → `apps/demo` |

**Terminology:** the two component layers are **Primitive** and **Composite**.
"Pattern" and "Template/screen" already exist; this proposal only adds the
Primitive/Composite axis to components and formalizes how they relate.

### Deciding rule (primitive vs composite)

The axis is **altitude and cohesion**, _not_ a mechanical "does it import a
sibling?" check — that would wrongly flag single controls that legitimately
compose lower pieces (`field` = label + control + error; `input-search` = input +
icon; `button-menu-dropdown` = button + menu). Ask instead: **does this read as one
cohesive control/element, or as an arrangement of several distinct kit components?**

- **Primitive** — a single, cohesive control or element, **even if it internally
  composes a lower-level piece as an implementation detail**. Example: a
  `TruncatedText` utility that renders clipped text and conditionally wraps one
  `Tooltip` _only when the text actually overflows_ — its job is "show text"; the
  tooltip is a progressive detail, so it's a primitive. Layout helpers that arrange
  arbitrary children (`stack`, `grid`, `section`, `aspect-ratio`) are also
  primitives — single-purpose and content-agnostic — classified `layer: primitive`
  (there is **no separate `layout` value**).
- **Composite** — exists to **assemble multiple distinct kit components into a
  larger, recognizable, reusable solution or region**: `card-filter`, `app-shell`,
  `auth-layout`, `sidebar-*`, the `widget-*` family, `filter`.

Tie-breaker: describe it in one sentence. "_A control that…_" → primitive;
"_a region/arrangement that assembles…_" → composite. Composing **one** sibling as
a detail stays primitive; composing **several as its reason for existing** is
composite. The full classification of the current ~60 components is a Phase-1
deliverable applying this rule; the table above is representative, not exhaustive.

## 3. Mechanism — classify, don't relocate

Add a **`layer: primitive | composite`** field to each component's
`packages/ui-spec/components/<name>/index.yaml` (which already carries `category`
and `status`). This is the single machine-readable source of truth for the axis.

- **No file moves** in `ui-react`, and **no change to the flat public exports** in
  `src/index.ts` — so this is **non-breaking** for consumers and leaves VR baselines
  untouched (baseline ids derive from Storybook `title`, not file path).
- Docs, the demo gallery, `kit-lint`/screen-audit, and agent tooling read `layer`
  to group and reason about the kit by altitude.
- A physical `components/composite/` (or `/blocks/`) folder split is **explicitly
  deferred** — it's pure churn with real risk (import rewrites, story-title drift →
  baseline renames) and buys nothing the metadata field doesn't. Revisit only if a
  concrete need appears.

Schema: extend `packages/ui-spec/schema/index.schema.json` with the optional
`layer` enum; `__tests__/specs.test.ts` validates it. Optionally make `layer`
**required** in a later phase once every spec is classified, so new components
must declare their altitude.

## 4. The pattern → composite pipeline (the growth engine)

This is how "grow the patterns library with real composite components" works:

1. A recurring composition is captured as a **pattern** in `ui-spec/patterns`
   (the recipe: which components, which grammar rules govern it).
2. When it proves stable and broadly useful, it **graduates** into a published
   **composite** component in `ui-react` (its own dir, tests, stories, a
   `status: draft`→`ready` spec with `layer: composite`).
3. The pattern's `pattern.yaml` cross-links the composite that implements it, so
   the recipe and the shipped component stay in sync (a check can assert the link).

Graduation criteria (proposed): used in ≥2 real screens, stable API, governed by
existing grammar rules, and no unresolved token gaps. `card-filter` / `app-shell` /
the `widget-*` family are the existing precedents.

## 5. Templates gallery (later, in `apps/demo`)

The full-screen "real app" experience lives in **`apps/demo`**, rendering
`ui-spec/screens` descriptors as browsable, copyable example screens — the
copy-paste-starter goal, reusing the screen descriptors + `DemoReact` rather than
a new package. This is the last phase and depends on the layer model being in place.

## 6. Impact & scope

- **`ui-spec`**: one schema field + a `layer` line on each `index.yaml` (~60 files,
  mechanical). Private package — no changeset.
- **`apps/docs`**: group the component nav by `layer` (Primitives vs Composites)
  under/alongside the existing `category` sections.
- **`ui-react`**: **none** in Phase 1 (no moves, no export changes, no VR churn).
- No published-package behavior change → no `ui-react` changeset for Phase 1.

## 7. Rollout

- **Phase 1 — Classify.** Add the `layer` field + schema; classify every component
  by the §2 rule; validate. Non-breaking.
- **Phase 2 — Surface it.** Group `apps/docs` component nav by Primitive/Composite.
- **Phase 3 — Formalize the pipeline.** Pattern↔composite cross-links + the
  graduation checklist; a check that a `pattern.yaml` naming a composite resolves.
- **Phase 4 — Gallery.** Render `ui-spec/screens` as the real-app templates gallery
  in `apps/demo`.

## 8. Alternatives considered

- **Separate `ui-blocks` package** — rejected: duplicates `ui-spec/patterns` +
  composite components + `ui-spec/screens`, adds a fifth home for compositions, and
  works against the grammar/audit consistency system.
- **Atomic-design terms** (atoms/molecules/organisms) — rejected per the owner: not
  the repo's vocabulary.
- **Physical folder reorg first** — deferred: churn + baseline-rename risk for no
  gain over the metadata field.

## 9. Open questions

- **Resolved:** layout helpers (`stack`/`grid`/`section`/`aspect-ratio`) stay
  `layer: primitive` — no separate `layout` value.
- **Resolved:** a single cohesive control that internally composes a lower piece
  as a detail (e.g. a `TruncatedText`-style utility wrapping one `Tooltip`) is a
  **primitive**, not a composite — the axis is altitude/cohesion, not imports (§2).
- Should `layer` become **required** in the schema, and from which phase?
- Docs: group by `layer` first then `category`, or add `layer` as an orthogonal
  filter over the existing `category` sections?

# 05 — Roles & the Authoring Workflow

- **Status:** Draft for discussion
- **Part of:** [Cyber Ecosystem — Vision & Governance](README.md)

## 1. Who owns what

The ecosystem's separation of concerns lets each role work in its own language
and never step on the others'. Logic and look are **orthogonal**: a PM can change
a flow without touching the visuals; a designer can propose a pattern without
writing code.

| Role               | Owns (the _what_)                                 | Authors (the artifact)                                | Does **not** do                  |
| ------------------ | ------------------------------------------------- | ----------------------------------------------------- | -------------------------------- |
| **PM**             | Intent, states, data, rules, acceptance criteria  | PRD → `screen.yaml` `stateMachine` + data binds       | wire components, pick pixels     |
| **Designer**       | Hierarchy, intent, **pattern/template discovery** | Figma mockup (a discovery source) + pattern proposals | dictate structure pixel-by-pixel |
| **Developer**      | The catalog + generation + review of logic        | patterns, composites, templates, generated screens    | re-derive looks per screen       |
| **Kit maintainer** | The catalog's integrity + the grammar             | `ui-spec` schemas, grammar rules, ratifications       | ship product screens             |
| **Design-system**  | Tokens + icons                                    | `tiers/*.json`, icon sources                          | —                                |

## 2. The end-to-end authoring loop

```
   PM writes PRD ────────────────────────────────────┐
   (entities, states, data shapes, actions,          │
    per-state ACCEPTANCE CRITERIA)                    │  D3 contract
                                                      ▼
   Designer explores in Figma  ──discovery──▶  proposes pattern/template?
                                                      │            │ yes
                                                      │            ▼
                                                      │   kit maintainer ratifies
                                                      │   → new pattern / template
                                                      ▼
   /screen-from-spec (AI skill)
     reads PRD (+ optional Figma node)
     → emits screen.yaml:
        • template: <slug>  OR regions[].pattern
        • $bind / $token data slots
        • stateMachine from the PRD logic
                                                      ▼
   Generate ── renders ui-react screen using ONLY referenced patterns/templates
                                                      ▼
   ┌─────────────── THE THREE GATES ───────────────┐
   │ 1. Schema     screen.yaml validates; refs resolve │
   │ 2. Static     require-pattern: no hand-wired prims │
   │ 3. Rendered   screen-audit: anatomy matches patterns│
   └──────────────────────┬─────────────────────────┘
                          │ fail → regenerate    │ pass
                          └──────────────────────▶ ship (rule-true)
                                                      ▼
   Acceptance criteria (from the PRD) double as the test/audit ORACLES
```

The spec is canonical; the generated implementation is disposable and
idempotently regenerable. Editing a screen means editing the spec, then
regenerating — never patching the output by hand.

## 3. The PRD → spec contract (what a PM must supply)

For `/screen-from-spec` to map a screen onto patterns without guessing, a PRD
must state (the D3 contract from `pattern-first-screens-proposal.md`):

1. **Entities** — the domain objects on the screen.
2. **States** — every state the screen can be in (idle, loading, loaded, empty,
   error, plus domain states like `confirming-delete`).
3. **Data shapes** — the fields each entity carries.
4. **Actions** — what the user can do, and what each does.
5. **Per-state acceptance criteria** — the PM's definition of "done" for each
   state. **These become the screen's test/audit oracles.**

The PM writes prose; the skill turns it into a `stateMachine` + data binds. The
authoring surface is "describe intent + pick behavior," never "wire components."

## 4. Designers: Figma is a discovery source, not the authority

A designer explores a screen in Figma and the implementation may **intentionally
diverge** to be rule-truer than the mockup. Each divergence is **classified**
(via a `mockup-vs-pattern` skill), not silently imported:

- **Improvisation → correct it.** The implementation follows the pattern; the
  deviation is noted for the designer.
- **Genuinely new structure → graduate it.** A candidate new pattern/template,
  jointly owned: the designer proposes, a kit maintainer ratifies (D4).
- **Intended exception → override.** A scoped, dated grammar override, logged to
  the ledger.

So designers get leverage — they seed the catalog — without the mockup silently
dictating a screen's anatomy or VR baselines rewarding drift.

## 5. Developers: compose from the catalog, spend review on logic

Developers stop hand-building screens and instead:

- Build and graduate **patterns → composites → templates** as demand recurs.
- Run the generate → lint → audit loop for screens; regenerate until green.
- Review the **logic** (state machine, data binds, acceptance criteria), because
  the **look** is already guaranteed by the gates.

Kit-internal code (composites, patterns, templates) still composes primitives
freely; enforcement is scoped to **app/screen** code.

## 6. The skills that already exist (the toolchain)

The workflow is not hypothetical — these skills are shipped in this repo and are
the executable steps of the loop:

| Skill                                    | Step it automates                                              |
| ---------------------------------------- | -------------------------------------------------------------- |
| `figma-to-design-tokens` / `sync-tokens` | Figma → tokens (diff-gated, human-approved).                   |
| `figma-component`                        | Figma node → ui-react component + 7-file spec + Code Connect.  |
| `legacy-component` / `react-component`   | component from legacy source / from description.               |
| `component-readiness`                    | Pre-flight audit before building a component.                  |
| `migrate-icons`                          | legacy Acronis icons → `icons-react`.                          |
| `grammar-rule`                           | Curate a new grammar rule from a ledger finding.               |
| `kit-lint` / `screen-audit`              | Static + rendered consistency gates.                           |
| `figma-screen-drafts`                    | Figma file → draft `screen.yaml`s (design-first).              |
| `app-screen-spec`                        | Code-first screen↔component↔story↔figma coupling for an MFE.   |
| `design-snapshot-review`                 | Figma frames ↔ Storybook story snapshots, consistency verdict. |
| `ui-kit-pipeline` / `team-lead`          | Orchestrate the phased agent team for non-trivial work.        |

**Gaps to build** (proposed by this vision): `/screen-from-spec`,
`mockup-vs-pattern`, the `require-pattern` ESLint rule, and the Template layer
skill.

## 7. What each role reads first

- **PM:** [`01-vision.md`](01-vision.md) → this doc §3 → the RFCs for logic
  contracts.
- **Designer:** [`01-vision.md`](01-vision.md) → this doc §4 →
  [`04-common-template-layer.md`](04-common-template-layer.md).
- **Developer:** [`02-layer-model.md`](02-layer-model.md) →
  [`03-layer-contracts.md`](03-layer-contracts.md) → the RFCs.

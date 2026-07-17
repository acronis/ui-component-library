# Proposal: Pattern-first screens — build interfaces from patterns, never from primitives

- **Status:** Proposed (not yet adopted)
- **Date:** 2026-07-17
- **Owner:** Leonid Romanov
- **Affects:** `packages/ui-spec` (screen schema: `pattern` becomes the unit;
  a new pattern-conformance detector + grammar row), `tools/eslint-rules`
  (a `require-pattern` / `no-adhoc-composition` rule at screen scope),
  `apps/*` (screens authored/generated as pattern compositions), a new
  `/screen-from-spec` skill, and a `mockup-vs-pattern` reconciliation skill.
  **No change to primitives' or composites' public surface.**
- **Builds on:** `context/uikitless-workflow-proposal.md` (the rules-over-components
  line + the generate→lint→audit loop), `context/component-layers-proposal.md`
  (Primitive vs Composite), `context/opinionated-composites-proposal.md`
  (config-driven composites + insisting-on-use via ESLint),
  `context/demo-console-portal-proposal.md` (`screen.yaml` renderer, `app.yaml`,
  the `/generate-app` idea), and `context/kit-consistency-audit-proposal.md`
  (grammar / screens / screen-audit / ledger). Consumes the `figma-screen-drafts`,
  `design-snapshot-review`, and `screen-audit` skills.

---

## 1. Problem

The kit has spent its consistency budget on the **component** layer — tokens,
primitives, composites, grammar, the rendered audit. But interfaces are still
assembled the old way: an engineer opens a screen and **hand-wires primitives**
(`Table` + `TableRow` + `Button` + `Field` + a `fixed` div) to match a Figma
mockup. Every screen is a fresh act of composition, so every screen is a fresh
chance to drift — the exact failure modes the grammar enumerates (Z2 control
heights, C6 two-components-for-one-job, C2 misalignment, the ad-hoc `Sheet` the
`no-adhoc-sheet` rule already catches).

Composites and patterns exist, but their use is **optional**. Nothing forces a
screen to be built from them, so consistency is still a matter of author
discipline — and discipline doesn't scale across teams and time.

The unfinished half of `uikitless-workflow-proposal.md` §9 was exactly this:
close the _generation_ half and codify the component-vs-rules boundary. This
proposal does both, by making the **pattern the mandatory unit of screen
construction**.

## 2. Thesis

**Screens are composed from patterns, all the way down — and screen/app code may
not reach for primitives directly.**

```
primitives (Base UI + tokens)      ← kit-internal; never used at screen level
   └─ composites (config-driven)   ← the building blocks patterns are made of
        └─ patterns (approved recipes)   ← the UNIT a screen is built from
             └─ screens (screen.yaml: regions → patterns)   ← what PMs/AI author
                  └─ app (app.yaml: routes + screens + state)
```

A screen becomes a **declaration**: "this region is the `table-view` pattern,
this one is `form-layout`, this one is `detail-drawer`," plus the data and logic
bound to each. The visual representation of every screen is therefore identical
by construction, because it is literally the same patterns rendered — not a
lookalike re-assembled by hand.

This is the same move composites made over primitives (`opinionated-composites`),
lifted one level: **patterns over composites, at the screen tier.**

## 3. Who authors what (separation of concerns)

| Role                | Owns                                                                                          | Artifact                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **PM**              | the _what_ and the _behavior_ — requirements, states, data, rules of the flow                 | PRD → feeds `screen.yaml` `stateMachine` + data bindings                            |
| **Designer**        | intent, hierarchy, and **pattern discovery**                                                  | Figma mockup — a _reference/discovery_ input, not the structural authority (see §6) |
| **AI skill**        | decouples a screen into a spec, maps logic to the state machine, generates the implementation | `screen.yaml` + generated ui-react screen                                           |
| **Kit maintainers** | the pattern/composite catalog + grammar                                                       | `ui-spec/patterns`, composites, `grammar`                                           |

The PM writes logic once, in prose; the AI turns it into a pattern-composed spec;
the kit guarantees the look. No one hand-masters primitives to ship a screen.

## 4. How it works end-to-end

Reuses the loop already prototyped in `prototypes/generate-lint-audit/`:

1. **Decouple** — `/screen-from-spec` reads the PRD (+ optional Figma node) and
   emits a `screen.yaml`: regions, each bound to an **approved pattern** from the
   committed `spec-index.json` catalog, with `$bind`/`$token` data slots and a
   `stateMachine` from the PRD's logic. The PRD must supply the **D3 contract**
   (entities, states, data shapes, actions, **and per-state acceptance criteria**)
   so the skill maps patterns and builds the state machine without guessing — and
   the acceptance criteria double as the screen's **test/audit oracles**.
2. **Generate** — the skill renders the spec into a ui-react screen using only the
   referenced patterns/composites (the `screen.yaml` renderer proposed in
   `demo-console-portal-proposal.md` §4b is the deterministic path; the LLM path
   fills slots).
3. **Lint** — `require-pattern` (ESLint, screen scope) rejects any screen that
   hand-wires primitives instead of a pattern/composite.
4. **Audit** — `screen-audit` (rendered) + a new **pattern-conformance** detector
   verify each region maps to its declared pattern and the grammar holds.
5. **Regenerate on failure** — until green. The spec is the source; the
   implementation is disposable and idempotently regenerable.

## 5. Making patterns mandatory (enforcement, not etiquette)

Consistency-by-convention degrades; this must be enforced at three layers:

- **Schema.** Every region maps to an approved pattern. A region declares a
  **primary `pattern`** and **may nest child patterns** — real screens compose
  several (e.g. `main` = `page-header` + `table-view`) — via the schema's existing
  `children[]` regions, each with its own `pattern` (**D1**). A region either
  resolves to a pattern at some nesting level or carries an explicit, tracked
  escape (below). Validated by `screens.test.ts` (the `pattern` slug must resolve
  in `ui-spec/patterns`, which it already checks).
- **Static (source).** Grow `acronis-patterns` from the single `no-adhoc-sheet`
  seed into a general **`no-adhoc-composition` / `require-pattern`** rule scoped
  to app/screen code: assembling ≥N primitives into a screen region that matches a
  known pattern's shape is an error that names the pattern to use. On day one it
  **errors on new/changed screens and grandfathers existing hand-built ones as
  warnings** until they migrate (**D2**). (This is the `prefer-*` growth already
  anticipated in `opinionated-composites-proposal.md`.)
- **Rendered.** A new grammar rule **`composition/pattern-conformance`** (a new
  CHECKLIST row, `screen/pattern-conformance` detector): every region in a
  rendered screen must structurally match its declared pattern's anatomy; an
  unpatterned region is a finding.

**Escape hatch → graduation.** When no pattern fits, a region may declare
`patternless: { reason }`. That is a _tracked deviation_, not a silent one: it
logs a ledger entry and feeds the **pattern-graduation pipeline**
(`patterns/GRADUATION.md`). If the shape recurs, a human ratifies it into a new
pattern (and, if it earns it, a composite). The escape hatch is how the pattern
set grows deliberately instead of the screen layer fragmenting.

## 6. Figma is a weak source — the implementation can be rule-truer than the mockup

Mockups are **human-authored and improvise**: a designer nudges a spacing, invents
a one-off panel, varies a button's placement between screens. Treating the mockup
as the source of truth re-imports that drift into code — and pixel-perfect VR
against a mockup actively _rewards_ it.

So this proposal **inverts the authority**: the **spec (pattern-composed) is the
source of truth; the mockup is a discovery/reference input.** Two consequences:

1. **The implementation may intentionally diverge from the mockup** — snapping an
   improvised layout onto the nearest approved pattern. The shipped screen is
   _rule-truer than the mockup_: more consistent than the thing it was drawn from.
   This is a feature, not a regression.
2. **Divergence is classified, not ignored.** A `mockup-vs-pattern` skill (extends
   `figma-screen-drafts` + `design-snapshot-review`) diffs mockup ↔ spec and sorts
   each difference into one of:
   - **improvisation → correct it** (implementation follows the pattern; note the
     deviation for the designer),
   - **genuinely new structure → graduate it** (a candidate new pattern, via §5's
     pipeline),
   - **intended exception → override** (a scoped, dated grammar override).

Figma thus becomes what it's good at — a place to _discover_ patterns — without
being trusted for structural fidelity. New patterns can be mined from design over
time; the mockup never silently dictates a screen's anatomy. A mined candidate is
**jointly owned**: the designer proposes it from a mockup; a kit maintainer
ratifies it into the catalog (**D4**).

## 7. Questions & solutions

**Q1 — Pattern or composite as the mandatory unit?**
Pattern at the _region/screen_ tier; composites are the blocks patterns compose;
primitives are kit-internal. A screen references patterns; a pattern references
composites; only composites/primitives touch Base UI.

**Q2 — How is "always a pattern" actually enforced (not just advised)?**
Three gates in §5: required `pattern` in schema, `require-pattern` ESLint on app
code, `pattern-conformance` in the rendered audit. A screen that hand-wires
primitives fails to merge.

**Q3 — What if no pattern fits?**
The `patternless: { reason }` escape hatch: a tracked, ledgered deviation that
feeds graduation. Escapes are visible and finite, not a loophole.

**Q4 — Where does PM/business logic live vs. visuals?**
Logic (states, transitions, data, guards) → `screen.yaml` `stateMachine` + binds,
authored from the PRD. Visuals/structure → the patterns. The two are orthogonal:
a PM can change the flow without touching the look, and vice versa.

**Q5 — Is Figma the source of truth?**
No. Patterns + spec are (§6). Figma is a discovery/reference input; the
implementation may be intentionally rule-truer than the mockup.

**Q6 — Can a PM author a spec without kit expertise?**
They author _intent_ (PRD prose + a state list); the `/screen-from-spec` skill
maps it onto patterns from the `spec-index.json` catalog and validates. The
authoring surface is "pick patterns + fill slots," not "wire components."

**Q7 — How do we stop pattern proliferation?**
Patterns are curated: a candidate must earn its place (recurs across real screens)
and a human ratifies it — the same graduation + `must`-is-human discipline the
grammar already uses. The escape hatch surfaces demand; ratification controls
supply.

**Q8 — How does this coexist with today's flexible primitive usage?**
Two tiers. Kit-internal code (composites, patterns) still uses primitives freely.
The enforcement is scoped to **app/screen code** (as `acronis-patterns` already
scopes to `apps/**`). Advanced one-offs use the escape hatch, not a back door.

**Q9 — Spec ↔ implementation ↔ mockup sync?**
The spec is canonical and the implementation is regenerable from it (idempotent).
Drift is caught by `require-pattern` + `pattern-conformance` + design-parity.
Editing a screen means editing the spec, then regenerating.

**Q10 — How do we trust a generated screen?**
The generate→lint→audit loop (already prototyped and shown to hold the line on
`protection-dashboard` and `settings-form`), now with the pattern-conformance
gate added. VR baselines derive from the _spec_, not the mockup.

## 8. What to build (phased; nothing adopted yet)

1. **Schema + conformance.** Make `regions[].pattern` required (with `patternless`
   escape); add the `composition/pattern-conformance` grammar rule + a
   `screen/pattern-conformance` detector + CHECKLIST row.
2. **`require-pattern` ESLint rule.** Generalize `no-adhoc-sheet` into a screen-scope
   anti-ad-hoc-composition rule that names the pattern to adopt.
3. **`/screen-from-spec` skill.** PRD (+ optional Figma node) → `screen.yaml` →
   generated ui-react screen, run through the loop. Start hand-guided (4a), then
   the deterministic `screen.yaml` renderer (4b) from the demo-console proposal.
4. **`mockup-vs-pattern` reconciliation skill.** Classify each mockup↔spec
   divergence (correct / graduate / override). Mine new patterns from Figma.
5. **Pilot.** Regenerate one existing screen (`settings-form` or a demo route)
   purely from a pattern-composed spec; compare consistency to the hand-built and
   the mockup versions.

## 9. Risks & non-goals

- **Rigidity.** A too-small pattern set blocks legitimate UIs. Mitigation: the
  escape hatch + a real, funded graduation pipeline. If escapes pile up, that's a
  signal to add patterns, not to abandon the model.
- **Review cost shifts** (same as `uikitless-workflow-proposal.md` §7): generation
  is cheap, _reviewed_ generation is not. The gates front-load the checks.
- **Detector precision is load-bearing** (the recurring lesson): `pattern-conformance`
  must not cry wolf. It ships `should` first, earns `must` via the ledger.
- **Not** removing primitives, the flexible API, or Figma from the workflow.
- **Not** auto-adopting: this lands incrementally behind the existing gates.

## 10. Decisions (ratified 2026-07-17)

- **D1 — Region granularity: nested patterns.** A region declares a **primary
  pattern** and may **nest child patterns** (via the schema's existing `children[]`
  regions, each with its own `pattern`), so a `main` area can be
  `page-header` + `table-view`. Conformance checks the whole region tree, not a
  single pattern per region.
- **D2 — Enforcement rollout: new errors, existing grandfathered.**
  `require-pattern` **errors on new/changed screens** and grandfathers existing
  hand-built screens as **warnings** until they migrate. No global flag day; the
  gate tightens as screens convert.
- **D3 — PRD → spec contract: full, with acceptance criteria.** A PRD must state
  **entities, states, data shapes, actions, _and_ per-state acceptance criteria.**
  The criteria remove guessing for `/screen-from-spec` **and** become the screen's
  test/audit oracles — the PM's "done" definition is what the loop verifies.
- **D4 — Pattern ownership: joint.** A pattern mined from a mockup is **proposed by
  the designer** and **ratified by a kit maintainer** into the catalog (the same
  `must`-is-human discipline the grammar already uses). Designers surface demand;
  the kit controls supply.
- **D5 — Logic location: layered (default; overridable).** Screen-local logic lives
  in the `screen.yaml` `stateMachine`; cross-screen / app-level state lives in
  `app.yaml` (per `demo-console-portal-proposal.md`). A screen never reaches into
  another screen's machine.

**Second-order items these decisions open** (implementation detail, not blockers):
the exact grandfather mechanism for D2 (allowlist vs. per-file opt-out), and the
machine-readable format for D3's acceptance criteria (so the loop can consume them
as oracles).

---

**In one line:** make the **pattern** the mandatory unit of screen construction —
PMs describe intent and logic, an AI skill decouples that into a pattern-composed
`screen.yaml`, and the kit generates a rule-true implementation — so every
interface shares one visual representation by construction, Figma becomes a
pattern-discovery source rather than the authority, and the shipped screen can be
more consistent than the mockup it came from.

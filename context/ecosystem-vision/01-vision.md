# 01 — Vision

- **Status:** Draft for discussion
- **Part of:** [Cyber Ecosystem — Vision & Governance](README.md)

## 1. What we are building

The **Cyber ecosystem** is the full chain that turns a design intent into a
shipped product screen, with no ungoverned gaps in between:

```
Figma (design source)
  → Design Tokens (the values)
  → Icons (the marks)
  → Primitives (single-purpose controls)
  → Composites (approved assemblies)
  → Patterns (approved recipes / regions)
  → Templates (repeatable page skeletons)
  → Screens (routes: patterns + data + logic)
  → Apps / MFEs (routes + shell + state)
  → Cyber Console (the shell that hosts the MFEs)
```

Each of these is a **first-class, versioned artifact with a schema and a
validator**. Nothing in the chain is "just code someone wrote"; everything is
either generated from a spec or checked against one.

## 2. Why — the problem we are solving

Today a product screen is a **fresh act of composition**. An engineer opens a
route, hand-wires primitives to match a Figma mockup, and ships. Every screen
is therefore a fresh chance to drift: control heights disagree, two components
do one job, spacing improvises, an ad-hoc panel appears where a governed one
exists. Consistency depends on the discipline of whoever happened to build the
screen — and discipline does not scale across teams, MFEs, and time.

We have already spent our consistency budget at the **component** layer: tokens,
primitives, composites, a grammar, a rendered audit. But the layers _above_ the
component — templates, screens, apps — are still assembled by hand, so that
investment leaks out the top.

The Cyber ecosystem closes the leak by making **every layer a governed artifact**
and forbidding a layer from reaching past its neighbour (§4). The product view
is then consistent _by construction_ — it is literally the same patterns and
templates rendered, not a hand-built lookalike.

## 3. What "done" looks like

A PM writes a PRD describing intent, states, data, and acceptance criteria. A
designer explores the screen in Figma and proposes any genuinely-new pattern. An
AI skill decouples that into a `screen.yaml` composed of **approved patterns on a
chosen template**, binds the PM's logic to a state machine, and generates a
ui-react screen. Three gates fire on every change:

1. **Schema** — the spec validates against its layer's JSON Schema.
2. **Static (ESLint)** — screen/app code may not hand-wire primitives; it must
   go through patterns/templates (`require-pattern`).
3. **Rendered audit** — the screen is rendered in light + dark and the grammar
   detectors confirm the anatomy matches the declared patterns.

If all three pass, the screen is _rule-true_: guaranteed to look and behave like
every other screen built from the same patterns — and it can be **more consistent
than the Figma mockup it came from**, because the mockup is a discovery input,
not the structural authority.

The same three gates bind in **every microfrontend** and in **Cyber Console**
itself — not just inside this kit. That cross-repo reach (§ governance) is what
turns "a nice component library" into "an ecosystem."

## 4. Guiding principles

1. **Downward-only dependencies.** A layer may compose only the layer directly
   below it (and tokens/icons, which are ambient). Screens use patterns and
   templates; patterns use composites; composites use primitives; only
   primitives touch Base UI. Reaching two layers down is a lint error. This is
   the single rule that makes the whole model enforceable.
2. **Every layer is a validated artifact.** If it isn't schema-checked, it isn't
   a layer — it's a liability. See [`03-layer-contracts.md`](03-layer-contracts.md).
3. **Specs are canonical; implementations are regenerable.** You edit the
   `screen.yaml`, then regenerate the screen. VR baselines derive from the spec,
   never from the mockup.
4. **Config over composition, at every altitude.** A page becomes declarative
   configuration of a template (columns + actions + slots), exactly as the
   `common-template` precedent proved (see [`04-common-template-layer.md`](04-common-template-layer.md)).
   The same move repeats one level up (screens configure templates) and one
   level down (composites configure primitives).
5. **Escape hatches are tracked, not silent.** When no governed artifact fits, a
   `patternless`/`templateless` escape is _logged to the ledger_ and feeds the
   graduation pipeline. Escapes surface demand; ratification controls supply.
6. **Figma is a weak source.** It is where patterns are _discovered_, not the
   authority on structure. The implementation may intentionally diverge to be
   rule-truer than the mockup; each divergence is classified
   (correct / graduate / override).
7. **`must` is human.** A rule blocks CI only after a person ratifies it via an
   RFC. Detectors earn `must` by proving they don't cry wolf.
8. **No new package for compositions.** Composites are published in `ui-react`;
   recipes are `ui-spec/patterns`; screens/templates are `ui-spec`. We do not
   spawn a parallel `ui-blocks` package that would fight the grammar.

## 5. The three audiences

| Audience       | What the ecosystem gives them                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------------------------- |
| **PMs**        | Author intent + logic (PRD → state machine + data binds); never touch component wiring; get a "done" oracle.    |
| **Designers**  | Explore in Figma; discover and propose patterns; review implementations against intent — not pixel-police them. |
| **Developers** | Compose from a governed catalog with generation + three gates; spend review on logic, not on re-deriving looks. |

Details in [`05-roles-and-authoring.md`](05-roles-and-authoring.md).

## 6. Non-goals

- **Not** removing primitives or the flexible API — kit-internal code composes
  primitives freely; enforcement is scoped to app/screen code.
- **Not** removing Figma — it stays the design surface and a pattern-discovery
  source.
- **Not** a flag-day migration — every gate lands as a warning, grandfathers
  existing code, and tightens to `must` only after an RFC.
- **Not** atomic-design jargon (atoms/molecules/organisms). We use the repo's
  own vocabulary: primitive / composite / pattern / template / screen / app.

# Proposal: A "uikitless" (rules-over-components) delivery workflow

- **Status:** Proposed (not yet adopted)
- **Date:** 2026-07-17
- **Owner:** Leonid Romanov
- **Affects:** cross-cutting — `packages/tokens` (consumption model),
  `packages/ui-spec` (grammar / `kit-lint` / `screen-audit` / ledger),
  `tools/eslint-rules` (`acronis-patterns` → `prefer-*`), `apps/*` (generated
  screens). **Does not remove or shrink `packages/ui-react`** — it reframes when
  a consumer needs a component vs. rules + tokens.
- **Builds on:** `context/kit-consistency-audit-proposal.md` (grammar / kit-lint /
  screen-audit / ledger), `context/component-layers-proposal.md` (Primitive vs
  Composite), `context/opinionated-composites-proposal.md` (config-driven
  composites + insisting-on-use via ESLint), and
  `packages/ui-spec/context/component-specs-proposal.md` (framework-agnostic
  specs).

---

## 1. Problem / the question

Maintaining a component library is expensive: every primitive is source we own,
test, theme, version, document, and keep in sync with Figma. The recurring
question is whether we could deliver **consistent UIs without shipping (and
maintaining) most of those components** — i.e. have the kit provide only:

- **design tokens** (already published),
- **approved patterns / composition recipes** (already in `ui-spec/patterns`),
- **rules** (already in `ui-spec/grammar` + `tools/eslint-rules`), and
- **AI instructions**,

and let product teams (or an agent) generate the UI from those, on demand.

Call it a **"uikitless" workflow**: rules and tokens instead of a large surface of
maintained components. The seductive framing is _"with good enough AI instructions,
teams will produce consistent interfaces without us maintaining complex
components."_ This proposal argues that framing is **half right**, identifies
**exactly which half**, and proposes the shape of a workflow that captures the
real win without the trap.

The naive version is a trap for one reason: **instructions are unbounded and
probabilistic; a component is bounded and deterministic.** Prose guidance drifts
on every generation. You cannot instruction-engineer a focus trap that works 100%
of the time, and you cannot prompt your way out of two teams producing two
slightly different toolbars. So the question is not "rules **vs** components" —
it's **which layer of the UI can be delivered as rules, and what makes that
delivery trustworthy.**

## 2. The core reframe: the dividing line is behavior, not looks

The useful split is not "simple vs complex component" — it's **presentation vs
behavior**:

| Layer                                                                       | Rules + tokens + AI can deliver it? | Why                                                                                                                            |
| --------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Presentational primitives** (Card, Badge, Stack, StatRow, table shells)   | **Yes**                             | Essentially structure + token-driven CSS. A Card is a box with padding tokens.                                                 |
| **Layout / composition** (FormLayout, DetailList, page shells, grids)       | **Yes**                             | This is _composition knowledge_ — a pattern expresses it better than a rigid component.                                        |
| **Interactive behavior** (Select, Combobox, Dialog, Menu, Tooltip, Popover) | **No**                              | Focus trapping, roving tabindex, floating positioning, ARIA state wiring, keyboard nav, cross-browser edge cases. Irreducible. |

By volume, most UI _surface area_ is the top two rows — and that is a genuine fit
for a rules-driven workflow. The bottom row is the irreducible ~20%: a rules layer
can **detect** violations of it (missing accessible name, wrong role) but cannot
**manufacture** the behavior. This is why we depend on Base UI headless primitives
and why shadcn/ui, GOV.UK's design system, and every serious "patterns + CSS"
system still _ship_ the interactive bits as code even when everything else is
convention.

**Corollary:** a uikitless workflow is real for presentation + layout + screen
assembly, sitting on a small, irreducible core of behavioral components. It is not
a replacement for the kit; it is a re-weighting.

## 3. What already exists (so we extend, not fork)

This repo is unusually well-positioned — most of the substrate a uikitless
workflow needs is already built:

- **Tokens as the shared vocabulary.** `@constructor-lab/tokens` ships `--ui-*`
  CSS custom properties + the Tailwind bridge; brand/theme resolve at paint time.
  Visual consistency is already token-enforced, and a pure-visual change is a
  one-place edit.
- **Machine-readable rules.** `packages/ui-spec/grammar` is a typed `KitRule`
  registry with a 1:1 `CHECKLIST.md`, spanning tokens / spacing / typography /
  anatomy / interaction / accessibility / composition / cross-impl.
- **Static enforcement.** `kit-lint` runs grammar detectors over ui-react
  component source (T1 no-hardcoded-color, T2 unbridged-name, Z1 off-grid, …);
  the `acronis-patterns` ESLint plugin enforces approved compositions over app
  code (`no-adhoc-sheet`; `prefer-*` proposed in the composites work).
- **Rendered enforcement.** `screen-audit` measures a real rendered screen (via
  the `screens/audit` probe) and runs cross-component detectors keyed to `screen/*`
  rules (control-height parity Z2, accessible-name I1, contrast I5, …).
- **A self-improving loop.** `grammar/LEDGER.md` + `grammar/overrides` record how
  each finding was resolved (detector / new-rule / override) so a class of defect
  cannot silently recur.
- **Patterns + graduation.** `ui-spec/patterns/*` holds ~20 approved recipes with
  a pattern→composite graduation pipeline.

In other words: the tokens, the rules, the two static gates, the rendered gate,
and the ratchet are **already here**. What is missing is the workflow that puts
_generation_ in front of them and the discipline that makes the gates trustworthy.

## 4. The load-bearing insight: the verification loop, not the prompt

The thing that makes rules-driven consistency **real** is not the quality of the
AI instructions — it is the **automated loop that rejects drift**:

```
generate (AI, from tokens + patterns + instructions)
   → static gate   (ESLint acronis-patterns + kit-lint)
   → rendered gate (screen-audit over the real render)
   → fix / regenerate on failure → repeat until green
```

Instructions are necessary but not sufficient; enforcement is what converts
"should be consistent" into "is consistent, or it doesn't merge." Without steps 2–4
you get N slightly-different buttons and discover it in review. With them, the
generation step is allowed to be imperfect because the gates hold the line.

## 5. Evidence: a generate → lint → audit prototype

A working prototype exercised this loop on **one screen** —
`protection-dashboard` (story `ui-appshell--with-secondary`) — using only
machinery the repo already ships. (Harness: `prototypes/generate-lint-audit/`.)

**What held up:**

- **Static / patterns.** A generated app fragment that hand-rolled a fixed side
  panel was rejected by `acronis-patterns/no-adhoc-sheet`; regenerating with the
  `Sheet` recipe cleared it. The "generate → fail → regenerate → pass" loop closed.
- **Static / kit-lint.** 0 `must` findings on the components the screen uses.
- **Rendered / audit.** Drift injected into the real render (an icon-only control
  with no accessible name, a control breaking row height parity, a low-contrast
  label) was caught as **3 `must` findings** — Z2, I1, I5. The rendered gate saw
  composed-result drift a lint cannot.

**What it exposed — and why that's the point.** The clean baseline initially
reported **11 `must` contrast failures, every one a false positive**: the
`accessibility/contrast` detector measured any node with non-empty `textContent`,
so layout containers (`nav`/`div`/`ul`) with inherited black `color` were flagged
even though their text is painted by white leaf descendants. The most valuable
output of the run was **a bug in the checker itself.** It was fixed (the probe now
captures `ownText`; the detector scores only painted text) and logged in the
ledger (`contrast-detector-flags-nonpainting-containers`, resolution kind
`detector` against `screen/contrast`). Baseline then went to **0**; the injected
drift still reported exactly its **3** real findings.

The lesson generalizes: **detector calibration is the whole ballgame.** A gate
that cries wolf 11× on a correct screen trains everyone to ignore red, and then
drift walks straight through. A uikitless workflow lives or dies on gate
precision — and the ledger/overrides machinery is exactly how that debt gets paid
down.

## 6. Proposal: a layered delivery contract

Not "rules vs components" — a contract that assigns each layer to the delivery
mechanism that actually fits it:

| Layer                                          | Delivered as                       | Enforced by                     |
| ---------------------------------------------- | ---------------------------------- | ------------------------------- |
| **Tokens**                                     | Shared package (non-negotiable)    | build + `kit-lint` T-rules      |
| **Behavior primitives** (the irreducible ~20%) | **Components** (Base UI-backed)    | tests + a11y + VR               |
| **Presentational + layout**                    | **Rules + tokens + AI generation** | `acronis-patterns` + `kit-lint` |
| **Screen assembly**                            | AI from `screen.yaml` + patterns   | `screen-audit` (rendered)       |

The "uikitless" workflow is the **bottom two rows**, standing on the top two. The
top two are precisely what the repo already treats as non-negotiable; the bottom
two are where generation replaces hand-authoring, made safe by the gates.

## 7. Where pure-rules costs more (risks)

Design around these, don't pretend they're free:

1. **Global structural/behavioral changes.** Tokens absorb a _visual_ change in
   one place, but a new focus-ring treatment or an a11y fix to generated markup
   means re-running generation across every screen and re-reviewing — where a
   component would be a one-file edit. (A1 focus-ring / C5 z-index are `must`
   rules that are deliberately _deferred_ as static detectors precisely because
   parity can't be safely enforced without a ratified canonical.)
2. **Review-cost shift.** You trade "maintain components" for "review every
   generated UI." Cheap generation ≠ cheap _correct, accessible, reviewed_
   generation. For a widely-consumed surface, the component amortizes that review
   once.
3. **The interactive tail.** Detectors catch _detectable_ violations. Subtle
   interaction bugs (dialog doesn't restore focus, combobox breaks on RTL) are
   the ones detectors miss and components prevent by construction.
4. **Detector calibration debt.** Per §5, over-reporting is as dangerous as
   under-reporting. Every new detector needs the ledger + overrides discipline
   before it can gate.

## 8. Non-goals

- **Not deleting `packages/ui-react`.** The behavioral core stays a maintained,
  published library. This proposal narrows _when a consumer reaches for a
  component_, not the library's existence.
- **Not a new package.** Consistent with `opinionated-composites-proposal.md`:
  rules live in `ui-spec` + `tools/eslint-rules`, recipes in `ui-spec/patterns`,
  tokens in `@constructor-lab/tokens`. No `ui-blocks`/`ui-rules` package.
- **Not "AI replaces review."** The loop front-loads machine checks so human
  review focuses on judgment, not on catching drift a detector should own.

## 9. Suggested phasing (incremental spikes, nothing adopted yet)

1. **Harden the rendered gate.** Continue paying down detector calibration via the
   ledger (the `ownText` contrast fix is the first entry of this kind). Un-defer a
   `must` detector only once a canonical + overrides exist.
2. **Second-screen spike.** Run the generate → lint → audit loop on a form-heavy
   screen (e.g. Settings) to find what the presentational/layout detectors miss.
3. **Close the generation half.** Wire an actual LLM generation step in front of
   the gates and measure the full generate → fail → regenerate → pass cycle
   autonomously, on a screen whose `screen.yaml` already exists.
4. **Codify the boundary.** Publish a short "component vs rules" decision rule
   (mirroring the config-driven-vs-compositional rule in the composites proposal):
   reach for a component when behavior is involved; generate from rules + tokens
   otherwise.

## 10. Open questions

- **Where do generated screens live and how are they reviewed** — committed app
  source (lintable, diffable) vs. generated-on-demand? The prototype used
  committed app source so `acronis-patterns` (scoped to `apps/**`) could see it.
- **Coverage gap:** `kit-lint` guards component source and `acronis-patterns`
  guards app code, but a screen _assembled in a Storybook story_ is covered by
  neither static gate — only the rendered audit. Do we extend static scope, or
  lean on the rendered gate for assembled screens?
- **What is the minimal behavioral core?** An explicit list of "always a
  component" primitives (dialog, menu, select, combobox, tooltip, popover, …) that
  the rules layer may compose but never regenerate.
- **How much detector coverage is "enough" to trust a gate** for a given rule
  tier before it may block CI?

---

**In one line:** a uikitless workflow is viable for the presentational, layout,
and screen-assembly layers — and this repo already has the tokens, rules, and
verification loop to make it trustworthy — but the interactive core stays
component-shaped, and the load-bearing work is detector precision, not prompt
quality.

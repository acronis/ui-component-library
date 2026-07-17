# Prototype: generate → lint → audit loop

A runnable pressure-test of the "uikitless" idea: can **rules + tokens + an
automated verification loop** hold UI consistency without shipping (and
maintaining) the component — using only machinery this repo _already_ ships?

It runs the loop on **one screen** — `protection-dashboard`
(story `ui-appshell--with-secondary`) — through the two verification modes the
repo has today:

| Gate                  | Tool (already in repo)                                | Scope             | What it guards                                                                         |
| --------------------- | ----------------------------------------------------- | ----------------- | -------------------------------------------------------------------------------------- |
| **static / patterns** | `acronis-patterns` ESLint plugin (`no-adhoc-sheet`)   | `apps/**`         | a generated _screen_ doesn't hand-roll a component                                     |
| **static / kit-lint** | `pnpm --filter @constructor-lab/ui-spec kit-lint`     | `ui-react` source | the _components_ the screen is built from stay on-token                                |
| **rendered / audit**  | `pnpm --filter @constructor-lab/ui-spec screen-audit` | rendered DOM      | the _composed result_ stays consistent (contrast, a11y name, control-height parity, …) |

Each gate runs **twice** — a drifted "generation" and a clean one — so you can
watch the loop catch drift and then go green after the fix.

## Run it

```bash
# 1. Storybook must be up (the rendered gate captures a live story)
pnpm --filter @constructor-lab/ui-react storybook   # serves :6007

# 2. one-time: the capture uses ui-react's Playwright
pnpm --filter @constructor-lab/ui-react exec playwright install chromium

# 3. run the loop
node prototypes/generate-lint-audit/run-loop.mjs
```

`run-loop.mjs` writes two throwaway files at runtime and deletes them after:
a generated screen fragment under `apps/demo/src/__generated__/` (so the ESLint
plugin, scoped to `apps/**`, sees it) and a capture script under
`packages/ui-react/` (so it resolves that package's Playwright while using
ui-spec's `tsx`). Snapshots land in `out/` (gitignored).

The rendered gate imports the **real** ui-spec probe
(`packages/ui-spec/screens/audit/probe.ts`) — it measures exactly what CI would.
"Drift" is injected into the rendered DOM at capture time (an icon-only button
with no name + a mismatched height + a low-contrast label) to model what
from-scratch, rules-only generation tends to produce.

## Results (2026-07)

```
static/round1-drift   ✓   no-adhoc-sheet fires on the hand-rolled fixed panel
static/round2-clean   ✓   clears after the fix
static/kit-lint       ✓   0 must (9 should) on the components the screen uses
audit/drift-injected  ✓   14 must — catches all 3 injected issues (Z2 + I1 + I5)
audit/baseline        ✗   11 must — but ALL are false positives (see below)
```

**The loop holds the line for the injected drift** (accessible-name,
control-height-parity, contrast all caught). **The static gate is production-ready.**

### The load-bearing finding: the audit needs calibration before it can gate

The clean baseline reports **11 `must` contrast failures** — every one a
**false positive**. The `accessibility/contrast` detector measures any node with
non-empty `textContent`, including layout containers (`nav`/`div`/`ul`) whose own
computed `color` is the inherited default black. Those containers never paint
text — the real menu-item leaves paint white on the navy rail and are fine:

```
container  nav/div/ul   color rgb(0,0,0)          -> flagged (WRONG)
leaf       a/span       color rgb(255,255,255)     -> correct, not flagged
```

**One-line fix** — restrict the detector to text-leaf nodes. Recomputed over the
captured snapshots:

```
                as-shipped   leaf-only (fixed)
baseline clean      11              0
drift injected      12              1   (the real injected "Filters" label)
```

So the fix makes the baseline pass **and** keeps the true catch. The proper home
for it is the probe (`collectScreenSnapshot` should record `ownText` — direct
text-node children only) + the contrast detector filtering on it; it belongs in
the grammar **LEDGER** as a `detector` resolution.

## What this tells us about "rules vs components"

1. **The verification loop is what makes rules-only consistency real** — not the
   generation prompt. The static gate already stops a hand-rolled component cold,
   and the rendered gate catches composed-result drift a lint can't see.
2. **Detector calibration is the whole ballgame.** A gate that cries wolf 11×
   on a correct screen trains everyone to ignore red — and then drift walks
   straight through. The prototype's most valuable output is a _bug in the
   checker_, which is exactly the debt a rules-only workflow lives or dies on.
3. **Behavior is still component-shaped.** Every catch here is _presentational /
   structural_ (contrast, name, height). None of it verifies focus-trapping,
   keyboard nav, or ARIA state wiring — the interactive 20% a rules layer can
   detect violations of but cannot _manufacture_.

```

```

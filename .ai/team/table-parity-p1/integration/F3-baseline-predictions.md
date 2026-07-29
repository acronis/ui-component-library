# Visual-baseline predictions — pre-registered before looking at the data

Written **before** `storybook:test:visual:docker:update:all` finished, so these are
falsifiable rather than post-hoc explanations of whatever churn appears.

Change under test: `23df929` made `Table`'s scroll container a `ScrollArea`
(plus `68f5a70`, which added `isolate` to ScrollArea's root and a z-index to
`ScrollBar`). Pre-state: 1077 committed baselines, zero uncommitted.

---

## P1 — `ScrollArea`'s own baselines are unchanged

`isolate` and a z-index alter **stacking**, not appearance, and `ScrollBar` was
already painted above its own scrolled content. Nothing about ScrollArea's own
stories has content that stacks above the bar.

**Falsified if** any `ui-scrollarea--*.png` moves. That would mean the z-index or
the isolation is doing more than intended.

## P2 — every modified baseline belongs to a story that renders a `Table`

The change is confined to `Table`'s container. Anything else moving is unexplained.

**Falsified if** a modified PNG belongs to a story with no `Table` in it. This is
the mechanical check that separates a real regression from expected churn, since
a bulk accept cannot.

## P3 — a table story that does **not** overflow is unchanged

If the swap only affects scrollbar rendering and stacking, a table that fits its
container has no scrollbar to draw and nothing to restack.

**Falsified if** a non-overflowing table story's PNG moves — that would be a
**layout** change rather than scrollbar churn, and it is the case P2 cannot
separate on its own.

The mechanism to watch, from the team lead: the old container was
`relative w-full overflow-auto` — one element that was both the width constraint
and the scroller. The chain is now root (`relative isolate overflow-hidden w-full`)
→ viewport (`size-full`, `overflow: scroll`) → content (`min-width: fit-content`).

Checked statically before the run: **`w-full` is still on the outermost element**
(`table.tsx:294`), and the `<table>` keeps its own `w-full` (`:185`). So a table
inside a flex or grid parent should size as before. The one real difference is
that the table's `w-full` now resolves against `Content` (`min-width: fit-content`)
rather than against the scroller — identical for a non-overflowing table, wider
for an overflowing one, which is the intended behaviour.

## P4 — expected-but-unmodified is also a signal

The mirror of P2. A story I expect to change and which does **not** may not be
rendering through the new path at all — e.g. it supplies its own wrapper, or
bypasses `Table`'s container.

**Known instance to check:** `data-table-recipes.stories.tsx:275` applies
`h-[360px] overflow-auto` to its **own** wrapper. If that story is unmodified, it
is scrolling on its own element rather than through `Table`'s container, which is
worth reporting either way.

**Falsified if** a story that renders a bounded/scrolling `Table` is unmodified
without such an explanation.

---

## Expected *additions* (never had a baseline)

Cross-check that exactly these appear, × light + dark:

From `ecdeb50` — `Sizes`, `Backgrounds`, `Borders`, `StickyHeader`,
`StickyHeaderAndFooter`, `StickyGroupRows`, `CurrentAndExpandedRows`,
`PinnedColumns`.
From `76e4558` — `HeaderTrailingControl`.

Nine stories → **18 new PNGs**. More than that means something else added a story;
fewer means one did not render.

Additions are **not churn** — they are new claims about what the component looks
like, never reviewed by anyone, so each gets real eyes rather than a sample.

## Already known, not a prediction

`CurrentAndExpandedRows` carries a **serious** axe violation
(`aria-conditional-attr`: `aria-expanded` is invalid on a `role="table"` row).
Its baseline will be captured with the defect present. Reported separately; the
fix is held pending the `role=treegrid` decision.

---

# U10 — `persistence` predictions

Pre-registered before any baseline run, and **before the freeze**.

> **Provenance corrected (not content).** This section used to say the file was
> gitignored and that `U10.md` §4 was therefore authoritative. `.ai` is still in
> `.gitignore:60`, but **this file was force-added and tracked at `5c4bc461`**, so it
> is now the durable copy and the two cannot silently diverge. The old note pointed a
> reader at a superseded copy. No prediction below was changed.

## U10-P1 — exactly four new DataGrid PNGs per theme

`Components/DataGrid/Persistence`: `NothingStored`,
`RestoredColumnPreferences`, `RestoredSorting`, `StalePayloadDiscarded`.

Four stories × light + dark → **8 new PNGs**. More means something else added a
story; fewer means one did not render.

## U10-P2 — no pre-existing DataGrid or DataTable baseline may move

**Stated mechanically, so it is falsifiable rather than hopeful:** the
`persistence` group contributes **no `columns` transform**, **no `viewProps`** and
**no `chrome`** — its only contribution point besides `resolve` is
`controllerOptions`, and that carries the config to an engine that does nothing
until a caller passes `persistence`. So it cannot alter the rendering of a grid
that does not enable it.

> ~~**Any movement in a pre-existing DataGrid or DataTable PNG is a defect, not
> churn.** Investigate it; do not accept the new baseline.~~
>
> **⚠ RESCOPED (#102) — the clause above stands as its author wrote it and is
> struck rather than edited. It was registered unscoped and has now fired twice on
> other operators' commits, most recently on 16 pre-existing DataGrid ids moved by
> #91 and #92, neither of which U10 touches.** The scoped form that replaces it:
>
> **Any movement in a pre-existing DataGrid or DataTable PNG _attributable to U10's
> commits — `4e4a2665`, `9b02f4a0`, `0dcff4ae`_ — is a defect, not churn.**
> Investigate it; do not accept the new baseline. **Movement caused by any other
> commit does not falsify this prediction.**

**Why the scoping is not a weakening.** An unscoped "nothing else may move" clause
cannot distinguish *my change broke something* from *somebody else's change did
something expected*, so it fires on every batch that touches the same family and
gets dismissed — which costs it the one job it has. **A control that fires on
expected behaviour trains people to ignore it**, and this one had already been
dismissed twice by the time it was rescoped. The mechanical argument above is
unchanged and still sound; only its blast radius is corrected.

> **The general rule (#102):** every "nothing else moves" clause must name the
> commit range it is scoped to. Without one it is not falsifiable — it is a claim
> about the whole repository's future.

The two gate members U10 added to `DataTableFeatureGates` are read by the
`persistence` feature only, so they are covered by the same argument.

## U10-P3 — the positive check, which is the rare one

`NothingStored` and `StalePayloadDiscarded` must be **pixel-identical to each
other**, in both themes.

That is the point of the pair: a payload stored at an older version with no
`migrate` must be discarded, leaving a grid that looks exactly like one with
nothing stored. Almost everything else a screenshot gate does is "did anything
unexpected move", which can never prove a feature *works*; this comparison can.

**If they differ, a stale payload is partially restoring** — which is precisely the
half-migrated-payload failure the discard rule exists to prevent.

## U10-P4 — what a screenshot cannot settle here, so nobody reads it as covered

A screenshot cannot distinguish *"discarded the stale payload"* from *"never read
storage at all"*. Both render the defaults. So the discard is asserted in
`data-grid/__tests__/data-grid-persistence.test.tsx` and the engine suite, on the
storage calls — an observable that is **not in the DOM**. Do not treat U10-P3
passing as evidence that persistence read anything.

Same limitation, stated for the reviewer: `RestoredColumnPreferences` looks
hand-configured. Every difference from `NothingStored` in it comes out of the
adapter, not from props — which is exactly why it is worth a baseline and exactly
why the baseline alone cannot prove it.

---

# U3 / #76 / #84 / #69 predictions — the container fix, the header chrome, and the render-nothing changes

Pre-registered **before any build**, by the operator who wrote and browser-verified
all of it. Commits covered: `84aab170`, `4be051e1`, `1b82eeb6`, `37fe7043`,
`78db4d33`, `d2c6ebcf`.

Stated in U10's shape: what **cannot** move, and why mechanically.

## X-P1 — the height-constraint move changes **no** pre-existing baseline

`4be051e1` moved `height`/`maxHeight` from the ScrollArea root to its viewport.
Three mechanisms, each independently sufficient:

1. **For `height`, the resolved geometry is identical.** Before: root
   `height: 320`, viewport `height: 100%` → 320. After: viewport `height: 320`,
   root shrink-wraps → 320. Same box, same paint.
2. **For a `maxHeight` table that does not overflow**, both placements resolve to
   the content height. Nothing to clip, nothing to scroll.
3. **No pre-existing bounded story overflows.** Every one holds ~8 rows in a
   200–240px box — which is precisely why the defect shipped. So the code path the
   fix changed **is not exercised by any existing baseline at all.**

Even where it is exercised, ScrollArea's scrollbar is `opacity-0` at rest and
revealed only on `data-[hovering]`/`data-[scrolling]`, so a newly-scrollable
viewport adds no visible pixel at capture time.

> **Any movement in a pre-existing table, DataTable or DataGrid PNG attributable to
> `4be051e1` is a defect, not churn.** Investigate; do not accept.

## X-P2 — exactly ten new `ui-table--*` PNGs

Five new stories × light + dark:

- `4be051e1`: `BoundedByHeightOverflowing`, `BoundedByMaxHeightOverflowing`,
  `BoundedByMaxHeightBothAxes`
- `1b82eeb6`: `StickyFooterOverflowing`, `StickyGroupRowsOverflowing`

More means something else added a story; fewer means one did not render. All five
were browser-verified as scrolling, so a **blank or clipped** capture is a defect
rather than a surprise.

## X-P3 — exactly fourteen new `components-datagrid-columns-features--*` PNGs

Seven stories × light + dark, from `84aab170`: `Resizing`,
`ResizingWithinCallerLimits`, `Reordering`, `ResizingAndReordering`,
`ColumnSettingsMenu`, `EveryAffordance`, `FitToContainer`.

Each **must** show the trailing-edge chrome its config asks for: a 1px divider for
`resizing`, a grip glyph for `reordering`, both for `ResizingAndReordering` and
`EveryAffordance`, and **neither on the selection or actions column** in
`EveryAffordance` (`lockSystemColumns` defaults on). A capture with no chrome is a
defect — the whole feature is the chrome.

## X-P4 — the header chrome cannot alter a grid that did not ask for it

`renderColumnHeaderControls` returns `undefined` unless `canResize || canReorder`,
and both require the `columnsFeatures` group. When it returns nothing the engine adds
no adornment, so `<TableHead>`'s `trailing` slot stays empty — which also means the
header keeps its plain markup rather than the `aria-labelledby` label wrapper.

> **No pre-existing DataGrid or DataTable baseline may move from `84aab170`.**

## X-P5 — the column-settings swap moves nothing with the menu closed

`DataGridColumnSettings` replaced `DataTableViewOptions` in DataGrid's toolbar. I
compared both triggers by reading them: **byte-identical** — same
`Button variant="secondary"`, same `className="ms-auto hidden h-8 gap-2 lg:flex"`,
same `<CogIcon />` and the same "View" label. The difference is menu **content**
(`w-[150px]` → `w-[220px]`, plus the pin section and reset).

So a story capturing the menu **closed** must be pixel-identical. A story capturing
it **open** moves, and legitimately — the runner unions open `[role="menu"]`
overlays into the clip. **Falsified if** a closed-menu DataGrid story moves.

## X-P6 — three commits that render nothing may not move any pixel

- `37fe7043` (percentage warning) — a `console.error` inside an effect. No element,
  no class, no style; and **nothing in the repo passes a percentage**, so it does
  not even fire.
- `78db4d33` (selection cause) — changes one string in an event payload. No DOM.
- `d2c6ebcf` — the visual runner's own guard. Instrument, not output.

> **Any baseline movement attributable to these three is a defect**, and a
> particularly informative one: it would mean something reads state these changes
> touch that nobody thinks is rendered.

## X-P7 — the positive check: two bounded stories must be **pixel-identical**

`BoundedByHeightOverflowing` and `BoundedByMaxHeightOverflowing` render the same 60
rows in the same 320px box and differ **only** in which prop expresses the bound.

> **They must be byte-identical to each other, in both themes.**

This is the rare *positive* check: almost everything else this gate does is "did
anything unexpected move", which can never show a feature works. This one
demonstrates directly that `maxHeight` bounds exactly as `height` does — the
equivalence `4be051e1` established and `table/api.yaml` asserts.

**If they differ, `maxHeight` is not equivalent to `height`** — the bound landed on
a different element, or one of them is not scrolling — and the fix is incomplete
rather than the baseline being wrong.

*Registered first as a limitation, then fixed, which is worth recording.* The two
carried distinct probe tokens in their headers so a browser measurement could prove
which story it had read. That earned its keep — it caught two mis-measurements,
including one where a content-only gate passed while the page had been retargeted —
but it made the pair non-comparable and would have baked measurement scaffolding
into every future baseline. `__STORYBOOK_PREVIEW__.currentRender.id`, found while
instrumenting the runner for #48, identifies the rendered story directly and paints
nothing, so the tokens are gone. **No baseline existed for either story yet, so the
correction cost nothing.**

## Not predicted, because it is not mine to predict

`23df929`'s scrollbar-appearance churn across every table story is F3's P1–P4 above.
I have added nothing to those.

**Durability, corrected:** this file **is** tracked — the team records were
force-added at `5c4bc461`. U10's note above (and an earlier draft of this section)
says `.ai/` is gitignored; that was true this morning and is stale. It matters: an
earlier copy of this section was written, left uncommitted on that belief, and
**discarded by something else in the shared tree within the hour.** This one is
committed with the change it describes.

---

# U6b — `virtualization` prop + §7 focus rungs 3–4 predictions

Pre-registered **before the build**, by the operator that wrote the change
(`d5bb28c7`, `f9404bde`).

## U6b-P1 — rungs 3–4 move ZERO baselines, added or modified

`f9404bde` adds **no story**. Its only rendered output is one attribute —
`data-slot="data-grid-toolbar"` — on a `<div>` that already existed.

**Stated mechanically, so it is falsifiable rather than hopeful:** grepped across
`src` and `.storybook`, the attribute appears at its own site, as a query string in
the body-window seam, and otherwise only in comments and tests. **No stylesheet
selects on `data-slot` at all**, so Tailwind generates nothing for it and it cannot
affect paint. Everything else in the change is behaviour behind a bridge member the
controller invokes only when a data change removes the current row — no story
triggers that.

Corroborated independently: `data-grid-toolbar.test.tsx` diffs `DataGridToolbar`'s
markup against the frozen `DataTableToolbar` and they are byte-identical **once this
one attribute is stripped**, which is asserted in both directions.

> **Any movement in any PNG attributable to `f9404bde` is a defect, not churn.**

## U6b-P2 — the virtualization stories add PNGs but move none

`d5bb28c7` (the DataGrid `virtualization` prop atom) contributes `controllerOptions`
only — no `columns` transform, no `viewProps`, no `chrome` — so it cannot alter the
rendering of a grid that does not enable it. Same argument shape as U10-P2.

**Falsified if** any pre-existing DataGrid or DataTable baseline moves.

## U6b-P3 — what a screenshot cannot settle here

A screenshot cannot show that a windowed list is windowed: a correct window and a
fully-rendered list can look identical in the viewport, and the rows outside it are
not captured. Nor can it show that focus landed anywhere — focus is not paint.

So **do not read a green baseline for any virtualization story as evidence that
windowing or the focus chain works.** Those are asserted in
`data-table-body-window.test.tsx` and `data-table-focus-reconcile.test.tsx`, and the
scroll behaviour itself is owed to a browser (#78).

---

# COVERAGE — which units are actually pre-registered, and which are not

**Read this before trusting any part of the review.** The gate is **not uniformly
strong**, and the reviewer must not read uniform confidence into it.

**Falsifiable predictions registered before the build:**

| Unit | Entries |
| --- | --- |
| F3 — `ScrollArea` container swap | P1–P4 + expected additions |
| U10 — `persistence` | U10-P1 … U10-P4 |
| U3 / #76 / #84 / #69 — container fix, header chrome, render-nothing commits | X-P1 … X-P7 |
| U6a/U6b — body-window seam, `virtualization`, §7 rungs 3–4 | U6b-P1 … U6b-P3 |

**Prose expectations only — NOT pre-registered predictions:** U2a/U2b (tree), U4
(grouping), U8 (pagination), U9 (selection/appearance). #48's "KNOWN CHURN" paragraph
describes what those are expected to do; it is **not** in the falsifiable shape and
nothing in it states what *cannot* move, or why, mechanically.

**Why they are absent rather than pending:** those units' owners are gone. A prediction
invented afterwards by a reviewer who has already seen the diff is worse than no
prediction, because it will be believed. **Nobody may write a prediction on a departed
unit's behalf.**

> **Timing note on X-P1…X-P7, because it nearly went the other way.** These were
> reported as registered, checked, found absent — the file was byte-identical to HEAD
> with zero matches under `.ai/` — and retracted on that basis. They were then actually
> committed, at `81d68585`. So they *are* registered and they *do* count. This
> paragraph is here because the same claim was true and false within one hour, and the
> only thing that distinguishes the two states is **when you looked**. Anyone verifying
> registry coverage must grep the file at the moment they write the sentence, not cite
> an earlier check — including a check they made themselves.

## The compensating method for unpredicted units — and its weakness

For every unit in the prose column, the review falls back to: **every modified PNG
must be attributable to a named commit, reported in both directions** (modified-outside-
expected, and expected-but-unmodified).

**This is post-hoc and therefore strictly weaker than a pre-registered prediction.** It
can *rationalise* a change rather than predict it: faced with a moved baseline and a
plausible commit, a reviewer will usually find a story connecting them, and that story
is unfalsifiable because it was written after the fact. It catches a baseline that moved
with **no** candidate commit — which is worth having — but it cannot catch a baseline
that moved for the wrong reason within a commit that plausibly touches it.

Say so in the report. A gate that is strong for three units and weak for six should not
be summarised as "the baselines were reviewed".

---

# GATE ARITHMETIC — registered before the build, by the operator running it

**This is not a unit prediction and it must not be read as one.** It makes no claim about
whether any unit's change is *correct*. It is a mechanically-derived claim about **how many
files this gate's own run should emit**, so that a wrong count is caught by counting rather
than by judgement. It therefore does not touch the rule that nobody predicts on a departed
unit's behalf — no departed unit is being spoken for.

Derived from **source**, before `storybook:build` had been run even once on this branch.

## G-P1 — the run adds exactly 174 PNGs and the tracked total becomes 1251

Inventory of `packages/ui-react/src/components/**/__stories__/*.stories.tsx`, applying
Storybook's `toId(title, exportName)`:

| | |
| --- | --- |
| story files | 162 |
| stories | **623** (623 distinct ids, no collisions) |
| committed baseline ids | 540, across **1077** PNGs |
| story ids with **no** baseline | **87 → 174 new PNGs** |
| expected tracked total after the run | **1251** |

Two independent derivations of the total must agree, and do:

- `536` story-backed baseline ids × 2 = 1072, + 5 orphan PNGs = **1077** (the committed state)
- `623` × 2 = 1246, + 5 orphan PNGs = **1251** (the post-run state)

**Falsified if** the run emits any number of additions other than 174. Fewer means a story
did not render; more means something added a story, or a story id is not what this parse
thinks it is.

## G-P2 — four orphan baselines exist, and they will be unmodified for a benign reason

PNGs whose story no longer exists. Nothing generates them, and `--updateSnapshot` does not
delete them, so they will sit in the unmodified set:

- `ui-inputtextarea--invalid`, `ui-inputtextarea--states`, `ui-inputtextarea--with-label`
  — **dark only; the light counterpart never existed** (`git log --all` on the light paths
  returns nothing). Added at `1e2b4d78`. `UI/InputTextArea` exports Default, Required,
  WithValue, Error, Disabled, Bare — none of those three.
- `ui-link-all-states-generated--states` — light + dark. The export was renamed
  `States` → `Variants`; the `--variants` pair exists and the `--states` pair was left behind.

5 PNGs. **Exclude these four ids from the expected-but-unmodified direction before running
it.** They are unmodified because no story drives them, not because a story stopped
rendering — and that direction is precisely the one that exists to catch a story that
silently stopped rendering. Left in, they are four guaranteed false positives in the check
least likely to be double-checked.

All four are pre-existing and unrelated to this branch. **Not deleted here** — changing the
tracked file set inside the gate would corrupt the very count this section registers.

## G-P3 — coverage of the 174 additions by the predictions above

| | ids | PNGs | source |
| --- | --- | --- | --- |
| Exact count pre-registered | 25 | 50 | F3 (9) + X-P2 (5) = 14 `ui-table`; X-P3 = 7; U10-P1 = 4 |
| Registered in shape, **no count stated** | 10 | 20 | virtualization, under U6b-P2 |
| **No pre-registered expectation at all** | **52** | **104** | datagrid core 7, pagination 5, selection-parity 3, server-selection 3, tree 5, datatable-appearance 12, expansion-domains 1, footer 8, grouping 8 |

The `ui-table` family landing at **exactly 14** is real corroboration and not a restatement:
this parse knew nothing of the registry, and F3's 9 + X-P2's 5 account for all 14 with no
leftovers on either side.

**So 104 of the 174 new images have no expectation of any kind.** Additions are not churn —
they are first claims about what a component looks like — and these 104 have never been
reviewed by anyone.

## G-P4 — what this parse can miss, at its real width

It is a **regex parse of source**, not Storybook's indexer. It would miss a story whose
title is composed dynamically, or one produced by a factory rather than a literal
`export const`. It found no such case (162 files parsed, zero title-parse failures, zero
duplicate ids), but absence of a match is weaker than the indexer's own answer.

One trap it did fall into, recorded because it is a live gotcha for anyone recomputing this:
**Storybook derives a story id from the EXPORT NAME, not from a `name:` override.** A first
pass that honoured `name:` produced 33 phantom orphans. `ui-button--as-link` settles it —
export `AsLink`, `name: 'As Link (render prop)'`, id follows the export.

**The authoritative cross-check is `test-storybook --listTests` against the built index**,
which costs no captures. It runs before the smoke captures, and any divergence from 623/87
is reported and corrects this section's numbers **before** the full run rather than after.

## Note on the paragraph above this section

"strong for three units and weak for six" predates U6b's registration at `2cc02de7`; the
COVERAGE table immediately above it lists **four** registered units. Left as its author
wrote it — amending another operator's registered text inside the freeze is not this
operator's call — but the table is the accurate one.

---

# MOVEMENT SETS for the post-review fix batch — registered before the regeneration

**Read the category first.** Like the GATE ARITHMETIC section above and unlike every unit
section, this makes **no claim about whether any fix is correct**. It claims only **which
baseline FILES should move when the batch is regenerated**, derived from before-states this
operator measured across all 87 new ids during the completed eyeball pass. It is therefore
in G-P1's category, and it does **not** touch the rule that nobody predicts on a departed
unit's behalf — no unit is being spoken for.

**The division of labour, set by the team lead:** this operator predicts *which files move*,
from measurement. Each fix's own author registers *what the pixels should look like*. Neither
substitutes for the other, and **where one of these predictions and an author's disagree, the
disagreement is itself a finding rather than an ambiguity.**

**Self-imposed limit, adopted as the terms:** no predicting the internals of a fix not yet
read. Where a movement set cannot be derived from measurement plus stated intent, it says
**CANNOT DERIVE** rather than guessing. A fabricated prediction is worse than none because it
will be believed.

Written at HEAD `fadbd068`. Pre-state for every claim below: the 174 committed at `87e84a47`,
reviewed image-by-image, all 87 ids seen.

## M-P0 — THE PRECONDITION, and it is the one most likely to invalidate everything below

**The generated React icon components are gitignored build artifacts, and the visual
regeneration does not regenerate them.**

- `packages/icons-react/.gitignore:7` ignores `src/packs`. **393 generated `.tsx` on disk,
  0 tracked** (`git ls-files` returns nothing; `git show HEAD:…/chevron-first.tsx` is empty).
- Every *icons-react* script that needs them runs `pnpm run generate` first — `build`,
  `typecheck`, `test`, `storybook:build`. This is why #48 recorded that `pnpm -r typecheck`
  regenerates icons.
- **But `ui-react`'s `storybook:build` is bare `storybook build`.** And
  `storybook:test:visual:docker:update` is `pnpm storybook:build && docker compose …`. So the
  regeneration consumes whatever `src/packs` happens to be on disk and **nothing in the
  command enforces freshness.**

> **Before trusting any regeneration result, verify the generated artwork is post-fix:**
> `grep -o 'd="[^"]*"' packages/icons-react/src/packs/stroke-mono/icons/chevron-first.tsx`
> must return **`d="m19 19-7-7 7-7M5 19V5"`** (the `|<` form). If it returns
> `d="m5 19 7-7-7-7m14 14V5"`, `src/packs` is stale and every M-P1 prediction below will
> appear falsified when in fact the generator never ran.
>
> Measured at time of writing: **fresh** (both icons match their post-`fadbd068` SVGs).

The failure mode this guards is specifically the **stale-but-present** one: a `src/packs`
generated before `fadbd068` still satisfies the import, so the build succeeds and silently
bakes the OLD transposed glyphs into the new baselines. A *missing* `src/packs` fails loudly
and is harmless. This is the same shape as the 4-day-old Docker image #48's smoke had to rule
out — a stale input that produces a plausible result.

**Corollary for whoever reviews `fadbd068`:** it touches only two SVGs and a changeset.
That is **complete**, not partial. A reviewer looking for a matching `icons-react` change
will not find one and must not file "the fix is incomplete" — there is no committed
generated output to change.

## M-P1 — the icon un-transposition moves exactly the baselines that render those two glyphs

`fadbd068` swaps two `d` attributes. Same `viewBox`, same `stroke-width`, so **no baseline
may change its dimensions** — glyph pixels only, inside existing icon boxes.

**MUST MOVE — inside the 174** (8 ids × 2 themes = 16 PNGs). Each verified by looking at the
committed baseline and seeing a four-button pager:

`components-datagrid-pagination--default` · `components-datagrid-pagination--without-page-size` ·
`components-datagrid--default-state` · `components-datagrid--detail-expansion` ·
`components-datagrid-server-selection--all-results` · `--owner-accepts` · `--owner-refuses` ·
`components-datagrid-tree--with-pagination`

**MUST MOVE — the branch's OWN earlier additions, which the enumeration above structurally
could not reach** (5 ids × 2 = 10 PNGs). Added at `7230ce80`+, each verified here by opening
the baseline and seeing `>|` leftmost / `|<` rightmost:

| id | added by | note |
| --- | --- | --- |
| `components-datagrid--full-featured` | `49494934` (PR #37) | **on `main`** |
| `components-datagrid--grouped-config` | `56f6786c` | this branch |
| `components-datagrid--presets` | `56f6786c` | this branch |
| `components-datagrid--server` | `56f6786c` | this branch |
| `components-datagrid--named-callbacks` | `6ad26a7d` | this branch |

`--full-featured` reads "Page 1 of 1", so all four buttons are **disabled** — and it renders
both glyphs anyway. **A disabled pager is not exempt.**

> **CAVEAT ON THE ENUMERATION, and it is a structural blind spot rather than an oversight.**
> M-P1's first list is scoped to "inside the 174", and `87e84a47` added exactly 174 — so that
> list is **correct on its own terms**. But these five were added by *earlier commits on this
> branch* (and one on `main`), so their baselines already existed before `87e84a47`. They sit
> **outside the 174 while still being the branch's own files**, and from the additions list
> alone they are indistinguishable from already-regenerated third-party baselines.
>
> **"Outside the 174" and "not this branch's problem" are different sets.** An enumeration
> scoped to one commit's additions cannot see the difference. This is the concrete instance of
> the `CANNOT DERIVE` declared at the end of this section, which is why declaring it was worth
> the line.

**Merge consequence for `--full-featured`, since it is on `main`:** `main`'s copy still carries
the old glyphs. Whatever regenerates it here will show as a modification against `main` at
merge, and that is correct rather than churn.

**MUST MOVE — OUTSIDE the 174 and outside this branch. This is the part a table-scoped
regeneration will miss.**

- `components-datatable--toolbar` (light + dark) — **pre-existing** (added `bb636fb5`, PR #62),
  renders `DataTablePagination` via `WithToolbarAndPagination` (`data-table.stories.tsx:116-145`).
  Verified by looking at it: it shows the four-button pager with the transposed glyphs. Its
  first/last buttons are **unconditional** (`data-table-pagination.tsx:58-91`), so no story
  config can suppress them — this baseline moves regardless of how the story is written. **The
  same silent-staleness trap as button-group, in a second family.**
- `ui-buttongroup--icon-buttons` (light + dark) — renders `<ChevronFirstIcon />` and
  `<ChevronLastIcon />` directly (`button-group.stories.tsx:71`). Verified from source.
**MUST NOT MOVE — and every entry here now rests on a MECHANISM, not on an observation.**

- `components-datagrid-pagination--unknown-total` · `--unknown-total-without-page-size` ·
  `--without-first-last` — **cannot render either glyph.**
  `data-grid-pagination.tsx:95` resolves `const firstLast = showFirstLast && !unknownTotal`;
  `WithoutFirstLast` sets `showFirstLast: false` and both unknown-total stories set
  `unknownTotal: true`. Registered first as an observation ("two-button pagers"), now upgraded
  to the reason.
- `ui-buttongroup-all-states-generated--states` — **moved here from MUST MOVE. FALSIFIED, and
  correctly hedged.** Registered as "PROBABLE, NOT VERIFIED" and it was wrong.
  Mechanism: `button-group.generated.stories.tsx` is auto-generated from `ui-spec`, renders
  three **text** buttons (Day/Week/Month), and **contains no icon import at all** — zero
  `Chevron` matches. Reached independently by the icon operator and by this operator;
  **two independent derivations agreeing on a negative.** Kept visible rather than deleted:
  the hedge is why it cost one grep instead of a false expectation inside a gate.
- `components-datagrid--column-filters` — **resolves the UNVERIFIED entry rather than dropping
  it.** Registered as unverified in the four-button list; opened, and it renders **no pager**.
- `components-datagrid--external-chrome` · both `footer-summaries--*-while-paginated` (pagination
  *state* enabled, no pager rendered) · all `ui-pagination--*` (the standalone component uses
  only ChevronLeft/Right/Ellipsis).

> **The DataGrid-only caveat still binds.** `DataTablePagination` has no `showFirstLast` — its
> four `ButtonIcon`s are unconditional (`data-table-pagination.tsx:58-91`). So "this pager
> might only have prev/next" is a **DataGrid-only** possibility and **every** DataTable-pager
> baseline carries both glyphs. Do not extend the first bullet to a DataTable pager.

**CAVEAT ON THE DERIVATION METHOD, which is where this section nearly went wrong.** M-P1 was
derived by asking *which stories render the icon* — resolved story by story. That reasoning
missed `components-datatable--toolbar` on the first pass and only caught it by reading the
**component**, because two components fill the same role with different defaults: one makes
first/last opt-in, the other renders them always. **Wherever a movement set below rests on
"this story renders X", the same trap applies** — check the component's defaults, not the
story's props.

> **If a two-button pager moves, the change touched more than those two path strings.
> If a four-button pager does NOT move, either `src/packs` was stale (M-P0) or that story is
> not rendering the pager this parse thinks it is.**

**CANNOT DERIVE — now CLOSED for `ui-react`, and by a better method than the one assigned.**
The open question was whether any other pre-existing baseline renders these glyphs; the
assigned answer was to sweep 1077 PNGs. The icon operator closed the **consumer set** instead:
a repo-wide grep gives **4** consumer files, only three inside `ui-react` —
`data-grid-pagination.tsx`, `data-table-pagination.tsx`, `button-group.stories.tsx`. **Any
moving baseline must therefore come from a story rendering one of those three**, which is
enumerable; it then enumerated every `pagination` config across all nine data-grid story files
and both data-table story files.

That substitutes **enumeration of consumers** for **enumeration of images** — cheaper and more
complete, because a sweep can only find what it recognises whereas the consumer set bounds the
possibility space. Worth recording as a method, not just a result.

> **Residual hole, stated rather than hidden:** a computed dynamic lookup
> (`icons['chevron-' + x]`) would evade that grep. A literal import would not. Nothing suggests
> one exists; nobody has checked.

**RUNNING TOTAL: 15 id pairs = 30 PNGs** — the 8 inside the 174, the 5 branch/`main` additions
above, `components-datatable--toolbar`, and `ui-buttongroup--icon-buttons`.

> **The provenance of that number is MIXED, and it should not be read as uniform.** The 5, the
> `datatable--toolbar` mechanism and the MUST-NOT-MOVE mechanisms were established by the icon
> operator and re-verified here by opening each baseline. **The original 8 were not
> independently re-verified by it** — they rest on this operator's eyeball pass. Both halves
> were checked by *someone* against a real image; neither half was checked twice.

### M-P1a — THE ICON FIX IS SELF-REVERTING, so a future movement of these four PNGs is NOT a regression

`fadbd068` hand-edits two fetched SVGs. **`packages/icons-svg/AGENTS.md:79` forbids exactly
that**: *"Never hand-edit fetched SVGs — they'll be overwritten on"* the next sync, which
replaces the set from the current Figma file on every run
(`AGENTS.md:72`; `pull-icons` → `tools/figma-icons-fetcher`, which cleans its output
directory at `fetch-icons.ts:91`). The repo edit fixes the published package **today**; the
durable fix is upstream in Figma and only a designer can land it.

> **AMENDED at `f3b6693b` — the hazard is now LOUD, not silent, and this section said silent.**
> This operator registered the sync as *"silently restores the transposed glyphs and re-ships
> them"*. That was true when written and is now false: `f3b6693b` adds
> `icons-react/src/__tests__/chevron-first-last-orientation.test.ts`, which asserts the
> orientation of both glyphs against **both** the `icons-svg` masters and the generated pack.
>
> It is deliberately sited **outside** `icons-svg/src/svg/` because `pull-icons` does a clean
> sync that would delete a guard stored beside the masters — so a sync that reintroduces the
> transposition **fails a test** instead of silently un-fixing a published defect. It also
> **throws** on path commands it does not model, so a redraw using arcs fails rather than
> passing a transposed pair by omission.
>
> **What still stands:** the attribution rule below, and the fact that the durable fix is
> upstream — a test prevents the revert *shipping*, it does not correct Figma. **What must be
> restated:** #95's "every `pull-icons` re-ships the defect" is now gated by CI rather than
> unguarded. The Figma location for the durable fix is recorded in that test's own docstring
> (`icon-packs-source` node `2246:3201` → pack `stroke-mono` → category `arrows` →
> `_assetsource/chevron-first` and `_assetsource/chevron-last`).

> **Attribution rule for whoever reviews a future regeneration — this is why it belongs in
> this document rather than only in #92.** If `components-datagrid-pagination--default`,
> `components-datatable--toolbar`, `ui-buttongroup--icon-buttons` or any of the M-P1 set ever
> moves **back** to the `>|`-first form, that is **the Figma sync having reverted `fadbd068`**.
> It is **not** a regression from whichever PR happens to be in flight when it surfaces.
>
> Discriminator, one line, before blaming anyone's change:
> `grep -o 'd="[^"]*"' packages/icons-svg/src/svg/chevron-first.svg`
> — the correct post-fix value is **`d="m19 19-7-7 7-7M5 19V5"`**. If the SVG source itself has
> reverted, the sync did it and the reviewer is looking at the wrong commit.

This is the same misattribution shape M-P0 guards in the other direction: M-P0 is a stale
*generated* artifact producing wrong baselines, M-P1a is a refreshed *source* artifact
producing wrong baselines. Both look like someone's code change and neither is.

Extent of verification: the prohibition and the clean-sync behaviour are **quoted from
`AGENTS.md` and located in the fetcher**; this operator did **not** trace which directory the
fetcher treats as `outputDir` versus the `mono`/`multicolor` trees it deliberately never
deletes from, so the exact blast radius of a sync is **CANNOT DERIVE** here. `AGENTS.md:79` is
the repo's own documented contract and is sufficient for the attribution rule above.

## M-P2 — `appearance.width` (#90) moves exactly one id, and has two strong negative controls

**MUST MOVE:** `components-datagrid-virtualization--dynamic-row-heights` (light + dark).
`appearance.width` is exercised by **exactly one story in the package** — verified by grep —
and it is one of the new ones.

> ### ~~Numeric, falsifiable: this baseline's width goes 1280 → 720~~ — **FALSE. RETRACTED.**
>
> **A reviewer checking for 720 would record a failed fix on a working one**, which is why this
> is struck rather than quietly edited.
>
> **`content + 80` is a property of `layout: 'centered'`, not of the runner.** The clip is
> `#storybook-root`'s bounding box + 24px each side, and **`#storybook-root` only shrink-wraps
> under `centered`.** `table.stories.tsx` is `centered`; **every DataGrid and DataTable story
> file is `padded`**, where the root spans the viewport, so the clip is `1280` *whatever happens
> inside it*.
>
> **What `dynamic-row-heights` will actually do:** stay **1280×720** — its dimensions do not
> change at all. It changes in **content only**, each bordered box shrinking from ~1233px to
> 640px. **So the width axis is not merely mispredicted for this story, it is untestable by
> dimension** — the check has to be content-based (measure the border's right edge, which sat
> at x=1263 in the committed baseline).
>
> **The defect itself is unaffected.** #90 rests on a content observation in the image — border
> spanning x=16..1263 while the table's own rules end at x≈622 — which is independent of the
> clip identity. **The defect stands; only my prediction of how it would surface was wrong.**
>
> **Corroboration I already held and failed to use.** In my first measurement of all 174 I
> recorded that every `components-datagrid*` baseline is **exactly 1280** wide while `ui-table`
> widths vary (**500, 540, 600, 952**). That is a complete natural experiment for
> centered-vs-padded, sitting in my own data. I noticed the variance, used it to compute a
> token budget, and never asked what produced it — **I read a measurement for its total instead
> of for its mechanism.**
>
> **Why two independent derivations agreed anyway, which is the transferable part.** Another
> operator predicted 720 too, and that agreement was reported as corroboration. It was not:
> both derivations applied the same identity, verified on two `centered` stories, to a `padded`
> one. The shared unstated precondition was *"the root element shrink-wraps."*
>
> > **Two operators agreeing is not corroboration when both inherited the same unstated
> > precondition. It reads as confirmation, and confirmation does not get investigated.**
>
> The mirror of the failure recorded in M-P3: two derivations answering *different* questions
> manufacture a false **disagreement**; two sharing a hidden premise manufacture a false
> **agreement**. Before treating any two derivations as independent, check they share neither a
> mismatched question nor a hidden premise.
>
> **Not traced (`CANNOT DERIVE`):** under `centered`, `width: 520` yields a root of 552 — the
> +32 comes from something inside the story, not from `layout`. My original text attributed it
> to "16 story padding", which was the right magnitude for the wrong reason. Whatever it is, it
> is per-story and must not be assumed for a story nobody measured.

**MUST NOT MOVE — unaffected by the retraction above, and still correct.** Bare-`Table` width
already works and the fix targets the `DataTableView` wrapper:
`ui-table--pinned-columns` · `ui-table--bounded-by-max-height-both-axes`. **These two are
`centered`**, so — unlike `dynamic-row-heights` — their widths *are* content-dependent and a
dimension change here would be a real signal (600 and 500 respectively today).

> **If either bare-`Table` story moves, the fix changed `Table`'s own width handling, which
> was already correct.** That is a regression, not churn.

**Interaction warning:** `dynamic-row-heights` is also in M-P4 (it is one of the 7 truncated
ids). If #89 and #90 land in one regeneration, **both** of its axes change and neither fix can
be attributed alone. See M-P7.

## M-P3 — leading-column widths (#91): derivation rule, not an enumeration I can vouch for

**CANNOT DERIVE the pixel effect** — the chosen widths are not yet written.

> **SUPERSEDED ON ARRIVAL — do not rely on the list below once #91's registration lands.** The
> parse-derived enumeration was moved to the operator implementing #91, which is reading that
> source anyway, and its registered movement prediction **is** the enumeration. When it lands,
> cite it rather than this section.
>
> **If the regeneration runs before it lands**, leading-column verification is against what one
> operator happened to see in 87 images, not against an enumeration — and any report must say
> so rather than let it read as complete.

> **THREE INDEPENDENT FALSIFICATIONS OF THIS SECTION, all corrected below.** Raised by the #91
> operator, each re-verified here against source before being encoded. **All three landed on
> M-P3 and none on M-P2** — M-P3 was the section flagged observation-derived, M-P2 was
> mechanism-derived. The flag did not merely caveat this section, it **predicted where the
> errors would be.**

### The mechanism, corrected — the ~150px claim was FALSE

This section previously read: *"in every one of these the first header text begins ~150px in,
consistent with TanStack's 150px default."* **Falsified two ways.**

- **Mechanically:** `components-datagrid--selectable` (no `columnsFeatures`) emits **no `width`
  and no `min-width` on any `<th>`**. The 150 is not in that render at all, so it cannot be
  what the eye was seeing.
- **By probe** (ink-column clustering, `--ui-table-global-cell-padding-x` = 16px per
  `primitives.css:384`): `datagrid--selectable` first glyph at x=131 → selection column
  **≈98px**; `columns-features--every-affordance` (features on, so `min-width:150px` *is*
  emitted) first glyph at x=243 → **≈210px**. **Neither is ~150.**

**The real mechanism:** automatic table layout distributing the surplus of a `w-full` table
across every column. Without `columnsFeatures` there is **no floor at all**; with it,
`min-width: 150px` is a **floor**, so the column renders **wider than 150 rather than at it**.

> **Why this mattered beyond the number:** a verification run against the old rule could have
> passed or failed for reasons unrelated to the fix.

### The member set, corrected — the tree column does not exist, and `__actions__` was missing

Exactly **three** generated columns carry no width. Verified in source, and the code documents
its own complete set at `detail-expansion.tsx:116` — `[__select__, __detail__, …data, __actions__]`:

| id | site |
| --- | --- |
| `__select__` | `data-grid-config/selection.tsx:48` |
| `__detail__` | `data-grid-config/detail-expansion.tsx:24` |
| `__actions__` | `data-grid-config/actions.ts:19` → `data-grid-actions.tsx:157` |

- **`tree` is NOT a member — dropped.** `data-grid-config/tree.tsx:161` runs `columns.map(…)` and
  **wraps the cell of an existing data column** ("the wrapper wraps the final renderer"); it
  never prepends one. A tree-only baseline would have been predicted to move and then not
  moved, **for a reason unrelated to any fix** — a false expectation inside a gate, which is
  the thing M-P1's strikethrough exists to prevent.
- **`__actions__` was missing** and is added.

### The DataTable family, INVERTED — it is MUST NOT MOVE

Previously listed `components-datatable--toolbar`, `--default` and "any other selection-enabled
DataTable baseline" as must-move. **The opposite is true.**

**DataTable has no column-generating layer.** All three chrome columns come from DataGrid
*config modules*; DataTable's `selection: {}` / `detailExpansion: {}` are **engine controller
options that manage state and prepend nothing.** Verified: `data-table.stories.tsx:47-66`
hand-writes `id: 'select'` with its own checkbox header and cell and **no `size`**;
`data-table-expansion-domains.stories.tsx:55-59` hand-rolls its own chevron span. Those are
**caller** columns, so a fix to generated-column widths cannot reach them.

> **EVERY `components-datatable--*` baseline is MUST NOT MOVE** — and this is a better control
> than an id list because it is derived from **architecture rather than observation**: it
> cannot be incomplete. **If any of that family moves, the fix reached the primitive layer,
> which it must not.**

### Recorded against the derivation method — the second caveat it needs

M-P3's mechanism came from **inference off a measurement**: a column looked ~150px wide, 150
was a known TanStack default, and the two were joined. **Both facts were real and the causal
link was invented.** What was measured was the rendered *width*; what was concluded was its
*cause*.

That is the same compression failure this branch has catalogued repeatedly, arriving through a
**correct observation of the wrong quantity** — which is why it survived a re-read: the
observation checks out, and only the causal claim is fabricated. **The check is not "did I see
this?" but "does what I saw establish what I said about why?"**

## M-P4 — #89's `fullPage` fix moves exactly 14 PNGs, and NOT by extension

**MUST MOVE:** the 7 truncated ids × 2 themes, established two independent ways (height ==
720, and a bottom-band probe finding content in the final 20 rows):

`ui-table--backgrounds` · `ui-table--borders` · `grouping--ungrouped-bucket` ·
`grouping--group-scoped-selection` · `tree--indent-step` ·
`virtualization--overscan-rows` · `virtualization--dynamic-row-heights`

**MUST NOT MOVE: everything else.** Adding `parameters.snapshot.fullPage` to 7 stories cannot
affect another story, and the runner's new truncation failure/warning is an **instrument, not
output** — X-P6's shape. Any other baseline moving means the runner change altered capture
geometry rather than only adding a check.

> **Non-obvious, and the reason this is worth registering:** `fullPage: true` takes a
> different code path — `page.screenshot({ fullPage: true })` — which does **not** apply the
> bbox clip or the 24px padding. So these 14 will **not** merely grow downward. The top 720px
> will **not** be byte-identical to the old capture, and the framing/background will change.
> **Do not diff the top region against the old baseline and report a regression.**

Also registered, since it was a live worry and is now settled: **nothing is truncated below
720.** `grouping--multiple-grouping-columns` (699) and `ui-table--sizes` (696) have clean
bottom margins and all cases present. A clip capped at `viewport.height - y` with `y > 0`
would land under 720; no such case exists.

## M-P5 — #93's five story repairs

**MUST MOVE:** the five ids being repaired — `columns-features--column-settings-menu` ·
`datagrid--detail-expansion` · `datagrid--detail-expansion-accordion` ·
`selection-parity--indeterminate-policy` · `selection-parity--reserve-policy`.

**MUST NOT MOVE:** the other 82 ids.

**CANNOT DERIVE the pixels** — a `play` function or an open-state default is the author's to
predict. One structural consequence *is* derivable: if `column-settings-menu` gains a `play`
that opens the menu, the runner unions open `[role="menu"]` overlays into the clip
(X-P5's mechanism, `test-runner.ts:119-126`), so **that baseline's dimensions must change**,
not merely its pixels. A pixels-only change there means the menu did not open.

## M-P6 — #94's pager count fix moves one id, with a sharp negative control

**MUST MOVE:** `components-datagrid-server-selection--all-results` (light + dark) — the only
baseline where the label contradicts the rendered state ("0 of 4" over a fully-checked grid).

**MUST NOT MOVE:** every other pager baseline, because they all render the per-row path,
which is correct. Specifically `--owner-accepts` and `--owner-refuses` already read "1 of 4"
with one row checked, and `pagination--default` reads "0 of 23".

> **If `pagination--default` moves, the fix changed the per-row path too — which was right.**

**Expect movement wider than the digits within that one image:** the label's text length
changes, and it sits in a `justify-between` flex row (`data-grid-pagination.tsx:98`), so the
whole pager row may reflow.

## M-P7 — RULED: one regeneration. These 10 ids are attribution-lost BY DECISION, and a compound content check replaces it.

> **⚠ AMENDED — the collision table below is STALE and OMITS FOUR IDS. Do not use it as the
> authority for N without reading this stub.**
>
> M-P7 was written while **M-P3** held the leading-column enumeration. **F17-P2 superseded M-P3**
> with a live-DOM enumeration of 24 ids, and **four of those are also in M-P1's icon set** —
> `components-datagrid--full-featured` · `--grouped-config` · `--named-callbacks` · `--presets`.
> M-P7 names none of them. **Each is N=2 (#91 + #92)**, and **F17-P8 registers #91's half**
> (`__select__` → 40.0px, `sel:1 det:0 act:0`, `layout: 'padded'` so content-only).
> `--server` stays N=1 — it is in M-P1 but not in F17-P2's 24.
>
> **Why this matters rather than being bookkeeping:** M-P7's own ruling is *"N comes from this
> table, not from whichever predictions exist."* Followed verbatim these four get **N=1**, so a
> reviewer sees the glyph correctly un-transposed, marks the image explained, and **a #91
> leading-column defect in the same frame sits inside the expected set** — the exact failure the
> N-completeness rule was written to prevent, reintroduced through staleness instead of through an
> unfiled prediction. These four are precisely the "branch's own earlier additions" that **M-P1
> itself declared as a structural blind spot**: a declared unknown in one section became an
> undeclared error in a table built on it.
>
> **The general rule:** *a supersede is only complete when every table that consumed the old
> section is re-derived* — and the superseded text must point forward, in the same commit.
>
> **Run-scoped, NOT structural** (re-check before reusing): in the run captured at `e70d1017`,
> #93 and #94 had **not** landed — verified from source, not from commit subjects
> (`data-grid-pagination.tsx:100-101` still read the per-row path; zero `play:` functions in any
> data-grid story file). So `selection-parity--indeterminate-policy`, `--reserve-policy` and
> `datagrid--detail-expansion-accordion` were **N=1, attribution restored**, and
> `server-selection--all-results` was N=2 rather than 3. **An unlanded fix is not a missing
> prediction** — N genuinely reduces — but each reduction must cite the unchanged line that
> establishes the cause is absent. **If #93 or #94 lands, these four revert to M-P7's figures.**

The plan is a single regeneration covering the whole batch. For most ids that is fine. For
these, **two or more fixes both predict movement, so a moved baseline cannot be attributed to
either** — the post-hoc method the registry already calls strictly weaker degenerates further,
because there is no longer a *unique* candidate commit:

| id | overlapping causes |
| --- | --- |
| `virtualization--dynamic-row-heights` | M-P2 width + M-P4 truncation |
| `server-selection--all-results` | M-P1 icons + M-P3 leading column + M-P6 count |
| `server-selection--owner-accepts` / `--owner-refuses` | M-P1 + M-P3 |
| `datagrid--default-state` / `--detail-expansion` | M-P1 + M-P3 |
| `grouping--group-scoped-selection` | M-P3 + M-P4 |
| `selection-parity--indeterminate-policy` / `--reserve-policy` | M-P3 + M-P5 |
| `datagrid--detail-expansion-accordion` | M-P3 + M-P5 |

**THE RULING (team lead), recorded here because this document is what a future reviewer
attributes against.** This operator offered two options — regenerate per-fix to keep
attribution at several Docker runs (measured floor ~30 min each, honest range to 2 h), or
regenerate once and accept the loss. **Neither was taken.** The ruling is **one regeneration**,
with a third mechanism that neither option contained:

> **Attribution by cause is what a single run loses. Verification by content is not.**
> For each of these 10, every overlapping fix produces an **independently visible** result in
> the same image — a sized leading column, a corrected pager glyph, an honoured width, an
> opened panel. So the reviewer does not ask *"which commit moved this?"* but **"does this
> image show all N expected changes, and nothing else?"**
>
> That is **stronger** than attribution, not a fallback: attribution establishes only that a
> change was *legitimate*; content establishes that it is *correct*.

**Therefore these 10 ids are attribution-lost by decision, and that is recorded up front** —
nobody may later claim a per-fix attribution this run cannot support. Everything not in the
table above retains full attribution.

**The requirement this creates falls on the fix authors, not on this section.** For any
collision id its fix touches, each author registers what the image should **show**, not merely
that it moves. Where two authors' content predictions for one image are compatible the
compound check is well-formed; where they conflict, **the conflict surfaces before the run
rather than after.** Those content predictions belong in this file, beside this section.

> **N-COMPLETENESS — the M-P7 table is the authority for N, not the set of predictions that
> happen to have been filed.** Ruled after this operator raised it, and recorded here because
> the hole it closes is in *this* mechanism rather than in a fix.
>
> If three fixes touch an image and only two authors register content predictions, then *"does
> this show all N expected changes"* silently becomes *"all 2"* — **and the third fix's defect
> looks like part of the expected set.** That is exactly the failure the compound check exists
> to close, reintroduced through an incomplete register.
>
> **So a missing content prediction is a BLOCKING GAP, not a smaller N.** Enumerate each
> collision id's causes from the table, then require a prediction for each. **A compound check
> with a hole in it is worse than no compound check, because it reports a pass.**

**Why the compensating control is needed rather than optional — the risk this closes.** With
two or three fixes all predicting movement on one baseline, **a defect in one of them looks
expected.** That is "a plausible story available at the moment you need one", which is the
weakness the COVERAGE section already names in post-hoc attribution and which this gate has
been bitten by once. Movement alone cannot discriminate here; content can.

## What this section does NOT cover

- The **user-requested resize indicator**: **CANNOT DERIVE.** Not yet written, and this
  operator has read nothing of it. Its author must register its own movement set; a guess
  here would be believed.
- Whether any regenerated baseline is *correct*. That is the next eyeball pass, and the
  before-state for the whole 87 is held by the operator who wrote this section.
- Any pre-existing baseline outside the surfaces named in M-P1 and M-P3.

# F17 — #90 (`appearance.width`) and #91 (chrome-column widths), registered by `dev-f17-widths`

**SCOPED TO MY COMMITS ONLY.** Every clause below is falsifiable *by the diff of the commits
whose subjects begin `fix(table): appearance.width`, `fix(data-grid): chrome column`, or
`test(table)/docs(ai)` authored by `dev-f17-widths` on `feat/table-parity`*. A movement caused
by any other operator's commit does **not** falsify anything here — the gate's own hard-learned
rule, applied.

Registered **before implementing**. Design was ruled by the lead: #90 takes option (D) (collapse
the wrapper — the ScrollArea root becomes the bordered box), #91 takes the narrow
`columnPresentation` sizing split. Both measured in a real browser first (my own Storybook on
:6099, viewport 1280×720, the runner's geometry) — the numbers below are measurements, not
estimates, except where marked CANNOT DERIVE.

## F17-P0 — THE PRECONDITION: the browser results that make the rest predictable

Registered because if any of these is later found false, **every prediction below is void, not
merely wrong.**

| claim | measured |
| --- | --- |
| an explicit `width` is honoured exactly on this table (`table-layout:auto`, `border-collapse`, `w-full`) | `columns-features--fit-to-container`: `Name` at `width:200px;min-width:200px` renders **200.0px** |
| `max-width` on a table cell is **not** ignored in auto layout here | 40px pin holds at exactly 40.0 in 4 stories |
| all three chrome columns have min-content **below** 40px, so 40 clips nothing | floors: `__select__` **16**, `__detail__` **32**, `__actions__` **32** |
| (D) does not put a scrollbar over the border | `crossesBorder: false`, gap **0** on both scrollbars |
| (D) is pixel-neutral where no `appearance.width` is set | `datagrid--selectable`: outer edges, table box and all 4 column widths **byte-identical** before/after a real unwrap |

**The one that would have sunk #91 silently:** had `max-width` been ignored in auto layout, the
fix would have produced a correct DOM and an unchanged picture, with a green suite. It is
honoured. Verified before a line was written.

## F17-P1 — #90 moves exactly ONE id, and I predict its WIDTH NUMERICALLY

**MUST MOVE:** `components-datagrid-virtualization--dynamic-row-heights` (light + dark). The only
story in the package that sets `appearance.width` — one story *id*, containing **two** `DataGrid`
instances, both `{height:300, width:640}`.

**Numeric:** clip = content + 2×16 story padding + 2×24 clip padding = content + 80. Content
becomes the root's 640px border box, so **width goes 1280 → 720**. This reproduces M-P2's number
from an independent method (M-P2 derived it from the content+80 identity; I measured the root at
640 and the wrapper at 1233 in the browser). **First numeric agreement between two operators on
this branch.**

> **Any width other than 720 means the constraint landed on a third element.** That is the #76 →
> #84 failure mode repeating, and it is the specific thing this prediction exists to catch.

**A 2px consequence nobody would guess from the diff:** Tailwind sets `box-sizing: border-box`,
so under (D) `width: 640` **includes** the 2px border and the scroll content area becomes
**638px**, where today the root is 640px of content with the border on a different, wider
element. The clip is still 720 (the bbox is the border box). Do not read 638 as an off-by-two bug.

**MUST NOT MOVE, and each for a mechanically different reason:**

- `ui-table--pinned-columns` (600 = 520+80) and `ui-table--bounded-by-max-height-both-axes`
  (500 = 420+80) — bare `Table`, which has **no bordered wrapper at all** on that path. (D) does
  not touch `Table`'s width handling. *If either moves, the fix reached the primitive.*
- **All 95 ids that render a table with no chrome column, plus the 6 caller-column ids** (both
  enumerated in F17-P2). (D) is measured pixel-neutral without `appearance.width`; those stories
  set none.

**Why the positive control matters here:** bare `Table` honours `width` **not** because `Table`
treats it differently, but because nothing else on that path draws a boundary. Stating it the
other way round would predict that `Table` needed changing.

## F17-P2 — #91: the PARSE-DERIVED enumeration. SUPERSEDES M-P3's observed set.

M-P3 handed this section the enumeration and asked to be superseded once it landed. **This is
it.** Derived by rendering **every** DataGrid / DataTable / Table story in a live Storybook and
detecting the generated columns in the actual DOM — the render itself, not a reading of story
args.

**Instrument:** 125 story ids (all `components-datagrid*`, `components-datatable*`, `ui-table*`,
minus `--docs`). Detectors, each tied to the source that makes it unambiguous:

| column | detector | why it is not a guess |
| --- | --- | --- |
| `__select__` | `td > span.contents [role=checkbox]`, or a header with `aria-label="Select all rows"` | the `span.contents` wrapper is generated-only (`selection.tsx:427`); a caller column has no such twin, and the hand-written label is `"Select all"` |
| `__detail__` | header `.sr-only` text `=== 'Details'` | `detail-expansion.tsx:126` |
| `__actions__` | a `td` whose first child is `div.flex.justify-{end,start}` under an empty header | `data-grid-actions.tsx` `RowActionsCell`; catches the `config.render` case too, which an `aria-label` detector would miss |

**Every read gated twice:** on `SUBJECT_ID` read back from the frame's own `location.search`, and
on a render gate that polls until a `<table>` with `<tbody><tr>` exists. `UNRESOLVED: []`.

### MUST MOVE — 24 story ids (48 PNGs)

`sel`/`det`/`act` = how many rendered instances carry each generated column (some stories render
two grids).

| id | sel | det | act |
| --- | --- | --- | --- |
| `components-datagrid--bulk-actions` | 1 | | |
| `components-datagrid--controlled-state` | 1 | | |
| `components-datagrid--custom-row-actions` | | | 1 |
| `components-datagrid--default-state` | 1 | | |
| `components-datagrid--detail-expansion` | 1 | 1 | |
| `components-datagrid--detail-expansion-accordion` | | 1 | |
| `components-datagrid--external-chrome` | 1 | | |
| `components-datagrid--full-featured` | 1 | | |
| `components-datagrid--grouped-config` | 1 | | |
| `components-datagrid--named-callbacks` | 1 | | |
| `components-datagrid--presets` | 1 | | |
| `components-datagrid--row-actions` | | | 1 |
| `components-datagrid--selectable` | 1 | | |
| `components-datagrid--single-selection` | 1 | | |
| `components-datagrid-columns-features--every-affordance` | 1 | | 1 |
| `components-datagrid-grouping--group-scoped-selection` | 2 | | |
| `components-datagrid-selection-parity--indeterminate-policy` | 2 | | |
| `components-datagrid-selection-parity--reserve-policy` | 2 | | |
| `components-datagrid-selection-parity--select-by-row-policy` | 1 | | 1 |
| `components-datagrid-server-selection--all-results` | 1 | | |
| `components-datagrid-server-selection--owner-accepts` | 1 | | |
| `components-datagrid-server-selection--owner-refuses` | 1 | | |
| `components-datagrid-tree--with-detail-expansion` | | 1 | |
| `components-datagrid-virtualization--with-selection-and-search` | 1 | | |

### MUST NOT MOVE — the 6 caller-column ids, which is M-P3's inversion, now enumerated

`components-datatable--bordered` · `--current-row` · `--default` · `--striped` · `--toolbar` ·
`ui-table--selectable`

These render a checkbox column that is **hand-written by the story** (`data-table.stories.tsx:47-66`,
no `size`), not generated. A fix to generated-column widths cannot reach them.

> **If any of these six moves, the fix escaped the DataGrid config layer into the primitive.**
> That is the sharpest negative control either operator has for #91, and it is the exact
> opposite of what M-P3 originally predicted for this family.

### MUST NOT MOVE — the other 95 ids

Render a table with no chrome column of any kind.

**Arithmetic identity, checkable: 24 + 6 + 95 = 125 = every id scanned.** A complete partition
with no remainder. If a reviewer's own count of moved leading-column baselines is not 24, one of
us has a different id set and it is worth finding out which.

**Notably NOT in the must-move set, and this one is counter-intuitive:**
`components-datagrid-virtualization--dynamic-row-heights` has **no** generated chrome column
(headers `Event`/`Host`/`Status`; `sel:0 det:0 act:0`). It is #90's only mover and #91 must not
touch it. **A leading-column change visible there would mean #91 reached a story that asks for
no chrome.**

### Recorded against my own instrument, because it produced a false answer once

The **first** sweep used a flat 260 ms wait and reported `tables: 0` for
`dynamic-row-heights` — a **false zero**. My first hypothesis was "the 10k-row story is slow";
re-probing at 260/600/1200/2500 ms showed **2 tables at every wait**, so the hypothesis was
wrong: the cause was main-thread contention across a 125-story sequential sweep, not that story's
own cost. `neededRetry` shows essentially every story needed a second poll, so a flat wait was
marginal for all of them and intermittently lost some.

**Why this matters more than the one visible miss:** a story that had rendered its table but not
yet its checkbox would have been a **silent false negative** in the must-move list — no zero to
notice. The render gate closes that. **The gated and ungated runs produce the identical 24-id
positive set**, which is corroboration rather than proof: two methods agreeing, one with a known
flaw.

## F17-P3 — CONTENT predictions for the 10 attribution-lost ids (M-P7)

Per the ruling that content verification replaces attribution for these, and that **N comes from
M-P7's table, not from whichever predictions exist.** My fixes touch all ten. For each: what the
image must show *from me*. Other causes are other authors' to register — I do not restate them,
and my silence on them is not a claim that they are absent.

| id | my contribution to the expected change |
| --- | --- |
| `virtualization--dynamic-row-heights` | **#90 only.** Bordered box shrinks to the scroll region: clip **1280 → 720**; the border's right edge now coincides with the scrollbar instead of sitting ~592px beyond it; `Host`/`Status` stop being squeezed and `edge-01`/`edge-02` **stop wrapping**. **No leading-column change** — this story has none. |
| `server-selection--all-results` | Leading `__select__` column **~92.6 → 40.0px**; freed width redistributes to the data columns. Pager label is #94's. |
| `server-selection--owner-accepts` | `__select__` → 40.0px, same redistribution. |
| `server-selection--owner-refuses` | `__select__` → 40.0px, same redistribution. |
| `datagrid--default-state` | `__select__` → 40.0px. |
| `datagrid--detail-expansion` | **Two** columns narrow: `__select__` → 40.0 and `__detail__` **143.5 → 40.0**. The 24×24 expander button is **unchanged** — measured, it does not clip. |
| `grouping--group-scoped-selection` | **Both** rendered grids narrow their `__select__` to 40.0 (`sel:2`). A change in only one grid means the fix is instance-scoped rather than column-scoped. |
| `selection-parity--indeterminate-policy` | Both grids' `__select__` → 40.0 (`sel:2`). |
| `selection-parity--reserve-policy` | Both grids' `__select__` → 40.0 (`sel:2`). |
| `datagrid--detail-expansion-accordion` | `__detail__` → 40.0. **No `__select__` change — it has none** (`sel:0`), so a narrowed checkbox column there would be a defect, not my fix. |

**CANNOT DERIVE:** the exact redistributed widths of the *data* columns in each image. They
depend on each story's content and on `table-layout: auto`'s surplus distribution. I measured
three instances (e.g. `every-affordance`: 209.2 → 322.0 for three columns) but will not
extrapolate a number per image.

## F17-P4 — what these predictions CANNOT settle

- **Whether 40px is aesthetically right.** It is square to the **40px row-height floor** (`h-10`),
  which is what the header row and single-line body rows measure — **not** to the rendered row
  height, which I measured at **41, 41, 41, 41, 40.5** in `selectable` and **49** in
  `every-affordance`. `h-10` is a floor; a table cell grows past it. So #91's premise "row height
  is `h-10` = 40px, so square means `size: 40`" is right about the floor and wrong that a row
  measures 40. No fixed column width can track a content-driven row height, and **"square as row
  height" is not a promise the layout can keep** — "square to the row-height floor" is.
- **Whether 40px is right at non-default density.** `small`/`large` override row height to
  32/48px (`table.tsx:252-258`). A TanStack `size` is a JS number and cannot follow a CSS class,
  so the column is square at `medium` only. Ruled: document, do not solve, in P1.
- **Dark mode.** Every measurement above is light. Widths are theme-independent by construction,
  but I did not measure dark and am not claiming it.
- **Anything about the 3 remaining `--docs` entries**, excluded from the sweep as not stories.

## F17-P5 — SELF-FALSIFICATION: my own F17-P1 width number was WRONG, and so is M-P2's

Registered **before** the regeneration, and found by measuring my own fix rather than by a
reviewer reading the image. **Two clauses I registered above are false.** They stand as written;
this section corrects them.

### The `content + 80` identity is a property of `layout: 'centered'`, not of the runner

I replicated the runner's clip arithmetic from its source
(`.storybook/test-runner.ts:120-147`): the box it clips to is **`#storybook-root`'s bounding
box** (unioned with any open overlay), plus 24px padding each side, capped at
`viewport.width - x`.

`#storybook-root` only *shrink-wraps* under `layout: 'centered'`. Measured, at 1280×720:

| story | `layout` | `#storybook-root` box | predicted clip | committed baseline |
| --- | --- | --- | --- | --- |
| `ui-table--pinned-columns` | `centered` | x=364 **w=552** | **600** | 600 ✓ |
| `ui-table--bounded-by-max-height-both-axes` | `centered` | x=414 **w=452** | **500** | 500 ✓ |
| `datagrid-virtualization--dynamic-row-heights` | `padded` | x=16 **w=1233** | **1280** | 1280 |
| `datagrid--selectable` | `padded` | x=16 **w=1248** | **1280** | 1280 |

`table.stories.tsx` is `layout: 'centered'`; **every** DataGrid story file is `layout: 'padded'`,
where `#storybook-root` is a full-width block whose box is indifferent to its contents.

### Consequence 1 — `dynamic-row-heights` stays 1280 wide. **CORRECTS F17-P1 and M-P2.**

F17-P1 said "width goes **1280 → 720**". **False.** M-P2 says the same thing and is false for the
same reason. The baseline's **dimensions do not change at all**; it changes in **content only** —
the border shrinks from a 1233px-wide box to a 640px-wide box around each of the two grids.

> **So the width axis of that prediction is not merely wrong, it is untestable for this story.**
> Any `layout: 'padded'` baseline is 1280 wide whatever happens inside it. A reviewer checking
> "did the width become 720" would record a failed fix on a working one.

### Consequence 2 — this was NOT an independent agreement, it was the same error twice

I reported to the lead that my 720 "independently reproduces M-P2's number … first numeric
agreement between two operators on this branch." **Withdrawn.** We agreed because we made the
*same* generalisation: applying an identity verified on two `layout: 'centered'` stories to a
`layout: 'padded'` one.

**That is #76's causal shape exactly** — "a correct measurement, a conclusion generalised past its
configuration" — and it landed on two operators independently, via the same identity, in the same
gate. **Two operators agreeing is not corroboration when both inherited the same unstated
precondition.** It reads as confirmation, which is worse than a disagreement, because a
disagreement gets investigated.

### Consequence 3 — `edge-01` does NOT stop wrapping. **CORRECTS F17-P3.**

F17-P3 said `Host`/`Status` "stop being squeezed and `edge-01`/`edge-02` **stop wrapping**."
**False, and backwards.** Measured after the fix: table **638px** (it was 640 — `border-box` took
2px), `Host` column **79.1px**, and every `edge-0*` cell still wraps to two lines (57px against a
20px line height).

The wrapping was **never caused by #90**. It is the story asking for a 640px scroll container for
content that needs more — arguably deliberate, since the story exists to demonstrate *dynamic row
heights* and wrapped text is what makes rows differ in height. **#90 makes it 2px worse, not
better.**

> **The corrected content prediction for `dynamic-row-heights` is:** dimensions unchanged at
> 1280×720; the two bordered boxes shrink from ~1233px wide to 640px; the horizontal scrollbar
> now terminates at the border instead of 592px short of it; **wrapped `edge-0*` text persists and
> is not a defect.**

### Why this section exists

Every clause here was falsified by measuring my own fix against a prediction I had already
committed. Had I not written the number down first, I would have looked at a 1280-wide image,
seen the border correctly shrunk, and called it done — and the wrong identity would have survived
in the register for whoever verifies the regeneration.

# F18 — #89 (silent screenshot truncation), registered by `dev-f18-truncation`

Two changes. `parameters.snapshot.fullPage` on the 7 truncated stories **moves baselines**. A
runner-level truncation check (fail-vs-warn is the lead's ruling, pending at the time of writing)
is an **instrument, not output** — X-P6's shape — and moves nothing.

## F18-P0 — THE PRECONDITION: M-P4's detector is over-broad AND its set is under-broad

M-P4 established its 7 ids two ways (height `== 720`, plus a bottom-band probe). I reproduced
both over **all 1251 baselines** instead of the 174 additions. **All 7 hold.** But the wider census
says the detector cannot be trusted outside the scope M-P4 ran it in, and both directions bear on
this run:

- **Over-broad — 22 correct baselines look truncated.** `h == 720` + "content in the final 20
  rows" also flags every `components-appshell--*`. Those are **correct**: `layout: 'fullscreen'`
  with `<AppShell className="h-screen">`, so the root is exactly 100vh, the height cap binds, and
  what is lost is the 24px decorative padding — **not content**. Cropping
  `components-appshell--expanded.png` at y=660 shows the sidebar's last item (`Collapse menu`)
  whole and the content placeholder's dashed bottom border closing **inside** the frame.
  **This is the right-edge false positive on the vertical axis:** content legitimately reaching an
  edge is not content lost.
- **Under-broad — 3 ids are truncated and unlisted.**
  `components-formlayout--{default,disabled,with-errors}` (6 PNGs), `layout: 'padded'`, no
  `fullPage`. Cropping `components-formlayout--default.png` at y=660 shows the **"I accept the
  terms" checkbox sliced by the frame edge**, with the form's submit row entirely outside it.
  **Pre-existing and outside this branch's 174** — M-P4 was scoped to the additions and is correct
  within that scope. Whether these 3 are fixed here is the lead's scope ruling; **they are
  registered either way so that a later reader cannot mistake their absence for their absence
  from the defect.**

**The consequence is a design constraint on the check, not a footnote:** the predicate cannot be
"the height cap bound". It must be **`maxY > viewport.height`** — content below the frame — which
is necessary *and* sufficient, is derived from the clip arithmetic at `test-runner.ts:132-151`
rather than measured, and does not fire on the appshell class.

## F18-P1 — MUST MOVE: exactly the 14 PNGs of M-P4's 7 ids. Four of them change WIDTH, not just height.

> **⚠ AMENDED by F18-P6 (below, at `2b2aa97d`): the movement set is 20 PNGs / 10 ids, not 14 / 7.**
> The three `components-formlayout--*` ids were ruled IN after this section was written.
> **Read F18-P6 before reconciling any count against the 14 here.**
>
> *Why this stub exists:* F18-P6 deliberately recorded the change as a new section rather than
> editing this one, so that a reader who had **already** read this text would meet the change.
> That protects the reader who arrives after and leaves the reader who **stops here** fully
> exposed — a mitigation aimed at one direction of a symmetric failure. It happened: the 14 was
> reconciled against a 20-PNG run and read as a 6-PNG attribution gap, nearly producing a second
> registration of PNGs that were already registered. **An amendment recorded in a new section
> does not reach a reader who stops at the section it amends; a supersede is only complete when
> the superseded text points forward.**

`fullPage: true` takes `page.screenshot({ fullPage: true })`, which applies **neither the bbox clip
nor the 24px padding**. M-P4 already warns the top 720px will not be byte-identical. **That
understates it for the two `layout: 'centered'` ids**, and this is the distinction that made two
operators wrong an hour earlier:

| id | before | after | why |
| --- | --- | --- | --- |
| `ui-table--backgrounds` (l+d) | **500**×720 | **1280**×(>720) | `layout: 'centered'` — the clip shrink-wrapped `#storybook-root`; `fullPage` captures at viewport width, so the 420px table becomes a table **centred in a 1280px field** |
| `ui-table--borders` (l+d) | **500**×720 | **1280**×(>720) | same |
| `grouping--ungrouped-bucket` (l+d) | 1280×720 | 1280×(>720) | `layout: 'padded'` — already full-width, height axis only |
| `grouping--group-scoped-selection` (l+d) | 1280×720 | 1280×(>720) | same |
| `tree--indent-step` (l+d) | 1280×720 | 1280×(>720) | same |
| `virtualization--overscan-rows` (l+d) | 1280×720 | 1280×(>720) | same |
| `virtualization--dynamic-row-heights` (l+d) | 1280×720 | 1280×(>720) | same |

**A reviewer diffing the top region of the two `ui-table` images against the old baseline will see
a total change and must not read it as a regression.**

**The sharpest mechanical check this run affords, because it is currently a clean zero:** **no
baseline in the repo exceeds 720px in height** — verified across all 1251. After regeneration,
**exactly these 14 must exceed 720, and nothing else may.** A 15th is a misfire; a 13th means a
story did not take the parameter.

## F18-P2 — CONTENT: what each image must SHOW, per M-P7. Two of these correct #89's own account.

Each row states the case that **appears for the first time**. Verified by reading the committed
baselines directly, not inferred from height.

| id | must show | and the case is only *comparable* if |
| --- | --- | --- |
| `ui-table--borders` | **all 5** labels: `default (horizontal only)` · `all four, default strength` · `vertical only` · `strong frame, subtle dividers` · `none` | **#89 SAYS IT LOSES CASE 4; IT LOSES 4 AND 5.** The committed image holds cases 1–3 whole, case 4 as label + a header row sliced by the frame edge, and **case 5 (`none`) entirely outside the frame.** The story compares 5 border configurations and the baseline guards 3. Case 5 must render a table with **no horizontal dividers**, visibly unlike case 1 |
| `ui-table--backgrounds` | **all 4** labels: `transparent` · `accent` · `subtle` · `surface` | `surface` is currently label + a sliced header row. **Carried from #48's named weak guard: in LIGHT, `surface` and `default` both resolve to `#ffffff`, so the light image cannot distinguish this case at all — dark is where it has content.** Confirmed in `--dark`: the `surface` header sliver already shows a distinct fill |
| `grouping--ungrouped-bucket` | **all 4** `<h3>`s: `default — visible, "Ungrouped", last` · `position: 'first'` · `name: 'No status'` · `show: false — the bucket and its records are dropped` | case 4's grid must have **no ungrouped bucket at all** — that is what `show: false` does. An image with 4 labels but a bucket under the 4th is a **defect wearing the fix's clothes** |
| `tree--indent-step` | **all 3**: `indent: default (20px)` · `indent: 8px` · `indent: 40px` | the third grid's child rows must be indented **visibly further** than the first's. If all three look equal, `indent` is inert and this story never demonstrated anything |
| `virtualization--overscan-rows` | **all 3**: `overscan: 0` · `8` · `40`, each above a **complete** grid | all three bounded regions are `appearance={{ height: 240 }}` and must be the **same height**. Case 3 is currently header + 1 row |
| `virtualization--dynamic-row-heights` | **both** labels, each above a complete **300px** grid | the `measure: 'dynamic'` grid's bottom edge must sit **inside** the frame. **Collision id — see F18-P3** |
| `grouping--group-scoped-selection` | **both** `selectionScope: all-loaded-leaves` and `visible-leaves`, second grid complete to its last row | **Collision id — see F18-P3** |

## F18-P3 — THE TWO COLLISION IDS, and F17-P5's corrected clause is now WRONG on one axis

Per M-P7's table, two of my ids carry other causes. N comes from that table:

**`grouping--group-scoped-selection` — N = 2** (M-P3/F17-P2 leading-column width + M-P4 truncation).
F17-P3 registered its half: *"both rendered grids narrow their `__select__` to 40.0 (`sel:2`)"*.
Mine: **the second grid is complete to its last row.** Compatible — different axes, no conflict.

**`dynamic-row-heights` — N = 2** (M-P2/#90 width + M-P4 truncation). **CONFLICT, and it must be
resolved before the run rather than after.** F17-P5's corrected clause (line 1223) reads:

> "dimensions unchanged at 1280×720; the two bordered boxes shrink from ~1233px wide to 640px…"

**The `720` cannot survive this fix.** `dynamic-row-heights` is one of the 7, so its height *must*
change — that is the point. Reconciled:

> **Width unchanged at 1280** — F17-P5 is right, and right for the reason it gives: any
> `layout: 'padded'` baseline is 1280 wide whatever happens inside it, so the width axis is
> untestable for this story. **Height changes** (mine). The bordered boxes shrink to 640px
> (F17's), and **wrapped `edge-0*` text persists and is not a defect** (F17's).

**Why this is worth its own subsection:** F17-P5 exists precisely to stop a wrong number surviving
in the register, and its own correction left a number that my change falsifies. A reviewer
following it verbatim sees a taller image and **records a failed fix on a working one** — the same
inverted outcome, one axis over.

## F18-P4 — MUST NOT MOVE, and the mechanical reason

**Every other baseline, all 1237 of them.** Adding `parameters.snapshot.fullPage` to 7 stories
cannot affect another story. The runner change hoists the four bbox extents out of the clip IIFE
into one `extent` object and adds a comparison; **the clip expressions are arithmetically
identical, term for term.** So a non-`fullPage` baseline moving means the refactor altered capture
geometry — which is the one way this change can do damage, and it is what to look for first.

**The check itself moves nothing even when it fires**, because it throws (or warns) **before**
`page.screenshot`. In `--update` mode that ordering is load-bearing: a truncated PNG is never
written.

## F18-P5 — what this CANNOT settle, stated because the arithmetic is the weakest link

**`maxY` is a DOM measurement and browser tooling was offline for the whole of this work.** The
predicate is *derived* from the clip arithmetic and is consistent with the 1251-baseline pixel
census, but **the arithmetic-to-DOM coupling is unexercised.** Specifically:

- **Owed:** the live negative control — force a story past the viewport, confirm the check fires;
  confirm it stays silent on `grouping--multiple-grouping-columns` (699px) and `ui-table--sizes`
  (696px). Both are corroborated clean by my census (neither appears in any flagged set, so both
  are `<720` with a uniform bottom band) but neither has been run through the check.
- **A unit test on fabricated boxes exercises the arithmetic only** — sign, `>` vs `>=`, and the
  `NaN` class of failure that let an operator's guard pass 20/20 on this branch. It does **not**
  establish that the numbers reaching the predicate are the real `maxY`. That sentence is not
  available to me and is not written anywhere in this section.
- **Cannot determine (2 ids / 4 PNGs):** `ui-sheet-all-states-generated--{states,focus-visible}`.
  No `fullPage` (the generated file carries no `parameters` block at all, unlike the hand-written
  `sheet.stories.tsx`), bottom band varies, and whether the portalled `SheetContent` bbox lands at
  exactly 720 or past it is **not recoverable from a clipped PNG.** If the check fires on these,
  it is a 15th/16th PNG against F18-P1 and it is **not** necessarily a misfire — read it before
  reverting anything.
- **Reasoned safe but unmeasured (11 ids / 22 PNGs):** all `components-appshell--*`, on
  `h-screen == 100vh == exactly 720` so `>` does not fire. The crop is consistent (the shell stops
  ~2px short of the bottom), but this is a claim about a layout engine I did not run.
- **Provably cannot fire, from the pixels alone:** all 22 of the census's uniform-bottom `h == 720`
  set, and every baseline under 720. A uniform final 20 rows means content ends ≥20px above the
  frame, so `maxY < 700 < 720`. **No browser needed for that half** — it disposes of the whole
  `ui-drawer-all-states-generated--*` group.

**No tolerance was added to the predicate.** `maxY > viewport.height + 1` would insure against the
appshell subpixel case, and it was deliberately not written: a tolerance is how a check goes quiet,
which is the defect this section exists to remove. A loud misfire is one line to fix; a quiet one
passes forever.

## F18-P6 — RULED (team lead): fail, this predicate, formlayout IN, land unexercised. **The movement set is 20 PNGs, not 14.**

F18-P0 left the formlayout scope open. **It is now ruled IN**, so F18-P1's set grows. Recorded here
rather than by editing F18-P1, because a reader who has already read that section must meet the
change rather than a silently different number.

**MUST MOVE — added to F18-P1, and these 6 are OUTSIDE THIS BRANCH'S 174:**

`components-formlayout--default` · `--disabled` · `--with-errors` (light + dark) = **6 PNGs.**
Pre-existing, `layout: 'padded'`, truncated by the same cap. **`--two-column` is NOT affected** and
must not move — two columns is shorter than the viewport, which is the negative control sitting
inside the same file.

**So the total is 7 + 3 = 10 ids / 20 PNGs.** Each formlayout image must show its **submit row**,
which no committed formlayout baseline contains: today the capture ends on the "I accept the terms"
checkbox, sliced. **A form baseline that cannot see its own submit button guards nothing.**

**Why in rather than exempt, recorded because the alternative is seductive:** leaving a
known-truncated baseline behind a newly-failing check is how the check gets reverted by whoever
hits it first — or allowlisted, and **an allowlist is the silent surface again, with an audit
trail.** This is the third family of pre-existing baselines this branch has had to pull into scope,
and each was found by someone **enumerating rather than reasoning.**

### The rulings, so a later reader does not relitigate them

- **FAIL, not warn** — decided on internal consistency, not loudness: `test-runner.ts:51-63`
  already throws rather than skips, on the grounds that "a guard that quietly stops checking is
  worse than no guard". **A file that disagrees with itself teaches the weaker half.**
- **`maxY > viewport.height` replaces the originally-specified `contentHeight > viewport.height - y`**
  — the latter fires whenever the cap *binds* and would have reddened the 22 correct appshell PNGs.
- **NO TOLERANCE, even if the appshell case bites.**
- **Land unexercised** (F18-P5's owed DOM half stands), because a misfiring check fails loudly and
  gets found, whereas a check that never lands costs the next tall story silently.
- **Silently auto-promoting a truncating story to `fullPage` was rejected**: it makes capture
  geometry a function of content height, so a story that grows by one row reframes itself and the
  diff reads as a total regression with no source change to explain it. **It trades a truncation
  for a mystery.**

### `fullPage` INTERACTS WITH `layout`, and both cases must be named

This is the third wrong prediction on this branch traceable to `centered`-versus-`padded`. It has
cost two operators a claim each and nearly cost a third, so state it as a rule rather than as a
finding about two stories:

> **`layout: 'padded'`** — `#storybook-root` is full-width and its box is indifferent to its
> contents, so the clipped capture is already 1280 wide. `fullPage` changes the **height axis
> only**.
> **`layout: 'centered'`** — `#storybook-root` shrink-wraps, so the clip was content-sized.
> `fullPage` ignores the clip entirely and captures at viewport width: **both axes change, and so
> does the character of the image.** `ui-table--{backgrounds,borders}` go **500×720 →
> 1280×document-height**, and a flush-framed 420px table becomes **a 420px table floating in a
> 1280px field.** A reviewer told only "it got taller" will not connect that to what they see.

### The instruction for whoever runs the regeneration — this one prevents a false finding

The regeneration's **smoke run is this check's first real exercise** (one component, live
Storybook, four workers). Therefore:

> **If the smoke fires this check on a story outside the 10, that is the arithmetic-to-DOM step
> failing — NOT a newly discovered truncation.** The predicate is derived from the clip source and
> is consistent with a 1251-baseline pixel census, but nothing has yet confirmed it fires on
> exactly these 10 and none of the other 1241. **Without this sentence the first spurious fire
> looks like a finding**, and it would be attributed to the story rather than to the instrument.

The two genuinely undeterminable ids (`ui-sheet-all-states-generated--{states,focus-visible}`,
F18-P5) are the most likely place for that to happen. They are registered **unknown, not
assumed-safe.**

## F17-P6 — Is my change DataTable-output-neutral? **#91 yes, #90 NO.** Correcting my own control.

Asked by the lead before the run, because my in-flight set touches two DataTable-layer files
while the registry carries — **on my own architectural argument** — that every
`components-datatable--*` baseline is MUST NOT MOVE. Both claims cannot stand unqualified.

### #91 — YES, provably neutral, and this is what keeps the control sound

The sizing split publishes only a **declared** size. Verified by grep across every
`.stories.tsx` in `data-table/` and `table/`: **no DataTable or `ui-table` story declares a
column `size`, `minSize` or `maxSize`.** Their chrome columns are hand-written by the story
(`data-table.stories.tsx:47-66`) and carry no sizing, so the split emits nothing for them.

> **So for #91 the control keeps its full meaning: if a `components-datatable--*` baseline
> moves, the fix reached the primitive layer.**
>
> Method note: `grep 'size: [0-9]'` is unreliable in this tree —
> `data-table-expansion-domains.stories.tsx` has six `size:` matches that are a **data field
> holding "12 TB"**. The pattern used here (`size: [0-9]+\s*[,}]`) excludes them. A looser
> re-run will "find" sizes that are strings and conclude differently.

### #90 — NO. Four PNGs move, and the mechanism is nothing to do with width.

**I would have let a registered control fire on my own committed work.** `ea8c8c34` moved the
border **and its `border-radius`** onto the ScrollArea root, which already had
`overflow: hidden`. Radius and overflow-hidden are now on the **same** element for the first
time:

| | before | after |
| --- | --- | --- |
| root | radius **0px**, `overflow: hidden` → clips **square** | radius **6px**, `overflow: hidden` → clips **rounded** |
| wrapper | radius 6px, **no** overflow-hidden → clipped nothing | gone |

So an **opaque table background** used to paint square into the region the rounded border curves
away from, and is now clipped to match it. Measured (`getComputedStyle` on the `<table>`):

| id | table background | corner clip changes? |
| --- | --- | --- |
| `datatable-appearance-pass-through--background-accent` | **`rgb(226,235,245)`** opaque | **YES** |
| `datatable-appearance-pass-through--background-subtle` | **`rgb(248,250,252)`** opaque | **YES** (subtler) |
| `datatable--striped` | `rgba(0,0,0,0)` | no — nothing painted there |
| `datatable--default` | `rgba(0,0,0,0)` | no |
| `ui-table--backgrounds` | root radius **0px**, border **0px** | **no — bare `Table` passes no `containerClassName`** |

**MUST MOVE, added to F17-P1:** `components-datatable-appearance-pass-through--background-accent`
and `--background-subtle` (light + dark) = **4 PNGs**, at the four corners only.

**This is a fix, not churn.** Before, an opaque background squared off inside a rounded border —
a visible artifact at every corner. It now follows the border.

**And `ui-table--*` is confirmed untouched by both fixes** for a mechanical reason worth stating:
bare `Table` receives no `containerClassName`, so its root has radius 0 and border 0. That is a
stronger statement than F17-P1's, which rested only on those stories setting no width.

### The corrected control

> Every `components-datatable--*` baseline is MUST NOT MOVE **except**
> `appearance-pass-through--background-accent` and `--background-subtle`, whose corners move
> because #90 relocated the radius onto the clipping element. **A move anywhere else in that
> family still means the fix reached the primitive layer.**

A control that fires on expected behaviour trains people to dismiss it, which is worse than not
having one.

**Extent of verification, because it is narrower than the table above looks:** I measured the
`<table>`, first `<th>` and first `<td>` background for each id. I did **not** measure the
**last** row, so for `--striped` I have established that nothing paints at the *top* corners and
have **not** established it for the bottom ones — a striped final row would paint there. Treat
`--striped` as *probably* unmoved rather than proven so.

## F17-P7 — WHICH WORLD: this registers for **World A**, settled by measurement

The lead's contingency: if auto layout kept distributing the `w-full` surplus over the
constraint, #91 would produce a correct DOM and **no pixel movement at all**, flipping every
must-move id to must-not-move.

**World B is excluded by measurement, not by expectation.** Control #1 first, on committed
behaviour: `columns-features--fit-to-container`'s `Name` carries
`width: 200px; min-width: 200px` and renders at **exactly 200.0px**. Then the fix itself,
measured in four stories: **92.6 → 40.0**, **209.2 → 40.0** (×2), **143.5 → 40.0**.

**So F17-P1 and F17-P2 register for World A: the constraint is honoured and the listed baselines
move.** `max-width` being ignored in auto layout — the failure mode that would have produced
World B — does not occur in this table (`table-layout: auto`, `border-collapse: collapse`,
`w-full`).

One consequence for the compound check: under World A no image loses an expected change, so **N
does not shrink for any of the ten collision ids on my account.**

## F17-P8 — #91's half of FOUR collision ids that M-P7 does not name

F17-P3 registered content for M-P7's ten ids. **M-P7's table is stale:** it was written while
M-P3 held the leading-column enumeration, and F17-P2 superseded M-P3 with 24 ids — four of which
are also in M-P1's icon must-move list. So these four are collisions M-P7 never recorded, and
**#92's half is registered while #91's was not.**

All four carry `__select__` and nothing else (`sel:1 det:0 act:0`, per F17-P2's parse). All four
live in `data-grid.stories.tsx`, which is `layout: 'padded'` — so per F17-P5 their **dimensions
do not change**; this is a content-only change.

| id | my contribution to the expected change |
| --- | --- |
| `components-datagrid--full-featured` | `__select__` narrows to **40.0px**; freed width redistributes to the data columns. No other column changes. |
| `components-datagrid--grouped-config` | `__select__` → **40.0px**, same redistribution. |
| `components-datagrid--named-callbacks` | `__select__` → **40.0px**, same redistribution. |
| `components-datagrid--presets` | `__select__` → **40.0px**, same redistribution. |

**So N=2 for each of these four, not 1** — the icon glyph flip (#92, M-P1) *and* the leading
column (#91). Followed as M-P7 stands, a reviewer confirms the flipped glyph, marks the image
explained, and **a leading-column defect in the same frame sits inside the expected set.**

**No `__detail__` or `__actions__` change in any of the four**, so a narrowed expander or actions
gutter in these images would be a defect rather than my fix.

### The transferable failure, which is not about these four ids

**Superseding a section does not propagate to the tables built on it.** F17-P2 correctly replaced
M-P3, and M-P7 kept pointing at M-P3's old output — so a *declared unknown* in one section
(M-P1's blind spot: this branch's own earlier additions, outside the 174 but still its files)
became an *undeclared error* in a downstream table. M-P1 flagged the gap honestly; M-P3 never
enumerated it; F17-P2 does.

> **A supersede is only complete when every table that consumed the old section is re-derived.**
> Nothing in this registry links a section to its dependents, so that check is manual and was
> missed by both authors.

Found by the regeneration reviewer, which **declined to write these four lines itself** — a
reviewer authoring the prediction it will then check has no independent standard, the same defect
as a test asserting its own precondition. Correct, and the reason this section is signed by the
implementer.

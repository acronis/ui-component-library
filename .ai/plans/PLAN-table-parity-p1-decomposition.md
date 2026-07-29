# Table parity P1 — parallel-build decomposition

- **Status:** Wave 0 — **F1 (`e28bcd0`), F3 and F4 landed green**; F2 and F5
  remain. F4 absorbed its full extended scope, so the **three-wide Wave 1
  fan-out holds**. All 7 blockers and all 8 questions closed; see §9 and §10.1.
  Ratified deviations: one from ADR-0001 (in that ADR), two from F3 (§1.2), F4's
  in its own entry. The DataTable feature module has **nine** contribution
  points — ADR-0002 records why, and the test for whether a tenth is needed.
  **New ownership category: policy-frozen (§0.3).**
- **Date:** 2026-07-27 (rev 2r — manifest lines land directly; `DataTableViewOptions`
  superseded; U3's four contract corrections)
- **Design contract:** `context/table-feature-parity-design.md`
- **Plan of record:** `context/table-feature-parity-implementation-plan.md` §3, §7
- **Decisions this rests on:**
  [ADR-0001](adr/ADR-0001-expansion-domain-row-model-ownership.md) — **Accepted**
  (expand ownership; OQ-1 and OQ-2 both decided) and
  [ADR-0002](adr/ADR-0002-internal-feature-module-registry.md) — **Conditional
  go with extended scope** (module registries across both layers)
- **Evidence:** `.ai/team/table-parity-p1/explore/researcher-engine.md`;
  `.ai/team/table-parity-p1/explore/researcher-surface.md`; the design-gate
  review, which re-verified both against the working tree
- **Baseline:** branch `feat/table-parity`. Design analysis was against `6ad26a7`;
  every line reference in this plan predates F1, so read them as "before F1"
  where F1 touched the file. **F2's acceptance baseline is `e28bcd0`** — see its
  Done item 1.

---

## 0. How to read this

Developers share **one checkout**. There is no merge step: two agents writing
the same file clobber each other, and **a one-line edit is a whole-file write**.
Disjoint file ownership is the mechanism. Every unit states:

- **Owns** — files this unit may create or modify. Nobody else touches them.
- **Must not touch** — files that look in-scope but belong elsewhere.
- **Depends on** — units that must have *landed* (green) first.
- **Done** — the acceptance condition, anchored to a `packages/ui-spec` scenario
  where one exists.

A unit that needs a file it does not own **stops and asks the team lead**. That
is the escalation and it is expected to happen — this map is a prediction, not a
proof.

**There is a third category, and the ownership map alone does not express it.**
"No unit owns this file" and "anyone may edit this file" are **different
questions**, and conflating them already caused one wrong grant (see §0.1).
Files fall into one of:

1. **Owned** — exactly one unit may write it.
2. **Manifest** — integrator-only; nobody else, see §1.6.
3. **Policy-frozen — nobody may write it, regardless of ownership.** Not a
   coordination problem; a contract. Escalating does not unlock it, because the
   answer is no.

**Verifying a gate: never inject a control into a file you do not own.** The
obvious reason is clobbering. The real reason is sharper: **a revert is only safe
against your own failure, not against a concurrent write by the owner.** The owner
can save over the file between your write and your revert, and then your revert
either destroys their work or silently fails to restore theirs — and no amount of
care on your side prevents it, because you do not control the interleaving. To
prove a gate can fail, break something in a file you own, or in a scratch file you
create and delete.

### 0.1 Policy-frozen: the `DataTable*` companion suite

`data-table/index.ts:97-100` marks four files as **frozen one-minor
compatibility adapters** with an explicit *"Do not add new features here"*, and
design §1 restates it: the library does not publish a batteries-included
`DataTable*` companion suite as its long-term architecture. These pieces move
behind DataGrid and are removed next major.

**Off-limits to every unit:**

- `data-table/data-table-toolbar.tsx`
- `data-table/data-table-view-options.tsx`
- `data-table/data-table-pagination.tsx`
- `data-table/data-table-column-header.tsx`

**Any `toolbar.*` member, view-options control, or pagination affordance belongs
in DataGrid's own private chrome**, never in these. If a config member appears
unimplementable without touching one, that is a signal the chrome belongs to
DataGrid — which is the design's position, not a workaround.

**Required when you reimplement a frozen piece behind DataGrid: an equivalence
test.** Reimplementing a frozen companion creates two implementations that can
drift for as long as both exist. F4 turned that risk into a checked invariant
with `data-grid/__tests__/data-grid-toolbar.test.tsx`, which renders
`DataGridToolbar` and the frozen `DataTableToolbar` **through the same
controller** and asserts identical markup modulo per-render ids.

**Any unit that reimplements a frozen companion piece behind DataGrid writes the
same test.** It is cheap, it is the only thing that keeps the frozen adapter
honest until the next major removes it, and it fails loudly the moment either
side drifts.

**Caveat, from U3: the test guards against *accidental* divergence, so a
deliberate divergence updates it with the reason rather than deleting it.**
`DataTableViewOptions` is now **superseded**: `data-grid-toolbar.tsx` rendered it
for `toolbar.viewOptions`, and U3's contract replaces it with a richer
`data-grid-column-settings.tsx` covering visibility **plus** pin, resize and
reset. The direction was already determined — design §1 lists
`DataTableColumnMenu`-style product chrome as something the library does not
publish, §4.3 puts column-settings chrome in DataGrid, and F4 set the precedent by
building `data-grid-toolbar.tsx` rather than extending the frozen
`DataTableToolbar`. So F4's `data-grid-toolbar.test.tsx` gets an updated
assertion carrying *why* the two now differ; deleting it would discard the guard
against the next accidental drift.

**U3 carries the `data-grid-toolbar.tsx` edit**, per the rule F4's ownership README
already states for U7: **the unit whose change requires the edit makes it,
everyone else escalates first.** `DataTableViewOptions` stays exported for external
callers and joins the companions DataGrid no longer consumes — pagination and
column-header remain, and each gets its equivalence test when its owning unit
arrives.

*How this rule was learned.* F4 needed `toolbar.viewOptions` honored and asked to
add one prop with a `true` default to `data-table-toolbar.tsx`. The team lead
verified no unit owned it and granted permission — a reasonable check against the
ownership map, but the wrong question, because the file is frozen by policy
rather than unowned. **F4 withdrew its own request and built DataGrid's private
toolbar row instead, leaving `DataTableToolbar` byte-identical to `88eaf6b`
(verified: zero diff).** That was the right call and it correctly overrode an
explicit instruction. Recorded so the next unit does not have to re-derive it,
and so a granted permission is not mistaken for a settled question.

### 0.2 Why the gate opened with two blockers partially cleared

*(Recorded here because the design phase has no summary artifact — a tool-level
guard blocks writing one at that path. The full narrative is in
`.ai/team/table-parity-p1/design/da-review.md`, across both passes.)*

F1, F3 and F4 were dispatched while BL-5 and BL-3 were still partially cleared.
The reasoning, so it can be judged rather than just observed: **both residuals
were scoped to units that could not start yet.** BL-5's defect lived entirely
inside F2's brief, and F2 depends on F1 landing. BL-3's residual affected U3 and
U6, which are Wave 1 and depend on all of Wave 0. No dispatched unit could reach
either one, and both were closed in rev 2b — before the units they affect became
unblocked. The alternative, holding three developers idle against defects none of
them could hit, would have bought nothing.

### 0.3 What BL-5 was, and why F2's acceptance criterion reads the way it does

**Whoever owns F2: this is the part to read.** Its acceptance criterion is
unusually pedantic — a named baseline commit, a read-only guard set, a separate
file for four assertions, a recorded guard-commit SHA. That is not process for
its own sake. Every clause is there because of a specific failure that already
happened once, during design.

ADR-0002 was approved *conditional on its safety net* — the promise that a set of
existing suites would catch any behavior change the refactor introduced. Review
established the net was **not load-bearing at either hazard the ADR itself
named**: the lazy-table closure was guarded by exactly one test, which F1 was
scheduled to rewrite (so the guard would vanish before F2 needed it); the
order-sensitive sorting option group had *zero* coverage, so a feature module
could silently drop `sorting.cycle` and pass everything; `data-table.test.tsx` —
the suite most load-bearing for the view rewrite F2 performs — was missing from
the list entirely; and one listed file did not exist under the name given.

Then the *fix* for that contradicted itself in three places and needed a second
review pass to catch: F2's `Owns` list granted permission to modify the very
files the criterion called unmodifiable; Done item 2 required four new assertions
whose obvious home was first in that unmodifiable set, making two Done items
mutually unsatisfiable; and "before the refactor commit" was unverifiable on a
squashed landing.

So: if a clause in F2's brief looks like bureaucracy, it is the scar of one of
those. **Escalate rather than relax it** — a quietly relaxed criterion here
removes the only evidence that the refactor preserved behavior.

---

## 1. The two mechanisms that make the partition disjoint

### 1.1 The module registries (ADR-0002)

Wave 0 converts the five contended surfaces into per-feature files. After it:

| Spine surface | Wave 0 owner | Contended afterwards? |
| --- | --- | --- |
| `data-table-controller.ts` option literal | F2 | No — features contribute `engineOptions` |
| `data-table-controller.ts:167-198`, `:232-238` options unions | F2 | No — **F2 pre-declares all seven keys**, each typed against a `…Config` interface owned by its own feature module |
| `data-table-view.tsx` | F2 | No — features contribute `displayRows` + `renderDisplayRow`; virtualization replaces the body-window seam file |
| `data-table-render-context.ts` | F2 | No — features contribute `renderContext` |
| `components/ui/table/table.tsx` | F3 | No |
| `data-grid.tsx` — all eight sites | F4 | No — config modules contribute `resolve`, `controllerOptions`, `viewProps`, `columns`, `chrome`, `callbacks` |
| `data-grid-callbacks.ts` (found by the §1.7 sweep) | F4 | No — derived from the `callbacks` contribution |

If F4 cannot carry its scope (see its entry), the honest fallback is to say so
and serialize the DataGrid half of Waves 1–2. **Do not ship a half-registry.**

### 1.2 What F3 shipped, and the contracts U4/U5/U6 must not fight over

> **Amended by §1.8.** A later product constraint requires the scroll container to
> be `ScrollArea`-based. The z-ladder below was validated against the *current*
> container and may need re-validation; treat §1.8 as authoritative on the
> container's shape.

F3 has landed. Three facts from it are binding on later units, recorded here
rather than left in a file header for three units to rediscover separately:

**The fixed z-ladder.** Three sticky mechanisms coexist (pinned columns, sticky
group rows, sticky header/footer), so F3 committed one ladder:

| Layer | z | Pinned within it |
| --- | --- | --- |
| Pinned body cell | 10 | — |
| Sticky row (group header) | 20 | 30 |
| Sticky header / footer | 40 | 50 |

**U4, U5 and U6 use these values and do not invent their own.** A unit that needs
a new rung escalates. The `[&_th[data-pinned]]` rules sit one specificity step
above their unpinned siblings, which is what keeps a start-pinned header cell
above the header cells after it in DOM order during horizontal scroll — do not
flatten that.

**The pin hook is on `TableCell` as well as `TableHead`** (ratified deviation
from this plan's F3 entry, which named only `TableHead`). A header-only pin is
not a feature, and design §4.3 puts header *and* cell pin presentation in Table's
column-settings row. U3 applies pin offsets to both.

**`data-bounded` makes U6's precondition observable** (ratified addition). The
bounded scroll container publishes `data-bounded="true"`, so U6 asserts its
own bounded-height precondition against the DOM instead of trusting a prop was
threaded correctly. Since virtualization without a bounded container is an
invalid combination (design §5.2), an assertable precondition is worth more than
a documented one.

**The box/surface props are type-coupled, not convention-coupled.** All eight
reach `<Table>`, with `borders` and `maxHeight` typed off the **exported**
`TableBorders` (`table.tsx:82`) and `TableProps` (`:194`). U5, U6 and U9 can rely
on that: the two layers cannot drift silently, because a change to the primitive's
type is a compile error at the view. This is worth more than the same coupling by
convention would be.

`showHeader` was implemented from `table/behavior.md`'s recorded resolution — a
header `Table` is not given is a header it does not render — rather than by adding
a primitive prop. **Correction from the build review: that holds in substance but
not in provenance** — the spec says it, but the recorded resolution did not
pre-exist the implementation, so this is not an example of an existing spec being
read. The team lead is looking at the provenance separately. The *technical* point
stands: no primitive prop was added, and none is needed.

Also note `--table-sticky-surface`: a local custom property, deliberately **not**
a `--ui-*` token, that the `background` variant publishes so every sticky part
can paint an opaque surface over whatever scrolls beneath. It is an indirection
*to* a token, not a token — do not add it to the token pipeline.

### 1.3 A false premise, corrected — a new columns array does NOT reset selection

A comment in `data-grid.tsx` asserted that passing a new columns array resets row
selection. **It does not.** Selection is keyed by row id in the controller's own
state, so it survives a columns identity change. F4 tested it, corrected the
comment, and pinned the behavior with a `DataGrid column-set identity` test.

The `resolvedColumns` memo is still justified, but as a **performance** property:
a new columns array invalidates TanStack's memoized row model. It is not a
correctness guard for selection.

**This matters to U6 specifically.** Virtualization reasons about row-model
invalidation, and a brief that inherited the old comment would conclude that
column changes carry state consequences they do not have. Any unit reasoning
about what a columns identity change costs should read this, not the git history.

### 1.4 Derived props intersect — a prop two groups read is declared once

The first structural consequence of the derived-props design, and it will recur,
so it belongs next to the registry rules rather than in one unit's notes.

In `DataGridProps`, a prop declared in **two** config modules **intersects**; it
does not union. So `state?: DataGridDataStatus` in one module and
`state?: DataTableStateInput` in another collapse to **`never`** — a prop that
inexplicably accepts nothing, with no error at the declaration site.

**The rule: any prop that two groups both read is declared exactly once, as the
union, in its own module. The second group participates via `aliases` only.**

For the `state` case that means a dedicated `data-grid-config/state.ts` declaring
`state?: DataGridDataStatus | DataTableStateInput`, while the `dataState` group
keeps `state` in its `aliases` list so preset-collision detection and the
deprecated-alias warning still fire. That separation is the point: **the alias
machinery and the type declaration are different concerns**, and only the
declaration is exclusive.

This belongs in `data-grid-config/README.md` as well as here — a reader who hits
a `never`-typed prop needs it at the registry, not in a plan. F5 carries it there
as part of the `state` work.

### 1.5 Identity is required by `rowInteraction.current` only — not the group

A design correction, recorded as one because it changes what later units may
assume. Design §3.1 lists `rowInteraction` **wholesale** as identity-bearing.
That is over-broad: only **`current`** requires row identity (the current row is
tracked by id). `onClick`, `onHover` and `onActivate` receive the **row object**,
so they need no id at all.

Left as written, every grid with nothing but a row-click handler would be
permanently forced to supply `getRowId` — a requirement with no purpose, on the
most common interaction in the kit.

**The rule as implemented:** the identity constraint is
`rowInteraction?: { current?: false }` on the identity-free branch, not
`rowInteraction?: false`. This is expressible only because the identity-free
branch is registry-derived rather than hand-written (see F5's entry) — each
identity-bearing module declares its own constraint, so one can be a *refinement*
of a group rather than the whole group.

**What U1 and U2 may assume:** identity is required by the feature that keys
state by row id, not by the group that happens to contain it. Before writing
`?: false` for a group, check whether only one member of it needs an id. The
design-document amendment is assigned to the tech-writer (§10.1, Q8).

### 1.6 The integration queue — for surfaces that cannot be partitioned

Some files are irreducibly one-per-feature-line or one-shared-prose-section.
"Append carefully" is not a mechanism. These files are **manifest files**: no
unit ever opens them.

**Manifest files (integrator-only):**

- `data-table/data-table-features/index.ts` — the ordered registry list
- `data-grid/data-grid-config/index.ts` — the config-module list
- `data-table/index.ts`, `data-grid/index.ts` — the export barrels
  (`data-grid/index.ts:1-19` is a single `export { … } from './data-grid'`
  block, so a new type is not appendable at all)
- `packages/ui-spec/components/data-table/behavior.md` — U1/U2/U4 scenarios all
  live in `## Expansion, tree, and grouping` (`:384-431`); U3/U5/U6/U10 all in
  `## Columns, layout, persistence, and footer` (`:432-491`)
- `packages/ui-spec/components/data-grid/behavior.md` — U1/U2/U4/U6/U10 all in
  `## Advanced parity` (`:215-313`)
- `packages/ui-spec/components/data-table/` and `.../data-grid/` — their
  `api.yaml`, `anatomy.yaml` and `accessibility.md`, because **those two
  components have many claimants** (U1–U10 all add to them)
- **every `packages/ui-spec/components/*/index.yaml`** — see the rule below

**The rule is about claimants, not file names (corrected).** An earlier revision
made *any* `components/*/api.yaml` integrator-only. That was unsatisfiable in
combination with NB-3, and F3 hit the wall: the story generator **reads**
`api.yaml` and `anatomy.yaml` from disk, so a unit told to regenerate its
generated stories *and* to defer its spec edits cannot do both. F3 resolved it by
reading the rule as scoped to the files where units actually collide, editing the
four `table/*` spec files in place and touching no `index.yaml`. **That reading is
ratified and is now the rule:**

- **Multiple claimants → integrator.** The `data-table`/`data-grid` spec files
  and both `behavior.md` files, where every unit adds to the same sections.
- **Sole claimant → edit in place.** A component whose spec only one unit
  touches — `table/*` for F3 — is that unit's to edit directly. Deferring it
  would break the generator, which needs the files on disk.
- **`index.yaml` is integrator-only regardless of claimants**, for the
  `spec-index.json` drift-gate reason below. That one is not about collision.

If you are the sole claimant and unsure, say so and edit in place; the failure
mode of over-deferring (a blocked unit) is worse than of under-deferring (one
integrator merge).

**POLICY CHANGE — the registry-index and barrel lines now land directly, not
staged.** This reverses the "one new module file plus one staged line" rule, for a
structural cost U3 identified and this plan had not priced: **a unit whose module
cannot typecheck until the integrator runs has lost "typecheck clean" as a
self-check.** With three concurrent units that is six semantic errors of pure
noise, in exactly the units that most need a working gate. Given how much of this
wave has turned on gate integrity — a type gate that would have checked zero files
(§6.0 #4), a seam whose reach nothing asserted (ADR-0002) — trading a unit's
primary self-check for one less merge is the wrong way round.

So the **barrel export** and **`data-grid-config/index.ts`'s import plus array
entry** land directly, under the rules already set for the shared
`data-grid-callbacks.ts`:

- pull immediately before editing;
- **strictly append**; never reorder or reformat another unit's lines;
- **one unit at a time. Sequence: U3, then U1, then U2.**

**Position in the config array is semantic, not arbitrary.**
`columnsFeaturesConfig` must resolve **after `sortingConfig` and before
`filtersConfig`**: resolving before `actions`/`selection` would compute
`lockedColumnIds` against a column set that does not yet contain the system
columns it locks. That reasoning belongs in the file's own comment, not only
here — a future reader reordering the array for tidiness needs to find it at the
array.

**What remains staged for the integrator:** the `packages/ui-spec` surfaces only —
both `behavior.md` files, `api.yaml`, `anatomy.yaml`, `accessibility.md`, and
every `index.yaml`. Those have no typecheck consequence, so the original reasoning
still holds for them.

**Mechanism (for the spec surfaces).** Each unit writes a staging file
`.ai/team/table-parity-p1/integration/<unit-id>.md` containing, verbatim, the
lines to add to each manifest file it needs. At the unit's landing, **one named
integrator** (the team lead, or a designated agent) applies every staged block in
a single pass and runs the workspace gates. Units never wait on each other; they
wait on the integrator, who is serialized by construction.

**The staging files must be tracked, or the queue is not a mechanism.**
`.gitignore:60` ignores `.ai` wholesale, so by default the entire integration
record is working-tree only: a clean clone, a reset, or a lost working tree takes
every unit's deferred manifest edits with it, and W3-INTEG has nothing to
reassemble from. Fix, in order of preference:

1. **Each unit force-adds its staging file in its own landing commit:**
   `git add -f .ai/team/table-parity-p1/integration/<unit-id>.md`. **This works.
   Use it.** Once tracked, `.gitignore` no longer applies — it only governs
   untracked files — so later edits need no `-f`.

   > **CORRECTION, and it was mine.** An earlier revision of this item said the
   > mechanism was "MECHANICALLY IMPOSSIBLE — do not attempt it". **That was wrong,
   > and I wrote it.** My commit had failed with *two* errors at once —
   > `[FAILED] … ignored by one of your .gitignore files` **and**
   > `fatal: cannot lock ref 'HEAD'` from a concurrent commit — and I attributed the
   > abort to the first when the ref race was the actual cause.
   >
   > Re-tested deliberately, in isolation, at `776e4987`: `git add -f` an `.ai/`
   > path plus a source file, commit, **exit 0, HEAD moved, both files present in
   > `git show --name-only`** — with the `[FAILED]` lines still printed. So the
   > `[FAILED]` is noise from one lint-staged step, not a failed commit.

   **The one real caveat, and it is the valuable part.** When that step fails,
   **lint-staged does not re-stage its own formatting**, so anything *prettier
   reformatted in that commit* lands unformatted. It drops only lint-staged's own
   changes, nothing else. **Workaround: run `pnpm exec prettier --write` on the
   commit's files before staging**, and then the `[FAILED]` costs nothing —
   confirmed, both files in the test commit pass `prettier --check`.

   Note also that the error **names the wrong subject**: it says `.ai`, while what
   actually failed is the formatting of every *other* file in the commit. Nobody
   reading it would look there — which is very likely a contributor to this
   branch's committed `format:check` debt.
2. *Fallback if the team would rather not rely on force-add:* un-ignore the
   subtree. Note this **cannot** be done by appending a negation — git cannot
   re-include a path whose parent directory is excluded, and line 60 excludes
   `.ai` itself. It requires restructuring that line into `.ai/*` plus a
   descending chain of negations down to `integration/`, which is fiddly enough
   that option 1 is preferable. A `.gitignore` change is also repo configuration:
   it is the team lead's call to make or delegate, not something a unit should do
   in passing.

Either way, **W3-INTEG reads files, not commit messages.** Encoding manifest
edits in commit-message footers was considered and rejected: it survives cloning
just as well, but a reviewer or integrator then has to extract multi-line code
blocks out of `git log` output by hand, which is exactly the transcription step
the queue exists to make mechanical.

### 1.7 The contribution-surface sweep

Three separate reviews found the same defect shape — a hand-listed surface a
later unit must extend, with no contribution point reaching it. Three instances
is a pattern, so every hand-listed prop list, union and total record in the
table family was enumerated and checked against the units that will extend it.
**The sweep is recorded in ADR-0002**; the results that change ownership here:

- **Four surfaces are closed by a contribution point** — `<TableHead>` children
  (U3) via `ColumnPresentation.headerAdornments`; `DataTableToggleAction` (U6,
  U4) via F2's pre-declaration; `DataTableViewProps` (U9) via `viewProps`; and
  **`DataGridCallbacks` (U1, U2, U4, U6) via `callbacks` — new, found by the
  sweep.** That last one hand-lists 13 members where design §5.3 specifies 17,
  and each of the four missing members belongs to a different unit.
- **Five were checked and are clear:** the query-slice sets, `DataTableChangeCause`,
  `TANSTACK_TABLE_OPTION_CLASSIFICATION`, `DataTableSlice`, and the filter-operator
  constants. Reasons in ADR-0002, so nobody re-derives them.
- **One is flagged for slot S1**, not for a P1 unit: `DataTableRenderStatus`
  lacks the `'error'` status `DataGridDataStateConfig` carries.

**The `index.yaml` rule (NB-4).** `packages/ui-spec/__tests__/spec-index.test.ts:14-22`
deep-equals the committed 71 KB `spec-index.json` against a fresh build, and
`buildSpecIndex` reads only `components/<name>/index.yaml`. No unit is assigned
an `index.yaml`, so it does not trip as planned — but bumping `status:` or
`since:` when shipping a target behavior is a natural thing to do, and it turns
`pnpm --filter @constructor-lab/ui-spec test` — a command every unit runs — red
for **everyone** until `spec-index.json` is regenerated as a whole-file rewrite.
**No unit edits any `index.yaml`.** Route status/since bumps through the
integrator, who regenerates the index in the same pass.

---

### 1.8 New constraint: scrolling and virtualization must use `ScrollArea`

**Product constraint from the user:** scrolling and virtualization use the
`ScrollArea` component, so scrollbars are visually consistent with the rest of the
kit. `ScrollArea` exists and is exported (`src/index.ts:62`).

This lands **after** F3 shipped its container, so it amends §1.2 rather than
informing it. Today the container is a plain
`<div data-slot="table-container" class="relative w-full overflow-auto">` carrying
`containerRef` and `data-bounded` (`table.tsx:250-258`), and both U6 and F2's
body-window seam depend on that shape.

**Five risks. Two of the four named are confirmed by source, and there is a fifth
nobody named.** Each would otherwise surface as a bug attributed to the wrong unit.

1. **`containerRef` must reach the element that actually scrolls — confirmed
   broken by a naive swap.** `ScrollArea` forwards `ref` to
   `ScrollAreaPrimitive.Root`, which is `relative overflow-hidden`
   (`scroll-area.tsx:49-55`); the element that scrolls is the internal
   `Viewport`. So `<ScrollArea ref={containerRef}>` puts the ref on a
   **non-scrolling** element, and U6 would measure and scroll the wrong thing —
   presenting as a virtualization defect in U6's own code.
2. **`data-bounded` must travel with the ref.** U6's precondition reads
   `containerRef.current?.dataset.bounded`. If the ref moves to the viewport and
   the attribute stays on the root, the check silently reads `undefined` — a
   **false negative on an invalid-combination guard**, which is the §6.0 pattern
   again.
3. **Sticky needs the scroll container to be the nearest scrolling ancestor —
   and `ScrollArea` *does* interpose an element.** Not hypothetical:
   `ScrollAreaPrimitive.Content` sits between `Viewport` and its children
   (`scroll-area.tsx:60-63`). Whether that breaks sticky depends on its computed
   display/position, which is exactly the kind of thing only a browser answers.
   Three capabilities ride on it — U5 (sticky footer), U6 (sticky header), U4
   (sticky group rows).
4. **The z-ladder was validated against the current container** under
   simultaneous vertical and horizontal scroll. **Re-validation required**,
   specifically whether `ScrollArea` establishes a new stacking or containing
   context. If it does, §1.2's committed rungs may need to change — and three
   units are already told to use them verbatim.
5. **The fifth risk: satisfying #1 requires changing a shared primitive that no
   unit owns.** `ScrollAreaProps extends ComponentPropsWithoutRef<typeof Root>`
   (`:42-44`) — there is **no** `viewportRef` or equivalent, so the viewport is
   unreachable from outside today. Adding one changes
   `components/ui/scroll-area/scroll-area.tsx`, which has **13 other consumers**
   including `tree.tsx`, `sidebar-primary`, `sidebar-secondary` and eight app
   files. That is a blast radius outside the table family and outside every
   existing Owns list. It needs an owner before it needs a patch.

**Prior art worth reading first:** `apps/demos/src/table/TableScrollable.tsx` and
`TableSticky.tsx` already compose a table inside `ScrollArea`. If sticky works
there, it answers risk 3 cheaply; if it does not, that is the answer too.

**Sequencing.** F3 owns the impact assessment — it built the container and is the
only agent to have verified the sticky behaviour and z-ladder **in a real
browser**, where it caught a defect no DOM test could see. *That verification does
not transfer to a new container.* **U6's brief is held open until the assessment
lands**; U6 was already sequenced behind U1 and U2 by the Q4 accessibility ruling,
so this costs no schedule.

### 1.9 Capture presentation constraints for the primitive layer before units build on it

**This is the second constraint to arrive after the work it governs landed** — the
first being the `rowInteraction` identity narrowing (§1.5). Both were cheap to
absorb; a container is not. A scroll container is exactly the kind of primitive
three later features silently depend on: F3 built one, then U4, U5 and U6 each
took a dependency on its shape, and a constraint on it now costs a browser-level
re-verification plus a possible change to an unrelated shared primitive.

**The lesson for the next primitive-layer unit:** before building a container, a
surface, or anything a later feature will take a positional or geometric
dependency on, ask explicitly for the presentation constraints — which kit
component must be used, which scrollbar/overlay/focus behaviour is mandated —
rather than inferring them from the design document. The design contract covers
*behaviour* thoroughly and *presentation-component choice* only in §4.3's reuse
table, which is a list of what may be composed, not a statement of what must be.

## 2. Wave 0 — foundations

```
Track A (engine):    F1 ──→ F2                    ← the long pole
Track B (primitive): F3            (then idles — see §7)
Track C (composite): F4 ──→ F5
```

### F1 — Expansion-domain split (implements ADR-0001)

**Objective.** Rebind TanStack's `expanded` to `treeExpanded`; make detail
expansion a library projection over `detailExpanded`. Split the render-context
expansion fields into `detail`/`tree` namespaces with deprecated aliases pointing
at `detail`.

**Owns**
- `data-table/data-table-controller.ts` — expansion wiring only
  (`:556-560`, `:574`, `:625`, `:635-639`, `:679-685`)
- `data-table/data-table-render-context.ts`
- `data-table/data-table-view.tsx` — the `renderExpandedRow` branch (`:367-376`)
- `data-table/__tests__/data-table-controller.test.tsx`
- `data-table/__tests__/data-table-root-view.test.tsx`

**Must not touch** `table.tsx`, anything under `data-grid/`,
`data-table-state.ts`, `data-table-contract.ts`, and — deliberately —
`data-table/__tests__/data-table.test.tsx`. That file characterizes legacy
expansion rendering end to end (`:88-160`) and is F1's guard precisely because
F1 cannot edit it.

**Depends on** nothing. ADR-0001 is accepted. **Blocks** F2.

**Done**
1. `data-table/__tests__/data-table.test.tsx` passes **unmodified** — this is
   the named guard, not a general instruction (NB-2).
2. `packages/ui-spec/components/data-table/behavior.md:387-394` ("Detail and tree
   expansion are separate") has a passing executable adapter test.
3. A new characterization test covers `getSubRows` + `renderExpandedRow`
   together. No call site does this today (verified twice), and ADR-0001 changes
   its behavior from one conflated expand to two independent ones.
4. **The `ExpandedState === true` path is still driven through
   `options.onExpandedChange?.(true)` and still asserts every core row ID**
   (BL-5 hazard A). This is the only test that reaches the lazy-table closure
   argument. If F1's rewrite drops it, F2's refactor loses its only guard.
5. **A test covers arrow navigation across a row with an open detail panel**
   (ADR-0001 consequence 6). The existing arrow test
   (`data-table-root-view.test.tsx:414-430`) renders no detail rows and cannot
   catch the display-row indexing regression F2 introduces.
6. `DataTableRowContext.isExpanded`/`canExpand`/`toggleExpanded` still compile
   and still mean *detail*; `row.detail` and `row.tree` namespaces exist.
7. **F1 records its landing commit SHA in its handoff.** That SHA is the
   baseline for F2's acceptance criterion (BL-4).
8. Changeset: minor.

### F2 — Registries, display rows, seams, appearance pass-through (implements ADR-0002, DataTable half)

**Objective.** Everything that must happen once to `data-table-view.tsx`,
`data-table-controller.ts` and `data-table-render-context.ts` before any feature
work can fan out. These are bundled because they edit the same three files;
splitting them means serialized passes over the same file for one unit of value.

**Owns — may modify**
- `data-table/data-table-controller.ts` — the feature-gated option spreads
  (`:593-639`), **the config-key declarations in the three options unions**
  (`:167-180`, `:182-193`, `:232-238`), **the `DataTableToggleAction` union**
  (`:265-279`) with its `toggle` switch (`:845-876`), and `STATE_SLICES`
  (`:47-61`)
- `data-table/data-table-view.tsx`
- `data-table/data-table-render-context.ts`
- new `data-table/data-table-display-rows.ts`
- new `data-table/data-table-body-window.ts` — the windowing seam, shipped with
  the identity implementation; U6 replaces this file
- new `data-table/data-table-features/` — modules for the already-shipped
  features (sorting, filtering, pagination, selection, detail-expansion) plus
  **stubs for all seven remaining features**. The stubs are *not empty*: each
  must export its `…Config` interface, or the options unions in scope item 3
  have nothing to reference.
- new `data-table/data-table-features/README.md` — **required.** This is the
  contract every Wave 1/2 unit codes against: the committed feature order, the
  collision rule, the five contribution points, `ColumnPresentation`, and the
  seam.
- new `data-table/__tests__/data-table-engine-option-groups.test.ts` — the home
  for Done item 2's assertions. A **new** file, so the read-only guard set below
  stays untouched.
- `data-table/__tests__/data-table-controller-types.test.ts` — **additive
  only.** F2 appends assertions for the five newly pre-declared keys; it does
  not alter the existing assertions at `:42-53`, `:104-106` or `:136-153`.
  (This file is deliberately *not* in the read-only set — pre-declaring union
  keys is precisely what it guards, so it has to grow. Noted because ADR-0002's
  earlier draft listed it as unmodifiable.)

**Owns — read-only guard (must pass unmodified; see Done item 1)**

The suites in ADR-0002's acceptance table other than the type test:
`data-table-controller.test.tsx`, `data-table.test.tsx`,
`data-table-root-view.test.tsx`, `data-table-state.test.tsx`,
`data-table-engine-plugins.test.ts`, `data-table-engine-options.test.ts`.
F2 may **run** them; F2 may not edit them. If one of them has to change, that is
a signal the refactor changed behavior — escalate rather than edit.

**Read §0.3 before starting.** This split, the named baseline, the separate
assertion file and the guard-commit SHA each exist because of a specific failure
found during design review. They are not boilerplate.

**Must not touch** anything under `data-grid/`, `table.tsx`,
`data-table-contract.ts`, `data-table-state.ts` (the last two are pre-assigned
to U4 — see its entry).

**Depends on** F1. **Blocks** U1, U2, U3, U5, U6, U7, U8, U9.

**Scope, itemised against the blockers**

1. **The nine contribution points** — `engineOptions`, `displayRows`,
   `renderDisplayRow`, `renderContext`, `columnPresentation`,
   `classifyDisplayRow`, `tableDisplayRows`, `rowPresentation`, `effects`. The
   view dispatches every non-`data` display-row kind through `renderDisplayRow`.
   Points 6–9 came from F2's own survey and each closes one instance of
   ADR-0002's recurring failure mode; see that ADR for why `displayRows` cannot
   cover grouping (reclassification, not insertion) or a table-scoped footer, why
   `ColumnPresentation` cannot reach `<TableRow>`, and why the plan's decided
   DataTable-side persistence restore was unimplementable without `effects`.
2. **The body-window seam** (BL-3). F2 ships the identity implementation; U6
   replaces the file.
3. **Pre-declare all seven remaining config keys**, each typed against a
   `…Config` interface *declared in and owned by* its own
   `data-table-features/<feature>.ts` stub, so a Wave 1 unit fills in its own
   file and never opens a union (BL-1). **Corrected — "all three unions" was
   wrong:** five of the seven keys (`columnsFeatures`, `footer`,
   `virtualization`, `persistence`, `grouping`) are keyed by column ID or index
   and never by row ID, so they belong on **`DataTableControllerBaseOptions`**,
   not in the identity split. Putting them in `IdentityOptions` would force
   `getRowId` on a caller who just wants a footer. Only
   `DeprecatedDataTableControllerOptions` needs all five as `?: never`, to keep
   the deprecated branch closed. `detailExpansion` and `tree` stay in the
   identity split, where F1 already put them.
   **The `…Config` stubs are all-optional, and that is correct.** Design §5.2
   marks several members required, but §5.2 is the **DataGrid** grouped API; the
   DataTable-level config is the behavior subset, and
   `data-table-controller-types.test.ts:95-121` already asserts
   `detailExpansion: {}` and `tree: {}` are accepted shapes. Each owning unit
   tightens optionality inside its own file. A reviewer should not read F2's
   stubs as wrong shapes.
4. **`FeatureContext` exposes a lazy table accessor**, not the instance —
   `onExpandedChange` (`:679-685`) reads `table.getCoreRowModel()` inside a
   callback declared in the literal that produces `table`.
5. **The `appearance` class/style resolvers** (`rowClassName`, `rowStyle`,
   `cellClassName`, `cellStyle`, `headerClassName`, `headerStyle`) — cheap, the
   contexts already exist.
6. **The `appearance` box-prop pass-through** (NB-6). `DataTableView` renders
   `<Table>` bare inside a hardcoded wrapper (`:136-143`) and `DataTableViewProps`
   (`:33-85`) has no box props, so F3's `height`/`maxHeight`/`stickyHeader`/
   `size`/`background`/`borders` are unreachable from DataGrid. F2 adds the
   pass-through. Without this, U6's bounded-height precondition is satisfiable at
   the primitive and unreachable from the grid.
7. **Define `ColumnPresentation`, including a header-cell adornment slot**
   (BL-3a). It was left as "width, pin offset, …" and never defined, which leaves
   U3 with nowhere to render a resize handle or a reorder grip:
   `data-table-view.tsx:163-179` builds `<TableHead>` with fixed children, F3's
   pin-offset hook is not an adornment slot, and a header cell is not a DataGrid
   body slot. The shape:

   ```ts
   interface ColumnPresentation {
     /** Applied to the column's <TableHead> and every <TableCell>. */
     readonly style?: StyleValue;      // width, min/max-width, sticky offsets
     readonly className?: ClassValue;
     /** Rendered inside <TableHead>. This is the header-cell seam. */
     readonly headerAdornments?: readonly ColumnAdornment[];
   }

   interface ColumnAdornment {
     /** Unique across contributing features; a collision throws. */
     readonly id: string;
     readonly placement: 'before-label' | 'after-label' | 'edge';
     readonly node: ReactNode;
   }
   ```

   The view renders `headerAdornments` in placement order inside `<TableHead>`.
   **No `table.tsx` change is needed** — `TableHead` already merges `className`
   via `cn()` and spreads props, so an `edge`-placed handle positions itself with
   `className: 'relative'` from the same contribution. This deliberately avoids
   changing F3's brief, which is already in flight. If U3 finds it needs a
   dedicated primitive slot after all, that is an F3 follow-up sequenced after
   F3 — never concurrent with it (§8 placement rule).
8. **Pre-declare the `DataTableToggleAction` union** (BL-3b). It is the
   options-union problem in a second union: `:265-279` hand-lists exactly
   `select-row`, `select-all`, `clear-selection`, `expand-row`,
   `set-current-row`, and the `toggle` switch at `:845-876` implements those
   five. U6 cannot ship `measureLayout()` without adding to both. F2 pre-declares
   the members its own units require — `measure-layout`, `scroll-to-row` (U6),
   and `toggle-group` (U4) — with the switch arms in place, so no Wave 1/2 unit
   reopens the controller for an action.
9. **Derive `STATE_SLICES` (`:47-61`) from the state defaults**, so a new slice
   is declared in two places instead of three. **Corrected — literal "derive
   from the contract" is unreachable from F2's ownership**, as F2's survey
   found: `requiredSlices` is a function-local `const` inside
   `assertDataTableStateIntegrity` (`data-table-contract.ts:50-62`),
   `OPTIONAL_STATE_SLICES` is unexported (`data-table-state.ts:19`), and
   exporting either means opening a U4-owned file.

   Achievable substitute, approved:

   ```ts
   const STATE_SLICES = Object.keys(
     createDefaultDataTableState({ globalFilter: undefined, currentRowId: undefined })
   ) as readonly DataTableSlice[];
   ```

   That yields all thirteen slices and makes the set **follow the defaults
   automatically**, which is the property U4 actually needs. Three sources to
   two is the win; literal contract derivation is not.

   *Also correcting an error of mine in an earlier revision:* I wrote that
   `requiredSlices` "is not 1:1 with the defaults — it excludes the optional
   slices". It is **exactly 1:1, eleven each** — I had read a truncated listing.
   It stays hand-listed regardless, in a file U4 owns.

**Done**
1. **Baseline (BL-4): every suite in ADR-0002's acceptance table passes
   unmodified relative to `e28bcd0`** — F1's landing commit, now known. Not
   relative to today, and not relative to `main`: F1 legitimately rewrote three
   tests in `data-table-controller.test.tsx` plus
   `data-table-root-view.test.tsx`. Check with
   `git diff e28bcd0..HEAD -- packages/ui-react/src/components/ui/data-table/__tests__/`.
   The follow-up commit `9c89584` touched only a changeset, so it does not move
   the baseline.
2. **In a guard commit that precedes the refactor commit**, the new file
   `__tests__/data-table-engine-option-groups.test.ts` asserts
   `enableMultiSort`, `enableSortingRemoval`, `sortDescFirst` and
   `maxMultiSortColCount` at the option level. All four have **zero** coverage
   today (verified), so a feature module could silently drop `sorting.cycle` or
   `maxColumns` and pass every other suite (BL-5 hazard B). The ordering is part
   of the criterion: a characterization test written after the refactor
   characterizes the refactor, not the behavior it was meant to preserve.
   Putting these in a new file — rather than in
   `data-table-controller.test.tsx`, their nearest existing neighbour — is what
   keeps Done items 1 and 2 simultaneously satisfiable.
3. **F2 records the guard-commit SHA in its handoff**, exactly as F1 records its
   landing SHA. Without it, "the guard preceded the refactor" is unverifiable on
   a squashed landing — `.husky/pre-commit` is indifferent to commit count, and
   nothing else forces two commits. With it, a reviewer checks the ordering with
   `git log --oneline <guard-sha>..HEAD`.
4. The committed feature order matches design §3.5 and a test pins it.
5. The three unshipped display-row kinds (`group`, `tree-status`, `footer`)
   dispatch through `renderDisplayRow`; F2 ships no renderer for them, and a test
   proves an unhandled kind fails loudly rather than rendering nothing.
6. `data-table-features/README.md` reviewed by the team lead **before Wave 1
   starts**. It must document all **nine** contribution points,
   `ColumnPresentation`, `TableRowPresentation`, the pre-declared
   `DataTableToggleAction` members, the committed manifest order (which
   `effects` depends on for stable hook order), and ADR-0002's "recurring
   failure mode" test — a Wave 1 unit needs to know that a missing seam is an
   escalation, not something to route around.

**Ownership after landing.** **F2 remains the owner of
`data-table-features/registry.ts` and its README for the duration of the
programme, and stays on standby.** A Wave 1/2 unit that needs a tenth
contribution point escalates to the team lead, who routes it to F2 — no unit
adds a point itself, and no unit works around a missing one. Recorded because
seven instances of the same gap have been found so far, four of them after the
ADR was approved, so an eighth is likely and it needs a named owner rather than
a scramble.
7. Changeset: minor.

### F3 — `Table` primitive: presentation + scroll/sticky container — **LANDED**

> **Landed green.** Two ratified deviations from the brief below (pin hook on
> `TableCell` too; `data-bounded` added) and the committed z-ladder are recorded
> in **§1.2**, which is what U3/U4/U5/U6 should read. The brief is kept as-is for
> the record.

**Objective.** One owned unit covering **both** the sticky mechanism the engine
inventory asks for (virtualization/footer/grouping) **and** the `appearance`
presentation cluster the surface inventory puts here. They are the same work:
`appearance.stickyHeader` *is* the sticky mechanism.

**Owns**
- `components/ui/table/table.tsx`
- `components/ui/table/index.ts`
- `components/ui/table/__tests__/table.test.tsx`
- `components/ui/table/__stories__/table.stories.tsx`
- `components/ui/table/__stories__/table.generated.stories.tsx` (NB-3 — this is
  produced by `pnpm --filter @constructor-lab/ui-spec generate:stories` from the
  `api.yaml` + `anatomy.yaml` F3 edits. There is **no drift gate** on generated
  stories, so it will not turn CI red — it will silently go stale. **F3
  regenerates it.**)
- `packages/ui-spec/components/table/{api.yaml,anatomy.yaml,behavior.md}` — via
  the integration queue

**Must not touch** anything under `data-table/` or `data-grid/`. **Additive
only** — every new prop optional, defaults preserve today's output.

**Scope.** `Table`: scroll-container ref/class + `height`/`maxHeight` (design
§4.2 anticipates this); `size`; `background`
(transparent/accent/subtle/surface); `borders` (independent
top/bottom/horizontal/vertical per §5.2 `BorderConfig`). `TableHeader`/
`TableFooter`: `sticky`. `TableRow`: `current`, `expanded`, `sticky` (group
headers). `TableHead`: native `scope`, pin-offset hook — **as shipped, the pin
hook is on `TableCell` as well; see §1.2.**

**Blast radius confirmed small** — `table.tsx` is imported by `src/index.ts:95`,
`data-table-view.tsx:17`, and three files inside F3's own directory.
`table-family-public-types.test.ts`'s `TableHeadProps`/`TableRowProps`
assertions are `Pick`-based (`:102-117`), so additive props do not break them
and **F3 does not need to open that file**.

**Depends on** nothing. **Blocks** U5, U6, U9.

**Done**
- `table.test.tsx` passes with additive edits only; unchanged stories render
  byte-identically.
- New stories cover each variant in light and dark. **Do not regenerate visual
  baselines** — W3-VISUAL owns that.
- `data-grid/behavior.md:282-289` is satisfiable at the Table layer (the
  DataGrid half is U9).
- Every color resolves to a `--ui-table-*` token; no hard-coded values.
- Changeset: minor.

### F4 — DataGrid config registry (implements ADR-0002, DataGrid half) — **LANDED**

> **Landed green with the full extended scope**, so the three-wide fan-out holds.
> Ratified decisions: `viewProps` as the sixth DataGrid point; `columns` as a
> manifest-order transform with byte-identical output; one reviewed
> `react-hooks` suppression on the registry-derived dependency list (a literal
> list is precisely the contended line the unit deletes, and the rule's real
> invariant holds by construction); and the seven future-group stubs
> **deliberately not augmenting the registry maps** — a map entry is a public
> prop, so pre-declaring them would ship seven props that silently do nothing.
> See §3's two-step note.

**Objective.** The symmetric registry for `data-grid.tsx`. This unit grew
substantially in rev 2 (BL-2): the original scope covered two of the eight
contended sites, which would have left every Wave 1 unit opening
`data-grid.tsx` anyway.

**Owns**
- `data-grid/data-grid.tsx`
- new `data-grid/data-grid-config/` — `registry.ts` plus one module per existing
  group, and **stubs for every group Waves 1–2 add**
- `data-table/__tests__/table-family-public-types.test.ts`
- new `data-grid/__tests__/props-*.types.test.ts` stubs (one per future group,
  created here so each Wave 1 unit owns one)
- `data-grid/__tests__/data-grid.test.tsx`
- `data-grid/__stories__/data-grid.stories.tsx` (NB-8 — the toolbar-default
  change is a rendered behavior change and the repo DoD requires a story)
- `data-grid/data-grid-callbacks.ts` — **added after the contribution-surface
  sweep.** `DataGridCallbacks` (`:79-102`) hand-lists 13 members where design
  §5.3 specifies 17, and the four missing ones belong to four different Wave 1/2
  units (U1, U2, U4, U6); `resolveSliceCallbacks` (`:118+`) is a hand-written
  `if`-chain those same units would each have to edit. F4 derives both from the
  registry's `callbacks` contribution, the same way it derives
  `DataGridGroupedConfig`.
- new `data-grid/data-grid-toolbar.tsx` — DataGrid's own private toolbar row,
  which is where `toolbar.viewOptions` shipped
- new `data-grid/__tests__/data-grid-toolbar.test.tsx` — the equivalence guard
  (§0.1)

**Must not touch** anything under `data-table/` except the one public-types test.

**Scope — all eight contended sites**

1. `DataGridGroupedConfig` (`:200-232`) → derived from the registry via
   per-module interface augmentation
2. `GROUPED_CONFIG_ALIASES` (`:378-391`) → derived from each module's `aliases`.
   This is the forcing function: it is declared
   `as const satisfies Record<keyof DataGridGroupedConfig<unknown>, …>`, a
   **total record**, so today adding a group key makes the file fail to compile
   until this const is updated.
3. `ResolvedDataGrid` (`:339-367`) → derived
4. `resolveGroupedConfig` (`:482`→) → per-module `resolve`
5. the resolved-field destructure (`:806-846`) → driven by the registry
6. the `useDataTable({…})` assembly (`:998-1032`) → per-module
   `controllerOptions`
7. `resolvedColumns` (`:876-934`) → per-module `columns`, so U1/U2 expander
   columns and U3's `lockSystemColumns` for `__select__` (`:899`) and the actions
   column (`:891-894`) land without opening this file
8. the JSX render body (`:1051-1147`) → named chrome slots, so U1/U2/U4/U5
   chrome mounts via `chrome(slot, ctx)`

**Also in scope — a behavior change to shipped surface.** Design §5.2 defaults
`toolbar.columnFilters` to `false` and `viewOptions` to `true`; shipped code
always renders both with no way to disable either. Fix it here: it invalidates
DataGrid baselines, and taking that hit once, before Wave 1 adds stories on top,
is cheaper than twice. **Needs a changeset with a migration note**, not a silent
default flip. (Q5 — confirm.)

**Type-test split.** Replace the exhaustive `keyof DataGridProps` assertion
(`:42-81`) with (a) a frozen assertion that every deprecated alias still exists
and (b) per-group positive assertions in the new per-group files. Note `:82-84`
pins `state` and `:85-87` also pins `onRowClick`, both of which F5 touches.

**If this does not fit one unit.** Say so, and plan the DataGrid half of Waves
1–2 as serialized regardless of ADR-0002. A half-registry that leaves the render
body or the total record hand-listed delivers nothing.

**Resolved: eight of eight sites absorbed.** F4 confirmed the full extended
scope, including the `DataGridCallbacks` + `resolveSliceCallbacks` derivation and
the sixth contribution point `viewProps`. The one addition that was *not*
absorbed was withdrawn rather than deferred: `data-table-toolbar.tsx` is
policy-frozen (§0.1), so `toolbar.viewOptions` shipped in DataGrid's own
`data-grid-toolbar.tsx` instead.

F4's report on why the total record is where declaration merging holds **best**,
worth keeping for whoever touches the registry next: a module's
`kind: 'grouped'` is simultaneously what adds the key *and* what emits the
aliases, so totality is **structural rather than asserted**, and the forcing
function moved to the manifest — where the compile error points at the one line
the integrator appends anyway. Verified through declaration emit against the
built `dist/index.d.ts`. **The three-wide fan-out is confirmed, not assumed.**

**Required first step — a go/no-go on the sites, before writing code.**
This is the single largest risk to the middle sizing number: if F4 cannot absorb
all eight, the DataGrid half of every Wave 1 unit serializes and Waves 1–2 drop
from 3 developers toward 1.5. The plan currently states that consequence but does
nothing to force the answer early. **F4's owner reads the eight sites first and
reports fits / does-not-fit to the team lead before implementing.** A
does-not-fit answer on day one is cheap; the same answer discovered in week two
has already mis-staffed Wave 1.

**Done**
- Adding a group is: one new module file, plus one staged line for the
  integrator. No unit opens `data-grid.tsx`.
- `data-grid.test.tsx` passes; the toolbar change has a test, a story, and a
  changeset.

### F5 — `getRowId` requirement + `state`/`defaultState` exposure

**Objective.** Two halves of one type-design problem: exposing `state` lets a
caller supply `selection`/`currentRowId` slices with no other identity-bearing
config — exactly what the `getRowId` rule (§3.1) prevents.

**Owns** `data-grid.tsx`, `data-grid-config/`, the public-types test, the
DataGrid test/story files, and the grouped-config call sites needing `getRowId`.

**Depends on** F4.

**The migration surface is empty — the census worry is void (NB-8 closed).** F5
checked all **82** call sites for every identity-bearing grouped prop *plus*
`rowInteraction.current` and object-form `state`/`defaultState`: **zero sites
would be newly rejected.** Every site using an identity-bearing grouped config
already passes `getRowId`, and the remainder use deprecated aliases that §3.1
keeps source-compatible by design. **F5 is entirely type design**, which is where
its time went — strike any migration framing.

That closes a question three revisions of this plan carried. For the record, the
earlier figures and why they disagreed — the point being that each counted a
different denominator, which is the whole census lesson:

| Source | Measured | Scope |
| --- | --- | --- |
| Surface inventory | 39 omit / 10 grouped | unstated method; wrong in both directions |
| F5's dev (first pass) | 45 total, 36 in `data-grid.test.tsx`, 8 product sites, 7 files | `<DataGrid` element opens at `88eaf6b` |
| This plan (independent) | 50 total, **36** in that test file, 12 product sites, **7** files | same method, same ref |
| F5 (final, authoritative) | **82 checked, 0 newly rejected** | every identity-bearing prop + `rowInteraction.current` + object-form `state`/`defaultState`, at current HEAD |

The two careful element-open counts agreed exactly on what mattered then (36 in
one test file, 7 product files). F5's 82 is a **different and larger denominator**
— props checked across call sites at current HEAD, after F4 rewrote that test
file — not a fourth contradictory count of the same thing.

**The general lesson for any future census in this repo:** a naive grep for the
identifier counts `DataGridToolbar`, `DataGridBulkActions` and
`DataGridColumnFilters` as `DataGrid` call sites. Match `<DataGrid` followed by
whitespace, `>` or `/`, and count element opens — not identifier occurrences.

**Two decisions, with recommendations**

1. **`getRowId` enforcement — decided: the discriminated props union, on spike
   evidence.** F5 built both shapes and compiled six mistake cases plus the
   Storybook and `ComponentProps` patterns. Results:

   - **The risk this plan flagged did not materialise.** `ComponentProps<typeof
     DataGrid>` survives intact, and `satisfies Meta`, `argTypes` over the union
     and story `args` all compile — including deprecated-alias stories with no
     `getRowId`. The collateral damage across every existing story that six
     reviewers worried about is not there.
   - Error text is precise and names both the missing prop and the branch.
   - The case that usually kills union props — an unrelated typo while on the
     identity-free branch — **stays clean**, because TS narrows on shared members
     first.

   **The documented fallback (optional `getRowId` plus a development error) was
   pre-authorised and not needed.** Recorded explicitly so nobody later reads the
   union as having been adopted without a safety net: the safety net existed, the
   spike simply cleared the union on its merits. Confidence: now High, on
   evidence rather than pattern-matching.

   **Implementation note — the identity-free branch is registry-derived, not
   hand-written.** Spelled out literally it names every identity-bearing group as
   `?: false`, which is one line that U1, U2, U4 and U10 would all have to edit —
   exactly the contention F4 deleted. Each identity-bearing module instead
   declares its own constraint into a **fifth augmentable map**, which is also
   what makes the `{ current?: false }` refinement below expressible at all.

2. **The `state` name collision.** `DataGridProps.state` is a deprecated flat
   prop typed `'loading'|'empty'|'loaded'|'error'`, pinned at
   `table-family-public-types.test.ts:82-84`. The new top-level `state` is a
   slice object. *Recommend* a structural union —
   `state?: DataGridDataStatus | DataTableStateInput` — discriminated by
   `typeof state === 'string'`. Trivially disjoint, the string form is already
   slated for major-removal, no temporary name needed. Confidence: High.

   **As implemented, and the first real application of §1.4:** `state` is declared
   **exactly once** as the union in `data-grid-config/state.ts`, while
   `data-state.ts` keeps `state` in its `aliases` list only. Declaring it in both
   modules would have intersected to `never`. The alias machinery and the type
   declaration are separate concerns; only the declaration is exclusive.

**Done**
- `state`/`defaultState` reach the controller; the controller needs **no** change.
  Confirmed by F5 against source: all three §3.2 controlled/uncontrolled rules are
  already implemented in `useControllableDataTableSlice`, so this unit is exposure
  only — exactly as this plan assumed, now verified rather than assumed.
- A test proves a slice in both `state` and `defaultState` errors in
  development, and that a controlled slice requests without committing.
- The deprecated string `state` still works and still warns.
- Changeset: minor, with the `getRowId` migration note.

---

## 3. Wave 1 — feature fan-out

Each unit owns one `data-table-features/<feature>.ts`, one
`data-grid-config/<group>.ts`, its DataGrid chrome file(s), its
`props-<group>.types.test.ts`, its own tests and stories, and stages its
`ui-spec` scenarios and barrel exports for the integrator. **No unit opens a
spine file, a manifest file, or a policy-frozen file (§0.1).**

**Dispatch checklist — every Wave 1/2 unit confirms these before writing code.**
Six of these did not exist when the unit briefs below were first written; the
briefs name unit-specific scope, this names what is common.

1. **Read §1.7 for the nine contribution points**, and your own brief for which
   ones you use. A surface you cannot reach is an **escalation to F2** (the
   standing seam owner), never a workaround — seven such gaps have been found so
   far, four after the ADR was approved.
2. **Read §1.2** for F3's committed z-ladder, the pin hook being on `TableCell`
   as well as `TableHead`, and `data-bounded`. Do not invent z values.
3. **Read §1.4** before declaring a prop another group also reads — it
   intersects to `never`, it does not union.
4. **Registration is two steps** (below): fill the stub *including* the map
   augmentation, **and** stage the registry-index line.
5. **`generate:stories --check <your-component>` clean** (§6).
6. **Compile a throwaway consumer against the built `dist/index.d.ts`** (§6) —
   you augment a map, and that is the one failure mode passing every in-repo gate.
7. **Do not accept a TS1xxx-only typecheck as evidence** (§6) — a syntax error
   anywhere stops semantic checking project-wide. A fully clean run, or one
   reporting a TS2xxx elsewhere, is trustworthy.
8. **Nothing in §0.1** — the frozen companion suite is off-limits; the answer to
   asking is no.

**Registering a group is two steps, and you do both yourself.** F4's stubs
deliberately do **not** augment the registry maps, because a map entry *is* a
public prop and pre-declaring seven would ship seven props that silently do
nothing. So each Wave 1/2 unit (a) fills in its own stub — including the map
augmentation that makes its prop public — **and** (b) **applies** its registry-index
and barrel lines directly (§1.6 policy change: staging them would cost you
"typecheck clean" as a self-check). Doing only (a) leaves the module unregistered;
only (b) registers an empty module. **Sequence for the registry index: U3, then
U1, then U2** — one unit in that file at a time.

### U1 — `detailExpansion`
**Contribution points used:** `engineOptions`, `displayRows` (the `detail` kind),
`renderDisplayRow`, `renderContext`; DataGrid side `resolve`,
`controllerOptions`, `columns` (the expander column), `chrome`, `callbacks`
(`onDetailExpansionChange`).
**Owns** `data-table-features/detail-expansion.ts`, new
`data-grid-detail-expansion.tsx`, `data-grid-config/detail-expansion.ts`,
`__tests__/props-detail-expansion.types.test.ts`, its stories/tests.
**Depends on** F2, F4.
**Scope** full `DetailExpansionConfig` (`render`, `isExpandable`,
`mode: 'multiple'|'accordion'`, `reserve`), `onDetailExpansionChange`, the §7
ARIA ID scheme (`${tableId}--detail--${base64url(rowId)}`, `aria-controls`
emitted exactly when the display row is mounted), `ButtonIcon`/`Collapsible`
chrome.
**Done** `data-table/behavior.md:387-394` and `data-grid/behavior.md:228-234`
pass. Accordion labeled proposed-only.

### U2 — `tree` + lazy children
**Contribution points used:** `engineOptions`, `displayRows` (the `tree-status`
kind for lazy loading/error), `renderDisplayRow`, `renderContext` (depth,
`hasChildren`, lazy status), `rowPresentation` (`TableRow expanded`);
DataGrid side `resolve`, `controllerOptions`, `columns`, `chrome`, `callbacks`
(`onTreeExpansionChange`, `onTreeLoad` — the latter maps to no slice, so declare
it `null`).
**Owns** `data-table-features/tree.ts`, new `data-table-tree.ts` (the
`idle|loading(requestKey)|loaded|error(error,requestKey)` machine keyed by row
ID, **outside both expansion slices**), new `data-grid-tree.tsx`,
`data-grid-config/tree.ts`, `props-tree.types.test.ts`.
**Depends on** F2, F4. **Genuinely independent of U1** — that is ADR-0001's
payload. **Blocks** U4.

**Pagination semantics, decided before you start (ADR-0001 OQ-2).** Tree
descendants **do** consume pagination slots: `paginateExpandedRows` is `true`,
TanStack's default, and design §3.5 orders `tree expand -> paginate`. So a page
size of 25 on a tree grid renders 25 rows *including* an expanded parent's
visible children — not 25 roots. This resolves the opposite way from detail rows
(OQ-1), and deliberately: a detail row is a presentation of a record already on
the page, a tree descendant is a real record entering the row model before
pagination. Stated here because it changes what "page size" means and is much
cheaper to know now than to find in review.
**Two scope items are already true — U2 is smaller than earlier revisions of this
brief said.** Both proven by running, not reading:

- **Tree descendants already consume pagination slots**, via TanStack's default.
  `pageSize: 2` with a parent expanded and two children yields `['p1','c1']` with
  `p2` displaced; `pageSize: 4` yields `['p1','c1','c2','p2']`. So the Q7 ruling
  was a **confirmation of existing behaviour, not a change to implement**.
  `paginateExpandedRows` **stays unset deliberately** (documented at
  `data-table-features/tree.ts:22-24`) — writing the default explicitly would move
  `table.options.paginateExpandedRows` from `undefined` to `true` for zero
  behavioural gain.
- **Sibling-scoped sort already works natively.** `getSortedRowModel()` sorts per
  level: ascending yields `['a','a1','a2','b','b1','b2']` at depths
  `[0,1,1,0,1,1]`, where a flattening implementation would have given
  `1,2,10,20,100,200`. So `data-table/behavior.md:396-404` needs **a test, not an
  implementation.**

**Scope, as it actually remains:** the lazy-load state machine, the `tree-status`
display row, `getChildren` feeding `getSubRows`, stale-request rejection, and the
DataGrid half. Indentation comes from `row.depth` — **there is no dedicated
`cellPresentation` seam and you should not go looking for one**: express indent as
a row-level CSS custom property (via `rowPresentation`) consumed by a column
class, or through DataGrid's `renderCell`. `Spinner`/`Alert`/retry chrome is
DataGrid-side.

**`renderLoadError` is deliberately absent from `DataTableTreeConfig`** (verified:
`data-table-features/tree.ts:41-49` has `getChildren`, `loadChildren`, `indent`
only). It is a **renderer**, so it belongs to the DataGrid layer exactly as
`detailExpansion.render` does. Not an omission — do not file it as one.
**Done** `data-table/behavior.md:396-404`, `:247-253`, and
`data-grid/behavior.md:218-225` pass.

### U3 — `columnsFeatures`
**Contribution points used:** `engineOptions`, `columnPresentation` (widths, pin
offsets, **and `headerAdornments` for the resize handle and reorder grip**),
`renderContext` (header pin/size/order commands); DataGrid side `resolve`,
`controllerOptions`, `chrome` (view-options menu), `callbacks`
(`onColumnStateChange`).
**Owns** `data-table-features/columns.ts`, new `data-grid-column-settings.tsx`,
`data-grid-config/columns-features.ts`, `props-columns-features.types.test.ts`.
**Depends on** F2, F3, F4. **Blocks** U10.
**Scope** turn on `enableColumnPinning` and `enableColumnResizing` (**not**
`enablePinning` — deprecated in TanStack 8.21; see deviation 1 below) plus
`columnResizeMode`; apply `column.getSize()` widths and pin offsets through F3's
pin hook — **on `TableCell` as well as `TableHead`**, and using the committed
z-ladder rung for a pinned body cell (10) plus the `[&_th[data-pinned]]`
specificity step, both in **§1.2** — and F2's `columnPresentation`; **render the resize handle and
reorder grip as `ColumnPresentation.headerAdornments`** (F2 scope item 7 — that
is the header-cell seam, and it is the only sanctioned way to put chrome inside
`<TableHead>` without opening `data-table-view.tsx`); `fit`; `overflowTooltip`;
`lockSystemColumns`; §6.9 pin-beats-order; §6.10 explicit-size-beats-fit;
keyboard resize/reorder with live announcements; view-options
`DropdownMenu`/`Popover` + `Checkbox`, resize via `Resizable`.
**One unit, not four** — §6.9/§6.10 make the sub-features interact; splitting
gives three units that each need the other two's rules.

**Four ratified deviations, all corrections to stale contract text rather than
choices:**

1. **`enableColumnPinning` only.** `enablePinning` is deprecated in TanStack 8.21
   in favour of per-axis options, and row pinning is out of scope. This plan's and
   the contract's "`enableColumnPinning`/`enablePinning`" wording is stale.
2. **`columnResizeMode` defaults to `'onEnd'`, not TanStack's `'onChange'`.**
   `'onChange'` writes sizing state per pointer move and re-renders every row per
   frame. A `resizeMode` option opts back in for callers who want live width.
3. **§6.10 "explicit size beats fit" is unimplementable as written** —
   `column.getSize()` resolves through TanStack's 150px default, so **every**
   column reads as explicitly sized and the rule can never discriminate. The only
   honest signal is `columnDef.size !== undefined`, now exposed on the header
   context as `hasExplicitSize`. Worth flagging as a category: this is a spec rule
   that **could not be satisfied from the API it implies**, which is a different
   failure from a rule that is merely unimplemented. The design text needs
   correcting (Q8).
4. **`lockSystemColumns` resolves DataGrid-side into a plain `lockedColumnIds`
   list.** Verified: **no production `data-table` file imports from `data-grid`**,
   so the stub's suggestion to import the system-column id constants would have
   **inverted the layer direction**. Policy on the DataGrid side, ids to the
   engine — the same split this plan already uses for persistence.
**Done** `data-table/behavior.md:435-441` and `:444-449` pass.

### U5 — `footer` (whole-table summaries) — **HELD until BL-9 is fixed**

> **Do not dispatch yet.** `footer.sticky` is declared
> (`data-table-features/footer.ts:41`), documented, in this brief's scope, and in
> design §5.2 — and **unreachable**: `data-table-view.tsx:623` renders
> `<TableFooter>` with no props, `renderDisplayRow` returns the `<TableRow>`
> *inside* it, and `composeRowPresentation` (which does carry `sticky`) is called
> only from `renderRecordRow`. Fix routed to F2: add `stickyFooter` to
> `DataTableViewProps` and pass it at `:623`; U5 then supplies it through the
> existing `viewProps` contribution. One prop, one attribute — but U5 cannot ship
> its declared scope until it lands.
**Owns** `data-table-features/footer.ts`, new `data-grid-footer.tsx`,
`data-grid-config/footer.ts`, `props-footer.types.test.ts`.
**Depends on** F2 (the `footer` display-row kind + `renderDisplayRow`), F3
(sticky), F4.
**Scope** `FooterConfig` (`summaries` XOR `render`, `sticky`), the footer render
context, `TableFooter` rendering. The primitive already exists and is exported;
`DataTableView` simply never rendered it.
**Explicitly out of scope: group-scoped footers.** The design does not address
them. Do not invent them even if U4 has landed. Escalate if a story needs one.
**Done** `data-table/behavior.md:476-482` passes for the footer half.

### U7 — `filters` completion: `facet` **and** multi-column global search

Rescoped by the Q3 decision. One unit owns the whole `filters` group, because
both halves are what the `/data` route migration waits on and both land in the
same two files.

**Owns** `data-table-features/facets.ts`,
**`data-table-features/filtering.ts` (ownership transfers from F2 at the wave
boundary — F2 creates it, U7 owns it from Wave 1 on)**,
`data-grid-column-filters.tsx`,
`data-grid/__tests__/data-grid-filter-operators.test.ts` (NB-8),
`data-grid-config/filters.tsx` (note the extension — the plan said `.ts` for two
revisions), **`data-grid-config/toolbar.tsx`** (BL-11: it is unowned and it
*reads* `filters`, so U7's rework of the resolved filter shape requires it — a
coupling `data-grid-config/README.md:84-85` already documents),
`props-filters.types.test.ts`.
**Depends on** F2, F4.

**Scope, half 1 — faceted values.** Install `getFacetedRowModel`/
`getFacetedUniqueValues`/`getFacetedMinMaxValues` (all three
`'rejected-library-contract'` at `data-table-engine-options.ts:71-73` and never
installed); expose distinct values/counts and min-max from the **pre-filter**
row model; render the set-membership option list/chips. Shipped legacy parity
(`filterStats`).

**Scope, half 2 — `filters.global.columnIds` (Q3, decided by the user).**
Case-insensitive substring **OR** across the listed columns, with per-column
customization on column metadata (TanStack's per-column `globalFilterFn`) as the
escape hatch. The query descriptor stays `{ q, columnIds }` and therefore
serializable, so server mode keeps working — that plus keeping the escape hatch
where §5.2 already puts comparators and filter operators is why this beat a
`filters.global.match` function, whose non-serializability would have forced a
client/server asymmetry the design otherwise avoids.

**This is a `context/table-feature-parity-design.md` §5.2 `FiltersConfig`
amendment** — see Q8 for who carries it. It is what finally lets the `/data`
route express the four-field search it already performs
(`apps/demo/src/app/routes/data/DataTable.tsx:122-129`).

**Done** a DataGrid story renders faceted option counts; a second story shows one
query matching across several columns; server mode round-trips
`{ q, columnIds }` unchanged. Both halves are green before W3-INTEG's `/data`
migration starts.

### U8 — `server` completion
**Owns** `data-grid-config/server.ts`, `data-table-features/pagination.ts`,
`props-server.types.test.ts`, its tests/stories.
**Depends on** F2, F4. Independent of all seven P1 groups.
**Scope** the four missing `DataGridServerConfig` members (`hasNextPage`,
`hasPreviousPage`, `selection`, `onSelectionChange`), `pagination.unknownTotal`
and its invalid-combination rules, `selection.selectAll: 'all-results'` with the
application-issued token scoped to `queryRequestKey`.
**Note** P0.7 work by the plan's numbering, placed here because it is
independent and unblocks two P1 members.
**Done** the two P0.6 Gherkin scenarios pass, in particular "All-results
selection cannot cross a changed query".

### U9 — cheap plumbing bundle
**Owns** `data-grid-config/sorting.ts`, `data-grid-config/selection.tsx` (note
the extension), `data-grid-config/appearance.ts`, their type-test files.
**Depends on** F2 (NB-6 — the `DataTableView` box-prop pass-through), F3, F4.
**Scope** DataGrid-side pass-through of controller options that already exist:
`sorting.cycle`, `sorting.maxColumns`, `selection.reserve`. Plus the two members
the plan of record **wrongly** claims were delivered in P0.5 —
`selection.selectByRow` and `selection.selectAllOnIndeterminate` are absent from
`packages/ui-react` (verified; they appear only in
`ui-spec/components/data-grid/api.yaml:48-49` and `behavior.md:126,130`). Plus
the DataGrid half of F3's appearance cluster (`size`, `background`, `showHeader`,
`borders`, `height`, `maxHeight`, `stickyHeader`).
**Done** `data-grid/behavior.md:282-289` passes.

---

## 4. Wave 2 — dependent features

**Not a fresh wave (NB-7).** These roll out of Wave 1 as their own predecessors
land — U4 the moment U2 lands, U10 the moment U3 lands — not after Wave 1 fully
drains. Treat §3 and §4 as one rolling pipeline.

### U4 — `grouping`
**Owns** `data-table-features/grouping.ts`, new `data-grid-grouping.tsx`,
`data-grid-config/grouping.ts`, `props-grouping.types.test.ts`, **and —
pre-assigned rather than escalated — `data-table/data-table-contract.ts` and
`data-table/data-table-state.ts`.** U4 is the only claimant on those two: its
group-collapse slice is the sole new `DataTableState` slice in the plan (U2's
lazy-tree metadata sits outside both expansion slices in its own file; U6 is
presentation-only; U1/U3/U10 reuse existing slices). Adding it means the
interface plus the hand-listed `requiredSlices` array in
`data-table-contract.ts`, and the default in `data-table-state.ts`. The third
copy — `STATE_SLICES` in the controller — is derived by F2 scope item 9, so U4
does not open the controller.

**BL-12 note: this pre-assignment has been in the plan since rev 2b — the gap the
build review found is in the source READMEs, not here.** Neither
`data-table-features/README.md`'s 13-row ownership table nor
`data-grid-config/README.md` lists `data-table-contract.ts` or
`data-table-state.ts`, so a developer reading the registry docs rather than this
plan finds them unowned. **Routed to F2** (it owns that README). Confirmed
harmless in one respect: there is no exhaustive `Record<DataTableSlice, …>`
anywhere — the slice lists are partial `Set`s — so this is a single-claimant
unassigned file, not a total-record forcing function.
**Depends on** U2. Design §3.5/§6.6 requires grouping to classify **root rows
only** while each root's descendant tree stays attached, which presumes tree
relationships exist in the pipeline.
**Scope** install `getGroupedRowModel()` — never installed today, explicitly
`'rejected-library-contract'` at `data-table-engine-options.ts:75`, so
`grouping: ['status']` currently changes state and fires callbacks but renders
identically to ungrouped; `GroupingConfig` (`allowedColumns`, `renderGroup`,
`collapsible`, `sticky`, `selectionScope`, `ungrouped`); group-collapse state;
the `ungrouped` bucket; group-scoped selection over eligible leaves; sticky group
headers via F3.
**The row-model shape you inherit from U2, stated so you design against it rather
than infer it.** Tree descendants stay `kind: 'data'` with `depth` from
`row.depth`; U2 adds **no display-row kind beyond `tree-status`**, which hangs off
a parent via `displayRows` and never enters `getRowModel().rows`. So U4's
`classifyDisplayRow` sees descendants as **ordinary record rows at `depth > 0`** —
which is precisely what §6.6's "only roots are classified, descendant trees remain
attached" requires. Nothing extra is needed to satisfy that rule; the shape
already delivers it.

**Sub-decision, decided:** group-collapse state takes **its own slice**, not
`treeExpanded`. Group rows are synthetic and carry no record ID (§6.5), so a
row-ID-keyed slice invites collisions with real IDs.
**Done** `data-table/behavior.md:407-413`, `:415-421`, `:424-430` and
`data-grid/behavior.md:236-249` pass.

### U6 — `virtualization` — **HELD until BL-10 is fixed**

> **Held on two counts now.** (a) The `ScrollArea` constraint — §1.8 — with U6's
> brief open until F3's impact assessment lands. **The scroll container is
> `ScrollArea`-based**, so `containerRef` points at its viewport rather than a
> plain `overflow-auto` div, and `data-bounded` travels with whichever element
> carries the ref. (b) BL-10, below.
>
> **Browser-level verification is a requirement of this unit, not a nicety.**
> Sticky-ancestor breakage, stacking/containing-context changes and scrollbar
> geometry are invisible to DOM tests — F3 caught a real defect in a browser that
> no unit test saw. U6 does not ship on unit tests alone.
>
> **Do not dispatch yet.** Two of the body-window seam's six members are dead:
> `measureRow` and `scrollToRecord` are declared
> (`data-table-body-window.ts:49-54`) and never called from
> `data-table-view.tsx`. `measureRow` blocks `measure: 'dynamic'`, which this
> brief requires; `scrollToRecord` blocks the pre-declared `scroll-to-row` action,
> whose controller arm throws and which has no view→controller bridge. Fix routed
> to F2 — call `measureRow` from the row ref and the dispatch wrapper, and publish
> `scrollToRecord` through `DataTableRoot`. Until then the seam is decorative for
> exactly the two capabilities U6 needs most.

**Owns** `data-table/data-table-body-window.ts` (**replaces F2's identity
implementation** — this file is the seam, and owning it is what makes U6
disjoint), new `data-table-virtualization.ts`,
`data-table-features/virtualization.ts`, `data-grid-config/virtualization.ts`,
`props-virtualization.types.test.ts`.
**Depends on** F2, F3, U9 (the DataGrid-side `height`/`maxHeight`), **U1 and
U2**.

**U6 is smaller than the rest of this brief implies — two consumer-side findings
from F3, both verified here against source (and pending the reviewer's
confirmation as claims):**

1. **No new prop, and no `table.tsx` change.** NB-6 described a
   `containerRef`/`containerClassName` pass-through on `DataTableViewProps`. That
   pass-through **does not exist and is not needed**: `data-table-view.tsx` owns
   the ref itself (`:213`) and hands the *same* one to both
   `useDataTableBodyWindow({ containerRef })` (`:253-255`) and
   `<Table containerRef={containerRef}>` (`:480`). So **the scroll container
   already arrives in U6's arguments** when it takes over the seam file. NB-6's
   description is corrected: the implementation improved on the literal text, and
   this brief should stop promising a redundant pass-through.
2. **The bounded-height invalid combination is checkable against the DOM.**
   `containerRef.current?.dataset.bounded === 'true'` — `table.tsx:248,256` sets
   it whenever `height` or `maxHeight` is present. So design §5.1's
   "virtualization without `height` or `maxHeight`" can be a **real development
   error** rather than a config-shape guess. Use it. This is a better check than
   the design describes, and it exists only because F3 chose to make the
   precondition observable rather than implicit (§1.2). **No staged cut** — Q4 is decided: virtualization ships *with* the §7
focus-fallback policy, so U6 is a single unit and it is the last one to become
unblocked. It starts only once both expansion domains have landed.
**Scope, one delivery.** Fixed-height and measured-height windowing over
`@tanstack/react-virtual` (already a dependency, unused by data-table today);
`measureLayout()` and automatic layout observation — **dispatched through the
`measure-layout` and `scroll-to-row` members F2 pre-declared on
`DataTableToggleAction` (scope item 8), so U6 does not reopen the controller's
action union**; and the full §7
focus-fallback chain — pinned DOM row outside overscan, scroll-container
fallback, same-index/previous-last/toolbar chain, exactly one `data-reconcile`
event.
**Why not staged.** A fixed-height first cut would ship a published component
with a known focus gap, and this kit enforces `must`-severity accessible-name
and focus rules on itself — shipping a prop its own grammar would flag is not a
trade worth making for sequencing.
**Done** `data-table/behavior.md:229-235` **and**
`data-grid/behavior.md:262-272` pass. The second scenario encodes the whole §7
policy and is the single best acceptance target for the feature.

### U10 — `persistence` + presets hardening
**Owns** new `data-table-persistence.ts`, `data-grid-config/persistence.ts`,
`props-persistence.types.test.ts`.
**Depends on** U3 — the default `include` set is exactly the four column slices,
and pinning/resizing do not visually exist before U3.
**Layer split (decided).** The restore *engine* — read storage, validate,
migrate, call `requestChange(slice, value, 'restore')` per included slice —
belongs to **DataTable**; DataGrid supplies the config prop and defaults. It
follows the existing DataTable-owns-mechanics / DataGrid-owns-config split and
generalizes to direct DataTable composition. `'restore'` is already a
first-class `DataTableChangeCause` (`data-table-contract.ts:98`) that nothing
emits.
**Scope** the §8 envelope, restore-after-columns-normalize-before-interaction
(§6.13), controlled-slice exclusion, unknown-column-ID pruning, corruption/SSR
handling, and §5.2's no-live-row-state-by-default rule.
**Do not split** into a visibility-only early cut — the versioned envelope is
the bulk of the work either way.
**Done** `data-table/behavior.md:452-457`, `:459-467`, `:469-473` and
`data-grid/behavior.md:253-259` pass.

---

## 5. Wave 3 — integration tail (1 developer, strictly)

- **W3-INTEG** — the plan of record §6 "high-risk combinations", the `/data`
  route migration, and the `table-view` / `data-table-bulk-actions` pattern
  migrations. **The `/data` migration needs both halves of U7** — the `facet`
  metadata *and* the `filters.global.columnIds` semantics. The route's search box
  matches across four fields today, so facets alone do not unblock it; naming
  only facets here would let the migration start against a `filters` group that
  cannot yet express what the screen already does.
- **W3-DOCS** — one pass over `data-grid.docs.ts` for everything Waves 0–2
  added. No unit touches it before now; it is not bundled, has no test and no
  build step, and its only consumer is
  `apps/docs/content/docs/components/data-grid.mdx:250`, so freezing it costs
  nothing but stale docs. Candidate for `tech-writer`.
- **W3-CI** — add the repo-wide `generate:stories --check --all` step, deliberately
  held until now (§6): during the wave it would be red on legitimately unfinished
  work, which teaches people to ignore it.
- **W3-TIDY** — one deferral, accepted with reasons: `generate-stories.ts` imports
  `prettier` resolved from the **root** `node_modules` rather than a declared
  `packages/ui-spec` devDependency. Declaring it means a `pnpm install` and a
  `pnpm-lock.yaml` rewrite **mid-wave** — a collision on the single most shared
  file in the repo — for a marginal gain, and it fails loudly if it ever breaks.
  Declare it here, when a lockfile rewrite is cheap.
- **W3-FORMAT** — one `pnpm format` pass over the **48 pre-existing** offenders
  only (see §6 "Formatting"). Units fix the files they own as they land, so by
  W3 this should be the unrelated backlog and nothing else. Verify with
  `pnpm format:check` green and confirm the diff touches no file in any unit's
  `Owns` list; if it does, that unit missed one — ask, do not absorb it.
- **W3-VISUAL** — baselines, single owner, once. The Docker suite uses a fixed
  compose project name (`package.json:49` invokes `docker compose` with no `-p`
  and no `COMPOSE_PROJECT_NAME`), so concurrent runs collide. Runs **after**
  W3-FORMAT: formatting a story file can change rendered output.

  **A falsifiable expectation, not an eyeball pass.** F3 verified its
  regenerated `table.generated.stories.tsx` came out **byte-identical**: the
  generator only emits extra stories for `kind: pseudo` states and interactive
  transitions, and every state F3 added is `kind: prop`. So from F3, the pass
  should see churn from **exactly eight new stories**, and:

  > **If either of the two `table` generated stories, or the three pre-existing
  > `table` stories, produces a different PNG, that is a defect — not churn.**

  Investigate it rather than accepting the new baseline. Each later unit states
  its own expected churn the same way, so the pass has something to check
  against instead of approving whatever appears. A baseline pass that accepts
  everything verifies nothing.

  **The churn budget so far** — combine these into one check, not two passes:

  | Unit | Expected churn | Anything else is a defect |
  | --- | --- | --- |
  | F3 | eight new `table` stories | the 2 generated + 3 pre-existing `table` stories must be pixel-identical |
  | F4 | exactly three DataGrid stories — `ColumnFilters` and `GroupedConfig` (now opting into `toolbar={{ columnFilters: true }}`) and `ToolbarMembers` (new) | **every other DataGrid story must render identically** |

```bash
pnpm --filter @constructor-lab/ui-react storybook:test:visual:docker:update:all
pnpm --filter @constructor-lab/ui-react storybook:test:visual:docker:all
```

Review every changed PNG in light and dark. Expect churn from F3 (new Table
variants) and F4 (the toolbar-default change).

---

## 6. Operational rules for every unit

### 6.0 Four ways this programme has produced a false green

Counted because four instances is a pattern, and because each was investigated as
an isolated incident before anyone noticed the shape. **A green signal in a shared
checkout is a claim, not a fact.** All four are detailed below; this is the index.

| # | Mechanism | What it looked like |
| --- | --- | --- |
| 1 | A syntax error anywhere stops `tsc` checking **the whole project** | unrelated errors go quiet; a TS1xxx-only run dismissed as "a teammate's problem, my code is fine" |
| 2 | The story generator emitted **unformatted** source against Prettier-formatted committed files | every regeneration produced ~30 lines of noise per file, so real drift was indistinguishable from it |
| 3 | That generator **silently wrote an invalid identifier** | one defect, three symptoms, three separate investigations — and it was the *cause* of #1's worst instance |
| 4 | `typecheck: { enabled: true }` checked **zero files** and printed `no errors` | the naive fix for #1 was itself vacuous, and worse, because it manufactures positive evidence |

The general form, and the rule that follows: **a gate or a green run tells you
nothing until you have proved it can fail.** Before trusting a new gate, break
something on purpose and watch it go red — in a file you own (§0).



**Never run `pnpm -r test`.** `tools/style-dictionary`'s golden test builds into
the real committed `packages/tokens/{css,scss,js,dtcg}`; when `pnpm -r test`
aborts on another workspace's failure, pnpm kills it mid-clean and leaves those
directories deleted. Use:

```bash
pnpm --filter @constructor-lab/ui-react test
pnpm --filter @constructor-lab/ui-react typecheck
pnpm --filter @constructor-lab/ui-react lint
pnpm --filter @constructor-lab/ui-spec test
```

If those directories do go missing, they are committed —
`git checkout -- packages/tokens` restores them.

**`generate:stories` is now shared-checkout safe — and one of your Done items.**
This was a prohibition in earlier revisions because the generator took no
component filter, rewrote all 52 committed files and created four new ones. That
is fixed. It now takes component names, has `--check`/`--all`/`--list`/`--new`,
**defaults to check-only when invoked bare**, formats with the repo Prettier
config, and writes only when content differs.

- **Your Done criterion:** `generate:stories --check <your-component>` clean.
- **Do not** run `--all` in write mode during the wave, and do not create the
  four story-less components (below).
- Current baseline: `--check --all` reports
  `0 would change · 52 already up to date · 32 skipped`.

**Why regeneration churn used to be invisible, so nobody reintroduces it.** The
generator emitted **unformatted** source while the committed files are
Prettier-formatted, so *any* regeneration produced a ~30-line formatting diff per
file and real drift was indistinguishable from noise. Formatting with the repo
config plus write-only-on-difference is what makes the byte-for-byte claim above
verifiable at all. Any future emitter in this repo must do both.

**The drift gate, staged (closes NB-3).** NB-3 said generated stories would
silently go stale because nothing checked them. Something does now, and the
rollout is deliberate:

- **Per-unit Done criterion, effective now** — each unit shows `--check` clean for
  its own component.
- **Repo-wide CI step at the integration tail, not during the wave.** Three
  parallel units mid-flight on spec changes would trip a repo-wide gate on
  legitimately unfinished work, and a gate that is red for good reasons trains
  people to ignore it. W3 adds the CI step.

**Three hazards were one defect — the clearest illustration of why a shared
checkout amplifies small tooling bugs.** The generator's `cap()` only uppercased
the first letter, so a kebab-case transition id emitted
`export const Enter-character: Story = {` — invalid source, written silently.
That single bug produced three separate findings that were investigated as
unrelated:

1. an unformatted-churn problem that masked real drift;
2. a broken file sitting in the tree as `otp-field.generated.stories.tsx`, which
   is what made `tsc` **vacuous for every developer** (see the next hazard);
3. a report from the DataGrid developer that the team lead dismissed as
   non-reproducing — it was real.

One silent write, three symptoms, three investigations, one root cause. In a
solo checkout it is a broken file you notice immediately; with several agents
sharing a tree it is a team-wide false green.

**A gate that reports "no errors" has told you nothing until you have proved it
can fail.** The fourth distinct false-green mechanism this wave, and the sharpest:
`typecheck: { enabled: true }` alone checks **zero files** in this repo and prints
`Type Errors  no errors` while doing it. Cause, read out of the installed
vitest@4.1.7 rather than the documentation: `typecheck.include` defaults to

```
**/*.{test,spec}-d.?(c|m)[jt]s?(x)
```

and **not one of the 21 files carrying `expectTypeOf`/`assertType` in this repo is
named `*.test-d.ts`** — they are `*.types.test.ts`, `*-types.test.ts`, or in one
case a plain `*.test.ts` with no type marker at all.

So the naive fix for a vacuous gate **is itself a vacuous gate**, and it is worse
than the hole it closes, because it manufactures positive evidence. Before
trusting any new gate, **break something on purpose and watch it go red.**

**The Vitest typecheck gate, as ruled:**

| Setting | Ruling | Why |
| --- | --- | --- |
| `include: ['src/**/*.test.{ts,tsx}']` | every test file, **not** the type-test naming shapes | a pattern kept in sync with file names is exactly how this became vacuous; `data-table-engine-options.test.ts` carries type assertions with no marker in its name, so a shape-based pattern silently drops it |
| `ignoreSourceErrors: true` | ratified | Vitest's second signal covers **test-file** type errors; source errors stay `tsc`'s job, which already gates them. The alternative turns `pnpm test` red on every in-flight source edit and trains people to ignore the gate |
| enabled by default, not CI-only | ratified | a CI-only gate is discovered late, which is the same class of problem as no gate |

**The cost is asymmetric, and this is the part to know before you feel it.**
`tsc` typechecks the whole program regardless of how many files you target:

| Run | Before | After | Factor |
| --- | --- | --- | --- |
| Full suite | 9.8s | 16.55s | 1.7x — fine |
| **Single file** | **2.20s** | **8.16s** | **3.7x** |

The single-file number is the inner loop, including watch-mode re-runs. **The
escape hatch is `--typecheck.enabled=false`** — use it for a tight loop and let
the full run carry the gate. It is documented here precisely so that anyone who
needs the fast loop reaches for a flag instead of quietly editing the config,
which is how a gate dies six weeks after it lands.

*Cosmetic, so nobody files it as a bug:* reported counts double (1063 → 2070
tests, 134 → 267 files) because each file is counted as both a runtime and a
typecheck suite. Not duplicated execution.

**A syntax error anywhere stops `tsc` type-checking the whole project.** Not
"adds noise" — **stops**. Tested in an isolated two-file sandbox: with a syntax
error present, only the TS1005s are reported and a blatant
`const x: number = "string"` in the *other* file is never mentioned; delete the
offending file and the TS2322 appears immediately. The mechanism, verified in the
installed TypeScript 6.0.3 (`typescript.js`, `emitFilesAndReportErrors`):

```js
addRange(allDiagnostics, program.getSyntacticDiagnostics(...));
if (allDiagnostics.length === configFileParsingDiagnosticsLength) {
  ...
  if (allDiagnostics.length === configFileParsingDiagnosticsLength) {
    addRange(allDiagnostics, program.getSemanticDiagnostics(...));
  }
```

Semantic diagnostics are computed **only if there were no syntactic ones** —
and declaration diagnostics are gated by the same condition. So while one
syntactically invalid file sits anywhere in `packages/ui-react`, `typecheck` has
**stopped checking anything**; it is not merely red for the wrong reason.

**The dangerous symptom is that unrelated errors go quiet, which reads like
success.** Nobody suspects a passing or narrowly-failing typecheck. Three rules,
and note the second corrects an earlier revision of this plan:

1. **If typecheck fails somewhere you did not touch, re-run before
   investigating.** More likely a teammate mid-write than a real break. (This
   rule earned itself immediately: the team lead hit a transient error in a
   teammate's mid-write file and was one step from investigating a committed file
   that was fine.)
2. **A fully clean run IS trustworthy** — zero errors means zero syntactic *and*
   zero semantic. **The trap is the run that reports only TS1xxx** and gets
   dismissed as "a teammate's problem, my code is fine." It is not: nothing of
   yours was checked either. *(An earlier revision of this plan said a passing
   typecheck "may have checked nothing" and told units to take every reading
   twice. That was wrong and over-cautious — it would have had you distrusting
   good evidence. A green run is evidence; a TS1xxx-only run is not.)*
3. **A run reporting any TS2xxx error proves no syntax error was present** — a
   useful positive test a unit can cite to show its typecheck signal was real
   rather than assumed.

**Keep this as a standing hazard, not a resolved incident.** The specific
instance is closed at source — the story generator can no longer emit invalid
identifiers — but **the class is open**: any tool or agent writing TypeScript
into that tree can reintroduce it.

**The earlier false-green window is discharged.** A project-wide typecheck found
zero TS1xxx errors and live semantic diagnostics, so no unit needs to re-verify a
claim made during it.

**Shared-checkout verification hazard.** `typecheck` and `test` run over the
whole workspace, so your run will fail on a teammate's in-flight file. Read the
failure before assuming it is yours. Do not "fix" a file you do not own.

**Commit hygiene.** `.husky/pre-commit` runs **only** `pnpm run lint-staged` —
`eslint --fix` on staged `.ts`/`.tsx`/`.js`/`.jsx` under `apps/**`/`packages/**`
and `prettier --write` on staged `.json`/`.md`/`.yml`/`.yaml`. It rewrites the
files it touches, so **stage only files you own**.

**It does not run `typecheck`**, despite the root `husky` script chaining both.
`AGENTS.md` and `context/commits.md` previously documented it as hook step 2;
both are now fixed. The consequence is good news for a shared checkout and worth
being explicit about: **a teammate's broken typecheck cannot
block your commit.** So nobody needs `--no-verify` here, and nobody should reach
for it — if the hook fails, it is your own staged files that failed lint.

**Compile against the emitted declarations, not just the in-repo types.** Any
unit whose public type is **derived from an augmentable map** — the registry
`…Map` interfaces F4 introduced — must compile a throwaway consumer against the
built `dist/index.d.ts`, not only against `src`. F4 did this and it is what
proved declaration merging survives the build. This is the one failure mode that
**passes every in-repo gate**: `typecheck`, `lint` and `test` all read `src`,
where the augmentations are trivially visible, so a merge that the bundler drops
is invisible until a consumer hits it. Applies to F5 and to every Wave 1/2 unit
that augments a map (all of them, per §3's two-step note).

**Formatting.** `pnpm format:check` is red repo-wide (65 files) and CI runs it
(`.github/workflows/ci.yml:141`), so the final PR is red until it is dealt with.
The split matters for ownership:

- **48 files predate this programme** — `toast.tsx`, the `toolbar` family,
  `app-shell`, `prototypes/`, a `tools/token-emit` snapshot, `apps/demos`
  patterns. These are **W3's single formatting pass**, not any feature unit's
  problem.
- **17 files were created on this branch**, six of them in files F4 owns right
  now (`data-grid.tsx`, `data-grid-callbacks.ts`, `data-grid-column-filters.tsx`,
  and three of its test/story files), plus `data-table-controller.ts` and
  `data-table-view.tsx`. F4's new `data-grid-config/` files are failing in the
  working tree as well. **These are fixed by the unit that owns the file**, as
  part of its landing — they are already in its `Owns` list, and prettier is
  idempotent.

The rule in both directions: **format only what you make newly dirty; never
reformat lines you do not own.** W3 must not reach into a feature unit's files to
tidy them, and a feature unit must not "helpfully" format the 48 pre-existing
ones — that spans ownership boundaries by construction and would produce exactly
the whole-file rewrite the queue and the ownership map exist to prevent.

**Branch and PR strategy — decided (Q6): one long-lived `feat/table-parity`
branch, units land as their own reviewed commits, one PR at the end.** Per-unit
commits are what keep F1's landing SHA and F2's guard-commit SHA verifiable, so
**do not squash a unit's landing**. The reasoning:
`.github/workflows/visual-regression.yml` is triggered by an unqualified
`on: [pull_request]`, so it runs on a PR into **any** branch, including
`feat/table-parity`. With baselines deferred to W3-VISUAL, per-unit PRs would
each show a red required check for the whole build — and three agents each
staring at a red visual job is the most likely path to someone regenerating
baselines concurrently, which is the exact collision W3-VISUAL exists to
prevent. *Recommend:* **one long-lived `feat/table-parity` branch, units land as
reviewed commits, one PR at the end.** That matches how the branch is already
being used. If per-unit PRs are wanted for review granularity, the visual
workflow needs a gate (label or path filter) — a workflow change outside this
plan's scope and needing its own decision.

**Per-unit definition of done** (repo convention, on top of each unit's own
acceptance): source + Vitest tests under `__tests__/` + a Storybook story under
`__stories__/` covering the variants in light and dark + a changeset + a staged
`packages/ui-spec` scenario block for the integrator. Baselines are the one
exception — deferred to W3-VISUAL.

---

## 7. Honest sizing

The team lead asked for the truthful number, not the ambitious one.

| Stage | Sustained developers | Why not more |
| --- | --- | --- |
| **Wave 0** | **2** (3 briefly, at the start) | Three tracks start together, but **Track B idles after F3** (BL-7). Nothing in Wave 1 depends only on F3: U9 needs F2+F3+F4, and U7/U8 need F2 — the tail of Track A, i.e. precisely the long pole the fill was supposed to cover. Track C cannot pick up U9 either, since F5 sits between F4 and any fill. |
| **Waves 1–2** (one rolling pipeline) | **3** | Real, *conditional on ADR-0002 landing with its extended scope*. Without BL-1/BL-2/BL-3 closed it is 1 substantive developer plus U9 — the number ADR-0002's own "If rejected" section predicts. |
| **Wave 3** | **1, strictly** | Integration, docs, and a baseline pass that collides with itself if run concurrently. |

**Headline: 2 → 3 → 1.** Not 3 → 3 → 3.

**Staffing the 2 → 3 transition (BL-7).** Pinning the branch rather than leaving
it either/or: **Wave 0 runs with two developers, and the third is dispatched when
Wave 1 opens** — that is, when F2 *and* F4 have both landed, at which point U1,
U2, U3, U5, U7, U8 and U9 are simultaneously unblocked. Agent spin-up is cheap
enough that re-tasking beats parking a body through Wave 0. Track B's operator
finishes F3 and is released; they are not held for U9.

**One cost of running F5 concurrently with Wave 1.** Wave 1 opens at
`max(F2, F4)`, and F4 lands first because Track C is shorter — so Track C moves
on to F5 while Wave 1 starts. F5 owns `data-grid.tsx` and `data-grid-config/`
and rewrites `DataGridProps` into a discriminated union, while Wave 1 units are
adding config modules that feed that same type. There is no clobber (the files
are disjoint), but `pnpm --filter @constructor-lab/ui-react typecheck` is
unreliable for every Wave 1 unit until F5 lands. §6's shared-checkout rule covers
the symptom; count it as a real cost here. If it proves noisy, the cheaper fix is
to hold F5 until Wave 1's first units land rather than to slow Wave 1.

Three honest caveats on the middle number. Five concurrent Wave 1 units are
file-safe but stress the integrator (§1.6) and the reviewer; 3 is the
sustainable rate. The 3 assumes F4 absorbs its full extended scope — if it
cannot, the DataGrid half of every Wave 1 unit serializes and the middle number
drops toward 1.5. And the pipeline **narrows at its tail**: since the Q4
decision, U6 is unblocked only by U1 + U2 + U9, so it is the last unit to start
and will likely run alongside W3-INTEG rather than in parallel with two peers.

### 7.1 Genuinely independent vs. only looks it

(This table was §6 in rev 1; it moved here in rev 2 and one row changed with the
Q4 decision.)

| Looks independent | Actually |
| --- | --- |
| `detailExpansion` and `tree` | **Genuinely independent after ADR-0001** — that is the ADR's payload. Before it, hard-blocked on each other. |
| `virtualization`, minimal flat-row cut | **No longer exists as an option.** Q4 decided virtualization ships with the §7 focus-fallback policy, so U6 depends on F2 + F3 + U9 **and** U1 + U2. It is the most-blocked unit in the plan, not a parallel starter. |
| `footer` | Independent for whole-table summaries. **Group-scoped footers are unstated by the design** — if U4 lands first, do not let U5 invent them. |
| `columnsFeatures` sub-features (pin/resize/reorder/fit) | **Not separable.** §6.9 and §6.10 make them interact; four units would each need the other three's rules. One unit. |
| `filters` facet vs. global search | **Not separable, since Q3.** Both are `filters`-group members landing in the same two files, and the `/data` migration needs both. One unit (U7). |
| `persistence` visibility-only cut | Separable in principle, not worth it — the versioned envelope is the bulk of the work regardless. |
| `grouping` | **Not independent.** Depends on U2 for root/descendant semantics (§3.5, §6.6). |
| Adding any DataGrid prop | **Not independent** until F4 — the total-record `satisfies` at `data-grid.tsx:378-391` is a compile-time forcing function. |

---

### 7.2 Post-wave, individually assignable: four `RENDER` hints

**Not integration-tail work** — each needs someone to study one component, so
they are four small independent tasks rather than one tail item.

Four components have a spec but no committed generated story, and they are
**left alone for correctness reasons, not scheduling ones**:

| Component | Why it is skipped |
| --- | --- |
| `meter` | does not typecheck when generated — missing required props |
| `otp-field` | same |
| `autocomplete` | typechecks, but is a composable root that renders an empty box |
| `checkbox-group` | same |

So the old script would have **committed two files that break the build** and two
that produce blank visual baselines. Per-component diagnoses live next to
`RENDER` in `generate-stories.ts` and are surfaced by `--list`.

The task in each case is "supply the missing `RENDER` hint" — a required-props
sample for the first two, a meaningful composed child for the last two. Creating
the file also adds new visual-regression baselines, which is why the generator
requires naming a component explicitly as the deliberate authorizing act. **No
Wave 1/2 unit should pick these up in passing.**

## 8. Reserved slot S1

Surface-inventory items are placed: F5 (`getRowId` + `state`), F4 (toolbar
defaults), U7 (the whole `filters` group — facets plus global-search
semantics), U8 (server completion), U9 (cheap plumbing + the two
falsely-claimed selection members). The persisted artifact
(`researcher-surface.md`) carries a provenance note that nothing was re-verified
against source; the design-gate review spot-checked the load-bearing claims and
they hold. The one exception — the 39/10 `getRowId` census — has since been
measured twice and was wrong in both directions; see F5's entry for the corrected
figures and why the conclusion still holds.

The slot stays open for anything the persisted artifact contains beyond the
relay. Placement rule: a member needing only DataGrid pass-through joins U9; one
needing a controller option joins its group's `data-table-features/` module and
therefore its owning unit; one needing new `table.tsx` presentation is a
follow-up to F3 and must be sequenced after it, never concurrent.

---

## 9. Review-blocker disposition

| ID | Resolution |
| --- | --- |
| BL-1 controller unions stay contended | F2 pre-declares all seven keys, typed against feature-owned `…Config` interfaces. ADR-0002's scope boundary narrowed: key *declarations* in, identity *logic* out. |
| BL-2 no DataGrid equivalent | ADR-0002 widened to both layers; F4 rescoped to all eight sites, with `columns` and `chrome` contributions added. Explicit fallback if it does not fit. |
| BL-3 four contribution points insufficient | Fifth point `renderDisplayRow` added; F2 builds and ships the `data-table-body-window.ts` seam, U6 owns the file thereafter. **Rev 2b:** `ColumnPresentation` defined with a `headerAdornments` slot (U3's resize handle and reorder grip); F2 pre-declares `DataTableToggleAction` members (U6's `measure-layout`/`scroll-to-row`, U4's `toggle-group`); `STATE_SLICES` derived; `data-table-contract.ts` + `data-table-state.ts` pre-assigned to U4. |
| BL-4 no baseline for the safety net | "Unmodified relative to F1's landing commit"; F1 records the SHA in its handoff. |
| BL-5 safety net not load-bearing | Acceptance table rebuilt: `data-table.test.tsx` added, `data-table-state.test.ts` → `.tsx`, `data-table-controller-types.test.ts` added and assigned. Three pre-refactor guards required, with the ordering stated as part of the criterion. **Rev 2b:** F2's `Owns` split into "may modify" / "read-only guard"; the sorting assertions given a new file they own; F2 records a guard-commit SHA; the type test moved to additive-only. |
| BL-6 spec files and barrels shared | The integration queue (§1.6): manifest files, per-unit staging files, one named integrator. Plus the `index.yaml` rule from NB-4. |
| BL-7 sizing assumes blocked fill | §7 rewritten. Wave 0 is 2, not 3; Track B's idle stated plainly rather than papered over. **Rev 2b:** the 2 → 3 transition is staffed explicitly (Wave 0 runs with two; the third is dispatched at Wave 1 open), and the cost of running F5 concurrently with Wave 1 is counted. |
| BL-6 manifest list incomplete | **Rev 2b:** `anatomy.yaml` and `accessibility.md` added to the manifest files. |
| BL-2 scope not forced early | **Rev 2b:** F4's owner must report a go/no-go on the eight sites *before* implementing. It is the largest single risk to the middle sizing number. |

Non-blockers: NB-1 (ADR-0001 quotation corrected, OQ-2 raised), NB-2 (F1 names
`data-table.test.tsx`), NB-3 (F3 owns the generated stories), NB-4 (`index.yaml`
rule), NB-5 (`data-table-controller-types.test.ts` → F2), NB-6 (box-prop
pass-through → F2, U9 depends on F2; **its `containerRef` description later
corrected — see U6**), NB-7 (Waves 1–2 modelled as one rolling
pipeline), NB-8 (census measured and corrected in F5's entry; F4 owns the DataGrid
stories; U7 owns the filter-operators test; branch strategy raised as Q6).

---

## 10. Questions for the team lead

### 10.1 Closed

| # | Decision | Where it landed |
| --- | --- | --- |
| Q1 | ADR-0002 — conditional go, scope extended to both layers | ADR-0002; F2 and F4 throughout |
| Q2 | OQ-1 — a detail row does **not** consume a pagination slot | ADR-0001 "Decided"; implies a §3.5 amendment (Q8) |
| Q3 | Multi-column global search — **(a) + (c)**: case-insensitive substring OR across `columnIds`, per-column `globalFilterFn` on column metadata as the escape hatch. Decided by the user. Option (b)'s client/server asymmetry was the thing to avoid; the descriptor stays serializable as `{ q, columnIds }` | U7, rescoped to the whole `filters` group; implies a §5.2 `FiltersConfig` amendment (Q8) |
| Q4 | Virtualization ships **with** the §7 focus-fallback policy — no staged cut, schedule cost accepted | U6, now depending on U1 + U2; §7.1 row rewritten |
| Q5 | Toolbar defaults stay in Wave 0 (F4) | F4 "Also in scope" |
| Q6 | One long-lived `feat/table-parity` branch, one PR at the end; units land as their own reviewed commits, **not squashed** — that is what keeps F1's landing SHA and F2's guard-commit SHA verifiable | §6 "Branch and PR strategy" |
| Q7 | OQ-2 — tree descendants **do** consume pagination slots (`paginateExpandedRows: true`). Resolves opposite to Q2, deliberately: a detail row presents a record already on the page; a tree descendant is a real record entering the row model before pagination | ADR-0001 "Decided: OQ-2"; stated in U2's brief |
| Q8 | **Four** design-doc amendments assigned to tech-writer, not carried here: §3.5 pipeline order (before F2); §5.2 `FiltersConfig` (before U7); §3.1 `rowInteraction` — wholesale identity-bearing, but only `current` is (§1.5, already implemented, so the amendment brings the doc up to the code); and **§6.10 "explicit size beats fit"** — unimplementable as written, since `column.getSize()` resolves through a 150px default (before or with U3) | §1.5, U3 |

**All eight closed.** Nothing in the plan waits on a decision.

### 10.2 Raised by this pass

**Closed.** The scope change was re-confirmed: F4 absorbed eight of eight sites
including the sweep's additions, and the one item that could not be absorbed
(`data-table-toolbar.tsx`) was withdrawn as policy-frozen rather than deferred.
See F4's entry.

**One item for slot S1, not for a P1 unit.** `DataTableRenderStatus`
(`data-table-render-context.ts:15`) is `'loading' | 'empty' | 'loaded'` while
`DataGridDataStateConfig` carries a fourth status, `'error'`. That is an
inconsistency inside an already-shipped group rather than one of the seven.

# DESIGN gate review — table-parity-p1

- **Verdict:** **BLOCKED** — 7 blockers, 8 non-blockers.
- **Date:** 2026-07-27
- **Reviewed:** `.ai/plans/adr/ADR-0001-expansion-domain-row-model-ownership.md`,
  `.ai/plans/adr/ADR-0002-internal-feature-module-registry.md`,
  `.ai/plans/PLAN-table-parity-p1-decomposition.md`,
  `.ai/team/table-parity-p1/design/architect.md`
- **Checked against:** the working tree at `feat/table-parity` (clean, HEAD
  `88eaf6b`), and the installed `@tanstack/table-core@8.21.3` build output — not
  the ADRs' quotations of it.

**Headline.** ADR-0001 survives attack; its deciding fact is correct and its
render-layer consequence is *less* disruptive than the ADR claims, because
detail rows were never in the row model to begin with. ADR-0002's *design* is
sound but its **acceptance criterion is not**, and its **scope boundary
excludes the very lines Wave 1 needs**. The file-ownership partition is **not
disjoint**: five surfaces stay contended after Wave 0, three of them by
construction (a total-record `satisfies`, a hand-listed options union, and a
render body). The honest worker count today is closer to ADR-0002's own
"If rejected" numbers than to the plan's.

---

## Blockers

### BL-1 — `data-table-controller.ts:167-198` stays contended after Wave 0, by ADR-0002's own scope boundary

`PLAN-…-decomposition.md:42` claims `data-table-controller.ts` is "No" longer
contended if ADR-0002 lands. It is.

The controller's identity-gating options unions hand-list every feature key:

- `data-table-controller.ts:167-180` — `IdentityFreeOptions`, with
  `detailExpansion?: never`, `tree?: never`
- `data-table-controller.ts:182-193` — `IdentityOptions`, with
  `detailExpansion?: false | IdentityFeatureConfig` (`:185`) and
  `tree?: false | IdentityFeatureConfig` (`:186`)
- `data-table-controller.ts:232-238` — `DeprecatedDataTableControllerOptions`
  mirrors them with `?: never` so the deprecated branch rejects them

U1 replaces `IdentityFeatureConfig` at `:185` with `DetailExpansionConfig`. U2
replaces it at `:186` with `TreeConfig`. U4 adds `grouping`. U3, U5, U6 and U10
each add their config key to all three declarations. These are small edits to
the same twelve lines — and under the plan's own model ("two agents writing one
file clobber each other", `:20-22`) a small edit is a whole-file write.

ADR-0002 puts this out of reach on purpose: its scope boundary lists
"**Out:** … identity handling" (`ADR-0002:95-98`). The registry does not absorb
it.

**Smallest change that clears it.** Add to F2's scope and Done: F2 pre-declares
all seven remaining keys in `IdentityFreeOptions`, `IdentityOptions` and
`DeprecatedDataTableControllerOptions`, each typed against a `…Config`
interface that is *declared in and owned by* its own
`data-table-features/<feature>.ts`. A Wave 1 unit then fills in its own file and
never opens the union.

### BL-2 — `data-grid.tsx` has no ADR-0002 equivalent, and F4's stated scope does not reach what Wave 1 needs

`PLAN:46` claims `data-grid.tsx` is "No" longer contended after Wave 0 because
"features contribute via `data-grid-config/*`". Nothing establishes that.

Every Wave 1/2 unit that adds a grouped config key must touch, in
`data-grid.tsx`:

1. `DataGridGroupedConfig` — `:200-232` (the interface itself)
2. `GROUPED_CONFIG_ALIASES` — `:378-391`, declared
   `as const satisfies Record<keyof DataGridGroupedConfig<unknown>, readonly string[]>`.
   This is a **total record**: adding a key to the interface makes the file fail
   to compile until this const is updated. It is a compile-time forcing function
   that *guarantees* contention.
3. `ResolvedDataGrid` — `:339-367`
4. `resolveGroupedConfig` — `:482` onward
5. the destructure of resolved fields — `:806-846`
6. the `useDataTable({ … })` options assembly — `:998-1032`
7. `resolvedColumns` — `:876-934`, where U1's and U2's expander columns and U3's
   `lockSystemColumns` for `__select__` (`:899`) and the actions column
   (`:891-894`) must land
8. the JSX render body — `:1051-1147`, the only place U1/U2/U4/U5 chrome can be
   mounted

F4's scope (`PLAN:194-212`) covers (3) and (4) via "one resolver module per
existing group", plus the type-test split and the toolbar defaults. It says
nothing about (1), (2), (5), (6), (7) or (8). ADR-0002 is explicitly scoped to
`packages/ui-react/src/components/ui/data-table` (`ADR-0002:6`), so there is no
decision covering the DataGrid side at all.

This matters more than BL-1 because **every Wave 1 unit is defined as engine
half + DataGrid chrome** (`PLAN:273-276`). Fixing the controller and leaving
`data-grid.tsx` monolithic buys nothing for the fan-out.

**Smallest change that clears it.** Extend F4's scope and Done to (a) move
`DataGridGroupedConfig`, `GROUPED_CONFIG_ALIASES` and `ResolvedDataGrid` out of
`data-grid.tsx` into `data-grid-config/`, *derived from* the module registry
rather than hand-listed, and (b) give a config module two more contributions —
one that injects column defs and one that contributes rendered chrome to named
slots in the DataGrid body — so a Wave 1 unit's chrome mounts without opening
`data-grid.tsx`. If that is too large for one Wave 0 unit, say so and plan the
DataGrid half of Waves 1–2 as serialized regardless of ADR-0002.

### BL-3 — ADR-0002's four contribution points cannot express what U2/U4/U5/U6 need from `data-table-view.tsx`

The contribution interface is `engineOptions`, `displayRows`, `renderContext`,
`columnPresentation` (`ADR-0002:53-65`). ADR-0001's display-row union
(`ADR-0001:203-210`) declares kinds `group`, `tree-status` and `footer` that
carry **data but no renderer**, and none of the four points supplies one.

- U5 must render `<TableFooter>` for `kind: 'footer'`.
- U4 must render a group header row for `kind: 'group'`.
- U2 must render the loading/error row for `kind: 'tree-status'`.
- U6 must window the body — that replaces `rows.map(…)` at
  `data-table-view.tsx:216`. No contribution point can express wrapping the
  whole list. `PLAN:414` gives U6 `data-table-features/virtualization.ts` and a
  new `data-table-virtualization.ts`; neither can do it.

F2's scope (`PLAN:118-130`) lists feature modules only for *already-shipped*
features (sorting, filtering, pagination, selection, detail-expansion), so it
does not commit F2 to rendering the three unshipped kinds either. After F2
lands, `data-table-view.tsx` has no owner — and four units need it.

**Smallest change that clears it.** Add a fifth contribution point
(`renderDisplayRow?(row): ReactNode`) to ADR-0002's descriptor, and add to F2's
Done: (i) the view dispatches every non-`data` display-row kind through it, and
(ii) F2 builds the windowing seam — a single hook boundary around the body
render whose implementation U6 later replaces — even though F2 ships the
identity implementation.

### BL-4 — ADR-0002's safety net has no defined baseline, and one of the five files is guaranteed to change before F2 runs

"**Acceptance for this unit is: every one of those files passes unmodified.** A
diff to any of them is a signal the refactor changed behavior."
(`ADR-0002:159-161`, repeated at `PLAN:136-137`.)

F1 lands **before** F2 and must modify `data-table-controller.test.tsx` in at
least three places, each asserting exactly the binding ADR-0001 inverts:

- `:100-146` `installs row models only when their feature is enabled` — at
  `:135-145` it builds a hook with `detailExpansion: {}` and asserts
  `table.options.getExpandedRowModel` is a function. ADR-0001 moves that gate to
  `treeEnabled` (`ADR-0001:87-88`).
- `:253-277` `commits an uncontrolled request and keeps expansion namespaces
  separate` — `:274-276` asserts `table.getState().expanded` equals
  `{ 'person-1': true }`, sourced from `detailExpanded`. ADR-0001 sources it
  from `treeExpanded`, which the same test sets to `person-2`.
- `:399-416` `preserves TanStack ExpandedState=true as all core row IDs` —
  drives `table.options.onExpandedChange?.(true)` and asserts `detailExpanded`.
  ADR-0001 routes `onExpandedChange` to `treeExpanded`.

So "unmodified" can only mean "unmodified relative to the commit F1 lands". As
written, F2's sole acceptance criterion is unsatisfiable on its face, and a
developer reading it literally will either stall or quietly reinterpret it.

**Smallest change that clears it.** State the baseline explicitly in both
ADR-0002 and F2's Done: "unmodified relative to the tree as of F1's landing
commit", and have F1 record that commit SHA in its handoff.

### BL-5 — the safety net is not load-bearing at either hazard ADR-0002 names, and F1 destroys the one guard that exists

This is the direct answer to "is the coverage load-bearing where the refactor is
risky". It is not.

**Hazard A — the `onExpandedChange` closure.** `data-table-controller.ts:679-685`
reads `table.getCoreRowModel().flatRows` inside an option callback declared in
the same object literal that produces `table` (`:579`). It is TDZ-safe only
because the callback runs after construction. ADR-0002 correctly names it
(`:147-151`).

The **only** test that reaches that `flatRows` argument is
`data-table-controller.test.tsx:399-416`, and it does so by passing `true` —
the sole `ExpandedState` shape for which the argument is used at all
(`recordToSet(resolved, allIds)`). Every other path passes a record and never
touches `table`.

That test is one of the three F1 must rewrite (BL-4). If F1's replacement
asserts a record-shaped updater against `treeExpanded` instead of `true`, the
lazy-accessor guard is **gone before F2 refactors**, and a `FeatureContext` that
hands over an eager (`undefined`) table passes all five suites.

**Hazard B — the order-sensitive sorting option group.** Zero coverage.
`data-table-controller.ts:599-618` conditionally sets `getSortedRowModel`,
`enableMultiSort`, `enableSortingRemoval`, `sortDescFirst` and
`maxMultiSortColCount`. A grep for those four option names across
`data-table/__tests__` and `data-grid/__tests__` returns **nothing**.
`data-grid.test.tsx:180` renders `<DataGrid … multiSort />` but asserts rendered
behavior, not the option. A feature module that silently drops the
`sortingConfig?.cycle` pair (`:608-613`) or `maxMultiSortColCount` (`:614-616`)
passes all five named suites unchanged.

**A third gap in the file list itself.** `data-table.test.tsx` (344 lines) is the
**only** suite that characterizes the legacy expansion *render* end to end —
`:90-91` (both props), `:101` (`getRowCanExpand`-only), `:132`
(`renderExpandedRow`-only) — and it is **absent from ADR-0002's five**.
Meanwhile `data-table-root-view.test.tsx`, which *is* in the five and which F1
owns, contains **no expansion coverage at all**: grep for
`renderExpandedRow|getIsExpanded|toggleExpanded|canExpand` returns nothing. Since
F2 rewrites `data-table-view.tsx:216-379` into a display-row list,
`data-table.test.tsx` is the single most load-bearing suite for that refactor and
it is not in the acceptance criterion.

Also: the file named `data-table-state.test.ts` at `ADR-0002:158` does not
exist. It is `data-table-state.test.tsx` (467 lines — the line count is right,
the extension is not).

**Smallest change that clears it.** Three additions:
1. F1's Done gains: "the `ExpandedState === true` path is still driven through
   `options.onExpandedChange?.(true)` and still asserts every core row ID".
2. F2's Done gains: "option-level assertions for `enableMultiSort`,
   `enableSortingRemoval`, `sortDescFirst` and `maxMultiSortColCount` exist and
   were added *before* the refactor commit".
3. `data-table.test.tsx` joins the safety-net list; `data-table-state.test.ts`
   is corrected to `.tsx`.

### BL-6 — the `ui-spec` scenario files and the two barrels are shared, and the stated mitigation is not a mechanism

The per-unit definition of done (`PLAN:518-521`) requires each unit to land
"the `packages/ui-spec` scenario for the behavior implemented". Those scenarios
are not per-unit files:

- `packages/ui-spec/components/data-table/behavior.md` — U1, U2 and U4's
  scenarios all live in `## Expansion, tree, and grouping` (`:384-431`); U3, U5,
  U6 and U10's all live in `## Columns, layout, persistence, and footer`
  (`:432-491`).
- `packages/ui-spec/components/data-grid/behavior.md` — U1, U2, U4, U6 and U10
  all land in `## Advanced parity` (`:215-313`).

`PLAN:384-385` concedes the sharing but files it under *review* bottleneck
("Five concurrent workers is *file-safe* but not *review-safe*"). It is not
file-safe. That is the difference between "three workers are slower than ideal"
and "three workers lose each other's work".

Same problem, weaker mitigation, on the barrels. `PLAN:56-60` names
`data-table/index.ts` and `data-grid/index.ts` "append-only barrels every unit
wants" and prescribes "keep the edit to appended lines to minimize the clobber
window". Under one checkout with no merge step, an appended line is still a
whole-file write; "minimize the clobber window" is a hope, not a mechanism. And
`data-grid/index.ts:1-19` is a **single** `export { … } from './data-grid'`
block, so a new `DataGridGroupedConfig` member's type is not appendable at all.

**Smallest change that clears it.** Name a serialization rule for the three
shared text surfaces — e.g. each unit writes its scenarios to a per-unit staging
file and a single named integrator folds them into `behavior.md` at each unit's
landing; barrel exports are batched the same way. Anything is fine except
"append carefully".

### BL-7 — the plan's sizing assumes fill work that is blocked by the same bottleneck it is meant to absorb

`PLAN:76-77`: "Track A is materially longer than B and C. Expect B and C to
finish first and pick up U9, then U7/U8."

- U9 depends on F4 — which is on Track C, sequentially ahead of F5. Track C
  cannot pick up its own downstream unit while still running.
- U7 and U8 both depend on **F2** (`PLAN:342`, `:355`) — the tail of Track A,
  i.e. precisely the long pole the fill is supposed to cover.

So neither B nor C has anything to absorb their idle time. This is not a
scheduling nicety: it is the difference between three workers and one and a
half, and it compounds BL-1/BL-2.

**Smallest change that clears it.** Either identify fill work that depends only
on F3/F4, or state plainly that Tracks B and C idle at the end of Wave 0 and
size accordingly.

---

## Non-blockers

**NB-1 — ADR-0001's source quotation is materially incomplete, and the omitted
branch is load-bearing for the tree work the ADR enables.** `ADR-0001:42-53`
quotes `expandRows` only. The installed wrapper
(`@tanstack/table-core@8.21.3`, `build/lib/utils/getExpandedRowModel.js:15-25`)
also has:

```js
if (!paginateExpandedRows) {
  // Only expand rows at this point if they are being paginated
  return rowModel;
}
return expandRows(rowModel);
```

The ADR's conclusion survives (see "What I could not break", #1), but with
`paginateExpandedRows` defaulting to `true`
(`build/lib/features/RowExpanding.js:27`) expansion runs **before** the page
slice, so **tree descendants consume page slots**; with `false`,
`getPaginationRowModel` slices roots first and expands after
(`getPaginationRowModel.js:33-38`). `paginateExpandedRows` is
`'rejected-library-contract'` (`data-table-engine-options.ts:111`), so the
library owns the choice and nobody has made it. This is the tree-side twin of
OQ-1 and belongs next to it — `ADR-0001:147-149` rejects alternative E on the
grounds that "`paginateExpandedRows` is free under this decision", which is true
only once someone picks a value.

**NB-2 — F1's "P0.1 characterization tests pass unmodified" names no file.**
The tests that actually characterize legacy expansion are
`data-table.test.tsx:88-160`, which F1 does **not** own — good, that makes it a
real guard. But F1 *does* own the two files where a developer could satisfy a
vague criterion by editing it. Name the file in F1's Done.

**NB-3 — F3's Owns omits a file its own spec edit regenerates.**
`packages/ui-react/src/components/ui/table/__stories__/table.generated.stories.tsx`
is produced by `pnpm --filter @constructor-lab/ui-spec generate:stories` from
`table/api.yaml` + `anatomy.yaml`, both of which F3 owns and edits
(`PLAN:156`). There is no drift gate on generated stories (verified: nothing in
`packages/ui-spec/__tests__` or the workflows references them), so it will not
turn CI red — it will silently go stale, and W3-VISUAL will or will not pick it
up depending on whether anyone remembers.

**NB-4 — `packages/ui-spec/spec-index.json` has a hard drift gate that the plan
does not mention.** `packages/ui-spec/__tests__/spec-index.test.ts:14-22`
deep-equals the committed 71 KB `spec-index.json` against a fresh build. I
checked whether the plan's assigned spec edits trip it: `buildSpecIndex` reads
only `components/<name>/index.yaml` (`generate-spec-index.ts:111-115`), and no
unit is assigned an `index.yaml`. So it does **not** trip as planned. But any
unit that decides to bump `status:` or `since:` in an `index.yaml` — a natural
thing to do when shipping a target behavior — turns
`pnpm --filter @constructor-lab/ui-spec test` (a command `PLAN:503` tells every
unit to run) red for **everyone** until it is regenerated, and the regenerated
file is a single whole-file rewrite. One line of rule prevents it.

**NB-5 — `data-table-controller-types.test.ts` is unowned and multi-claimant.**
162 lines, and it is the compile-time guard for exactly the unions BL-1 is
about: `:42-53` asserts `detailExpansion` and `tree` are rejected without
`getRowId`; `:104-106` and `:136-153` pin the legacy combinations. U1, U2, U4
and F5 are all natural claimants. Assign it.

**NB-6 — nobody owns wiring `appearance` box props from DataGrid to `<Table>`.**
F3 adds `height`/`maxHeight`/`stickyHeader`/`size`/`background`/`borders` to
`table.tsx`; U9 adds the DataGrid-side config (`PLAN:376-378`). The only path
between them is `data-table-view.tsx`, which renders `<Table>` bare inside a
hardcoded wrapper (`:136-143`: `<div className="rounded-md border …">`) and
whose `DataTableViewProps` (`:33-85`) has no such props. F2 owns that file but
its scope lists only the class/style **resolver** cluster (`PLAN:139-140`), not
the box cluster; and U9 depends on F3 and F4, not F2. Net: U6's bounded-height
precondition is satisfiable at the primitive and unreachable from DataGrid.
Either widen F2's scope or make U9 depend on F2 and own the `DataTableView`
pass-through.

**NB-7 — Wave 2's "genuinely independent" is true of the units and false of the
schedule.** `PLAN:455` says U4, U6 and U10 are "genuinely independent of each
other". They are — but U4 depends on U2, U6 on F2 + F3 + U9 (and on U1 + U2 for
cut 2), and U10 on U3. All three dependencies sit in Wave 1, so Wave 2 cannot
begin until Wave 1 **fully** drains, not merely until its own predecessor lands.
And all three need `data-table-view.tsx` (BL-3). Wave 2 is 3 developers only
after BL-3 is resolved and only after Wave 1 completes as a whole.

**NB-8 — remaining unverified-but-treated-as-settled items.** The plan's own
Evidence line (`PLAN:12-13`) flags that the surface inventory arrived as a text
relay, and the persisted artifact carries a provenance note
(`researcher-surface.md:3-8`) that "nothing has been re-verified against the
source". F5, F4's toolbar change, U7, U8 and U9 all rest on it. I spot-checked
the load-bearing claims and they hold:

- `selectByRow` / `selectAllOnIndeterminate` absent from `packages/ui-react` —
  they appear only in `ui-spec/components/data-grid/api.yaml:48-49` and
  `behavior.md:126,130`. The plan's correction is right.
- `DataGridAppearanceConfig` is `{ striped?: boolean }` — `data-grid.tsx:146-148`.
  The plan's correction is right.
- The `/data` route's search box substring-matches `name|category|status|
  description` (`apps/demo/src/app/routes/data/DataTable.tsx:122-129`), derives
  `category` by uniquing (`:211-212`), takes `status` from a fixed list
  (`:49`), and uses no `DataGrid` at all. Q3's premise is correct.
- `table.tsx`'s blast radius (`PLAN:167`) — confirmed: `src/index.ts:95`,
  `data-table-view.tsx:17`, and three files inside F3's own directory.
- The Docker collision (`PLAN:477-480`) — `package.json:49` invokes
  `docker compose -f ./docker-compose.storybook.yml` with no `-p` and no
  `COMPOSE_PROJECT_NAME`, so the project name defaults to the fixed directory
  name. Concurrent runs do collide. Claim holds.

The one number I did **not** verify is the census "39 call sites omit
`getRowId`; 10 use a grouped config" (`researcher-surface.md:56-58`), which F5
sizes itself against — F5's scope is literally "the ~10 in-repo grouped-config
call sites" (`PLAN:232-234`). Confirm it before F5 starts.

Two smaller ownership gaps in the same family: F4's Owns omits
`data-grid/__stories__/data-grid.stories.tsx` even though its toolbar-default
change is a rendered behavior change with baseline impact and the repo DoD
requires a story; and U7's Owns includes `data-grid-column-filters.tsx` but not
`data-grid/__tests__/data-grid-filter-operators.test.ts` (67 lines), which
covers that surface.

Finally, `.github/workflows/visual-regression.yml` runs on **every**
`pull_request`. If units are PR'd individually, deferring all baselines to
W3-VISUAL leaves that check red for the whole build, and three agents each
seeing a red required check is the most likely way someone regenerates baselines
concurrently — the exact collision W3-VISUAL exists to prevent. Say whether the
work is one branch with one PR at the end, or per-unit PRs with a knowingly-red
visual job.

---

## What I tried to break and could not

Listed because a survived claim is worth as much as a broken one.

**1. ADR-0001's deciding fact — correct, verified in the installed source.**
`expandRows` at `@tanstack/table-core@8.21.3`
`build/lib/utils/getExpandedRowModel.js:27-42` walks `row.subRows` only; the
ADR's transcription of that function is faithful. `row.getCanExpand()` defaults
to `!!row.subRows?.length` (`build/lib/features/RowExpanding.js:149-156`) and
`paginateExpandedRows` defaults to `true` (`:27`) — both as the ADR states. In
this codebase detail expansion consumes exactly two things from the feature:
`row.getIsExpanded()` at `data-table-view.tsx:367` and `row.getCanExpand()` at
`data-table-render-context.ts:129-130`. The asymmetry between the two claimants
is real and the ADR's reading of it is right. (Subject to NB-1 on the omitted
wrapper.)

**2. ADR-0001's row-model consequence — safe, and safer than the ADR claims.**
The team lead asked whether moving detail rows out of the row model breaks
anything depending on them being in `getRowModel().rows`, `flatRows` or
`rowsById`. **They were never there.** Detail rows are appended by the view at
`data-table-view.tsx:367-376`, inside the same `<Fragment key={row.id}>` as
their parent record row. I checked each named consumer:
- selection — `row.getIsSelected()` is per record row (`:217`), and DataGrid's
  select-all header uses `table.getIsAllPageRowsSelected()` /
  `getIsSomePageRowsSelected()` (`data-grid.tsx:907-911`), both over the row
  model. Unaffected.
- `emptyColSpan` — `:189` and `:383` compute from `getVisibleLeafColumns()`.
  Unaffected. The detail row's own `colSpan={row.getVisibleCells().length}`
  (`:371`) is per-parent. Unaffected.
- existing tests and the §7 ARIA targets — no current test or DOM contract reads
  detail rows out of the row model.

**One thing that *is* affected and the ADR does not name:** keyboard roving
focus. `setCurrentAndFocus` indexes `rows` positionally (`:117-124`) and
`rowIndex` (`:216`) is the record-row index. If the view iterates a display-row
list, arrow navigation must keep indexing **records**, not display rows. The
only arrow test (`data-table-root-view.test.tsx:414-430`) renders a table with
no detail rows and cannot catch the regression. Cheap fix: F1 or F2 adds an
arrow-nav-over-an-expanded-row test. I am listing this here rather than as a
blocker because it is one test, not a structural problem.

**3. `table-family-public-types.test.ts` can genuinely stay untouched by F1, F2
and F3.** I tried to find a path that forces an edit and could not. The
`TableHeadProps`/`TableRowProps` assertions are `Pick`-based (`:102-117`), so
F3's additive props do not break them. The exhaustive `keyof DataTableProps` at
`:17-27` is real but `DataTableProps` is a frozen compatibility adapter
(`data-table.tsx:14-22`, `:45-85`) that no unit extends. `DataTableRowContext`
(which F1 changes) and `DataTableViewProps` (which F2 changes) are not pinned
anywhere in the file. The only exhaustive assertion at risk is the DataGrid one
at `:42-81` — which is exactly what F4 targets. The plan is right about this
file, with one omission worth a line: `:82-84` pins `state` (the plan says so)
and `:85-87` also pins `onRowClick`, which F5's deprecated-alias work touches.

**4. No call site combines `getSubRows` with the legacy expansion props.** The
ADR's grep result reproduces exactly. `getSubRows` appears only in
`data-table-controller.ts` (`:175`, `:190`, `:238`, `:584-588`),
`data-table-engine-options.ts:81`, `data-table-controller.test.tsx:346`,
`data-table-controller-types.test.ts:55,104,153`,
`data-table-recipes.stories.tsx:106`, and `apps/docs/…/data-table.mdx:156,160`.
I additionally confirmed that the two recipes stories that use tree/group row
models (`TreeMode` at `:101-113`, `RowGroups` at `:166-177`) call `useReactTable`
**directly**, not `useDataTable` — so ADR-0001 will not move their visual
baselines.

**5. No public escape hatch exposes the expansion binding, so ADR-0001 cannot
break a caller through `engineOptions`.** Every expansion-related TanStack option
is `'rejected-library-contract'` in `data-table-engine-options.ts`:
`enableExpanding:52`, `getExpandedRowModel:70`, `getIsRowExpanded:76`,
`getRowCanExpand:78`, `getSubRows:81`, `manualExpanding:87`,
`paginateExpandedRows:111`. The only caller-settable keys are the six `debug*`
entries (`:42-47`) and `renderFallbackValue` (`:112`), none of which the
controller literal sets — so ADR-0002's duplicate-key throw will not misfire on
`normalizedEngineOptions` at `data-table-controller.ts:589` either.

**6. `packages/ui-react/src/index.ts` is not contended.** It re-exports the three
barrels with `export *` (`:28`, `:29`, `:95`), so no unit has to edit the root
barrel. (The per-component barrels still are — BL-6.)

**7. Freezing `data-grid.docs.ts` is safe.** Its only consumer is
`apps/docs/content/docs/components/data-grid.mdx:250` via `AutoTypeTable`. No
test, no build step, not bundled (`data-grid.docs.ts:1-9`). Stale docs until
W3-DOCS, nothing red. The plan's rule is correct and costs nothing.

**8. All three of the plan's corrections to its inputs are right.** Verified
independently: the P0.5 selection claims, the `appearance` bounded-height claim,
and the `data-grid.tsx` contention claim — see NB-8 and BL-2.

---

## What this implies for Q1 (the go/no-go)

Not a recommendation on the decision — an observation about what the numbers
currently are, since Q1 is framed as a worker count.

ADR-0002 as scoped resolves the `useReactTable` option-literal contention and
nothing else. BL-1 shows the controller's options unions stay contended; BL-2
shows `data-grid.tsx` is untouched by any decision; BL-3 shows
`data-table-view.tsx` has no owner after F2 and four claimants. Until those
three are closed, accepting ADR-0002 yields roughly the worker count its own
"If rejected" section predicts (`ADR-0002:169-176`): one substantive developer
through Waves 1–2, plus U9 as fill — with U7 and U8 joining the queue for the
reason that section already gives.

The three clearing changes are additive to ADR-0002 and F2/F4's scope, not a
different architecture. Routing them to the architect should be cheap.

---
---

# Second pass — re-check of BL-1 … BL-7 against rev 2a

- **Date:** 2026-07-27
- **Scope:** the seven blockers only. Nothing cleared in the first pass was
  re-litigated; the non-blockers were checked only where a blocker's fix moved
  them.
- **Re-read:** all three artifacts at rev 2 / 2a, plus the working tree at HEAD
  `88eaf6b`.
- **Verdict:** **5 cleared, 2 partially cleared.** One of the two — **BL-5** —
  should be fixed before developers start; it is a two-line correction, not a
  redesign.

| ID | Rev-1 finding | Rev-2a status |
| --- | --- | --- |
| BL-1 | controller options unions stay contended | **Cleared** |
| BL-2 | no DataGrid equivalent of ADR-0002 | **Cleared** (one scheduling caveat) |
| BL-3 | four contribution points insufficient | **Partially cleared** — two new instances of the same shape survive |
| BL-4 | safety net has no baseline | **Cleared** |
| BL-5 | safety net not load-bearing | **Partially cleared** — the fix contradicts itself in three places |
| BL-6 | shared spec files and barrels | **Cleared** |
| BL-7 | sizing assumes blocked fill | **Cleared** (one staffing gap) |

---

## BL-1 — **Cleared**

`ADR-0002:145-149` moves "the config-key declarations in the three options
unions (`:167-180`, `:182-193`, `:232-238`)" **In**, and narrows the exclusion to
identity *logic* (`:157-159`). `PLAN:158-160` gives F2 those exact line ranges,
and `PLAN:186-190` states the mechanism: F2 writes the key, typed against a
`…Config` interface *declared in and owned by* its own feature module.

**This is a mechanism, not an instruction.** The union holds a type reference;
the referenced interface lives in the unit's own file. U1 changing
`DetailExpansionConfig`'s body never reopens `data-table-controller.ts`. Type-only
circular imports between the controller and `data-table-features/*` are legal in
TypeScript, so the seam holds.

`PLAN:48` correctly restates the spine row. `PLAN:167-168` requires stubs for all
seven, which is what makes the pre-declaration compile.

One wording nit, not blocking: the stubs are described as "**empty** stubs" but
they cannot be empty — each must export its `…Config` interface or the union has
nothing to reference. Worth one clarifying word in F2's brief.

## BL-2 — **Cleared**, with a scheduling caveat

`ADR-0002:10-13` widens the ADR to both layers with the right reason.
`ADR-0002:93-107` defines `DataGridConfigModule` with the two contributions the
gap needed — `columns` and `chrome`. `PLAN:291-310` walks all eight sites I
listed and assigns each a mechanism.

I checked the two places this could look fixed without being fixed:

- **The total record.** `ADR-0002:113-126` moves `DataGridGroupedConfig`,
  `GROUPED_CONFIG_ALIASES` and `ResolvedDataGrid` into `data-grid-config/` and
  derives them, using per-module `declare module './registry'` interface
  augmentation. Declaration merging works across files without editing a shared
  one, and it only takes effect once the module is in the compilation — which
  happens when the integrator adds the registry line (`PLAN:66` makes
  `data-grid-config/index.ts` a manifest file). Those two decisions are
  consistent with each other, which is easy to get wrong and was not.
- **The totality guarantee is not lost.** My worry was that deriving
  `GROUPED_CONFIG_ALIASES` from the registry would drop the
  `satisfies Record<keyof DataGridGroupedConfig, …>` forcing function that makes
  every new group preset-addressable. `ADR-0002:97` declares
  `readonly aliases: readonly string[]` as a **required** member of
  `DataGridConfigModule`, so a module cannot omit it. The guarantee survives in a
  different place.

**Caveat — the discovery point is late.** `ADR-0002:14-16` rates the effort
"Low-Medium", and both `ADR-0002:206-210` and `PLAN:323-325` give an honest
fallback ("say so, serialize the DataGrid half"). But every Wave 1 unit depends
on F4 (`PLAN:388`, `:414`, `:429`, `:449`, `:480`, `:493`), so if F4's owner
discovers mid-build that eight sites do not fit one unit, that discovery lands
after Wave 0 has spent its budget and Waves 1–2 cannot open at 3. Asking F4's
owner for a go/no-go on the eight sites in their first working session, before
writing code, converts a late surprise into an early one. That is a scheduling
change, not a design change.

## BL-3 — **Partially cleared**

The two gaps I named are closed:

- `renderDisplayRow` is the fifth contribution point (`ADR-0002:68-70`), and
  `PLAN:216-218` adds the right teeth — an unhandled kind must fail loudly rather
  than render nothing.
- `data-table-body-window.ts` (`ADR-0002:83-89`, `PLAN:164-165`) is a genuine
  mechanism: F2 ships the identity implementation, U6 **owns the file**
  thereafter (`PLAN:532-534`). Ownership transfer of a whole file is exactly the
  right shape for a wrapping concern that cannot be a per-row contribution.

**Two instances of the same shape survive, both verified against source.**

**(a) Header-cell chrome has no seam.** U3's scope requires "resize via
`Resizable`" and keyboard reorder (`PLAN:420`). A resize handle and a reorder
grip render *inside* `<TableHead>`, which `data-table-view.tsx:163-179` builds
with fixed children (`{label}`). The available seams do not reach it:

- `ColumnPresentation` (`ADR-0002:74`) is described only as "width, pin offset,
  …" and is never defined. Whether it may carry a rendered node is unstated.
- F3 gives `TableHead` a "pin-offset hook" and native `scope` (`PLAN:251`) — no
  adornment slot.
- `DataGridConfigModule.chrome(slot, …)` mounts "into a named slot in the
  **DataGrid body**" (`ADR-0002:105`). A header cell inside `DataTableView` is not
  a DataGrid body slot.
- `DataTableViewProps.renderHeader` (`data-table-view.tsx:40-43`) exists but is a
  caller-facing projection that `data-grid.tsx:1084-1135` does not pass, and U3
  cannot open `data-grid.tsx`.

So U3 currently has no way to render its own header chrome without opening a
spine file. **Smallest fix:** one line in F2's scope stating whether
`ColumnPresentation` may carry header-cell adornments and that the view renders
them — or a sixth point.

**(b) `DataTableToggleAction` is the options-union problem in a second union.**
Verified: `data-table-controller.ts:265-279` declares exactly `select-row`,
`select-all`, `clear-selection`, `expand-row`, `set-current-row`, and the `toggle`
switch at `:845-876` implements those five. U6's scope requires `measureLayout()`
(`PLAN:544-545`), which is a controller action and must be added to both. F2's
pre-declaration covers the **options** unions only (`PLAN:186-190`); the action
union is named nowhere, in either artifact. U4's group-collapse may need one too.

**Smallest fix:** extend F2's pre-declaration to the action union — add the
members the plan's own units require (`measure-layout`, and a group-collapse
action if U4 needs one) — or assign `data-table-controller.ts:265-279` + `:845-876`
an explicit sequence.

*Related, and unassigned rather than contended:* U4's decided "own slice" for
group collapse (`PLAN:525-527`) requires editing `DataTableState`
(`data-table-contract.ts:32-46`), the hand-listed `requiredSlices` runtime array
(`:49+`, which `DataTableSlice = keyof DataTableState` at `:91` does not cover),
and `data-table-state.ts:69-72`. F1 is told not to touch either file
(`PLAN:120-121`) and no unit claims them. Single claimant, so not a clobber —
but pre-assigning them to U4 saves a round trip through the escalation path.

## BL-4 — **Cleared**

`ADR-0002:229-233` defines the baseline as F1's landing commit and names the three
tests F1 legitimately rewrites (`:100-146`, `:253-277`, `:399-416`) — the same
three I found. `PLAN:146-147` makes recording the SHA an F1 Done item, and
`PLAN:205-207` restates the baseline in F2's Done. A reviewer can check this with
one `git diff <sha>..HEAD -- <paths>`.

## BL-5 — **Partially cleared. Fix before committing developers.**

Four of the six defects are genuinely fixed, and the fixes are specific:

- `data-table.test.tsx` added to the acceptance table with the correct reason
  (`ADR-0002:240`).
- `data-table-state.test.ts` → `.tsx` (`ADR-0002:242`).
- `data-table-controller-types.test.ts` added (`ADR-0002:245`).
- `data-table-root-view.test.tsx` explicitly annotated "has **no** expansion
  coverage — do not treat it as one" (`ADR-0002:241`). Good.
- Hazard A is preserved by an F1 Done item that is checkable by reading one test:
  "still driven through `options.onExpandedChange?.(true)` and still asserts every
  core row ID" (`PLAN:136-139`). I re-verified this is still the right guard after
  ADR-0001: `recordToSet`'s second argument — the `table.getCoreRowModel().flatRows`
  read — appears at `data-table-controller.ts:681` and nowhere else (`:677` passes
  one argument), and rebinding the handler to `treeExpanded` does not change that.
  The guard stays single-pointed and stays meaningful.
- Hazard B's zero-coverage finding is restated with the ordering requirement in
  words, in both artifacts (`ADR-0002:258-264`, `PLAN:208-214`).

**But the ordering requirement is contradicted, unenforceable, and homeless.**
The team lead asked me to be hard here, so:

**1. The criterion and the ownership grant say opposite things about the same
files.** `ADR-0002:235` requires the seven listed suites to pass **unmodified**.
`PLAN:174` puts "the data-table test suites listed in ADR-0002's acceptance table"
in F2's **Owns** list — and `PLAN:27` defines Owns as "files this unit may create
or modify." The same trap as BL-4, in a new place: a criterion that says "do not
change these" paired with a grant that says "you may change these." The same
collision appears in miniature at `PLAN:172`, which gives F2
`data-table-controller-types.test.ts` while `ADR-0002:245` lists it as
unmodifiable.

**2. Satisfying F2's Done item 2 violates F2's Done item 1.** `PLAN:208-214`
requires four new option-level assertions before the refactor commit but names no
file. The obvious home is `data-table-controller.test.tsx` — it already holds
"installs row models only when their feature is enabled" (`:100-146`), the nearest
existing assertion of the same kind. That file is first in the unmodifiable table.
As written, the two Done items cannot both be met.

**3. "Before the refactor commit" is not checkable on a squashed landing.**
`ADR-0002:264` says "in a commit that precedes the refactor commit" — right
intent, and `git log --oneline -- <test> <source>` verifies it *if the landing has
at least two commits*. Nothing requires that. `PLAN:637` says "units land as
reviewed commits" but does not forbid squashing, and `.husky/pre-commit` is
indifferent. F1 must record its landing SHA (`PLAN:146-147`); F2 has no equivalent
obligation for the guard commit — which is the one place the ordering could be
pinned to something a reviewer can check without trusting the author.

**Smallest change that clears it** — three lines, no redesign:

1. F2's Done item 2 names a **new** file for the four sorting assertions (e.g.
   `__tests__/data-table-engine-option-groups.test.ts`), which F2 owns, so the
   unmodifiable set stays unmodifiable.
2. F2's Owns list splits into "may modify" and "**read-only guard** — ADR-0002's
   acceptance table", moving those seven suites (and
   `data-table-controller-types.test.ts`) to the second heading.
3. F2 records the guard-commit SHA in its handoff, exactly as F1 records its
   landing SHA, so "the guard preceded the refactor" is a checkable fact rather
   than an assertion by the author.

## BL-6 — **Cleared**

`PLAN:57-93` replaces "append carefully" with an integration queue: a fixed set of
manifest files no unit opens, per-unit staging files at
`.ai/team/table-parity-p1/integration/<unit-id>.md` (per-unit names, so no
collision among the staging files themselves), and one named integrator applying
them in a single pass. **That is a mechanism** — it converts N concurrent writers
into one serialized writer, which is exactly what the shared checkout requires.

The manifest list covers everything I found, including the two I flagged
specifically (`data-grid/index.ts:1-19` is called out as a single non-appendable
export block, `PLAN:67-69`), plus the NB-4 `index.yaml` rule with the right
reasoning (`PLAN:85-93`).

`PLAN:82-83` ("Units never wait on each other; they wait on the integrator") is
mildly optimistic — waiting on a serialized integrator is waiting on each other,
transitively — but `PLAN:663-665` concedes the integrator is a stress point at
five concurrent units, so the cost is named somewhere.

Two small omissions from the manifest list, worth adding rather than discovering:
`packages/ui-spec/components/*/anatomy.yaml` (F3 edits table's via the queue at
`PLAN:240-241`, but the file type is not listed; U1/U2/U4/U5 add chrome parts to
`data-grid/anatomy.yaml`, 188 lines, multiple claimants) and
`packages/ui-spec/components/*/accessibility.md` (U1's ARIA ID scheme and U3's
keyboard announcements both land in `data-table/accessibility.md`, 90 lines).

## BL-7 — **Cleared on the numbers, one staffing gap**

`PLAN:651-669` and `architect.md:61-73` state 2 → 3 → 1 with the reason I gave:
Track B idles because nothing in Wave 1 depends only on F3, and the rev-1 fill was
blocked by the long pole it was meant to cover. `PLAN:508-510` models Waves 1–2 as
one rolling pipeline (NB-7), and `PLAN:667-669` names the tail narrowing at U6.
All of that is accurate.

**The gap.** `PLAN:657` resolves Track B's idle with "Track B's operator should be
re-tasked outside this plan, or Wave 0 run with 2." Both branches leave two bodies
at the end of Wave 0. `PLAN:658` then claims 3 for the middle. The transition from
2 to 3 is not staffed anywhere — either the third body idles through Wave 0 (in
which case Wave 0 is 3-with-one-idle, not 2) or it is re-tasked away and has to
come back. For agents that is cheap, but the plan should say which, because it is
the difference between "2 → 3" and "3 → 3 with visible slack".

**One cost the sizing does not count.** Every Wave 1 unit depends on **both** F2
and F4, so Wave 1 opens at `max(F2, F4)`. F4 lands first (Track C is shorter), so
Track C moves to F5 — and F5 owns `data-grid.tsx` and `data-grid-config/`
(`PLAN:339`) and rewrites `DataGridProps` into a discriminated union
(`PLAN:351-357`) while Wave 1 units are adding config modules that feed that same
type. No clobber (units own distinct files), but `pnpm --filter … typecheck` is
unreliable for every Wave 1 unit until F5 lands. `PLAN:622-624` anticipates the
symptom generically; §7 does not count it as a cost of running F5 concurrently.

---

## Straight answer on the sizing

**Yes, 2 → 3 → 1 is honest — materially more honest than 3 → 3 → 3 — and the
middle 3 is real but conditional, with the condition correctly stated.**

What I checked. Wave 0 is genuinely 2 sustained: three tracks start, F3 finishes
first, and no Wave 1 unit depends on F3 alone (U9 needs F2 + F3 + F4, U7/U8 need
F2). Wave 1 opens when F2 and F4 have both landed, at which point U1, U2, U3, U5,
U7, U8 and U9 are all simultaneously unblocked — seven units, and file-disjoint
for at least three. Three large ones (U1, U2, U3) plus two medium (U5, U7) is
enough real work to sustain 3 through the middle. The tail is genuinely 3-wide
too (U4 after U2, U10 after U3, U6 after U1 + U2 + U9). Wave 3 is 1 for the
reasons already verified — the Docker compose invocation carries no `-p`
(`package.json:49`), so a concurrent baseline pass collides with itself.

Two things that could pull the middle number down, in the order I would worry
about them:

1. **F4.** If it cannot absorb eight sites, the DataGrid half of every Wave 1 unit
   serializes and the middle drops toward 1.5. The plan says so
   (`PLAN:666-667`); what it does not do is force the answer early. See BL-2.
2. **Staffing the 2 → 3 transition.** See BL-7.

I would plan for 3 and treat 2 as the number to fall back to if F4's owner reports
the scope does not fit. I would not plan for more than 3: five is file-safe but
`PLAN:663-665` is right that the integrator and the reviewer become the limit.

---

## What to fix before starting

In priority order. All are wording or assignment changes to existing artifacts.

1. **BL-5, three lines** — a named new file for the four sorting assertions; split
   F2's Owns into "may modify" / "read-only guard"; F2 records the guard-commit
   SHA. Without these, F2's two Done items contradict each other and the ordering
   requirement is unverifiable on a squashed landing.
2. **BL-3(b), one assignment** — extend F2's pre-declaration to
   `DataTableToggleAction` (`data-table-controller.ts:265-279` and the `toggle`
   switch at `:845-876`), or sequence it explicitly. U6 cannot ship
   `measureLayout()` without it.
3. **BL-3(a), one line** — state whether `ColumnPresentation` may carry
   header-cell adornments. U3 cannot render a resize handle without an answer.
4. **BL-2, one question** — ask F4's owner for a go/no-go on the eight sites
   before they write code.
5. **BL-6, two entries** — add `anatomy.yaml` and `accessibility.md` to the
   manifest list.
6. **BL-3 related, one assignment** — pre-assign `data-table-contract.ts` and
   `data-table-state.ts` to U4 for its group-collapse slice.

Items 1–3 are the ones a developer would hit on day one. Items 4–6 are cheaper to
fix now than to escalate later.

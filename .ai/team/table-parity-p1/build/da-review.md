# BUILD gate review — the Wave 0 seam as built

- **Date:** 2026-07-27
- **Filing:** this is a **build-phase** review — it reviews landed source, not a
  design artifact. The two design-phase passes stay at
  `.ai/team/table-parity-p1/design/da-review.md`; this is a separate document
  rather than a third pass appended there.
- **Reviewed at:** `99f0623` (refactor), `4541f54` (guard), `e28bcd0` (F1), plus
  the **uncommitted working tree**, which turns out to matter.
- **Verdict:** **5 blockers, 6 non-blockers.** The seam is materially better
  built than it was specified — four of the nine contribution points did not
  exist in ADR-0002 and each was added for a reason that checks out. But three
  declared capabilities have **no wiring behind them**, and each blocks a
  specific Wave 1/2 unit: `footer.sticky` (U5), the seam's `measureRow` /
  `scrollToRecord` (U6), and U4's group-collapse slice.
- **Recommendation:** BL-8 must be fixed before anyone starts (it is one line).
  BL-9 and BL-10 must be fixed before **U5** and **U6** start, not before
  dispatch — U1, U2, U3, U7, U8, U9 are unaffected and can go now.

---

## The two claims I was asked to verify

Both survive.

**1. `4541f54` provably precedes `99f0623`.** `git merge-base --is-ancestor
4541f54 99f0623` exits 0. Timestamps agree (12:02:26 vs 12:35:58 +0300). The
guard commit contains **exactly one file** — `__tests__/data-table-engine-option-groups.test.ts`,
203 lines, nothing else — so the ordering is not merely chronological but
structurally clean: the guard cannot have been co-authored with the refactor. Its
subject line even says so. This is the pass-2 BL-5 fix landed as specified, in
the new file I recommended rather than inside the unmodifiable set.

**2. Six of the seven acceptance suites are byte-identical to `e28bcd0`.**
`git diff e28bcd0 HEAD` is empty for `data-table-controller.test.tsx`,
`data-table.test.tsx`, `data-table-root-view.test.tsx`,
`data-table-state.test.tsx`, `data-table-engine-plugins.test.ts`,
`data-table-engine-options.test.ts`. The seventh,
`data-table-controller-types.test.ts`, is `+113 / -0` — **purely additive**, so
every pre-existing assertion is intact. That is the right outcome for the
artifact contradiction pass 2 flagged (ADR-0002:245 listed it as unmodifiable
while PLAN:172 gave F2 edit rights); the build resolved it in the safe
direction. `table-family-public-types.test.ts` is also identical at HEAD.

Full suite: **124 files passed, 1036 tests passed, 7 todo.** Green.

---

## BL-8 — A deliberate compile error is sitting in the shared checkout, in a landed F2 file

`data-table-body-window.ts:74-75`:

```ts
// POSITIVE CONTROL — proves tsc semantic diagnostics are live, not vacuous.
const _probe: number = 'definitely not a number';
```

This is **not** in `99f0623` — `git show 99f0623:…/data-table-body-window.ts`
ends at the closing brace. It is an **uncommitted 3-line addition** to a file F2
owns and shipped, made by someone diagnosing whether `tsc` was actually running.

Consequence, measured rather than inferred:

```
pnpm --filter @constructor-lab/ui-react typecheck
src/components/ui/data-table/data-table-body-window.ts(75,7): error TS2322: Type 'string' is not assignable to type 'number'.
src/components/ui/data-table/data-table-body-window.ts(75,7): error TS6133: '_probe' is declared but its value is never read.
Exit status 2
```

Those are the **only two errors**. So: `typecheck` is red right now, for
everyone, on one of the three commands every unit is told to run
(`data-table-features/README.md:236-238`). Dispatch three agents onto this and
each independently investigates a red typecheck on a file none of them owns — and
the plan tells them "do not 'fix' a failure in a file you do not own"
(`PLAN:622-624`), so the honest ones will stall and escalate.

There is a silver lining worth stating: because those are the only two errors,
**F3's and F4's uncommitted work typechecks clean.** Removing three lines makes
the whole tree green.

**Smallest change:** delete `data-table-body-window.ts:74-75` (and the blank line
above). Whoever added it should confirm the diagnostic question it was answering
is settled first.

## BL-9 — `footer.sticky` is declared, documented, and unreachable. U5 is blocked.

Four things line up and the fifth is missing:

- `data-table-features/footer.ts:41` declares `readonly sticky?: boolean` on
  `DataTableFooterConfig`.
- `footer.ts:16` instructs U5 to deliver "`sticky` via F3's `TableFooter sticky`".
- F3 did ship it: `table/table.tsx:329-335` declares `TableFooterProps.sticky`,
  and `STICKY_FOOTER` (`:290-293`) implements it.
- `PLAN:430` puts `FooterConfig` (`summaries` XOR `render`, **`sticky`**) in U5's
  scope, and design §5.2 requires it.
- **`data-table-view.tsx:623` renders `<TableFooter>` with no props at all.**

There is no seam that reaches it:

- `DataTableViewProps` has `stickyHeader` (view props list, `:76` region) but no
  `stickyFooter`. A repo-wide grep for `stickyFooter|footerSticky` returns
  nothing.
- `renderDisplayRow` returns the `<TableRow>` that goes *inside* `<TableFooter>`
  (`:624-633`), so U5 cannot reach the section element.
- `composeRowPresentation` — which does carry `sticky` and `stickyOffset`
  (`registry.ts:251-258`) and is correctly applied to record rows
  (`data-table-view.tsx:322-327`) — is called **only** from `renderRecordRow`
  (`:284`). Footer display rows never pass through it.

So U5 must reopen `data-table-view.tsx`, which is exactly what the registry
exists to prevent. This is the same defect shape as the design-phase NB-6, one
layer down: satisfiable at the primitive, unreachable from the feature.

**Smallest change:** F2 adds `stickyFooter?: boolean` to `DataTableViewProps` and
passes it at `:623`; U5 supplies it from the DataGrid side through the `viewProps`
contribution, which already exists (`data-grid-config/registry.ts:365-367`). One
prop, one attribute.

## BL-10 — Two of the body-window seam's six members are dead. U6 is blocked twice.

`data-table-body-window.ts:49-54` declares `measureRow` and `scrollToRecord`, and
the file's own rationale (`:18-20`) is explicit about why: without them in the
signature "U6 would have to reopen `data-table-view.tsx`, which is the one thing
the seam exists to prevent."

`grep -n "measureRow\|scrollToRecord" data-table-view.tsx` → **no matches.** The
view reads only `rows` (`:261-262`), `isWindowed` and the two paddings (`:592`,
`:607`).

Why each one blocks U6:

- **`measureRow`.** `data-table-features/virtualization.ts:38` declares
  `measure?: 'fixed' | 'dynamic'`, and `PLAN:541-542` requires "Fixed-height
  **and measured-height** windowing". Dynamic measurement needs a per-row
  callback ref on each rendered row. The view's only row ref is `rowNodesRef`,
  keyed by row id, set inside `renderRecordRow` (`:307-309`) — and non-`data`
  display rows get no ref at all, so U6 could not measure a detail or group row
  even if it reached the record rows.
- **`scrollToRecord`.** It is documented (`:26-27`) as backing the pre-declared
  `scroll-to-row` action. But `data-table-controller.ts:1007-1010` throws, and
  the controller has no path to the view's hook return value. So U6 needs a
  view→controller bridge on top of replacing the seam file. Pre-declaring the
  action member (which F2 did, correctly) does not by itself make it
  implementable.

**Smallest change:** F2 calls `bodyWindow.measureRow?.(node, displayIndex)` from
the row ref at `:307` and from the dispatch wrapper at `:595-606`, and publishes
`bodyWindow.scrollToRecord` to the controller through the existing root
(`DataTableRoot` already carries the controller both ways). Both are F2 edits to
`data-table-view.tsx` — small, but they must happen before U6 starts or the seam
is decorative.

## BL-11 — DataGrid-side ownership is missing exactly where Wave 1 lands

The DataTable side has **two** mechanisms: a 13-row ownership table
(`data-table-features/README.md:52-69`) and a per-file `OWNERSHIP:` header on
every stub (`footer.ts:3`, `virtualization.ts:3`). Both name the transfers —
`filtering.ts` → U7, `pagination.ts` → U8, `columns.ts` → U3.

The DataGrid side has **neither in full**:

- `data-grid-config/README.md` has **no ownership table**.
- Per-file owner lines exist for the seven unshipped stubs only —
  `tree.ts:1-2` ("Owned by U2"), and the same for `detail-expansion.ts` (U1),
  `columns-features.ts` (U3), `grouping.ts` (U4), `footer.ts` (U5),
  `virtualization.ts` (U6), `persistence.ts` (U10).
- **The five shipped-group modules that Wave 1 units are assigned to edit have
  no owner line:** `filters.tsx` (U7 — `PLAN:448`), `server.ts` (U8 —
  `PLAN:478`), `sorting.ts` + `selection.tsx` + `appearance.ts` (U9 —
  `PLAN:491-492`). `pagination.tsx` likewise, for U8's `unknownTotal`.

Two aggravating factors:

1. **`toolbar.tsx` is unowned and reads `filters`.** `data-grid-config/README.md:84-85`
   states the coupling ("`toolbar` reads `filters`"). U7's rework of the
   `filters` group's resolved shape will require it, and U7's Owns list
   (`PLAN:443-448`) does not include it. U7 and U9 are both Wave 1 candidates.
2. **Two plan/filename mismatches that will read as "file not found":**
   `PLAN:448` says `data-grid-config/filters.ts` (actual: `filters.tsx`);
   `PLAN:491` says `data-grid-config/selection.ts` (actual: `selection.tsx`).

**Smallest change:** add an ownership table to `data-grid-config/README.md`
covering all 22 files (mirroring the DataTable one), add owner lines to the five
transferred modules, add `toolbar.tsx` to U7's Owns, and correct the two
extensions in the plan.

## BL-12 — U4's group-collapse slice still has no owner, and it is now provably required

F2 did the pre-declaration correctly: `toggle-group` exists on
`DataTableToggleAction` (`data-table-controller.ts:376`) with a switch arm that
throws (`:1012-1014`). That closes the pass-2 BL-3(b) finding for the *action
union*.

But `DataTableState` (`data-table-contract.ts:32-44`) has **no group-collapse
slice**, and `DataTableSlice = keyof DataTableState` (`:91`), so when U4 replaces
the throwing arm there is nothing for `request(<slice>, …)` to write to. U4's
decided design — its own slice, not `treeExpanded` (`PLAN:525-527`) — therefore
requires:

- `data-table-contract.ts:32-44` — the `DataTableState` interface
- the `requiredSlices` array in the same file (`:49+`) — hand-listed
- `data-table-state.ts:69-72` — the default value

None of those files appears in either README's ownership table. F1 was told not
to touch them (`PLAN:120-121`). No unit claims them.

Good news I verified while looking: there is **no** exhaustive
`Record<DataTableSlice, …>` anywhere. The slice lists are partial
`new Set<DataTableSlice>([…])` (`data-table-state.ts:23`, `:26`), so this is *not*
the total-record forcing function BL-2 was about — it is a single-claimant
unassigned file. Pre-assigning both files to U4 costs nothing and removes an
escalation round-trip from the middle of Wave 2.

---

## Can the nine points carry all ten units? Group by group.

| Unit | Requirement | Point that delivers it | Verdict |
| --- | --- | --- | --- |
| U1 detailExpansion | config, `isExpandable`, accordion | `engineOptions` + controller | ✓ shipped |
| | detail display row + §7 `domId` | `displayRows` + `renderDisplayRow`; `encodeRowIdForDom` (`data-table-display-rows.ts:105`) | ✓ shipped |
| | `aria-expanded` on the record row | `rowPresentation.expanded` (`registry.ts:255`), applied at view `:322` | ✓ |
| | expander chrome | DataGrid `columns` transform | ✓ |
| U2 tree | `getSubRows`/expand binding | `engineOptions`; `gates.expandedSlice` | ✓ shipped |
| | lazy `loadState` keyed by row ID | `renderContext.row` resolver → merges over base `tree` | ✓ (see "could not break" #3) |
| | tree-status row | `displayRows` + `renderDisplayRow` | ✓ |
| | indentation from `row.depth` | **no `cellPresentation` point** — per-(row × column) has no seam | ⚠ workaround only |
| U3 columnsFeatures | `enable*` flags | `engineOptions` | ✓ |
| | `getSize()` widths, pin offsets | `columnPresentation.style` — reaches `<TableHead>` (`:506`) **and** every `<TableCell>` (`:418`) | ✓ verified both |
| | resize handle, reorder grip | `columnPresentation.headerAdornments` + `ColumnAdornment` | ✓ |
| | keyboard announcements / live region | DataGrid `chrome(slot)` — matches `behavior.md:444-449` | ✓ |
| U4 grouping | `getGroupedRowModel()` | `engineOptions` | ✓ |
| | group header row | `classifyDisplayRow` + `renderDisplayRow` | ✓ |
| | sticky group header | U4 renders its own `<TableRow sticky>` | ✓ |
| | **group-collapse slice** | **none** | **BL-12** |
| U5 footer | table-scoped footer row | `tableDisplayRows`; view routes `kind: 'footer'` into `<TableFooter>` (`:622-635`) | ✓ |
| | **`footer.sticky`** | **none** | **BL-9** |
| U6 virtualization | window the display-row list | `data-table-body-window.ts` file transfer | ✓ |
| | bounded container | seam's `containerRef` → `Table containerRef` (view `:480`) | ✓ |
| | **measured-height mode** | **`measureRow` never wired** | **BL-10** |
| | **`scrollToRecord`** | **never wired; controller cannot reach it** | **BL-10** |
| U7 facets + global search | faceted row models | `engineOptions` | ✓ |
| | per-column facet values | `renderContext.header` resolver | ✓ |
| | filter chrome | DataGrid `chrome('under-toolbar')` | ✓ |
| | `toolbar.tsx` coupling | unowned | **BL-11** |
| U8 server | directional capabilities, `unknownTotal` | `engineOptions` + DataGrid `controllerOptions` | ✓ |
| U9 plumbing | `sorting.cycle`/`maxColumns`, `selection.reserve` | already in the controller; DataGrid `resolve` + `controllerOptions` | ✓ |
| | appearance box props | `viewProps` → the eight new `DataTableViewProps` members | ✓ |
| U10 persistence | restore engine as a hook | `effects` (`registry.ts:379`) | ✓ |

**Answer: the nine points carry eight of the ten units as built.** U5 and U6 are
blocked on wiring, not on architecture — each needs a declared member to be
connected, not a tenth contribution point. U4 is blocked on a state slice, not on
a seam.

---

## Non-blockers

**NB-9 — The premise "Wave 0 is landed" holds for F1 and F2 only.** F3 and F4 are
**uncommitted**: `git ls-files data-grid-config` returns nothing and no commit
touches it. The working tree carries 48 entries, including modified
`data-grid.tsx`, `table.tsx`, `table/index.ts`, four `ui-spec/components/table/*`
files, `generate-stories.ts`, `context/table-feature-parity-design.md` (the Q8
amendments), plus 22 untracked `data-grid-config/*` files, 17 untracked
`props-*.types.test.ts` files, two untracked changesets, and stray
`.codegraph/` + `packages/ui-react/.f5spike/` directories. Dispatching three
agents into that means any `git add -A`, `git stash` or `git checkout` by any of
them puts F3's and F4's uncommitted work at risk. Land F3 and F4 first.

**NB-10 — Two features cannot contribute to the same render-context namespace,
even for different sub-fields.** `mergeRenderContextFields` (`registry.ts:504-524`)
collision-checks on the **top-level** key, so if U2 returned `{ tree: { loadState } }`
and any other module returned `{ tree: { … } }`, it throws — before
`applyContribution`'s one-level-deep merge ever runs. That is the right default,
and I confirmed it is not reachable for the planned units (each owns a distinct
namespace). But README rule 4 (`:39-44`) explains cross-module collision and
base-replacement without stating this constraint, and a developer could
reasonably expect sub-field merging across modules. One sentence.

**NB-11 — `cell.row` is a silent-clobber trap.** `applyContribution`
(`data-table-render-context.ts:159-182`) deep-merges only
`NESTED_CONTEXT_NAMESPACES = ['detail', 'tree']` (`:31`); every other key
replaces wholesale. `createCellContext` nests a whole row context under `row`
(`:~62`), so a cell-scope resolver returning `{ row: … }` would silently discard
`id`, `data`, `isSelected`, `detail`, `tree` and the commands. Not reachable today
— no planned unit contributes a cell-scope `row` field — but the failure mode is
total and silent rather than partial. Adding `'row'` to the list, or rejecting a
contribution key whose base value is a composite object, closes it.

**NB-12 — `columnPresentationFor` recomputes per cell.** `data-table-view.tsx:418`
calls it inside the cell map, so `composeColumnPresentation` runs
`rows × visibleColumns` times per render, each iterating all 11 modules
(`registry.ts:589`). Correct, and currently cheap because only stubs contribute.
It will not stay cheap once U3 computes widths and pin offsets there and U6 layers
windowing on top. Memoize by column id.

**NB-13 — `data-table-display-rows.ts` has no owner.** It is outside
`data-table-features/` and absent from both README tables. `data-table-body-window.ts`
is covered in prose (README:137-141 plus the file's own header), but the
display-row union is the file U5 would touch to use `scope: 'group'` and U4 to add
a group field. Single claimant each; name an owner.

**NB-14 — `data-table-engine-plugins.ts:49` declares
`'data-table.actions.measure-layout'`** as a plugin extension-point key while the
controller action of the same name throws "not implemented yet". Not a defect —
the key is a read-only anchor, not a dispatcher — but the name collision will read
as a contradiction to whoever finds it first. Worth a cross-reference comment.

---

## What I tried to break and could not

**1. The four added contribution points are each justified by something real.**
I checked every one against source rather than the README's reasoning.
`classifyDisplayRow` — correct: `getGroupedRowModel()` does put group rows *into*
`getRowModel().rows` via `row.getIsGrouped()`, so a group header genuinely is a
reclassification, not an insertion, and `ui-spec/…/data-table/behavior.md:424`
("only root rows are classified") agrees. `tableDisplayRows` — correct: a
`scope: 'table'` footer hangs off no record row and `deriveDisplayRows` runs the
per-record loop before the table loop (`data-table-display-rows.ts:148-178`).
`rowPresentation` — correct: F3 shipped `TableRow` `expanded`/`sticky`/`stickyOffset`
that no other point could reach. `effects` — correct: U10's restore engine is a
hook and nothing else runs one.

**2. The body-window seam is called unconditionally and the spacers are real.**
`data-table-view.tsx:253-258` calls `useDataTableBodyWindow` unconditionally, as a
hook, outside every branch — so U6's replacement may use `useVirtualizer` without
changing the view's hook order. `isWindowed` gates the spacer rows (`:592-594`,
`:607-609`) so today's DOM is byte-identical. The one gap is the two dead members
(BL-10), not the seam's shape.

**3. `renderContext` as a per-subject resolver serves both U2 and U7, and the
one-level-deep merge does not discard fields.** This is what the team lead asked
me to be hard about. The resolver shape (`registry.ts:275-283`) gives each of
`row`/`header`/`cell` a function, so U2's row-ID-keyed `loadState` and U7's
column-keyed facets both have something to key on; a per-table constant is a
closure that ignores its argument, as documented. The merge is implemented at
`data-table-render-context.ts:159-182` and behaves as advertised: for `detail` and
`tree` it does `{ ...baseValue, ...value }`.

I then tried to find a case where it silently drops a field. **I could not, for
any planned unit.** The reason is structural, not luck: the base row context's
*only* nested objects are `detail` and `tree` (both in the allow-list) — I read
the base literal to confirm it, and `tree` ships all five fields including
`loadState: 'idle'`, so U2 setting `tree.loadState` provably preserves
`isExpanded`, `canExpand`, `toggle`, `depth` and `hasChildren`. Header and cell
base contexts are flat. The only latent hole is the `cell.row` composite (NB-11),
which no planned unit touches.

**4. Throwing rather than no-opping is right, and nothing dispatches the three
actions.** `measure-layout` / `scroll-to-row` / `toggle-group` are declared at
`data-table-controller.ts:371-378` with throwing arms at `:1006-1015`. I searched
the whole repo for a dispatcher and found only the declaration, the throw arms,
and prose in the stubs and READMEs. So the throw is unreachable from any shipped
path — it costs nothing today and turns a silent no-op into a named failure the
moment a caller tries. Same judgment applied to `renderDisplayRow`
(`registry.ts:673-675`) and `classifyDisplayRow`'s two-claimant throw
(`data-table-display-rows.ts:208-212`); both are correct, and F2's Done item
requiring the unhandled-kind throw is implemented rather than asserted.

**5. No dead public props were shipped.** All seven unshipped DataGrid groups are
absent from `DATA_GRID_CONFIG_MODULES` (`data-grid-config/index.ts:39-52`), and
each stub is a **fully commented-out template** — so declaring a group early
cannot happen by accident. `_AssertEveryConfigRegistered` (`:62-64`) is a genuine
replacement for the total record: it fails compile if a group is declared on the
maps but missing from the manifest, and the fix is one line in the manifest rather
than an edit to `data-grid.tsx`. Both orders are pinned by tests
(`data-table-features.test.tsx:67`, `data-grid-config.test.tsx:47`).

**6. The header-cell seam (my pass-2 BL-3a) is genuinely closed.** `ColumnAdornment`
(`registry.ts:230-235`) with `before-label`/`after-label`/`edge`, sorted by
placement (`:635-643`), rendered inside `<TableHead>` by `adornmentsAt`
(`data-table-view.tsx:150-164`), and the header call passes `header` in the
context (`:506-510`) so an adornment can read sort state. It needs no `table.tsx`
change, as claimed. U3's resize handle has a home.

**7. Roving focus and striping index records, not display rows.** `renderRecordRow`
uses `recordIndex` for striping (`:405-409`, with a comment saying why) and
`displayRowRecordIndex` (`data-table-display-rows.ts:115-119`) exists for the
navigation case. This was the one regression ADR-0001 consequence 6 warned about
and it is handled deliberately rather than incidentally.

---

## Dispatch recommendation

- **Fix BL-8 now** (delete three lines). Until then every unit's `typecheck` is
  red on a file nobody owns.
- **Land F3 and F4 before dispatching** (NB-9). Three agents plus ~48 uncommitted
  entries in one checkout is a single stray `git add -A` from losing F3/F4.
- **Then dispatch U1, U2, U3, U7, U8, U9 freely** — every requirement I traced
  for them lands on a working point. U2's indentation has no dedicated seam but
  is expressible (row-level CSS custom property plus a column class, or the
  DataGrid `renderCell`); worth one README line so U2 does not go looking for a
  `cellPresentation` point that is not there.
- **Hold U5 until BL-9 is fixed** and **U6 until BL-10 is fixed.** Both are small
  F2 edits, and both are cheaper now than after those units have built around the
  gap.
- **Pre-assign `data-table-contract.ts` + `data-table-state.ts` to U4** (BL-12)
  and fix the DataGrid ownership gaps (BL-11) before U7/U9 overlap on
  `toolbar.tsx`.

---
---

# Addendum — F3's three consumer-side claims, tested independently

Checked against source without relying on F3's account. **Two claims hold in
full, one holds in substance but not in provenance.** Testing them surfaced two
further findings and one spec regression.

## Claim 1 — all eight box/surface props reach `<Table>`, type-coupled. **TRUE**, with one precision.

Verified at the call site, `data-table-view.tsx:479-489`:

| Prop | Declared | Delivered |
| --- | --- | --- |
| `size` | `:113` `TableProps['size']` | `:481`, spread-guarded |
| `background` | `:115` `TableProps['background']` | `:482` |
| `borders` | `:117` `TableBorders` | `:483` |
| `width` | `:118` `TableProps['width']` | `:484` |
| `height` | `:120` `TableProps['height']` | `:485` |
| `maxHeight` | `:121` `TableProps['maxHeight']` | `:486` |
| `stickyHeader` | `:123` `boolean` | `:489` `<TableHeader sticky={stickyHeader \|\| undefined}>` |
| `showHeader` | `:125` `boolean` | `:488` conditional section render |

The type-coupling claim is **correct as stated**: `borders` is the exported
`TableBorders` interface (`table/table.tsx:82`, re-exported at
`table/index.ts:17`) and `maxHeight` is an indexed access into `TableProps`
(`table.tsx:209`). Six of the eight are coupled that way, so a rename or a widened
union in the primitive propagates as a compile error rather than as drift. That is
the right call and it is the difference the claim identifies.

The precision: `stickyHeader` and `showHeader` are declared as bare `boolean`,
not indexed off `TableHeaderProps['sticky']`. Strictly those two are
convention-coupled. It does not matter — the target is `boolean | undefined`, so
there is no shape to drift into — but the blanket phrase "the two layers are
type-coupled" is true of the six, not the eight.

Two implementation details worth recording because they are easy to get wrong and
were not: every prop is spread behind an `undefined` guard (`:481-486`), so no
explicit `undefined` reaches the primitive and `Table`'s own defaults still apply;
and `sticky={stickyHeader || undefined}` matches the primitive's
`data-sticky={sticky ? 'true' : undefined}` (`table.tsx:309`), so the off state
emits no attribute and today's DOM is unchanged.

## Claim 2 — `containerRef`/`containerClassName` are deliberately absent, and U6 needs no new prop. **TRUE.** The divergence from NB-6 is an improvement.

This is the one you most wanted checked, so here is what I did rather than what I
concluded.

Confirmed absent: `grep -n "containerProps\|onScroll\|containerClassName"
data-table-view.tsx` returns nothing, and neither appears in the full
`DataTableViewProps` key extraction.

Confirmed the ownership chain is closed: the view creates the ref itself
(`:213`), passes it to `<Table containerRef>` (`:480`), and passes **the same
ref** into `useDataTableBodyWindow` (`:255`). `DataTableBodyWindowInput.containerRef`
(`data-table-body-window.ts:33`) is therefore populated with the real scroll
container before U6 exists. No new view prop, no `table.tsx` change.

Then I tried to break it, by looking for a consumer that needs the container from
*outside* the view:

- U9's appearance cluster is entirely box props — `size`, `background`,
  `showHeader`, `borders`, `height`, `maxHeight`, `stickyHeader` (`PLAN:500-501`).
  None needs a ref.
- U6 receives it in its arguments.
- A hand-written `DataTableView` composition could want it, but `Table` remains
  directly composable and still exposes `containerRef` for that case.

**I could not find one.** And the divergence is not merely harmless — exposing
`containerRef` as a view prop would let a caller pass a ref the seam does not know
about, splitting ownership of the single element virtualization must own. NB-6
described the symptom; this is a better fix than the one NB-6 literally implied.

**This does not rescue BL-10.** `containerRef` and `measureRow`/`scrollToRecord`
are different members of the same interface. The container is wired; the
measurement and scroll callbacks are not read by anything (`grep` → no matches).
Claim 2 being right and BL-10 being right are compatible.

## Claim 3 — `showHeader` came from `table/behavior.md`'s recorded resolution. **TRUE that the spec says it; NOT TRUE that it pre-existed.**

The spec text is real and near-verbatim,
`packages/ui-spec/components/table/behavior.md:172-178`:

```gherkin
Scenario: Hiding the header is the owner's composition, not a Table property
  Given DataGrid resolves appearance.showHeader = false
  Then it omits the header section entirely
  And the column model, selection, and data-state behavior are unchanged
  And Table exposes no showHeader property — a header it is not given is a
    header it does not render
```

The implementation matches exactly: `data-table-view.tsx:488` renders the
`<TableHeader>` section conditionally, and `TableProps` (`table.tsx:194-216`) has
no `showHeader`. The scenario even names the path U9 will wire
(`appearance.showHeader`).

But `git show HEAD:packages/ui-spec/components/table/behavior.md | grep showHeader`
returns **nothing** — the scenario is part of F3's own uncommitted work. So this
is a resolution F3 **recorded and implemented in the same unit**, not one it
implemented from a prior decision. That is a legitimate workflow and F3 owns that
file (`PLAN:240`), but the spec is not independent corroboration here: F3 is both
author and implementer. The design judgement stands on its own merits — a
`showHeader` prop on `Table` would be redundant with not passing a header, and it
is consistent with design §4.2's division — so I am recording the provenance, not
disputing the choice.

## F3's "no follow-up owed to U5, U6 or U9" — **confirmed, and it extends to U3**

I checked each path for an obligation F3 still holds. There is none. Every gap I
found on those paths is an **F2** obligation:

| Unit | Needs from the primitive | F3 shipped it? | Remaining gap owner |
| --- | --- | --- | --- |
| U5 | `TableFooter sticky` | ✓ `table.tsx:329-335` + `STICKY_FOOTER` `:290-293` | **F2** — `stickyFooter` view prop (BL-9) |
| U6 | bounded container, `data-bounded` | ✓ `:256`, `containerRef` `:211` | **F2** — `measureRow`/`scrollToRecord` wiring (BL-10) |
| U9 | all eight box/surface props | ✓ all present | none — F2 already forwards them |
| U3 | `TableHead` pin hook; a slot an adornment can position in | ✓ `pinned`/`pinOffset` `:572-573`; `className={cn(…, pin.className, className)}` and `{...props}` `:588-602` | none |

The U3 row is worth stating explicitly because `registry.ts:226-228` *claims* "no
`table.tsx` change is needed — `TableHead` merges `className` via `cn()` and
spreads props". I verified both: the `cn()` call puts the caller's `className`
last (so `'relative'` wins) and `{...props}` is spread. The claim is accurate and
F3 owes U3 nothing either.

**So F3's report is correct.** No discrepancy to act on.

## Two further findings this addendum surfaced

**NB-15 — `rowInteraction.onScroll` has no seam.** `Table.containerProps`
(`table.tsx:214-215`) is documented as the escape hatch for exactly "`onScroll`,
`tabIndex`, `data-*`" — F3 shipped it. `DataTableViewProps` forwards neither
`containerProps` nor `onScroll` (grep → none). Design §5.2 puts `onScroll` in
`rowInteraction`, and `ui-spec/…/data-table/behavior.md:483-490` requires
"`onScroll` receives the normalized scroll event". No Wave 1 unit is assigned it,
so it is not a dispatch blocker — but it becomes one for whoever gets it, and the
fix is the same one-line shape as BL-9. `data-grid-config/row-interaction.ts`
exists and is unowned (BL-11).

**NB-16 — BL-9, BL-10 and NB-15 are one defect class, and the plan has no bucket
for it.** All three are: *F3 shipped a primitive capability; `DataTableViewProps`
is the chokepoint that does not forward it.* The reserved-slot placement rule
(`PLAN:701-704`) has buckets for "needs only DataGrid pass-through" → U9, "needs a
controller option" → its feature module, and "needs new `table.tsx` presentation"
→ a follow-up to F3. **There is no bucket for "needs a new `DataTableView`
prop"** — which is where all three land, and why all three were missed. Adding
that fourth bucket, pointed at F2, is the generalization worth taking from this
review; it is likelier to catch the tenth instance than fixing the three
individually.

**NB-17 — F3 stripped the `[Target P…]` scenario tags from `table/behavior.md`,
breaking a convention the other two specs still follow.** Counts:
`data-table/behavior.md` 53, `data-grid/behavior.md` 32, `table/behavior.md` **2
in the working tree, down from 7 in HEAD.** The diff shows five existing scenarios
losing their tags (e.g. `[Target P0 — shipped legacy parity] Current is distinct
from selected` → `Current is distinct from selected`). Those tags are not
decoration: `researcher-engine.md:425-440` records that `— shipped legacy parity`
means "confirmed shipped in the legacy Vue `AvTable`, so the scenario is not
speculative", and both inventories keyed their acceptance material off them.
Stripping them from one of three sibling specs loses that provenance for Table and
will read as drift the next time anyone compares the three. This is in
**uncommitted** work, so it is cheap to restore now and archaeology after F3
lands. Not a blocker for any unit.

## Net effect on the verdict

Unchanged: **5 blockers**, now **9 non-blockers**. Nothing in the three claims
alters the dispatch recommendation. BL-8 still gates everyone; F3 and F4 should
still land before three agents share the checkout; U5 still waits on BL-9 and U6
on BL-10 — and this addendum confirms both of those are F2's to fix, not F3's, so
they can be fixed without pulling F3 back in.

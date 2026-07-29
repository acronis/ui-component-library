# DESIGN phase — table parity P1 decomposition

- **Date:** 2026-07-27 (rev 2c — all questions closed; contribution-surface sweep)
- **Baseline:** branch `feat/table-parity`, HEAD `88eaf6b`
- **Gate status:** **open for F1, F3 and F4.** Second pass cleared 5 of 7
  blockers; both residuals are fixed in rev 2b and are scoped to F2 (BL-5) and
  Wave 1 (BL-3), neither of which has started. Disposition table in the
  decomposition's §9.
- **Inputs consumed:** `.ai/team/table-parity-p1/explore/researcher-engine.md`;
  `.ai/team/table-parity-p1/explore/researcher-surface.md`; the design-gate
  review; `context/table-feature-parity-design.md`;
  `context/table-feature-parity-implementation-plan.md`; `AGENTS.md`;
  `packages/ui-react/AGENTS.md`

## Durable artifacts

| Artifact | Path |
| --- | --- |
| ADR-0001 — expand/collapse ownership (**Accepted**) | [`.ai/plans/adr/ADR-0001-expansion-domain-row-model-ownership.md`](../../../plans/adr/ADR-0001-expansion-domain-row-model-ownership.md) |
| ADR-0002 — module registries (**conditional go, scope extended**) | [`.ai/plans/adr/ADR-0002-internal-feature-module-registry.md`](../../../plans/adr/ADR-0002-internal-feature-module-registry.md) |
| Decomposition + ownership map + sizing | [`.ai/plans/PLAN-table-parity-p1-decomposition.md`](../../../plans/PLAN-table-parity-p1-decomposition.md) |

No source, test, story or spec file was modified.

## What changed in rev 2

**ADR-0001 (accepted, revised).** Marked Accepted. Quotation corrected to include
the `paginateExpandedRows` wrapper branch the review found omitted. The
render-layer consequence was **overstated** in rev 1 and is now corrected: detail
rows were never in the row model, so nothing observable changes — what the
decision actually requires is that the row-kind concept become explicit and
extensible. OQ-1 recorded as decided, with the §3.5 design-doc amendment it
implies. New OQ-2: the tree-side twin — `paginateExpandedRows` is library-owned
and unset. Added the one real regression risk the review found: keyboard roving
focus must keep indexing records, not display rows, and the existing arrow test
cannot catch it.

**ADR-0002 (scope extended).** Widened from data-table-only to both layers,
because every Wave 1 unit is engine half plus DataGrid chrome and a
DataTable-only registry buys nothing. Added a fifth contribution point
(`renderDisplayRow`), the body-window seam that virtualization replaces, the
config-key declarations in the three options unions, and a symmetric DataGrid
config registry with `columns` and `chrome` contributions covering all eight
contended sites in `data-grid.tsx`.

**The acceptance criterion was rebuilt, not patched.** This is the finding that
went against me and it was the right catch: the safety net I proposed was not
load-bearing at either hazard ADR-0002 itself names. It named a file that does
not exist (`data-table-state.test.ts` — it is `.tsx`), omitted the only suite
that characterizes what F2 rewrites (`data-table.test.tsx`), and its one real
guard on the lazy-table closure was scheduled to be destroyed by F1 before F2
needed it. The criterion now has a defined baseline (F1's landing commit), a
corrected suite list, and three guards that must exist **before** the refactor
commit — I verified the zero-coverage claim on the sorting option group myself.

**The decomposition gained a mechanism it was missing.** Rev 1 told units to
"append carefully" to shared barrels and spec files. That is a hope, not a
mechanism, and under one checkout an appended line is a whole-file write. Rev 2
adds an **integration queue**: a fixed set of manifest files no unit opens, per-
unit staging files, and one named integrator who applies them at each landing.

## Honest sizing

The team lead asked for the truthful number. It is **2 → 3 → 1**, not 3 → 3 → 3.

| Stage | Sustained | Why |
| --- | --- | --- |
| Wave 0 | **2** (3 briefly) | Track B idles after `table.tsx`. Nothing in Wave 1 depends only on F3, and the fill I proposed in rev 1 was blocked by the same long pole it was meant to cover. |
| Waves 1–2 (one rolling pipeline, not two waves) | **3** | Real, but conditional on ADR-0002 landing with its extended scope. Without it: 1 substantive developer plus U9. |
| Wave 3 | **1, strictly** | Integration, docs, and a baseline pass that collides with itself. |

If F4 cannot absorb its extended scope, the DataGrid half of every Wave 1 unit
serializes and the middle number drops toward 1.5. The plan says so explicitly
and tells the F4 owner to escalate rather than ship a half-registry.

## Decisions folded in (rev 2a)

Q1–Q5 are closed and reflected throughout; the closed/open split is the
decomposition's §10.

- **Q3 (global search, (a)+(c))** rescoped **U7** from "facets" to the whole
  `filters` group. Both halves live in the same two files and the `/data`
  migration needs both, so splitting them would have produced two units that
  each block the same screen. W3-INTEG's dependency now names both explicitly.
  Adds a §5.2 `FiltersConfig` design amendment.
- **Q4 (virtualization ships whole)** removed the staged cut from **U6**, which
  now depends on U1 + U2 as well as F2 + F3 + U9. It becomes the most-blocked
  unit in the plan and the last to start, so the pipeline narrows at its tail —
  reflected in §7 and in the restored §7.1 independence table.
- **Q5** confirmed the toolbar defaults in F4; no change needed.

## Still open — and a numbering collision worth knowing about

Rev 2 renumbered the questions from §8 to §10 and added three. The "all five of
§8 are closed" message predates that, so **Q6–Q8 have not been seen yet**, and
two of them gate work:

- **Q7 (ADR-0001 OQ-2)** — do *tree* descendants consume pagination slots?
  `paginateExpandedRows` is library-owned and unset. Recommend `true`: unlike
  detail rows, descendants are records in the row model, and §3.5 already orders
  `tree expand -> paginate`, so text and TanStack default agree. **Needed before
  U2 starts.**
- **Q8** — who carries the two `context/table-feature-parity-design.md`
  amendments the decisions now require: §3.5 pipeline order (from Q2, before F2)
  and §5.2 `FiltersConfig` (from Q3, before U7). Durable context document rather
  than a decomposition artifact, so I am flagging rather than claiming it;
  tech-writer is the natural owner and both could be one pass.
- **Q6** — branch/PR strategy. `visual-regression.yml` uses an unqualified
  `on: [pull_request]`, so per-unit PRs would each show a red required check for
  the whole build. Recommend one branch, one PR at the end.

## Rev 2b — the two residuals

**BL-5 was a self-contradiction, and the reviewer was right that it was the more
urgent of the two.** F2's acceptance said seven suites must pass *unmodified*
while F2's `Owns` list — defined as "files this unit may create or modify" —
granted permission to modify those same files. Worse, Done item 2 asked for four
new sorting assertions with no named home, and their obvious home
(`data-table-controller.test.tsx:100-146`) was first in the unmodifiable table:
the two Done items could not both be satisfied. Fixed with the reviewer's three
lines — a new `__tests__/data-table-engine-option-groups.test.ts` that F2 owns,
`Owns` split into "may modify" versus "read-only guard", and F2 recording a
guard-commit SHA the way F1 records its landing SHA, so the ordering survives a
squashed landing. One addition of my own: `data-table-controller-types.test.ts`
moved out of the read-only set to **additive-only**, because pre-declaring five
union keys necessarily grows the very file that guards those unions — listing it
as unmodifiable was the same contradiction in miniature.

**BL-3's two surviving seams are closed, and tracing the second one found a
third.** `ColumnPresentation` is now defined rather than left as "width, pin
offset, …", with a `headerAdornments` slot carrying U3's resize handle and
reorder grip. It needs **no `table.tsx` change** — `TableHead` already merges
`className` and spreads props — which matters because F3 is already dispatched
and I did not want to reopen a running brief. F2 also pre-declares the
`DataTableToggleAction` members U6 and U4 need.

The third: the reviewer noted U4's group-collapse slice touches
`data-table-contract.ts` and `data-table-state.ts` and suggested pre-assigning
them. Following that through, a new slice is declared in a **third** place —
`STATE_SLICES` at `data-table-controller.ts:47-61`, a spine file U4 must not
open. So pre-assignment alone would have left U4 stuck. F2 now derives
`STATE_SLICES` from the contract, collapsing three sources to two, both inside
U4's ownership.

Also folded in: `anatomy.yaml` and `accessibility.md` added to the manifest
files; the 2 → 3 staffing transition pinned (Wave 0 runs with two, the third
dispatched at Wave 1 open); the cost of running F5 concurrently with Wave 1
counted; F4's owner required to report a go/no-go on the eight sites before
implementing; and the "empty stubs" wording corrected — each stub must export
its `…Config` interface or the options unions have nothing to reference.

Sizing is unchanged: **2 → 3 → 1**.

## Rev 2c

**All eight questions are closed** (Q6 branch strategy, Q7 OQ-2, Q8 amendments
assigned). The two expansion domains resolve **opposite ways on pagination** and
that is now recorded as a table in ADR-0001: a detail row presents a record
already on the page and takes no slot; a tree descendant is a real record
entering the row model before pagination and does. U2's brief states it, because
it changes what "page size" means for a tree grid.

**The team lead's meta-observation was the valuable part of this pass, and it
paid out.** Three instances of "a hand-listed surface with no contribution point
reaching it" is a pattern, so I enumerated every such surface in the family
rather than fixing the third one and moving on. It found a **fourth**:
`DataGridCallbacks` (`data-grid-callbacks.ts:79-102`) hand-lists 13 members where
design §5.3 specifies 17, and each of the four missing members belongs to a
different unit — U1, U2, U4, U6. `resolveSliceCallbacks` compounds it with a
hand-written `if`-chain those same four would each edit. Both are now derived
from a `callbacks` contribution. Five further surfaces were checked and cleared,
with reasons recorded so nobody re-derives them, and one
(`DataTableRenderStatus` lacking `'error'`) is flagged for slot S1.

**Both build-face corrections are folded in and verified rather than assumed.**
`viewProps` is added as a sixth DataGrid contribution point. `columns` is
re-typed as a running-list transform: I checked `data-grid.tsx:876-934` and the
developer is right — `filters` maps, `actions` splices by `placement`,
`selection` prepends, and only the third is injection. The manifest order
`filters → actions → selection` is what makes the output byte-identical
including `placement: 'start'`, so the ADR now names that order and asks for a
test pinning it. `data-table-toolbar.tsx` added to F4's Owns.

**One thing I am escalating rather than absorbing.** F4's owner answered
"absorbable" about *eight* sites. This pass made it nine, plus a sixth
contribution point and a second file. The additions are structurally identical
to work already in scope so the answer probably holds — but it is a different
question, and it sets the middle worker count, so it should be re-asked rather
than assumed.

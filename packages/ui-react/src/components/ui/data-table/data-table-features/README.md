# `data-table-features/` — the DataTable feature registry

**This is the contract every Wave 1/2 unit codes against.** It implements the
DataTable half of
[ADR-0002](../../../../../../../.ai/plans/adr/ADR-0002-internal-feature-module-registry.md);
`data-grid/data-grid-config/` is the symmetric DataGrid half.

The registry is **library-internal and unrelated to the public `plugins` input**.
Design §4.1 forbids a _third-party_ plugin from replacing or inserting a stage in
the canonical pipeline. That says nothing about how the library organizes its own
features — and TanStack's own architecture is exactly this (`RowExpanding`,
`RowSelection`, `ColumnSizing` … composed into one table).

## Why it exists

Seven behavior groups remain, and nearly all of them had to change the same three
files: `data-table-controller.ts`, `data-table-view.tsx` and
`data-table-render-context.ts`. Developers share **one checkout** with no merge
step, so two agents writing one file clobber each other. Disjoint file ownership
is the only mechanism, and with the previous layout there was no disjoint
partition.

**Adding a feature is now: create one module file, then append its import and
array entry to `index.ts` yourself.** No unit opens a spine file.

## The rules

1. **You own exactly one file here.** See the ownership table below. Do not edit
   another unit's module, `registry.ts`, or `index.ts`.
2. **`index.ts` is an append-only shared manifest, and the position is yours.**
   Declaring a feature and registering it are **one atomic step** — a module that
   augments nothing still has to be in the list for its contributions to run, and
   on the DataGrid side the equivalent assertion makes an unregistered group fail
   to compile. So there is no half state to stage: append the import and the array
   entry in the same change as the module. Choose the position deliberately — only
   the unit adding a feature knows what its stage must sit behind — and keep
   `FEATURE_ORDER` in step. Append, never reformat, and check nobody else is
   mid-edit first.
3. **Order is committed.** `FEATURE_ORDER` in `registry.ts` is design §3.5's
   pipeline order and `__tests__/data-table-features.test.tsx` pins it. Order
   decides display-row sequence within a record row, the order `effects` hooks
   run, and adornment ties inside one placement. It does **not** decide who wins a
   contested key.
4. **Contributions are additive and collision-checked across modules.** Two
   modules setting the same key throws, naming both. The check is deliberately
   _cross_-module rather than within one call: a single feature legitimately
   contributes several keys at once — the sorting option group is exactly that —
   and a module may legitimately replace a _base_ value the render context
   supplies as a default.
5. **Your `…Config` interface lives in your file, with every member optional.**
   That is what lets the controller's options unions reference it before your unit
   exists. Design §5.2 makes some members required at the _DataGrid_ layer;
   tighten optionality inside your own file, never in the union.
6. **`ctx.table` is a thunk. Call it, never destructure it.** See the hazard note
   below — this one breaks silently.
7. **Nothing here is declared without something behind it, and the assertion must
   be able to fail.** Four clauses, each earned by a real defect:

   **7a — a consumer.** Every point, every `DataTableBodyWindow` member and every
   presentation field is consumed by the view or the controller. A _surface no point
   can reach_ fails loudly at the type level, but a _point that reaches nothing_
   lets you build against this file and discover the emptiness at runtime. Three
   members shipped that way once (`footer.sticky`, `measureRow`, `scrollToRecord`).

   **7b — an assertion in the configuration the consumer will actually use.** Not
   merely _an_ assertion. `columnPresentation`'s adornments were asserted with
   `expect(head.textContent).toBe('LEADNameGRIP')` — and `textContent` is
   nesting-blind, so it read identically whether the adornments were siblings of
   the label or nested inside the sort `<button>`, which was the defect. The
   harness also never set `sortable`, and the adornments were inert `<span>`s. A
   real assertion that cannot distinguish working from broken is the most expensive
   kind, because it looks like coverage. Exercise the sortable-and-interactive case
   if that is what your consumer does.

   **7c — proof by negative control.** A positive control shows a gate _can_ fire;
   only a negative control shows a gate _exists_. Break the mechanism in a
   **type-preserving** way — rename a key, flip a spread order — and confirm
   something fails. Renaming `tree` in `NESTED_CONTEXT_NAMESPACES` passed 2084 tests
   with `Type Errors  no errors`; that is what "unguarded" looks like from the
   inside. Then revert **in the same operation as the reading** and assert
   byte-identity, because a deliberate break left in a shared checkout is
   indistinguishable from a real one.

   **7d — and a producer. Ask the question in both directions.** _(Revised from the
   sweep of every instance — the render-context namespaces, `DataTableViewProps`,
   and the five DataGrid registry maps. The draft's three outcomes were two short,
   and both missing ones produced a wrong finding before being caught.)_

   7a asks "does each point reach a consumer?" That is the forward direction, and a
   sweep of it concluded the seam was sound. It was not: **a consumer-side member
   that no feature ever fills passes every forward check cleanly.**
   `DataTableRowPresentation.expanded` was declared, faithfully forwarded by the
   view to `<TableRow expanded>`, and contributed by nothing — and it was
   simultaneously unreached _and_ unsafe, because the ARIA it emitted was invalid on
   a row inside `role="table"`.

   **Before you sweep a surface, enumerate its producers.** This is the step the
   draft skipped, and skipping it is what makes the sweep produce false deletions.
   `DataTableViewProps` has three: the DataGrid `viewProps` composer, the frozen
   `DataTable` compatibility adapter, and a hand-written composition. Swept against
   the config layer alone, `bordered` and `highlightCurrentRow` look exactly like
   the presentation holes — no module contributes either. Both are fine:
   `data-table.tsx` passes them, and their DataGrid replacements are named in
   `FROZEN_DATA_TABLE_PROP_DESTINATIONS`. **A sweep of one producer out of three
   reports the other two's members as holes.**

   So for every member a view or a consumer **reads** and a feature is supposed to
   **fill**, answer — and the answer is one of five, not three:

   1. **Contributed.** Say by which module, and name the configuration it was
      exercised in. "It is filled" without a configuration is how a nominal fill
      passes: the row scope's own end-to-end test asserts a contributed
      `tree.loadState` of `'idle'` that the base context also supplies, so it cannot
      fail if the contribution is deleted (7b, in the surface 7d was auditing).
   2. **Filled by a producer outside the surface you swept.** Not a hole. Record
      _which_ producer at the member, because the next sweep will start from the
      same partial view you did.
   3. **The caller is the producer, and that is correct.** `renderHeader` and
      `renderCell` are filled by no library code and owe nothing: `DataTableView` is
      public, and a render prop whose filler is the caller needs neither a hold nor a
      deletion. What it does owe is the **DataGrid-side route** recorded at the
      member — the `columns` transform for cells, `headerAdornments` for header
      chrome — so a later unit does not add a second seam for a need already served.
   4. **Held.** Say so **at the member**, name the unit, and state the event that
      makes it deletable. A reservation with no expiry is a permanent excuse. Two
      things the draft did not know:
      - **An expiry can fire _satisfied_,** and that is the good outcome, not the
        end of the annotation. `ColumnPresentation.headerAdornments` was held for
        U3 with U3's landing as the expiry; U3 landed and took it. The same
        annotation that would have demanded deletion is the one that records the
        fill.
      - **A hold is only as good as its premise, and the premise belongs to the
        consumer, not to you.** Four `DataTableRowPresentation` members were held
        "for U4". U4's module declines `rowPresentation` outright, and for a
        mechanism reason: `composeRowPresentation` is called only from the view's
        `kind: 'data'` path, so a feature-rendered group row never reaches it — U4
        sets `sticky`/`expanded` on the `<TableRow>` it renders itself. The hold
        named a consumer the mechanism could not deliver to. **Check that the seam
        reaches the unit you are naming**, not merely that the unit is plausible.
   5. **Nothing ever will fill it** — no module, no other producer, no caller. It is
      a member that **should not exist yet**. A declared member is a promise, and the
      cost of an unkept one falls on whoever builds against it.
      `DataTableRenderContextContribution.cell` was the instance and is now deleted:
      unfilled, unclaimed, and with the `row` scope already covering every per-row
      need. **Deletion of declared surface is the team lead's call, not a module
      author's.** Recommend it with the alternative-route question answered — and
      ask that question the way the next two paragraphs say, because getting the
      subject wrong is what nearly deleted four working members.

   **Ask the alternative-route question about the seam's SUBJECT — the row, the cell,
   the column — never about the candidate consumer.** The two forms return opposite
   answers from identical evidence, and the sweep asked one form for one member and
   the other form for its three siblings without noticing:

   - _"Does a **feature** have another route to `rowPresentation.sticky`?"_ → **Yes.**
     A feature that renders its own row sets the prop on that `<TableRow>` directly,
     which is exactly what `grouping.tsx` does. Conclusion: delete. **Wrong.**
   - _"Does a **view-rendered record row** have another route?"_ → **No.** A feature
     cannot render a record row; the view does, and `composeRowPresentation` runs only
     on its `kind: 'data'` path. Conclusion: keep. **Right.**

   The subject is the thing the seam serves. A capability with one route is not
   speculative no matter how few consumers it currently has, and that is the whole of
   the distinction between `rowPresentation`'s four members (kept) and the `cell`
   scope (deleted, because the `row` scope genuinely reaches cell consumers via
   `DataTableCellContext.row`).

   **A seam whose only filler is its own test reads _unfilled_ to one sweep and
   _filled_ to another — both answers are true, and they mean different things.** So
   **state which sweep produced your finding.** "No shipped feature module contributes
   it" and "nothing anywhere fills it" are different claims:
   `__tests__/data-table-seams.test.tsx:315-338` fills all four `rowPresentation`
   members through a fixture and asserts each reaches the DOM, so they are **verified
   and unused**, not unverified. The `cell` scope was **unverified and unused** — its
   merge had never executed in any configuration. Same two-word summary, opposite
   remedies: deleting the first would have removed proven machinery _and_ the test
   proving it; deleting the second cost nothing.

   **Scope the next sweep by asking which surfaces already fail loudly — this is the
   clause that reduces work rather than adding it.** The `DataTableDisplayRow` kind
   union is in exactly this family: a declared kind no module renders is a
   consumer-side member nothing fills. Nobody had to sweep it, and it came out clean
   at the first look — `data` rendered by the view, `detail` by U1, `footer` by U5,
   `group` by U4, `tree-status` by U2, one producer each. The reason is that it is the
   **only** surface here with a runtime guard: `renderDisplayRow` throws, naming the
   kind, so the defect cannot ship quietly. Every surface that needed the manual sweep
   was one where the failure mode is silence. So before enumerating a surface, ask
   whether it has a loud failure mode; if it does, a sweep buys almost nothing, and
   the effort belongs on the surfaces that fail by saying nothing. Conversely, giving a
   silent surface a loud failure is worth more than auditing it once.

   **Ask the question of the contributed _field_, not only of the scope.** A filled
   slot can carry an unreachable value, and a scope-level sweep is blind to it by
   construction. The `header` scope is filled — so the reverse check passes — but the
   `columns` namespace it contributes is read by nothing typed: `DataTableHeaderContext`
   does not declare the member and `DataTableColumnControls` is not exported, so the
   only consumer is a test that rebuilds the type with an intersection. That is 7a one
   level down, reachable only by descending.

   **Two search notes, each of which produced a false finding today.** A file-level
   match cannot tell code from prose: `rg -l "interface DataGridGroupedConfigMap"`
   named three files that declare nothing, because the text sits inside a `//`
   template comment in each — anchor to a real declaration (`^declare module`,
   `^  interface`). And an extractor that gets the right _count_ can still have the
   wrong _set_: one pass over the `viewProps` bodies scored 28 with a false positive
   (`action`, a nested object key) and a false negative (`skeletonRows`, written as
   ES6 shorthand). The two cancelled, and the total looked correct.

   **The cheapest way to satisfy this clause is to never create the debt.** The three
   not-yet-shipped DataGrid groups are the standard: they declare nothing at all,
   because "declaring it early would add a `DataGrid` prop that silently does
   nothing." Prefer that to a hold.

   The reason this clause is separate from 7a rather than folded into it: the two
   questions feel like one. "Can every unit reach what it needs" and "does
   everything I declared reach anything" are the same question from opposite ends,
   and answering one direction confidently is what makes the other invisible.

## Ownership

| File                   | Owner               | State                                                                                          |
| ---------------------- | ------------------- | ---------------------------------------------------------------------------------------------- |
| `registry.ts`          | **F2** (on standby) | The mechanism. A tenth contribution point escalates through the team lead to F2.               |
| `index.ts`             | append-only shared  | The manifest. Append your own line; position is yours.                                         |
| `translate.ts`         | F2                  | Pure neutral↔TanStack translations.                                                            |
| `columns.ts`           | **U3**              | Shipped state wiring; `columnsFeatures` to come.                                               |
| `tree.ts`              | **U2**              | Complete. Contributes no `getExpandedRowModel`; `grouping.tsx` owns that stage.                |
| `filtering.ts`         | **U7**              | Shipped filter wiring; facets + global search to come.                                         |
| `grouping.tsx`         | **U4**              | Complete. **Owns `getExpandedRowModel` for the whole registry** — see the third sibling below. |
| `sorting.ts`           | F2                  | Complete.                                                                                      |
| `selection.ts`         | F2                  | Complete for P1.                                                                               |
| `pagination.ts`        | **U8**              | Complete. `unknownTotal` → `pageCount: -1`, plus a direct-caller guard.                        |
| `detail-expansion.tsx` | **U1**              | Shipped projection + the §7 id scheme.                                                         |
| `footer.tsx`           | **U5**              | Complete — summaries, scope, and the footer render context.                                    |
| `virtualization.ts`    | **U6**              | Stub; the real mechanism is the seam (below).                                                  |
| `persistence.ts`       | **U10**             | Stub.                                                                                          |

## The nine contribution points

ADR-0002 specified five. Four were added during F2 because five could not carry
what the seven groups need — each addition is listed with the evidence, so nobody
re-litigates it.

| Point                         | What it does                                                                                                                                                                                                                                                                                                                                              |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `engineOptions(ctx)`          | Conditional TanStack options for the one `useReactTable({…})` literal.                                                                                                                                                                                                                                                                                    |
| `displayRows(ctx)`            | Display rows appended **after** a given record row.                                                                                                                                                                                                                                                                                                       |
| `renderDisplayRow(row, ctx)`  | Renders a kind this feature owns. `undefined` = not mine; `null` = mine, render nothing.                                                                                                                                                                                                                                                                  |
| `renderContext(ctx)`          | Fields added to the row/header/cell contexts, as **per-subject resolvers**.                                                                                                                                                                                                                                                                               |
| `columnPresentation(ctx)`     | Per-column style/class **and the header-cell adornment slot**.                                                                                                                                                                                                                                                                                            |
| **`classifyDisplayRow(ctx)`** | Reclassifies a record row. **Added for U4:** `getGroupedRowModel()` puts group rows _into_ `getRowModel().rows` (`row.getIsGrouped()`), so a group header is a reclassification of a row already in the list, not an insertion — and `ui-spec/…/data-table/behavior.md:424` agrees ("only root rows are classified"). At most one module may claim a row. |
| **`tableDisplayRows(ctx)`**   | Table-scoped display rows. **Added for U5:** a `scope: 'table'` footer row hangs off no record row, so `displayRows` has nothing to attach it to. The view routes `kind: 'footer'` into `<TableFooter>`.                                                                                                                                                  |
| **`rowPresentation(ctx)`**    | Per-record-row `className`/`style`/`expanded`/`sticky`/`stickyOffset`. **Added because F3 shipped `TableRow.expanded`/`sticky`/`stickyOffset` that a hand-written composition can reach and no feature module could** — the same "satisfiable at the primitive, unreachable from the grid" defect NB-6 named one layer up.                                |
| **`effects(ctx)`**            | A hook run once per render, in manifest order. **Added for U10:** the plan puts the restore _engine_ in DataTable, and without this a feature module has no way to run a hook. Safe because the manifest is a static ordered list, so hook order is stable.                                                                                               |

### `data` has two owners at two layers, and one of them is not here

`engineOptions` may contribute `data`, and in **this** registry the `tree` feature
owns it. That statement is only half the picture, and the half that was missing is
the dangerous one.

**`data-grid-config/data-state.tsx` also contributes `data`**, returning an empty
array when `status` is `empty` or `error` so that a forced state keeps counts,
pagination and the state region consistent with what is rendered. The two
registries cannot see each other's collision checks, so this is not a contest —
it is a **sequence**: the config layer's value becomes the controller's `data`
prop, and a feature's contribution is applied over it afterwards.

Which fixes what a feature must copy: **the array it copies has to be the
post-`dataState` one.** Copy the caller's raw rows instead and a grid with
`dataState: { status: 'error' }` _and_ `tree` configured will have the feature
re-inject the rows `dataState` deliberately blanked, and data renders underneath
the error alert.

**So call `ctx.graftData`, which is bound to the correct array.**

```ts
engineOptions(ctx) {
  return { data: ctx.graftData(myMachine.generation) };
}
```

**The array itself is deliberately not on the module-facing context.** The
capability a feature needs is "copy the correct array, keyed on an invalidation
token" — not "read the rows during option build", which is exactly where the memo
hazards live. A bare member would grant the second to every module in order to give
one module the first. So the correct array is not merely the easiest to reach, it is
the **only** one reachable: there is no route from a feature to the caller's raw
rows. (`ctx.table()` would not help either — it is a thunk over a `const` declared
later in the controller, so it is a temporal dead zone in an option literal's body,
and `data` is a value rather than a closure.)

A feature that genuinely needs to read rows at option-build time has to come and
ask, which is a review rather than a discovery.

`graftData` ships the memo instead of documenting it, because the failure is
asymmetric and quiet: copy too rarely and children never appear; copy every render —
the default for a hand-written version — and the row model rebuilds continuously
instead of never, on a component whose purpose is large datasets. That second one is
correctness-neutral, so nothing would catch it, and "remember to memoize" is not a
mechanism.

The invalidation half is settled and measured: `getCoreRowModel` is
`memo(() => [table.options.data], …)`, so a new `data` identity is what makes the
row model re-walk and pick up children `getSubRows` already returns. With the copy
the child enters `flatRows`; without it the child never arrives even though the
children are in the store and a render happened. Two rules follow — copy **once per
arrival**, not per render, or the row model rebuilds continuously instead of never;
and return the caller's array **unchanged** before anything has arrived.

A second module in _this_ registry contributing `data` throws, naming both
claimants and the key, and `__tests__/data-table-features.test.tsx` asserts that
message.

### The points do not all run at the same time

**`engineOptions` and `renderContext` run during the controller's render.
`effects` runs after it.** So a value published by `effects` does not exist yet
when the other two are invoked, and **reading it in their bodies captures the
inert stand-in for the life of the table, silently.**

```ts
// WRONG — `machine` is the stand-in forever, and nothing ever says so.
renderContext(ctx) {
  const machine = machineFor(ctx.table());
  return { row: () => ({ tree: { loadState: machine.stateFor(...) } }) };
}

// RIGHT — read it inside the closure, which runs during the view's render.
renderContext(ctx) {
  return { row: (row) => ({ tree: { loadState: machineFor(ctx.table()).stateFor(row.id) } }) };
}
```

This is the `ctx.table` thunk hazard in a second location, which makes it a
property of **contribution-point ordering** rather than of one accessor: anything
whose value is established in `effects` must be read inside a closure the later
phase invokes, never captured in the point's body.

Two consequences already hit:

- A `loadChildren` request belongs in `effects` and nowhere else. Starting one from
  `displayRows` or `renderContext` is a side effect in a render path.
- A contribution that needs per-table state **before** options are built has no
  home today, because `engineOptions` runs before `effects` and there is no earlier
  phase. That is an open mechanism question, not a thing to work around locally —
  escalate it.

### `renderContext` is a resolver, not a record

ADR-0002 sketched it as a flat record of fields. That cannot work: the point is
invoked once per table, and the fields Wave 1 needs are per-row or per-header
(U2's `loadState` is keyed by row ID, U7's faceted values by column). So each
scope returns a function; a per-table constant is a closure that ignores its
argument.

```ts
renderContext: (ctx) => ({
  row: (row) => ({ tree: { loadState: ctx.machine.stateFor(row.id) } }),
});
```

The `detail` and `tree` namespaces are merged **one level deep**, so setting
`tree.loadState` does not discard `depth`, `hasChildren` and the toggle command.
Every other key replaces.

### `ColumnPresentation` — the header-cell seam

`data-table-view.tsx` builds `<TableHead>` with fixed children, and neither F3's
pin hook nor a DataGrid body slot reaches inside a header cell. `headerAdornments`
is that seam, and it is **the only sanctioned way to put chrome inside a
`<TableHead>` without reopening the view**.

```ts
interface ColumnPresentation {
  /** Applied to the column's <TableHead> and every <TableCell>. */
  readonly style?: StyleValue; // width, min/max-width, sticky offsets
  readonly className?: ClassValue;
  /** Rendered inside <TableHead>, in placement order. */
  readonly headerAdornments?: readonly ColumnAdornment[];
}

interface ColumnAdornment {
  /** Unique across contributing features; a collision throws. */
  readonly id: string;
  readonly placement: 'before-label' | 'after-label' | 'edge';
  readonly node: ReactNode;
}
```

**Placement is not cosmetic — it decides whether your control works.**

| Placement                      | Renders                                                                     | Use for                                                               |
| ------------------------------ | --------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `before-label` / `after-label` | `<TableHead>` children, **inside the sort `<button>`** on a sortable column | Non-interactive decoration only — a unit hint, an info icon           |
| `edge`                         | `TableHead`'s `trailing` slot, a **sibling** of the sort button             | **Anything focusable or clickable** — a resize handle, a reorder grip |

`edge` is the only placement that may hold a control. A records grid is normally
sortable _and_ resizable, so a control in `before`/`after-label` is not an edge
case: its pointer release fires `onSort`, Enter/Space sorts instead of acting, and
the sort button's accessible name absorbs its label — the last being a `must`
grammar rule.

`pinned` / `pinOffset` reach `TableHead`/`TableCell`'s own pin hook, which is what
sets `data-pinned`. **Do not hand-roll a pin with `style`.** `data-pinned` is the
selector every pin-related specificity step keys off, including the row's
`hover:[&>[data-pinned]]` and `data-[state=selected]:[&>[data-pinned]]` rules — and
a pinned cell is opaque, so without the attribute it repaints over the row's hover
and selected tint. No DOM test sees that; the visual baselines would be the first
sign.

Placement order is `before-label → after-label → edge`, ties broken by manifest
order. **No `table.tsx` change is needed** — `TableHead` merges `className` via
`cn()` and spreads props, so an `edge`-placed handle positions itself with
`className: 'relative'` from the same contribution. U3's resize handle and reorder
grip mount here.

## Capabilities with no point of their own

Two config members are reachable but not through a contribution point. Both are
listed here so nobody searches for a seam that does not exist.

- **`footer.sticky` → the `stickyFooter` view prop.** A footer feature's
  `renderDisplayRow` returns the `<TableRow>` that goes _inside_ `<TableFooter>`, so
  it cannot reach the section element. `DataTableViewProps.stickyFooter` is the
  route; U5 supplies it from the DataGrid side through `viewProps`, exactly as U9
  does for the rest of the appearance cluster. There is no `sectionPresentation`
  point and there does not need to be one.
- **`tree.indent` has no dedicated seam, and does not need one.** Indentation is
  per-cell and depth-driven, and `row.tree.depth` is already on the row render
  context. Two working routes: set a row-level CSS custom property from
  `rowPresentation` (`style: { '--tree-depth': depth }`) and consume it with a
  column class from `columnPresentation`; or indent inside the cell renderer —
  U2's own DataGrid column-cell transform, which is where its expander lives
  anyway. **Do not look for a `cellPresentation` point.** One was considered and
  rejected: `ColumnPresentation` is keyed by column, per-cell content wrapping is
  what the DataGrid `columns` transform already does (that is how shipped `filters`
  attaches `operatorFilterFn`), and a per-(row, column) point would run for every
  cell to serve two features.

### `rowPresentation`'s four discrete members are kept, and they are not held

`className`, `expanded`, `sticky` and `stickyOffset` have **no production filler**
and stay regardless. #50 ruled it; the reasoning below is the worked example for
rule 7d's subject clause, and it applies to all four, not only to `expanded`.

**They are not unverified.** `__tests__/data-table-seams.test.tsx:315-338` fills all
four through a `<Harness />` fixture and asserts each one reaches the DOM, with a
companion test that an untargeted row receives none of them. So "nothing fills it"
was only ever true of _shipped feature modules_ — a contributor-side sweep cannot see
a test filler, and an earlier revision of this section said "nothing fills it today"
without that qualifier. **Say which sweep produced the finding**; the two claims have
different remedies.

**They exist because F3's `TableRow` ships `data-expanded`, `sticky` and
`stickyOffset` behaviour that no feature can otherwise reach** — the same
"satisfiable at the primitive, unreachable from the grid" shape as NB-6. A
detail-bearing _record_ row is rendered by the view, not by the feature, so
`rowPresentation` is its only route.

**It is styling only. ARIA is not its job.** `aria-expanded` on a row inside
`role="table"` is invalid, so `TableRow` emits `data-expanded` alone and the
disclosure _button_ carries `aria-expanded`/`aria-controls` — which is where the
spec's anatomy puts it, and what U1's expander already does.

**All four were annotated "held for U4, expiry: U4's landing", and that hold was
impossible from the day it was written.** `composeRowPresentation` is called only
from `renderRecordRow`, which the view runs for `kind: 'data'` rows alone, so a
feature-rendered row never reaches this point at all — stated plainly:
**`rowPresentation` cannot decorate any row a feature renders**, only record rows.
U4 duly set `expanded` and `sticky` directly on the `<TableRow>` its own
`renderDisplayRow` returns. The hold named a consumer the seam could not deliver to,
which is a defect in the _annotation_ and says nothing against the members.

**They are KEPT, and not conditionally** — and the earlier "if U1 does not fill it,
delete it" was wrong twice over: wrong to make the member conditional, and wrong
about who the alternative route belongs to. The subject is the **row**, not the
feature. A feature that renders its own row has another route; a view-rendered record
row has none. Deleting these would remove the only route to a capability rather than
an unused member.

Whether U1 _should_ fill it is a live spec question, not a cleanup — see #79.
`table.tsx` ships a real `data-[expanded=true]` style rule that paints the row with
the hover surface and keeps pinned cells in step, so a group header looks open today
and a record row with its detail panel open does not. Either answer changes what a
user sees, so it is settled from the spec rather than by whoever holds the file.

## The body-window seam

Virtualization wraps the whole row list rather than decorating one row, so it is
**not** a contribution point. `../data-table-body-window.ts` is the seam: F2 ships
the identity implementation and **U6 replaces that file wholesale**.

Its signature is deliberately wider than the identity implementation needs, so U6
never reopens the view. **Every member is consumed by the view today** — that was
not true when the seam first landed, and it is the difference between a seam and a
decoration:

| Member                           | Who consumes it                                                                                                                                 |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `rows`                           | The view renders exactly these, splitting `footer` rows into `<TableFooter>`.                                                                   |
| `paddingTop` / `paddingBottom`   | Spacer rows, rendered only while `isWindowed`.                                                                                                  |
| `measureRow`                     | A ref on **every** rendered display row — records and feature-rendered rows both.                                                               |
| `scrollToRecord` `measureLayout` | Published to the controller, backing the two pre-declared toggle actions.                                                                       |
| `containerRef` (input)           | The ScrollArea **viewport** — the element that scrolls and carries `data-bounded`. A ref on the ScrollArea root reports `scrollTop: 0` forever. |

Two contracts to know:

- **Indices address the seam's own list.** `measureRow` receives the index into the
  `rows` array _you returned_, before the view splits body from footer. Both the
  record rows and a table-scoped footer share one index space.
- **Measurement of a feature-rendered row arrives by cloning**, because the view
  does not own that element. `renderDisplayRow` must therefore return **one
  ref-forwarding element** (a `<TableRow>`) for measurement to reach it. Anything
  else still renders, just unmeasured.

`scrollToRecord` and `measureLayout` reach the controller through
`controller.getViewBridge()` — one stable object the view populates in an effect
and clears on unmount. The controller owns the toggle-action union but cannot reach
the view's scroll container, so **pre-declaring a union member is not by itself
enough to make an action implementable**; this bridge is the other half.

Windowing applies to the **display-row** list, not `getRowModel().rows` — which is
what makes design §7's "virtual rows preserve row index/count metadata"
satisfiable, since every display row carries `recordIndex`.

## Pre-declared `DataTableToggleAction` members

The action union in `data-table-controller.ts` is the same hand-listed-surface
problem as the options unions, in a second union. F2 pre-declared the members its
downstream units need, **with switch arms in place**, so no Wave 1/2 unit reopens
the controller for an action:

| Member           | Owner  | Today                                                                       |
| ---------------- | ------ | --------------------------------------------------------------------------- |
| `measure-layout` | **U6** | Dispatches to the seam's `measureLayout`. Replaces the legacy `doLayout()`. |
| `scroll-to-row`  | **U6** | Dispatches to the seam's `scrollToRecord`. Takes a **record** index.        |
| `toggle-group`   | **U4** | Throws "not implemented yet". Needs a state slice, not a view handle.       |

The two windowing actions **already have a path** — implement them in
`data-table-body-window.ts` and they work, with no controller edit. They still
throw while the seam supplies nothing, and again after the view unmounts: a shipped
action that quietly no-ops is worse than one that says it is not implemented, and a
stale handle pointing at an unmounted scroll container is worse than both.

`toggle-group` is different and deliberately still throws: group collapse needs a
`DataTableState` slice rather than a view handle, and `DataTableState` has none yet.
U4 adds it in `data-table-contract.ts` and `data-table-state.ts`, both of which U4
owns — the controller's `STATE_SLICES` is derived, so U4 still does not open the
controller.

## Display rows

```ts
type DataTableDisplayRow<TData> =
  | { kind: 'data'; row; depth; recordIndex }
  | { kind: 'detail'; parent; recordIndex; domId }
  | { kind: 'group'; row; groupId; depth; recordIndex }
  | { kind: 'tree-status'; parent; recordIndex; status; domId }
  | { kind: 'footer'; scope; groupId? };
```

**The engine produces record rows; the view derives a display-row list.** Three
consequences bind every later unit (ADR-0001):

- **Pagination counts records, not display rows.** A `pageSize` of 25 renders 25
  `kind: 'data'` rows plus whatever they project. Tree descendants _are_ records
  and _do_ consume page slots (OQ-2); a detail row does _not_ (OQ-1).
- **Roving focus and striping index records.** Every display row carries
  `recordIndex` for exactly this reason. Arrow-Down from a row with an open detail
  panel lands on the next record, not on the panel.
- **Group and tree-status rows are synthetic** and carry no record ID (§6.5).

`group`, `tree-status` and `footer` are dispatched but have **no renderer** — the
owning unit supplies one. An unhandled kind **throws**; a kind that rendered
nothing would be a blank row nobody could trace to a missing module.

## The hazard that breaks silently — and its loud twin

**Two different failures, and seeing one will not help you recognise the other.**
Both come from reading a value in a point's body that only exists later.

|            | Where the value comes from                                              | What you see                                                                                                                                                                     |
| ---------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Loud**   | the `table` const itself — `ctx.table()` in the body of `engineOptions` | A thrown `TypeError` naming the rule and the remedy. Before that guard existed it was a bare `ReferenceError: Cannot access 'table' before initialization`, which named neither. |
| **Silent** | anything `effects` publishes — a machine, a store, a ref                | **Nothing.** You capture the inert stand-in and keep it for the life of the table. The feature runs, renders, and does nothing.                                                  |

The loud one is now guarded and asserted
(`__tests__/data-table-lazy-table-accessor.test.tsx`). **The silent one cannot be
guarded**, because reading a stand-in is indistinguishable from reading a real
value — which is why it gets a rule (the ordering clause above) rather than a
check, and why `effects`-published values must be read _inside_ the closure the
later phase invokes rather than captured in the point's body.

If you are here because of the loud error: the fix is not to move the value
earlier. It is to move the _read_ later.

### A third sibling: an option that looks reactive and is resolved once

The two above are about **when you read a value**. This one is about **when
TanStack reads your contribution**, and it is worth its own entry because the
remedy is the opposite one — you cannot fix it by moving a read.

**A row-model option is resolved on first use and cached forever.** `getRowModel()`
does, for the expanded model:

```js
if (!table._getExpandedRowModel && table.options.getExpandedRowModel) {
  table._getExpandedRowModel = table.options.getExpandedRowModel(table);
}
```

`_getExpandedRowModel` is assigned once and **nothing in table-core ever clears
it** (checked across the whole build output). `getGroupedRowModel`,
`getSortedRowModel` and the rest follow the same `_get…` pattern, so treat them
all this way until proven otherwise.

**What that forbids: a _conditional_ contribution whose function identity flips.**
`engineOptions` runs every render, so it is natural to gate a row model on live
state — and it works on the first render and never again. U4 built exactly that:
`grouping` and `tree` both need the expand stage, so the two modules were given
exactly complementary guards on `ctx.state.grouping.length`. Asking each module
what it contributed agreed the count was one in **both** states. The feature was
still broken: a table that starts ungrouped keeps tree's model for life, so
enabling grouping later renders group headers with **no members**.

Three consequences for anyone contributing a row model:

- **One owner, unconditionally-ish.** Absent → present is safe, because the cache
  is only populated once the option exists. Owner A → owner B is not. So if two
  features need one stage, one of them owns it outright and its implementation
  serves both — which is why `grouping.tsx` owns `getExpandedRowModel` and
  `tree.ts` contributes none.
- **Read live values inside the returned closure, never in the factory.** The
  factory runs once. `grouping.tsx` reads its collapse slice and its ungrouped
  policy off `table.options` per call for this reason; capturing them as factory
  arguments froze the first render's answers.
- **The only test that catches it crosses the transition at runtime**, in one
  controller: group, assert members reach the row model; ungroup, assert tree
  expansion still works. Per-module assertions about what each contributes pass
  cleanly while the table is broken, because the mechanism they check is
  genuinely satisfied.

`FeatureContext.table` is a **thunk**, and it is load-bearing twice over:

```ts
// tree.ts — correct
onExpandedChange: (updater) =>
  ctx.requestChange(ctx.gates.expandedSlice, (previous) =>
    recordToSet(
      resolveUpdater(updater, setToRecord(previous)),
      ctx
        .table()
        .getCoreRowModel()
        .flatRows.map((row) => row.id)
    )
  );
```

`onExpandedChange` reads `table.getCoreRowModel().flatRows` inside a callback
declared in the literal that produces `table`, and the slice it writes to is
`gates.expandedSlice`, computed _before_ `useReactTable` runs. **Hoist either and
nothing fails loudly** — the two `ExpandedState === true` tests in
`data-table-controller.test.tsx` are the only things that catch it, one per
binding. Keep them as two.

## Expansion domains (ADR-0001)

`tree` owns TanStack's single expand/collapse feature, because
`getExpandedRowModel()` walks `row.subRows` only. Detail expansion is a
render-layer projection over `detailExpanded` with no row-model involvement.

Two F1 behaviors to preserve rather than "fix":

- **The `expanded` binding is conditional.** It is bound to `treeExpanded`
  _except_ on the frozen legacy path (`getRowCanExpand`/`renderExpandedRow` and no
  tree), where it stays a boolean carrier over `detailExpanded` so caller column
  defs calling `row.getIsExpanded()` behave as before. Binding it unconditionally
  turns `data-table.test.tsx` red.
- **`getSubRows` alone means tree**, with or without a `tree` config.

## Verification

```bash
pnpm --filter @constructor-lab/ui-react test
pnpm --filter @constructor-lab/ui-react typecheck
pnpm --filter @constructor-lab/ui-react lint
```

**Read `Test Files`, not `Tests` — or just trust the exit code.** Since the Vitest
typecheck gate was enabled, a file that fails to _collect_ (a `vi.mock` hoisting
`ReferenceError`, zero tests executed) reports:

```
 Test Files  1 failed | 1 passed (2)
      Tests  4 passed (4)
Type Errors  no errors
```

Those four are the typecheck twin, which passes precisely because a file that never
ran has no type errors. Before the gate it read `Tests 0 passed`, which was honest.
The exit code and `Test Files` are both correct, so CI is safe — but grepping
`Tests |Type Errors`, which is how most of us verify, shows nothing but green for a
suite that did not run.

**Run `tsc` once per command.** Two `pnpm exec tsc` invocations in one shell line
race and report phantom error counts. Capture to a file and read the exit code.

Never `pnpm -r test` — a tool workspace's golden test builds into the committed
`packages/tokens/{css,scss,js,dtcg}`, and an aborted recursive run leaves those
directories deleted (`git checkout -- packages/tokens` restores them).

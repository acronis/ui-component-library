# `data-grid-config` — the DataGrid config registry

The DataGrid half of [ADR-0002](../../../../../../../.ai/plans/adr/ADR-0002-internal-feature-module-registry.md).
This is the contract to code against when you add a behavior group.

`data-grid.tsx` used to hand-list every group in eight places: the
`DataGridGroupedConfig` interface, a **total-record** `satisfies` over its keys,
the resolved shape, the resolver, the resolved-field destructure, the
`useDataTable({…})` assembly, the column assembly, and the JSX render body. Each
was one contended line, and the total record made the file _fail to compile_
until a new group was added to it — so no two people could add a group at once.

All eight are now derived from the module list in [`index.ts`](./index.ts).

## Ownership

**You own exactly one file here.** Every file also carries an `OWNERSHIP:` header,
so the answer is visible where you are working and not only in this table.

| File                  | Owner                      | State                                                                         |
| --------------------- | -------------------------- | ----------------------------------------------------------------------------- |
| `registry.ts`         | **F4/F5** (on standby)     | The mechanism. A seventh contribution point or a sixth map escalates.         |
| `compose.ts`          | **F4/F5** (on standby)     | The runtime half of the mechanism.                                            |
| `index.ts`            | **append-only shared**     | The module list. Add your own entry; see _Adding a group_.                    |
| `filters.tsx`         | **U7**                     | Shipped wiring; `facet` + multi-column global search to come.                 |
| `server.ts`           | **U8**                     | Complete for P1. `all-results` _display_ is U8's too, but in `selection.tsx`. |
| `pagination.tsx`      | **U8**                     | Complete. Chrome is `../data-grid-pagination.tsx`, not the frozen adapter.    |
| `sorting.ts`          | **U9**                     | Shipped wiring; `cycle` + `maxColumns` to come.                               |
| `selection.tsx`       | **U9** (`all-results`: U8) | Shipped wiring; `reserve`, `selectByRow`, `selectAllOnIndeterminate`.         |
| `appearance.ts`       | **U9**                     | Shipped `striped`; the rest of the cluster to come.                           |
| `toolbar.tsx`         | **unassigned** — see below | Complete. Reads `resolved.filters`.                                           |
| `actions.ts`          | F4                         | Complete.                                                                     |
| `callbacks.ts`        | F4                         | Complete.                                                                     |
| `data-state.tsx`      | F4                         | Complete. Reads the string half of the shared `state` prop.                   |
| `row-interaction.ts`  | F4/F5                      | Complete.                                                                     |
| `state.ts`            | F5                         | Complete.                                                                     |
| `detail-expansion.ts` | **U1**                     | Template.                                                                     |
| `tree.ts`             | **U2**                     | Template.                                                                     |
| `columns-features.ts` | **U3**                     | Template.                                                                     |
| `grouping.tsx`        | **U4**                     | Complete. `.tsx` — its `renderGroup` default mounts DataGrid chrome.          |
| `footer.ts`           | **U5**                     | Template.                                                                     |
| `virtualization.ts`   | **U6**                     | Template.                                                                     |
| `persistence.ts`      | **U10**                    | Template.                                                                     |

**`toolbar.tsx` is the one coordination hazard on this side.** It is complete and
unassigned, but it _reads_ `resolved.filters` — `searchColumn`, `searchPlaceholder`,
and `definitions.length` for the `columnFilters` warning. U7 owns `filters.tsx` and
will change that resolved shape (`global.columnId` → `columnIds`, plus `facet`), so
U7's change breaks this file. U9 has no reason to touch it. **Whoever needs to edit
it escalates to the team lead first** rather than both units discovering the overlap
in the same file. The safest sequencing is for U7 to carry the `toolbar.tsx` edit its
own change requires.

## What a new group owes

Four things, and only the first is obvious. The atom is all four — there is no
half-landed state, because the compile-time assertion in `index.ts` makes the
module and its registration one step.

| #   | Edit                                                                                               | Who applies it               | If you forget                                         |
| --- | -------------------------------------------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------- |
| 1   | your `<group>.ts` module                                                                           | you                          | nothing works                                         |
| 2   | the import + array entry in [`index.ts`](./index.ts)                                               | **you** — append-only shared | **the workspace typecheck goes red for everyone**     |
| 3   | the two pins in [`../__tests__/data-grid-config.test.tsx`](../__tests__/data-grid-config.test.tsx) | **you** — append-only shared | that suite goes red, and the failure now tells you so |
| 4   | the public-type line in `data-grid/index.ts`                                                       | **integrator** — stage it    | your config type is unreachable from the package      |

Item 3 is the one with no other signal, and it is the one that has actually been
missed. Item 4 is the only genuinely staged edit, because nothing depends on a
barrel line to build or test.

### There is no half-landed state

Items 1–3 plus **your chrome** are one indivisible commit. Not a style
preference — you cannot split them even if you want to:

- Declaring your group on `DataGridGroupedConfigMap` is itself what trips
  `_AssertEveryConfigRegistered`, so the declaration and the manifest line cannot
  be separated.
- Removing the augmentation to "land the config surface first" breaks your own
  module, because its `props.<group>` and `resolved.<group>` references depend on
  it.
- Landing the config without the chrome declares members that reach nothing —
  `render`, `indent`, `column` and their like. That is the defect class this
  programme hit five separate times: a capability declared, reachable, and empty.

The consequence if you try anyway: a half state makes your module an **error file
in every other unit's `tsc` run**, which is the attribution cost everyone here has
been working to remove. So there is no "config now, chrome after" option — plan the
unit as one landing.

### A fifth thing, if your module needs JSX: delete the `.ts` template

Every stub here is a `.ts`, and a module that renders anything — a cell transform, a
chrome slot — has to become a `.tsx`. **`git rm` the `.ts` in the same commit.**
Leaving both makes `./<group>` ambiguous, **Vite and `tsc` resolve it differently**,
and the symptom is nothing like the cause: `footer.ts` and `footer.tsx` coexisted for
one commit and seven suites failed with
`TypeError: Cannot read properties of undefined (reading 'kind')` from
`index.ts`'s manifest map — while `pnpm typecheck` stayed **green**, because tsc
picked the other file. An hour to diagnose from that error.

This recurred exactly as predicted: `grouping.ts` became `grouping.tsx` when U4
landed its group-header chrome. `virtualization.ts` and `persistence.ts` are still
`.ts` templates and U6 and U10 may each need JSX.

## Adding a group

Two steps. Neither touches `data-grid.tsx`.

1. **Write `<group>.ts`.** Declare the group's config and resolved shapes, put
   them on the registry maps, and export one module. Each stub file in this
   directory (`virtualization.ts`, `persistence.ts`, …) already spells this out for
   its group.
2. **Append your own import and array entry** to [`index.ts`](./index.ts).

`index.ts` is **append-only shared, not integrator-staged**, and the reason is
correctness rather than convenience: `_AssertEveryConfigRegistered` fails to
compile when a group is declared on the registry maps but missing from the array,
so **declaring a group and registering its module are one atomic step**. Split
across two commits, the intermediate state turns `pnpm --filter
@constructor-lab/ui-react typecheck` red for the whole checkout — which is what
happened when a unit followed the old staging instruction.

**Choose your array position deliberately, and say why in the docblock.** Position
is placement in the column fold, so only you know what your column has to sit
behind. See _The committed order_ below.

Rules, as for every append-only shared file: pull immediately before touching it,
strictly append, never reorder or reformat another unit's lines.

If a new public type needs to reach package consumers, **that** line is genuinely
integrator-staged: `data-grid/index.ts` is a barrel nothing depends on to build or
test, so stage it in `.ai/team/table-parity-p1/integration/<unit-id>.md` and use the
internal `'../data-grid-config'` path in your own type test meanwhile.

## Declaring the prop surface

A group is part of `DataGridProps` because its own file says so:

```ts
declare module './registry' {
  interface DataGridGroupedConfigMap<TData> {
    tree: false | DataGridTreeConfig<TData>;
  }
  interface DataGridResolvedConfigMap<TData> {
    tree: ResolvedDataGridTree<TData>;
  }
}
```

Five maps, all augmentable from any module file:

| Map                          | What declaring on it does                                                                 |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| `DataGridGroupedConfigMap`   | adds a **behavior group**: a `DataGridProps` member, preset-addressable, alias-normalized |
| `DataGridTopLevelConfigMap`  | adds a non-group prop (`server`, `state`, the cell events) — never preset-addressable     |
| `DataGridDeprecatedAliasMap` | adds a deprecated flat alias that normalizes into a group                                 |
| `DataGridResolvedConfigMap`  | adds the module's entry in `ResolvedDataGrid`, which is all the render body reads         |
| `DataGridIdentityFreeMap`    | declares what the group's prop may be **without `getRowId`** (the identity rule, §3.1)    |

**If your feature needs stable row identity, declare it on
`DataGridIdentityFreeMap`.** That is what makes `getRowId` required for it — the
identity-free branch of `DataGridProps` is derived from this map, so a feature that
skips it silently becomes usable without identity. Declare the narrowest safe
shape, not a blanket `false`: `rowInteraction` declares
`{ current?: false; onClick?: …; onHover?: … }`, because only `current` is keyed by
row id while the handlers receive the row object.

**Declare a prop in exactly one map.** `DataGridProps` is an intersection of the
derived halves, so a prop declared twice intersects rather than unions — `state`
would collapse to `never`. When two modules must read one prop, one declares it as
the union of both forms and the other narrows at resolve time; `state` is declared
by `state.ts` and read by `data-state.ts`.

Declaring on `DataGridResolvedConfigMap` without registering the module in
`index.ts` fails to compile — `_AssertEveryConfigRegistered` is what replaced the
total record. The fix is one line in `index.ts` — which you add yourself, in the
same change — not an edit to the grid.

**Do not declare a group before it works.** A map entry is a public `DataGrid`
prop; declaring it early ships a prop that silently does nothing.

## The six contribution points

Every one is optional except `resolve`.

| Point               | Signature                              | Notes                                                                                       |
| ------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------- |
| `resolve`           | `(ctx) => { value, warnings? }`        | Normalizes props + aliases. `ctx.resolved` holds the groups resolved **before** this one.   |
| `columns`           | `(columns, ctx) => columns`            | A **transform**, not an injector — position is placement.                                   |
| `controllerOptions` | `(ctx) => Partial<ControllerOptions>`  | Folded into the one shared `useDataTable({…})`.                                             |
| `viewProps`         | `(ctx) => Partial<DataTableViewProps>` | Folded into the one `<DataTableView/>`. **An unknown key is silently dropped** — see below. |
| `chrome`            | `(slot, ctx) => ReactNode`             | Slots: `top`, `toolbar`, `under-toolbar`, `bottom`.                                         |
| `reads`             | `readonly string[]`                    | Extra props `resolve` reads — see _Referential stability_.                                  |

### An unknown `viewProps` key is silently dropped — deliberately

`controllerOptions` has a runtime guard that throws on a key the controller does
not have, because a contribution is written as conditional spreads and **an unknown
key inside a spread escapes TypeScript's excess-property check**. `viewProps` has
the same blindness and **no guard**, which is a decision rather than an oversight:

- A dropped **view prop** is presentational, so it surfaces in a story or a
  snapshot the first time anyone looks. A dropped **controller option** is
  behavioural and invisible until someone tests that exact configuration — which is
  why only that one earned a guard.
- A completeness assertion over `DataTableViewProps`, which is owned elsewhere and
  still growing, would break _in this directory_ every time a view prop is added.
  That is the cross-unit contention the registry exists to remove.

So when you contribute a view prop: **check the key against `DataTableViewProps` by
hand, and assert the rendered result in a test rather than trusting the
type-check.** If a dropped view prop ever ships, that is the signal to guard this
point too.

`controllerOptions` and `viewProps` are **additive and collision-checked**: two
modules setting the same key throws, naming both. A module that conditionally
opts out returns `undefined` for the key rather than omitting the point.

## The committed order

`index.ts`'s array order is the one order used for resolution, the column fold,
controller options, and chrome. `../__tests__/data-grid-config.test.tsx` pins it.
Two things fix it:

- **Resolution** — `pagination` and `callbacks` read `server`; `toolbar` reads
  `filters`. A module may only read what precedes it.
- **Columns** — the pipeline is a fold, so `filters` rewrites the caller's defs,
  `actions` splices its column at `placement`, and `selection` prepends
  `__select__` in front of both.

If your group needs a different relative position, that is a real change to a
committed invariant: say so rather than reordering quietly.

## Referential stability

A new columns array invalidates TanStack's memoized row model, so churning the
assembled column set rebuilds the row model on **every render** of every grid.
(The shipped comment this replaced said it also reset row selection. It does not —
selection is keyed by row id in the controller's own state, and a test confirms it
survives a fresh columns array. The cost is the rebuild, which is enough.) Two
rules follow.

- `resolve` is memoized on the exact props the registry declares it reads, not on
  the props object, which React reallocates every render. A `grouped` module
  implicitly reads its own `key`; anything else — including everything a
  `top-level` module reads — goes in `reads`. **Declare it**, or your group will
  resolve against a stale prop. Declare it too broadly and you rebuild the row
  model every render.
- `callbacks` is deliberately _not_ a resolve dependency: the `callbacks` module
  resolves nothing and projects per render. Read named callbacks from
  `context.callbacks` in `controllerOptions` / `viewProps` / `chrome`, and accept
  that a `columns` contribution reading them ties the column set to `callbacks`'
  identity.

## Type erasure

The manifest is a module-scope constant, so it cannot be generic: modules are
declared over `unknown` rows and the composer instantiates them once per grid.
Nothing inside a module body needs `TData` — every value a module passes through
(`isRowSelectable`, `onClick`, `bulkActions`, …) arrives already typed from
`DataGridProps`, and the public surface stays fully generic.

## System column ids

Import them; do not repeat the literals:

- `DATA_GRID_SELECTION_COLUMN_ID` from [`selection.tsx`](./selection.tsx)
- `DATA_GRID_ACTIONS_COLUMN_ID` from [`actions.ts`](./actions.ts)

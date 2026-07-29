# Table parity P1 — surface readiness inventory (member gaps in the nine shipped groups)

> **Provenance note.** This researcher's operating constraints prevented it
> from writing its own findings file. The content below was captured
> verbatim from its text report to the team lead and transcribed here by the
> tech-writer, not authored directly by the tech-writer. Tables and
> file/line specifics are preserved as reported; nothing has been
> re-verified against the source in the course of transcription.

- **Scope:** the nine of sixteen designed behavior groups that already ship
  as `DataGrid` props, checked member-by-member against design §5.2. Also
  `getRowId`, `state`/`defaultState`, and the `apps/demo` `/data` route as a
  concrete parity case study.
- **As of:** commit `6ad26a7` (branch `feat/table-parity`).
- **Not in scope:** the seven groups that do not exist as props at all
  (`detailExpansion`, `tree`, `grouping`, `virtualization`,
  `columnsFeatures`, `persistence`, `footer`) — owned by the other
  researcher (`researcher-engine.md`).

## Member gaps in the nine shipped DataGrid groups

Nine of sixteen designed behavior groups ship as DataGrid props as of commit
`6ad26a7`. Only `actions` matches its designed member list; the other eight
are subsets.

| Group | Shipped | Missing (design §5.2) | What each needs | Independent of the 7 unshipped P1 groups? |
|---|---|---|---|---|
| selection | `mode`, `showSelectAll`, `isRowSelectable` (3/10) | `selectAll`, `reserve`, `range`, `selectByRow`, `selectAllOnIndeterminate`, `treeCascade`, `groupScope` | `reserve` trivial (controller supports it, DataGrid doesn't pass it through). `selectByRow`/`selectAllOnIndeterminate` DataGrid render only — note plan §P0.5 claims these delivered but they are absent from shipped code. `selectAll:'page'/'loaded'` render change; `'all-results'` needs `server.selection`. `range` is DataTable engine work, labeled P1 in the disposition table. `treeCascade`/`groupScope` depend on tree/grouping. | Yes except `treeCascade`/`groupScope` |
| sorting | `mode` (1/3) | `cycle`, `maxColumns` | Both already exist in the controller's sorting config — pure plumbing gap. | Yes |
| filters | `columns[].{columnId,label,operators}`, `global.columnId` | `columns[].facet`, `global.columnIds` (design is plural; shipped is singular), `logic` (type-only) | `facet` is real engine work: faceted row models are in the rejected-library-contract allowlist and never installed, plus a new multi-select chip/checkbox UI — today the control renders one operator Select and one text Input only. `global.columnIds` semantics for matching across N columns are unspecified even in the design. | Yes (`facet` touches DataTable, not a P1 group) |
| pagination | `pageSize`, `pageSizeOptions` | `showPageSize`, `showFirstLast`, `unknownTotal` | First two are pure UI toggles (currently unconditional; first/last are only responsively hidden). `unknownTotal` needs `server.hasNextPage`/`hasPreviousPage` plus an unknown-total presentation. | Yes |
| toolbar | `globalSearch`, `bulkActions` (2/6) | `columnFilters`, `viewOptions`, `leading`, `trailing` | All UI-only, but note a behavior divergence: design defaults `columnFilters` false and `viewOptions` true; shipped always renders both with no way to disable either. | Yes |
| actions | `items`/`render`, `placement`, `onAction` | none | — | Fully shipped |
| appearance | `striped` (1/15) | `background`, `size`, `width`, `height`, `maxHeight`, `showHeader`, `stickyHeader`, `borders`, and the six row/cell/header class+style resolvers | Two clusters. (A) box/surface — needs new Table-primitive variants; `Table`/`TableRow`/`TableHead` are fixed Tailwind classes today with no size/background/border/sticky variants at all. This is the only cluster reaching below DataGrid into the primitive. (B) class/style resolvers — self-contained; `DataTableView` already builds Row/Cell/Header contexts and just needs to accept and apply resolvers. | Yes |
| dataState | `status`, `empty`, `skeletonRows`, `error`, `onRetry` | `loadingMode` (skeleton/overlay), `append` | `loadingMode:'overlay'` self-contained. `append` has no technical dependency on the seven, but the plan sequences it inside P1.5. | Yes for `loadingMode` |
| rowInteraction | `current`, `onClick`, `onActivate`, `onHover` (4/7) | `activateOn`, `tooltip`, `onScroll` | `activateOn` — the view hardcodes Enter + double-click. `tooltip` — new row tooltip via the Tooltip primitive. `onScroll` — needs scroll-container tracking, sequenced with virtualization. | Yes for `activateOn`/`tooltip` |

Outside the nine groups: the top-level `server` config has only `query`,
`rowCount?`, `pageCount?`, `onQueryChange` — missing `hasNextPage`,
`hasPreviousPage`, `selection`, `onSelectionChange`, which are exactly what
`pagination.unknownTotal` and `selection.selectAll:'all-results'` require.
Independent of the seven P1 groups; sits in P0.7. Separately, `callbacks` is
missing the detail/tree/grouping/scroll members by deliberate design (they
land with their owning features), and `chrome`/`presets` are complete.

## `getRowId`

The controller already has the mechanism the plan wants — two exported call
signatures, one requiring `getRowId` when an identity-bearing feature is
present, one deprecated flat form where it stays optional. DataGrid cannot
reuse that directly: it is a JSX component with a single props interface,
not a hook with overloads, so enforcing "required" means either making the
props interface a discriminated union of a new branch and a deprecated
branch, or some other mechanism.

Census — 39 `<DataGrid>` call sites currently omit `getRowId`; 10 of those
use at least one grouped config and would need updating; the other 29 use
only flat aliases and should keep compiling under the deprecated overload:

- `data-grid/__tests__/data-grid.test.tsx` — 21 omit, 8 use grouped config
  (lines 204, 229, 579, 603, 637, 662, 682, 697); the other 13 at lines 39,
  56, 64, 70, 77, 91, 105, 113, 127, 140, 162, 180, 399 are flat-only
- `data-grid/__stories__/data-grid.stories.tsx` — 9 omit (Default,
  FullFeatured, Selectable, Loading, Empty, ErrorState, Striped, Sortable,
  MultiSort), all flat-only; later stories already pass it
- `apps/demos/src/data-grid/` — 6 across DataGridBasic, DataGridSelectable,
  DataGridPagination, DataGridStates (2), DataGridWithToolbar, all flat-only
- `apps/docs/content/docs/components/data-grid.mdx` — 3 inline samples
  omit, 2 of them use `dataState` (lines 87–88)
- `packages/ui-spec/components/data-grid/` — 2 flat-only samples; the spec
  text is already written to the target contract, and `behavior.md` lines
  144–154 already assert row-id is required even for an identity-free
  initial config
- `apps/demo/src/app/routes/data/` — does not use DataGrid at all

Also relevant: `data-table/__tests__/table-family-public-types.test.ts`
lines 82 and 85 pin the deprecated flat `state` and `onRowClick` types in a
compile-time assertion.

## `state` / `defaultState`

The controller fully implements the design's §3.2 rules already —
controlled slices emit requests without committing, uncontrolled slices
seed once from `defaultState`, supplying a slice in both fires a dev error
with controlled winning, and data-replacement reconciliation prunes
selection/detail/tree/current-row unless the feature's `reserve` is set. It
needs exposing, not building. DataGrid today only ever passes a
`state`/`defaultState` it synthesizes internally.

Three complications: (1) `DataGridProps` already has a deprecated flat prop
named `state` typed as the data-status string, pinned by the compile-time
test above — the names collide; (2) exposing `state` lets a caller supply
identity-bearing slices with no other identity config, making this the same
type-design problem as `getRowId`; (3) a small precedence change — today
`pagination.pageSize` is the only seed for the internal default, but the
design says a caller's `defaultState` must win over a config default.

Invalid combinations that become checkable once it lands: §5.1 rule 6
(server query slices vs the same slices in `state`/`defaultState`) needs a
new validation path; rule 7 (server selection vs `state.selection`) is not
yet enforceable because `server.selection` does not exist; rule 8
(persistence restoring only uncontrolled slices) is not live until P1.7.

## The `/data` demo route

`apps/demo/src/app/routes/data/DataTable.tsx` calls `useReactTable`
directly with hand-managed sorting/filters/selection/visibility, already
supplies `getRowId`, and renders through the individually-exported
DataTable companions.

- Blocker 1 confirmed — two discrete multi-select filters: `status` from a
  fixed list and `category` derived by uniquing the data, both rendered as
  a Checkbox list in a Popover with an array-inclusion filter function.
  Maps exactly to the missing `facet` member (`'unique'` for category, an
  explicit list for status) and needs engine work.
- Blocker 2 confirmed — a genuine initial sort on mount (`name` ascending).
  DataGrid can only enable sorting, not seed an order; needs public
  `defaultState.sorting`.
- Third blocker found, not previously suspected — the search box is wired
  to the `name` column but its filter function substring-matches across
  `name`, `category`, `status`, and `description`. The design's target
  `global.columnIds` specifies no semantics for one query across N columns,
  so the design cannot currently express what the screen already does.
  This needs a decision, not just implementation.
- Everything else already has a shipped equivalent: bulk delete →
  `toolbar.bulkActions`, column visibility → the toolbar, row actions →
  `actions`, page sizes → `pagination.pageSizeOptions`, the hand-rolled
  loading block → `dataState.status`. The route touches none of the seven
  P1 engine groups.

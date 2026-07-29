import type { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '../../checkbox';
import { withSelectionCause } from '../../data-table/data-table-selection-cause';
import { defineDataGridConfig } from './registry';
import { DATA_GRID_CHROME_COLUMN_SIZING } from './chrome-column';

// OWNERSHIP: created by F4 with the shipped wiring; **U9 owns this file** —
// `reserve`, `selectByRow` and `selectAllOnIndeterminate` landed here. `selectAll`
// is U8's and has landed too.

// The `selection` behavior group (design §5.2): the leading checkbox column and
// the controller's selection behavior.
//
// P1 note on the members still to come, and **who has to open this file for
// them** — recorded because the ownership table names one owner per file and
// three of these four belong to other units:
//
// - `selectAll` — U8's, landed. All three scopes, with `all-results` reading
//   `resolved.server.selection`. Two things a later claimant should know: the
//   effective scope is computed in `columns` rather than `resolve`, because
//   `selection` resolves *before* `pagination` and `server`; and the
//   `all-results`-needs-a-token warning lives in `server.ts` for the same reason.
// - `range` — unassigned.
// - `treeCascade` — U2's, but it lands *here*, because it is a selection policy
//   over tree relationships rather than a tree member.
// - `groupScope` — U4's, same reason. It will also need a group-scoped
//   equivalent of `getIsAllPageRowsSelected`/`toggleAllPageRowsSelected`:
//   TanStack has page- and table-scoped predicates only, so the header control's
//   tri-state has to be computed over a group's eligible leaves by hand.
//
// So this file has **more than one claimant for P1's remainder**, like
// `toolbar.tsx`. Whoever needs one of the three escalates to the team lead first
// rather than discovering the overlap in the file.
//
// **None of U9's three members is expressible through the deprecated aliases.**
// `selectable`/`selectionMode`/`isRowSelectable` are flat and carry no place to
// put a policy flag, so the grouped `selection` config is the only configuration
// that reaches `reserve`, `selectByRow` or `selectAllOnIndeterminate` — and
// `getRowId` comes with it by the identity rule. That is a real limit of the
// alias form rather than an omission here: a caller on the aliases migrates to
// the group to get any of the three.

/**
 * The selection column's id. A group that classifies system columns (U3's
 * `columnsFeatures.lockSystemColumns`) should import this rather than repeat the
 * literal.
 */
export const DATA_GRID_SELECTION_COLUMN_ID = '__select__';

/** `false` disables selection; a config enables it with these behaviors. */
export interface DataGridSelectionConfig<TData> {
  mode?: 'single' | 'multiple';
  /** Show the header select-all (multiple mode only). Default true. */
  showSelectAll?: boolean;
  /**
   * Keep selected ids that are absent after a data replacement instead of
   * pruning them. Default false.
   *
   * The behavior itself is the controller's — this is the config surface for it.
   */
  reserve?: boolean;
  /**
   * When the header select-all is indeterminate, activating it selects every
   * eligible row (`true`, the default) rather than clearing the selection
   * (`false`).
   *
   * **Deviation from design §5.2, which defaults this to `false`.** Ruled
   * deliberately: `true` is what ships today — an indeterminate checkbox reports
   * `checked: true`, and that value was passed straight through — so defaulting
   * to `false` would change behaviour for every existing caller with no code
   * change on their part, which is the most invisible kind of breaking change.
   * Both behaviours are defensible UX and there is no correctness argument for
   * either, so the shipped one wins and the member exists for callers who want
   * clear-on-indeterminate.
   */
  selectAllOnIndeterminate?: boolean;
  /**
   * A body-row click toggles that row's selection. Default false.
   *
   * The checkbox column remains the accessible primary control: the row is not
   * given a tab stop or a keyboard binding by this, and action/activation
   * controls still isolate propagation.
   */
  selectByRow?: boolean;
  /**
   * What the header select-all covers.
   *
   * - `page` — the current page's eligible rows.
   * - `loaded` — every eligible loaded row, across pages.
   * - `all-results` — everything the query matches, which DataGrid cannot
   *   enumerate. **Requires an effective `server.selection` in `all-results`
   *   mode** (design §5.2, §6.1): the token is application-issued and DataGrid
   *   never invents one, so without it this falls back to the default scope and
   *   `server.ts` reports the invalid combination.
   *
   * Unset means **page when paginated, loaded otherwise** (design §6.1). It stays
   * `undefined` through resolution rather than being defaulted there, because
   * `selection` resolves before `pagination` and cannot see whether the grid
   * paginates — the effective scope is computed in `columns`, which receives the
   * complete resolved map.
   */
  selectAll?: 'page' | 'loaded' | 'all-results';
  isRowSelectable?: (row: TData) => boolean;
}

export interface ResolvedDataGridSelection<TData> {
  readonly enabled: boolean;
  readonly mode: 'single' | 'multiple';
  readonly showSelectAll: boolean;
  readonly reserve: boolean;
  readonly selectAllOnIndeterminate: boolean;
  readonly selectByRow: boolean;
  /**
   * The scope the caller **asked for**, or `undefined` if they did not ask.
   * Deliberately not defaulted: the default depends on whether the grid
   * paginates, which is resolved after this module, and `server.ts` needs to tell
   * an explicit `'all-results'` apart from an unset value to report the
   * missing-token combination.
   */
  readonly selectAll?: 'page' | 'loaded' | 'all-results';
  readonly isRowSelectable?: (row: TData) => boolean;
}

/* eslint-disable unused-imports/no-unused-vars -- declaration merging requires
   every augmentation to repeat the target's type-parameter list verbatim, so
   `TData` must be named even in a group whose shape does not use it. */
declare module './registry' {
  interface DataGridGroupedConfigMap<TData> {
    /** Selection behavior. `false`/omitted disables it. */
    selection: false | DataGridSelectionConfig<TData>;
  }
  interface DataGridIdentityFreeMap<TData> {
    // Selected ids must survive a data change, which only a real row id can do
    // (design §3.1).
    selection: false;
  }
  interface DataGridDeprecatedAliasMap<TData> {
    /** @deprecated Use `selection`. Prepend a selection checkbox column. */
    selectable: boolean;
    /** @deprecated Use `selection.mode`. */
    selectionMode: 'single' | 'multiple';
    /** @deprecated Use `selection.isRowSelectable`. */
    isRowSelectable: (row: TData) => boolean;
  }
  interface DataGridResolvedConfigMap<TData> {
    selection: ResolvedDataGridSelection<TData>;
  }
}
/* eslint-enable unused-imports/no-unused-vars */

export const selectionConfig = defineDataGridConfig({
  key: 'selection',
  kind: 'grouped',
  aliases: ['selectable', 'selectionMode', 'isRowSelectable'],

  resolve({ props }) {
    const warnings: string[] = [];
    let enabled = props.selectable ?? false;
    let mode: 'single' | 'multiple' = props.selectionMode ?? 'multiple';
    let showSelectAll = true;
    // The members below have no deprecated alias, so they start at their defaults
    // on the alias path and are only ever set from the grouped config.
    let reserve = false;
    // Defaults TRUE — the shipped behaviour, deviating from design §5.2. See the
    // member's docblock for why.
    let selectAllOnIndeterminate = true;
    let selectByRow = false;
    let selectAll: 'page' | 'loaded' | 'all-results' | undefined;
    let isRowSelectable = props.isRowSelectable;

    if (props.selection !== undefined) {
      if (
        props.selectable !== undefined ||
        props.selectionMode !== undefined ||
        props.isRowSelectable !== undefined
      ) {
        warnings.push(
          'DataGrid: `selection` cannot be combined with `selectable`/`selectionMode`/`isRowSelectable`; the grouped `selection` config wins.'
        );
      }
      const config = props.selection;
      enabled = config !== false;
      mode = config !== false ? (config.mode ?? 'multiple') : 'multiple';
      showSelectAll = config !== false ? (config.showSelectAll ?? true) : true;
      reserve = config !== false ? (config.reserve ?? false) : false;
      selectAllOnIndeterminate =
        config !== false ? (config.selectAllOnIndeterminate ?? true) : true;
      selectByRow = config !== false ? (config.selectByRow ?? false) : false;
      selectAll = config !== false ? config.selectAll : undefined;
      isRowSelectable = config !== false ? config.isRowSelectable : undefined;
    }

    // The grouped `selection` config cannot reach here without `getRowId` — the
    // props union rejects it (design §3.1). The deprecated alias can, and stays
    // compilable for one minor line, so it warns and is non-reserving: identity
    // falls back to the row index, which cannot survive a data change.
    if (enabled && props.getRowId === undefined) {
      warnings.push(
        'DataGrid: `selectable` without `getRowId` identifies rows by index, so selection cannot survive a data change. Pass `getRowId`, or migrate to the `selection` config, which requires it.'
      );
    }

    // `selectAllOnIndeterminate` is a policy for one control, so it is inert
    // wherever that control does not render. Warn rather than resolve quietly:
    // the member would otherwise appear to do nothing for a reason the caller
    // cannot see from their own config.
    //
    // Keyed on the caller having *set* it, not on the resolved value. Since the
    // default is `true`, a resolved-value check would fire this warning for every
    // single-mode grid in the kit — the member's own default accusing the caller
    // of setting something they never touched.
    const setSelectAllOnIndeterminate =
      props.selection !== undefined &&
      props.selection !== false &&
      props.selection.selectAllOnIndeterminate !== undefined;
    if (
      setSelectAllOnIndeterminate &&
      enabled &&
      !(mode === 'multiple' && showSelectAll)
    ) {
      warnings.push(
        'DataGrid: `selection.selectAllOnIndeterminate` governs the header select-all, which does not render in single mode or with `showSelectAll: false`.'
      );
    }

    return {
      value: {
        enabled,
        mode,
        showSelectAll,
        reserve,
        selectAllOnIndeterminate,
        selectByRow,
        selectAll,
        isRowSelectable,
      },
      warnings,
    };
  },

  viewProps({ resolved }) {
    const { enabled, selectByRow } = resolved.selection;
    // `undefined` rather than `false` so the composer skips the key entirely — a
    // module that conditionally opts out returns `undefined` for the key. Nobody
    // else claims `selectByRow`, so there is no collision either way; this keeps
    // the contribution shape consistent with the other modules.
    return { selectByRow: enabled && selectByRow ? true : undefined };
  },

  columns(columns, { resolved }) {
    const {
      enabled,
      mode,
      showSelectAll,
      selectAllOnIndeterminate,
      selectAll,
    } = resolved.selection;
    if (!enabled) {
      return columns;
    }

    // `columns` receives the COMPLETE resolved map — `composeColumns` is a later
    // phase than resolution — which is what makes both of these readable here.
    // Neither is reachable from this module's `resolve`: `selection` is at index 9
    // of the manifest and `pagination` and `server` are at 10 and 12.
    const paginated = resolved.pagination.enabled;
    const serverSelection = resolved.server.selection;
    const server = resolved.server.config;

    // `all-results` is honored only with an effective, non-stale token, because
    // DataGrid never invents one (design §5.2). Without it the scope silently
    // falls back to the default and `server.ts` reports the combination — the
    // alternative, labelling the loaded window as all server results, is the one
    // thing `ui-spec/…/data-grid/behavior.md` forbids by name.
    const allResults =
      selectAll === 'all-results' && serverSelection?.mode === 'all-results'
        ? serverSelection
        : undefined;
    // Design §6.1: page when paginated, loaded otherwise.
    //
    // **The `loaded` half of that default is spec-faithful but currently has no
    // observable consequence**, and that is recorded rather than quietly relied
    // on. Without a pagination row model TanStack's page-scoped predicates and
    // toggles cover the whole row model, so `page` and `loaded` coincide exactly
    // when `paginated` is false. A negative control that hardcoded this to `'page'`
    // passed the whole suite, and no test can distinguish them — the difference is
    // reachable only through the *explicit* `selectAll: 'loaded'` on a paginated
    // grid, which is covered. Kept as written because the code agreeing with §6.1
    // costs nothing and a future change to pagination's shape could separate them.
    const scope =
      allResults !== undefined
        ? 'all-results'
        : selectAll === 'all-results' || selectAll === undefined
          ? paginated
            ? 'page'
            : 'loaded'
          : selectAll;

    /**
     * Emits a requested server selection. Used only on the all-results path,
     * where the engine is deliberately bypassed: the controlled token stays
     * authoritative and nothing is committed internally, which is what
     * `behavior.md`'s "without mutating it internally" requires.
     *
     * `cause` is `'pointer'` here and that is honest rather than optimistic —
     * this runs in the click handler, so the provenance has not been lost. The
     * engine path cannot say the same: `row.toggleSelected()` reports `'api'`
     * because the controller cannot see what drove it (see the cell below).
     */
    const requestServerSelection = (
      next: typeof serverSelection | undefined
    ) => {
      if (server === undefined) {
        return;
      }
      server.onSelectionChange?.({
        previous: serverSelection,
        selection: next,
        cause: 'pointer',
        query: server.query,
        requestKey: server.query.requestKey,
      });
    };

    const selectionColumn = {
      id: DATA_GRID_SELECTION_COLUMN_ID,
      enableSorting: false,
      enableHiding: false,
      enableColumnFilter: false,
      // #91: without this the column inherits TanStack's 150px default and
      // rendered 92.6px (plain grid) or 209.2px (`columnsFeatures` on) around a
      // 16px checkbox. `table.tsx:795`/`:851` already drop the trailing padding on
      // a checkbox cell — that rule was cosmetic against a column six times wider
      // than its content, which made it read as though the width had been settled.
      ...DATA_GRID_CHROME_COLUMN_SIZING,
      header: ({ table }) => {
        if (!(mode === 'multiple' && showSelectAll)) {
          return null;
        }

        if (allResults !== undefined) {
          // Everything the query matches, minus the exclusions. So "all
          // selected" is an empty exclusion set, and any exclusion is the mixed
          // state — neither is a statement about the loaded window, which is the
          // distinction `behavior.md` is protecting.
          const excluded = allResults.excludedIds.size > 0;
          return (
            <Checkbox
              aria-label="Select all rows"
              checked={!excluded}
              indeterminate={excluded}
              onCheckedChange={(checked) => {
                const selectEverything = excluded
                  ? selectAllOnIndeterminate
                  : Boolean(checked);
                requestServerSelection(
                  selectEverything
                    ? { ...allResults, excludedIds: new Set() }
                    : // Deselect-all is the absence of a selection, not an
                      // all-results token excluding every loaded id — that would
                      // claim exclusions for rows the application may never have
                      // sent us.
                      undefined
                );
              }}
            />
          );
        }

        const allSelected =
          scope === 'loaded'
            ? table.getIsAllRowsSelected()
            : table.getIsAllPageRowsSelected();
        const someSelected =
          scope === 'loaded'
            ? table.getIsSomeRowsSelected()
            : table.getIsSomePageRowsSelected();
        const indeterminate = someSelected && !allSelected;

        return (
          <Checkbox
            aria-label="Select all rows"
            checked={allSelected}
            indeterminate={indeterminate}
            onCheckedChange={(checked) => {
              // An indeterminate control has two defensible actions and the
              // caller picks which. It cannot be left to the checkbox's own
              // next-state, because an indeterminate box reports `checked:
              // true` — so the unconfigured behavior would always be
              // select-all, and the `false` policy would be unreachable.
              // `toggleAll*RowsSelected(true)` skips ineligible rows, which is
              // what makes this "every eligible row".
              const next = indeterminate
                ? selectAllOnIndeterminate
                : Boolean(checked);
              // Wrapped so the change reports `'pointer'`. The engine still
              // decides *which* rows change — `toggleAll*RowsSelected` skips
              // ineligible rows, which is what makes this "every eligible row".
              withSelectionCause('pointer', () => {
                if (scope === 'loaded') {
                  table.toggleAllRowsSelected(next);
                } else {
                  table.toggleAllPageRowsSelected(next);
                }
              });
            }}
          />
        );
      },
      cell: ({ row }) => (
        // The row control isolates propagation, as the actions cell and the
        // detail expander already do. `DataTableViewProps.onRowClick` documents
        // this ("interactive descendants that stop propagation (checkboxes,
        // action buttons) do not trigger it") and it was true of action buttons
        // only — a checkbox click also ran the row handler and, with roving focus
        // on, moved the current row. It matters twice over: without it,
        // `selection.selectByRow` makes a checkbox click toggle in the cell AND
        // again on the row, netting to no change — a failure that reads as
        // "selection is broken" and has nothing to do with the checkbox.
        //
        // **It has to be a wrapper, and `onClick` on the `Checkbox` itself does
        // not work.** Base UI renders the visible `<span role="checkbox">` and a
        // hidden native `<input type="checkbox">` as *siblings*, so activating
        // the box dispatches a click from the input — which is not a descendant
        // of the span and bubbles straight past any handler on it. Verified: with
        // the handler on the `Checkbox`, the row handler still ran exactly once.
        // A `Button`-based control (the detail expander) has no such twin, which
        // is why the same one-liner works there and not here.
        //
        // `display: contents` so the wrapper generates no box: the cell's layout
        // tree is unchanged, and no visual baseline moves for a fix that is
        // purely about event flow.
        <span className="contents" onClick={(event) => event.stopPropagation()}>
          {allResults === undefined ? (
            <Checkbox
              aria-label="Select row"
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              // Reports `cause: 'pointer'`, because the wrapper carries the
              // provenance across the engine round-trip that would otherwise
              // destroy it. The engine keeps deciding *what* changes —
              // eligibility, single-mode replacement and the sub-row cascade all
              // live in `mutateRowIsSelected`, so none of them is re-derived
              // here. See `data-table/data-table-selection-cause.ts`.
              onCheckedChange={(checked) =>
                withSelectionCause('pointer', () =>
                  row.toggleSelected(Boolean(checked))
                )
              }
            />
          ) : (
            <Checkbox
              aria-label="Select row"
              // Selected means "matched the query and not excluded". Derived from
              // `row.id` at render time rather than from an engine slice, which is
              // the whole reason this branch exists: the engine cannot hold a set
              // it has never seen.
              checked={!allResults.excludedIds.has(row.id)}
              disabled={!row.getCanSelect()}
              onCheckedChange={(checked) => {
                // The delta, and the only place it is computable: `row.id` is in
                // hand here and nowhere upstream. Nothing is committed to the
                // engine — the controlled token stays authoritative.
                const excludedIds = new Set(allResults.excludedIds);
                if (checked) {
                  excludedIds.delete(row.id);
                } else {
                  excludedIds.add(row.id);
                }
                requestServerSelection({ ...allResults, excludedIds });
              }}
            />
          )}
        </span>
      ),
    } satisfies ColumnDef<unknown, unknown>;

    return [selectionColumn, ...columns];
  },

  controllerOptions({ resolved }) {
    const { enabled, mode, reserve, isRowSelectable } = resolved.selection;
    return {
      selection: enabled
        ? { mode, reserve, ...(isRowSelectable ? { isRowSelectable } : {}) }
        : false,
    };
  },
});

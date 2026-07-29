import type { ReactNode } from 'react';
import type { Row } from '@tanstack/react-table';

import { TableCell, TableRow } from '../../table';
import { encodeRowIdForDom } from '../data-table-display-rows';
import { defineDataTableFeature } from './registry';

// OWNERSHIP: created by F2 with the shipped projection; **U1 owns this file** and
// completed the `detailExpansion` group here.
//
// **The §7 ARIA id scheme lives here.** `detailRowDomId` is the single source both
// halves use: this module stamps it on the rendered row, and the DataGrid
// expander reads the same function for `aria-controls` — so the attribute points
// at an element that exists exactly when the display row is mounted, which is the
// condition §7 asks for.

interface IdentityFeatureConfig {
  readonly reserve?: boolean;
}

/**
 * Detail-expansion behavior — a render-layer projection over the
 * `detailExpanded` slice, with no TanStack row-model involvement (ADR-0001).
 *
 * Every member is optional by design — design §5.2 makes `render` required at the
 * *DataGrid* layer, but at this layer the deprecated `renderExpandedRow` view prop
 * is still a valid content source and `data-table-controller-types.test.ts`
 * accepts `detailExpansion: {}` today.
 */
export interface DataTableDetailExpansionConfig<
  TData,
> extends IdentityFeatureConfig {
  /**
   * The panel content for an expanded record. Takes the record, not the TanStack
   * row — the neutral contract (design §5.2) is `render(row: TData)`. Supersedes
   * the deprecated `renderExpandedRow` view prop, which takes `Row<TData>`.
   */
  readonly render?: (row: TData) => ReactNode;
  /**
   * Which records can reveal a panel. Defaults to all of them.
   *
   * This is a **detail** predicate and never TanStack's `getRowCanExpand`, whose
   * subrow-based default is tree truth (ADR-0001).
   */
  readonly isExpandable?: (row: TData) => boolean;
  /**
   * `accordion` keeps at most one panel open: opening one closes the previously
   * open one. It is a detail-domain rule only and provably cannot collapse a tree
   * node, because the two live in different slices and different display-row
   * kinds (design §6 rule 7).
   *
   * Proposed-only in the design; `multiple` is the shipped default.
   */
  readonly mode?: 'multiple' | 'accordion';
}

/** The §7 detail-panel DOM id. Both halves of the feature derive it from here. */
export function detailRowDomId(tableId: string, rowId: string): string {
  return `${tableId}--detail--${encodeRowIdForDom(rowId)}`;
}

/**
 * The panel content source, in precedence order: the group's own `render`, then
 * the deprecated view prop. `undefined` means the caller wants expansion *state*
 * without projected content — the `getRowCanExpand`-only legacy path — and the
 * projection must then emit nothing at all.
 */
function detailRenderer<TData>(
  config: DataTableDetailExpansionConfig<TData> | undefined,
  renderExpandedRow: ((row: Row<TData>) => ReactNode) | undefined
): ((row: Row<TData>) => ReactNode) | undefined {
  const render = config?.render;
  if (render !== undefined) {
    return (row) => render(row.original);
  }
  return renderExpandedRow;
}

/**
 * Whether this record's detail panel is **open and actually rendered** (#79).
 *
 * ── ONE PREDICATE, TWO CONSUMERS, DELIBERATELY ───────────────────────────────
 * `displayRows` decides whether to emit the panel row and `rowPresentation`
 * decides whether to paint the record row as disclosing. Those are the same
 * question, and this file already carries a boxed warning about exactly this
 * shape ("two sources computing the same predicate would disagree silently").
 * Written twice, a later change to one gate would leave a row painted open with
 * no panel under it, or a panel under a row that looks closed — and neither is
 * visible from the other end.
 *
 * ── WHY THE RENDERER GATE IS PART OF IT, NOT JUST THE STATE ──────────────────
 * `detailExpansion: {}` with no `render` and no `renderExpandedRow` is a supported
 * configuration: the caller wants expansion *state* only and no panel row is
 * emitted. A row in that state discloses nothing, so painting it open would assert
 * something the table does not show. The state alone is not the question; "is
 * there an open panel" is.
 *
 * Both consumers take `DataTableDisplayRowContext`, which is what makes sharing
 * free rather than a refactor.
 */
function detailPanelIsOpen(ctx: {
  readonly config: unknown;
  readonly viewProps: {
    readonly renderExpandedRow?: (row: never) => ReactNode;
  };
  readonly state: { readonly detailExpanded: ReadonlySet<string> };
  readonly row: { readonly id: string };
}): boolean {
  const config = ctx.config as
    DataTableDetailExpansionConfig<unknown> | undefined;

  return (
    detailRenderer(
      config,
      ctx.viewProps.renderExpandedRow as
        ((row: Row<unknown>) => ReactNode) | undefined
    ) !== undefined && ctx.state.detailExpanded.has(ctx.row.id)
  );
}

export const detailExpansionFeature = defineDataTableFeature<unknown, string>({
  id: 'detail-expansion',

  engineOptions(ctx) {
    const { legacyDetailBinding, legacyCanExpand } = ctx.gates;

    // Only the frozen compatibility binding forwards the legacy predicate to
    // TanStack. With a tree in play `row.getCanExpand()` is tree truth, and the
    // legacy predicate stays a detail predicate (see `gates.canExpandDetail`).
    return legacyDetailBinding && legacyCanExpand !== undefined
      ? { getRowCanExpand: legacyCanExpand }
      : {};
  },

  renderContext(ctx) {
    const config = ctx.config as
      DataTableDetailExpansionConfig<unknown> | undefined;
    if (config === undefined) {
      // The legacy alias path keeps the controller's verdict untouched.
      return {};
    }
    const { isExpandable, mode } = config;

    return {
      row: (row) => ({
        detail: {
          // ── COORDINATION HAZARD — read before changing either side ────────
          //
          // This **overrides** `gates.canExpandDetail`, which the controller
          // computes as
          //   `legacyCanExpand?.(row) ?? (treeEnabled ? false : row.subRows.length > 0)`
          //
          // For a modern `detailExpansion: { render }` with no subrows that is
          // `false` for every row, so no expander would ever render. Subrow
          // presence is *tree* truth — ADR-0001 says so explicitly — and the
          // controller's fallback is answering a tree question on behalf of a
          // detail feature. It predates the split and is now dead for this path.
          //
          // The fix lives here rather than in the controller because identity
          // logic stays in the controller (ADR-0002's scope boundary) and the
          // features README sanctions replacing a base value the render context
          // supplies as a default.
          //
          // **If `canExpandDetail` is ever taught to consult this config, delete
          // this override in the same change.** Two sources computing the same
          // predicate would disagree silently — the expander reading one and the
          // projection the other. The team lead has asked F2 to coordinate any
          // change to `canExpandDetail` for exactly this reason.
          canExpand: isExpandable?.(row.original) ?? true,
          // Accordion replaces the toggle command rather than filtering state, so
          // a controlled `detailExpanded` slice stays the caller's to own.
          ...(mode === 'accordion'
            ? {
                toggle: (expanded?: boolean) => {
                  const open =
                    expanded ?? !ctx.state.detailExpanded.has(row.id);
                  ctx.requestChange(
                    'detailExpanded',
                    open ? new Set([row.id]) : new Set<string>(),
                    'pointer'
                  );
                },
              }
            : {}),
        },
      }),
    };
  },

  /**
   * Paints a record row whose detail panel is open as disclosing (#79).
   *
   * ── WHY THIS SEAM AND NOT THE FEATURE'S OWN ROW ──────────────────────────────
   * `composeRowPresentation` runs **only** from `renderRecordRow`, so it is the one
   * route to a row the *view* renders. The detail panel row is this feature's own
   * and could be decorated anywhere; the RECORD row above it cannot. That property
   * is why `DataTableRowPresentation.expanded` was kept rather than deleted in #50's
   * sweep — its whole justification rested on this case, and filling it resolves that
   * hold by USE rather than by annotation.
   *
   * ── THE INCONSISTENCY THIS REMOVES ───────────────────────────────────────────
   * A grouping header already carries `data-expanded` (set directly on the
   * `<TableRow>` grouping renders). Detail expansion did not, so a table could hold
   * two disclosure mechanisms and paint only one of them open.
   *
   * ── ⚠ A KNOWN OBJECTION, ACCEPTED BY THE USER RATHER THAN OVERLOOKED ─────────
   * `TableRow`'s expanded rule paints `--ui-table-data-row-color-hover` — literally
   * the HOVER token — so an open row reads as hovered while the pointer is somewhere
   * else. That was put to the user with the alternative and **consistency with group
   * rows was chosen**. Recorded here so the next reader knows it was decided, not
   * missed; **do not "fix" it by inventing a token.** Selection still wins: the
   * primitive resolves `expanded && !selected` itself rather than leaving two
   * equal-specificity rules to stylesheet order.
   *
   * `undefined` when closed rather than `expanded: false` — the flag is discrete and
   * `composeRowPresentation` treats two features disagreeing about it as a bug, so a
   * feature that has nothing to say says nothing.
   */
  rowPresentation(ctx) {
    return detailPanelIsOpen(ctx) ? { expanded: true } : undefined;
  },

  displayRows(ctx) {
    // A detail row is a projection of a record already on the page: it never
    // enters `getRowModel().rows`, `flatRows` or `rowsById`, and consumes no
    // pagination slot (ADR-0001, OQ-1). `pageSize: 25` means 25 records.
    //
    // The renderer gate is not incidental. With no content source the caller
    // wants expansion *state* only, and emitting a row would add an empty `<tr>`
    // to every expanded record — a row count `data-table.test.tsx` pins.
    if (!detailPanelIsOpen(ctx)) {
      return [];
    }

    return [
      {
        kind: 'detail',
        parent: ctx.row,
        recordIndex: ctx.recordIndex,
        domId: detailRowDomId(ctx.tableId, ctx.row.id),
      },
    ];
  },

  renderDisplayRow(displayRow, ctx) {
    if (displayRow.kind !== 'detail') {
      return undefined;
    }
    const config = ctx.config as
      DataTableDetailExpansionConfig<unknown> | undefined;
    const render = detailRenderer(config, ctx.viewProps.renderExpandedRow);
    if (render === undefined) {
      return null;
    }

    return (
      <TableRow id={displayRow.domId} className="hover:bg-transparent">
        <TableCell
          className="h-auto py-3"
          colSpan={displayRow.parent.getVisibleCells().length}
        >
          {render(displayRow.parent)}
        </TableCell>
      </TableRow>
    );
  },
});

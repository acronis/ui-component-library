import type { Row } from '@tanstack/react-table';

import type {
  DataTableDisplayRowContextBase,
  DataTableFeatureId,
  DataTableFeatureModule,
  DataTableViewContextBase,
} from './data-table-features/registry';
import { viewContextFor } from './data-table-features/registry';

// The display-row list (ADR-0001, "For the view").
//
// **The engine produces record rows; the view derives a display-row list.** The
// two are not the same list and the difference is load-bearing:
//
//  - Pagination counts *records*, not display rows. A `pageSize` of 25 renders
//    25 `kind: 'data'` rows plus whatever detail/status rows they project.
//  - Virtualization windows the *display-row* list, not `getRowModel().rows`,
//    which is what makes "virtual rows preserve row index/count metadata"
//    (design §7) satisfiable: logical identity lives on the record row, geometry
//    lives on the display row.
//  - Keyboard roving focus keeps indexing *records*. Every display row therefore
//    carries `recordIndex`, so Arrow-Down from a row with an open detail panel
//    lands on the next record rather than on the panel (ADR-0001 consequence 6).
//  - Tree descendants are `kind: 'data'` — real records produced by the engine,
//    with `depth` from `row.depth`. Group and tree-status rows are synthetic and
//    carry no record ID, satisfying §6.5.

/**
 * One rendered row. `kind: 'data'` is the record row itself; every other kind is
 * derived, and the feature that emits it also renders it.
 */
export type DataTableDisplayRow<TData> =
  | {
      readonly kind: 'data';
      readonly row: Row<TData>;
      readonly depth: number;
      readonly recordIndex: number;
    }
  | {
      readonly kind: 'detail';
      readonly parent: Row<TData>;
      readonly recordIndex: number;
      /** `${tableId}--detail--${base64url(rowId)}` (design §7). */
      readonly domId: string;
    }
  | {
      readonly kind: 'group';
      /**
       * Grouped rows are real row-model rows — `getGroupedRowModel()` puts them
       * in `getRowModel().rows` — with a synthetic ID, never a record ID.
       */
      readonly row: Row<TData>;
      readonly groupId: string;
      readonly depth: number;
      readonly recordIndex: number;
    }
  | {
      readonly kind: 'tree-status';
      readonly parent: Row<TData>;
      readonly recordIndex: number;
      readonly status: 'loading' | 'error';
      /** `${tableId}--tree--${base64url(rowId)}` (design §7). */
      readonly domId: string;
    }
  | {
      readonly kind: 'footer';
      readonly scope: 'table' | 'group';
      readonly groupId?: string;
    };

export type DataTableDisplayRowKind = DataTableDisplayRow<never>['kind'];

/**
 * Kinds the registry dispatches but no shipped feature renders yet; the owning
 * unit supplies the renderer. An unhandled kind throws rather than rendering a
 * blank row, and this constant is the `it.each` source for the assertion that
 * proves it — so removing an entry silently switches that guard off.
 *
 * Shrinks as units land, and **only in the same change as the renderer that makes
 * a kind shippable** — that rule exists because an entry was once removed ahead of
 * its renderer, which switched this guard off while a comment claimed the opposite.
 * `footer` left when U5 shipped; `tree-status` left with U2b's lazy children, which
 * is the only thing that emits it and now ships its `renderStatus` shell.
 *
 * **It is now empty, so the `it.each` over it asserts nothing.** That is the
 * intended end state, not a gap to leave unattended: every kind has a renderer, so
 * the loud-failure guard has nothing left to exercise. What replaces it is the
 * other direction — a *positive* dispatch assertion per kind, proving the kind
 * reaches the module that owns it. `group` left with U4, whose
 * `__tests__/data-table-grouping.test.tsx` carries that assertion; `detail`'s lives
 * in `data-table-features.test.tsx` beside the loop. A future kind added here
 * revives the loop automatically.
 */
export const UNSHIPPED_DISPLAY_ROW_KINDS =
  [] as const satisfies readonly DataTableDisplayRowKind[];

/**
 * A stable React key. Every kind is at most once per parent (or once per table
 * for a scoped footer), so identity plus kind is unique.
 */
export function displayRowKey<TData>(
  displayRow: DataTableDisplayRow<TData>
): string {
  switch (displayRow.kind) {
    case 'data':
      return `data:${displayRow.row.id}`;
    case 'detail':
      return `detail:${displayRow.parent.id}`;
    case 'group':
      return `group:${displayRow.groupId}`;
    case 'tree-status':
      return `tree-status:${displayRow.parent.id}`;
    case 'footer':
      return `footer:${displayRow.scope}:${displayRow.groupId ?? 'table'}`;
  }
}

/**
 * URL-safe base64 of a row ID, for the §7 ARIA id schemes. A row ID is
 * caller-supplied and may contain characters an `id` attribute cannot carry.
 */
export function encodeRowIdForDom(rowId: string): string {
  const base64 =
    typeof btoa === 'function'
      ? btoa(unescape(encodeURIComponent(rowId)))
      : Buffer.from(rowId, 'utf8').toString('base64');

  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** The record index a display row belongs to, or `undefined` for table scope. */
export function displayRowRecordIndex<TData>(
  displayRow: DataTableDisplayRow<TData>
): number | undefined {
  return displayRow.kind === 'footer' ? undefined : displayRow.recordIndex;
}

interface DeriveDisplayRowsInput<TData, RowId extends string> {
  readonly recordRows: readonly Row<TData>[];
  readonly modules: readonly DataTableFeatureModule[];
  readonly configs: Readonly<Partial<Record<DataTableFeatureId, unknown>>>;
  /** The shared feature context, minus the per-row fields. */
  /** The BASE context; each module's own config is attached per call. */
  readonly viewContext: DataTableViewContextBase<TData, RowId>;
}

/**
 * Builds the display-row list: for each record row, its classified self followed
 * by whatever the features append; then the table-scoped rows.
 *
 * Order within a record row is manifest order, which is why the manifest order is
 * committed and pinned by a test.
 */
export function deriveDisplayRows<TData, RowId extends string>({
  recordRows,
  modules,
  configs,
  viewContext,
}: DeriveDisplayRowsInput<
  TData,
  RowId
>): readonly DataTableDisplayRow<TData>[] {
  const displayRows: DataTableDisplayRow<TData>[] = [];
  const lastIndex = recordRows.length - 1;

  recordRows.forEach((row, recordIndex) => {
    const rowContext: DataTableDisplayRowContextBase<TData, RowId> = {
      ...viewContext,
      row,
      recordIndex,
      isFirstRecord: recordIndex === 0,
      isLastRecord: recordIndex === lastIndex,
    };

    displayRows.push(classifyRecordRow(modules, rowContext, configs));

    for (const module of modules) {
      if (module.displayRows === undefined) {
        continue;
      }
      const typed = module as DataTableFeatureModule<TData, RowId>;
      displayRows.push(
        ...typed.displayRows!({
          ...viewContextFor(viewContext, module, configs),
          row,
          recordIndex,
          isFirstRecord: recordIndex === 0,
          isLastRecord: recordIndex === lastIndex,
        })
      );
    }
  });

  for (const module of modules) {
    if (module.tableDisplayRows === undefined) {
      continue;
    }
    const typed = module as DataTableFeatureModule<TData, RowId>;
    displayRows.push(
      ...typed.tableDisplayRows!(viewContextFor(viewContext, module, configs))
    );
  }

  return displayRows;
}

/**
 * A record row is a `data` row unless exactly one feature claims it. Two
 * claimants is a bug — grouping and any future classifier would be fighting over
 * one row — so it throws rather than letting manifest order decide silently.
 */
function classifyRecordRow<TData, RowId extends string>(
  modules: readonly DataTableFeatureModule[],
  ctx: DataTableDisplayRowContextBase<TData, RowId>,
  configs: Readonly<Partial<Record<DataTableFeatureId, unknown>>>
): DataTableDisplayRow<TData> {
  let claimed: DataTableDisplayRow<TData> | undefined;
  let claimedBy: DataTableFeatureId | undefined;

  for (const module of modules) {
    if (module.classifyDisplayRow === undefined) {
      continue;
    }
    const typed = module as DataTableFeatureModule<TData, RowId>;
    const classification = typed.classifyDisplayRow!({
      ...viewContextFor(ctx, module, configs),
      row: ctx.row,
      recordIndex: ctx.recordIndex,
      isFirstRecord: ctx.isFirstRecord,
      isLastRecord: ctx.isLastRecord,
    });
    if (classification === undefined) {
      continue;
    }
    if (claimedBy !== undefined) {
      throw new TypeError(
        `DataTable: feature modules "${claimedBy}" and "${module.id}" both classified row "${ctx.row.id}". A record row has at most one classifier.`
      );
    }
    claimed = classification;
    claimedBy = module.id;
  }

  return (
    claimed ?? {
      kind: 'data',
      row: ctx.row,
      depth: ctx.row.depth,
      recordIndex: ctx.recordIndex,
    }
  );
}

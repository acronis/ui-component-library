import type { ReactNode } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import { DataGridDetailExpander } from '../data-grid-detail-expansion';
import { defineDataGridConfig } from './registry';
import {
  DATA_GRID_CHROME_CELL_CLASS,
  DATA_GRID_CHROME_COLUMN_SIZING,
} from './chrome-column';

// OWNERSHIP: **U1**. The `detailExpansion` behavior group (design §5.2).
//
// Detail expansion is a render-layer projection over the `detailExpanded` slice
// with no TanStack row-model involvement (ADR-0001), so this group contributes no
// engine options of its own — the projection and the §7 id scheme live in
// `data-table-features/detail-expansion.tsx`, and this half is the config surface
// plus the expander column.
//
// A detail row consumes **no pagination slot**: it is a presentation of a record
// already on the page, not a record entering the row model (ADR-0001 OQ-1, decided
// deliberately opposite to the tree answer). `pageSize: 25` means 25 records.

/**
 * The expander column's id. A group that classifies system columns (U3's
 * `columnsFeatures.lockSystemColumns`) should import this rather than repeat the
 * literal.
 */
export const DATA_GRID_DETAIL_COLUMN_ID = '__detail__';

/**
 * Detail-expansion config (design §5.2). `render` is **required** here — unlike
 * the DataTable layer, where the deprecated `renderExpandedRow` view prop is still
 * a valid content source. A DataGrid detail group with nothing to render is a
 * configuration mistake, not a supported shape.
 */
export interface DataGridDetailExpansionConfig<TData> {
  /** The panel content for an expanded record. */
  render: (row: TData) => ReactNode;
  /** Which records can reveal a panel. Defaults to all of them. */
  isExpandable?: (row: TData) => boolean;
  /**
   * `accordion` keeps at most one panel open. **Proposed-only** in the design;
   * `multiple` is the shipped default.
   */
  mode?: 'multiple' | 'accordion';
  /**
   * Retain expanded ids that are absent after a data replacement, instead of
   * pruning them. Requires stable identity, which this group already does.
   */
  reserve?: boolean;
}

export interface ResolvedDataGridDetailExpansion<TData> {
  readonly enabled: boolean;
  readonly render?: (row: TData) => ReactNode;
  readonly isExpandable?: (row: TData) => boolean;
  readonly mode: 'multiple' | 'accordion';
  readonly reserve: boolean;
}

/* eslint-disable unused-imports/no-unused-vars -- declaration merging requires
   every augmentation to repeat the target's type-parameter list verbatim, so
   `TData` must be named even in a group whose shape does not use it. */
declare module './registry' {
  interface DataGridGroupedConfigMap<TData> {
    /**
     * Detail row expansion: a caller-rendered panel beneath an expanded record.
     * `false`/omitted disables it. Independent of `tree` — separate slice,
     * separate callback, separate display-row kind (ADR-0001).
     */
    detailExpansion: false | DataGridDetailExpansionConfig<TData>;
  }
  interface DataGridIdentityFreeMap<TData> {
    // Expanded ids must survive a data change, which only a real row id can do
    // (design §3.1).
    detailExpansion: false;
  }
  interface DataGridResolvedConfigMap<TData> {
    detailExpansion: ResolvedDataGridDetailExpansion<TData>;
  }
}
/* eslint-enable unused-imports/no-unused-vars */

export const detailExpansionConfig = defineDataGridConfig({
  key: 'detailExpansion',
  kind: 'grouped',
  aliases: [],

  resolve({ props }) {
    const warnings: string[] = [];
    const config =
      props.detailExpansion !== undefined && props.detailExpansion !== false
        ? props.detailExpansion
        : undefined;

    if (config !== undefined && config.render === undefined) {
      warnings.push(
        'DataGrid: `detailExpansion.render` is required; a detail group with no content renders an empty panel.'
      );
    }

    return {
      value: {
        enabled: config !== undefined,
        render: config?.render,
        isExpandable: config?.isExpandable,
        mode: config?.mode ?? 'multiple',
        reserve: config?.reserve ?? false,
      },
      warnings,
    };
  },

  columns(columns, { resolved }) {
    if (!resolved.detailExpansion.enabled) {
      return columns;
    }

    // Prepended, so with `selection` prepending after this one the order is
    // `[__select__, __detail__, …data, __actions__]` — the leading checkbox with
    // detail as another system column, which is what `anatomy.yaml` specifies.
    const expanderColumn = {
      id: DATA_GRID_DETAIL_COLUMN_ID,
      enableSorting: false,
      enableHiding: false,
      enableColumnFilter: false,
      // #91. Measured 143.5px around a 24×24 expander before this.
      //
      // The "its min-content floor is 32px, so 40 does not clip the button" that
      // used to stand here measured the **button**, not the cell around it: the
      // 16px-a-side cell padding put the cell's min-content at 56px, over the 40px
      // cap, so it overhung and widened the table. `DATA_GRID_CHROME_CELL_CLASS` on
      // the cell content is what makes 40 true.
      ...DATA_GRID_CHROME_COLUMN_SIZING,
      // Not `null`: an empty `<th>` fails axe's `empty-table-header` rule, and a
      // screen reader announces the column as unnamed. The text is visually hidden
      // so the header row still looks like a bare expander gutter.
      header: () => (
        <span className="sr-only">{resolved.labels.detailColumnHeader}</span>
      ),
      // Wrapped here rather than inside the expander, which is also usable on its
      // own where the chrome-cell geometry would not apply.
      cell: ({ row }) => (
        <div className={DATA_GRID_CHROME_CELL_CLASS}>
          <DataGridDetailExpander
            row={row}
            label={resolved.labels.toggleDetails}
          />
        </div>
      ),
    } satisfies ColumnDef<unknown, unknown>;

    return [expanderColumn, ...columns];
  },

  controllerOptions({ resolved }) {
    const { enabled, render, isExpandable, mode, reserve } =
      resolved.detailExpansion;
    if (!enabled) {
      return {};
    }
    return {
      detailExpansion: {
        ...(render ? { render } : {}),
        ...(isExpandable ? { isExpandable } : {}),
        mode,
        reserve,
      },
    };
  },
});

import type { CSSProperties } from 'react';

import type {
  DataTableCellContext,
  DataTableHeaderContext,
  DataTableRowContext,
  DataTableViewProps,
} from '../../data-table';
import { defineDataGridConfig } from './registry';

// OWNERSHIP: created by F4 with the shipped `striped`; **U9 owns this file** and
// completed the appearance cluster here.
//
// Every member is pass-through to `DataTableView`, which F3 built on the `Table`
// primitive and F2 exposed. Nothing is re-derived at this layer — the point of the
// group is that a caller configures appearance without composing the primitive.
//
// Note the `viewProps` hazard documented on that contribution point: an unknown key
// is silently dropped, with no guard. Every key below was checked against
// `DataTableViewProps` by hand, and the tests assert rendered output rather than
// trusting the type-check.

/** Independent border strengths per edge. Mirrors the `Table` primitive's shape. */
export interface DataGridBorders {
  /** Top edge of the table. Default: off. */
  top?: NonNullable<DataTableViewProps<unknown>['borders']>['top'];
  /** Bottom edge of the table. Default: off. */
  bottom?: NonNullable<DataTableViewProps<unknown>['borders']>['bottom'];
  /** Dividers between rows. Default: on. */
  horizontal?: NonNullable<
    DataTableViewProps<unknown>['borders']
  >['horizontal'];
  /** Dividers between columns. Default: off. */
  vertical?: NonNullable<DataTableViewProps<unknown>['borders']>['vertical'];
}

export interface DataGridAppearanceConfig<TData> {
  /** Alternating row backgrounds. */
  striped?: boolean;
  /** Row density. */
  size?: DataTableViewProps<TData>['size'];
  /** Surface variant behind the table. */
  background?: DataTableViewProps<TData>['background'];
  /** Hide the header row while keeping the column model and body semantics. */
  showHeader?: boolean;
  /** Keep the header visible while the body scrolls. Needs a bounded height. */
  stickyHeader?: boolean;
  /** Independent top/bottom/horizontal/vertical border strengths. */
  borders?: DataGridBorders;
  /** Fixed width. Unset lets the grid fill its container. */
  width?: DataTableViewProps<TData>['width'];
  /** Fixed height. A bounded height is what makes scrolling and stickiness work. */
  height?: DataTableViewProps<TData>['height'];
  /**
   * Upper bound on height, growing to fit until then. Prefer this over `height`
   * when the row count varies — and pair either with `stickyHeader`, which has
   * nothing to stick within otherwise.
   */
  maxHeight?: DataTableViewProps<TData>['maxHeight'];
  /** Per-row class from its typed context. */
  rowClassName?: (row: DataTableRowContext<TData>) => string | undefined;
  /**
   * Per-row inline style. Prefer `rowClassName` where a class exists; this is for
   * values a stylesheet cannot know, such as a computed offset.
   */
  rowStyle?: (row: DataTableRowContext<TData>) => CSSProperties | undefined;
  /**
   * Per-cell class. The context carries the column id and the row, so a rule can
   * branch on either.
   */
  cellClassName?: (cell: DataTableCellContext<TData>) => string | undefined;
  /** Per-cell inline style, from the same context as `cellClassName`. */
  cellStyle?: (cell: DataTableCellContext<TData>) => CSSProperties | undefined;
  /** Per-header-cell class. */
  headerClassName?: (header: DataTableHeaderContext) => string | undefined;
  /** Per-header-cell inline style. */
  headerStyle?: (header: DataTableHeaderContext) => CSSProperties | undefined;
}

/**
 * The resolved cluster. Only `striped` and `showHeader` carry a default: the rest
 * are absent-means-untouched, so the `Table` primitive's own defaults still apply
 * and an unset member emits no attribute at all.
 */
export interface ResolvedDataGridAppearance<TData> {
  readonly striped: boolean;
  readonly showHeader: boolean;
  readonly stickyHeader: boolean;
  readonly size?: DataTableViewProps<TData>['size'];
  readonly background?: DataTableViewProps<TData>['background'];
  readonly borders?: DataGridBorders;
  readonly width?: DataTableViewProps<TData>['width'];
  readonly height?: DataTableViewProps<TData>['height'];
  readonly maxHeight?: DataTableViewProps<TData>['maxHeight'];
  readonly rowClassName?: DataTableViewProps<TData>['rowClassName'];
  readonly rowStyle?: DataTableViewProps<TData>['rowStyle'];
  readonly cellClassName?: DataTableViewProps<TData>['cellClassName'];
  readonly cellStyle?: DataTableViewProps<TData>['cellStyle'];
  readonly headerClassName?: DataTableViewProps<TData>['headerClassName'];
  readonly headerStyle?: DataTableViewProps<TData>['headerStyle'];
}

/* eslint-disable unused-imports/no-unused-vars -- declaration merging requires
   every augmentation to repeat the target's type-parameter list verbatim, so
   `TData` must be named even in a group whose shape does not use it. */
declare module './registry' {
  interface DataGridGroupedConfigMap<TData> {
    /** Appearance: density, surface, borders, bounds, and class/style callbacks. */
    appearance: DataGridAppearanceConfig<TData>;
  }
  interface DataGridDeprecatedAliasMap<TData> {
    /** @deprecated Use `appearance.striped`. Alternating row backgrounds. */
    striped: boolean;
  }
  interface DataGridResolvedConfigMap<TData> {
    appearance: ResolvedDataGridAppearance<TData>;
  }
}
/* eslint-enable unused-imports/no-unused-vars */

export const appearanceConfig = defineDataGridConfig({
  key: 'appearance',
  kind: 'grouped',
  aliases: ['striped'],

  resolve({ props }) {
    const warnings: string[] = [];
    const config = props.appearance;

    if (config !== undefined && props.striped !== undefined) {
      warnings.push(
        'DataGrid: `appearance` cannot be combined with `striped`; the grouped `appearance` config wins.'
      );
    }

    // A bounded height is what makes a sticky header have anything to stick to.
    if (
      config?.stickyHeader === true &&
      config.height === undefined &&
      config.maxHeight === undefined
    ) {
      warnings.push(
        'DataGrid: `appearance.stickyHeader` needs `appearance.height` or `appearance.maxHeight`; without a bounded height the table never scrolls and the header has nothing to stick to.'
      );
    }

    return {
      value: {
        striped:
          config !== undefined
            ? (config.striped ?? false)
            : (props.striped ?? false),
        showHeader: config?.showHeader ?? true,
        stickyHeader: config?.stickyHeader ?? false,
        size: config?.size,
        background: config?.background,
        borders: config?.borders,
        width: config?.width,
        height: config?.height,
        maxHeight: config?.maxHeight,
        rowClassName: config?.rowClassName,
        rowStyle: config?.rowStyle,
        cellClassName: config?.cellClassName,
        cellStyle: config?.cellStyle,
        headerClassName: config?.headerClassName,
        headerStyle: config?.headerStyle,
      },
      warnings,
    };
  },

  viewProps({ resolved }) {
    const appearance = resolved.appearance;
    // Spread behind an `undefined` guard so an unset member reaches the primitive
    // as absent rather than as an explicit `undefined`, which would override the
    // primitive's own default. `showHeader`/`stickyHeader` carry real defaults, so
    // they are always passed.
    return {
      striped: appearance.striped,
      showHeader: appearance.showHeader,
      stickyHeader: appearance.stickyHeader,
      ...(appearance.size === undefined ? {} : { size: appearance.size }),
      ...(appearance.background === undefined
        ? {}
        : { background: appearance.background }),
      ...(appearance.borders === undefined
        ? {}
        : { borders: appearance.borders }),
      ...(appearance.width === undefined ? {} : { width: appearance.width }),
      ...(appearance.height === undefined ? {} : { height: appearance.height }),
      ...(appearance.maxHeight === undefined
        ? {}
        : { maxHeight: appearance.maxHeight }),
      ...(appearance.rowClassName === undefined
        ? {}
        : { rowClassName: appearance.rowClassName }),
      ...(appearance.rowStyle === undefined
        ? {}
        : { rowStyle: appearance.rowStyle }),
      ...(appearance.cellClassName === undefined
        ? {}
        : { cellClassName: appearance.cellClassName }),
      ...(appearance.cellStyle === undefined
        ? {}
        : { cellStyle: appearance.cellStyle }),
      ...(appearance.headerClassName === undefined
        ? {}
        : { headerClassName: appearance.headerClassName }),
      ...(appearance.headerStyle === undefined
        ? {}
        : { headerStyle: appearance.headerStyle }),
    };
  },
});

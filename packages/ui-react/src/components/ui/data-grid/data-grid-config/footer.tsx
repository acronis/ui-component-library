// From the owning feature module rather than the `data-table` barrel.
//
// This is the emergency valve, not the preferred route: barrel lines are
// append-only shared, so the correct fix is to append the export — these are
// public surface and belong in the barrel. Kept as a direct import only because
// the barrel addition is batched with the other public-type re-exports; switch to
// the barrel once that lands.
import type {
  DataTableFooterConfig,
  DataTableSummaryDefinition,
  DataTableSummaryValue,
} from '../../data-table/data-table-features/footer';
import { DataGridFooterRow } from '../data-grid-footer';
import { defineDataGridConfig } from './registry';

// OWNERSHIP: **U5 owns this file.**
//
// The `footer` behavior group (design §5.2) — whole-table summaries.
//
// The layer split (§4.3): DataTable owns the summary model and the footer render
// context; **this side owns the formatted presentation**. So the module hands the
// controller a `render` built from `DataGridFooterRow`, which is what turns raw
// aggregate values into labelled, aligned, locale-formatted cells.
//
// Group-scoped footers are explicitly out of scope — the design does not address
// them. Escalate rather than inventing them, even after U4 lands.

/** How a summary cell is labelled and formatted. */
export interface DataGridSummaryPresentation {
  /** Prefix shown before the value, e.g. `Total`. */
  readonly label?: string;
  /**
   * Formats the aggregate. Receives the computed value and its metadata, so a
   * formatter can branch on the aggregation or on how many rows it saw.
   */
  readonly format?: (summary: DataTableSummaryValue) => string;
}

export interface DataGridSummary<TData>
  extends DataTableSummaryDefinition<TData>, DataGridSummaryPresentation {}

/**
 * Footer config. `summaries` and `render` are **mutually exclusive** here — this
 * is the caller-facing layer the §5.2 rule belongs to. Underneath, DataGrid
 * composes both: it passes the caller's `summaries` to the controller as the model
 * and supplies its own renderer to format them.
 */
export type DataGridFooterConfig<TData> =
  | {
      readonly summaries: readonly DataGridSummary<TData>[];
      readonly render?: never;
      readonly sticky?: boolean;
    }
  | {
      readonly summaries?: never;
      /** Own the whole footer row. Receives the rows behind the grand total. */
      readonly render: (rows: readonly TData[]) => React.ReactNode;
      readonly sticky?: boolean;
    };

export interface ResolvedDataGridFooter<TData> {
  readonly enabled: boolean;
  readonly summaries: readonly DataGridSummary<TData>[];
  readonly render: ((rows: readonly TData[]) => React.ReactNode) | undefined;
  readonly sticky: boolean;
}

declare module './registry' {
  interface DataGridGroupedConfigMap<TData> {
    /** Whole-table footer summaries. `false`/omitted renders no footer. */
    footer: false | DataGridFooterConfig<TData>;
  }
  interface DataGridResolvedConfigMap<TData> {
    footer: ResolvedDataGridFooter<TData>;
  }
}

export const footerConfig = defineDataGridConfig({
  key: 'footer',
  kind: 'grouped',
  aliases: [],

  resolve({ props }) {
    const footer = props.footer;
    const warnings: string[] = [];

    if (footer === undefined || footer === false) {
      return {
        value: {
          enabled: false,
          summaries: [],
          render: undefined,
          sticky: false,
        },
      };
    }

    // The XOR is enforced here, not in the controller: DataGrid legitimately
    // composes summaries with its own renderer, so the rule has to sit at the
    // layer the caller talks to. Type-level already; this covers a JS caller.
    if (footer.summaries !== undefined && footer.render !== undefined) {
      warnings.push(
        'DataGrid: `footer.summaries` cannot be combined with `footer.render`; the custom renderer wins.'
      );
    }

    return {
      value: {
        enabled: true,
        summaries: footer.render === undefined ? (footer.summaries ?? []) : [],
        render: footer.render,
        sticky: footer.sticky ?? false,
      },
      warnings,
    };
  },

  controllerOptions({ resolved }) {
    const { enabled, summaries, render } = resolved.footer;
    if (!enabled) {
      return {};
    }

    const footer: DataTableFooterConfig<unknown> = {
      summaries,
      // A caller renderer owns the whole row and gets the rows it asked for; the
      // default presentation is `DataGridFooterRow` over the computed model.
      render:
        render === undefined
          ? (context) => (
              <DataGridFooterRow
                summaries={context.summaries}
                presentation={summaries}
                visibleColumnIds={context.visibleColumnIds}
              />
            )
          : (context) => render(context.rows),
    };

    return { footer };
  },

  viewProps({ resolved }) {
    // `sticky` is a section prop, and a feature's `renderDisplayRow` returns the
    // row *inside* the section — so it can only be reached from the view.
    return resolved.footer.enabled
      ? { stickyFooter: resolved.footer.sticky }
      : {};
  },
});

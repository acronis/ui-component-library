import type { ReactNode } from 'react';
import type { Row } from '@tanstack/react-table';
import {
  ChevronDownIcon,
  ChevronRightIcon,
} from '@constructor-lab/icons-react/stroke-mono';

import {
  Alert,
  AlertActions,
  AlertContent,
  AlertDescription,
  AlertTitle,
} from '../alert';
import { Button } from '../button';
import { ButtonIcon } from '../button-icon';
import { createRowContext, useDataTableRoot } from '../data-table';
import {
  DATA_TABLE_TREE_DEPTH_PROPERTY,
  DATA_TABLE_TREE_INDENT_PROPERTY,
  type DataTableTreeStatusContext,
} from '../data-table/data-table-features/tree';
import { Spinner } from '../spinner';
import { TableCell, TableRow } from '../table';
import type { DataGridTreeLoadErrorContext } from './data-grid-config/tree';

import {
  DATA_GRID_DEFAULT_LABELS,
  type ResolvedDataGridLabels,
} from './data-grid-config/labels';

// Private DataGrid chrome (design §4.3): the tree disclosure and the depth
// indentation, wrapped around the tree column's own cell content by
// `data-grid-config/tree.tsx`.
//
// ── Why this reads the controller rather than taking props ───────────────────
//
// A `columns` contribution is memoized on the resolved config, so a cell renderer
// must not close over per-render values. It reaches the live controller through
// `useDataTableRoot()` — which `DataTableView` provides — so `aria-expanded`
// reflects the current `treeExpanded` slice on every render without the column set
// churning and rebuilding TanStack's row model. `createRowContext` is the single
// source for `hasChildren`, `isExpanded`, `depth` and the toggle command, so the
// button cannot disagree with the row model.
//
// ── Indentation is CSS, not arithmetic ──────────────────────────────────────
//
// The engine half's `rowPresentation` puts `--table-tree-depth` (unitless) and
// `--table-tree-indent` (a length) on every record row, so the step lives in one
// place — `tree.indent` reaches the engine through `controllerOptions` and comes
// back out here. Multiplying `row.depth` by a number passed down as a prop would
// fork the design §5.2 default into a second location and re-introduce the churn
// the memo exists to avoid.
//
// ── The a11y contract, and its stated limitation ────────────────────────────
//
// A plain grid with an in-cell disclosure button, **not** `role="treegrid"`. That
// is a deliberate P1 decision, not an oversight: `treegrid` moves `aria-expanded`
// onto the `<tr>`, requires full treegrid keyboard semantics, and makes row-level
// focus the primary navigation for every consumer.
//
// **No `aria-controls`.** A tree parent discloses a *variable* set of sibling rows
// and several `<tr>` elements cannot share one id, so there is no single element to
// point at. `aria-expanded` carries the disclosure semantics on its own; it is
// optional in ARIA and pointing it at a transient row is worse than omitting it.
// Detail expansion differs — it controls exactly one projected row — which is why
// only that half emits it.
//
// **Depth is otherwise conveyed visually only.** `aria-level` is meaningful only
// for a `row` inside a `treegrid`, so the level is carried in the disclosure's
// accessible name instead. See `packages/ui-spec/components/data-grid/accessibility.md`.

/** Indents by depth from the two row-level custom properties the engine emits. */
const INDENT_STYLE = {
  paddingInlineStart: `calc(var(${DATA_TABLE_TREE_DEPTH_PROPERTY}, 0) * var(${DATA_TABLE_TREE_INDENT_PROPERTY}, 0px))`,
};

export interface DataGridTreeCellProps<TData> {
  /** The strings this part renders (PLTFRM-93117); `tree.tsx` passes `resolved.labels`. */
  readonly labels?: ResolvedDataGridLabels;
  readonly row: Row<TData>;
  /**
   * Whether a `loadChildren` is configured, which changes **which rows get a
   * disclosure**.
   *
   * Passed as a prop rather than read from a context because it is a property of
   * the configuration, not of the row, and the `columns` transform that renders
   * this already holds the resolved config it is derived from.
   */
  readonly lazy?: boolean;
  /** The tree column's own cell content, rendered after the disclosure. */
  readonly children?: ReactNode;
}

export function DataGridTreeCell<TData>({
  labels = DATA_GRID_DEFAULT_LABELS,
  row,
  lazy = false,
  children,
}: DataGridTreeCellProps<TData>) {
  const controller = useDataTableRoot<TData>();
  const { tree } = createRowContext(row, controller);
  // 1-based, because "level 1" reads better than "level 0" in a screen reader and
  // matches what `aria-level` would have carried.
  const level = tree.depth + 1;

  // ── Who gets a disclosure ───────────────────────────────────────────────────
  //
  // Eagerly, only a row that HAS children: a leaf with a chevron that reveals
  // nothing is a lie.
  //
  // With a loader configured the library cannot know whether a childless record
  // has children until it asks, so **every not-yet-resolved row gets one** —
  // otherwise the fetch has no trigger and `loadChildren` is unreachable for
  // exactly the rows it exists to serve. The one row a loader does NOT get a
  // disclosure on is a *proven* leaf: `loaded` with nothing to show. `error` keeps
  // its control, so a failed branch can be collapsed and retried.
  const canDisclose = tree.hasChildren || (lazy && tree.loadState !== 'loaded');

  return (
    <span className="flex min-w-0 items-center gap-1" style={INDENT_STYLE}>
      {canDisclose ? (
        <ButtonIcon
          aria-label={
            tree.isExpanded
              ? labels.collapseChildren(level)
              : labels.expandChildren(level)
          }
          aria-expanded={tree.isExpanded}
          className="size-6 shrink-0"
          onClick={(event) => {
            // The control owns the interaction: expanding a branch must never
            // also select or activate its row.
            event.stopPropagation();
            tree.toggle();
          }}
        >
          {tree.isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </ButtonIcon>
      ) : (
        // A leaf gets a spacer of the same size so its label lines up with a
        // sibling parent's, instead of sliding left under the chevron.
        <span
          aria-hidden="true"
          className="size-6 shrink-0"
          data-slot="tree-leaf"
        />
      )}
      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
}

/**
 * The `tree-status` row shell: DataGrid's Spinner/Alert/retry chrome for a branch
 * whose children are loading or failed to load.
 *
 * The engine emits no status row at all unless a `renderStatus` is supplied, so
 * this is what makes the kind shippable — which is why `tree-status` may only leave
 * `UNSHIPPED_DISPLAY_ROW_KINDS` in the change that adds this component.
 *
 * `behavior.md` assigns the standard Spinner/Alert/retry UI to DataGrid, and the
 * engine deliberately renders none of it: `renderStatus` receives status, error and
 * a retry command and nothing presentational. `renderLoadError` replaces the error
 * branch only — a caller overriding the failure state should not have to
 * reimplement the spinner, and cannot suppress retry, because a failed branch with
 * no way back is not a supported shape.
 */
export interface DataGridTreeStatusRowProps<TData> {
  /** The strings this part renders (PLTFRM-93117); `tree.tsx` passes `resolved.labels`. */
  readonly labels?: ResolvedDataGridLabels;
  readonly context: DataTableTreeStatusContext<TData>;
  readonly renderLoadError?: (
    context: DataGridTreeLoadErrorContext<TData>
  ) => ReactNode;
}

export function DataGridTreeStatusRow<TData>({
  labels = DATA_GRID_DEFAULT_LABELS,
  context,
  renderLoadError,
}: DataGridTreeStatusRowProps<TData>) {
  const { row, status, error, retry, colSpan, domId } = context;

  return (
    // One ref-forwarding element, because the body-window seam measures a
    // feature-rendered row by cloning it — anything else renders but is unmeasured.
    // `id` carries design §7's `${tableId}--tree--${base64url(rowId)}`; the
    // disclosure deliberately does not point `aria-controls` at it, since a parent
    // reveals a variable set of rows and this one is transient.
    <TableRow id={domId} data-slot="tree-status-row">
      <TableCell colSpan={colSpan}>
        {status === 'loading' ? (
          /* `Loading` is spinner-plus-label as one part, which is exactly what
             this row used to assemble by hand out of `Spinner` and a sibling
             text node. It owns the `role="status"` live region and names it from
             `label`, so there is one announcement rather than the two the old
             arrangement had to work around. Dropped `Spinner` in
             `@constructor-lab/ui-react` 0.61.0 (PLTFRM-93378): the component
             still ships but the package barrel no longer re-exports it. */
          <span className="flex items-center gap-2">
            <Spinner />
            <span>Loading child items…</span>
          </span>
        ) : renderLoadError !== undefined ? (
          renderLoadError({ row: row.original, error, retry })
        ) : (
          <Alert variant="critical" className="text-start">
            <AlertContent>
              <AlertTitle>{labels.treeLoadError}</AlertTitle>
              {error !== undefined && (
                <AlertDescription>{String(error)}</AlertDescription>
              )}
            </AlertContent>
            <AlertActions>
              <Button variant="secondary" className="h-8" onClick={retry}>
                Retry
              </Button>
            </AlertActions>
          </Alert>
        )}
      </TableCell>
    </TableRow>
  );
}

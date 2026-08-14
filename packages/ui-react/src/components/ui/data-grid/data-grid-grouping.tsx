import {
  ChevronDownIcon,
  ChevronRightIcon,
} from '@constructor-lab/icons-react/stroke-mono';

import { ButtonIcon } from '../button-icon';
import { Checkbox } from '../checkbox';
import type { DataTableGroupContext } from '../data-table/data-table-features/grouping';

import {
  DATA_GRID_DEFAULT_LABELS,
  type ResolvedDataGridLabels,
} from './data-grid-config/labels';

// Private DataGrid chrome (design §4.3): the group row's disclosure, its
// group-scoped select-all, and its label. The engine half renders the `<TableRow>`
// and the spanning `<TableCell>` — it has to, because only the feature that emits
// the display-row kind may render it — and passes the resolved group context here.
//
// ── What this deliberately does not paint ────────────────────────────────────
//
// **No background tint.** Design :1252 records per-group `backgroundColor` as a
// residual legacy nuance that "folds into `grouping.renderGroup`", so a caller who
// wants a tinted group band supplies their own renderer. Inventing one here would
// put a presentational decision in the kit that the design deliberately left to
// the caller, and it would be the one thing a `renderGroup` could not remove.
//
// ── Why the row is not clickable, and what that buys ────────────────────────
//
// Only the disclosure toggles the group; the row itself carries no `onClick`. A
// clickable group row would have to isolate propagation from both controls below
// it, and the checkbox cannot do that: Base UI renders the visible
// `<span role="checkbox">` and a hidden native `<input>` as *siblings*, so a click
// originates outside the control and bubbles past any handler on it (the fix
// elsewhere in the kit is a `display: contents` wrapper — `data-grid-config/
// selection.tsx`). There is **no such wrapper here on purpose**: with no ancestor
// handler to stop, it would be a guard against nothing, and rule 7 is as much
// about contributions that reach nothing as about members nothing fills. If a
// group row ever becomes clickable, the wrapper becomes mandatory in the same
// change — and the `Button`-based one-liner the disclosure could use will not
// transfer to the checkbox.

export interface DataGridGroupHeaderProps<TData> {
  /**
   * The strings this header renders (PLTFRM-93117). `grouping.tsx` passes
   * `resolved.labels`; a direct composer passes `DATA_GRID_DEFAULT_LABELS`.
   */
  readonly labels?: ResolvedDataGridLabels;
  readonly context: DataTableGroupContext<TData>;
  /**
   * Render the group-scoped select-all. Resolved by the config module from
   * `selection` — a group checkbox with no selection column would be the only
   * way to select in the grid, which is not a shape the design describes.
   */
  readonly showSelection?: boolean;
}

export function DataGridGroupHeader<TData>({
  context,
  showSelection = false,
  labels = DATA_GRID_DEFAULT_LABELS,
}: DataGridGroupHeaderProps<TData>) {
  const { name, rowCount, collapsed, collapsible, toggle, selection } = context;

  return (
    <span className="flex min-w-0 items-center gap-2">
      {collapsible ? (
        <ButtonIcon
          // The disclosure carries the state, never the row: `aria-expanded` on a
          // row inside `role="table"` is invalid ARIA, which is why `TableRow`
          // emits `data-expanded` alone. No `aria-controls` — a group discloses a
          // variable set of sibling `<tr>`s and several rows cannot share one id,
          // exactly as the tree disclosure documents.
          aria-label={
            collapsed ? labels.expandGroup(name) : labels.collapseGroup(name)
          }
          aria-expanded={!collapsed}
          className="size-6 shrink-0"
          onClick={toggle}
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronDownIcon />}
        </ButtonIcon>
      ) : (
        // A non-collapsible group gets a spacer of the same size, so its label
        // lines up with a collapsible sibling's instead of sliding left.
        <span
          aria-hidden="true"
          className="size-6 shrink-0"
          data-slot="group-static"
        />
      )}

      {showSelection ? (
        <Checkbox
          // Named per group, because every group row carries one of these and an
          // accessible name has to distinguish them.
          aria-label={labels.selectAllRowsInGroup(name)}
          checked={selection.state === 'all'}
          indeterminate={selection.state === 'some'}
          // Nothing to select is stated rather than silently inert. It happens
          // under `selectionScope: 'visible-leaves'` on a collapsed group, and
          // whenever `isRowSelectable` rejects every row in the group.
          disabled={selection.eligibleCount === 0}
          onCheckedChange={() => {
            // No argument: the group's own three-way state decides, including
            // which way the mixed state resolves. Passing the checkbox's
            // next-state would lose that — an indeterminate box reports
            // `checked: true`, so the `selectAllOnIndeterminate: false` policy
            // would be unreachable, which is the same trap the header control
            // documents.
            selection.toggle();
          }}
        />
      ) : null}

      <span className="min-w-0 truncate font-medium">{name}</span>
      <span className="text-[var(--ui-table-data-value-color-disabled)] shrink-0 text-sm">
        {rowCount}
      </span>
    </span>
  );
}

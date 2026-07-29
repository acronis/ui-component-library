import type { Row } from '@tanstack/react-table';
import {
  ChevronDownIcon,
  ChevronRightIcon,
} from '@constructor-lab/icons-react/stroke-mono';

import { ButtonIcon } from '../button-icon';
import { createRowContext, useDataTableRoot } from '../data-table';
// Deep import on purpose: `detailRowDomId` is the single source both halves of
// this feature derive the §7 id from, and `data-table/index.ts` is a manifest
// file no unit opens. U1 owns both files, so this is one feature reaching across
// its own two halves rather than a new cross-component dependency.
import { detailRowDomId } from '../data-table/data-table-features/detail-expansion';

// Private DataGrid chrome (design §4.3): the detail-row disclosure control, in the
// `__detail__` system column its config module injects.
//
// ── Why this reads the controller rather than taking props ──────────────────
//
// A `columns` contribution is memoized on the resolved config, so a cell renderer
// must not close over per-render values. It reaches the live controller through
// `useDataTableRoot()` — which `DataTableView` provides — so `aria-expanded`
// reflects the current `detailExpanded` slice on every render without the column
// set churning and rebuilding TanStack's row model.
//
// `createRowContext` is the single source for all three facts this needs:
// `canExpand` (already the config's `isExpandable`, via the feature module's
// `renderContext`), `isExpanded`, and an accordion-aware `toggle`. None of them is
// recomputed here, so the button cannot disagree with the projection.
//
// ── The §7 ARIA contract ────────────────────────────────────────────────────
//
// `aria-expanded` always reflects logical state. `aria-controls` is emitted
// **exactly when the panel is mounted**, and the projection uses that same
// condition to emit the display row — both derive the id from `detailRowDomId`,
// so the button can never point at an element that does not exist.
//
// The attributes belong on the button, not the `<tr>`: this is a disclosure, and
// the control is what discloses.

export interface DataGridDetailExpanderProps<TData> {
  readonly row: Row<TData>;
  /** Accessible name for the control. */
  readonly label?: string;
}

export function DataGridDetailExpander<TData>({
  row,
  label = 'Toggle details',
}: DataGridDetailExpanderProps<TData>) {
  const controller = useDataTableRoot<TData>();
  const { detail } = createRowContext(row, controller);

  if (!detail.canExpand) {
    // The cell stays in the row so columns keep their alignment; it just has no
    // control. (`detailExpansion.reserve` is about retaining state across data
    // windows and is the controller's concern, not this.)
    return null;
  }

  return (
    <ButtonIcon
      aria-label={label}
      aria-expanded={detail.isExpanded}
      {...(detail.isExpanded
        ? { 'aria-controls': detailRowDomId(controller.tableId, row.id) }
        : {})}
      className="size-6"
      onClick={(event) => {
        // The control owns the interaction: a detail toggle must never also
        // select or activate its row.
        event.stopPropagation();
        detail.toggle();
      }}
    >
      {detail.isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
    </ButtonIcon>
  );
}

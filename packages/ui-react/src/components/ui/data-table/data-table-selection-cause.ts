import type { DataTableChangeCause } from './data-table-contract';

// The provenance of a selection change, carried across the engine round-trip.
//
// ── Why this exists ─────────────────────────────────────────────────────────
//
// A selection control calls `row.toggleSelected()` / `table.toggleAll*Selected()`,
// so by the time the controller sees the change it only knows *that* the engine
// asked — not *what* asked the engine. Every checkbox-driven change therefore
// reported `cause: 'api'`, which is the one thing `cause` exists to distinguish
// from. In one click handler in `data-table-view.tsx` the same pointer event
// produced `'pointer'` for the current row and `'api'` for the selection, two
// lines apart.
//
// ── Why not simply write the slice from the control ────────────────────────
//
// The obvious fix — have the control request the slice change itself with an
// explicit cause — trades a wrong string for three real behaviour losses, because
// TanStack's `mutateRowIsSelected` (`RowSelection.js:292-316`) does three things a
// hand-written updater does not:
//
//  1. clears the whole selection when `!row.getCanMultiSelect()` — single-selection
//     mode **replaces** rather than accumulates;
//  2. refuses ineligible rows via `row.getCanSelect()` — that is `isRowSelectable`;
//  3. cascades to `subRows` when `getCanSelectSubRows()` — the tree-cascade policy.
//
// So the engine keeps computing *what* changes and this carries *why*.
//
// ── Why an ambient value is safe here ──────────────────────────────────────
//
// **`table.setRowSelection` invokes `onRowSelectionChange` synchronously**, in the
// same call stack (`RowSelection.js:36`, read rather than inferred). So the window
// in which this value is set is one synchronous call, nothing else can observe it,
// and there is no async path to inherit it. `__tests__/data-table-selection-cause.test.tsx`
// asserts that directly: an unwrapped change after a wrapped one reports the
// default.
//
// **Scoped to selection deliberately.** A general "cause of the next change" would
// invite every feature into one untyped side channel, and then nothing tells you
// which write set it. A feature that wants the same treatment adds its own named
// channel and is seen doing it.

let selectionCause: DataTableChangeCause | undefined;

/**
 * Runs `act` with the selection cause set, restoring whatever was there before.
 *
 * **Restores the previous value rather than clearing to a constant**, so a wrapped
 * call nested inside another wrapped call leaves the outer one intact. Same line
 * count, and correct if that nesting ever happens.
 */
export function withSelectionCause<T>(
  cause: DataTableChangeCause,
  act: () => T
): T {
  const previous = selectionCause;
  selectionCause = cause;
  try {
    return act();
  } finally {
    selectionCause = previous;
  }
}

/**
 * The cause to attribute a selection change to, or `undefined` when nothing
 * claimed it — which leaves the controller's own default (`'api'`) in place, the
 * honest answer for a genuinely programmatic change.
 */
export function selectionChangeCause(): DataTableChangeCause | undefined {
  return selectionCause;
}

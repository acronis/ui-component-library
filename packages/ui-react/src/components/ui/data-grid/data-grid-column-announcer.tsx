import { useSyncExternalStore } from 'react';

import { useDataTableRoot } from '../data-table';

// OWNERSHIP: **U3.** The grid's single column live region, and the channel the
// column controls announce through.
//
// Design §4.3 puts live-region rendering on the DataGrid side, and
// `ui-spec/…/data-table/behavior.md`'s "Keyboard column manipulation" scenario
// requires that DataTable render **no** live region: it exposes constrained
// commands and announcement intents, and a composer turns an intent into words.
// This is DataGrid's half of that.
//
// ── Why a channel keyed on the engine instance, rather than a prop chain ──────
//
// Two controls announce — the column-settings menu in the toolbar, and the resize
// handle / reorder grip inside each header cell — and they live in different
// subtrees: chrome slots and `<DataTableView>` are siblings under `data-grid.tsx`.
// So the region has to be reachable from both, and none of the obvious routes
// work:
//
//  - **React context** needs a provider above both, which only `data-grid.tsx`
//    can add. That file belongs to F4 and no config module can wrap the tree.
//  - **A prop from the config module** would have to be created in
//    `controllerOptions`, which runs before `useDataTable` and therefore holds
//    nothing that is stable per grid — modules are plain functions and cannot hold
//    a `useRef` either. Keying anything on `resolved` fails for the common case of
//    an inline config literal, which re-resolves every render.
//  - **A live region per control** is what this replaces: a `<th>` each with its
//    own region, and a menu item announcing into a third.
//
// The engine instance is the one object that *is* stable per grid — TanStack
// creates it once in state — and both sides already hold it (`controller.table` in
// a chrome slot, `useDataTableRoot()` inside the table). So it is the key.

/** Written as an escape on purpose: a literal one is invisible in source. */
const ZERO_WIDTH_SPACE = '\u200B';

interface ColumnAnnouncer {
  announce: (message: string) => void;
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => string;
}

const announcers = new WeakMap<object, ColumnAnnouncer>();

/**
 * The announcer for one grid, created on first use. `key` is the grid's engine
 * instance; anything else either churns per render or is shared between two grids.
 */
export function columnAnnouncerFor(key: object): ColumnAnnouncer {
  const existing = announcers.get(key);
  if (existing !== undefined) return existing;

  let message = '';
  let parity = 0;
  const listeners = new Set<() => void>();

  const announcer: ColumnAnnouncer = {
    announce: (next) => {
      parity += 1;
      // A live region speaks when its text *changes*, so the same announcement
      // twice in a row would be silent the second time — "all columns unpinned",
      // pressed twice, is exactly that. The zero-width space alternates the text
      // without altering a word of what is read out.
      message = parity % 2 === 0 ? next : `${next}${ZERO_WIDTH_SPACE}`;
      for (const listener of listeners) listener();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => message,
  };

  announcers.set(key, announcer);
  return announcer;
}

/**
 * Announce a column-preference change from inside the table subtree, where the
 * engine instance comes from `DataTableRoot` rather than from a prop.
 */
export function useDataGridColumnAnnounce(): (message: string) => void {
  const controller = useDataTableRoot<unknown>();
  return columnAnnouncerFor(controller.table).announce;
}

export interface DataGridColumnAnnouncerProps {
  /** The grid's engine instance — the channel key. */
  readonly table: object;
}

/**
 * The grid's column live region. Rendered once per grid by
 * `data-grid-config/columns-features.tsx`.
 *
 * **`aria-live` + `aria-atomic` rather than `role="status"`**, which is the same
 * thing to assistive technology and avoids a collision `role="status"` would
 * create: `Spinner` carries that role, so a grid with a lazy `tree` or a loading
 * `dataState` **and** a toolbar or column affordances would expose two of them.
 * Precisely: no suite collides today — the two that query `getByRole('status')`
 * as a single element (`data-grid-tree.test.tsx:272` and `:386`) configure neither
 * a toolbar nor `columnsFeatures`, so this region does not mount in them. The
 * combination is an ordinary thing to ask for, though, so the role is not worth
 * the hazard for an attribute pair that reads identically.
 */
export function DataGridColumnAnnouncer({
  table,
}: DataGridColumnAnnouncerProps) {
  const announcer = columnAnnouncerFor(table);
  const message = useSyncExternalStore(
    announcer.subscribe,
    announcer.getSnapshot,
    announcer.getSnapshot
  );

  return (
    <div
      data-slot="data-grid-column-announcer"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

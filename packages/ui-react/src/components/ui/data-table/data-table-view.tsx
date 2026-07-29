import {
  Fragment,
  cloneElement,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { type Row, flexRender } from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  type TableBorders,
  type TableProps,
} from '../table';
import { useDataTableBodyWindow } from './data-table-body-window';
import { resolveInlineDirection } from './data-table-inline-direction';
import { dataTableRowPositions } from './data-table-row-positions';
import { useDataTableResizeIndicator } from './data-table-resize-indicator';
import { withSelectionCause } from './data-table-selection-cause';
import {
  deriveDisplayRows,
  displayRowKey,
  type DataTableDisplayRow,
} from './data-table-display-rows';
import {
  composeColumnPresentation,
  composeRowPresentation,
  renderDisplayRow as dispatchDisplayRow,
  type ColumnPresentation,
  type DataTableViewContextBase,
} from './data-table-features/registry';
import { useDataTableRoot } from './data-table-root';
import {
  createCellContext,
  createHeaderContext,
  createRowContext,
  createStateContext,
  type DataTableCellContext,
  type DataTableCellPointerEvent,
  type DataTableHeaderContext,
  type DataTableRenderStatus,
  type DataTableRowActivationEvent,
  type DataTableRowContext,
  type DataTableRowPointerEvent,
  type DataTableStateContext,
} from './data-table-render-context';

export interface DataTableViewProps<TData> {
  readonly renderExpandedRow?: (row: Row<TData>) => ReactNode;
  /**
   * Projects a header cell from its typed context. Receives the column def's
   * default rendered content as the second argument so a projection can wrap
   * rather than replace the label.
   *
   * **Caller-supplied, and deliberately not reachable from DataGrid.** No config
   * module contributes it through `viewProps` and none should: DataGrid puts chrome
   * inside a header cell through `ColumnPresentation.headerAdornments` (the
   * `edge`/`before-label`/`after-label` seam), which composes with the sort button
   * instead of replacing the whole cell. Recorded here because #50's sweep found
   * this member filled by nothing and had to establish it was correct rather than
   * missing — **do not add a second seam for a need already served.**
   */
  readonly renderHeader?: (
    context: DataTableHeaderContext,
    defaultContent: ReactNode
  ) => ReactNode;
  /**
   * Presents the standard sortable-header affordance (the Table primitive's
   * sort button, direction icon, `aria-sort`, and multi-sort priority) for every
   * column the engine reports as sortable. Shift-activation adds to a multi-sort
   * when the controller's sorting mode allows it.
   */
  readonly sortable?: boolean;
  /**
   * Projects a body cell from its typed context instead of the column def.
   *
   * **Caller-supplied, and deliberately not reachable from DataGrid** — same shape
   * as `renderHeader` above. DataGrid wraps cell content through its `columns`
   * transform, which is how shipped `filters` attaches `operatorFilterFn` and how
   * `tree` indents; that route is per-column and composes, where this one replaces.
   * Also why there is no `cellPresentation` contribution point and no `cell`
   * render-context scope (the latter existed, was filled by nothing, and #50 deleted
   * it). **Do not add a second seam for a need already served.**
   */
  readonly renderCell?: (context: DataTableCellContext<TData>) => ReactNode;
  /**
   * Projects the loading/empty body region from its typed state context. Not
   * invoked for the loaded status; rows render through `renderCell`.
   */
  readonly renderState?: (context: DataTableStateContext) => ReactNode;
  readonly striped?: boolean;
  readonly bordered?: boolean;
  readonly highlightCurrentRow?: boolean;
  /**
   * Enables current-row roving focus: body rows share a single tab stop, Up/Down
   * move the current row one visible record, Home/End jump to the first/last, and
   * Enter activates (`onRowActivate`). Interactive descendants stay tabbable and
   * do not activate the row. Implies current-row highlighting.
   */
  readonly currentRow?: boolean;
  /**
   * Invoked with the row's typed context when its body row is clicked.
   * Composes with `highlightCurrentRow`; interactive descendants that stop
   * propagation (checkboxes, action buttons) do not trigger it.
   */
  readonly onRowClick?: (event: DataTableRowPointerEvent<TData>) => void;
  /**
   * A body-row click toggles that row's selection. The selection checkbox stays
   * the accessible primary control; a descendant that stops propagation (the row
   * checkbox, an action button, the detail expander) does not reach this.
   *
   * Eligibility and single-vs-multiple both come from the engine —
   * `row.getCanSelect()` respects `isRowSelectable`, and `toggleSelected()`
   * replaces rather than accumulates when `enableMultiRowSelection` is false.
   *
   * Composes with `onRowClick` rather than replacing it, and runs *before* it, so
   * a caller's handler observes the post-toggle selection state.
   */
  readonly selectByRow?: boolean;
  /** Invoked when the pointer enters a body row. */
  readonly onRowHover?: (event: DataTableRowPointerEvent<TData>) => void;
  /** Invoked on row activation (Enter while row-focused, or double-click). */
  readonly onRowActivate?: (event: DataTableRowActivationEvent<TData>) => void;
  /** Invoked when a body cell is clicked. */
  readonly onCellClick?: (event: DataTableCellPointerEvent<TData>) => void;
  /** Invoked when the pointer enters a body cell. */
  readonly onCellHover?: (event: DataTableCellPointerEvent<TData>) => void;
  readonly skeleton?: boolean;
  readonly skeletonRows?: number;
  readonly emptyColSpan?: number;

  /* ------------------------- appearance pass-through ------------------------ */
  // NB-6. `DataTableView` used to render `<Table>` bare inside a hardcoded
  // wrapper, so F3's presentation and scroll-container props were reachable from
  // a hand-written composition and unreachable from DataGrid. These are the
  // pass-through; U9 wires the DataGrid `appearance` group to them. Without it,
  // U6's bounded-height precondition is satisfiable at the primitive and
  // unreachable from the grid.

  /** Row density. */
  readonly size?: TableProps['size'];
  /** Surface variant; also publishes the surface a sticky/pinned cell paints. */
  readonly background?: TableProps['background'];
  /** Independent top / bottom / horizontal / vertical borders. */
  readonly borders?: TableBorders;
  readonly width?: TableProps['width'];
  /** Bounds the scroll container — the precondition for sticky and windowing. */
  readonly height?: TableProps['height'];
  readonly maxHeight?: TableProps['maxHeight'];
  /** Pins the header to the top of the scroll container. Needs a bounded height. */
  readonly stickyHeader?: boolean;
  /**
   * Pins the footer to the bottom of the scroll container. Needs a bounded
   * height.
   *
   * This is the `footer.sticky` config's only route to the primitive: a footer
   * feature's `renderDisplayRow` returns the `<TableRow>` that goes *inside*
   * `<TableFooter>`, so it cannot reach the section element itself. Without this
   * prop `footer.sticky` would be declared, documented, and unreachable.
   */
  readonly stickyFooter?: boolean;
  /** Hides the header row while keeping the column model and body semantics. */
  readonly showHeader?: boolean;

  /* ---------------------- appearance class/style resolvers ------------------ */

  readonly rowClassName?: (
    row: DataTableRowContext<TData>
  ) => string | undefined;
  readonly rowStyle?: (
    row: DataTableRowContext<TData>
  ) => CSSProperties | undefined;
  readonly cellClassName?: (
    cell: DataTableCellContext<TData>
  ) => string | undefined;
  readonly cellStyle?: (
    cell: DataTableCellContext<TData>
  ) => CSSProperties | undefined;
  readonly headerClassName?: (
    header: DataTableHeaderContext
  ) => string | undefined;
  readonly headerStyle?: (
    header: DataTableHeaderContext
  ) => CSSProperties | undefined;
}

/** Renders a column's header adornments in placement order inside `<TableHead>`. */
function adornmentsAt(
  presentation: ColumnPresentation,
  placement: 'before-label' | 'after-label' | 'edge'
): ReactNode {
  const matching = (presentation.headerAdornments ?? []).filter(
    (adornment) => adornment.placement === placement
  );
  if (matching.length === 0) {
    return null;
  }

  return matching.map((adornment) => (
    <Fragment key={adornment.id}>{adornment.node}</Fragment>
  ));
}

export function DataTableView<TData, RowId extends string = string>(
  props: DataTableViewProps<TData>
) {
  const {
    renderHeader,
    sortable = false,
    renderCell,
    renderState,
    striped = false,
    bordered = false,
    highlightCurrentRow = false,
    currentRow = false,
    selectByRow = false,
    onRowClick,
    onRowHover,
    onRowActivate,
    onCellClick,
    onCellHover,
    skeleton = false,
    skeletonRows = 5,
    emptyColSpan,
    size,
    background,
    borders,
    width,
    height,
    maxHeight,
    stickyHeader = false,
    stickyFooter = false,
    showHeader = true,
    rowClassName,
    rowStyle,
    cellClassName,
    cellStyle,
    headerClassName,
    headerStyle,
  } = props;

  const controller = useDataTableRoot<TData, RowId>();
  const table = controller.table;
  const features = controller.getFeatures();
  const recordRows = table.getRowModel().rows;
  const currentRowId = controller.getState().currentRowId;
  const visibleColumnCount = table.getVisibleLeafColumns().length;
  // Current-row roving focus: the current row (or the first row when none is
  // current) is the single tab stop; arrows move it. Highlighting follows.
  const rowNavEnabled = highlightCurrentRow || currentRow;
  // ── Roving focus walks FOCUSABLE records, which is not `recordRows` ─────────
  //
  // It indexes RECORDS rather than display rows (ADR-0001 consequence 6), so
  // Arrow-Down out of a row with an open detail panel lands on the next record
  // rather than on the panel — that part is unchanged.
  //
  // **But `recordRows` is not the record list once grouping is on.** A grouped row
  // model puts group rows *into* `getRowModel().rows` (`row.getIsGrouped()`), and a
  // group row is synthetic: it carries no record id (§6.5), and it is rendered by
  // `renderDisplayRow` rather than by `renderRecordRow`, so it never registers in
  // `rowNodesRef`. Walking `recordRows` therefore did two wrong things at every
  // group boundary — it wrote a **synthetic group id into `currentRowId`**, an
  // identity slice, which is exactly the collision ADR-0001's own-slice decision
  // exists to prevent; and `.focus()` found no node, so the keyboard user was
  // stranded with the current row pointing at a header.
  //
  // The predicate is deliberately the same one `focusableRowIds()` in
  // `data-table-controller.ts` already uses for the reconcile path, rather than a
  // second one: the two paths answer the same question — "which rows can hold
  // roving focus" — and they must not be able to disagree. If they ever need to
  // differ, that difference needs a stated reason rather than two filters that
  // drifted.
  const focusableRows = recordRows.filter((row) => !row.getIsGrouped());
  // `focusableRows[0]`, not `recordRows[0]`: with grouping on, the first row of the
  // model is a group header, so keying the single tab stop off it left the body with
  // **no tab stop at all** — nothing matched `focusableRowId === row.id`.
  const focusableRowId = currentRowId ?? focusableRows[0]?.id;
  const rowNodesRef = useRef(new Map<string, HTMLTableRowElement>());
  const containerRef = useRef<HTMLDivElement | null>(null);

  /** A row's position in the roving order, or `-1` when it holds no focus. */
  const focusIndexOf = (rowId: string) =>
    focusableRows.findIndex((row) => row.id === rowId);

  const setCurrentAndFocus = (index: number) => {
    const target =
      focusableRows[Math.max(0, Math.min(index, focusableRows.length - 1))];
    if (target === undefined) {
      return;
    }
    controller.requestChange('currentRowId', target.id as RowId, 'keyboard');
    rowNodesRef.current.get(target.id)?.focus();
  };
  const status: DataTableRenderStatus = skeleton
    ? 'loading'
    : recordRows.length
      ? 'loaded'
      : 'empty';
  // Vertical borders are opt-in; a trailing border on the last cell would
  // double up with the wrapper, so suppress it.
  const borderedClass = bordered
    ? '[&_th:not(:last-child)]:border-e [&_td:not(:last-child)]:border-e [&_th]:border-[var(--ui-table-global-row-border-color)] [&_td]:border-[var(--ui-table-global-row-border-color)]'
    : undefined;

  // The BASE context: no `config`. Each composer attaches the contributing
  // module's own config, so the view cannot hand a module the shared one.
  const viewContext: DataTableViewContextBase<TData, RowId> = {
    ...features.context,
    visibleColumnCount,
    recordRows,
    viewProps: props,
  };

  const displayRows = deriveDisplayRows({
    recordRows,
    modules: features.modules,
    configs: features.configs,
    viewContext,
  });
  // The windowing seam. F2 ships the identity implementation; U6 replaces the
  // file. Called unconditionally so the replacement may use hooks.
  const bodyWindow = useDataTableBodyWindow({
    displayRows,
    containerRef,
    config: features.configs.virtualization,
    visibleColumnCount,
  });
  // The drag half of column resizing (F19). Called unconditionally — it is a hook,
  // and it costs nothing until a drag starts: with `columnResizeMode: 'onEnd'` the
  // column does not move during the drag, so this line is the *only* feedback the
  // interaction has. It is wired here rather than in DataGrid's header chrome
  // because the line spans the whole region, and this is the only unit that holds
  // the container box; a composer wiring its own handle to the engine's
  // `resizeHandleProps` gets the indicator without doing anything.
  const resizeIndicator = useDataTableResizeIndicator({
    table,
    viewportRef: containerRef,
  });
  /* ════════════════════════════════════════════════════════════════════════════
     #77 — `aria-rowcount` / `aria-rowindex`, and ONLY while windowing.

     A windowed table renders a slice of real rows between two `aria-hidden`
     spacers, so assistive technology counts what is in the accessibility tree and
     announces "row 3 of 20" for row 1,847 of 4,821. These attributes are the
     mechanism ARIA provides for exactly that.

     ⚠ **`undefined` when not windowing is a correctness rule, not an
     optimisation.** MDN: "If all of the rows are loaded and in the DOM, you don't
     need to include `aria-rowcount` as browsers automatically count the total number
     of rows." On a fully rendered table the browser's own count is already right, so
     publishing an explicit one can only replace a correct implicit number with a
     chance to be wrong — under pagination, grouping or expansion especially.

     The header offset is `getHeaderGroups().length`, NOT 1: column groups produce
     several header rows and `showHeader: false` produces none. See
     `data-table-row-positions.ts`, which owns the arithmetic and the reasoning.
     ════════════════════════════════════════════════════════════════════════════ */
  const rowPositions = bodyWindow.isWindowed
    ? dataTableRowPositions({
        headerRowCount: showHeader ? table.getHeaderGroups().length : 0,
        totalDisplayRows: displayRows.length,
        windowStart: bodyWindow.windowStart,
      })
    : undefined;
  // `kind: 'footer'` belongs in `<TableFooter>`, not `<TableBody>`, so the view
  // routes by kind rather than asking the feature where to put itself.
  //
  // The display index is captured BEFORE the split and carried through. Indexing
  // the two filtered lists separately would restart both at 0, so a table with a
  // footer would hand the seam two rows with index 0 — and the seam's whole job
  // is to map indices to geometry over the list it returned.
  const windowRows = bodyWindow.rows.map((displayRow, displayIndex) => ({
    displayRow,
    displayIndex,
  }));
  const bodyRows = windowRows.filter(
    (entry) => entry.displayRow.kind !== 'footer'
  );
  const footerRows = windowRows.filter(
    (entry) => entry.displayRow.kind === 'footer'
  );

  // Publish the seam's imperative operations to the controller, which owns the
  // toggle-action union but cannot reach this scroll container. Assigning into a
  // stable object rather than setting state: an imperative handle must not cause
  // a render. Without this the pre-declared `measure-layout` and `scroll-to-row`
  // actions are unreachable no matter what the seam implements.
  const { focusAfterRowLoss, measureLayout, scrollToRecord } = bodyWindow;
  useEffect(() => {
    // Resolved inside the effect, not during render: publishing an imperative
    // handle is a commit-phase side effect, and the bridge object outlives any
    // one render.
    const bridge = controller.getViewBridge();
    bridge.measureLayout = measureLayout;
    bridge.scrollToRecord = scrollToRecord;
    // Design §7 clause 3's rungs 3 and 4. Unlike the two above this one is never
    // `undefined`: rungs 1 and 2 run for every table, so leaving the chain's DOM
    // half unpublished on an unwindowed table would let `virtualization` decide
    // where a keyboard user lands.
    bridge.focusAfterRowLoss = focusAfterRowLoss;

    return () => {
      // Cleared on unmount, so a stale handle can never point at a detached
      // scroll container — the action reverts to saying it is not implemented.
      delete bridge.measureLayout;
      delete bridge.scrollToRecord;
      delete bridge.focusAfterRowLoss;
    };
  }, [controller, focusAfterRowLoss, measureLayout, scrollToRecord]);

  /* ════════════════════════════════════════════════════════════════════════════
     #97 — the view is the only thing that can answer which way the inline axis
     runs, and the engine needs the answer as an option.

     A LAYOUT EFFECT, not the passive one above, and not the view bridge. React runs
     layout effects **before paint**, after refs are attached — so the direction is
     reported, the controller re-renders, and `columnResizeDirection` is correct
     before a person can press anything. The bridge's members are published in a
     passive effect, so pulling through it would land after the first paint and
     leave a window in which a drag used the default.

     NO DEPENDENCY ARRAY. A `dir` change on an ancestor fires no event and changes
     no prop, so anything keyed on renders-this-view-already-does is the only signal
     available without a MutationObserver. `reportInlineDirection` is idempotent —
     it compares before setting — so running every pass costs one computed-style
     read and schedules nothing.

     THE ELEMENT, not `document.documentElement`: a subtree may carry its own `dir`,
     and reading the container is what keeps this interchangeable with the keyboard
     path's read. Two resolvers that merely usually agree is the defect #97 records.
     ════════════════════════════════════════════════════════════════════════════ */
  useLayoutEffect(() => {
    controller.reportInlineDirection(
      resolveInlineDirection(containerRef.current)
    );
  });

  const { measureRow } = bodyWindow;
  /**
   * Attaches the seam's measurement ref to a feature-rendered display row.
   *
   * A windowed list has to measure detail, group and status rows too, not only
   * records, and the view does not own those elements — so the ref goes on by
   * cloning. Guarded: a feature that returns something other than one element
   * still renders, just unmeasured.
   */
  const withMeasurement = (
    node: ReactNode,
    displayIndex: number
  ): ReactNode => {
    if (measureRow === undefined || !isValidElement(node)) {
      return node;
    }

    // The feature owns this element, so cloning is the only way to attach the
    // seam's measurement ref. The alternative — handing the ref out on the render
    // context — makes windowing silently wrong for any feature that forgets to
    // wire it, which is the failure mode this seam exists to avoid. Guarded by
    // `isValidElement` above; the contract is documented on `measureRow`.
    // eslint-disable-next-line @eslint-react/no-clone-element -- see above
    return cloneElement(
      node as ReactElement<{ ref?: unknown; 'aria-rowindex'?: number }>,
      {
        ref: (element: HTMLTableRowElement | null) =>
          measureRow(element, displayIndex),
        // #77. Injected on the same clone as the ref, for the same reason: a group
        // header or detail row is a row a person navigates, and the feature that
        // rendered it owns the element. A row left without an index while its
        // siblings have one is worse than none having one — the indices would have
        // a hole in them.
        ...(rowPositions === undefined
          ? {}
          : { 'aria-rowindex': rowPositions.windowedRowIndex(displayIndex) }),
      }
    );
  };

  const columnPresentationFor = (columnId: string): ColumnPresentation => {
    const column = table.getColumn(columnId);
    if (column === undefined) {
      return {};
    }

    return composeColumnPresentation(
      features.modules,
      { ...viewContext, column },
      features.configs
    );
  };

  const renderRecordRow = (
    displayRow: Extract<DataTableDisplayRow<TData>, { kind: 'data' }>,
    displayIndex: number
  ) => {
    const { row, recordIndex } = displayRow;
    const isSelected = row.getIsSelected();
    const isCurrent = rowNavEnabled && currentRowId === row.id;
    const rowContext = createRowContext(row, controller);
    const presentation = composeRowPresentation(
      features.modules,
      {
        ...viewContext,
        row,
        recordIndex,
        isFirstRecord: recordIndex === 0,
        isLastRecord: recordIndex === recordRows.length - 1,
      },
      features.configs
    );
    const isInteractive =
      rowNavEnabled ||
      selectByRow ||
      onRowClick !== undefined ||
      onRowActivate !== undefined;
    const handleRowClick = (event: ReactMouseEvent<HTMLTableRowElement>) => {
      if (rowNavEnabled) {
        controller.requestChange('currentRowId', row.id as RowId, 'pointer');
      }
      // Before `onRowClick`, so a caller's handler observes the post-toggle
      // state. `getCanSelect()` carries eligibility, and single-selection mode
      // makes `toggleSelected()` replace rather than accumulate — both from the
      // engine, so neither is re-derived here.
      //
      // Wrapped so the change reports `'pointer'`. Without it this handler
      // emitted `'pointer'` for the current row two lines above and `'api'` for
      // the selection here, off the same click — which is worse than uniform
      // dishonesty, because it reads as a distinction.
      if (selectByRow && row.getCanSelect()) {
        withSelectionCause('pointer', () => row.toggleSelected());
      }
      onRowClick?.({ row: rowContext, nativeEvent: event });
    };
    const resolvedRowStyle = rowStyle?.(rowContext);

    return (
      <TableRow
        // #77. `undefined` omits the attribute, which is what an unwindowed table
        // wants — see the block at `rowPositions`.
        aria-rowindex={rowPositions?.windowedRowIndex(displayIndex)}
        ref={(node) => {
          if (node) {
            rowNodesRef.current.set(row.id, node);
          } else {
            rowNodesRef.current.delete(row.id);
          }
          // The seam measures by DISPLAY index — geometry is a property of the
          // rendered list, while `rowNodesRef` above is keyed by row id because
          // roving focus is a property of records.
          measureRow?.(node, displayIndex);
        }}
        selected={isSelected}
        aria-current={isCurrent ? true : undefined}
        tabIndex={
          rowNavEnabled ? (focusableRowId === row.id ? 0 : -1) : undefined
        }
        {...(presentation.expanded === undefined
          ? {}
          : { expanded: presentation.expanded })}
        {...(presentation.sticky === undefined
          ? {}
          : { sticky: presentation.sticky })}
        {...(presentation.stickyOffset === undefined
          ? {}
          : { stickyOffset: presentation.stickyOffset })}
        style={
          resolvedRowStyle === undefined && presentation.style === undefined
            ? undefined
            : { ...presentation.style, ...resolvedRowStyle }
        }
        onClick={isInteractive || onRowClick ? handleRowClick : undefined}
        onMouseEnter={
          onRowHover
            ? (event) => onRowHover({ row: rowContext, nativeEvent: event })
            : undefined
        }
        onDoubleClick={
          onRowActivate
            ? () => onRowActivate({ row: rowContext, via: 'pointer' })
            : undefined
        }
        onKeyDown={
          rowNavEnabled || onRowActivate
            ? (event) => {
                // Only act on keys landing on the row itself, so
                // interactive descendants keep their own handling.
                if (event.target !== event.currentTarget) {
                  return;
                }
                // `focusIndex`, never `recordIndex`. `recordIndex` is the row's
                // position in `recordRows`, which counts group headers, so
                // `recordIndex + 1` steps onto one; these are positions in the
                // roving order. The two coincide exactly when nothing is grouped,
                // which is why the old code was correct until grouping shipped.
                const focusIndex = focusIndexOf(row.id);
                switch (event.key) {
                  case 'ArrowDown':
                    if (rowNavEnabled) {
                      event.preventDefault();
                      setCurrentAndFocus(focusIndex + 1);
                    }
                    break;
                  case 'ArrowUp':
                    if (rowNavEnabled) {
                      event.preventDefault();
                      setCurrentAndFocus(focusIndex - 1);
                    }
                    break;
                  case 'Home':
                    if (rowNavEnabled) {
                      event.preventDefault();
                      setCurrentAndFocus(0);
                    }
                    break;
                  case 'End':
                    if (rowNavEnabled) {
                      event.preventDefault();
                      setCurrentAndFocus(focusableRows.length - 1);
                    }
                    break;
                  case 'Enter':
                    if (onRowActivate) {
                      event.preventDefault();
                      onRowActivate({
                        row: rowContext,
                        via: 'keyboard',
                      });
                    }
                    break;
                  default:
                    break;
                }
              }
            : undefined
        }
        className={cn(
          isInteractive && 'cursor-pointer',
          // Roving tabindex makes the row itself focusable, so it
          // needs the kit's focus treatment — otherwise the browser
          // paints its own default outline. `outline` rather than
          // `ring`: box-shadow on a `<tr>` is unreliable across
          // engines, and it is inset so a focused edge row is not
          // clipped by the table's own border.
          rowNavEnabled &&
            'outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--ui-focus-primary)]',
          // Striping alternates by RECORD index, so a detail or status row
          // between two records does not shift the pattern.
          //
          // ── A GROUP HEADER *DOES* SHIFT IT, AND THAT IS A DECISION (#79) ────
          // **Deliberate, ruled by the user, not an off-by-one.** Do not "fix" it.
          //
          // The mechanism, stated so the next reader can check it rather than
          // infer it: `recordIndex` is the index into `recordRows`
          // (`table.getRowModel().rows`), and **with grouping on that list
          // contains the group rows too** — which is exactly why `focusableRows`
          // above has to filter `getIsGrouped()`. So a group row CONSUMES a
          // stripe position, and every record after it lands on the opposite
          // phase from where it would otherwise have been.
          //
          // ⚠ It consumes a position without ever being PAINTED: a group row is
          // rendered by the grouping feature's own `renderDisplayRow`, and this
          // className is `renderRecordRow`'s, so the stripe never reaches it.
          // (`table.tsx` has no `nth-child` striping either — checked; zero
          // occurrences. There is no second mechanism that could paint it.) The
          // ruling is therefore about the *rhythm*, not about tinting headers:
          // group rows occupy the sequence, and the header visually breaks the
          // run anyway, so the shift is accepted rather than corrected.
          //
          // DECLINED: computing the stripe over the record subsequence only. It
          // works, and it would have been the THIRD place this branch needed
          // "index among rows of one kind" instead of "index in the display
          // list" — after U6b's focusable subsequence and #80's `focusableRows`.
          // A recognised shape, declined here on purpose.
          striped &&
            recordIndex % 2 === 1 &&
            !isSelected &&
            !isCurrent &&
            'bg-[var(--ui-background-surface-secondary)]',
          isCurrent &&
            !isSelected &&
            'bg-[var(--ui-table-data-row-color-active)]',
          presentation.className,
          rowClassName?.(rowContext)
        )}
      >
        {row.getVisibleCells().map((cell) => {
          const cellContext = createCellContext(cell, controller);
          const columnPresentation = columnPresentationFor(cell.column.id);
          const resolvedCellStyle = cellStyle?.(cellContext);

          return (
            <TableCell
              key={cell.id}
              // Body cells carry the pin too. Without `data-pinned` here the
              // row's `hover:[&>[data-pinned]]` and selected-state rules cannot
              // match, and an opaque pinned cell repaints over the row tint.
              {...(columnPresentation.pinned === undefined
                ? {}
                : { pinned: columnPresentation.pinned })}
              {...(columnPresentation.pinOffset === undefined
                ? {}
                : { pinOffset: columnPresentation.pinOffset })}
              className={cn(
                columnPresentation.className,
                cellClassName?.(cellContext)
              )}
              style={
                resolvedCellStyle === undefined &&
                columnPresentation.style === undefined
                  ? undefined
                  : { ...columnPresentation.style, ...resolvedCellStyle }
              }
              onClick={
                onCellClick
                  ? (event) =>
                      onCellClick({
                        cell: cellContext,
                        nativeEvent: event,
                      })
                  : undefined
              }
              onMouseEnter={
                onCellHover
                  ? (event) =>
                      onCellHover({
                        cell: cellContext,
                        nativeEvent: event,
                      })
                  : undefined
              }
            >
              {renderCell
                ? renderCell(cellContext)
                : flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          );
        })}
      </TableRow>
    );
  };

  // `aria-hidden`, because a spacer is scroll height rather than content: it is a
  // `<tr>` holding one empty `<td>`, so without it a screen reader meets a blank row
  // at each end of a windowed table. Only reachable since U6a — `isWindowed` was
  // always false before, so these never rendered.
  //
  // `aria-hidden` rather than `role="presentation"`: on a `<tr>` the latter strips the
  // row's own semantics but leaves the empty cell in the tree, which is the problem
  // rather than the fix.
  const spacerRow = (kind: 'top' | 'bottom', px: number) => (
    <TableRow
      key={`window-spacer-${kind}`}
      aria-hidden
      className="hover:bg-transparent"
    >
      <TableCell
        colSpan={emptyColSpan ?? visibleColumnCount}
        style={{ height: px, padding: 0, border: 0 }}
      />
    </TableRow>
  );

  return (
    // **The border is `containerClassName`, not a wrapper `<div>` — one element
    // carries the region's boundary, its width, and its scrolling.** It used to be
    // a wrapper, and that wrapper took no width constraint while `width` went one
    // level further in to the ScrollArea root, so a caller asking for
    // `appearance.width` got a full-width bordered box around a narrow scroll
    // region: measured 1233px of border around 640px of table, with the
    // horizontal scrollbar ending 592px short of the border it appeared to belong
    // to (#90).
    //
    // Two other placements were considered and both keep the split. Putting the
    // width on the wrapper works but leaves `Table.width` dead on this path and
    // hands the same fork to the next sizing member; constraining both elements
    // keeps them agreeing only by discipline, which is exactly the split brain
    // that produced #76 and then #84.
    //
    // `borderedClass` comes along because it is only `[&_th]`/`[&_td]` descendant
    // selectors — it needs an ancestor and does not care which.
    //
    // Two measured consequences worth stating, because neither is visible in the
    // diff. **The viewport's `rounded-[inherit]` (`scroll-area.tsx:111`) was inert**
    // — it read `0px`, because the radius sat on the wrapper one level up; it now
    // reads `6px`, which is what that line was written for. And `box-sizing:
    // border-box` means an explicit `width` now *includes* the 2px border, so a
    // `width: 640` scroll container holds 638px of content rather than 640.
    <Table
      // #77. On the `<table>` itself, not the scroll container — `Table` spreads
      // `...props` onto the table element, and `aria-rowcount` on a wrapper would be
      // an attribute on a div that no row belongs to. `undefined` while unwindowed
      // omits it; see the block at `rowPositions`.
      aria-rowcount={rowPositions?.rowCount}
      containerRef={containerRef}
      // The resize indicator's rule and its offset both land on this element, for
      // the reasons in `data-table-resize-indicator.ts`. Both halves are absent at
      // rest: no drag, no class and no custom property.
      containerClassName={cn(
        'rounded-md border border-[var(--ui-table-global-row-border-color)]',
        borderedClass,
        resizeIndicator.className
      )}
      {...(resizeIndicator.style === undefined
        ? {}
        : { containerStyle: resizeIndicator.style })}
      {...(size === undefined ? {} : { size })}
      {...(background === undefined ? {} : { background })}
      {...(borders === undefined ? {} : { borders })}
      {...(width === undefined ? {} : { width })}
      {...(height === undefined ? {} : { height })}
      {...(maxHeight === undefined ? {} : { maxHeight })}
    >
      {showHeader ? (
        <TableHeader sticky={stickyHeader || undefined}>
          {table.getHeaderGroups().map((headerGroup, headerRowIndex) => (
            // #77. The header rows are rows 1..n, and the body's indices are offset
            // by them. Set explicitly rather than left implicit: mixing explicit
            // body indices with an implicit header index is where the two counting
            // schemes could disagree.
            <TableRow
              key={headerGroup.id}
              aria-rowindex={rowPositions?.headerRowIndex(headerRowIndex)}
            >
              {headerGroup.headers.map((header) => {
                if (header.isPlaceholder) {
                  return <TableHead key={header.id} />;
                }

                const context = createHeaderContext(header, controller);
                const defaultContent = flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                );
                const label = renderHeader
                  ? renderHeader(context, defaultContent)
                  : defaultContent;
                const isSortable = sortable && context.canSort;
                const presentation = composeColumnPresentation(
                  features.modules,
                  { ...viewContext, column: header.column, header },
                  features.configs
                );
                const resolvedHeaderStyle = headerStyle?.(context);

                // `edge` adornments are routed to `trailing`, never to children.
                // A sortable header wraps its children in a `<button>`, so a
                // control passed as a child has its pointer release fire
                // `onSort`, its Enter/Space sort instead of act, and its label
                // absorbed into the button's accessible name — a `must` grammar
                // rule. A records grid is normally sortable *and* resizable, so
                // that is the common case, not an edge one. `trailing` is a
                // sibling of the sort button.
                return (
                  <TableHead
                    key={header.id}
                    // The resize indicator's coordinate origin: the column's own
                    // leading edge has to be measured, because where a column
                    // starts depends on the columns before it, on the pin regions
                    // and on horizontal scroll. Keyed by column id, since that is
                    // what `columnSizingInfo.isResizingColumn` reports.
                    ref={resizeIndicator.registerHeaderCell(header.column.id)}
                    // **The column identity, in the DOM.** A pointer gesture that
                    // has to answer "which column is under the pointer?" resolves
                    // it by containment in measured header-cell rects (#106), and
                    // then needs the cell's column id to name a command target.
                    // Publishing it here rather than through a second
                    // `registerHeaderCell`-style registry keeps the answer on the
                    // element the rect came from, so the two cannot disagree — and
                    // a composer wiring its own gesture gets it without a seam.
                    //
                    // Deliberately not on the `isPlaceholder` branch above: a
                    // placeholder cell stands for no column, so it must not be a
                    // drop target, and leaving the attribute off makes it
                    // unavailable rather than filtered out later.
                    data-column-id={header.column.id}
                    sortable={isSortable || undefined}
                    sortDirection={
                      isSortable ? context.sortDirection : undefined
                    }
                    sortPriority={
                      isSortable &&
                      context.sortCount > 1 &&
                      context.sortIndex >= 0
                        ? context.sortIndex + 1
                        : undefined
                    }
                    onSort={
                      isSortable
                        ? (event) => context.toggleSort(event.shiftKey)
                        : undefined
                    }
                    className={cn(
                      presentation.className,
                      headerClassName?.(context)
                    )}
                    style={
                      resolvedHeaderStyle === undefined &&
                      presentation.style === undefined
                        ? undefined
                        : {
                            ...presentation.style,
                            ...resolvedHeaderStyle,
                          }
                    }
                    {...(presentation.pinned === undefined
                      ? {}
                      : { pinned: presentation.pinned })}
                    {...(presentation.pinOffset === undefined
                      ? {}
                      : { pinOffset: presentation.pinOffset })}
                    trailing={adornmentsAt(presentation, 'edge')}
                  >
                    {/* The header-cell seam (ADR-0002, BL-3a). Only
                          non-interactive decoration belongs here — anything
                          focusable or clickable must use `placement: 'edge'`. */}
                    {adornmentsAt(presentation, 'before-label')}
                    {label}
                    {adornmentsAt(presentation, 'after-label')}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
      ) : null}
      <TableBody>
        {renderState && status !== 'loaded' ? (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={emptyColSpan ?? visibleColumnCount}
              className="h-24 text-center"
            >
              {renderState(
                createStateContext({
                  status,
                  rowCount: recordRows.length,
                  visibleColumnCount,
                })
              )}
            </TableCell>
          </TableRow>
        ) : skeleton ? (
          Array.from({ length: skeletonRows }).map((_, rowIndex) => (
            <TableRow
              // eslint-disable-next-line @eslint-react/no-array-index-key -- static skeleton placeholders have no data identity; row position is the only key
              key={`skeleton-${rowIndex}`}
              className="hover:bg-transparent"
            >
              {table.getVisibleLeafColumns().map((column) => (
                <TableCell key={column.id}>
                  <div className="h-4 w-full animate-pulse rounded bg-[var(--ui-background-surface-secondary)]" />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : recordRows.length ? (
          <>
            {bodyWindow.isWindowed && bodyWindow.paddingTop > 0
              ? spacerRow('top', bodyWindow.paddingTop)
              : null}
            {bodyRows.map(({ displayRow, displayIndex }) => (
              <Fragment key={displayRowKey(displayRow)}>
                {displayRow.kind === 'data'
                  ? renderRecordRow(displayRow, displayIndex)
                  : withMeasurement(
                      dispatchDisplayRow(
                        features.modules,
                        displayRow,
                        viewContext,
                        features.configs
                      ),
                      displayIndex
                    )}
              </Fragment>
            ))}
            {bodyWindow.isWindowed && bodyWindow.paddingBottom > 0
              ? spacerRow('bottom', bodyWindow.paddingBottom)
              : null}
          </>
        ) : (
          <TableRow>
            <TableCell
              colSpan={emptyColSpan ?? table.getVisibleLeafColumns().length}
              className="h-24 text-center text-[var(--ui-table-data-value-color-disabled)]"
            >
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      {footerRows.length ? (
        <TableFooter sticky={stickyFooter || undefined}>
          {footerRows.map(({ displayRow, displayIndex }) => (
            <Fragment key={displayRowKey(displayRow)}>
              {withMeasurement(
                dispatchDisplayRow(
                  features.modules,
                  displayRow,
                  viewContext,
                  features.configs
                ),
                displayIndex
              )}
            </Fragment>
          ))}
        </TableFooter>
      ) : null}
    </Table>
  );
}

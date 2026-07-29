/**
 * The **one** place this kit asks the document which way the inline axis runs.
 *
 * ── WHY IT IS A MODULE OF ITS OWN, AND WHY THAT IS THE WHOLE FIX (#97) ───────
 * The column-resize drag was inverted in a right-to-left document while the
 * keyboard path was correct — measured, not inferred: dragging the handle in the
 * widening direction moved a 348.7px column to 288.7px, a delta of **−60.0px for
 * 60px of travel**, an exact sign flip, while `ArrowLeft` on the same handle
 * correctly grew it 150 → 166.
 *
 * The defect was never "the kit reasons about direction". It is that the two paths
 * resolved direction **from two different places**:
 *
 *  - the keyboard path read `getComputedStyle(element).direction` live, at keypress;
 *  - the drag inherited `table-core`'s `columnResizeDirection` option, which the kit
 *    never set — so it kept the library's build-time `'ltr'` default
 *    (`ColumnSizing.js:48`) and multiplied every delta by `+1`
 *    (`ColumnSizing.js:123`) even where the handle had moved to the opposite
 *    physical edge.
 *
 * They disagreed because they disagreed about where direction comes from. So the
 * fix is not a sign flip somewhere; it is **one resolver, serving both paths**, and
 * this module is it. If a third path ever needs the inline axis it must come here
 * too — a second `getComputedStyle(…).direction` anywhere in the table family
 * reintroduces the defect in its original shape.
 *
 * ── WHY IT LIVES IN THE DATA-TABLE LAYER ─────────────────────────────────────
 * Both callers need it and they are on opposite sides of a one-way boundary:
 * DataGrid's header chrome owns the keyboard path, the DataTable controller owns
 * the engine option, and **DataTable must not import from DataGrid**. So the shared
 * answer has to sit at or below the lower of the two.
 *
 * ── WHY IT IS NOT A CONFIG MEMBER ────────────────────────────────────────────
 * A `resizeDirection` prop would push an engine-physical concern onto every
 * consumer, who would then have to keep it in sync with the document by hand — and
 * it would contradict the keyboard path, which already resolves this correctly
 * without being told.
 */

/** Physical, because that is what a client rect and a `clientX` delta are. */
export type DataTableInlineDirection = 'ltr' | 'rtl';

/**
 * Which way the inline axis runs for `element`.
 *
 * **Element-level, not document-level, and the difference is load-bearing.** A
 * subtree may carry its own `dir`, so `getComputedStyle(document.documentElement)`
 * answers a different question — one that merely *usually* agrees. Reading the
 * element keeps this resolver interchangeable with the keyboard path's, which is
 * the property that makes it one source rather than two that coincide.
 *
 * `null` answers `'ltr'`: with no element there is nothing to measure, and the
 * default matches both the browser's and `table-core`'s. Under happy-dom
 * `getComputedStyle` returns a style object whose `direction` is `''` unless
 * something set it, which also lands on `'ltr'` — so an un-laid-out tree behaves as
 * left-to-right rather than throwing.
 */
export function resolveInlineDirection(
  element: Element | null | undefined
): DataTableInlineDirection {
  if (element === null || element === undefined) return 'ltr';
  return getComputedStyle(element).direction === 'rtl' ? 'rtl' : 'ltr';
}

/**
 * A direction as a multiplier, for a path that steps along the inline axis.
 *
 * ⚠ **Takes the direction, NOT an element, and the split is what makes this
 * testable.** happy-dom implements no style resolution for `direction`: measured,
 * `getComputedStyle(el).direction` returns `'ltr'` for an element carrying
 * `dir="rtl"`, for its descendants, and for `document.body` alike. So anything that
 * reads the computed style is unreachable from a unit test except by stubbing
 * `getComputedStyle` — and a test built on that stub asserts the stub.
 *
 * Keeping the read in `resolveInlineDirection` and the *decision* here shrinks the
 * unguardable surface to one line. Everything downstream of a direction value is
 * ordinary logic with ordinary tests; only the one call that asks the browser is
 * browser-verified.
 */
export function inlineDirectionSign(
  direction: DataTableInlineDirection
): 1 | -1 {
  return direction === 'rtl' ? -1 : 1;
}

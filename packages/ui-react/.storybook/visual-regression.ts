export type VisualColorMode = 'light' | 'dark';

const DEFAULT_COLOR_MODE: VisualColorMode = 'light';

export function resolveVisualColorMode(
  colorMode: string | undefined
): VisualColorMode {
  return colorMode === 'dark' ? 'dark' : DEFAULT_COLOR_MODE;
}

export function getSnapshotIdentifier(
  storyId: string,
  colorMode: VisualColorMode
): string {
  return colorMode === 'dark' ? `${storyId}--dark` : storyId;
}

/**
 * Does the clipped capture drop content off the bottom of the frame?
 *
 * The runner clips to the union bbox + `padding`, capping the height at
 * `viewport.height - y`. When that cap binds, the captured region ends at exactly
 * `viewport.height`, so **content below the viewport is not in the baseline** —
 * silently, and the run stays green.
 *
 * Derivation, because the obvious predicate is the wrong one. The region is
 * `[y, y + h)` with `y = max(0, minY - padding)` and
 * `h = min(maxY - minY + 2 * padding, viewport.height - y)`.
 * - Uncapped: `y + h` exceeds `maxY` by at least `padding`. Nothing lost.
 * - Capped: `h = viewport.height - y`, so `y + h === viewport.height`, and content
 *   is lost **iff `maxY > viewport.height`.**
 *
 * So this is `maxY > viewport.height` — necessary *and* sufficient — and **not**
 * "did the cap bind". A story that fills the viewport exactly (`layout:
 * 'fullscreen'` with `h-screen`, i.e. every `components-appshell--*`) also binds the
 * cap but loses only the decorative padding: 22 correct baselines would fail a
 * cap-bound check.
 *
 * Only the vertical axis is checked. ~150 baselines legitimately reach the right
 * edge because `layout: 'padded'` stories are full-width, so a horizontal check
 * would bury the real findings under false positives.
 *
 * **No tolerance.** A tolerance is how a check goes quiet, and a silently truncated
 * baseline is the defect this exists to remove.
 *
 * **A geometry it cannot read is reported as truncated.** `NaN > n` is `false`, so a
 * bare comparison would return "not truncated" for a measurement that never arrived
 * — passing green on no evidence, which is this check's own failure mode. On this
 * branch a guard passed 20/20 while comparing `NaN`. Same stance as
 * `assertRenderingStory`: a check that cannot decide must be loud.
 */
export function isCaptureTruncated(
  contentBottom: number,
  viewportHeight: number
): boolean {
  if (!Number.isFinite(contentBottom) || !Number.isFinite(viewportHeight)) {
    return true;
  }
  return contentBottom > viewportHeight;
}

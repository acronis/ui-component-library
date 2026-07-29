import {
  getSnapshotIdentifier,
  isCaptureTruncated,
  resolveVisualColorMode,
} from './visual-regression';

describe('visual regression helpers', () => {
  it('defaults color mode to light', () => {
    expect(resolveVisualColorMode(undefined)).toBe('light');
    expect(resolveVisualColorMode('invalid')).toBe('light');
  });

  it('resolves dark color mode', () => {
    expect(resolveVisualColorMode('dark')).toBe('dark');
  });

  it('suffixes dark snapshot identifiers', () => {
    expect(getSnapshotIdentifier('ui-button--default', 'light')).toBe(
      'ui-button--default'
    );
    expect(getSnapshotIdentifier('ui-button--default', 'dark')).toBe(
      'ui-button--default--dark'
    );
  });
});

/**
 * These exercise the ARITHMETIC ONLY. They do **not** establish that the numbers
 * reaching `isCaptureTruncated` in the runner are the real `maxY` — that coupling is
 * unexercised and registered as owed in F18-P5 of the baseline-prediction registry.
 * Two separate claims, deliberately not merged into one.
 */
describe('isCaptureTruncated', () => {
  const VIEWPORT = 720;

  it('fires when content extends past the viewport bottom', () => {
    // Real cases: ui-table--borders (~1090px of content) and the formlayout forms.
    expect(isCaptureTruncated(1090, VIEWPORT)).toBe(true);
    expect(isCaptureTruncated(900, VIEWPORT)).toBe(true);
    expect(isCaptureTruncated(721, VIEWPORT)).toBe(true);
  });

  it('does NOT fire when content ends exactly at the viewport bottom', () => {
    // The `components-appshell--*` class: `layout: 'fullscreen'` + `h-screen`, so the
    // height cap binds but only the decorative padding is lost, not content. This is
    // the `>` vs `>=` boundary, and `>=` here would redden 22 correct baselines.
    expect(isCaptureTruncated(VIEWPORT, VIEWPORT)).toBe(false);
  });

  it('does NOT fire for content shorter than the viewport', () => {
    // The verified-clean pair: grouping--multiple-grouping-columns and
    // ui-table--sizes, whose captures are 699px and 696px tall.
    expect(isCaptureTruncated(699, VIEWPORT)).toBe(false);
    expect(isCaptureTruncated(696, VIEWPORT)).toBe(false);
    expect(isCaptureTruncated(0, VIEWPORT)).toBe(false);
  });

  it('reports an unreadable geometry as truncated rather than passing green', () => {
    // `NaN > 720` is false, so a bare comparison would return "not truncated" for a
    // measurement that never arrived — green on no evidence, which is exactly this
    // check's own failure mode. A guard on this branch passed 20/20 comparing `NaN`.
    expect(isCaptureTruncated(Number.NaN, VIEWPORT)).toBe(true);
    expect(isCaptureTruncated(800, Number.NaN)).toBe(true);
    expect(isCaptureTruncated(Number.POSITIVE_INFINITY, VIEWPORT)).toBe(true);
  });
});

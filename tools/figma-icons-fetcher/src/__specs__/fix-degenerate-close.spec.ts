import { describe, expect, it } from 'vitest';

import {
  fixDegenerateClose,
  fixDegenerateCloses,
  parsePathSegments,
} from '../fix-degenerate-close';

/**
 * Replays a path's commands the way a renderer would and reports the gap
 * between the final point and the subpath start — the quantity that decides
 * whether `Z` closes a degenerate (spike-producing) segment.
 */
function closeGap(d: string): number {
  const segments = parsePathSegments(d);
  if (!segments) throw new Error(`unparsable path: ${d}`);

  let x = 0;
  let y = 0;
  let subpathX = 0;
  let subpathY = 0;
  let gap = 0;

  for (const segment of segments) {
    const upper = segment.command.toUpperCase();
    const relative = segment.command !== upper;
    const args = segment.args;

    switch (upper) {
      case 'Z':
        gap = Math.hypot(x - subpathX, y - subpathY);
        x = subpathX;
        y = subpathY;
        break;
      case 'M':
        x = relative ? x + args[0] : args[0];
        y = relative ? y + args[1] : args[1];
        subpathX = x;
        subpathY = y;
        break;
      case 'H':
        x = relative ? x + args[0] : args[0];
        break;
      case 'V':
        y = relative ? y + args[0] : args[0];
        break;
      case 'A':
        x = relative ? x + args[5] : args[5];
        y = relative ? y + args[6] : args[6];
        break;
      default:
        x = relative ? x + args[args.length - 2] : args[args.length - 2];
        y = relative ? y + args[args.length - 1] : args[args.length - 1];
        break;
    }
  }

  return gap;
}

// The two real defects from `shapes-multi`: the triangle drifts by float
// accumulation alone, the diamond by `floatPrecision: 4` rounding.
const TRIANGLE =
  'm13.4543 9.2427 3.617-6.0281c.1942-.3237.6632-.3237.8574 0l3.617 6.0282c.1999.3332-.0401.7572-.4288.7572h-7.2338c-.3887 0-.6287-.424-.4288-.7573Z';
const DIAMOND =
  'm2.8535 17.1464 3.293-3.2928a.5.5 0 0 1 .707 0l3.2929 3.2928a.5.5 0 0 1 0 .7072l-3.2928 3.2928a.5.5 0 0 1-.7072 0l-3.2928-3.2928a.5.5 0 0 1 0-.7072Z';

describe('parsePathSegments', () => {
  it('splits implicit coordinate repeats into separate segments', () => {
    const segments = parsePathSegments('M0 0 1 1 2 2');
    expect(segments?.map((segment) => segment.command)).toEqual([
      'M',
      'L',
      'L',
    ]);
  });

  it('reads unseparated arc flags', () => {
    const segments = parsePathSegments('M0 0a.5.5 0 011 1');
    expect(segments?.[1].args).toEqual([0.5, 0.5, 0, 0, 1, 1, 1]);
  });

  it('records source offsets that map back to the input', () => {
    const d = 'M0 0h5Z';
    const segments = parsePathSegments(d);
    expect(segments?.map((s) => d.slice(s.start, s.end))).toEqual([
      'M0 0',
      'h5',
      'Z',
    ]);
  });

  it('returns null for data it cannot parse', () => {
    expect(parsePathSegments('5 5 L1 1')).toBeNull();
    expect(parsePathSegments('M0 0Z1 1')).toBeNull();
  });
});

describe('fixDegenerateClose', () => {
  it('snaps a float-accumulation drift shut', () => {
    expect(closeGap(TRIANGLE)).toBeGreaterThan(0);
    expect(closeGap(fixDegenerateClose(TRIANGLE))).toBe(0);
  });

  it('snaps a rounding gap shut', () => {
    expect(closeGap(DIAMOND)).toBeCloseTo(1e-4, 6);
    expect(closeGap(fixDegenerateClose(DIAMOND))).toBe(0);
  });

  it('rewrites only the final segment, leaving the rest byte-identical', () => {
    const fixed = fixDegenerateClose(TRIANGLE);
    const untouchedPrefix = TRIANGLE.slice(0, TRIANGLE.indexOf('c-.3887'));
    expect(fixed.startsWith(untouchedPrefix)).toBe(true);
    expect(fixed).toContain('C13.4944 10 13.2544 9.576 13.4543 9.2427Z');
  });

  it('preserves the arc radii and flags when snapping an arc', () => {
    const fixed = fixDegenerateClose(DIAMOND);
    expect(fixed).toContain('A.5.5 0 0 1 2.8535 17.1464Z');
  });

  it('leaves an already-exact close untouched', () => {
    const d = 'M4 4 20 4 4 20 4 4Z';
    expect(fixDegenerateClose(d)).toBe(d);
  });

  it('leaves an intentionally open shape untouched', () => {
    // A 0.5-unit gap is design, not float noise.
    const d = 'M4 4 20 4 4 20 4.5 4Z';
    expect(fixDegenerateClose(d)).toBe(d);
  });

  it('leaves unclosed paths untouched', () => {
    const d = 'M7 21V10c0-.552.448-1 1-1h8M7 15h10';
    expect(fixDegenerateClose(d)).toBe(d);
  });

  it('repairs each subpath of a multi-subpath path independently', () => {
    const d = 'M0 0h5v5h-5v-5.0001Z M10 10h5v5h-5v-5Z';
    const fixed = fixDegenerateClose(d);
    expect(closeGap(fixed)).toBe(0);
    expect(fixed).toContain('h5v5h-5L0 0Z');
    expect(fixed).toContain('M10 10h5v5h-5v-5Z');
  });

  it('returns unparsable data unchanged', () => {
    expect(fixDegenerateClose('not-a-path')).toBe('not-a-path');
  });
});

describe('fixDegenerateCloses', () => {
  it('repairs every d attribute in the markup', () => {
    const svg = `<svg viewBox="0 0 24 24"><circle cx="6.5" cy="6.5" r="3.5"/><path stroke-width="2" d="${TRIANGLE}"/><path stroke-width="2" d="${DIAMOND}"/></svg>`;
    const fixed = fixDegenerateCloses(svg);

    for (const match of fixed.matchAll(/\sd="([^"]+)"/g)) {
      expect(closeGap(match[1])).toBe(0);
    }
    // Non-path markup is left alone.
    expect(fixed).toContain('<circle cx="6.5" cy="6.5" r="3.5"/>');
  });
});

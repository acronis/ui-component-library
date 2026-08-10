/**
 * Repairs sub-epsilon `closepath` segments in SVGO-optimized path data.
 *
 * SVGO's `convertPathData` emits compact *relative* commands. Accumulating
 * those deltas as IEEE-754 doubles does not always land exactly back on the
 * subpath's start point — e.g. `shapes-multi`'s triangle drifts by 2.5e-15,
 * and rounding to `floatPrecision: 4` can leave a real 1e-4 gap. The trailing
 * `Z` then closes a segment of near-zero but non-zero length, and Skia
 * (Chrome/Electron) derives a stroke-join tangent from that garbage direction:
 * with the default `stroke-linejoin="miter"` it renders a large spike at the
 * subpath start. Figma's own renderer does not, so the icon looks correct in
 * the design file and broken once imported.
 *
 * The fix is to snap the final segment's endpoint exactly onto the subpath
 * start so `Z` becomes a true zero-length close, which renderers skip. That
 * requires the endpoint to be written *absolutely* (a relative delta cannot
 * express the drift), so the affected segment is rewritten in absolute form.
 *
 * Every edit is a surgical substring replacement — untouched paths, and
 * untouched segments within a repaired path, stay byte-identical to SVGO's
 * output so refetching produces a minimal diff.
 */

/** Largest gap treated as float noise rather than an intentionally open shape. */
const CLOSE_TOLERANCE = 1e-3;

/** Matches SVGO's `floatPrecision: 4`, so snapped coordinates stay in style. */
const PRECISION = 4;

const NUMBER = /[+-]?(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?/g;

/** Argument count per path command, keyed by the uppercase letter. */
const ARITY: Record<string, number> = {
  M: 2,
  L: 2,
  H: 1,
  V: 1,
  C: 6,
  S: 4,
  Q: 4,
  T: 2,
  A: 7,
  Z: 0,
};

interface Segment {
  /** Command letter as written (case carries relative/absolute). */
  command: string;
  args: number[];
  /** Offset of this segment's first character in the source `d`. */
  start: number;
  /** Offset just past this segment's last character. */
  end: number;
}

/**
 * Splits path data into one segment per coordinate group, so an implicit
 * repeat (`c … …`) becomes two segments. Source offsets are preserved so the
 * caller can patch a single group without reserializing the whole path.
 * Returns `null` for anything it cannot parse, so callers leave it alone.
 */
export function parsePathSegments(d: string): Segment[] | null {
  const segments: Segment[] = [];
  let i = 0;
  let command = '';

  const skipSeparators = () => {
    while (i < d.length && /[\s,]/.test(d[i])) i += 1;
  };

  const readNumber = (): number | null => {
    NUMBER.lastIndex = i;
    const match = NUMBER.exec(d);
    if (!match || match.index !== i) return null;
    i += match[0].length;
    return Number(match[0]);
  };

  skipSeparators();

  while (i < d.length) {
    const groupStart = i;

    if (/[a-zA-Z]/.test(d[i])) {
      command = d[i];
      i += 1;
    } else if (!command) {
      return null; // coordinates before any command
    } else if (command === 'M' || command === 'm') {
      // An implicit repeat after a moveto is a lineto (per the SVG spec).
      command = command === 'M' ? 'L' : 'l';
    }

    const upper = command.toUpperCase();
    const arity = ARITY[upper];
    if (arity === undefined) return null;

    const args: number[] = [];
    for (let n = 0; n < arity; n += 1) {
      skipSeparators();
      // Arc flags are single digits and may be written unseparated ("0 01").
      if (upper === 'A' && (n === 3 || n === 4)) {
        if (d[i] !== '0' && d[i] !== '1') return null;
        args.push(Number(d[i]));
        i += 1;
        continue;
      }
      const value = readNumber();
      if (value === null) return null;
      args.push(value);
    }

    // A zero-width group means the cursor did not advance (e.g. a coordinate
    // following `Z`, which takes no arguments) — bail out rather than spin.
    if (i === groupStart) return null;

    segments.push({ command, args, start: groupStart, end: i });
    skipSeparators();
  }

  return segments;
}

function formatNumber(value: number): string {
  const rounded = Number(value.toFixed(PRECISION));
  const text = String(rounded);
  // SVGO drops the redundant leading zero ("0.5" -> ".5"); match that.
  return text.startsWith('0.')
    ? text.slice(1)
    : text.startsWith('-0.')
      ? `-${text.slice(2)}`
      : text;
}

/**
 * Joins numbers the way SVGO does — dropping the separator whenever the next
 * token can only be read as a new number anyway (`-` always terminates the
 * previous one, and so does a second `.`).
 */
function formatArgs(values: number[]): string {
  return values.map(formatNumber).reduce((acc, text) => {
    if (!acc) return text;
    const glueable =
      text.startsWith('-') ||
      (text.startsWith('.') &&
        acc.slice(acc.lastIndexOf(' ') + 1).includes('.'));
    return glueable ? acc + text : `${acc} ${text}`;
  }, '');
}

/**
 * Rewrites `segment` in absolute form so it ends exactly at (`endX`, `endY`).
 * Returns `null` for commands that cannot carry an explicit endpoint.
 */
function absoluteSegmentEndingAt(
  segment: Segment,
  fromX: number,
  fromY: number,
  endX: number,
  endY: number
): string | null {
  const upper = segment.command.toUpperCase();
  const isRelative = segment.command !== upper;
  const args = segment.args;
  const absX = (value: number) => (isRelative ? fromX + value : value);
  const absY = (value: number) => (isRelative ? fromY + value : value);

  switch (upper) {
    case 'L':
    case 'H':
    case 'V':
    case 'T':
      return `L${formatArgs([endX, endY])}`;
    case 'C':
      return `C${formatArgs([
        absX(args[0]),
        absY(args[1]),
        absX(args[2]),
        absY(args[3]),
        endX,
        endY,
      ])}`;
    case 'S':
      return `S${formatArgs([absX(args[0]), absY(args[1]), endX, endY])}`;
    case 'Q':
      return `Q${formatArgs([absX(args[0]), absY(args[1]), endX, endY])}`;
    case 'A':
      return `A${formatArgs(args.slice(0, 3))} ${args[3]} ${args[4]} ${formatArgs([endX, endY])}`;
    default:
      // A moveto directly before `Z` is an empty subpath — nothing to snap.
      return null;
  }
}

/**
 * Snaps near-degenerate `Z` closes in one `d` attribute. Returns the input
 * unchanged when nothing needs repair or the data cannot be parsed.
 */
export function fixDegenerateClose(d: string): string {
  const segments = parsePathSegments(d);
  if (!segments) return d;

  // Absolute point each segment starts from, and the subpath start it closes to.
  let x = 0;
  let y = 0;
  let subpathX = 0;
  let subpathY = 0;
  const edits: Array<{ start: number; end: number; text: string }> = [];

  for (const [index, segment] of segments.entries()) {
    const upper = segment.command.toUpperCase();
    const isRelative = segment.command !== upper;
    const args = segment.args;
    const fromX = x;
    const fromY = y;

    switch (upper) {
      case 'Z': {
        const gap = Math.hypot(x - subpathX, y - subpathY);
        const previous = segments[index - 1];
        if (gap > 0 && gap <= CLOSE_TOLERANCE && previous) {
          // `previous` starts wherever the segment before it ended. Replay is
          // cheaper than storing every start point, and paths are tiny.
          const { startX, startY } = startPointOf(segments, index - 1);
          const text = absoluteSegmentEndingAt(
            previous,
            startX,
            startY,
            subpathX,
            subpathY
          );
          if (text) {
            edits.push({ start: previous.start, end: previous.end, text });
          }
        }
        x = subpathX;
        y = subpathY;
        break;
      }
      case 'M':
        x = isRelative ? x + args[0] : args[0];
        y = isRelative ? y + args[1] : args[1];
        subpathX = x;
        subpathY = y;
        break;
      case 'H':
        x = isRelative ? x + args[0] : args[0];
        break;
      case 'V':
        y = isRelative ? y + args[0] : args[0];
        break;
      case 'A':
        x = isRelative ? x + args[5] : args[5];
        y = isRelative ? y + args[6] : args[6];
        break;
      default: {
        // L/T take 2 args, S/Q take 4, C takes 6 — the endpoint is always last.
        const lastX = args[args.length - 2];
        const lastY = args[args.length - 1];
        x = isRelative ? fromX + lastX : lastX;
        y = isRelative ? fromY + lastY : lastY;
        break;
      }
    }
  }

  if (edits.length === 0) return d;

  // Apply back-to-front so earlier offsets stay valid.
  let result = d;
  for (const edit of edits.reverse()) {
    result = result.slice(0, edit.start) + edit.text + result.slice(edit.end);
  }
  return result;
}

/** Replays the walk to find the absolute point segment `target` starts from. */
function startPointOf(
  segments: Segment[],
  target: number
): { startX: number; startY: number } {
  let x = 0;
  let y = 0;
  let subpathX = 0;
  let subpathY = 0;

  for (let index = 0; index < target; index += 1) {
    const segment = segments[index];
    const upper = segment.command.toUpperCase();
    const isRelative = segment.command !== upper;
    const args = segment.args;

    switch (upper) {
      case 'Z':
        x = subpathX;
        y = subpathY;
        break;
      case 'M':
        x = isRelative ? x + args[0] : args[0];
        y = isRelative ? y + args[1] : args[1];
        subpathX = x;
        subpathY = y;
        break;
      case 'H':
        x = isRelative ? x + args[0] : args[0];
        break;
      case 'V':
        y = isRelative ? y + args[0] : args[0];
        break;
      case 'A':
        x = isRelative ? x + args[5] : args[5];
        y = isRelative ? y + args[6] : args[6];
        break;
      default:
        x = isRelative ? x + args[args.length - 2] : args[args.length - 2];
        y = isRelative ? y + args[args.length - 1] : args[args.length - 1];
        break;
    }
  }

  return { startX: x, startY: y };
}

/** Applies {@link fixDegenerateClose} to every `d` attribute in an SVG string. */
export function fixDegenerateCloses(svg: string): string {
  return svg.replace(
    /(\sd=")([^"]+)(")/g,
    (match, prefix: string, d: string, suffix: string) =>
      `${prefix}${fixDegenerateClose(d)}${suffix}`
  );
}

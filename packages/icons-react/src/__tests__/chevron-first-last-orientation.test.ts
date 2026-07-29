import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

/**
 * Guards the orientation of `chevron-first` / `chevron-last` against being
 * transposed — the two icons shipped carrying each other's artwork from the
 * initial icon import `01040922` until `fadbd068`.
 *
 * WHY THIS TEST LIVES IN icons-react AND NOT IN icons-svg
 * `@constructor-lab/icons-svg` has no test runner (its `test` script is a
 * no-op) and, more importantly, `pull-icons` does a **clean sync**: it deletes
 * and rewrites the whole of `icons-svg/src/svg/` from Figma. A guard stored
 * beside the masters would be wiped along with the thing it guards. This file
 * sits outside that directory, so a sync that reintroduces the transposition
 * fails loudly here instead of silently un-fixing a published defect.
 *
 * IF THIS TEST FAILS, THE ARTWORK IS WRONG — NOT THE TEST.
 * Fix the two components in Figma (`icon-packs-source` node `2246:3201` → pack
 * `stroke-mono` → category `arrows` → `_assetsource/chevron-first` and
 * `_assetsource/chevron-last`), then re-sync. Do not "fix" it by relaxing the
 * assertions.
 */

const require_ = createRequire(import.meta.url);
const iconsSvgRoot = dirname(
  require_.resolve('@constructor-lab/icons-svg/package.json')
);
const svgDir = resolve(iconsSvgRoot, 'src', 'svg');
const packDir = resolve(__dirname, '..', 'packs', 'stroke-mono', 'icons');

type Point = { x: number; y: number };

/**
 * Extracts the subpaths of a path `d` as point lists.
 *
 * Deliberately supports only the straight-line command set these glyphs are
 * drawn with, and **throws on anything else** rather than skipping it. A
 * redraw that introduces curves should fail here — a guard that silently
 * ignores commands it does not understand would pass a transposed pair drawn
 * with arcs.
 */
function subpaths(d: string): Point[][] {
  const tokens = d.match(/[a-z]|-?\d*\.?\d+/gi) ?? [];
  const out: Point[][] = [];
  let current: Point[] = [];
  let cursor: Point = { x: 0, y: 0 };
  let command = '';
  let i = 0;

  const num = () => {
    const value = Number(tokens[i++]);
    if (!Number.isFinite(value)) {
      throw new Error(`Malformed path data near token ${i} in "${d}"`);
    }
    return value;
  };
  const push = (point: Point) => {
    current.push(point);
    cursor = point;
  };

  while (i < tokens.length) {
    if (/[a-z]/i.test(tokens[i])) {
      command = tokens[i++];
      if (command === 'M' || command === 'm') {
        if (current.length > 0) out.push(current);
        current = [];
      }
    }

    switch (command) {
      case 'M':
      case 'L':
        push({ x: num(), y: num() });
        break;
      case 'm':
      case 'l':
        push({ x: cursor.x + num(), y: cursor.y + num() });
        break;
      case 'H':
        push({ x: num(), y: cursor.y });
        break;
      case 'h':
        push({ x: cursor.x + num(), y: cursor.y });
        break;
      case 'V':
        push({ x: cursor.x, y: num() });
        break;
      case 'v':
        push({ x: cursor.x, y: cursor.y + num() });
        break;
      default:
        throw new Error(
          `Unsupported path command "${command}" in "${d}". ` +
            `This guard only understands straight-line commands; extend it ` +
            `rather than deleting the assertion.`
        );
    }

    // An implicit repeat of `m`/`M` is a lineto, not another moveto.
    if (command === 'm') command = 'l';
    if (command === 'M') command = 'L';
  }
  if (current.length > 0) out.push(current);
  return out;
}

/** The x of the vertical terminus bar: every point shares one x, and y varies. */
function terminusBarX(paths: Point[][]): number {
  const bars = paths.filter(
    (p) =>
      p.length >= 2 &&
      p.every((q) => Math.abs(q.x - p[0].x) < 0.01) &&
      p.some((q) => Math.abs(q.y - p[0].y) > 0.01)
  );
  expect(
    bars,
    'expected exactly one vertical terminus bar subpath'
  ).toHaveLength(1);
  return bars[0][0].x;
}

/** The chevron: three points whose middle one is the vertex. */
function chevron(paths: Point[][]): { vertex: Point; arms: [Point, Point] } {
  const found = paths.filter((p) => p.length === 3);
  expect(found, 'expected exactly one 3-point chevron subpath').toHaveLength(1);
  const [a, vertex, b] = found[0];
  return { vertex, arms: [a, b] };
}

/**
 * The discriminating property, asserted rather than the literal bytes so a
 * legitimate redraw at a different scale still passes while a transposition
 * still fails: the chevron must POINT toward its terminus bar, and the bar must
 * sit beyond the vertex on that same side.
 *
 *   chevron-first → `|<`  bar left of vertex, vertex left of both arms
 *   chevron-last  → `>|`  bar right of vertex, vertex right of both arms
 */
function expectOrientation(
  label: string,
  d: string,
  direction: 'left' | 'right'
) {
  const paths = subpaths(d);
  const barX = terminusBarX(paths);
  const { vertex, arms } = chevron(paths);
  const sign = direction === 'left' ? -1 : 1;

  expect(
    Math.sign(vertex.x - arms[0].x),
    `${label}: chevron must point ${direction} (vertex x=${vertex.x} vs arm x=${arms[0].x}) — d="${d}"`
  ).toBe(sign);
  expect(
    Math.sign(vertex.x - arms[1].x),
    `${label}: chevron must point ${direction} (vertex x=${vertex.x} vs arm x=${arms[1].x}) — d="${d}"`
  ).toBe(sign);
  expect(
    Math.sign(barX - vertex.x),
    `${label}: terminus bar must sit on the ${direction} of the vertex (bar x=${barX} vs vertex x=${vertex.x}) — d="${d}"`
  ).toBe(sign);
}

async function pathOfMaster(name: string): Promise<string> {
  const svg = await readFile(resolve(svgDir, `${name}.svg`), 'utf8');
  const d = /\sd="([^"]+)"/.exec(svg)?.[1];
  expect(d, `no path data found in ${name}.svg`).toBeTruthy();
  return d as string;
}

async function pathOfComponent(name: string): Promise<string> {
  const tsx = await readFile(resolve(packDir, `${name}.tsx`), 'utf8');
  const d = /\sd="([^"]+)"/.exec(tsx)?.[1];
  expect(d, `no path data found in generated ${name}.tsx`).toBeTruthy();
  return d as string;
}

// `first` means "go to the beginning", which in LTR is leftward, so its glyph
// must point left and carry its terminus bar on the left. Corroborated inside
// this icon set by `arrow-left-to-line` / `arrow-right-to-line`, which put the
// bar on the side being travelled toward.
const expected = [
  { name: 'chevron-first', direction: 'left' },
  { name: 'chevron-last', direction: 'right' },
] as const;

describe('chevron-first / chevron-last are not transposed', () => {
  describe.each(expected)('$name', ({ name, direction }) => {
    it(`master SVG points ${direction} with its bar on the ${direction}`, async () => {
      expectOrientation(`${name}.svg`, await pathOfMaster(name), direction);
    });

    it(`generated component points ${direction} with its bar on the ${direction}`, async () => {
      expectOrientation(`${name}.tsx`, await pathOfComponent(name), direction);
    });
  });

  it('the two do not share the same orientation', async () => {
    const [first, last] = await Promise.all([
      pathOfMaster('chevron-first'),
      pathOfMaster('chevron-last'),
    ]);
    expect(first).not.toBe(last);
  });
});

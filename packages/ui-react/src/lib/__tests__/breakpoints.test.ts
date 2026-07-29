import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  BREAKPOINT_2XL,
  BREAKPOINT_3XL,
  BREAKPOINT_4XL,
  BREAKPOINT_LG,
  BREAKPOINT_XL,
  ROOT_FONT_SIZE_PX,
  getViewportWidth,
} from '../breakpoints';

// The scale is authored in THREE places (index.css's `@theme` block, its
// `:root, :host` runtime mirror, and the constants above). A comment can't stop
// them drifting; this reads the CSS and asserts every custom property agrees
// with the TS constants in px, so any edit to one place that forgets the others
// fails here.
const EXPECTED_PX: Record<string, number> = {
  lg: BREAKPOINT_LG,
  xl: BREAKPOINT_XL,
  '2xl': BREAKPOINT_2XL,
  '3xl': BREAKPOINT_3XL,
  '4xl': BREAKPOINT_4XL,
};

function readIndexCss(): string {
  // vitest runs with cwd at the package root (`packages/ui-react`).
  return readFileSync(resolve(process.cwd(), 'src/styles/index.css'), 'utf8');
}

function remVarsToPx(css: string, prefix: string): Record<string, number> {
  const re = new RegExp(`--${prefix}-([0-9a-z]+):\\s*([\\d.]+)rem`, 'g');
  const out: Record<string, number> = {};
  for (const m of css.matchAll(re))
    out[m[1]] = Number(m[2]) * ROOT_FONT_SIZE_PX;
  return out;
}

describe('breakpoints', () => {
  it('pins the design-team viewport scale as px numbers (mirrors index.css)', () => {
    expect(ROOT_FONT_SIZE_PX).toBe(16);
    expect(BREAKPOINT_LG).toBe(1024); // 64rem
    expect(BREAKPOINT_XL).toBe(1280); // 80rem
    expect(BREAKPOINT_2XL).toBe(1440); // 90rem
    expect(BREAKPOINT_3XL).toBe(1680); // 105rem
    expect(BREAKPOINT_4XL).toBe(1920); // 120rem
  });

  it('reports the ascending order the design scale requires', () => {
    expect([
      BREAKPOINT_LG,
      BREAKPOINT_XL,
      BREAKPOINT_2XL,
      BREAKPOINT_3XL,
      BREAKPOINT_4XL,
    ]).toEqual([1024, 1280, 1440, 1680, 1920]);
  });

  it('reads the current viewport width when a window exists', () => {
    expect(getViewportWidth()).toBe(window.innerWidth);
  });
});

describe('breakpoint scale stays in sync across all three representations', () => {
  const css = readIndexCss();

  it('the Tailwind `@theme` breakpoints match the TS constants', () => {
    const themeVars = remVarsToPx(css, 'breakpoint');
    // Guard against a vacuous pass if the block is renamed/removed.
    expect(Object.keys(themeVars).sort()).toEqual(
      Object.keys(EXPECTED_PX).sort()
    );
    expect(themeVars).toEqual(EXPECTED_PX);
  });

  it('the runtime `--ui-breakpoint-*` block matches the TS constants', () => {
    const uiVars = remVarsToPx(css, 'ui-breakpoint');
    expect(Object.keys(uiVars).sort()).toEqual(Object.keys(EXPECTED_PX).sort());
    expect(uiVars).toEqual(EXPECTED_PX);
  });
});

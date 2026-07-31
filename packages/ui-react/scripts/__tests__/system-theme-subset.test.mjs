// Guards scripts/system-theme-subset.mjs — the selector for the `system-dark`
// and `forced-light` capture profiles.
//
// Every test here is about the SAME failure mode: this module's output is a jest
// test-path regex, and a regex that selects fewer files than intended does not
// error. jest runs what it matched, all of it passes, and the run is green while
// covering less than it claims. So the module is written to throw rather than
// return a short list, and these tests are what hold it to that.
//
// `.mjs` rather than `.ts` for the reason given in visual-capture.test.mjs: the
// subject is a plain Node script outside `tsconfig.json`'s `include`.
import { describe, expect, it } from 'vitest';

import {
  assertShellInert,
  buildTestPathPatterns,
  resolveTitleIds,
  SUBSET_GROUPS,
  SUBSET_TITLES,
  subsetStoryIds,
} from '../system-theme-subset.mjs';

/** Shaped like a real `index.json` v5 entry list. */
const entry = (id, title, type = 'story') => ({ id, title, type, name: id });

const INDEX = [
  entry('ui-chart--docs', 'UI/Chart', 'docs'),
  entry('ui-chart--bars', 'UI/Chart'),
  entry('ui-chart--lines', 'UI/Chart'),
  entry('ui-button--default', 'UI/Button'),
  entry('ui-button--disabled', 'UI/Button'),
  entry('components-appshell--expanded', 'Components/AppShell'),
  entry('ui-notinsubset--default', 'UI/NotInSubset'),
];

describe('resolveTitleIds', () => {
  it('derives ids from the live index rather than re-slugging the title', () => {
    expect(resolveTitleIds(INDEX, ['UI/Chart', 'Components/AppShell'])).toEqual(
      ['ui-chart', 'components-appshell']
    );
  });

  it('ignores docs entries, which have no generated test file', () => {
    // `transformPlaywrightJson` filters `type === 'docs'` before writing files,
    // so a title that is docs-only produces no `.test.js` and must not be
    // resolvable — otherwise the pattern names a file that never exists.
    const docsOnly = [entry('ui-x--docs', 'UI/X', 'docs')];
    expect(() => resolveTitleIds(docsOnly, ['UI/X'])).toThrow(
      /no longer exist/
    );
  });

  it('THROWS on a renamed or deleted title instead of skipping it', () => {
    // The whole point. Returning ['ui-chart'] here would shrink the subset and
    // the capture would still pass.
    expect(() => resolveTitleIds(INDEX, ['UI/Chart', 'UI/Gone'])).toThrow(
      /UI\/Gone/
    );
  });

  it('names every missing title, not just the first', () => {
    const error = (() => {
      try {
        resolveTitleIds(INDEX, ['UI/GoneA', 'UI/Chart', 'UI/GoneB']);
      } catch (e) {
        return e.message;
      }
    })();
    expect(error).toContain('UI/GoneA');
    expect(error).toContain('UI/GoneB');
    expect(error).toContain('2 title(s)');
  });

  it('throws when one title maps to two id prefixes', () => {
    // The `id.indexOf('--')` split is an assumption about Storybook's id format.
    // This is where it is checked rather than trusted.
    const ambiguous = [
      entry('ui-chart--bars', 'UI/Chart'),
      entry('ui-charts--bars', 'UI/Chart'),
    ];
    expect(() => resolveTitleIds(ambiguous, ['UI/Chart'])).toThrow(
      /2 id prefixes/
    );
  });

  it('throws on an id with no separator rather than deriving a wrong prefix', () => {
    expect(() =>
      resolveTitleIds([entry('uichart', 'UI/Chart')], ['UI/Chart'])
    ).toThrow(/no '--' separator/);
  });
});

describe('subsetStoryIds', () => {
  it('counts stories in the subset titles, excluding docs and other titles', () => {
    expect(subsetStoryIds(INDEX, ['UI/Chart', 'UI/Button'])).toEqual([
      'ui-chart--bars',
      'ui-chart--lines',
      'ui-button--default',
      'ui-button--disabled',
    ]);
  });
});

describe('buildTestPathPatterns', () => {
  it('emits one pattern per title, since jest ORs its positional patterns', () => {
    // NOT a single `(a|b)` alternation: that reached the container and died on
    // `/bin/sh: 1: Syntax error: "(" unexpected` — see buildTestPathPatterns.
    expect(buildTestPathPatterns(['ui-chart', 'ui-button'])).toEqual([
      '/ui-chart.test.js',
      '/ui-button.test.js',
    ]);
  });

  it('does not match a title that merely ends with a subset title', () => {
    // The collision the leading `/` exists to prevent: without it, `ui-chart`
    // would also select `xui-chart.test.js` — stories nobody asked for, silently
    // included in a run that reports a fixed expected count.
    const [re] = buildTestPathPatterns(['ui-chart']).map((p) => new RegExp(p));
    expect(re.test('/tmp/abc/ui-chart.test.js')).toBe(true);
    expect(re.test('/tmp/abc/xui-chart.test.js')).toBe(false);
    expect(re.test('/tmp/abc/ui-chart-extra.test.js')).toBe(false);
  });

  it('refuses to build an empty pattern list', () => {
    // An empty list would leave jest with no positional filter at all — a
    // full-corpus run filed against the opposite family's baselines.
    expect(() => buildTestPathPatterns([])).toThrow(/every test/);
  });

  it('emits only shell-inert characters', () => {
    expect(() =>
      buildTestPathPatterns(['ui-chart', 'components-appshell'])
    ).not.toThrow();
  });
});

describe('assertShellInert', () => {
  // These arguments cross at least two shells before reaching jest's argv: the
  // compose `sh -c`, then test-storybook's own re-invocation. dash passes `(`
  // through the first (verified) and the second parses it as source, so the only
  // defensible rule is an allowlist, not per-layer escaping.
  it('accepts the characters a title id and path can contain', () => {
    expect(() =>
      assertShellInert('/components-appshell.test.js')
    ).not.toThrow();
    expect(() => assertShellInert('/ui_chart-2.test.js')).not.toThrow();
  });

  it('rejects the alternation that actually broke the container', () => {
    expect(() => assertShellInert('/(ui-chart|ui-button).test.js')).toThrow(
      /reinterpret/
    );
  });

  it('rejects whitespace, backslashes and the regex end anchor', () => {
    expect(() => assertShellInert('/ui chart.test.js')).toThrow(/reinterpret/);
    expect(() => assertShellInert('/ui-chart\\.test\\.js')).toThrow(
      /reinterpret/
    );
    expect(() => assertShellInert('/ui-chart.test.js$')).toThrow(/reinterpret/);
  });

  it('rejects glob characters', () => {
    expect(() => assertShellInert('/ui-*.test.js')).toThrow(/reinterpret/);
    expect(() => assertShellInert('/ui-[a-z].test.js')).toThrow(/reinterpret/);
  });
});

describe('SUBSET_GROUPS', () => {
  it('has no duplicate titles', () => {
    // Harmless to the regex, but it makes two groups claim the same evidence —
    // and "one title per mechanism" is the entire argument for why a 16% sample
    // tests the same property the full corpus would.
    expect(new Set(SUBSET_TITLES).size).toBe(SUBSET_TITLES.length);
  });

  it('states a mechanism for every group', () => {
    for (const group of SUBSET_GROUPS) {
      expect(group.mechanism, JSON.stringify(group.titles)).toBeTruthy();
      expect(group.titles.length).toBeGreaterThan(0);
    }
  });
});

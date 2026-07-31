import { describe, expect, it } from 'vitest';

import {
  CONTRAST_RULE,
  contrastFindings,
  formatStoryAuditReport,
  selectTargets,
  storyUrl,
  THEME_PROFILES,
} from '../screens/audit/story-audit';
import type { IndexEntry } from '../screens/audit/story-audit';
import type { ScreenSnapshot, SnapshotNode } from '../screens/audit/types';

/**
 * The pure half of `scripts/story-audit.ts` — target selection, URL shape, and
 * finding extraction. The browser half is exercised by running the CLI.
 *
 * Every case here guards a way the audit could report a CLEAN SWEEP while having
 * checked nothing, because that is this tool's own failure mode: it exists to
 * catch bugs a green visual-regression run hides, so a green story-audit that
 * measured the wrong pages would put the problem back one level up.
 */

const entry = (id: string, title: string, type = 'story'): IndexEntry => ({
  id,
  title,
  type,
});

const INDEX: IndexEntry[] = [
  entry('ui-accordion--docs', 'UI/Accordion', 'docs'),
  entry('ui-accordion--default', 'UI/Accordion'),
  entry('ui-accordion--multiple', 'UI/Accordion'),
  entry('ui-button--docs', 'UI/Button', 'docs'),
  entry('ui-button--default', 'UI/Button'),
  entry('components-appshell--expanded', 'Components/AppShell'),
];

describe('selectTargets', () => {
  it('takes one story per title by default', () => {
    const story = selectTargets(INDEX, { views: ['story'] });
    expect(story.map((t) => t.id)).toEqual([
      'ui-accordion--default',
      'ui-button--default',
      'components-appshell--expanded',
    ]);
  });

  it('takes every story with --all', () => {
    const story = selectTargets(INDEX, { views: ['story'], all: true });
    expect(story).toHaveLength(4);
    expect(story.map((t) => t.id)).toContain('ui-accordion--multiple');
  });

  it('reaches docs pages through their OWN entry, not a story id', () => {
    // Measured: `iframe.html?id=<storyId>&viewMode=docs` is silently rewritten
    // by Storybook back to `viewMode=story`. An audit that used story ids for
    // the docs pass would render the canvas twice and report docs coverage it
    // never had — the exact false confidence this tool exists to remove.
    const docs = selectTargets(INDEX, { views: ['docs'] });
    expect(docs.map((t) => t.id)).toEqual([
      'ui-accordion--docs',
      'ui-button--docs',
    ]);
    expect(docs.every((t) => t.view === 'docs')).toBe(true);
  });

  it('omits a title with no docs entry rather than inventing one', () => {
    // AppShell is not tagged `autodocs`, so it has no docs page to visit.
    const docs = selectTargets(INDEX, { views: ['docs'] });
    expect(docs.map((t) => t.title)).not.toContain('Components/AppShell');
  });

  it('filters by title substring, case-insensitively', () => {
    const t = selectTargets(INDEX, { titleFilter: 'accordion' });
    expect(t.map((x) => x.id).sort()).toEqual([
      'ui-accordion--default',
      'ui-accordion--docs',
    ]);
  });

  it('returns both views by default', () => {
    const views = new Set(selectTargets(INDEX).map((t) => t.view));
    expect([...views].sort()).toEqual(['docs', 'story']);
  });
});

describe('THEME_PROFILES', () => {
  it('covers both states where the attribute and the OS disagree', () => {
    // The pairs light/dark alone cannot reach — and where a surface and its text
    // most easily end up resolving from different inputs.
    const byName = Object.fromEntries(THEME_PROFILES.map((p) => [p.name, p]));
    expect(byName['system-dark']).toMatchObject({
      dataTheme: null,
      emulate: 'dark',
    });
    expect(byName['forced-light']).toMatchObject({
      dataTheme: 'light',
      emulate: 'dark',
    });
  });
});

describe('storyUrl', () => {
  it('builds an iframe URL and tolerates a trailing slash on the base', () => {
    expect(storyUrl('http://x/', 'ui-button--default', 'story')).toBe(
      'http://x/iframe.html?id=ui-button--default&viewMode=story'
    );
  });
});

const node = (over: Partial<SnapshotNode>): SnapshotNode => ({
  ref: 'div',
  tag: 'div',
  role: null,
  region: null,
  regionChild: false,
  text: 'Hello',
  ownText: 'Hello',
  accessibleName: null,
  interactive: false,
  disabled: false,
  isIcon: false,
  visuallyHidden: false,
  disabledContext: false,
  rect: { x: 0, y: 0, width: 100, height: 20 },
  opacity: 1,
  color: 'rgb(0, 0, 0)',
  backgroundColor: 'rgb(255, 255, 255)',
  fontSize: 14,
  fontWeight: 400,
  borderRadius: 0,
  gutterX: 0,
  gutterY: 0,
  ...over,
});

const snapshot = (nodes: SnapshotNode[]): ScreenSnapshot => ({
  screen: 'test',
  colorMode: 'light',
  viewport: { width: 1280, height: 720 },
  nodes,
});

describe('contrastFindings', () => {
  it('flags white-on-white — the Accordion autodocs bug', () => {
    const found = contrastFindings(
      snapshot([
        node({
          color: 'rgb(255, 255, 255)',
          backgroundColor: 'rgb(255, 255, 255)',
        }),
      ])
    );
    expect(found).toHaveLength(1);
    expect(found[0].ruleId).toBe(CONTRAST_RULE);
    expect(found[0].message).toContain('1.00:1');
  });

  it('passes readable text', () => {
    expect(contrastFindings(snapshot([node({})]))).toEqual([]);
  });

  it('skips the AT-only proxies behind headless controls', () => {
    // The offscreen <input> a headless switch renders has no meaningful painted
    // background; scoring it would produce a finding on every such component.
    expect(
      contrastFindings(
        snapshot([
          node({
            visuallyHidden: true,
            color: 'rgb(255, 255, 255)',
            backgroundColor: 'rgb(255, 255, 255)',
          }),
        ])
      )
    ).toEqual([]);
  });

  it('carries the registry severity, so a finding can gate CI', () => {
    const [finding] = contrastFindings(
      snapshot([
        node({
          color: 'rgb(255, 255, 255)',
          backgroundColor: 'rgb(255, 255, 255)',
        }),
      ])
    );
    expect(finding.severity).toBe('must');
    expect(finding.checklist).toBeTruthy();
  });
});

describe('formatStoryAuditReport', () => {
  const coverage = {
    targets: 2,
    profiles: ['light', 'dark'],
    views: ['story' as const],
  };

  it('always states what was covered, even when clean', () => {
    // A bare "no findings ✓" cannot be distinguished from a run that visited
    // nothing. The coverage line is what makes a green result readable.
    const report = formatStoryAuditReport([], coverage);
    expect(report).toContain('no findings');
    expect(report).toContain('2 pages');
    expect(report).toContain('light, dark');
  });

  it('reports the render a finding came from', () => {
    const report = formatStoryAuditReport(
      [
        {
          storyId: 'ui-accordion--docs',
          title: 'UI/Accordion',
          profile: 'system-dark',
          view: 'docs',
          findings: contrastFindings(
            snapshot([
              node({
                color: 'rgb(255, 255, 255)',
                backgroundColor: 'rgb(255, 255, 255)',
              }),
            ])
          ),
        },
      ],
      coverage
    );
    expect(report).toContain('ui-accordion--docs [system-dark/docs]');
    expect(report).toContain('1 finding(s)');
  });
});

// Story-level contrast audit — the pure half.
//
// ── WHY THIS EXISTS ALONGSIDE VISUAL REGRESSION ──────────────────────────────
// `packages/ui-react`'s VR suite compares a render against a committed PNG. That
// detects **change**. It cannot detect **wrongness**, because the baseline is its
// own oracle: a screenshot that was wrong the day it was recorded passes forever.
//
// Both halves of that gap were hit for real in one sitting:
//
//   - Autodocs painted Accordion's triggers `rgb(255,255,255)` on Storybook's
//     white `.sbdocs-preview`. VR could not have caught it at all — the
//     test-runner filters `type === 'docs'` out of its index before generating
//     tests, so docs pages are structurally unreachable by that harness.
//   - `ui-toast--default.png` was recorded mid-animation, before the toast
//     painted. It showed a bare button for months and passed every run, while
//     its own dark counterpart showed the toast.
//
// A contrast assertion needs no baseline: it compares foreground against the
// background actually painted behind it and knows the answer from WCAG. It is
// therefore the check that survives a wrong baseline, and the only one that can
// reach a docs page.
//
// ── WHY IT REUSES THE SCREEN AUDIT ───────────────────────────────────────────
// `accessibility/contrast` (I5, `must`) already exists in `./detectors`, already
// carries the subtleties that make it usable — own-text only so a container's
// inherited colour is not scored against a descendant's text, icons skipped,
// disabled subtrees exempt per WCAG 1.4.3, the 3:1 large-text threshold — and
// `./probe`'s `effectiveBg` already walks to the first opaque ancestor. None of
// that is re-implemented here. This module only decides WHAT to visit and WHICH
// findings to keep; `scripts/story-audit.ts` drives the browser.
import { DETECTORS, resolveFinding } from './detectors';
import type { ScreenFinding, ScreenSnapshot } from './types';

export const CONTRAST_RULE = 'accessibility/contrast';

/**
 * A theme state to render each story in.
 *
 * These mirror the capture profiles in
 * `packages/ui-react/.storybook/visual-regression.ts`, and deliberately include
 * the two where `[data-theme]` and the OS disagree — `system-dark` is where the
 * tokens follow `prefers-color-scheme` while anything keyed on the attribute does
 * not, which is exactly how a surface and its text end up disagreeing.
 *
 * **This list is a copy, not an import.** `ui-spec` does not depend on
 * `ui-react`, and adding that edge to share four literals would invert the
 * dependency the whole package is built on (ui-spec reads ui-react, never the
 * reverse). The duplication is four rows; the coupling would be permanent.
 */
export interface ThemeProfile {
  name: string;
  /** `[data-theme]` to set, or null to remove it and let the OS decide. */
  dataTheme: 'light' | 'dark' | null;
  /** OS `prefers-color-scheme` to emulate. */
  emulate: 'light' | 'dark';
}

export const THEME_PROFILES: ThemeProfile[] = [
  { name: 'light', dataTheme: 'light', emulate: 'light' },
  { name: 'dark', dataTheme: 'dark', emulate: 'light' },
  { name: 'system-dark', dataTheme: null, emulate: 'dark' },
  { name: 'forced-light', dataTheme: 'light', emulate: 'dark' },
];

export type ViewMode = 'story' | 'docs';

export interface IndexEntry {
  id: string;
  title: string;
  type: string;
  name?: string;
}

export interface StoryTarget {
  id: string;
  title: string;
  view: ViewMode;
}

/**
 * Pick the pages to visit, one entry per (title, view).
 *
 * ── A DOCS PAGE IS A DIFFERENT ENTRY, NOT A DIFFERENT viewMode ──────────────
 * The obvious construction — take a story id and ask for `viewMode=docs` — does
 * NOT open the docs page. Storybook resolves the id first, sees a story, and
 * silently rewrites the URL back to `viewMode=story`; measured, the browser
 * lands on `…&viewMode=story` with no error. An audit built that way reports
 * "docs" coverage while having rendered the canvas twice — the exact false
 * confidence this whole check exists to remove.
 *
 * Docs pages have their own index entry (`type: 'docs'`, id `…--docs`), present
 * only for titles tagged `autodocs`. So the docs pass iterates those entries.
 *
 * For the story view, the default is the FIRST story of each title: contrast is
 * a property of a component's colour wiring, not of one arg combination, so
 * further stories of the same title re-test the same token pairs. `all: true`
 * opts into every story.
 */
export function selectTargets(
  entries: IndexEntry[],
  opts: { all?: boolean; titleFilter?: string; views?: ViewMode[] } = {}
): StoryTarget[] {
  const views = opts.views ?? ['story', 'docs'];
  const matches = (e: IndexEntry) =>
    !opts.titleFilter ||
    e.title.toLowerCase().includes(opts.titleFilter.toLowerCase());

  const out: StoryTarget[] = [];

  if (views.includes('story')) {
    const seen = new Set<string>();
    for (const e of entries) {
      if (e.type !== 'story' || !matches(e)) continue;
      if (!opts.all && seen.has(e.title)) continue;
      seen.add(e.title);
      out.push({ id: e.id, title: e.title, view: 'story' });
    }
  }

  if (views.includes('docs')) {
    for (const e of entries) {
      if (e.type !== 'docs' || !matches(e)) continue;
      out.push({ id: e.id, title: e.title, view: 'docs' });
    }
  }

  return out;
}

/** The Storybook preview URL for one entry in its view. */
export function storyUrl(
  base: string,
  storyId: string,
  view: ViewMode
): string {
  const root = base.replace(/\/+$/, '');
  return `${root}/iframe.html?id=${encodeURIComponent(storyId)}&viewMode=${view}`;
}

/**
 * Contrast findings for one captured snapshot.
 *
 * Only `accessibility/contrast` runs. The other screen-scope detectors would
 * technically execute, but they assume a whole assembled screen: `accessible-name`
 * flags every bare demo control in an isolated story, and `disabled-parity` needs
 * a full page to compare across. Running them here would bury the one finding that
 * is meaningful in noise — the failure mode that makes a check get ignored.
 */
export function contrastFindings(snapshot: ScreenSnapshot): ScreenFinding[] {
  const detector = DETECTORS.find((d) => d.ruleId === CONTRAST_RULE);
  if (!detector) {
    // The rule id is the contract between this module and the registry. If it is
    // renamed, silently auditing nothing would look exactly like a clean sweep.
    throw new Error(
      `No "${CONTRAST_RULE}" detector in the registry — story-audit would report ` +
        'a clean sweep while checking nothing.'
    );
  }
  // Same exclusion the screen audit applies: ≤2px / offscreen AT-only proxies
  // (the hidden input behind a headless switch) are not part of the visual
  // composition and have no meaningful background to score against.
  const visible = snapshot.nodes.filter((n) => !n.visuallyHidden);
  return detector.run(visible).map(resolveFinding);
}

export interface StoryAuditResult {
  storyId: string;
  title: string;
  profile: string;
  view: ViewMode;
  findings: ScreenFinding[];
}

/** Group results into a readable report; empty findings are omitted. */
export function formatStoryAuditReport(
  results: StoryAuditResult[],
  coverage: { targets: number; profiles: string[]; views: ViewMode[] }
): string {
  const withFindings = results.filter((r) => r.findings.length > 0);
  const lines = [
    `story-audit (${CONTRAST_RULE})`,
    `  ${coverage.targets} pages (${coverage.views.join(' + ')}) × ` +
      `${coverage.profiles.length} profiles (${coverage.profiles.join(', ')}) ` +
      `= ${results.length} renders`,
  ];

  if (withFindings.length === 0) {
    lines.push('  no findings ✓');
    return lines.join('\n');
  }

  for (const r of withFindings) {
    lines.push(`\n${r.storyId} [${r.profile}/${r.view}]`);
    for (const f of r.findings) {
      lines.push(`  [${f.checklist} ${f.ruleId}] ${f.ref} — ${f.message}`);
    }
  }

  const total = withFindings.reduce((n, r) => n + r.findings.length, 0);
  lines.push(
    `\n${total} finding(s) across ${withFindings.length} of ${results.length} renders.`
  );
  return lines.join('\n');
}

// Discrepancy ledger — registry + validation. Human mirror: ../LEDGER.md.
//
// Seeded with the real findings that motivated this whole system (the App Shell
// review cited in the proposal, plus the hover→active token mis-wiring the new
// kit-lint T4 detector surfaced). Each carries how the loop closed it. See
// ./types.ts and context/kit-consistency-audit-proposal.md §9.
import { allRules, getRule } from '../rules';
import { overrides } from '../overrides';
import type { LedgerEntry } from './types';

export type {
  LedgerEntry,
  LedgerStatus,
  LedgerResolution,
  LedgerSource,
  ResolutionKind,
} from './types';

const STATUSES = ['open', 'resolved', 'accepted'] as const;
const KINDS = ['detector', 'new-rule', 'override'] as const;
const SEVERITIES = ['must', 'should', 'may'] as const;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const ledger: LedgerEntry[] = [
  {
    id: 'app-shell-search-offcenter',
    title:
      'App Shell header search is left-aligned / off the header center axis',
    checklist: 'C2',
    rule: 'composition/edge-baseline-alignment',
    severity: 'should',
    source: { screen: 'protection-dashboard', ref: 'header' },
    discovered: '2026-06-28',
    status: 'resolved',
    resolution: {
      kind: 'detector',
      detector: 'screen/alignment-grid',
      note: 'Found by eyeballing the assembled screen; now caught structurally by the alignment-grid detector (near-miss edges) so it cannot silently recur.',
      date: '2026-06-28',
    },
  },
  {
    id: 'app-shell-collapsed-rail-crops-row',
    title:
      'Collapsed sidebar rail reserved a scrollbar gutter that cropped the selected row',
    checklist: 'C8',
    rule: 'composition/no-clipping',
    severity: 'should',
    source: { screen: 'protection-dashboard', ref: 'sidebar' },
    discovered: '2026-06-28',
    status: 'resolved',
    resolution: {
      kind: 'detector',
      detector: 'screen/reserved-gutter',
      note: 'Fixed by the ScrollArea overlay scrollbar (PR #479, zero reserved gutter); the reserved-gutter detector guards against regression.',
      date: '2026-06-28',
    },
  },
  {
    id: 'scroll-area-hover-active-token',
    title:
      'ScrollArea wires a hover: state to an -active border token instead of a -hover one',
    checklist: 'T4',
    rule: 'tokens/state-token-wiring',
    severity: 'should',
    source: {
      component: 'scroll-area',
      file: 'packages/ui-react/src/components/ui/scroll-area/scroll-area.tsx',
    },
    discovered: '2026-06-28',
    status: 'open',
    resolution: {
      kind: 'detector',
      detector: 'kit-lint/state-token-wiring',
      note: 'The new T4 detector surfaces it as a should-warning. Awaiting a dedicated -hover border token, a code fix, or an approved override — the loop working as intended.',
    },
  },
  {
    id: 'contrast-detector-flags-nonpainting-containers',
    title:
      'Contrast detector flagged nav container nodes (inherited black) that never paint their own text',
    checklist: 'I5',
    rule: 'accessibility/contrast',
    severity: 'must',
    source: { screen: 'protection-dashboard', ref: 'sidebar' },
    discovered: '2026-07-17',
    status: 'resolved',
    resolution: {
      kind: 'detector',
      detector: 'screen/contrast',
      note: 'The detector scored any node with non-empty textContent, so layout containers (nav/div/ul) with an inherited black color were flagged 11× on a correct screen even though their text is painted by white leaf descendants. Fixed by capturing `ownText` (direct text-node children only) in the probe and measuring contrast only on elements that paint their own text. Surfaced by the generate→lint→audit prototype.',
      date: '2026-07-17',
    },
  },
  {
    id: 'screen-audit-hidden-proxy-controls',
    title:
      'Geometry/name detectors measured the AT-only proxy <input> behind headless switch/checkbox/radio',
    checklist: 'I1',
    rule: 'accessibility/accessible-name',
    severity: 'must',
    source: { screen: 'settings-form', ref: 'form' },
    discovered: '2026-07-17',
    status: 'resolved',
    resolution: {
      kind: 'detector',
      detector: 'screen/accessible-name',
      note: 'Base UI renders a 1px/offscreen proxy <input> behind switch/checkbox/radio; the visible button/span is the real control. The probe now marks such nodes `visuallyHidden` (≤2px/offscreen) and the audit excludes them from every detector — clearing false positives across accessible-name (I1, 6×), control-height-parity (Z2), radius-parity (Z3), and tab-order (I4) on the FormLayout screen. Surfaced by the second (form-heavy) screen-audit spike.',
      date: '2026-07-17',
    },
  },
  {
    id: 'screen-audit-disabled-contrast-exemption',
    title:
      'Contrast detector flagged disabled controls, which WCAG 1.4.3 exempts',
    checklist: 'I5',
    rule: 'accessibility/contrast',
    severity: 'must',
    source: { screen: 'settings-form', ref: 'form' },
    discovered: '2026-07-17',
    status: 'resolved',
    resolution: {
      kind: 'detector',
      detector: 'screen/contrast',
      note: 'The FormLayout Disabled story reported 3 must contrast findings on disabled controls, which have no contrast requirement (WCAG 1.4.3, inactive components). The probe now records `disabledContext` (self-or-ancestor disabled) and the contrast detector skips it. Surfaced by the second screen-audit spike.',
      date: '2026-07-17',
    },
  },
  {
    id: 'form-field-width-parity',
    title:
      'Forms with stacked fields of inconsistent width had no detector (a narrow field slips through)',
    checklist: 'Z7',
    rule: 'spacing/field-width-parity',
    severity: 'should',
    source: { screen: 'settings-form', ref: 'form' },
    discovered: '2026-07-17',
    status: 'resolved',
    resolution: {
      kind: 'new-rule',
      rule: 'spacing/field-width-parity',
      note: 'New should-rule Z7 + detector `screen/field-width-parity`: fields sharing a left edge must share one width. Groups fields into left-aligned columns (so an intentionally-indented number stepper is not compared to the main column). Surfaced by the second screen-audit spike (an injected 120px field slipped past every existing detector).',
      date: '2026-07-17',
    },
  },
  {
    id: 'form-vertical-rhythm-gap',
    title:
      'Vertical-rhythm (C1) cannot run on a landmark-less form; flat-snapshot pitch is also rounding-noisy',
    checklist: 'C1',
    rule: 'composition/vertical-rhythm',
    severity: 'should',
    source: { screen: 'settings-form', ref: 'form' },
    discovered: '2026-07-17',
    status: 'open',
    resolution: {
      kind: 'detector',
      note: 'C1 only measures children of a landmark element, so a form (not a landmark) yields no findings even with off-grid pitches. A naive form-field rhythm check is unreliable from a single flat snapshot — interleaved non-field rows (radio/switch clusters) and sub-pixel rounding produce false positives. Deferred pending a section/wrapper model in the probe. Surfaced by the second screen-audit spike.',
    },
  },
  {
    id: 'page-header-double-banner-landmark',
    title:
      'PageHeader sets role="banner", creating a second banner landmark alongside the app header',
    checklist: 'I6',
    rule: 'accessibility/landmark-uniqueness',
    severity: 'must',
    source: {
      component: 'page-header',
      file: 'packages/ui-react/src/components/ui/page-header/page-header.tsx',
    },
    discovered: '2026-07-18',
    status: 'resolved',
    resolution: {
      kind: 'new-rule',
      rule: 'accessibility/landmark-uniqueness',
      note: 'Graduated into the accessibility/landmark-uniqueness rule (I6, detector screen/landmark-uniqueness): a screen exposes at most one banner/main/contentinfo landmark. Ratified to must (human), and the violation fixed — PageHeader no longer sets role="banner" (now a non-landmark block), so the app header is the sole banner. Fixtures re-captured; all demo screens audit clean under the must rule. Surfaced by the demo screen-audit fixtures.',
      date: '2026-07-18',
    },
  },
  {
    id: 'interactive-base-cursor-missing',
    title:
      'cursor-pointer missing from the BASE class of always-interactive components; only some variants carried it, and a native <button> UA cursor reset hid the gap in review',
    checklist: 'I7',
    rule: 'interaction/interactive-cursor',
    severity: 'should',
    source: {
      ref: 'ui-react interactive base classes (button-icon, chip, dialog, input-text, sidebar-secondary, …)',
    },
    discovered: '2026-07-29',
    status: 'resolved',
    resolution: {
      kind: 'new-rule',
      rule: 'interaction/interactive-cursor',
      note: 'Systemic — cursor-pointer moved to the BASE class of button/button-menu (in #116), button-icon, chip (base + remove button), sidebar-secondary rows + section trigger, and added to the dialog close + input-text clear buttons. New rule interaction/interactive-cursor (I7, detector kit-lint/interactive-cursor) statically flags a cva() base that carries a hover: state but no cursor-* utility, so component six cannot regress. Proposed should; a human ratifies whether it warrants must. Detector scope: cva() literal bases; variable-extracted and plain cn() class strings are outside the static check.',
      date: '2026-07-29',
    },
  },
  {
    id: 'chart-on-fill-text-contrast',
    title:
      'Text drawn on a series-colored (--ui-chart-*) fill cannot meet contrast with any fixed color; no on-chart text token can exist',
    severity: 'should',
    source: {
      component: 'treemap',
      ref: 'ui-react chart family — any text rendered over a series mark',
    },
    discovered: '2026-07-29',
    status: 'open',
    resolution: {
      kind: 'new-rule',
      rule: 'charts/on-fill-text-halo',
      note: 'Root cause: the --ui-chart-* palette is theme-invariant and spans 1.63:1–5.70:1 against white (chart-7 yellow 1.72:1, chart-1 4.85, chart-6 5.70; 13/15 colors fail white text at 4.5:1). A single fixed on-chart text token therefore CANNOT exist across nine luminances — this is why there is no --ui-text-on-chart-*, and adding one would be a false fix. Adopted convention for ANY text over a series fill: a white glyph fill (--ui-palette-transparent-white-fixed-100) + an opaque dark halo (--ui-palette-transparent-dark-fixed-100) painted under it via `paint-order: stroke`; the glyph carries its own contrast against the halo, not the tile, so it is legible on any tile and any caller color. Applied to treemap tile labels. Family audit (funnel/pie/bar/radial-bar/radar/scatter/composed/line/area/histogram/confidence-cone) found NO other on-fill text — funnel labels render position="right" on the surface (fill-foreground), pie labels are the donut-center on the surface, and the rest draw only axis titles/captions/tooltips/legends on the surface. NOT YET ENFORCED: a kit-lint detector (SVG text with a fill=var(--color-*) or on a series mark lacking paint-order:stroke) would ratchet it; deferred to /grammar-rule. Proposed should; a human owns whether a contrast finding warrants must.',
      date: '2026-07-29',
    },
  },
  {
    id: 'trend-and-value-surface-duplication',
    title:
      'Four surfaces now cover two roles: "how a metric changed" (TrendIndicator vs widget-text WidgetTextTrend) and "labelled value tile" (Metric vs widget WidgetValue/WidgetLabel vs stat-row StatRow/StatRowStat)',
    severity: 'should',
    source: {
      ref: 'ui-react: trend-indicator + widget-text (WidgetTextTrend); metric + widget (WidgetValue/WidgetLabel) + stat-row (StatRow/StatRowStat)',
    },
    discovered: '2026-07-29',
    status: 'open',
    // Deliberately logged, not resolved. The overlap was known before
    // TrendIndicator/Metric landed (Track 4): the widget surfaces have live
    // consumers, tests, stories and VR baselines, so folding them in would have
    // made a feature PR a breaking change with baseline churn. Recording the debt
    // is what keeps the next author from adding a fifth surface instead.
    //
    // Proposed direction: `WidgetTextTrend` becomes a thin wrapper delegating to
    // `TrendIndicator` (both already colour from
    // --ui-text-on-status-success/-danger/-neutral, so it should be VR-neutral —
    // that is the gate for taking it). The value-tile trio needs a decision
    // first: whether `Metric` is the single primitive with `StatRow` as its
    // config-driven row and `WidgetValue`/`WidgetLabel` deprecated, or whether
    // the widget family keeps its own chrome-scoped parts.
    //
    // No checklist row or rule fits yet: T5 is one *token* rendering a role
    // differently, whereas this is several *components* owning one role. A
    // `structure/one-component-per-role` rule is the candidate; it needs a role
    // taxonomy before a detector could be anything but a hand-maintained list,
    // which is why this stays `open` rather than claiming a guard it does not
    // have. Each new component's README cross-links the others in the meantime.
  },
];

const declaredDetectors = new Set(allRules.map((r) => r.detector));

/**
 * Validate ledger entries: unique id, resolvable rule/checklist, valid severity/
 * status/dates, a non-empty source, and a consistent resolution whose target
 * exists (a declared detector, a real rule, or an existing override). Returns
 * human-readable errors (empty = valid).
 */
export function validateLedger(list: LedgerEntry[] = ledger): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const checklistRows = new Set(allRules.map((r) => r.checklist));

  for (const e of list) {
    const label = e.id ? `ledger "${e.id}"` : 'ledger entry (missing id)';
    if (!e.id) errors.push('a ledger entry is missing an id');
    else if (ids.has(e.id)) errors.push(`duplicate ledger id "${e.id}"`);
    if (e.id) ids.add(e.id);
    if (!e.title?.trim()) errors.push(`${label} is missing a title`);
    if (!SEVERITIES.includes(e.severity))
      errors.push(`${label} has an invalid severity "${e.severity}"`);
    if (!STATUSES.includes(e.status))
      errors.push(`${label} has an invalid status "${e.status}"`);
    if (!DATE_RE.test(e.discovered ?? ''))
      errors.push(`${label} has an invalid discovered date "${e.discovered}"`);
    if (!e.source || Object.keys(e.source).length === 0)
      errors.push(`${label} has no source (needs at least one selector)`);
    if (e.checklist && !checklistRows.has(e.checklist))
      errors.push(`${label} references unknown checklist row "${e.checklist}"`);
    if (e.rule) {
      const rule = getRule(e.rule);
      if (!rule) errors.push(`${label} references unknown rule "${e.rule}"`);
      else if (e.checklist && rule.checklist !== e.checklist)
        errors.push(
          `${label} rule "${e.rule}" (row ${rule.checklist}) disagrees with checklist "${e.checklist}"`
        );
    }

    const r = e.resolution;
    if (e.status === 'open') {
      if (r && !KINDS.includes(r.kind))
        errors.push(`${label} has an invalid resolution kind "${r.kind}"`);
    } else {
      if (!r) {
        errors.push(`${label} is "${e.status}" but has no resolution`);
        continue;
      }
      if (!KINDS.includes(r.kind))
        errors.push(`${label} has an invalid resolution kind "${r.kind}"`);
      if (r.date && !DATE_RE.test(r.date))
        errors.push(`${label} has an invalid resolution date "${r.date}"`);
      if (e.status === 'accepted' && r.kind !== 'override')
        errors.push(
          `${label} is "accepted" but its resolution is not an override`
        );
      if (r.kind === 'detector' && !declaredDetectors.has(r.detector ?? ''))
        errors.push(
          `${label} resolution detector "${r.detector}" is not a declared rule detector`
        );
      if (r.kind === 'new-rule' && !getRule(r.rule ?? ''))
        errors.push(`${label} resolution rule "${r.rule}" does not exist`);
      if (r.kind === 'override' && !overrides.some((o) => o.id === r.override))
        errors.push(
          `${label} resolution override "${r.override}" does not exist`
        );
    }
  }
  return errors;
}

export function getLedgerEntry(id: string): LedgerEntry | undefined {
  return ledger.find((e) => e.id === id);
}

export function ledgerByStatus(status: LedgerEntry['status']): LedgerEntry[] {
  return ledger.filter((e) => e.status === status);
}

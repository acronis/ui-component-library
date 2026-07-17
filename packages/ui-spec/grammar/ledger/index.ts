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

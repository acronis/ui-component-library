import type { KitRule } from '../types';

export const accessibilityRules = [
  {
    id: 'accessibility/accessible-name',
    title: 'Every control has an accessible name',
    category: 'accessibility',
    severity: 'must',
    rule: 'Every interactive element exposes an accessible name (visible label, `aria-label`, or `aria-labelledby`).',
    rationale:
      'Without a name, the control is unusable to screen-reader users.',
    checklist: 'I1',
    detector: 'screen/accessible-name',
    wcag: ['4.1.2'],
  },
  {
    id: 'accessibility/overlay-dismiss',
    title: 'Overlays trap focus and Escape-close',
    category: 'accessibility',
    severity: 'must',
    rule: 'Modals/drawers/menus trap focus while open, return focus to the trigger on close, and close on Escape.',
    rationale:
      'Otherwise keyboard users get stuck behind or inside an overlay.',
    checklist: 'I2',
    detector: 'screen/escape-focus-trap',
    wcag: ['2.1.2', '2.4.3'],
  },
  {
    id: 'accessibility/tab-order',
    title: 'Tab order matches visual order',
    category: 'accessibility',
    severity: 'should',
    rule: 'The DOM/tab order follows the visual reading order within a screen.',
    rationale: 'Mismatched order disorients keyboard and screen-reader users.',
    checklist: 'I4',
    detector: 'screen/tab-order',
    wcag: ['2.4.3'],
  },
  {
    id: 'accessibility/contrast',
    title: 'Sufficient contrast',
    category: 'accessibility',
    severity: 'must',
    rule: 'Text and UI components meet WCAG contrast minimums against their actual surfaces.',
    rationale: 'Low contrast fails accessibility and reads as low quality.',
    checklist: 'I5',
    detector: 'screen/contrast',
    wcag: ['1.4.3', '1.4.11'],
  },
  {
    id: 'accessibility/landmark-uniqueness',
    title: 'Top-level landmarks are unique',
    category: 'accessibility',
    severity: 'must',
    rule: 'A screen exposes at most one banner, one main, and one contentinfo landmark; components that are not the page chrome must not claim these roles.',
    rationale:
      'Duplicate top-level landmarks (e.g. a page-title block also using role="banner") break assistive-tech landmark navigation and make structural audits conflate unrelated regions.',
    checklist: 'I6',
    detector: 'screen/landmark-uniqueness',
    wcag: ['1.3.1'],
    relatedRules: ['accessibility/accessible-name'],
  },
] satisfies KitRule[];

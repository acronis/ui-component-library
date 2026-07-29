import type { KitRule } from '../types';

export const interactionRules = [
  {
    id: 'interaction/timing-parity',
    title: 'Consistent interaction timing',
    category: 'interaction',
    severity: 'may',
    rule: 'Hover/transition durations and easings come from the shared motion scale; animate transform/opacity, not `all`.',
    rationale:
      'Mismatched timings make the kit feel uneven; animating `all` causes jank.',
    checklist: 'I3',
    detector: 'kit-lint/transition-timing',
  },
  {
    id: 'interaction/interactive-cursor',
    title: 'Interactive base class declares a cursor',
    category: 'interaction',
    // Proposed `should` — a human should ratify whether this warrants `must`.
    // It is a genuine, high-confidence defect class (see rationale), but the
    // static detector only covers `cva()` literal bases, so leave it a warning
    // until the human decides the tier.
    severity: 'should',
    rule: 'A component whose base class is always interactive (it carries a `hover:` state) must declare a cursor (`cursor-pointer`) on that base, not on a subset of variants.',
    rationale:
      'Native interactive elements reset the pointer cursor via the UA stylesheet, so a missing `cursor-pointer` is invisible in code review and wrong in the browser. Declaring it on the base — not per-variant — is what keeps every variant consistent: the failure that shipped three Button variants right and two wrong.',
    checklist: 'I7',
    detector: 'kit-lint/interactive-cursor',
    relatedRules: ['interaction/timing-parity'],
  },
] satisfies KitRule[];

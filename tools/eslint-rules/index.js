/**
 * Local ESLint plugin for Constructor Lab UI-Kit usage-pattern enforcement.
 *
 * The seed of an eventual `@constructor-lab/eslint-plugin-patterns`: each rule
 * encodes one approved-pattern anti-pattern (from `packages/ui-spec/patterns/`),
 * so AI and humans get steered to the sanctioned composition instead of
 * re-inventing it. Wired into the root `eslint.config.js`.
 */
import noAdhocSheet from './no-adhoc-sheet.js';
import preferConfirmDialog from './prefer-confirm-dialog.js';
import preferStatRow from './prefer-stat-row.js';

export default {
  meta: { name: 'acronis-patterns' },
  rules: {
    'no-adhoc-sheet': noAdhocSheet,
    // "prefer-*" rules steer hand-composed shapes to the opinionated composites
    // (context/opinionated-composites-proposal.md §6). Warn-first.
    'prefer-confirm-dialog': preferConfirmDialog,
    'prefer-stat-row': preferStatRow,
  },
};

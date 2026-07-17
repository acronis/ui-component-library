// Self-contained verification for the prefer-confirm-dialog rule — no framework.
// Run: node tools/eslint-rules/__tests__/prefer-confirm-dialog.test.mjs
import assert from 'node:assert';
import { Linter } from 'eslint';
import tseslint from 'typescript-eslint';

import rule from '../prefer-confirm-dialog.js';

const linter = new Linter();
const config = {
  files: ['**/*.tsx'],
  plugins: { local: { rules: { 'prefer-confirm-dialog': rule } } },
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
  rules: { 'local/prefer-confirm-dialog': 'warn' },
};
const lint = (code) => linter.verify(code, config, { filename: 'x.tsx' });

// INVALID — an AlertDialog with both Cancel and Action (the confirm shape).
const bad = [
  `const A = () => (
    <AlertDialog>
      <AlertDialogContent>
        <AlertDialogTitle>Delete?</AlertDialogTitle>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );`,
  // Action inside a conditional expression still counts.
  `const B = () => (
    <AlertDialog>
      <AlertDialogCancel>No</AlertDialogCancel>
      {ok && <AlertDialogAction>Yes</AlertDialogAction>}
    </AlertDialog>
  );`,
];
for (const code of bad) {
  const msgs = lint(code);
  assert.equal(
    msgs.length,
    1,
    `expected 1 report for:\n${code}\n${JSON.stringify(msgs)}`
  );
  assert.equal(msgs[0].messageId, 'preferConfirmDialog');
}

// VALID — not the confirm shape, or already the composite.
const good = [
  // Only a Cancel (no Action) — a bespoke AlertDialog, left alone.
  `const C = () => (<AlertDialog><AlertDialogCancel>Close</AlertDialogCancel></AlertDialog>);`,
  // Only an Action.
  `const D = () => (<AlertDialog><AlertDialogAction>OK</AlertDialogAction></AlertDialog>);`,
  // Already using the composite.
  `const E = () => (<ConfirmDialog title="Delete?" onConfirm={x} />);`,
  // Cancel + Action but NOT inside an AlertDialog (e.g. a plain Dialog footer).
  `const F = () => (<Dialog><AlertDialogCancel/><AlertDialogAction/></Dialog>);`,
];
for (const code of good) {
  const msgs = lint(code);
  assert.equal(
    msgs.length,
    0,
    `expected 0 reports for:\n${code}\n${JSON.stringify(msgs)}`
  );
}

console.log(
  'prefer-confirm-dialog: all assertions passed (2 invalid, 4 valid)'
);

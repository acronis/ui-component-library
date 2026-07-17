// Self-contained verification for the prefer-stat-row rule — no framework.
// Run: node tools/eslint-rules/__tests__/prefer-stat-row.test.mjs
import assert from 'node:assert';
import { Linter } from 'eslint';
import tseslint from 'typescript-eslint';

import rule from '../prefer-stat-row.js';

const linter = new Linter();
const config = {
  files: ['**/*.tsx'],
  plugins: { local: { rules: { 'prefer-stat-row': rule } } },
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
  rules: { 'local/prefer-stat-row': 'warn' },
};
const lint = (code) => linter.verify(code, config, { filename: 'x.tsx' });

// INVALID — 2+ sibling CardFilter tiles under one parent (a hand-placed row).
const bad = [
  `const A = () => (
    <div className="flex gap-4">
      <CardFilter label="Protected" value="982" />
      <CardFilter label="At risk" value="17" />
    </div>
  );`,
  `const B = () => (
    <div>
      <CardFilter label="a" value="1" />
      <CardFilter label="b" value="2" />
      <CardFilter label="c" value="3" />
    </div>
  );`,
];
for (const code of bad) {
  const msgs = lint(code);
  assert.equal(
    msgs.length,
    1,
    `expected 1 report for:\n${code}\n${JSON.stringify(msgs)}`
  );
  assert.equal(msgs[0].messageId, 'preferStatRow');
}

// VALID — a lone CardFilter, or already the composite.
const good = [
  `const C = () => (<div><CardFilter label="Protected" value="982" /></div>);`,
  `const D = () => (<StatRow stats={stats} />);`,
  // Two CardFilters but not siblings (different parents) — not a row.
  `const E = () => (<div><div><CardFilter label="a" value="1"/></div><div><CardFilter label="b" value="2"/></div></div>);`,
];
for (const code of good) {
  const msgs = lint(code);
  // E: the outer div has 0 direct CardFilter children (they're nested), each
  // inner div has 1 — so no report anywhere.
  assert.equal(
    msgs.length,
    0,
    `expected 0 reports for:\n${code}\n${JSON.stringify(msgs)}`
  );
}

console.log('prefer-stat-row: all assertions passed (2 invalid, 3 valid)');

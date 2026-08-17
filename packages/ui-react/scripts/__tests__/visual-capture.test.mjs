// Guards the two decisions in scripts/visual-capture.mjs that #111 turned on.
//
// `.mjs` rather than `.ts` on purpose: the subject is a plain Node script
// outside `tsconfig.json`'s `include`, and vitest's default `include` already
// matches `*.test.mjs`. A `.ts` test here would sit outside the type program and
// trip `src/__tests__/typecheck-gate.test.ts`.
//
// The fixtures are REAL captured output — ANSI escapes, Compose's `service-1 |`
// prefix and all — copied from the runs that produced #111. A hand-written
// approximation would have let the prefix/ANSI stripping regress silently, which
// is precisely the layer that decides whether a summary line is found at all.
import { describe, expect, it } from 'vitest';

import {
  clean,
  KNOWN_MODES,
  MODE_GROUPS,
  parseSummary,
  resolveModes,
  SUBSET_MODES,
  summarise,
} from '../visual-capture.mjs';
// The TS module this script mirrors. Imported from the `.mjs` test rather than
// the reverse: vitest transforms the TS for us, while a `.ts` test importing an
// untyped `.mjs` would have to enter the type program (see the header note).
import { VISUAL_PROFILES } from '../../.storybook/visual-regression';

const E = '\u001b';

/** Tail of a real light-mode run: 6 unrelated timeouts, ZERO snapshot failures. */
const LIGHT_RUN_WITH_TIMEOUTS = [
  `test-runner-1  | ${E}[1mTest Suites: ${E}[22m${E}[1m${E}[31m2 failed${E}[39m${E}[22m, ${E}[1m${E}[32m161 passed${E}[39m${E}[22m, 163 total`,
  `test-runner-1  | ${E}[1mTests:       ${E}[22m${E}[1m${E}[31m6 failed${E}[39m${E}[22m, ${E}[1m${E}[32m623 passed${E}[39m${E}[22m, 629 total`,
  `test-runner-1  | ${E}[1mSnapshots:   ${E}[22m${E}[1m${E}[32m1 written${E}[39m${E}[22m, ${E}[1m${E}[32m622 passed${E}[39m${E}[22m, 623 total`,
  `test-runner-1  | ${E}[1mTime:${E}[22m        520.71 s`,
  `${E}[Ktest-runner-1 exited with code 1`,
].join('\n');

/**
 * A real Compose container-name collision. The loser ran ZERO tests, and the
 * only thing resembling a verdict is an exit code — which is exactly why the
 * runner must not read a verdict from one.
 */
const CONTAINER_NAME_COLLISION = [
  ' Image ui-react-storybook  Built ',
  ' Container ui-react-storybook-1  Recreate ',
  ' Container ui-react-storybook-1  Error response from daemon: Conflict. The container name "/e735a2b7a17b_ui-react-storybook-1" is already in use by container "f246b96c9bb0004c93fc49f91288db102d2b3c3d39d18c32de456fe99ea9b379". You have to remove (or rename) that container to be able to reuse that name. ',
  'ELIFECYCLE  Command failed with exit code 1.',
].join('\n');

const CLEAN_RUN = [
  `test-runner-1  | ${E}[1mTest Suites: ${E}[22m${E}[1m${E}[32m163 passed${E}[39m${E}[22m, 163 total`,
  `test-runner-1  | ${E}[1mTests:       ${E}[22m${E}[1m${E}[32m629 passed${E}[39m${E}[22m, 629 total`,
  `test-runner-1  | ${E}[1mSnapshots:   ${E}[22m${E}[1m${E}[32m629 passed${E}[39m${E}[22m, 629 total`,
].join('\n');

describe('clean', () => {
  it('strips ANSI colour and the Compose service prefix', () => {
    expect(clean(`test-runner-1  | ${E}[1mTests:${E}[22m 1 passed`)).toBe(
      'Tests: 1 passed'
    );
  });

  it('leaves an unprefixed line alone', () => {
    expect(clean('Tests:       1 passed, 1 total')).toBe(
      'Tests:       1 passed, 1 total'
    );
  });
});

describe('parseSummary', () => {
  it('reads jest tallies through ANSI and the Compose prefix', () => {
    const s = parseSummary(LIGHT_RUN_WITH_TIMEOUTS);

    expect(s.ran).toBe(true);
    expect(s.tests).toEqual({ failed: 6, passed: 623, written: 0, total: 629 });
    expect(s.suites).toEqual({
      failed: 2,
      passed: 161,
      written: 0,
      total: 163,
    });
    // The distinction that made #111 hard to see: tests failed while the
    // snapshot phase was completely clean.
    expect(s.snapshots.failed).toBe(0);
    expect(s.snapshots.written).toBe(1);
    expect(s.snapshots.passed).toBe(622);
  });

  it('does not mistake "Test Suites:" for the "Tests:" line', () => {
    const suitesOnly = `test-runner-1  | Test Suites: 3 passed, 3 total`;
    expect(parseSummary(suitesOnly).ran).toBe(false);
  });

  it('reports ran=false when a run produced no jest summary at all', () => {
    // THE load-bearing case. A container collision exits non-zero having run
    // nothing; if that ever parses as "ran", a zero-test capture reads as a
    // result and one colour mode goes missing unnoticed.
    expect(parseSummary(CONTAINER_NAME_COLLISION).ran).toBe(false);
  });
});

describe('summarise', () => {
  const ok = (mode) => ({ mode, code: 0, ...parseSummary(CLEAN_RUN) });
  const ranAndFailed = (mode) => ({
    mode,
    code: 1,
    ...parseSummary(LIGHT_RUN_WITH_TIMEOUTS),
  });
  const neverRan = (mode) => ({
    mode,
    code: 1,
    ...parseSummary(CONTAINER_NAME_COLLISION),
  });

  it('passes only when every requested mode ran and passed', () => {
    const v = summarise([ok('light'), ok('dark')]);
    expect(v).toMatchObject({ requested: 2, ranCount: 2, ok: true });
    expect(v.notRun).toHaveLength(0);
    expect(v.failed).toHaveLength(0);
  });

  it('fails when a mode never ran, even though the other mode passed', () => {
    // The #111 shape exactly: light fine, dark absent. This must not be green.
    const v = summarise([ok('light'), neverRan('dark')]);

    expect(v.ok).toBe(false);
    expect(v.ranCount).toBe(1);
    expect(v.requested).toBe(2);
    expect(v.notRun.map((r) => r.mode)).toEqual(['dark']);
    // Kept out of `failed`: "never ran" and "ran and regressed" demand
    // different responses, so the report distinguishes them.
    expect(v.failed).toHaveLength(0);
  });

  it('fails when a mode ran and reported failures', () => {
    const v = summarise([ranAndFailed('light'), ok('dark')]);

    expect(v.ok).toBe(false);
    expect(v.ranCount).toBe(2);
    expect(v.failed.map((r) => r.mode)).toEqual(['light']);
    expect(v.notRun).toHaveLength(0);
  });

  it('counts a single-mode run against a denominator of one', () => {
    expect(summarise([ok('light')])).toMatchObject({
      requested: 1,
      ranCount: 1,
      ok: true,
    });
  });
});

/**
 * The mode vocabulary this script accepts, and the fact that it still describes
 * the profiles the runner implements.
 *
 * Two lists in two languages (`.mjs` here, `.ts` in `.storybook/`) cannot import
 * each other in production — the script runs under bare Node, outside any TS
 * loader — so the mirror is checked here instead of trusted to a comment. The two
 * halves fail asymmetrically, which is why this matters: an unknown profile name
 * is refused loudly, but a subset profile that this script does not KNOW is a
 * subset profile is treated as a baseline owner, and then `--update` is no longer
 * refused for it.
 */
describe('mode vocabulary mirrors VISUAL_PROFILES', () => {
  it('knows exactly the profiles the runner declares', () => {
    expect([...KNOWN_MODES].sort()).toEqual(
      Object.keys(VISUAL_PROFILES).sort()
    );
  });

  it('marks exactly the non-baseline profiles as subset modes', () => {
    const declared = Object.values(VISUAL_PROFILES)
      .filter((p) => p.subset)
      .map((p) => p.name);
    expect([...SUBSET_MODES].sort()).toEqual(declared.sort());
  });
});

describe('resolveModes', () => {
  it('defaults to the baseline-owning pair when --mode is absent', () => {
    expect(resolveModes(undefined)).toEqual(['light', 'dark']);
  });

  it('expands each group', () => {
    expect(resolveModes('both')).toEqual(['light', 'dark']);
    expect(resolveModes('themes')).toEqual(SUBSET_MODES);
    expect(resolveModes('all')).toEqual(KNOWN_MODES);
  });

  it('covers every profile across both and themes, with no overlap', () => {
    // `all` is the union by construction; this asserts the partition, so a
    // profile cannot go missing from BOTH groups (unreachable except by naming it
    // directly) or sit in both (paid for twice per `all` run).
    const partition = [...MODE_GROUPS.both, ...MODE_GROUPS.themes];
    expect([...partition].sort()).toEqual([...KNOWN_MODES].sort());
    expect(new Set(partition).size).toBe(partition.length);
  });

  it('accepts any single profile by name', () => {
    for (const mode of KNOWN_MODES) {
      expect(resolveModes(mode)).toEqual([mode]);
    }
  });

  it('throws on an unknown mode, naming every profile and group', () => {
    // Not a fallback to light: `--mode` typos reach a runner where four profiles
    // file against baselines they do not own.
    expect(() => resolveModes('forced')).toThrow(/Unknown --mode 'forced'/);
    const message = (() => {
      try {
        resolveModes('sytem-dark');
        return '';
      } catch (error) {
        return error.message;
      }
    })();
    for (const name of [...KNOWN_MODES, ...Object.keys(MODE_GROUPS)]) {
      expect(message).toContain(name);
    }
  });
});

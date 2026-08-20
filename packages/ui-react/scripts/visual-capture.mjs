#!/usr/bin/env node
// packages/ui-react/scripts/visual-capture.mjs
//
// Runs the Dockerized Storybook visual-regression suite for one or both colour
// modes. Replaces the `pnpm … && pnpm … :dark` script chains (#111).
//
// ── WHY THIS EXISTS: TWO INDEPENDENT WAYS A CAPTURE WROTE ONE MODE ────────────
// Both were measured on `feat/table-parity`, and each on its own is enough to
// leave the repo with light baselines rewritten and dark ones missing — a state
// that looks exactly like an operator walking away mid-run, and was misread that
// way five times.
//
//   1. THE `&&` CHAIN. `…:update:all` was `…:update && …:update:dark`. Any
//      non-zero light exit skipped dark entirely. The trigger did not have to be
//      a real regression: six `UI/Radio` / `UI/Toast` tests hit a 15 s per-test
//      timeout under amd64 emulation while the run reported `Snapshots: 1
//      written, 622 passed` — **zero snapshot failures**. An unrelated flake in
//      an unrelated component silently cancelled the dark half of the corpus.
//
//   2. FIXED COMPOSE CONTAINER NAMES. Two captures at once collide, and the
//      loser dies on `Conflict. The container name "…_ui-react-storybook-1" is
//      already in use` having run **zero tests** — after paying for a Storybook
//      build and an image build. It exits non-zero, but nothing in the output
//      resembles "another capture is running", so it reads as an infrastructure
//      hiccup rather than the operator error it is.
//
// ── WHY SERIALIZE RATHER THAN ISOLATE ────────────────────────────────────────
// The obvious fix for (2) is a unique Compose project name per run so both
// proceed. **That is worse than the collision**, for three reasons that all
// outlive the container names:
//
//   * Both runs bind-mount the same `test/__snapshots__`. Two writers, one
//     directory: the second run's baselines land on top of the first's, and
//     whichever finishes last wins per file. Nothing detects the interleave.
//   * Both consume the same host-built `storybook-static`, which each run
//     rebuilds before starting. One run rebuilds the artifact the other is
//     mid-way through serving.
//   * Storybook broadcasts `setCurrentStory` to **every** connected preview, so
//     a second runner retargets the first one's page and a screenshot gets filed
//     under a story it does not belong to. `.storybook/test-runner.ts`'s
//     `assertRenderingStory` exists because that already happened once and
//     produced a baseline containing the wrong story's render.
//
// A mislabelled baseline **inverts** the review — it flags an innocent story and
// stays silent about the real change. So concurrency here is not a throughput
// opportunity; it is a correctness hazard the repo has already been bitten by.
// This runner takes an exclusive lock and refuses loudly, in under a second,
// before building anything.
//
// ── WHY THE VERDICT IS PARSED, NOT INHERITED FROM AN EXIT CODE ────────────────
// Exit codes lied in both directions while diagnosing #111: `docker compose …
// exited 0` was printed by a run whose real status was 1, and a wrapper reported
// 0 because a trailing `echo` reset `$?`. Meanwhile the evidence that would have
// settled it — the per-mode `Snapshots:` line — was destroyed by piping the run
// through `tail -60`.
//
// So this runner does not trust, or ask anyone else to trust, an exit code:
//   * every mode's full output is written to a file, never only to a pipe;
//   * the verdict comes from jest's own summary lines in the captured stream;
//   * a mode that produced **no** `Tests:` line at all is reported as DID NOT
//     RUN and fails the overall result. "No news" is the zero-test pass that
//     hid (2) — it must never read as success.

import { spawn } from 'node:child_process';
import {
  createWriteStream,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  buildTestPathPatterns,
  resolveTitleIds,
  SUBSET_TITLES,
  subsetStoryIds,
} from './system-theme-subset.mjs';

const PACKAGE_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const LOG_DIR = join(PACKAGE_DIR, '.visual-capture');
// A directory, because `mkdir` is atomic on every platform we run on: it either
// creates and returns, or fails with EEXIST. A "check then write" lock has a
// window between the two calls, which is exactly the race being closed.
const LOCK_DIR = join(LOG_DIR, 'lock');
const LOCK_PID = join(LOCK_DIR, 'pid');

const BASE_COMPOSE = './docker-compose.storybook.yml';
const UPDATE_COMPOSE = './docker-compose.storybook.update.yml';

/**
 * Capture profiles, mirroring `VISUAL_PROFILES` in `.storybook/visual-regression.ts`.
 *
 * Exported, and cross-checked against that module in
 * `__tests__/visual-capture.test.mjs`. The mirror used to be a comment asking to
 * be kept in sync, and the two halves fail differently when it is not: a profile
 * missing from `KNOWN_MODES` is refused loudly (harmless), but a *subset* profile
 * missing from `SUBSET_MODES` is treated as a baseline owner — `--update` is no
 * longer refused and the story-count assertion no longer applies, so the run can
 * overwrite the corpus it was supposed to be checked against.
 */
export const KNOWN_MODES = [
  'light',
  'dark',
  'system-dark',
  'system-light',
  'forced-light',
  'forced-dark',
];
/** Profiles that own no baselines and run only the curated subset. */
export const SUBSET_MODES = [
  'system-dark',
  'system-light',
  'forced-light',
  'forced-dark',
];

/**
 * Aliases that expand to several profiles, so a leg does not have to be spelled
 * out (and cannot be spelled out incompletely).
 *
 * `both` predates the other two and keeps its meaning — light + dark, the pair
 * that owns the baselines — because it is what every `…:all` package script and
 * every operator habit already means by it. `themes` is the complement: the four
 * profiles that own nothing and only re-render. `all` is the full cross product.
 */
export const MODE_GROUPS = {
  both: ['light', 'dark'],
  themes: SUBSET_MODES,
  all: KNOWN_MODES,
};

/**
 * `--mode <arg>` → the profiles to run, in order.
 *
 * Pure and exported so the expansion is asserted directly: a group that silently
 * dropped a profile would leave a CI leg reporting green over less than it names,
 * which is the same class of failure as the subset miscount `summarise` guards.
 * Throws with the full vocabulary rather than falling back to a default — see
 * `resolveVisualProfile` for why a lenient default stopped being safe once
 * profiles started filing against other profiles' baselines.
 */
export function resolveModes(modeArg) {
  if (modeArg === undefined) return MODE_GROUPS.both;
  if (Object.hasOwn(MODE_GROUPS, modeArg)) return MODE_GROUPS[modeArg];
  if (KNOWN_MODES.includes(modeArg)) return [modeArg];
  throw new Error(
    `Unknown --mode '${modeArg}'. Use a profile ` +
      `(${KNOWN_MODES.join(', ')}) or a group ` +
      `(${Object.entries(MODE_GROUPS)
        .map(([group, modes]) => `${group} = ${modes.join(' + ')}`)
        .join('; ')}).`
  );
}

/**
 * Strips ANSI escapes and Compose's `service-1  | ` line prefix.
 *
 * The escape byte is part of the pattern, and is written as an escape sequence
 * rather than pasted in raw — a literal 0x1B in source is invisible to every
 * reader and to review. Matching only the bracket-and-letter would leave the
 * escape byte at the head of the line, and every `startsWith('Tests:')` below
 * would then miss: a summary that IS in the output would read as absent, which
 * is the one failure this file exists to prevent. Confirmed against real
 * captured bytes — `1b 5b 31 6d` immediately precedes `Test Suites`.
 *
 * Matches any CSI sequence rather than only colour (`m`), because Compose also
 * emits an erase-line sequence around its container status lines — including the
 * `... exited with code N` line the old scripts were being read from.
 */
export function clean(line) {
  return (
    line
      // eslint-disable-next-line no-control-regex -- deliberate; see the note above
      .replace(/\u001b\[[0-9;]*[A-Za-z]/g, '')
      .replace(/^[a-z0-9_-]+-\d+\s+\|\s?/i, '')
  );
}

/**
 * Pulls jest's own tallies out of a captured run.
 *
 * `ran` is the load-bearing field. jest always prints a `Tests:` line once it
 * has executed a suite, so its absence means the run never got that far —
 * a Compose name collision, an image build failure, an unreachable Storybook.
 * That case previously presented as a bare non-zero exit and got attributed to
 * whatever the reader expected.
 */
export function parseSummary(text) {
  const lines = text.split('\n').map(clean);
  const find = (label) => lines.find((l) => l.startsWith(label));

  const tally = (line) => {
    if (!line) return undefined;
    const grab = (word) => {
      const m = line.match(new RegExp(`(\\d+)\\s+${word}`));
      return m ? Number(m[1]) : 0;
    };
    return {
      failed: grab('failed'),
      passed: grab('passed'),
      written: grab('written'),
      total: grab('total'),
    };
  };

  const tests = tally(find('Tests:'));
  return {
    ran: tests !== undefined,
    suites: tally(find('Test Suites:')),
    tests,
    snapshots: tally(find('Snapshots:')),
  };
}

/**
 * The overall verdict across every requested mode.
 *
 * Separate from the printing so it can be asserted directly. THREE ways to fail,
 * deliberately distinct — collapsing them loses the only signal that
 * distinguishes "dark has a real regression" from "dark never happened":
 *
 *   1. a mode that ran and reported failures,
 *   2. a mode that never ran at all, and
 *   3. **a subset mode that ran the wrong number of stories.**
 *
 * (3) exists because the subset profiles are selected by a jest test-path regex.
 * A regex that matches fewer files than intended does not error — jest runs what
 * it found, every one of them passes, and the run is GREEN while covering less
 * than it claims. `scripts/system-theme-subset.mjs` already refuses to build a
 * pattern from a stale title, but that guards the input; this guards the outcome,
 * which is the only thing that proves the pattern reached jest intact through
 * `VISUAL_TEST_ARGS`'s unquoted shell expansion.
 */
export function summarise(results) {
  const notRun = results.filter((r) => !r.ran);
  const failed = results.filter((r) => r.ran && r.code !== 0);
  const miscounted = results.filter(
    (r) => r.ran && r.expected !== undefined && r.tests?.total !== r.expected
  );
  return {
    requested: results.length,
    ranCount: results.filter((r) => r.ran).length,
    notRun,
    failed,
    miscounted,
    ok: notRun.length === 0 && failed.length === 0 && miscounted.length === 0,
  };
}

/** Runs a command, streaming to stdout AND capturing to a file + string. */
function run(command, args, { logFile, env }) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: PACKAGE_DIR,
      env: { ...process.env, ...env },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let captured = '';
    const sink = logFile ? createWriteStream(logFile) : undefined;
    for (const stream of [child.stdout, child.stderr]) {
      stream.on('data', (chunk) => {
        captured += chunk;
        process.stdout.write(chunk);
        sink?.write(chunk);
      });
    }

    child.on('error', reject);
    child.on('close', (code) => {
      sink?.end();
      resolve({ code: code ?? 1, captured });
    });
  });
}

/**
 * Takes the exclusive capture lock, or refuses.
 *
 * A lock whose holder has died must not wedge the repo, so a PID that is gone is
 * reclaimed rather than respected. `process.kill(pid, 0)` sends no signal — it
 * only asks whether the process exists.
 */
function acquireLock() {
  mkdirSync(LOG_DIR, { recursive: true });
  try {
    mkdirSync(LOCK_DIR);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;

    const holder = Number(readFileSync(LOCK_PID, 'utf8').trim());
    const alive = (() => {
      try {
        process.kill(holder, 0);
        return true;
      } catch {
        return false;
      }
    })();

    if (alive) {
      console.error(
        `\nREFUSING TO START: another visual capture is already running ` +
          `(pid ${holder}).\n\n` +
          `Two captures cannot share this checkout. They bind-mount the same\n` +
          `test/__snapshots__, rebuild the same storybook-static, and Storybook\n` +
          `broadcasts setCurrentStory to every connected preview — so a second\n` +
          `runner can retarget the first one's page and file a screenshot under\n` +
          `the wrong story id.\n\n` +
          `Wait for pid ${holder} to finish, or if you are certain it is dead:\n` +
          `  rm -rf ${LOCK_DIR}\n`
      );
      process.exit(2);
    }

    console.warn(
      `Reclaiming a stale capture lock: pid ${holder} is no longer running.`
    );
    rmSync(LOCK_DIR, { recursive: true, force: true });
    mkdirSync(LOCK_DIR);
  }

  writeFileSync(LOCK_PID, String(process.pid));

  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    rmSync(LOCK_DIR, { recursive: true, force: true });
  };
  process.on('exit', release);
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
    process.on(signal, () => {
      release();
      process.exit(130);
    });
  }
  return release;
}

async function main() {
  const argv = process.argv.slice(2);
  const update = argv.includes('--update');
  let modes;
  try {
    modes = resolveModes(
      argv.includes('--mode') ? argv[argv.indexOf('--mode') + 1] : undefined
    );
  } catch (error) {
    console.error(error.message);
    process.exit(2);
  }

  // **`--update` is refused for the system profiles, before anything is built.**
  // They deliberately file against the OTHER profile's committed baselines — that
  // reuse is the whole assertion (see `.storybook/visual-regression.ts`). So
  // `--update` here does not "regenerate their baselines": there are none. It
  // overwrites the light or dark corpus with renders captured under a different
  // theme input, which is exactly the diff these profiles exist to detect, now
  // silently baked in and unrecoverable except from git.
  const illegalUpdate = modes.filter((m) => SUBSET_MODES.includes(m));
  if (update && illegalUpdate.length) {
    console.error(
      `\nREFUSING TO UPDATE: --mode ${illegalUpdate.join(', ')} owns no ` +
        `baselines.\n\n` +
        `These profiles re-render stories under a different theme input and\n` +
        `assert the pixels match the light/dark baselines already committed.\n` +
        `Running them with --update would overwrite those baselines with the\n` +
        `very difference they exist to catch.\n\n` +
        `To re-record baselines, use --mode light / --mode dark.\n`
    );
    process.exit(2);
  }

  // Everything after `--` is forwarded to `test-storybook` inside the container
  // (e.g. a jest test-path pattern to run a single story's generated test file).
  const passthroughAt = argv.indexOf('--');
  const passthrough = passthroughAt === -1 ? [] : argv.slice(passthroughAt + 1);

  acquireLock();
  mkdirSync(LOG_DIR, { recursive: true });

  // ONE build for every mode. `STORYBOOK_COLOR_MODE` is read only by
  // `.storybook/test-runner.ts` at run time — never during the build — so the
  // static output is mode-independent and the old chain was building it twice.
  //
  // `--skip-build` is for CI, which already builds `storybook-static` in its own
  // cached step. It exists so those jobs can run THROUGH this script instead of
  // invoking `docker compose` directly: everything below — the subset resolver,
  // the summary parsing, the story-count assertion — is what makes a subset run
  // trustworthy, and a job that bypasses the script gets none of it.
  if (argv.includes('--skip-build')) {
    console.log('\n=== Skipping Storybook build (--skip-build) ===');
  } else {
    console.log('\n=== Building Storybook (once, shared by every mode) ===');
    const build = await run('pnpm', ['storybook:build'], {
      logFile: join(LOG_DIR, 'storybook-build.log'),
    });
    if (build.code !== 0) {
      console.error(`\nStorybook build failed (exit ${build.code}).`);
      process.exit(build.code);
    }
  }

  // Resolved from the index Storybook just emitted, so a title renamed out from
  // under the subset fails HERE — loudly, before Docker — rather than shrinking
  // the run. `resolveTitleIds` throws on any title it cannot find; a filter that
  // silently matches fewer files is indistinguishable from a suite that passed.
  let subset;
  if (modes.some((m) => SUBSET_MODES.includes(m))) {
    const entries = Object.values(
      JSON.parse(
        readFileSync(join(PACKAGE_DIR, 'storybook-static/index.json'), 'utf8')
      ).entries
    );
    subset = {
      // One pattern per title — jest ORs its positional path patterns, and a
      // single `(a|b)` alternation does not survive the shells in between.
      // See buildTestPathPatterns.
      patterns: buildTestPathPatterns(resolveTitleIds(entries, SUBSET_TITLES)),
      expected: subsetStoryIds(entries).length,
    };
    console.log(
      `\nsystem-theme subset: ${SUBSET_TITLES.length} titles, ` +
        `${subset.expected} stories.`
    );
  }

  const composeFiles = update
    ? ['-f', BASE_COMPOSE, '-f', UPDATE_COMPOSE]
    : ['-f', BASE_COMPOSE];

  // Clears containers left behind by an earlier crashed run — the direct cause
  // of the name collision in (2). Safe **only** because the lock is already
  // held: nothing else can be mid-capture, so this can never tear down a live
  // peer's containers.
  console.log('\n=== Clearing any leftover containers ===');
  await run(
    'docker',
    ['compose', ...composeFiles, 'down', '--remove-orphans'],
    {
      logFile: join(LOG_DIR, 'compose-down.log'),
    }
  );

  const results = [];
  for (const mode of modes) {
    const isSubset = SUBSET_MODES.includes(mode);
    console.log(
      `\n=== Capture: ${mode}${update ? ' (--updateSnapshot)' : ''}` +
        `${isSubset ? ` (subset: ${subset.expected} stories)` : ''} ===`
    );
    const logFile = join(LOG_DIR, `capture-${mode}.log`);
    // jest ORs its positional test-path patterns, so appending the subset
    // pattern to an operator's own would WIDEN the run, not narrow it. When a
    // pattern was passed explicitly it therefore replaces the subset — and says
    // so, because a subset run that quietly covered something else is the same
    // silent-miscount failure the resolver above exists to prevent.
    const operatorPattern = passthrough.some((a) => !a.startsWith('-'));
    if (isSubset && operatorPattern) {
      console.log(
        `  note: using the pattern you passed after \`--\` INSTEAD of the ` +
          `system-theme subset.`
      );
    }
    const testArgs =
      isSubset && !operatorPattern
        ? [...passthrough, ...subset.patterns]
        : passthrough;
    const { code, captured } = await run(
      'docker',
      [
        'compose',
        ...composeFiles,
        'up',
        '--build',
        '--abort-on-container-exit',
        '--exit-code-from',
        'test-runner',
      ],
      {
        logFile,
        env: {
          STORYBOOK_COLOR_MODE: mode,
          VISUAL_TEST_ARGS: testArgs.join(' '),
        },
      }
    );

    // **Every requested mode runs.** A failure here is recorded and the loop
    // continues — that single decision is the fix for (1). Aggregated into a
    // non-zero exit below, so nothing is swallowed.
    results.push({
      mode,
      code,
      logFile,
      // Only for an unmodified subset run: with an operator pattern the count is
      // whatever they asked for, and asserting the subset total would be a false
      // failure. `undefined` means "no count expectation", checked in `summarise`.
      expected:
        isSubset && !operatorPattern && !update ? subset.expected : undefined,
      ...parseSummary(captured),
    });
  }

  // One source for the printed verdict and the exit code: a report that can
  // disagree with the status it returns is how this became hard to diagnose.
  const verdict = summarise(results);

  console.log(`\n${'='.repeat(72)}`);
  console.log('PER-MODE VERDICT (from jest summary lines, not exit codes)');
  console.log('='.repeat(72));
  console.log(`modes requested: ${verdict.requested}`);
  console.log(`modes that ran:  ${verdict.ranCount}`);
  console.log('');

  for (const r of results) {
    if (!r.ran) {
      console.log(
        `  ${r.mode.padEnd(12)}  DID NOT RUN — no jest summary in the output ` +
          `(exit ${r.code}). See ${r.logFile}`
      );
      continue;
    }
    const s = r.snapshots ?? { written: 0, passed: 0, failed: 0, total: 0 };
    console.log(
      `  ${r.mode.padEnd(12)}  tests ${r.tests.failed} failed / ` +
        `${r.tests.passed} passed / ${r.tests.total} total   ` +
        `snapshots ${s.written} written / ${s.passed} passed / ` +
        `${s.failed} failed / ${s.total} total   exit ${r.code}`
    );
  }

  console.log('');
  if (verdict.notRun.length) {
    console.log(
      `FAIL: ${verdict.notRun.length}/${verdict.requested} mode(s) never ` +
        `executed a test — ${verdict.notRun.map((r) => r.mode).join(', ')}.`
    );
  }
  if (verdict.failed.length) {
    console.log(
      `FAIL: ${verdict.failed.length}/${verdict.requested} mode(s) reported ` +
        `failures — ${verdict.failed.map((r) => r.mode).join(', ')}.`
    );
  }
  for (const r of verdict.miscounted) {
    console.log(
      `FAIL: ${r.mode} ran ${r.tests.total} tests but the subset defines ` +
        `${r.expected}. The test-path filter did not select what it claims, so ` +
        `a green result here would cover less than it reports. Check the ` +
        `pattern in ${r.logFile}.`
    );
  }
  if (verdict.ok) {
    console.log(
      `OK: all ${verdict.ranCount}/${verdict.requested} mode(s) ran and passed.`
    );
  }
  console.log(`Full logs: ${LOG_DIR}`);

  process.exit(verdict.ok ? 0 : 1);
}

// Only drive a real capture when invoked as a program. Without this guard the
// unit test that imports `parseSummary` would start Docker.
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

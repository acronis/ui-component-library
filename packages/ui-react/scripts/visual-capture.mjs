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
 * Separate from the printing so it can be asserted directly. Two ways to fail,
 * deliberately distinct: a mode that ran and reported failures, and a mode that
 * never ran at all. Collapsing them loses the only signal that distinguishes
 * "dark has a real regression" from "dark never happened".
 */
export function summarise(results) {
  const notRun = results.filter((r) => !r.ran);
  const failed = results.filter((r) => r.ran && r.code !== 0);
  return {
    requested: results.length,
    ranCount: results.filter((r) => r.ran).length,
    notRun,
    failed,
    ok: notRun.length === 0 && failed.length === 0,
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
  const modeArg = argv[argv.indexOf('--mode') + 1];
  const modes =
    argv.includes('--mode') && modeArg !== 'both'
      ? [modeArg]
      : ['light', 'dark'];

  for (const mode of modes) {
    if (mode !== 'light' && mode !== 'dark') {
      console.error(`Unknown --mode '${mode}'. Use light, dark, or both.`);
      process.exit(2);
    }
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
  console.log('\n=== Building Storybook (once, shared by every mode) ===');
  const build = await run('pnpm', ['storybook:build'], {
    logFile: join(LOG_DIR, 'storybook-build.log'),
  });
  if (build.code !== 0) {
    console.error(`\nStorybook build failed (exit ${build.code}).`);
    process.exit(build.code);
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
    console.log(
      `\n=== Capture: ${mode}${update ? ' (--updateSnapshot)' : ''} ===`
    );
    const logFile = join(LOG_DIR, `capture-${mode}.log`);
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
          VISUAL_TEST_ARGS: passthrough.join(' '),
        },
      }
    );

    // **Every requested mode runs.** A failure here is recorded and the loop
    // continues — that single decision is the fix for (1). Aggregated into a
    // non-zero exit below, so nothing is swallowed.
    results.push({ mode, code, logFile, ...parseSummary(captured) });
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
        `  ${r.mode.padEnd(5)}  DID NOT RUN — no jest summary in the output ` +
          `(exit ${r.code}). See ${r.logFile}`
      );
      continue;
    }
    const s = r.snapshots ?? { written: 0, passed: 0, failed: 0, total: 0 };
    console.log(
      `  ${r.mode.padEnd(5)}  tests ${r.tests.failed} failed / ` +
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

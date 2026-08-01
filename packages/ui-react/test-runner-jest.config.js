import { getJestConfig } from '@storybook/test-runner';

/**
 * Overrides the Storybook test-runner's default jest config. `test-storybook`
 * auto-detects this file by globbing `test-runner-jest*` in its working
 * directory (the container's `/app/packages/ui-react`), which is why it lives at
 * the package root — exactly where `test-storybook --eject` writes it — and why
 * `Dockerfile.storybook` copies it into the image.
 *
 * ── testTimeout ──────────────────────────────────────────────────────────────
 * jest's 15s default was too tight for the heaviest stories
 * (`datagrid-virtualization`, `dropdownmenu`, `popover`) under the full
 * ~163-suite corpus at `--maxWorkers=4` on emulated amd64: they pass 9/9 alone
 * at 15s but intermittently exceed it under contention, and a single such
 * timeout makes the test-runner container exit non-zero — which the capture
 * script (correctly) reports as a mode FAILURE, masking the real snapshot
 * verdict. `--testTimeout` is inert in @storybook/test-runner@0.24.4 (parsed by
 * commander, never forwarded to jest); a jest config is the supported route and
 * honors `testTimeout`. The ceiling is generous headroom that does not slow the
 * run — only tests that would otherwise time out take longer.
 * See `docker-compose.storybook.yml` for the full history.
 *
 * **60s → 120s (2026-08-01).** `components-datagrid-virtualization` crossed the
 * 60s per-test limit on CI, and the two modes of the SAME run are the evidence
 * that it is contention and not a real slowdown: identical corpus, identical
 * code, the suite finished in **101.8s under `dark` and 147.6s under `light`** —
 * a 45% spread with nothing changed between them. One test inside it spiked past
 * 60s in the slower half.
 *
 * The corpus grew by 21 stories (`Foundations/Brand Matrix`) in the same change,
 * which nudges an already-borderline suite; that is added coverage, not
 * regression. Raising the ceiling is the same remedy as the 15s → 60s move above
 * and costs nothing on the runs that were already passing.
 *
 * This is a **contention guard, not a performance target.** If a suite starts
 * needing more than ~2 minutes on its own rather than under load, raise the
 * question, not the number.
 *
 * @type {import('@jest/types').Config.InitialOptions}
 */
export default {
  ...getJestConfig(),
  testTimeout: 120_000,
};

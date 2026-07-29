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
 * honors `testTimeout`. 60s is generous headroom that does not slow the run —
 * only tests that would otherwise time out take longer.
 * See `docker-compose.storybook.yml` for the full history.
 *
 * @type {import('@jest/types').Config.InitialOptions}
 */
export default {
  ...getJestConfig(),
  testTimeout: 60_000,
};

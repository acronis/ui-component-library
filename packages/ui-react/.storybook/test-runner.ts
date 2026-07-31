import type { Page } from 'playwright';
import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext } from '@storybook/test-runner';
import * as process from 'node:process';
import { existsSync } from 'node:fs';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import {
  getSnapshotIdentifier,
  isCaptureTruncated,
  resolveVisualProfile,
  rootThemeState,
  type RootThemeState,
} from './visual-regression';

/**
 * Resolved ONCE at module load, not per story.
 *
 * `resolveVisualProfile` throws on an unrecognised `STORYBOOK_COLOR_MODE`, and
 * where that throw lands decides how it reads. Inside `postVisit` it would fire
 * once per story — hundreds of identical stack traces with the real message
 * buried, in a run the capture script then reports as a generic mode failure. At
 * module scope it kills the runner before the first test, with the message first.
 */
const PROFILE = resolveVisualProfile(process.env.STORYBOOK_COLOR_MODE);

/**
 * The story the preview is **actually rendering**, straight from Storybook's own
 * preview object rather than inferred from the URL.
 */
async function renderedStoryId(page: Page): Promise<string | undefined> {
  return page.evaluate(() => {
    const preview = (
      window as unknown as {
        __STORYBOOK_PREVIEW__?: { currentRender?: { id?: string } };
      }
    ).__STORYBOOK_PREVIEW__;
    return preview?.currentRender?.id;
  });
}

/**
 * Refuses to file a screenshot under a story name it does not belong to.
 *
 * **This guards a failure that has already happened**: a baseline run produced
 * `components-sidebarsecondary--default.png` containing the `Reference` story's
 * render. Reproduced deliberately — Storybook's channel broadcasts
 * `setCurrentStory` to **every** connected preview, so anything else pointed at the
 * same Storybook (another agent's browser, a second runner) switches this page's
 * story out from under the capture. Emitting that event moved the render from
 * `Default` to `Reference` while this page sat still.
 *
 * Why it matters more than a normal flake: a mislabelled PNG **inverts** the
 * review. It flags the innocent story whose name the wrong content landed under,
 * and stays silent about the story whose real change went missing — so the gate
 * reports a defect where there is none and passes the one that matters.
 *
 * Checked **before and after** the capture. Before alone leaves the capture window
 * unguarded, which is precisely when a broadcast lands.
 */
async function assertRenderingStory(
  page: Page,
  expectedId: string,
  when: 'before' | 'after'
): Promise<void> {
  const actual = await renderedStoryId(page);
  if (actual === undefined) {
    // **Fails rather than skips.** The signal was verified present in a real
    // `storybook-static` build — the artifact this runner consumes — so its absence
    // means Storybook's internals moved, and a guard that quietly stops checking is
    // worse than no guard: the run goes green and the mislabelling it exists to
    // catch comes back invisible.
    throw new Error(
      `Visual regression aborted: cannot read the rendered story id from the ` +
        `preview (\`__STORYBOOK_PREVIEW__.currentRender.id\`), so a capture filed ` +
        `as '${expectedId}' cannot be verified to be that story. Storybook's ` +
        'internals have probably changed — find the new signal before trusting ' +
        'any baseline from this run.'
    );
  }
  if (actual !== expectedId) {
    throw new Error(
      `Visual regression aborted: the preview is rendering '${actual}' but this ` +
        `capture would be filed as '${expectedId}' (checked ${when} the ` +
        'screenshot). Something else is driving this Storybook — Storybook ' +
        'broadcasts `setCurrentStory` to every connected preview, so another ' +
        'browser on the same server retargets this one. Do not accept the run: a ' +
        'mislabelled baseline inverts the review.'
    );
  }
}

const config: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async postVisit(page, context) {
    // Wait for fonts and images to load before snapshotting.
    await page.waitForLoadState('networkidle');

    const storyContext = await getStoryContext(page, context);
    const snapshotFullPage =
      storyContext.parameters?.snapshot?.fullPage === true;

    // Only wait for animations when a story opts in via
    // parameters.snapshot.animationDelay — avoids a blanket wait on every story.
    const animationDelay = storyContext.parameters?.snapshot?.animationDelay;
    if (animationDelay) {
      await page.waitForTimeout(
        typeof animationDelay === 'number' ? animationDelay : 400
      );
    }

    // The OS half of the theme input. Set for EVERY profile, including light and
    // dark — see `VisualProfile` for why an unstated Chromium default is not an
    // acceptable input to 1530 committed baselines.
    await page.emulateMedia({ colorScheme: PROFILE.emulate });

    // The document half. The DECISION is `rootThemeState` in
    // `visual-regression.ts` (unit-tested); this callback only applies it, because
    // a `page.evaluate` body is serialized into the browser and cannot reference
    // an import. Both writes are unconditional on purpose — `null` means the
    // attribute/property must be ABSENT, which the preview decorator has already
    // made false by the time we get here.
    await page.evaluate((state: RootThemeState) => {
      const html = document.documentElement;
      if (state.dataTheme === null) {
        delete html.dataset.theme;
      } else {
        html.dataset.theme = state.dataTheme;
      }
      if (state.inlineColorScheme === null) {
        html.style.removeProperty('color-scheme');
      } else {
        html.style.setProperty('color-scheme', state.inlineColorScheme);
      }
    }, rootThemeState(PROFILE));
    await page.waitForTimeout(50);

    await assertRenderingStory(page, context.id, 'before');

    let image: Buffer;
    if (snapshotFullPage) {
      // Some stories are too tall for the default viewport — capture the full
      // page so nothing is clipped.
      image = await page.screenshot({ animations: 'disabled', fullPage: true });
    } else {
      // Floating UI (dialogs, menus, listboxes) renders in a portal outside
      // #storybook-root. Union the story root (the trigger) with EVERY open
      // overlay so the control AND its popup(s) are in frame — including the
      // stacked panels of a cascaded submenu, each of which is its own
      // [role="menu"] portal (framing only the first one clips the rest).
      const overlays = page.locator(
        '[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"]'
      );
      const overlayCount = await overlays.count();
      const targets = [
        page.locator('#storybook-root'),
        ...Array.from({ length: overlayCount }, (_, i) => overlays.nth(i)),
      ];
      const boxes = (
        await Promise.all(targets.map((t) => t.boundingBox()))
      ).filter((b): b is NonNullable<typeof b> => b !== null);
      const padding = 24;
      const viewport = page.viewportSize();
      // The four extents are hoisted out of the clip expression only so the
      // truncation check below can read `maxY`. The clip arithmetic is unchanged
      // term for term — a moved baseline on a story that did not gain `fullPage`
      // means this refactor altered capture geometry, and that is the first thing
      // to suspect.
      const extent = boxes.length
        ? {
            minX: Math.min(...boxes.map((b) => b.x)),
            minY: Math.min(...boxes.map((b) => b.y)),
            maxX: Math.max(...boxes.map((b) => b.x + b.width)),
            maxY: Math.max(...boxes.map((b) => b.y + b.height)),
          }
        : undefined;
      const clip =
        extent && viewport
          ? (() => {
              const { minX, minY, maxX, maxY } = extent;
              const x = Math.max(0, minX - padding);
              const y = Math.max(0, minY - padding);
              return {
                x,
                y,
                width: Math.min(maxX - minX + padding * 2, viewport.width - x),
                height: Math.min(
                  maxY - minY + padding * 2,
                  viewport.height - y
                ),
              };
            })()
          : undefined;

      // **Fails rather than warns**, for the reason `assertRenderingStory` fails
      // rather than skips: this cap was silent from the day it was written and
      // produced 7 truncated multi-case comparison baselines that a full mechanical
      // pass AND a full eyeball pass both passed (#89). A warning in a ~520 s,
      // 600-test, two-mode run prints after hundreds of passing results — the same
      // hiding place with a nicer name. A file that disagrees with itself about
      // whether its guards fail teaches the weaker half.
      //
      // Thrown **before** the screenshot: in `--update` mode that ordering is what
      // stops a truncated PNG being written.
      if (
        extent &&
        viewport &&
        isCaptureTruncated(extent.maxY, viewport.height)
      ) {
        throw new Error(
          `Visual regression aborted: '${context.id}' renders ${Math.ceil(
            extent.maxY
          )}px tall but the capture viewport is ${viewport.height}px, so the ` +
            `clipped screenshot would drop ~${Math.ceil(
              extent.maxY - viewport.height
            )}px off the bottom — for a multi-case story, its last case. A ` +
            'baseline that omits a case does not guard that case and looks like ' +
            'it does (#89).\n' +
            'Fix: add `parameters: { snapshot: { fullPage: true } }` to this ' +
            'story, then regenerate its baseline.\n' +
            'NOTE: `fullPage` applies neither the bbox clip nor the 24px padding, ' +
            'so the new capture is REFRAMED, not merely taller — and under ' +
            "`layout: 'centered'` it also changes width, because the clip was " +
            'content-sized while a full-page capture is viewport-wide.'
        );
      }

      image = await page.screenshot({ animations: 'disabled', clip });
    }
    // The capture window is the part that matters — see `assertRenderingStory`.
    await assertRenderingStory(page, context.id, 'after');

    const snapshotsDir = `${process.cwd()}/test/__snapshots__`;
    // `PROFILE.baseline`, not `PROFILE.name`: `system-dark` files against the
    // committed `--dark` baselines and `forced-light` against the light ones.
    // That reuse IS the assertion — see `VisualProfile`.
    const snapshotIdentifier = getSnapshotIdentifier(
      context.id,
      PROFILE.baseline
    );

    /**
     * **A profile that owns no baselines must never create one.**
     *
     * `jest-image-snapshot` WRITES a missing snapshot instead of failing (jest's
     * usual first-run behaviour), and that is wrong here in a way no output
     * reveals. `system-dark` and `forced-light` exist to re-render an EXISTING
     * baseline under a different theme input; for a story that has none, there is
     * nothing to compare, so the write records the untested state as ground truth
     * and every later run compares against it. The story would then carry a dark
     * baseline captured with no `[data-theme]` at all — sourced from the very
     * profile that is supposed to be checked against it, and green forever.
     *
     * Caught in practice: adding one story and running `system-dark` before
     * `--mode both --update` was enough to reach this. It also covers the wider
     * case of a story added by someone who only ran the subset profiles.
     */
    if (
      PROFILE.subset &&
      !existsSync(`${snapshotsDir}/${snapshotIdentifier}.png`)
    ) {
      throw new Error(
        `Visual regression aborted: '${context.id}' has no committed ` +
          `'${snapshotIdentifier}.png', and the '${PROFILE.name}' profile is not ` +
          'allowed to create one — it owns no baselines, it only re-renders ' +
          "other profiles' baselines under a different theme input.\n" +
          'Fix: record it first with ' +
          '`pnpm storybook:test:visual:docker:update:all`, then re-run this ' +
          'profile.'
      );
    }

    expect(image).toMatchImageSnapshot({
      customSnapshotsDir: snapshotsDir,
      customSnapshotIdentifier: snapshotIdentifier,
      // The gate is 0.5% by default (CI and normal captures). `VISUAL_FAILURE_THRESHOLD`
      // overrides it for diagnostics — set it to 0 to expose the true per-story diff a
      // 0.5% gate is blind to (#101), e.g. `VISUAL_FAILURE_THRESHOLD=0 … -- ui-avatar`.
      // Never lower it for CI; a sub-0.5% render change that must be baked in should be
      // captured with a scoped `VISUAL_FAILURE_THRESHOLD=0 …:update`, not a global drop.
      // NB: docker-compose passes this as an EMPTY string when the host env is unset
      // (`${VISUAL_FAILURE_THRESHOLD:-}`), and `Number('')` is 0 — so guard empty/unset
      // explicitly rather than with `??`, or every normal run would gate at 0%.
      failureThreshold: process.env.VISUAL_FAILURE_THRESHOLD
        ? Number(process.env.VISUAL_FAILURE_THRESHOLD)
        : 0.005,
      failureThresholdType: 'percent',
    });
  },
};

export default config;

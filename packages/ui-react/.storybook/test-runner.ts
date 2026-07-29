import type { Page } from 'playwright';
import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext } from '@storybook/test-runner';
import * as process from 'node:process';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import {
  getSnapshotIdentifier,
  isCaptureTruncated,
  resolveVisualColorMode,
} from './visual-regression';

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
    const colorMode = resolveVisualColorMode(process.env.STORYBOOK_COLOR_MODE);

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

    await page.evaluate((mode: 'light' | 'dark') => {
      const html = document.documentElement;
      html.dataset.theme = mode;
      html.style.colorScheme = mode;
    }, colorMode);
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

    expect(image).toMatchImageSnapshot({
      customSnapshotsDir: `${process.cwd()}/test/__snapshots__`,
      customSnapshotIdentifier: getSnapshotIdentifier(context.id, colorMode),
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

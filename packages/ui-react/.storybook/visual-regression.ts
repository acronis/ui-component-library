export type VisualColorMode = 'light' | 'dark';

/**
 * A capture profile: how the runner puts the page into a theme state, and which
 * committed baseline family that state must reproduce.
 *
 * ── WHY THIS IS NOT JUST A COLOUR MODE ───────────────────────────────────────
 * Light/dark is driven by TWO independent inputs, and the pair — not either one
 * — decides what a user sees:
 *
 *   1. `[data-theme]` on the root element (what a consumer sets explicitly), and
 *   2. the OS `prefers-color-scheme`, which `color-scheme: light dark` in
 *      `packages/tokens/css/primitives.css` defers to when NO `[data-theme]` is
 *      present.
 *
 * The `light` and `dark` profiles pin input 1 and leave input 2 at its default,
 * so between them they cover only two of the six states the pair can be in. The
 * profiles below are that cross product, in full — `[data-theme]` ∈ {light, dark,
 * absent} × OS ∈ {light, dark}:
 *
 *   | profile        | [data-theme] | OS pref | tokens resolve | must equal    |
 *   | -------------- | ------------ | ------- | -------------- | ------------- |
 *   | light          | light        | light   | light          | `<id>`        |
 *   | dark           | dark         | light   | dark           | `<id>--dark`  |
 *   | system-dark    | (absent)     | dark    | dark           | `<id>--dark`  |
 *   | system-light   | (absent)     | light   | light          | `<id>`        |
 *   | forced-light   | light        | dark    | light          | `<id>`        |
 *   | forced-dark    | dark         | dark    | dark           | `<id>--dark`  |
 *
 * The naming is the mechanism, not the colour: a `system-*` profile removes the
 * attribute so the OS decides, a `forced-*` profile sets an attribute that the OS
 * CONTRADICTS. Which is why `forced-dark` is not a duplicate of `dark` — `dark`
 * leaves the OS at light and pins `color-scheme` inline, so it never exercises the
 * stylesheet's `[data-theme='dark']` rule against a dark machine, and never sees a
 * `prefers-color-scheme` fallback fire on top of an explicit attribute.
 *
 * **The four non-baseline profiles write no new baselines.** `light-dark()` resolves from
 * the *used* value of `color-scheme`, which is `dark` under both `dark` and
 * `system-dark` (and `light` under both `light` and `forced-light`) — so every
 * token-driven colour is identical by construction, and the render MUST match the
 * baseline the existing profile already committed. Anything that differs is, by
 * definition, styling that keyed off `[data-theme]` directly instead of resolving
 * through a token — which is exactly the defect these profiles exist to find.
 *
 * That is why `baseline` is a separate field from `name`: it is the assertion.
 *
 * ── WHY `emulate` IS SET EVEN FOR `light` AND `dark` ──────────────────────────
 * Those two profiles previously relied on Chromium's *default* `prefers-color-
 * scheme` being light. That assumption was unstated and load-bearing: had the
 * default ever flipped, both baseline families would have silently shifted with
 * no code change to point at. Pinning it costs one Playwright call and turns the
 * assumption into a declaration.
 */
export interface VisualProfile {
  /** Profile name, as passed in `STORYBOOK_COLOR_MODE`. */
  name: VisualProfileName;
  /**
   * `[data-theme]` to set on `<html>`, or `null` to REMOVE the attribute so the
   * `:root` `color-scheme: light dark` defers to the OS.
   */
  themeAttribute: VisualColorMode | null;
  /**
   * Whether to also set `html.style.color-scheme` inline.
   *
   * `false` leaves it to the stylesheet's `[data-theme='…']` rule. That is the
   * honest path for `forced-light`: a real consumer (see
   * `apps/demo/src/lib/theme-switcher.ts`) sets only the attribute, and an inline
   * `color-scheme` would bypass the very rule under test.
   */
  inlineColorScheme: boolean;
  /** OS-level `prefers-color-scheme` to emulate for this capture. */
  emulate: VisualColorMode;
  /** The committed baseline family this profile must reproduce, byte for byte. */
  baseline: VisualColorMode;
  /**
   * Run only the curated story subset (`scripts/system-theme-subset.mjs`).
   *
   * The four non-baseline profiles assert a property that holds per-story
   * independently, so a representative sample tests the same claim a full corpus
   * would — at ~16% of the cost each. `light`/`dark` stay exhaustive because they
   * own the baselines.
   */
  subset: boolean;
}

export type VisualProfileName =
  | 'light'
  | 'dark'
  | 'system-dark'
  | 'system-light'
  | 'forced-light'
  | 'forced-dark';

export const VISUAL_PROFILES: Record<VisualProfileName, VisualProfile> = {
  light: {
    name: 'light',
    themeAttribute: 'light',
    inlineColorScheme: true,
    emulate: 'light',
    baseline: 'light',
    subset: false,
  },
  dark: {
    name: 'dark',
    themeAttribute: 'dark',
    inlineColorScheme: true,
    emulate: 'light',
    baseline: 'dark',
    subset: false,
  },
  // The bug case: OS says dark, nothing says otherwise. Tokens go dark via
  // `light-dark()`; anything keyed on `[data-theme='dark']` stays light.
  'system-dark': {
    name: 'system-dark',
    themeAttribute: null,
    inlineColorScheme: false,
    emulate: 'dark',
    baseline: 'dark',
    subset: true,
  },
  // The other half of the system case: OS says light, nothing says otherwise.
  // Weaker than `system-dark` on its own — a stylesheet that ignores the OS
  // entirely still passes it, because the default it falls back to IS light. It
  // earns its place as the control: a `prefers-color-scheme` fallback that
  // over-reaches (matching when it should not, or inverting its condition) turns
  // this into a dark render against a light baseline, and `system-dark` alone
  // cannot tell that apart from a correct implementation.
  'system-light': {
    name: 'system-light',
    themeAttribute: null,
    inlineColorScheme: false,
    emulate: 'light',
    baseline: 'light',
    subset: true,
  },
  // The guard case: a user on a dark machine who deliberately picked light. Only
  // reachable once a `prefers-color-scheme` fallback exists, and the first thing
  // such a fallback breaks if its `:not([data-theme='light'])` escape is wrong.
  'forced-light': {
    name: 'forced-light',
    themeAttribute: 'light',
    inlineColorScheme: false,
    emulate: 'dark',
    baseline: 'light',
    subset: true,
  },
  // The attribute and the OS AGREE on dark — and the inline `color-scheme` is
  // withheld, unlike the `dark` profile. So this is the only profile where a
  // `prefers-color-scheme: dark` fallback and the `[data-theme='dark']` rule are
  // both live at once: a fallback that fights the attribute (double-applied
  // inversion, or a UA-painted control taking its `color-scheme` from the media
  // query rather than the rule) shows up here and nowhere else.
  'forced-dark': {
    name: 'forced-dark',
    themeAttribute: 'dark',
    inlineColorScheme: false,
    emulate: 'dark',
    baseline: 'dark',
    subset: true,
  },
};

const DEFAULT_PROFILE: VisualProfileName = 'light';

/**
 * Resolve `STORYBOOK_COLOR_MODE` into a profile.
 *
 * **An unrecognised non-empty value throws rather than falling back to light.**
 * This used to be lenient, and with two modes the cost of a typo was bounded: you
 * got a light run filed under light baselines — mislabelled, but not destructive.
 * With six profiles, four of them file against a baseline family they do not own
 * — two of those against the *opposite* family — so the same typo in an `--update`
 * run silently overwrites 765 light baselines with dark renders. A default is only
 * safe while every branch is harmless.
 *
 * Empty/unset still means light: docker-compose passes
 * `${STORYBOOK_COLOR_MODE:-light}`, but `VISUAL_TEST_ARGS` shows this stack does
 * hand through empty strings, and an empty string is "nobody asked", not a typo.
 */
export function resolveVisualProfile(name: string | undefined): VisualProfile {
  if (name === undefined || name === '')
    return VISUAL_PROFILES[DEFAULT_PROFILE];

  const profile = VISUAL_PROFILES[name as VisualProfileName];
  if (!profile) {
    throw new Error(
      `Unknown STORYBOOK_COLOR_MODE '${name}'. Expected one of: ` +
        `${Object.keys(VISUAL_PROFILES).join(', ')}.\n` +
        'Refusing to fall back to light: four profiles compare against the ' +
        "opposite family's baselines, so a typo in an --update run would " +
        'overwrite them with renders from the wrong theme.'
    );
  }
  return profile;
}

export function getSnapshotIdentifier(
  storyId: string,
  colorMode: VisualColorMode
): string {
  return colorMode === 'dark' ? `${storyId}--dark` : storyId;
}

/**
 * What `<html>` must look like for a profile. `null` means the attribute /
 * property must be **absent**, not merely unset by us.
 */
export interface RootThemeState {
  dataTheme: VisualColorMode | null;
  inlineColorScheme: VisualColorMode | null;
}

/**
 * The profile → DOM-state decision, as data.
 *
 * **Deliberately not a function that mutates the DOM.** The mutation happens
 * inside `page.evaluate`, whose callback is serialized and run in the browser —
 * it cannot close over an import, so a shared helper would have to be either
 * `toString()`-smuggled across a module boundary (which breaks the moment the TS
 * loader emits a `__name` wrapper) or copy-pasted (two sources of truth for the
 * one thing no test can see). Returning state instead keeps the branching here,
 * under test, and leaves the runner two unconditional writes.
 *
 * Both fields are always specified, never "leave it alone". Storybook's preview
 * decorator (`globals.ts:applyColorMode`) has already set BOTH the attribute and
 * an inline `color-scheme` by the time the runner acts, so a profile that merely
 * declined to set them would inherit the decorator's — and `system-dark`, whose
 * whole premise is that neither is present, would silently capture light.
 */
export function rootThemeState(
  profile: Pick<VisualProfile, 'themeAttribute' | 'inlineColorScheme'>
): RootThemeState {
  return {
    dataTheme: profile.themeAttribute,
    inlineColorScheme:
      profile.inlineColorScheme && profile.themeAttribute !== null
        ? profile.themeAttribute
        : null,
  };
}

/**
 * Does the clipped capture drop content off the bottom of the frame?
 *
 * The runner clips to the union bbox + `padding`, capping the height at
 * `viewport.height - y`. When that cap binds, the captured region ends at exactly
 * `viewport.height`, so **content below the viewport is not in the baseline** —
 * silently, and the run stays green.
 *
 * Derivation, because the obvious predicate is the wrong one. The region is
 * `[y, y + h)` with `y = max(0, minY - padding)` and
 * `h = min(maxY - minY + 2 * padding, viewport.height - y)`.
 * - Uncapped: `y + h` exceeds `maxY` by at least `padding`. Nothing lost.
 * - Capped: `h = viewport.height - y`, so `y + h === viewport.height`, and content
 *   is lost **iff `maxY > viewport.height`.**
 *
 * So this is `maxY > viewport.height` — necessary *and* sufficient — and **not**
 * "did the cap bind". A story that fills the viewport exactly (`layout:
 * 'fullscreen'` with `h-screen`, i.e. every `components-appshell--*`) also binds the
 * cap but loses only the decorative padding: 22 correct baselines would fail a
 * cap-bound check.
 *
 * Only the vertical axis is checked. ~150 baselines legitimately reach the right
 * edge because `layout: 'padded'` stories are full-width, so a horizontal check
 * would bury the real findings under false positives.
 *
 * **No tolerance.** A tolerance is how a check goes quiet, and a silently truncated
 * baseline is the defect this exists to remove.
 *
 * **A geometry it cannot read is reported as truncated.** `NaN > n` is `false`, so a
 * bare comparison would return "not truncated" for a measurement that never arrived
 * — passing green on no evidence, which is this check's own failure mode. On this
 * branch a guard passed 20/20 while comparing `NaN`. Same stance as
 * `assertRenderingStory`: a check that cannot decide must be loud.
 */
export function isCaptureTruncated(
  contentBottom: number,
  viewportHeight: number
): boolean {
  if (!Number.isFinite(contentBottom) || !Number.isFinite(viewportHeight)) {
    return true;
  }
  return contentBottom > viewportHeight;
}

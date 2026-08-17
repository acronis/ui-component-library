import {
  getSnapshotIdentifier,
  isCaptureTruncated,
  resolveVisualProfile,
  rootThemeState,
  VISUAL_PROFILES,
} from './visual-regression';

describe('resolveVisualProfile', () => {
  it('defaults an unset or empty mode to light', () => {
    // docker-compose passes `${STORYBOOK_COLOR_MODE:-light}`, but this stack does
    // hand through empty strings (see VISUAL_TEST_ARGS) — "nobody asked" is not
    // the same as a typo.
    expect(resolveVisualProfile(undefined).name).toBe('light');
    expect(resolveVisualProfile('').name).toBe('light');
  });

  it('resolves every declared profile by name', () => {
    for (const name of Object.keys(VISUAL_PROFILES)) {
      expect(resolveVisualProfile(name).name).toBe(name);
    }
  });

  it('THROWS on an unrecognised mode instead of falling back to light', () => {
    // This used to return light. With four non-baseline profiles that is
    // destructive, not merely mislabelled: each files against the light/dark
    // baselines, so a typo in an `--update` run silently overwrites 765 committed
    // PNGs with renders captured under the wrong theme input.
    expect(() => resolveVisualProfile('sytem-dark')).toThrow(/Unknown/);
    expect(() => resolveVisualProfile('invalid')).toThrow(/system-dark/);
  });

  it('names every profile in the error, so a typo shows the real vocabulary', () => {
    // The list is generated from VISUAL_PROFILES, so this also fails if a new
    // profile is added without the operator-facing message learning about it.
    const message = (() => {
      try {
        resolveVisualProfile('nope');
        return '';
      } catch (error) {
        return (error as Error).message;
      }
    })();
    for (const name of Object.keys(VISUAL_PROFILES)) {
      expect(message).toContain(name);
    }
  });
});

describe('VISUAL_PROFILES', () => {
  // These six rows ARE the specification — the table in the module docblock is
  // prose, and prose does not fail. Each profile's `baseline` is the assertion it
  // makes, so a wrong value here does not error: it compares a dark render
  // against a light PNG and reports a defect that is really a config mistake.
  it.each([
    ['light', 'light', true, 'light', 'light', false],
    ['dark', 'dark', true, 'light', 'dark', false],
    ['system-dark', null, false, 'dark', 'dark', true],
    ['system-light', null, false, 'light', 'light', true],
    ['forced-light', 'light', false, 'dark', 'light', true],
    ['forced-dark', 'dark', false, 'dark', 'dark', true],
  ])(
    '%s: attr=%s inline=%s emulate=%s baseline=%s subset=%s',
    (name, themeAttribute, inlineColorScheme, emulate, baseline, subset) => {
      expect(VISUAL_PROFILES[name]).toMatchObject({
        themeAttribute,
        inlineColorScheme,
        emulate,
        baseline,
        subset,
      });
    }
  );

  it('gives the two system profiles the OPPOSITE attribute state to their baseline owner', () => {
    // The property that makes them worth running at all. `system-dark` must
    // reproduce the dark baseline WITHOUT `[data-theme='dark']`, and
    // `forced-light` must reproduce the light baseline WITH a dark OS. If either
    // ever matched its baseline owner's inputs it would assert nothing.
    const { dark, light } = VISUAL_PROFILES;
    expect(VISUAL_PROFILES['system-dark'].baseline).toBe(dark.baseline);
    expect(VISUAL_PROFILES['system-dark'].themeAttribute).not.toBe(
      dark.themeAttribute
    );
    expect(VISUAL_PROFILES['forced-light'].baseline).toBe(light.baseline);
    expect(VISUAL_PROFILES['forced-light'].emulate).not.toBe(light.emulate);
  });

  it('covers the [data-theme] × OS cross product exactly once', () => {
    // The reason there are six profiles and not "a few useful ones": the two
    // inputs have 3 × 2 states and each is reachable by a real consumer. A
    // duplicate pair means two legs paying for the same evidence; a missing pair
    // means a state a user can be in that nothing captures. Both are invisible
    // from the profile list alone, which is why this counts rather than reads.
    const inputs = Object.values(VISUAL_PROFILES).map(
      (p) => `${p.themeAttribute ?? 'absent'}/${p.emulate}`
    );
    expect([...inputs].sort()).toEqual(
      [
        'absent/dark',
        'absent/light',
        'dark/dark',
        'dark/light',
        'light/dark',
        'light/light',
      ].sort()
    );
  });

  it('derives every baseline from the theme the used color-scheme resolves to', () => {
    // The invariant behind the whole scheme. With no attribute the OS decides;
    // with one, it wins. So `baseline` is not a free choice — it is a function of
    // the two inputs, and a row that disagrees is a config error that presents as
    // a component defect (a dark render diffed against a light PNG).
    for (const profile of Object.values(VISUAL_PROFILES)) {
      expect(profile.baseline).toBe(profile.themeAttribute ?? profile.emulate);
    }
  });

  it('lets only the two exhaustive profiles own baselines', () => {
    // `subset: false` means "writes PNGs". Exactly light and dark may, and they
    // must stay exhaustive: a sample cannot own a corpus, because the stories it
    // skips would have no baseline at all.
    const owners = Object.values(VISUAL_PROFILES)
      .filter((p) => !p.subset)
      .map((p) => p.name);
    expect(owners.sort()).toEqual(['dark', 'light']);
  });

  it('gives every non-baseline profile an input its baseline owner does not have', () => {
    // Generalises the system-dark/forced-light pair above to the whole set: a
    // profile whose attribute AND emulated OS both matched its baseline owner
    // would re-run an identical render and assert nothing, while costing a leg.
    for (const profile of Object.values(VISUAL_PROFILES).filter(
      (p) => p.subset
    )) {
      const owner = VISUAL_PROFILES[profile.baseline];
      expect({
        sameAttribute: profile.themeAttribute === owner.themeAttribute,
        sameEmulate: profile.emulate === owner.emulate,
        sameInlineColorScheme:
          profile.inlineColorScheme === owner.inlineColorScheme,
      }).not.toEqual({
        sameAttribute: true,
        sameEmulate: true,
        sameInlineColorScheme: true,
      });
    }
  });
});

describe('rootThemeState', () => {
  it('clears both inputs for system-dark', () => {
    // `null` means ABSENT. Storybook's preview decorator has already set both by
    // the time the runner acts, so "don't set it" would inherit light and the
    // profile would silently capture the wrong state.
    expect(rootThemeState(VISUAL_PROFILES['system-dark'])).toEqual({
      dataTheme: null,
      inlineColorScheme: null,
    });
  });

  it('sets the attribute but NOT an inline color-scheme for forced-light', () => {
    // An inline `color-scheme` would bypass the `[data-theme='light']` rule in
    // primitives.css — the rule this profile exists to test.
    expect(rootThemeState(VISUAL_PROFILES['forced-light'])).toEqual({
      dataTheme: 'light',
      inlineColorScheme: null,
    });
  });

  it('clears both inputs for system-light too', () => {
    // Same premise as system-dark, opposite OS: the CSS-native path is only
    // reachable while neither input is present.
    expect(rootThemeState(VISUAL_PROFILES['system-light'])).toEqual({
      dataTheme: null,
      inlineColorScheme: null,
    });
  });

  it('sets the attribute but NOT an inline color-scheme for forced-dark', () => {
    // Withholding the inline property is the entire difference from the `dark`
    // profile: it leaves the stylesheet's `[data-theme='dark']` rule and any
    // `prefers-color-scheme: dark` fallback both live, which is the collision
    // this profile exists to capture.
    expect(rootThemeState(VISUAL_PROFILES['forced-dark'])).toEqual({
      dataTheme: 'dark',
      inlineColorScheme: null,
    });
  });

  it('sets both for the baseline-owning profiles', () => {
    expect(rootThemeState(VISUAL_PROFILES.light)).toEqual({
      dataTheme: 'light',
      inlineColorScheme: 'light',
    });
    expect(rootThemeState(VISUAL_PROFILES.dark)).toEqual({
      dataTheme: 'dark',
      inlineColorScheme: 'dark',
    });
  });
});

describe('getSnapshotIdentifier', () => {
  it('suffixes dark snapshot identifiers', () => {
    expect(getSnapshotIdentifier('ui-button--default', 'light')).toBe(
      'ui-button--default'
    );
    expect(getSnapshotIdentifier('ui-button--default', 'dark')).toBe(
      'ui-button--default--dark'
    );
  });

  it('files a system profile under its BASELINE, not its name', () => {
    // The reuse is the assertion: system-dark has no `--system-dark` PNGs, it
    // must reproduce the committed dark ones.
    expect(
      getSnapshotIdentifier(
        'ui-button--default',
        VISUAL_PROFILES['system-dark'].baseline
      )
    ).toBe('ui-button--default--dark');
    expect(
      getSnapshotIdentifier(
        'ui-button--default',
        VISUAL_PROFILES['forced-light'].baseline
      )
    ).toBe('ui-button--default');
  });
});

/**
 * These exercise the ARITHMETIC ONLY. They do **not** establish that the numbers
 * reaching `isCaptureTruncated` in the runner are the real `maxY` — that coupling is
 * unexercised and registered as owed in F18-P5 of the baseline-prediction registry.
 * Two separate claims, deliberately not merged into one.
 */
describe('isCaptureTruncated', () => {
  const VIEWPORT = 720;

  it('fires when content extends past the viewport bottom', () => {
    // Real cases: ui-table--borders (~1090px of content) and the formlayout forms.
    expect(isCaptureTruncated(1090, VIEWPORT)).toBe(true);
    expect(isCaptureTruncated(900, VIEWPORT)).toBe(true);
    expect(isCaptureTruncated(721, VIEWPORT)).toBe(true);
  });

  it('does NOT fire when content ends exactly at the viewport bottom', () => {
    // The `components-appshell--*` class: `layout: 'fullscreen'` + `h-screen`, so the
    // height cap binds but only the decorative padding is lost, not content. This is
    // the `>` vs `>=` boundary, and `>=` here would redden 22 correct baselines.
    expect(isCaptureTruncated(VIEWPORT, VIEWPORT)).toBe(false);
  });

  it('does NOT fire for content shorter than the viewport', () => {
    // The verified-clean pair: grouping--multiple-grouping-columns and
    // ui-table--sizes, whose captures are 699px and 696px tall.
    expect(isCaptureTruncated(699, VIEWPORT)).toBe(false);
    expect(isCaptureTruncated(696, VIEWPORT)).toBe(false);
    expect(isCaptureTruncated(0, VIEWPORT)).toBe(false);
  });

  it('reports an unreadable geometry as truncated rather than passing green', () => {
    // `NaN > 720` is false, so a bare comparison would return "not truncated" for a
    // measurement that never arrived — green on no evidence, which is exactly this
    // check's own failure mode. A guard on this branch passed 20/20 comparing `NaN`.
    expect(isCaptureTruncated(Number.NaN, VIEWPORT)).toBe(true);
    expect(isCaptureTruncated(800, Number.NaN)).toBe(true);
    expect(isCaptureTruncated(Number.POSITIVE_INFINITY, VIEWPORT)).toBe(true);
  });
});

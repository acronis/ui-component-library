# @constructor-lab/icons-react

## 1.1.0

### Minor Changes

- [#6](https://github.com/acronis/ui-component-library/pull/6) [`c1aa20e`](https://github.com/acronis/ui-component-library/commit/c1aa20ec3fc2e39d353bd2e46c7b1495ac007bc7) Thanks [@leonid](https://github.com/leonid)! - **Icons**: fixed stroke-join spikes on refetched icons, and `CirclesMulti` is
  now `ShapesMulti`.

  `shapes-multi` rendered with a large spike jutting out of the triangle and the
  diamond. The paths were geometrically correct — the defect was the stroke join
  at the point where each subpath closes.

  SVGO's `convertPathData` writes compact **relative** commands. Accumulating
  those deltas as IEEE-754 doubles does not always land exactly back on the
  subpath's start point: the triangle drifted by 2.5e-15, and rounding to
  `floatPrecision: 4` left the diamond a real 1e-4 short. The trailing `Z` then
  closed a segment of near-zero but non-zero length, and Skia derived a join
  tangent from that garbage direction — with the default
  `stroke-linejoin="miter"` it drew a spike at the subpath start. Figma's own
  renderer does not, which is why the icon looked correct in the design file and
  broken once imported.

  `@constructor-lab/figma-icons-fetcher` now snaps those closes shut after SVGO,
  rewriting only the final segment into absolute form so `Z` becomes a true
  zero-length close that renderers skip. A relative delta cannot express a
  2.5e-15 correction, hence absolute. Gaps above 1e-3 are left alone — those are
  intentionally open shapes that `Z` legitimately closes (`house-server`,
  `sparkle`, `message-sparkle`).

  Twelve icons changed on refetch; only `shapes-multi` changes visually. The
  other eleven (`bolt`, `circle-user`, `cloud-user`, `pc-tower-small`,
  `postgresql`, `server`, `servers`, `smartphone`, `tablet`, `tapes`, `tv`) had
  sub-epsilon gaps that never produced a visible spike, and render pixel-identical
  before and after.

  **Breaking for anyone importing `CirclesMulti`.** Upstream Figma renamed
  `circles-multi` to `shapes-multi` and redrew it — four coloured circles became a
  circle, triangle, diamond and circle. This lands as a minor bump because the
  icon set is treated as generated data rather than hand-authored API surface, but
  the old export is gone: switch to `ShapesMulti`, and note the artwork differs.

## 1.0.1

### Patch Changes

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - fix(icons): un-transpose `chevron-first` / `chevron-last` artwork

  The two icons carried each other's path data, so `ChevronFirstIcon` rendered
  `>|` ("go to last") and `ChevronLastIcon` rendered `|<` ("go to first"). Any
  pager built on them — including this kit's own `DataTablePagination` and
  `DataGridPagination` — showed the go-to-last glyph on its go-to-first button and
  vice versa, while behaving correctly.

  The fix swaps the `d` attribute between the two masters in
  `@constructor-lab/icons-svg`; `stroke-mono/chevron-{first,last}.tsx` are
  regenerated from them. Nothing else changes: no name, export, viewBox, stroke
  rule, or prop is affected, and both icons keep rendering at every size.

  **Pre-existing, not a regression** — the transposition dates to the initial icon
  import (`01040922`) and has shipped in every published `icons-react` release
  since. Consumers that read the names at face value were always correct and need
  no change; a consumer that swapped the two to compensate for the artwork will
  need to un-swap them.

  Verified by rendering both masters against the known-correct `chevron-left` /
  `chevron-right` controls: `chevron-first` is now `|<` and `chevron-last` is `>|`.
  The other directional pairs in the set (`chevron-left/right`,
  `chevrons-left/right`, `arrow-{left,right}-{to,from}-line`,
  `media-skip-{back,forward}`, `media-step-{back,forward}`, `arrow-import/export`,
  `arrows-collapse/expand`, `arrow-left/right`, `arrow-up/down`,
  `arrow-trend-up/down`) were audited and are correct.

## 1.0.0

### Major Changes

- [#33](https://github.com/constructor-lab/ui-component-library/pull/33) [`a30f14f`](https://github.com/constructor-lab/ui-component-library/commit/a30f14fcc92e0604848d2fd37c65bae8b5958bde) Thanks [@leonid](https://github.com/leonid)! - Rename the npm scope from `@spec-lab` to `@constructor-lab`.

  This is a breaking change for consumers: every import and dependency must be
  updated to the new scope (e.g. `@spec-lab/ui-react` → `@constructor-lab/ui-react`,
  `@spec-lab/tokens/css` → `@constructor-lab/tokens/css`,
  `@spec-lab/icons-react/stroke-mono` → `@constructor-lab/icons-react/stroke-mono`).
  Package contents, subpath exports, and the token CSS API are otherwise unchanged.

## 0.5.0

### Minor Changes

- [#437](https://github.com/acronis/uikit/pull/437) [`981200c`](https://github.com/acronis/uikit/commit/981200c12a00ffea797446b2c716aef58db93123) Thanks [@leonid](https://github.com/leonid)! - feat(icons-react): ship the authoritative legacy→icons-react name map

  Add `legacy-icon-map.json`, generated from the design-assets `legacyNames` bridge
  (ui-legacy auto-generated names → canonical asset → per-variant pack name), and
  expose it via the `@constructor-lab/icons-react/legacy-map` subpath export. This
  lets any consumer (every MFE migrating off `@constructor-lab/shadcn-uikit`)
  resolve legacy icon names authoritatively — no guessing, no monorepo checkout.

  The map classifies each of the ~1144 legacy names as **mapped** (1:1 per variant),
  **colored** (exists only in a multicolor pack — needs a human decision, never
  silently flattened), or **unresolved** (logos/illustrations). It's generated by
  `generate:legacy-map` (chained into `generate`/`build`) and is deterministic.

## 0.4.0

### Minor Changes

- [#270](https://github.com/acronis/uikit/pull/270) [`9ce1b45`](https://github.com/acronis/uikit/commit/9ce1b4585571aa96c136d200489d0939749b2ece) Thanks [@leonid](https://github.com/leonid)! - Generate icon components from `@constructor-lab/icons-svg` instead of
  `@constructor-lab/design-assets`. This swaps in the redesigned next-gen icon
  set, so the packs grow substantially — `stroke-mono` (395), `solid-mono` (59),
  `stroke-multi` (12), `solid-multi` (1) — and the size/stroke rule (sm/md/lg =
  16/24/32 with 1.6/2/2.5px stroke) is now a generator constant rather than read
  from design-assets manifests. The `size` prop, `currentColor` theming, per-icon
  gradient-id namespacing, and per-pack subpath exports are unchanged.

  Note: the icon set changed wholesale, so some previously exported names are gone
  (e.g. `BanIcon`, `ArrowSquareUpRightIcon`, `AcronisAIcon`) and many new ones are
  added. A few names still reflect work-in-progress Figma source (`*-duplicate`,
  `agent-qnap--32`) until that source is cleaned up.

## 0.3.0

### Minor Changes

- [#242](https://github.com/acronis/uikit/pull/242) [`a85d629`](https://github.com/acronis/uikit/commit/a85d6291933854a99af8825b985c325bfb80725c) Thanks [@leonid](https://github.com/leonid)! - Add the `search` (magnifier) icon to the `icons-solid-mono` pack. The asset
  already existed upstream in `icons-svg` but wasn't promoted into `design-assets`,
  so no React component was generated. It now generates `SearchIcon`, exported from
  `@constructor-lab/icons-react/solid-mono`.

## 0.2.0

### Minor Changes

- [#84](https://github.com/acronis/uikit/pull/84) [`3b3fe78`](https://github.com/acronis/uikit/commit/3b3fe7852bbff8c50009648fe49fccbda9526bf2) Thanks [@leonid](https://github.com/leonid)! - Add `@constructor-lab/icons-react` — React icon components generated from
  `@constructor-lab/design-assets`. Ships all four packs via subpath exports
  (`./stroke-mono`, `./solid-mono`, `./stroke-multi`, `./solid-multi`) as
  tree-shakeable per-icon named exports plus an `icons` registry + `IconName`
  type per pack.
  - **mono** packs collapse to `currentColor` (inherit text color); **multi**
    packs keep their authored colors (gradient/clip ids are namespaced per icon
    to avoid collisions).
  - The design-assets scale + stroke rules are baked into a `size` prop, so a
    single 24px master renders at any size with the designed stroke weight
    (1.6px @16, 2px @24, 2.5px @32).

  `@constructor-lab/ui-react` now depends on it so components and stories can
  compose icons (e.g. `<Button><PlusIcon /> Add</Button>`).

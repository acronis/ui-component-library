# Visual regression baselines

PNG baselines for the Storybook visual regression suite, captured by
`@storybook/test-runner` + `jest-image-snapshot` (see
`../../.storybook/test-runner.ts`):

- light mode: `<story-id>.png`
- dark mode: `<story-id>--dark.png`

**Baselines are committed and must be generated in Docker (Linux)** so they match
the CI environment — never commit baselines rendered on macOS/Windows, they will
not match the Linux renderer.

## Generate / update baselines

```bash
# From the repo root (Docker must be running):
pnpm --filter @constructor-lab/ui-react storybook:test:visual:docker:update

# Dark mode baselines:
STORYBOOK_COLOR_MODE=dark pnpm --filter @constructor-lab/ui-react storybook:test:visual:docker:update
```

Review the resulting PNGs, then commit them alongside the component change.

## Check against baselines (what CI runs)

```bash
pnpm --filter @constructor-lab/ui-react storybook:test:visual:docker
STORYBOOK_COLOR_MODE=dark pnpm --filter @constructor-lab/ui-react storybook:test:visual:docker
```

On failure, diff images are written to `__diff_output__/` (gitignored) and, in
CI, uploaded as `visual-regression-diffs-ui-react-{light|dark}` artifacts.

## The 0.5% gate and sub-threshold residuals (#101)

The gate is `failureThreshold: 0.005` (0.5%), and in `--update` mode
`jest-image-snapshot` treats a sub-0.5% diff as a **match** — so it does **not**
rewrite a baseline whose render drifted by less than 0.5%. "Baseline unchanged"
therefore means "within 0.5% of the old render", not "byte-identical". This is
task #101; the whole corpus lives with this floor.

To expose the true per-story diff the gate hides, set
`VISUAL_FAILURE_THRESHOLD=0` (read by `../../.storybook/test-runner.ts`):

```bash
VISUAL_FAILURE_THRESHOLD=0 pnpm --filter @constructor-lab/ui-react \
  storybook:test:visual:docker -- ui-avatar   # threshold-0 check, avatar only
```

**Known residual — Avatar (upstream #543 inset-border → outset-ring, 32px fill).**
The 32px painted-fill fix lands under 0.5% on the single-/few-avatar stories, so
their committed baselines keep the old 28px-fill render. Measured at threshold 0
(current code vs committed baseline):

- light: `ui-avatar--default` 0.08%, `--colors` 0.40%, `--group` 0.36%,
  `--group-with-text` 0.18%, `-all-states-generated` 0.08%
- dark: `ui-avatar--default` 0.27%, `--group-with-text` 0.49%,
  `-all-states-generated` 0.27%

The determinant is colored-area proportion per story (multi-avatar
`colors`/`group` cross 0.5% and **were** rewritten in dark; single-avatar
`default` never does), not theme. The residual is a ≤2px ring annulus — real but
imperceptible. Left as-is deliberately: forcing avatar to 0-drift would make it
inconsistent with the rest of the corpus (the next 0.5% capture wouldn't hold
it).

**Known residual — PR-2 parity batches (#118 clear buttons, #123 resizable
divider).** Same #101 case: real render changes that land under 0.5%, so
`--update` left the committed baselines on the old render. Measured at threshold
0 (`VISUAL_FAILURE_THRESHOLD=0 … storybook:test:visual:docker:all -- <id>`), max
across light/dark:

- `#118` clear-button resize (`size-4`→`size-5 p-0.5`, icon stays `size-4` so
  the glyph shifts ~2px + idle-color token swap): `ui-inputtext--clearable`
  0.040%; `ui-inputsearch--with-value` 0.071% (the valueless input-search
  stories sit at the ~0.023% pristine-noise floor — no clear button to move).
- `#123` resizable divider (`width`+`bg` → logical `border-inline-start`,
  pixel-snapped; focus ring `ring` → `box-shadow` on the line): every
  `ui-resizable--*` story drifts 0.052%–**0.483%**. `ui-resizable--vertical`
  (dark) is the thinnest margin at **0.483%** — 0.017% under the gate.

Consequence for `#123`: because all divider stories stayed sub-0.5%, **no
committed baseline reflects the new pixel-snapped divider** — the gate can't
capture the rewrite. The coverage for the new mechanism is therefore the unit
test's border-class assertions
(`resizable/__tests__/resizable.test.tsx`), not a baseline. Deliberate, for the
same corpus-consistency reason as avatar.

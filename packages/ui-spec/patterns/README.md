# Usage patterns

**Patterns** are approved, reusable **compositions of components** — recipes for
recurring UI problems that span more than one component (a filter popover, a
confirm dialog, a wizard, …). They exist so the same problem is solved the same
way every time, and so agents reuse a sanctioned composition instead of
reinventing one.

A pattern complements component specs:

- A **component spec** (`components/<name>/`) describes _what one component is_.
- A **pattern** (`patterns/<name>/`) describes _how to combine components_ to
  accomplish a task, plus when (and when not) to use it.

## Format

One directory per pattern under `patterns/<name>/` with a single
`pattern.yaml`, validated against [`../schema/pattern.schema.json`](../schema/pattern.schema.json)
by `__tests__/patterns.test.ts`. Key fields:

- `intent` — one line: what it accomplishes.
- `when_to_use` / `when_not_to_use` / `anti_patterns` — guidance.
- `components` — the ui-react components it composes (PascalCase; each must
  exist, enforced by the test).
- `implementedBy` — the published composite this pattern has **graduated** into,
  if any (PascalCase). Must resolve to a ui-react component classified
  `layer: composite` (enforced by the test). See
  [`GRADUATION.md`](./GRADUATION.md).
- `replaces` — the legacy element it supersedes, if any.
- `example` — the approved React composition (the copy-paste starting point).
- `demo` / `docs` — where it is rendered for humans.

## Graduation (pattern → composite)

A proven recipe can graduate into a single published composite component; the
pattern then records the link via `implementedBy`, and consumers reach for the
composite instead of re-assembling the recipe. Criteria and the current
graduations are in [`GRADUATION.md`](./GRADUATION.md). Recipes that never
graduate (e.g. `filter-popover`) are a valid, permanent state.

## Two audiences

- **Humans** see each pattern rendered + explained in the docs site's
  **Patterns** section (`apps/docs/content/docs/patterns/`), with a live demo
  (`apps/docs/src/components/demos-react/patterns/`).
- **Agents** read `pattern.yaml` as the source of truth for the sanctioned
  composition — the `example` is the approved starting point; the
  `when_not_to_use` / `anti_patterns` keep them from misusing it.

## Patterns

| Pattern          | Intent                                                        | Replaces          |
| ---------------- | ------------------------------------------------------------- | ----------------- |
| `filter-popover` | A trigger that opens a popover of filter fields + Apply/Reset | `el-multi-search` |

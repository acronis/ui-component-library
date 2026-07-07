# Pattern → Composite graduation

A **pattern** (`patterns/<name>/pattern.yaml`) is an approved recipe — a
documented way to combine components. A **composite** is a published ui-react
component classified `layer: composite` in its `components/<name>/index.yaml`.

When a recipe proves itself, it **graduates**: the composition is crystallized
into a single published composite component, and the pattern records the link via
`implementedBy`. This is Phase 3 of
[`context/component-layers-proposal.md`](../../../context/component-layers-proposal.md).

## Graduation criteria

A pattern is ready to graduate into a composite when **all** hold:

1. **Proven** — used in ≥ 2 real screens (`screens/*`) or shipped surfaces.
2. **Stable API** — the parts, props, and slots have settled; no open redesign.
3. **Governed** — its behavior is covered by existing grammar rules (no bespoke,
   unchecked invariants).
4. **No token gaps** — every color/spacing resolves to a real `--ui-*` token (no
   stopgaps pending an upstream tokens pass).
5. **Cohesive** — it reads as one component to a consumer, not a loose assembly
   (see the Primitive/Composite deciding rule in the layers proposal §2).

If it fails any of these it stays a **recipe** (no `implementedBy`) — that is a
perfectly valid, permanent state. Many patterns (e.g. `filter-popover`) are
recipes by design and never graduate.

## Recording the link

On the graduated pattern's `pattern.yaml`:

```yaml
implementedBy: AppShell # PascalCase; must be a ui-react component with layer: composite
```

`__tests__/patterns.test.ts` enforces that `implementedBy` (when present)
resolves to a real ui-react component **and** that its spec is classified
`layer: composite` — so a pattern can never claim to be implemented by a
primitive or a missing component.

## Current graduations

| Pattern     | `implementedBy` | Notes                                                        |
| ----------- | --------------- | ------------------------------------------------------------ |
| `app-shell` | `AppShell`      | The composite owns the scaffold; the recipe fills its slots. |

Everything else is currently a recipe (no `implementedBy`).

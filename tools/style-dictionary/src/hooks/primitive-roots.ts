// Primitive-root classification. `palette`, `units`, and `font` are the raw
// value layer: aliases across the semantic/component tiers point at them. They
// are emitted as the `primitives` CSS slice (the single theme layer that owns
// `light-dark()`); everything else references them via `var()`. The token
// builder routes on these predicates (see `../tokens.ts`).

/** Token-tree roots that hold the raw value layer (palette / units / font). */
export const PRIMITIVE_ROOTS = new Set(['palette', 'units', 'font']);

/** True when a token belongs to the primitive (raw value) layer. */
export const isPrimitiveToken = (token: { path: string[] }): boolean =>
  PRIMITIVE_ROOTS.has(token.path[0]);

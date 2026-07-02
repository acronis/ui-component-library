// Primitive-root classification. `palette`, `units`, and `font` are the raw
// value layer: aliases across the semantic/component tiers point at them. They
// are now emitted as the `primitives` CSS slice (the single theme layer that
// owns `light-dark()`); everything else references them via `var()`. This module
// exposes the root set + predicates the token builder routes with.

import type { Filter } from 'style-dictionary/types';

export const SEMANTIC_ONLY = 'semantic-only';

/** Token-tree roots that hold the raw value layer (palette / units / font). */
export const PRIMITIVE_ROOTS = new Set(['palette', 'units', 'font']);

/** True when a token belongs to the primitive (raw value) layer. */
export const isPrimitiveToken = (token: { path: string[] }): boolean =>
  PRIMITIVE_ROOTS.has(token.path[0]);

/** True when a token belongs to a semantic/component tier (not a primitive). */
export const isEmittableToken = (token: { path: string[] }): boolean =>
  !isPrimitiveToken(token);

// Retained for reuse; the builder now emits primitives too, so this SD filter is
// no longer applied in the css pass — kept in the registry as a stable hook.
export const semanticOnly: Filter = {
  name: SEMANTIC_ONLY,
  filter: (token) => isEmittableToken(token),
};

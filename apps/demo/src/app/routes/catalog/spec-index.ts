import specIndexJson from '@constructor-lab/ui-spec/spec-index.json';
import type { TagProps } from '@constructor-lab/ui-react';

// The spec-index is the drift-gated data contract emitted by @constructor-lab/ui-spec
// (scripts/generate-spec-index.ts). We type it locally — the JSON is a stable
// contract, so the catalog reads it through these shapes rather than the raw
// inferred JSON types.
export interface SpecComponent {
  name: string;
  component: string;
  layer?: string;
  category: string;
  status: string;
  since?: string;
}

export interface SpecPattern {
  name: string;
  pattern: string;
  status: string;
  category?: string;
  intent?: string;
  description?: string;
  when_to_use?: string[];
  when_not_to_use?: string[];
  anti_patterns?: string[];
  example?: string;
  components?: string[];
  implementedBy?: string;
  demo?: string;
  docs?: string;
}

export interface SpecScreen {
  name: string;
  title: string;
  status: string;
  category?: string;
  route?: string;
  story?: string;
  pattern?: string;
}

export interface SpecIndex {
  components: SpecComponent[];
  patterns: SpecPattern[];
  screens: SpecScreen[];
}

export const specIndex = specIndexJson as SpecIndex;

/** Map a spec `status` to the closest kit Tag variant. */
export function statusVariant(
  status: string
): NonNullable<TagProps['variant']> {
  switch (status) {
    case 'stable':
      return 'success';
    case 'ready':
      return 'info';
    case 'deprecated':
      return 'danger';
    case 'draft':
    default:
      return 'neutral';
  }
}

/** Human label for a `layer` value. */
export function layerLabel(layer: string | undefined): string {
  switch (layer) {
    case 'primitive':
      return 'Primitives';
    case 'composite':
      return 'Composites';
    default:
      return 'Other';
  }
}

/** Group items by a key, returning entries sorted by key. */
export function groupBy<T>(
  items: T[],
  key: (item: T) => string
): [string, T[]][] {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item);
    const bucket = map.get(k);
    if (bucket) bucket.push(item);
    else map.set(k, [item]);
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import {
  buildSpecIndex,
  SPEC_INDEX_PATH,
  type SpecIndex,
} from '../scripts/generate-spec-index';

// Drift gate: the committed spec-index.json is a generated artifact consumed by
// apps/demo. Regenerate it in-memory and deep-equal it against the committed
// file — if they diverge, someone changed a spec without re-running
// `pnpm --filter @constructor-lab/ui-spec generate:spec-index`.
describe('spec-index.json is not stale', () => {
  it('matches a fresh build from the YAML sources', () => {
    const committed = JSON.parse(
      readFileSync(SPEC_INDEX_PATH, 'utf8')
    ) as SpecIndex;

    expect(committed).toEqual(buildSpecIndex());
  });

  it('each array is sorted by name', () => {
    const index = buildSpecIndex();
    for (const key of ['components', 'patterns', 'screens'] as const) {
      const names = index[key].map((entry) => entry.name);
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    }
  });
});

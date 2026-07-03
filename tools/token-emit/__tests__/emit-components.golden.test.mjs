import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { DtcgFormatter } from '../helpers/utils-dtcg-formatter.mjs';
import { ComponentsEmitter } from '../helpers/emit-components-builder.mjs';

// Golden / characterization test for the components emit logic. ComponentsEmitter
// resolves against the primitives + semantics tiers (injected here as the committed
// goldens) and emits only allowlisted components — the fixture is trimmed to
// Button/Chip/Tag, so the test allowlist matches. `build()` is a pure, deterministic
// function of (snapshot, primitives, semantics, allowlist). Any emit-logic change
// that alters output fails here.

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = (name) =>
  fs.readFileSync(path.join(here, 'fixtures', name), 'utf8');

describe('emit — components golden', () => {
  it('ComponentsEmitter.build() reproduces the golden from the fixture', () => {
    const snapshot = JSON.parse(fixture('figma-snapshot.json'));
    const primitives = JSON.parse(fixture('primitives.golden.json'));
    const semantics = JSON.parse(fixture('semantics.golden.json'));
    const out = DtcgFormatter.serialize(
      new ComponentsEmitter(snapshot, {
        components: ['Button', 'Chip', 'Tag'],
        primitives,
        semantics,
      }).build({})
    );
    expect(out).toEqual(fixture('components.golden.json'));
  });
});

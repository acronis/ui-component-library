import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { DtcgFormatter } from '../helpers/utils-dtcg-formatter.mjs';
import { PrimitivesEmitter } from '../helpers/emit-primitives-builder.mjs';

// Golden / characterization test for the primitives emit logic. `PrimitivesEmitter`
// is a pure function of the Figma snapshot (it reads no other tier and does not
// merge with the existing output), so `build()` is deterministic and testable in
// isolation. The fixture is a trimmed real snapshot (only the variable collections
// primitives reads — theme/font/units + text styles); the golden is the serialized
// tier `build()` produces from it. Any change to the emit logic that alters output
// fails here — the same-output guard for refactoring the emit pipeline.

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = (name) =>
  fs.readFileSync(path.join(here, 'fixtures', name), 'utf8');

describe('emit — primitives golden', () => {
  it('PrimitivesEmitter.build() reproduces the golden from the fixture snapshot', () => {
    const snapshot = JSON.parse(fixture('figma-snapshot.json'));
    const out = DtcgFormatter.serialize(
      new PrimitivesEmitter(snapshot).build()
    );
    expect(out).toEqual(fixture('primitives.golden.json'));
  });

  it('build() is pure — no file I/O, repeated calls are identical', () => {
    const snapshot = JSON.parse(fixture('figma-snapshot.json'));
    const emitter = new PrimitivesEmitter(snapshot);
    expect(DtcgFormatter.serialize(emitter.build())).toEqual(
      DtcgFormatter.serialize(emitter.build())
    );
  });
});

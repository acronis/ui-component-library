import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { DtcgFormatter } from '../helpers/utils-dtcg-formatter.mjs';
import { SemanticsEmitter } from '../helpers/emit-semantics-builder.mjs';

// Golden / characterization test for the semantics emit logic. SemanticsEmitter
// resolves aliases against the primitives tier, so `build()` takes the primitives
// as an injected input (the emitter's constructor param) — here the committed
// primitives golden — making it a pure, deterministic function of the fixture.
// `prev = {}` means no hand-authored $extensions to merge. Any change to the emit
// logic that alters output fails here.

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = (name) =>
  fs.readFileSync(path.join(here, 'fixtures', name), 'utf8');

describe('emit — semantics golden', () => {
  it('SemanticsEmitter.build() reproduces the golden from the fixture', () => {
    const snapshot = JSON.parse(fixture('figma-snapshot.json'));
    const primitives = JSON.parse(fixture('primitives.golden.json'));
    const out = DtcgFormatter.serialize(
      new SemanticsEmitter(snapshot, { primitives }).build({})
    );
    expect(out).toEqual(fixture('semantics.golden.json'));
  });
});

// Gate the demo screens by the RENDERED screen audit.
//
// Each screen with a committed `audit-snapshot.json` (captured from the running
// demo route via the probe — see packages/ui-react/__capture-fixtures template
// / the /screen-audit skill) is re-audited here in pure Node against its
// `screen.yaml`. Capture is a manual/local step (like VR baselines); this test
// runs on every CI without a browser — the snapshot is the seam. A `must`
// finding fails CI; regenerate the fixture after an intentional screen change.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as parseYaml } from 'js-yaml';
import { describe, expect, it } from 'vitest';

import { auditScreen, formatScreenReport } from '../screens/audit';
import type {
  ScreenDescriptorLite,
  ScreenSnapshot,
} from '../screens/audit/types';

const HERE = dirname(fileURLToPath(import.meta.url));
const SCREENS = resolve(HERE, '../screens');

function screensWithFixture(): string[] {
  return readdirSync(SCREENS)
    .filter(
      (s) =>
        statSync(join(SCREENS, s)).isDirectory() &&
        existsSync(join(SCREENS, s, 'audit-snapshot.json'))
    )
    .sort();
}

describe('committed screen-audit fixtures pass the rendered audit', () => {
  const list = screensWithFixture();

  it('has fixtures to audit', () => {
    expect(list.length).toBeGreaterThan(0);
  });

  for (const slug of list) {
    it(`${slug}: no must findings`, () => {
      const descriptor = parseYaml(
        readFileSync(join(SCREENS, slug, 'screen.yaml'), 'utf8')
      ) as ScreenDescriptorLite;
      const snapshot = JSON.parse(
        readFileSync(join(SCREENS, slug, 'audit-snapshot.json'), 'utf8')
      ) as ScreenSnapshot;
      const { active } = auditScreen(snapshot, descriptor);
      const must = active.filter((f) => f.severity === 'must');
      expect(must, formatScreenReport(active, slug)).toEqual([]);
    });
  }
});

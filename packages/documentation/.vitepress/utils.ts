import fs from 'node:fs';
import path from 'node:path';

export function getExampleDomains() {
  return fs
    .readdirSync(path.join(__dirname, '../../examples/demos'));
}

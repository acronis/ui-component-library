import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';

export function getExampleDomains() {
  return fs
    .readdirSync(path.join(__dirname, '../../examples/demos'));
}

export function getExampleDemos(domain: string) {
  return globSync(`../examples/demos/${domain}/**/*.vue`);
}

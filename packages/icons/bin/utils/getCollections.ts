import fs from 'node:fs';
import { pathCollections } from './paths.ts';

/**
 * Get collection names from the collections directory src/collections
 */
export async function getCollections() {
  return fs.readdirSync(pathCollections, {
    withFileTypes: true
  }).reduce((a: string[], c: fs.Dirent) => {
    c.isDirectory() && a.push(c.name);
    return a;
  }, []);
}

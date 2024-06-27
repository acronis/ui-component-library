#!/usr/bin/env node
import { getCollections } from './utils/getCollections.ts';
import { optimizeSvgDirectories } from './utils/optimizeSvgDirectories.ts';

const collections = await getCollections() || [
  'acronis',
  'acronis-web-icons',
  'constructor',
];

for (const collection of collections) {
  await optimizeSvgDirectories(`src/collections/${collection}`);
}

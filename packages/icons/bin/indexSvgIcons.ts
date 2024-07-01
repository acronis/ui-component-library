#!/usr/bin/env node
import { getCollections } from './utils/getCollections.ts';
import { generateEntryFile } from './utils/generateEntryFile.ts';

const collections = await getCollections();

// Ensure that files are generated before generating the entry file
for (const collection of collections) {
  await generateEntryFile(`src/collections/${collection}`, 'svg', 'I');
}

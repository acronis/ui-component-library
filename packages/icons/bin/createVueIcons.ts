#!/usr/bin/env node
import { generateVueIcons } from './utils/generateVueIcons.ts';
import { getCollections } from './utils/getCollections.ts';

const collections = await getCollections();

for (const collection of collections) {
  await generateVueIcons(`src/collections/${collection}`, `vue/${collection}`);
}

import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';

const pages = fs
  .readdirSync(path.join(__dirname, '../../../examples/demos'));

function getDemos(page) {
  return globSync(`../examples/demos/${page}/**/*.vue`);
}

export const examples = pages.map(page => ({
  text: page.toUpperCase(),
  link: `/examples/${page}`,
  collapsed: true,
  items: getDemos(page).map(demo => ({
    text: path.parse(demo).name,
    link: `/examples/${page}-${demo}`
  }))
}));

#!/usr/bin/env node
import fs from 'node:fs';
import process from 'node:process';
import path from 'node:path';
import {
  IconSet,
  exportJSONPackage,
  /* , execAsync */
} from '@iconify/tools';
import glob from 'fast-glob';
import { optimize } from 'svgo';
import yargs from 'yargs';

const { c: collection } = yargs(process.argv.slice(2))
  .default('c', 'acronis')
  .parse();

const icons = {};
const files = await glob(`src/collections/${collection}/**/*.svg`);

files.forEach((file) => {
  const data = fs.readFileSync(file, 'utf8');
  const extension = path.extname(file);
  const fileName = path.basename(file, extension);
  const viewBox = (/viewBox="([^"]+)"/.exec(data) || '')[1];
  const dimension = fileName.slice(-2);
  const [width, height] = collection === 'constructor' && viewBox ? viewBox.split(' ').slice(2) : [dimension, dimension];
  const result = optimize(data, {
    plugins: [
      'collapseGroups',
      'convertShapeToPath',
      'moveElemsAttrsToGroup',
      {
        name: 'removeAttrs',
        params: {
          attrs: ['path:fill', 'path:fill-rule'],
          elemSeparator: ':',
          preserveCurrentColor: false
        }
      }
    ],
    multipass: true,
    mergePaths: false
  }).data
    .replace(/<svg[^>]*>/g, '<g fill="currentColor">')
    .replace(/<\/svg>/g, '<\/g>')
    .replace(/#2668C5/g, 'currentColor');
  if (icons[fileName]) {
    console.error(`Duplicate icon name: ${fileName}. Please fix figma file`);
    icons[`${fileName}-duplicate-name`] = { body: result };
  }
  else {
    icons[fileName] = {
      body: result,
      ...(
        ((dimension && ['16', '24', '32'].includes(dimension)) || (width && height)) && {
          height: height || dimension,
          width: width || dimension
        })
    };
  }
});

// Import icon set
const iconSet = new IconSet({
  prefix: collection,
  icons
});

(async () => {
  // Target directory
  const target = `dist/iconify/${iconSet.prefix}`;

  // Export package
  await exportJSONPackage(iconSet, {
    target,
    package: {
      name: `@acronis-platform/icons/iconify/${iconSet.prefix}`,
      total: Object.keys(icons).length,
      version: '1.0.0',
      bugs: 'https://github.com/@acronis-platform/icons/issues',
      homepage: 'https://github.com/@acronis-platform/icons',
    },
    cleanup: true,
    /*
    customFiles: {
        'README.md': 'README!',
    },
    */
  });

  // Publish NPM package
  /*
  await execAsync('npm publish --access=public --silent', {
      cwd: target,
  });
  */
})();

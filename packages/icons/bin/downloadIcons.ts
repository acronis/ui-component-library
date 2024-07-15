import { promises } from 'node:fs';
import path from 'node:path';
import { downloadIcons } from '@acronis-platform/figma-fetcher';
import { toPascalCase } from './utils/toPascalCase.ts';

async function run() {
  const names = new Set<string>();
  const icons = new Map<string, string[]>();
  await downloadIcons({ onBeforeDownloadIcon, onDownloadedIcon });

  function onBeforeDownloadIcon(name: string) {
    const regex = /^\w/;

    if (!regex.test(name)) {
      console.error('Wrong icon name! ->', name);
      return false;
    }
    if (names.has(name)) {
      console.error('Duplicate icon name -> ', name);
      return false;
    }
    names.add(name);

    return true;
  }

  /**
   * Create a Vue component for each downloaded icon
   */
  async function onDownloadedIcon({
    content,
    pathname,
    iconsPathPrefix
  }: {
    content: string
    pathname: string
    iconsPathPrefix: string
  }) {
    const fileContent = `<template>${content}</template>`;
    const prefix = 'Icon';

    const idx = pathname.indexOf('-');
    const rootDirectory = path.join(iconsPathPrefix, pathname.substring(0, idx) || pathname);
    const fileName = `${prefix}${toPascalCase(pathname)}`;
    const file = path.resolve(rootDirectory, `${fileName}.vue`);
    const imagePath = path.join(rootDirectory, `${fileName}.svg`);

    await promises.mkdir(path.dirname(file), { recursive: true });
    await Promise.all([
      promises.writeFile(file, fileContent),
      promises.writeFile(imagePath, content, 'utf8'),
    ]);

    icons.set(rootDirectory, [...(icons.get(rootDirectory) || []), file]);
  }

  /*
   * Create a barrel file for each directory with icons
   */
  for (const directory of icons.keys()) {
    const barrel = path.join(path.dirname(directory), `${path.basename(directory)}.ts`);
    // const barrelDTs = path.join(path.dirname(directory), `${path.basename(directory)}.d.ts`);
    let fileContent = '';
    for (const icon of icons.get(directory)!) {
      const directoryName = path.dirname(icon);
      const parentFolder = path.basename(directoryName);
      const fileName = path.basename(icon);

      const result = path.join(parentFolder, fileName);
      fileContent = `${fileContent ? `${fileContent}` : ''}export { default as ${path.parse(icon).name} } from './${result}';\n`;
    }
    await Promise.all([
      promises.writeFile(barrel, fileContent),
      // promises.writeFile(barrelDTs, fileContent),
    ]);
  }
}

run();

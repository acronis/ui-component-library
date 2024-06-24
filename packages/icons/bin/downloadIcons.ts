import { promises } from 'node:fs';
import path from 'node:path';
import { downloadIcons } from '@acronis-platform/figma-fetcher';
import { toPascalCase } from './utils/toPascalCase.ts';

async function run() {
  await downloadIcons({ onDownloadedIcon });

  /**
   * Create a Vue component for each downloaded icon
   */
  async function onDownloadedIcon({ content, pathname }: { content: string, pathname: string }) {
    const fileContent = `<template>${content}</template>`;
    const file = path.resolve('vue', `${toPascalCase(pathname)}.vue`);

    await promises.mkdir(path.dirname(file), { recursive: true });
    await promises.writeFile(file, fileContent);
  }
}

run();

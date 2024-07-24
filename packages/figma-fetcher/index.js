import { promises } from 'node:fs';
import path from 'node:path';
import { compileTemplate, parse } from '@vue/compiler-sfc';
import { toPascalCase } from './utils/toPascalCase.js';
import { downloadIcons } from './src/downloadIcons.js';

async function run() {
  const names = new Set();
  const icons = new Map();
  await downloadIcons({ onBeforeDownloadIcon, onDownloadedIcon });

  function onBeforeDownloadIcon(name) {
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
    vueFolder,
    publicFolder,
  }) {
    const fileContent = `<template>${content}</template>`;
    let fileContentJs = '';
    const fileContentDTs = `declare const _default: import("vue").DefineComponent<{}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}, {}>;
export default _default;
`;
    const prefix = 'Icon';
    const { descriptor } = parse(fileContent);

    const idx = pathname.indexOf('-');
    const publicDirectory = path.join(publicFolder, pathname.substring(0, idx) || pathname);
    const fileName = `${prefix}${toPascalCase(pathname)}`;
    const fileVue = path.resolve(vueFolder, `${fileName}.vue`);
    const fileVueDTs = path.resolve(vueFolder, `${fileName}.d.ts`);
    const fileJs = path.resolve(vueFolder, `${fileName}.js`);
    const imagePath = path.join(publicDirectory, `${fileName}.svg`);

    if (descriptor.template) {
      fileContentJs = compileTemplate({
        source: descriptor.template.content,
        filename: fileVue // filename is important for source-map support
      }).code;
    }

    await promises.mkdir(path.dirname(fileVue), { recursive: true });
    await promises.mkdir(path.dirname(imagePath), { recursive: true });
    await Promise.all([
      promises.writeFile(fileVue, fileContent),
      promises.writeFile(fileVueDTs, fileContentDTs),
      promises.writeFile(fileJs, fileContentJs),
      promises.writeFile(imagePath, content, 'utf8'),
    ]);

    icons.set(publicDirectory, [...(icons.get(publicDirectory) || []), fileVue]);
  }

  /*
   * Create a barrel file for each directory with icons
   */
  for (const directory of icons.keys()) {
    const barrel = path.join(path.dirname(directory), `${path.basename(directory)}.js`);
    const barrelDTs = path.join(path.dirname(directory), `${path.basename(directory)}.d.ts`);
    let fileContent = '';
    for (const icon of icons.get(directory)) {
      const directoryName = path.dirname(icon);
      const parentFolder = path.basename(directoryName);
      const fileName = path.basename(icon);

      const result = path.join(parentFolder, fileName);
      fileContent = `${fileContent ? `${fileContent}` : ''}export { default as ${path.parse(icon).name} } from '../${result}';\n`;
    }
    await Promise.all([
      promises.writeFile(barrel, fileContent),
      promises.writeFile(barrelDTs, fileContent),
    ]);
  }
}

run();

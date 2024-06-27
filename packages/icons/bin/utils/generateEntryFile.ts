import path from 'node:path';
import fs from 'node:fs';
import chalk from 'chalk';
import glob from 'fast-glob';
import { format } from 'prettier';
import { camelCase, startCase } from 'lodash-es';

/**
 * Generates an entry file for a given directory.
 *
 * @param inputDir
 * @param {string} [fileType] - The type of files to include in the entry file.
 * @param {string} [prefix] - The prefix to add to the exported names.
 * @param {boolean} withGroups - Whether to generate group files.
 * @returns {Promise<void>} - A Promise that resolves when the entry file has been written.
 */
export async function generateEntryFile(inputDir: string, fileType = 'svg', prefix = 'I', withGroups = false) {
  console.info(chalk.blue('Generating entry file...', inputDir));

  // Get all files of the specified type in the directory
  const files = await glob(`${inputDir}/**/*.${fileType}`);
  const fileNames = new Set();
  const groupExports = new Map();
  const iconGroupsExports: string[] = [];
  const iconTypeExports: string[] = [];
  console.log(`${inputDir}/**/*.${fileType}`, chalk.green(files.length), 'files');

  const iconExports = files
    .map((file) => {
      const { name, dir } = path.parse(file);
      const groupName = dir.split('/').pop();

      let fileName = `${prefix}${startCase(camelCase(name)).replace(/ /g, '')}`;
      if (fileNames.has(fileName)) {
        console.error(chalk.red('Duplicate file name:'), fileName);

        fileName = `${fileName}Duplicate`;
      }

      const exportString = `export { default as ${fileName} } from './${path.relative(inputDir, file)}'`;
      const exportGroupString = `export { default as ${fileName} } from './${path.relative(`${inputDir}/${groupName}`, file)}'`;
      iconTypeExports.push(`export const ${fileName}: SvgIcon\n`);

      fileNames.add(fileName);
      groupExports.set(
        groupName,
        [...(groupExports.get(groupName) || []), exportGroupString]
      );

      return exportString;
    });

  if (withGroups) {
    iconGroupsExports.push(`export const ICON_GROUPS = [${[...groupExports.keys()].map(g => `'${g}'`).join(', ')} ];`);
    for (const groupName of groupExports.keys()) {
      const groupExportsList = groupExports.get(groupName).sort();
      const groupCode = await format(
        groupExportsList.join('\n'),
        { parser: 'typescript', semi: true, singleQuote: true }
      );

      saveGroup(groupCode, groupName, inputDir, groupExportsList.length);
    }
  }

  const code = await formatCode([
    ...iconExports,
    ...iconGroupsExports
  ].join('\n'));

  saveEntry(code, inputDir);

  saveTypes(iconTypeExports.join('\n'), inputDir);
}

async function formatCode(code: string) {
  return await format(code, { parser: 'typescript', semi: true, singleQuote: true });
}

function saveGroup(groupCode: string, groupName: string, inputDir: string, numberOfIcons: number) {
  fs.writeFileSync(path.resolve(inputDir, groupName, 'public.ts'), groupCode, 'utf8');

  console.log(chalk.green(`Created new group file with ${numberOfIcons} icons:`), path.resolve(inputDir, groupName, 'public.ts'));
}

function saveEntry(code: string, inputDir: string) {
  fs.writeFileSync(path.resolve(inputDir, 'public.ts'), code, 'utf8');

  console.log(chalk.green('Created new entry file:'), path.resolve(inputDir, 'public.ts'));
}

async function saveTypes(typesCode: string, rootDir: string) {
  fs.writeFileSync(
    path.resolve(rootDir, 'index.d.ts'),
    await formatCode(`
    declare module '@acronis-platform/icons' {
      import type {
        AllowedComponentProps,
        ComponentCustomProps,
        ComponentOptionsMixin,
        DefineComponent,
        ExtractPropTypes,
        VNodeProps
      } from 'vue';
      
      type SvgIcon = DefineComponent<
        NonNullable<unknown>,
        NonNullable<unknown>,
        NonNullable<unknown>,
        NonNullable<unknown>,
        NonNullable<unknown>,
        ComponentOptionsMixin,
        ComponentOptionsMixin,
        NonNullable<unknown>,
        string,
        VNodeProps & AllowedComponentProps & ComponentCustomProps,
        Readonly<ExtractPropTypes<NonNullable<unknown>>>,
        NonNullable<unknown>
      >
      ${typesCode}
    }

    export {}
    `),
    'utf-8'
  );
}

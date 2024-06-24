import path from 'node:path';
import fs from 'node:fs';
import chalk from 'chalk';
import glob from 'fast-glob';
import { format } from 'prettier';
import { kebabCase } from 'lodash-es';
import { checkingDirectories } from './checkingDirectories.ts';
import { renameNumbers } from './renameNumbers.ts';
import { toPascalCase } from './toPascalCase.ts';

export async function generateVueIcons(fromDir: string, toDir: string) {
  console.info(chalk.blue('Converting SVG to Vue components...'));

  await checkingDirectories(toDir);

  const icons = await glob(`${fromDir}/**/*.svg`);
  const groupExports = new Map();

  console.log('Icons: ', icons.length);

  for (const file of icons) {
    const { name, dir } = path.parse(file);
    const dirLastSegment = dir.split('/').pop();
    const nameFirstSegment = kebabCase(name).split('-')[0];
    const groupName = groupExports.get(dirLastSegment)?.length > 10 ? nameFirstSegment : dirLastSegment;

    const fileName = `${toPascalCase(renameNumbers(name)).replace(/ /g, '')}`;
    const svgData = fs.readFileSync(file, 'utf8');
    const fileContent = await format(`
      <script lang="ts">
        import { defineComponent, markRaw } from 'vue'
        
        export default defineComponent(markRaw({ name: '${fileName}' }))
      </script>
      
      <template>${svgData}</template>
      `, { parser: 'vue', semi: true, singleQuote: true, vueIndentScriptAndStyle: true });
    groupExports.set(
      groupName,
      [...(groupExports.get(groupName) || []), fileName]
    );

    fs.mkdir(`${toDir}/${groupName}`, { recursive: true }, function (err) {
      if (err) {
        console.error(chalk.red(err));
      }

      fs.writeFileSync(`${toDir}/${groupName}/${fileName}.vue`, fileContent);
    });
  }
}

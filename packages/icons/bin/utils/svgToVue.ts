import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { format } from 'prettier';
import { pathComponents } from './paths.ts';
import { toPascalCase } from './toPascalCase.ts';

export async function svgToVue(file: string) {
  const template = await readFile(file, 'utf-8');
  let name = path.basename(file).replace('.svg', '');
  name = toPascalCase(name);
  const code = await format(
        `
    import { createSvgIcon, withInstall } from '../utils';
    import type { SFCWithInstall } from '../utils';
    const ${name} = createSvgIcon('${template}');
    export default withInstall(${name}, '${name}') as SFCWithInstall<typeof ${name}>;
    `,
        { parser: 'typescript', semi: false, singleQuote: true },
  );

  await writeFile(path.resolve(pathComponents, `${name}.ts`), code, 'utf-8');
}

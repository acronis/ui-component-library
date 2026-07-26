import type { Config } from 'prettier';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

import { fileURLToPath } from 'node:url';

// TODO fix rootdir lookup
export const rootDir = resolve(fileURLToPath(import.meta.url), '../../../..');

export const prettierConfig: Config = {
  printWidth: 100,
  arrowParens: 'always',
  bracketSpacing: true,
  endOfLine: 'lf',
  bracketSameLine: false,
  quoteProps: 'as-needed',
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none',
  useTabs: false,
  vueIndentScriptAndStyle: false,
  overrides: [
    {
      files: '*.md',
      options: {
        embeddedLanguageFormatting: 'off'
      }
    }
  ]
};

export const componentsDir = resolve(rootDir, 'ui/src/components');

export const components = readdirSync(componentsDir).filter((f) => {
  const path = resolve(componentsDir, f);

  if (!statSync(path).isDirectory()) {
    return false;
  }

  return existsSync(`${path}/index.ts`);
});

import type { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

export function buildCssPlugin(): Plugin {
  const stylesPath = path.join('src', 'styles', 'themes');
  const themes = fs.readdirSync(stylesPath).map((theme) => {
    return [`styles/themes/${theme}`, path.join(stylesPath, theme, `${theme}.pcss`)];
  });
  const entry = {
    'styles/reset': path.join('src', 'styles', 'reset.css'),
    ...Object.fromEntries(themes)
  };

  return {
    name: 'build-css-plugin',
    config() {
      return {
        build: {
          lib: {
            entry
          },
          rollupOptions: {
            output: {
              assetFileNames(chunkInfo) {
                if (chunkInfo.name?.startsWith('styles/')) {
                  return chunkInfo.name;
                }

                return '[name][extname]';
              },
            },
          },
        },
      };
    },
  };
}

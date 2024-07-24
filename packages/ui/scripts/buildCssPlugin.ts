import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

export function buildCssPlugin(): Plugin {
  const stylesPath = path.join('src', 'styles', 'public');
  const styles = fs.readdirSync(stylesPath);
  const entry = Object.fromEntries(styles.map((style) => {
    return [`styles/${style.replace('.css', '')}`, path.join(stylesPath, style)];
  }));

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

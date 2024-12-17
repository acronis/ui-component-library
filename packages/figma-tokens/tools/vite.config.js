import path from 'node:path';
import vue from '@vitejs/plugin-vue';
import { viteSingleFile } from 'vite-plugin-singlefile';

/**
 * Resolves a path into an absolute path relative to the current directory
 *
 * @param {...string} file – path to file
 * @return {string}
 */
export function resolve(...file) {
  return path.resolve(__dirname, '..', ...file);
}

/**
 * Returns Vite config
 *
 * @param {import('rollup').InputOption} input
 * @return {import('vite').UserConfigFnObject}
 */
export function getViteConfig(input) {
  return function getConfig({ mode }) {
    const isDevelopment = mode === 'development';

    return {
      root: resolve('src'),

      build: {
        // do not remove "dist" directory before build because we build main and ui separately
        emptyOutDir: false,

        // do not minify scrips in case of development
        minify: !isDevelopment,

        // do not add Vite module loader because of Electron 25 (Chrome 114)
        polyfillModulePreload: false,

        rollupOptions: {
          input,

          output: {
            dir: resolve('dist'),
            entryFileNames: '[name].js',
            format: 'es',
          },
        },
      },

      resolve: {
        alias: {
          '@': resolve('src'),
        },
      },

      plugins: [
        vue(),
        viteSingleFile(),
      ],
    };
  };
}

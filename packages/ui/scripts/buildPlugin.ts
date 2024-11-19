import type { Plugin } from 'vite';
import path from 'node:path';
import nodeExternals from 'rollup-plugin-node-externals';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import { buildCssPlugin } from './buildCssPlugin';

export function buildPlugin(): Plugin[] {
  return [
    { ...(nodeExternals() as Plugin), enforce: 'pre' },
    libInjectCss(),
    buildPluginMain(),
    buildCssPlugin(),
    dts({
      include: [
        'src',
        'types',
        'types.d.ts'
      ],
      exclude: [
        'node_modules',
        'src/**/*.spec.ts',
        'src/**/*.cy.ts',
        'src/components/*/tests'
      ],
      outDir: 'dist',
      insertTypesEntry: true,
      compilerOptions: {
        sourceMap: false,
        paths: {
          '@/*': ['./src/*'],
        }
      },
      copyDtsFiles: true,
      pathsToAliases: false
    }),
  ];

  function buildPluginMain(): Plugin {
    return {
      name: 'build-plugin',
      apply: 'build',
      config() {
        return {
          build: {
            outDir: 'dist',
            sourcemap: true,
            lib: {
              entry: {
                index: 'src/index.ts',
              },
              formats: ['es'],
              name: 'Acronis Ui Component Library',
            },
            rollupOptions: {
              output: {
                manualChunks(id) {
                  const relativeId = path.relative('', id);

                  // every ts/vue file produce a chunk
                  if (
                    !relativeId.startsWith('src')
                    || relativeId.includes('?')
                    || (!relativeId.endsWith('.ts') && !relativeId.endsWith('.vue'))
                  ) { return null; }

                  return relativeId.replace('src/', '').replace('.ts', '').replace('.vue', '');
                },
                chunkFileNames: '[name].[hash].js',
                assetFileNames: 'assets/[name][extname]'
              }
            },
            chunkSizeWarningLimit: 10000
          }
        };
      }
    };
  }
}

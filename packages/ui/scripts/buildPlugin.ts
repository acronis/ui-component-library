import path from 'node:path';
import nodeExternals from 'rollup-plugin-node-externals';
import type { Plugin } from 'vite';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import dts from 'vite-plugin-dts';
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
          '@/*': ['./*'],
          'vue-router': ['node_modules/vue-router'],
          'csstype': ['node_modules/csstype']
        }
      },
      copyDtsFiles: true,
      pathsToAliases: false,
      aliasesExclude: [/^@ui-kit\/(services|hooks|config)/]
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
            // TODO remove
            minify: false,
            lib: {
              entry: {
                index: 'src/index.ts',
                button: 'src/components/button/public.ts',
              },
              formats: ['es'],
              name: 'UiKit',
            },
            rollupOptions: {
              // treeshake: {
              //   // TODO Check if we can remove this
              //   moduleSideEffects(id) {
              //     // make .css imports as side effect to prevent rollup remove them from bundle
              //     return id.endsWith('.css');
              //   },
              // },
              output: {
                // globals: ['vue'],
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
                chunkFileNames: 'chunks/[name].[hash].js',
                assetFileNames: 'assets/[name][extname]',
              },
              external: ['vue']
            },
            chunkSizeWarningLimit: 10000
          }
        };
      }
    };
  }
}

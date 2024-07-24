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
            lib: {
              entry: {
                'index': 'src/index.ts',
                // TODO add more entries
                'button': 'src/components/button/public.ts',
                'components/buttonGroup': 'src/components/button-group/public.ts',
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

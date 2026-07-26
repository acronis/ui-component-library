import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import process from 'node:process';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import comp from 'unplugin-vue-components/vite';
import Inspect from 'vite-plugin-inspect';
import autoprefixer from 'autoprefixer';
import { kebabCase } from 'lodash-es';
import postcssMixins from 'postcss-mixins';

if (!process.env.TARGET && process.env.THEME !== 'true') {
  throw new Error('Target component must be specified.');
}

const target = process.env.TARGET;
const demos = process.env.DEMOS;
const port = Number.parseInt(process.env.PORT || '') || 8008;
const componentsDir = resolve(__dirname, '../ui/src/components');
const directivesDir = resolve(__dirname, '../ui/src/directives');
const typography = [
  'Title',
  'Text',
  'Blockquote',
  'OL',
  'UL',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'P',
  'Strong'
];

export default defineConfig(async () => {
  const components: string[] = [];
  const directives: string[] = [];

  const results = await Promise.all([readdir(componentsDir), readdir(directivesDir)]);

  await Promise.all([
    ...results[0].map(async (f) => {
      const path = resolve(componentsDir, f);

      if ((await stat(path)).isDirectory() && existsSync(`${path}/public.ts`)) {
        components.push(f);
      }
    }),
    ...results[1].map(async (f) => {
      const path = resolve(directivesDir, f);

      if ((await stat(path)).isDirectory() && existsSync(`${path}/index.ts`)) {
        directives.push(f);
      }
    })
  ]);

  return {
    publicDir: '../documentation/public',
    define: {
      __TARGET__: JSON.stringify(target),
      __DEMOS__: demos,
      __VERSION__: JSON.stringify('*'),
      __THEME__: JSON.stringify(process.env.THEME === 'true'),
      __PORT__: JSON.stringify(port)
    },
    resolve: {
      alias: [
        { find: /^@\/(.+)/, replacement: resolve(__dirname, '../ui/src/$1') },
        {
          find: /^@acronis-platform\/(utils|configs)/,
          replacement: resolve(__dirname, '../$1/src')
        },
        { find: /^@acronis-platform\/ui-component-library$/, replacement: resolve(__dirname, '../ui/src/index.ts') }
      ]
    },
    server: {
      port,
      fs: {
        allow: ['..']
      }
    },
    optimizeDeps: {
      include: ['../ui/src/components']
    },
    css: {
      postcss: {
        plugins: [
            autoprefixer,
          postcssMixins()
        ]
      }
    },
    plugins: [
      vue(),
      Inspect(),
      comp({
        dts: false,
        resolvers: [
          {
            type: 'component',
            resolve: (name) => {
              const kebabName = typography.includes(name) ? 'typography' : kebabCase(name);

              if (components.includes(kebabName)) {
                return {
                  name,
                  from: `@/components/${kebabName}/public.ts`
                };
              }
            }
          },
          {
            type: 'directive',
            resolve: (name) => {
              const kebabName = kebabCase(name);

              if (directives.includes(kebabName)) {
                return {
                  name: `v${name}`,
                  from: `@/directives/${kebabName}/public.ts`
                };
              }
            }
          }
        ],
        exclude: ['../components/**']
      })
    ]
  };
});

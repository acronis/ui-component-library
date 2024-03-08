import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import svgLoader from 'vite-svg-loader';
import Container from 'markdown-it-container';
import markdown from 'vite-plugin-vue-markdown';
import eslintPlugin from 'vite-plugin-eslint';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'node_modules'),
      '~highlight.js': 'highlight.js',
      '@': path.resolve(__dirname, 'src'),
      demo: path.resolve(__dirname, 'demo'),
      examples: path.resolve(__dirname, 'examples'),
      packages: path.resolve(__dirname, 'packages'),
      types: path.resolve(__dirname, 'types'),
      themes: path.resolve(__dirname, 'themes'),
      colors: path.resolve(__dirname, 'colors'),
      icons: path.resolve(__dirname, 'icons'),
      '@uikit/ui-kit': path.resolve(__dirname, '')
    }
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  plugins: [
    eslintPlugin(),
    cssInjectedByJsPlugin(),
    markdown({
      // A function providing the Markdown It's instance
      // gets the ability to apply custom settings/plugins
      markdownItSetup(md) {
        // for example
        md.use(Container, 'details', {
          render: (tokens, idx) => {
            const token = tokens[idx];
            const info = token.info.trim().slice('details'.length).trim();
            if (token.nesting === 1) {
              const title = md.renderInline(info || 'Details');

              return `<details class="details custom-block"><summary>${title}</summary>\n`;
            }
            return '</details>\n';
          },
        });
      },
    }),
    nodePolyfills(),
    svgLoader(),
    vue({
      include: [/\.vue$/, /\.md$/]
    }),
    vueJsx()
  ],
  build: {
    outDir: 'lib',
    lib: {
      entry: path.resolve(__dirname, 'src/main.js'),
      name: 'Acronis UI Component Library',
      fileName: (format) => `ui-kit.${format}.js`,
      formats: ['es']
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        },
        chunkFileNames: 'static/js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          let extType = assetInfo?.name?.split('.').pop() || 'chunk';

          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'images';
          } else if (/css|sass|scss/i.test(extType)) {
            extType = 'styles';
          } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
            extType = 'fonts';
          }

          return `static/${extType}/[name].[hash].[ext]`;
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: ['node_modules', 'examples'],
    coverage: {
      enabled: true,
      reporter: [[
        'lcov', { 'projectRoot': 'packages' }
      ]],
      provider: 'v8',
      reportsDirectory: 'test/result',
      lines: 20,
      functions: 20,
      branches: 20,
      statements: 20
    },
  }
});

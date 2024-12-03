import * as path from 'node:path';
import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/build.js'),
      // formats: ['es', 'umd'],
      name: 'figma-ds-vue-plugin',
      filename: 'figma-ds-vue-plugin',
    },
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    copyPublicDir: false,
    assetsInlineLimit: 8192,
    sourcemap: true,
    manifest: true,
    rollupOptions: {
      external: ['vue'],
      treeshake: 'safest',
      // input: {
      //   index: resolve(__dirname, 'src/build.js')
      // },
      output: {
        globals: {
          vue: 'Vue',
        },
        dir: 'dist',
        exports: 'named',
        entryFileNames: 'figma-ds-vue-plugin.[format].js',
        chunkFileNames: 'js/[name].[hash].[format].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'figma-ds-vue-plugin.css';
          }

          return assetInfo.name;
        }
      }
    }
  },
  plugins: [vue()],
});

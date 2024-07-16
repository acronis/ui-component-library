import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import glob from 'fast-glob';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src'],
      // rollupTypes: true
    })
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    emptyOutDir: true,
    lib: {
      name: 'Acronis Ui Icons',
      entry: glob.sync(resolve(__dirname, 'src/collections/**/*.ts')),
      formats: ['es'],
      fileName: (format, name) => `${name}.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      output: {
        preserveModules: true,
      },
      external: ['vue'],
      // output: [
      //   {
      //     format: 'cjs',
      //     preserveModules: true,
      //     preserveModulesRoot: resolve(__dirname, 'vue'),
      //     dir: 'dist/lib',
      //     entryFileNames: '[name].js'
      //   },
      //   {
      //     format: 'es',
      //     preserveModules: true,
      //     preserveModulesRoot: resolve(__dirname, 'vue'),
      //     dir: 'dist/es',
      //     entryFileNames: '[name].mjs'
      //   }
      // ],
    }
  },
});

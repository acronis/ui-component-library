import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['vue'],
      rollupTypes: true
    })
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    emptyOutDir: false,
    minify: false,
    lib: {
      name: 'UiKitIcons',
      entry: resolve(__dirname, 'vue/public.ts')
    },
    rollupOptions: {
      input: [resolve(__dirname, 'vue/public.ts')],
      external: ['vue'],
      output: [
        {
          format: 'cjs',
          preserveModules: true,
          preserveModulesRoot: resolve(__dirname, 'vue'),
          dir: 'dist/lib',
          entryFileNames: '[name].js'
        },
        {
          format: 'es',
          preserveModules: true,
          preserveModulesRoot: resolve(__dirname, 'vue'),
          dir: 'dist/es',
          entryFileNames: '[name].mjs'
        }
      ],
    }
  },
});

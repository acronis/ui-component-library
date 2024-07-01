import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue()
  ],
  build: {
    sourcemap: false,
    emptyOutDir: false,
    minify: false,
    rollupOptions: {
      external: ['vue'],
      output: {
        dir: 'demo',
        chunkFileNames: '[name].js',
        assetFileNames: 'assets/[name][extname]'
      },
    },
    lib: {
      name: 'UiKitIconsDemo',
      entry: 'demo/main.ts',
      formats: ['es']
    },
  },
});

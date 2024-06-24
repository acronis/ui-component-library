import type { UserConfigFn } from 'vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(() => {
  return {
    build: {
      sourcemap: true,
      lib: {
        entry: 'src/index.ts',
        formats: ['cjs', 'es'],
        fileName: format => `index.${format === 'es' ? 'mjs' : 'cjs'}`
      },
      rollupOptions: {
        external: ['@vue', 'vue']
      }
    },
    plugins: [
      dts({ rollupTypes: true })
    ],
  };
}) as UserConfigFn;

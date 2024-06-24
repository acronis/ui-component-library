/// <reference types="vitest" />

// Configure Vitest (https://vitest.dev/config/)

import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  resolve: {
    alias: {
      // polyfills
      Buffer: 'vite-compatible-readable-buffer',
      stream: 'vite-compatible-readable-stream',
      util: 'rollup-plugin-node-polyfills/polyfills/util',
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'index.js'),
      name: 'figma-fetcher',
      // the proper extensions will be added
      fileName: 'figma-fetcher',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
      plugins: [
        // Enable rollup polyfills plugin
        // used during production bundling
        nodePolyfills(),
      ],
    },
  },
  test: {
    // globals: true,
  },
});

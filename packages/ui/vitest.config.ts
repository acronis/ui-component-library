import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import { configDefaults, defineConfig } from 'vitest/config';

const rootDir = __dirname;

export default defineConfig({
  root: rootDir,
  resolve: {
    alias: {
      '@': resolve(rootDir, 'src'),
      'vue': 'vue/dist/vue.esm-bundler.js',
      '@vue/runtime-dom': '@vue/runtime-dom/dist/runtime-dom.esm-bundler.js',
    },
  },
  test: {
    include: [
      'src/components/**/*.spec.{ts,tsx}',
      'src/widgets/**/*.spec.{ts,tsx}',
      'src/composables/**/*.spec.{ts,tsx}',
      'src/directives/**/*.spec.{ts,tsx}',
      'src/plugins/**/*.spec.{ts,tsx}',
    ],
    globals: true,
    environment: 'jsdom',
    clearMocks: true,
    setupFiles: [
      resolve(rootDir, 'scripts/testSetup.ts'),
      './vitest.setup.ts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html', 'json', 'lcov'],
      reportsDirectory: './test/coverage',
      reportOnFailure: true,
      thresholds: {
        statements: 40,
        branches: 50,
        functions: 5,
        lines: 40,
      },
      extension: ['ts', 'tsx', 'vue'],
      exclude: [
        ...configDefaults.coverage.exclude || [],
        '**/scripts/**',
      ],
    },
    testTimeout: 10000
  },
  plugins: [vue()],
});

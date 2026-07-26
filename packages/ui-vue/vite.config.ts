import type { UserConfigFn } from 'vite';
import { resolve } from 'node:path';
import { env } from 'node:process';
import vue from '@vitejs/plugin-vue';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { buildPlugin } from './scripts/buildPlugin';

export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    plugins: [
      vue(),
      env.UI_BUILD && buildPlugin(),
      env.VITE_REPORT && visualizer({ filename: 'reports/stats.html', template: 'treemap' }) // sunburst, treemap, network, raw-data, list
    ]
  };
}) as UserConfigFn;

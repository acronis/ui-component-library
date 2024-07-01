import { env } from 'node:process';
import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import type { UserConfigFn } from 'vite';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { buildPlugin } from './scripts/buildPlugin.ts';

export default defineConfig(() => {
  const isUiBuild = !!env.UI_BUILD;

  return {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@documentation': resolve(__dirname, '../../documentation'),
      },
    },
    optimizeDeps: {
      exclude: ['vitest/utils'],
      include: ['@vitest/utils'],
    },
    plugins: [
      vue(),
      vueJsx(),
      isUiBuild && buildPlugin(),
      env.VITE_REPORT && visualizer({ filename: 'reports/stats.html', template: 'treemap' }) // sunburst, treemap, network, raw-data, list
    ]
  };
}) as UserConfigFn;

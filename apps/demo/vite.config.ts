import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import svgr from 'vite-plugin-svgr';

// Custom plugin to resolve @/ imports based on the importing file's location
const resolveAtAlias = (): Plugin => ({
  name: 'resolve-at-alias',
  async resolveId(source, importer) {
    if (source.startsWith('@/') && importer) {
      const fs = await import('fs');
      const extensions = [
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
        '.mjs',
        '.mts',
        '.css',
        '.scss',
      ];

      // Determine base path based on importer location (normalize separators for Windows)
      const normalizedImporter = importer.replace(/\\/g, '/');
      const isFromDemos = normalizedImporter.includes('/demos/src/');
      const basePath = isFromDemos
        ? source.replace('@/', '../demos/src/')
        : source.replace('@/', './src/');
      const baseResolved = resolve(__dirname, basePath);

      // If source already has an extension, try it directly
      if (extensions.some((ext) => source.endsWith(ext))) {
        if (fs.existsSync(baseResolved)) {
          return baseResolved;
        }
      }

      // Try with each extension
      for (const ext of extensions) {
        const fullPath = baseResolved + ext;
        if (fs.existsSync(fullPath)) {
          return fullPath;
        }
      }

      // Try as directory with index file
      for (const ext of extensions) {
        const indexPath = resolve(baseResolved, 'index' + ext);
        if (fs.existsSync(indexPath)) {
          return indexPath;
        }
      }
    }
    return null;
  },
});

export default defineConfig(({ mode }) => ({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    react(),
    resolveAtAlias(),
    svgr({
      svgrOptions: {
        exportType: 'default',
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: '**/*.svg?react',
    }),
  ],
  resolve: {
    dedupe: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
    ],
    alias: {
      // Consume the shared demos package from source (HMR); its own imports of
      // @constructor-lab/ui-react resolve via node_modules.
      '@constructor-lab/ui-kit-demos': resolve(__dirname, '../demos/src'),
    },
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
  },
  server: {
    port: 3000,
    // Fail loudly if 3000 is taken instead of hopping to 3001+ — otherwise the
    // demo silently steals the docs' port (docs runs on 3001) and opening it
    // shows the demo. See apps/docs/AGENTS.md.
    strictPort: true,
    open: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
}));

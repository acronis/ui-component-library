import path from 'node:path';
import postcssMixins from 'postcss-mixins';
import svgLoader from 'vite-svg-loader';

export const vite = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../../ui/src'),
    }
  },
  plugins: [
    svgLoader({
      svgoConfig: {
        plugins: [
          'preset-default',
          'removeDimensions'
        ]
      }
    }),
  ],
  css: {
    postcss: {
      plugins: [
        postcssMixins()
      ]
    }
  }
};

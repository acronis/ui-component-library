import path from 'node:path';
import postcssMixins from 'postcss-mixins';

export const vite = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../../ui/src'),
    }
  },
  css: {
    postcss: {
      plugins: [
        postcssMixins()
      ]
    }
  }
};

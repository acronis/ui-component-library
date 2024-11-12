import path from 'node:path';
import postcssMixins from 'postcss-mixins';

export const vite = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../../ui/src'),
      'components': path.join(__dirname, '../../components'),
      '@demos': path.join(__dirname, '../../../examples/demos'),
      '@examples': path.join(__dirname, '../../../examples'),
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

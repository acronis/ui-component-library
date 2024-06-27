import path from 'node:path';

export const vite = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../../ui/src'),
      'components': path.resolve(__dirname, '../../components'),
      'demos': path.resolve(__dirname, '../../demos')
    }
  }
};

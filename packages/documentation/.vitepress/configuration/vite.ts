import path from 'node:path';

export const vite = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../../ui/src'),
      'components': path.join(__dirname, '../../components'),
      '@demos': path.join(__dirname, '../../../examples/demos'),
      '@examples': path.join(__dirname, '../../../examples'),
    }
  }
};

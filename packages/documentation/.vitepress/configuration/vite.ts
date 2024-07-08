import path from 'node:path';
import process from 'node:process';

const isProd = process.env.NODE_ENV === 'production';

export const vite = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../../ui/src'),
      ...(!isProd && {
        '@acronis-platform/ui-component-library': path.resolve(__dirname, '../../../ui/src')
      }),
      'components': path.resolve(__dirname, '../../components'),
      'demos': path.resolve(__dirname, '../../demos')
    }
  }
};

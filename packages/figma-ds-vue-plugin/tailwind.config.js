// eslint-disable-next-line import/no-extraneous-dependencies
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    './docs/.vitepress/**/*.{js,ts,vue}',
    './docs/**/*.md',
  ],
  theme: {
    extend: {
      colors: {
        ui: {
          background: 'var(--color-ui-background)',
          sidebar: 'var(--color-ui-sidebar)',
          typo: 'var(--color-ui-typo)',
          primary: 'var(--color-ui-primary)',
          border: 'var(--color-ui-border)'
        }
      },
      spacing: {
        sm: '24rem'
      },
      screens: {
        xxl: '1400px'
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans]
      }
    },
    container: {
      center: true,
      padding: '1rem'
    }
  },
};

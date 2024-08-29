// eslint-disable-next-line node/prefer-global/process
const isProd = process.env.NODE_ENV === 'production';

export const styleguide = isProd
  ? []
  : [
      { text: 'Guide - Accessibility', link: '/styleguide/accessibility' },
      { text: 'Guide - Composition API', link: '/styleguide/composable' },
      { text: 'Guide - Test', link: '/styleguide/test' },
      { text: 'Guide - Vue', link: '/styleguide/vue' },
      { text: 'Guide - Notes', link: '/styleguide/notes' },
    ];

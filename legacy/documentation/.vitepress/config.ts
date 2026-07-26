import type { UserConfig } from 'vitepress';
import { defineConfig } from 'vitepress';
import { nav, sidebar, vite } from './configuration';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Acronis UI Component Library',
  description: 'UI Components library for Vue.js 3',
  base: '/ui-component-library/',
  head: [['link', { rel: 'icon', href: '/ui-component-library/ui-kit.svg' }]],
  // hide dark mode switch
  appearance: false,
  // https://vitepress.dev/reference/default-theme-config
  themeConfig: {
    nav,

    sidebar,

    // editLink: {
    //   pattern: 'https://github.com/acronis/ui-component-library/edit/main/packages/documentation/:path'
    // },

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/acronis/ui-component-library' }
    ],

    footer: {
      message: 'MIT Licensed',
      copyright:
          'Copyright © 2024-present Acronis UI Component Library contributors',
    }
  },
  vite
} as UserConfig);

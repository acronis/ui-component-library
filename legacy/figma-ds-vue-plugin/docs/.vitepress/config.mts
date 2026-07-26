import path from 'node:path'
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Figma DS Vue.js docs',
  // description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Components', link: '/components/button' },
      { text: 'Markdown examples', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: 'Getting Started',
        link: '/library/install',

      },
      {
        text: 'Components',
        items: [
          { text: 'Button', link: '/components/button' },
          { text: 'Checkbox', link: '/components/checkbox' },
          { text: 'Disclosure', link: '/components/disclosure' },
          { text: 'Divider', link: '/components/divider' },
          { text: 'Icon', link: '/components/icon' },
          { text: 'IconButton', link: '/components/iconButton' },
          { text: 'Input', link: '/components/input' },
          { text: 'Label', link: '/components/label' },
          { text: 'NumInput', link: '/components/numInput' },
          { text: 'Radio', link: '/components/radio' },
          { text: 'SelectMenu', link: '/components/selectMenu' },
          { text: 'Text', link: '/components/text' },
          { text: 'Textarea', link: '/components/textarea' },
          { text: 'Title', link: '/components/title' },
          { text: 'Toggle', link: '/components/toggle' },
          { text: 'Tooltip', link: '/components/tooltip' },
        ],
      },
      {
        text: 'Utils',
        items: [
          { text: 'Style utils', link: '/styles/style-utils' },
          { text: 'Variables', link: '/styles/variables' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
  vite: {
    resolve: {
      alias: {
        'components': path.resolve(__dirname, './components'),
        '@': path.resolve(__dirname, '../../src'),
      },
    },
  },
})

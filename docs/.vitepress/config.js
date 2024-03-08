import { defineConfig } from 'vitepress';
import path from 'path';
import vueJsx from '@vitejs/plugin-vue-jsx';
import svgLoader from 'vite-svg-loader';
import {
  allRoutes,
} from './sidebar';

let basePath = '';

const PULL_REQUEST_ID = process.env.PULL_REQUEST_ID;
const BUILD_ID = process.env.BUILD_ID;
const BRANCH = process.env.BRANCH;
const IS_PUBLICATION = process.env.IS_PUBLICATION;

if (PULL_REQUEST_ID && BUILD_ID) {
  basePath = `/jenkins/uikit/ui-kit/pr/${PULL_REQUEST_ID}/${BUILD_ID}/`;
} else if (BUILD_ID) {
  basePath = `/jenkins/uikit/ui-kit/${BRANCH}/latest/`;
} else if (IS_PUBLICATION) {
  basePath = `/local/api/platform-web-assets/public/latest/ui-kit-docs/`;
}

export default defineConfig({
  lang: 'en-US',
  title: 'Acronis UI Components Library',
  description: 'Acronis VueJS components library',
  lastUpdated: true,
  base: basePath,
  ignoreDeadLinks: true,
  darkModeSwitchLabel: false,
  appearance: false,
  markdown: {
    headers: {
      level: [0, 0]
    }
  },
  themeConfig: {
    siteTitle: 'UI Components Library',
    logo: { src: 'Acronis_White.png', alt: 'Acronis' },
    sidebar: allRoutes,
    search: {
      provider: 'local'
    }
  },
  vite: {
    build: {
      ssr: false
    },
    ssr: {
      noExternal: true
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname, '../../node_modules'),
        '@': path.resolve(__dirname, '../../src'),
        '@uikit/ui-kit': path.resolve(__dirname, '../../'),
        '@uikit/ui-syntax': path.resolve(__dirname, '../../node_modules/@uikit/ui-syntax'),
        'examples': path.resolve(__dirname, '../../examples'),
        'themes': path.resolve(__dirname, '../../themes'),
        'types': path.resolve(__dirname, '../../types'),
        'packages': path.resolve(__dirname, '../../packages'),
        'colors': path.resolve(__dirname, '../../colors'),
        'icons': path.resolve(__dirname, '../../icons'),
      }
    },
    plugins: [
      vueJsx(),
      svgLoader()
    ]
  }
});
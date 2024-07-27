// https://vitepress.dev/guide/custom-theme
import type { App } from 'vue';
import DefaultTheme from 'vitepress/theme';
import { useComponents } from './useComponents.ts';
import CustomLayout from './customLayout.vue';

import './style.css';

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  enhanceApp({ app }: { app: App }) {
    useComponents(app);
  }
};

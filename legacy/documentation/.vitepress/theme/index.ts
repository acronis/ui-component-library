// https://vitepress.dev/guide/custom-theme
import type { App } from 'vue';
import DefaultTheme from 'vitepress/theme';
import CustomLayout from './customLayout.vue';
import { useComponents } from './useComponents.ts';

import './style.css';

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  enhanceApp({ app }: { app: App }) {
    useComponents(app);
  }
};

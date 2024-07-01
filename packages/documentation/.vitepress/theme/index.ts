// https://vitepress.dev/guide/custom-theme
import type { App } from 'vue';
import DefaultTheme from 'vitepress/theme';
import './style.css';
import { useComponents } from './useComponents.ts';
import CustomLayout from './customLayout.vue';

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  enhanceApp({ app }: { app: App }) {
    useComponents(app);
  }
};

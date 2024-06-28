// https://vitepress.dev/guide/custom-theme
import type { App } from 'vue';
import { h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import './style.css';
// import ThemeSwitcher from '../components/ThemeSwitcher.vue';
import { useComponents } from './useComponents.ts';

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      // 'nav-bar-content-after': () => h(ThemeSwitcher),
    });
  },
  enhanceApp({ app }: { app: App }) {
    useComponents(app);
  }
};

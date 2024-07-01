import { createUiKit } from '@acronis-platform/ui-component-library';
import type { App, Component } from 'vue';
import Color from '../components/Color.vue';

const examplesModules: Record<string, { default: Component }> = import.meta.glob('../../demos/**/*.vue', {
  eager: true
});

const uikit = createUiKit();

export function useComponents(app: App) {
  Object.entries(examplesModules).forEach(([filePath, mod]) => {
    const name = mod.default?.name || (filePath.split('/').pop()?.replace(/\..+$/, ''));
    if (!name) {
      console.error(`[useComponents] Component name not found in ${filePath}`);
      return;
    }
    app.component(name, mod.default);
  });
  app.use(uikit);

  app.component('Color', Color);
  app.component('Colors', () => import('../components/Colors.vue'));
}

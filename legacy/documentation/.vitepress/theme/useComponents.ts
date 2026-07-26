import type { App, Component } from 'vue';
import Color from '../components/Color.vue';
import Preview from '../components/Preview.vue';
import PreviewGroup from '../components/PreviewGroup.vue';

const examplesModules: Record<string, { default: Component }> = import.meta.glob('../../../examples/demos/**/*.vue', {
  eager: true
});

export function useComponents(app: App) {
  Object.entries(examplesModules).forEach(([filePath, mod]) => {
    const name = mod.default?.name || (filePath.split('/').pop()?.replace(/\..+$/, ''));
    if (!name) {
      console.error(`[useComponents] Component name not found in ${filePath}`);
      return;
    }
    app.component(name, mod.default);
  });

  app.component('Color', Color);
  app.component('Colors', () => import('../components/Colors.vue'));
  app.component('Preview', Preview);
  app.component('PreviewGroup', PreviewGroup);
}

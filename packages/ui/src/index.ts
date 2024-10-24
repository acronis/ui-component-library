import type {
  App,
  Component,
  Directive
} from 'vue';
import * as components from './components/index.ts';
import * as directives from './directives/index.ts';
import { isObject } from './utils/util.ts';
import * as widgets from './widgets/index.ts';

export * from './components/index.ts';
export * from './composables/index.ts';
export * from './directives/index.ts';
export * from './widgets/index.ts';

export default {
  install(app: App, _options: never): void {
    for (const [name, directive] of Object.entries(directives as Record<string, Directive>)) {
      app.directive(name, directive);
    }

    for (const [name, component] of Object.entries(components as unknown as Record<string, Component>)) {
      if (isObject(component) && 'name' in component) {
        app.component(component.name ?? name, component);
      }
    }

    for (const [name, widget] of Object.entries(widgets as unknown as Record<string, Component>)) {
      if (isObject(widget) && 'name' in widget) {
        app.component(widget.name ?? name, widget);
      }
    }
  }
};

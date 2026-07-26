import type {
  App,
  Component,
  Directive
} from 'vue';
import * as components from './components/index.ts';
import * as directives from './directives/index.ts';
import { isObject } from './utils/util.ts';

export * from './components/index.ts';
export * from './composables/index.ts';
export * from './directives/index.ts';

export default {
  install(app: App): void {
    for (const [name, directive] of Object.entries(directives as Record<string, Directive>)) {
      app.directive(name, directive);
    }

    for (const [name, component] of Object.entries(components as unknown as Record<string, Component>)) {
      if (isObject(component) && 'name' in component) {
        app.component(component.name ?? name, component);
      }
    }
  }
};

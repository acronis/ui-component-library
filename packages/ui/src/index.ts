import type { App, MaybeRef } from 'vue';
import { toPascalCase } from '@acronis-platform/utils';
import * as components from './components/index.ts';
import * as directives from './directives/index.ts';
import type { PropsOptions } from './types/props.ts';
import { configNamespace } from './utils/namespace';
import { configProps } from './utils/props';

interface InstallOptions {
  prefix?: string
  namespace?: MaybeRef<string>
  props?: MaybeRef<PropsOptions>
}

/**
 * Create a plugin to install all components and directives
 * TODO: pass options to setup components, locale and theme
 */
function createUiKit() {
  const install = (app: App, options: InstallOptions = {}) => {
    const {
      prefix = '',
      namespace = '',
      props = {}
    } = options;

    configNamespace(namespace, app);
    configProps(props, app);

    const normalizedPrefix = toPascalCase(prefix || '');

    for (const key in directives) {
      app.directive(key, (directives as Record<string, any>)[key]);
    }

    for (const componentName in components) {
      app.component(normalizedPrefix + componentName, (components as Record<string, any>)[componentName]);
    }
  };

  return {
    install
  };
}

export * from './components/index.ts';
export * from './directives/index.ts';
export * from './composables/index.ts';
export { createUiKit };

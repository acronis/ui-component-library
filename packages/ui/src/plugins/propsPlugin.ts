import type { App } from 'vue';
import { merge } from 'lodash-es';

export const PROPS_PLUGIN_INJECTION_KEY = Symbol('ACV_PROPS_INJECTION_KEY');

interface PropsPluginOptions {
  props: object
}

export default {
  install: (app: App, options: PropsPluginOptions) => {
    const defaultProps = {
      button: {
        kind: 'solid'
      }
    };
    const propOptions = options?.props || {};

    app.provide(PROPS_PLUGIN_INJECTION_KEY, {
      props: {
        ...merge(defaultProps, propOptions)
      },
    });
  }
};

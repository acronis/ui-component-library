import { createApp, h } from 'vue';
import propsPlugin, { PROPS_PLUGIN_INJECTION_KEY } from './propsPlugin';

describe('propsPlugin', () => {
  it('provides default props to the app', () => {
    const app = createApp({
      render: () => h('div')
    });

    app.use(propsPlugin, {
      props: {
        button: {
          kind: 'outline'
        }
      }
    });

    const providedProps = app._context.provides[PROPS_PLUGIN_INJECTION_KEY];
    expect(providedProps).toEqual({
      props: {
        button: {
          kind: 'outline'
        }
      }
    });
  });

  it('merges provided props with default props', () => {
    const app = createApp({
      render: () => h('div')
    });

    app.use(propsPlugin, {
      props: {
        button: {
          size: 'large'
        }
      }
    });

    const providedProps = app._context.provides[PROPS_PLUGIN_INJECTION_KEY];
    expect(providedProps).toEqual({
      props: {
        button: {
          kind: 'solid',
          size: 'large'
        }
      }
    });
  });
});

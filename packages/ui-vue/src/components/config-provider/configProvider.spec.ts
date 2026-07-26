import type { AcvConfigProviderProps } from './configProvider';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ConfigProvider from './configProvider.vue';

describe('test ConfigProvider component', () => {
  it('default props', () => {
    const wrapper = mount(ConfigProvider);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "props": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(ConfigProvider, {
      propsData: {
        props: 'test',
      } as AcvConfigProviderProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "props": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(ConfigProvider);

    expect(wrapper.html()).toMatchInlineSnapshot(`""`);
  });
});

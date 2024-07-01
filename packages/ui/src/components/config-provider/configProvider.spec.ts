import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ConfigProvider from './configProvider.vue';
import type { AcvConfigProviderProps } from './configProvider';

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
      props: {
        title: 'test',
      } as AcvConfigProviderProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "props": undefined,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(ConfigProvider);

    expect(wrapper.html()).toMatchInlineSnapshot(`""`);
  });
});

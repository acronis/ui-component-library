import type { AcvConfigProviderProps } from '@/components/__todo__/config-provider/configProvider.ts';
import ConfigProvider from '@/components/__todo__/config-provider/configProvider.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

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

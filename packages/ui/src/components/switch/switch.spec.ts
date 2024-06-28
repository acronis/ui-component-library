import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Switch from './switch.vue';
import type { AcvSwitchProps } from './switch';

describe('test Switch component', () => {
  it('default props', () => {
    const wrapper = mount(Switch);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(Switch, {
      props: {
        title: 'test',
      } as AcvSwitchProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(Switch);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

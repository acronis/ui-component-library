import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Submenu from './submenu.vue';
import type { AcvSubmenuProps } from './submenu';

describe('test Submenu component', () => {
  it('default props', () => {
    const wrapper = mount(Submenu);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(Submenu, {
      props: {
        title: 'test',
      } as AcvSubmenuProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(Submenu);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import MenuGroup from './menuGroup.vue';
import type { AcvMenuGroupProps } from './menuGroup';

describe('test MenuGroup component', () => {
  it('default props', () => {
    const wrapper = mount(MenuGroup);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(MenuGroup, {
      props: {
        title: 'test',
      } as AcvMenuGroupProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(MenuGroup);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

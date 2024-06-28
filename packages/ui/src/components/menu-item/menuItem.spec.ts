import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import MenuItem from './menuItem.vue';
import type { AcvMenuItemProps } from './menuItem';

describe('test MenuItem component', () => {
  it('default props', () => {
    const wrapper = mount(MenuItem);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(MenuItem, {
      props: {
        title: 'test',
      } as AcvMenuItemProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(MenuItem);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

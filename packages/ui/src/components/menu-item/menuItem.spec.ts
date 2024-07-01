import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import MenuItem from './menuItem.vue';
import type { AcvMenuItemProps } from './menuItem';

describe('test MenuItem component', () => {
  it('default props', () => {
    const wrapper = mount(MenuItem);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(MenuItem, {
      props: {
        title: 'test',
      } as AcvMenuItemProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(MenuItem);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-1716f12c="" class="acv-menu-item"></div>"`);
  });
});

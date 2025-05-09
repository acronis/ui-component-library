import type { AcvMenuItemProps } from './menuItem';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import MenuItem from './menuItem.vue';

describe('test MenuItem component', () => {
  it('default props', () => {
    const wrapper = mount(MenuItem);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "clamp": false,
        "disabled": false,
        "exact": false,
        "icon": undefined,
        "iconSize": "md",
        "index": undefined,
        "route": undefined,
        "showHoverHint": false,
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
        "clamp": false,
        "disabled": false,
        "exact": false,
        "icon": undefined,
        "iconSize": "md",
        "index": undefined,
        "route": undefined,
        "showHoverHint": false,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(MenuItem);

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<li data-v-1716f12c="" class="acv-menu-item" role="menuitem" tabindex="0" style="--1716f12c-indent: -24px; --1716f12c-clampSize: 0;">
        <!--v-if-->
        <!--v-if-->
        <div data-v-1716f12c="" class="text ellipsis"></div>
        <!--v-if-->
      </li>"
    `);
  });
});

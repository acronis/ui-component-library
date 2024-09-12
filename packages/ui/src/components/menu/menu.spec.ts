import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Menu from './menu.vue';
import type { AcvMenuProps } from './menu.ts';

describe('test Menu component', () => {
  it('default props', () => {
    const wrapper = mount(Menu);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "background": undefined,
        "collapse": false,
        "defaultActive": undefined,
        "defaultOpened": undefined,
        "height": undefined,
        "hideBorders": false,
        "hideBottomBorder": false,
        "modelValue": undefined,
        "router": false,
        "scrollIntoExpand": false,
        "type": "primary",
        "uniqueOpened": false,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Menu, {
      props: {
        title: 'test',
      } as AcvMenuProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "background": undefined,
        "collapse": false,
        "defaultActive": undefined,
        "defaultOpened": undefined,
        "height": undefined,
        "hideBorders": false,
        "hideBottomBorder": false,
        "modelValue": undefined,
        "router": false,
        "scrollIntoExpand": false,
        "type": "primary",
        "uniqueOpened": false,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Menu);
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<nav data-v-5dcaf39a="" class="acv-menu primary">
        <menu data-v-5dcaf39a="" class="menubar acv-scrollbar" role="menubar"></menu>
        <!--v-if-->
        <!--v-if-->
      </nav>"
    `);
  });
});

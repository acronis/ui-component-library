import type { AcvMenuProps } from './menu.ts';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Menu from './menu.vue';

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
      "<nav data-v-5dcaf39a="" class="acv-menu acv-menu_type_primary">
        <!-- @slot Left side slot content. Usually for icon -->
        <menu data-v-5dcaf39a="" class="menubar acv-scrollbar" role="menubar">
          <!-- @slot Default slot content. Usually for text -->
        </menu>
        <!--v-if-->
        <!--v-if-->
      </nav>"
    `);
  });
});

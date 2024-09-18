import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import MenuGroup from './menuGroup.vue';
import type { AcvMenuGroupProps } from './menuGroup';

describe('test MenuGroup component', () => {
  it('default props', () => {
    const wrapper = mount(MenuGroup);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(MenuGroup, {
      props: {
        title: 'test',
      } as AcvMenuGroupProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(MenuGroup);

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<menu data-v-1696bcc4="" class="acv-menu-group" style="--1696bcc4-indent: -24px;">
        <!--v-if-->
      </menu>"
    `);
  });
});

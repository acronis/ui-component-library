import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Menu from './menu.vue';
import type { MenuProps } from './menu.ts';

describe('test Menu component', () => {
  it('default props', () => {
    const wrapper = mount(Menu);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Menu, {
      props: {
        title: 'test',
      } as MenuProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Menu);
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-5dcaf39a="" class="acv-menu">
        
        
      </div>"
    `);
  });
});

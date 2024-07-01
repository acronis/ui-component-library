import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Drawer from './drawer.vue';
import type { AcvDrawerProps } from './drawer';

describe('test Drawer component', () => {
  it('default props', () => {
    const wrapper = mount(Drawer);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Drawer, {
      props: {
        title: 'test',
      } as AcvDrawerProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Drawer);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-dd14fadb="" class="acv-drawer"></div>"`);
  });
});

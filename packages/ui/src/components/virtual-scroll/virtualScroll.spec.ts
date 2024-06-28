import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import VirtualScroll from './virtualScroll.vue';
import type { VirtualScrollProps } from './virtualScroll.ts';

describe('test VirtualScroll component', () => {
  it('default props', () => {
    const wrapper = mount(VirtualScroll);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(VirtualScroll, {
      props: {
        title: 'test',
      } as VirtualScrollProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(VirtualScroll);
    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-326fd9a1="" class="acv-virtual-scroll"></div>"`);
  });
});

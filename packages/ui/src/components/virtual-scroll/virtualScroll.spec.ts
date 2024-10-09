import type { AcvVirtualScrollProps } from './virtualScroll.ts';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import VirtualScroll from './virtualScroll.vue';

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
      } as AcvVirtualScrollProps,
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

import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Scrollbar from './scrollbar.vue';
import type { ScrollbarProps } from './scrollbar.ts';

describe('test scrollbar component', () => {
  it('default props', () => {
    const wrapper = mount(Scrollbar);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Scrollbar, {
      props: {
        title: 'test',
      } as ScrollbarProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Scrollbar);
    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-e3a4a672="" class="acv-scrollbar"></div>"`);
  });
});

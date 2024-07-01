import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import List from './list.vue';
import type { ListProps } from './list.ts';

describe('test List component', () => {
  it('default props', () => {
    const wrapper = mount(List);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(List, {
      props: {
        title: 'test',
      } as ListProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(List);
    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-bf9fece9="" class="acv-list"></div>"`);
  });
});

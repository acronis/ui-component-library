import type { AcvSearchProps } from '@/components/__todo__/search/search.ts';
import Search from '@/components/__todo__/search/search.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('test Search component', () => {
  it('default props', () => {
    const wrapper = mount(Search);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Search, {
      props: {
        title: 'test',
      } as AcvSearchProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Search);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-93c6ab4d="" class="acv-search"></div>"`);
  });
});

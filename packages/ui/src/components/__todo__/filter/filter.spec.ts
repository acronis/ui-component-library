import type { AcvFilterProps } from '@/components/__todo__/filter/filter.ts';
import Filter from '@/components/__todo__/filter/filter.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('test Filter component', () => {
  it('default props', () => {
    const wrapper = mount(Filter);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Filter, {
      props: {
        title: 'test',
      } as AcvFilterProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Filter);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-bc90e13b="" class="acv-filter"></div>"`);
  });
});

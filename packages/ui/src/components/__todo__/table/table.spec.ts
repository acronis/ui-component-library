import type { AcvTableProps } from '@/components/__todo__/table/table.ts';
import table from '@/components/__todo__/table/table.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('test table component', () => {
  it('default props', () => {
    const wrapper = mount(table);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(table, {
      props: {
        title: 'test',
      } as AcvTableProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(table);
    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-3d600e1c="" class="acv-table"></div>"`);
  });
});

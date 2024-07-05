import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import table from './table.vue';
import type { AcvTableProps } from './table.ts';

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

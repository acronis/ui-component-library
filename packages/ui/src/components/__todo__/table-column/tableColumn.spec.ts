import type { AcvTableColumnProps } from '@/components/__todo__/table-column/tableColumn.ts';
import TableColumn from '@/components/__todo__/table-column/tableColumn.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('test TableColumn component', () => {
  it('default props', () => {
    const wrapper = mount(TableColumn);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(TableColumn, {
      props: {
        title: 'test',
      } as AcvTableColumnProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(TableColumn);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-f8ff591b="" class="acv-table-column"></div>"`);
  });
});

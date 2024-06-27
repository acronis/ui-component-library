import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Col from './column.vue';
import type { ColumnProps } from './column.ts';

describe('test Column component', () => {
  it('default props', () => {
    const wrapper = mount(Col);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "colIndex": 1,
        "colSpan": 1,
        "lg": undefined,
        "md": undefined,
        "offset": undefined,
        "pull": undefined,
        "push": undefined,
        "rowIndex": 1,
        "rowSpan": 1,
        "sm": undefined,
        "span": 24,
        "tag": "div",
        "xl": undefined,
        "xs": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Col, {
      props: {
        title: 'test',
      } as ColumnProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "colIndex": 1,
        "colSpan": 1,
        "lg": undefined,
        "md": undefined,
        "offset": undefined,
        "pull": undefined,
        "push": undefined,
        "rowIndex": 1,
        "rowSpan": 1,
        "sm": undefined,
        "span": 24,
        "tag": "div",
        "xl": undefined,
        "xs": undefined,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Col);
    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-2def4f7d="" class="acv-column acv-grid--col-span-1 acv-grid--row-span-1 acv-grid--row-start-1 acv-grid--col-start-1 acv-column-span-24"></div>"`);
  });
});

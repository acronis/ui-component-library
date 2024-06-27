import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Cell from './cell.vue';
import type { CellProps } from './cell.ts';

describe('test Cell component', () => {
  it('default props', () => {
    const wrapper = mount(Cell);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "bottom": "",
        "height": 1,
        "left": "auto",
        "lg": null,
        "md": null,
        "right": "",
        "sm": null,
        "tag": "div",
        "top": "auto",
        "useFlex": null,
        "width": null,
        "xl": null,
        "xs": null,
        "xxl": null,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Cell, {
      props: {
        tag: 'span',
      } as CellProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "bottom": "",
        "height": 1,
        "left": "auto",
        "lg": null,
        "md": null,
        "right": "",
        "sm": null,
        "tag": "span",
        "top": "auto",
        "useFlex": null,
        "width": null,
        "xl": null,
        "xs": null,
        "xxl": null,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Cell);
    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-a7944e7c="" class="acv-cell" style="grid-row-end: span 1; grid-column-start: span 1;"></div>"`);
  });
});

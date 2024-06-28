import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Row from './row.vue';
import type { RowProps } from './row.ts';

describe('test Row component', () => {
  it('default props', () => {
    const wrapper = mount(Row);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "align": "top",
        "columnFlex": false,
        "gap": 0,
        "justify": "start",
        "tag": "div",
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Row, {
      props: {
        title: 'test',
      } as RowProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "align": "top",
        "columnFlex": false,
        "gap": 0,
        "justify": "start",
        "tag": "div",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Row);
    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-3e189dc8="" class="acv-row"></div>"`);
  });
});

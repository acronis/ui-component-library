import type { AcvRowProps } from '@/components/__dev__/row/row.ts';
import Row from '@/components/__dev__/row/row.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

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
      } as AcvRowProps,
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

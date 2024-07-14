import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Chart from './chart.vue';
import type { AcvChartProps } from './chart.ts';

describe('test Chart component', () => {
  it('default props', () => {
    const wrapper = mount(Chart);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Chart, {
      props: {
        title: 'test',
      } as AcvChartProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Chart);
    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-d66479ff="" class="acv-chart"></div>"`);
  });
});

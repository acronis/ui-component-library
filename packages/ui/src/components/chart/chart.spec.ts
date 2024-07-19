import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Chart from './chart.vue';
import type { AcvChartProps } from './chart.ts';

describe('test Chart component', () => {
  it('default props', () => {
    const wrapper = mount(Chart, {
      props: {
        type: 'bar',
        data: {}
      } as AcvChartProps,
    });
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "data": {},
        "datasetIdKey": "id",
        "options": undefined,
        "plugins": undefined,
        "type": "bar",
        "updateMode": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Chart, {
      props: {
        type: 'bar',
      } as AcvChartProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "data": undefined,
        "datasetIdKey": "id",
        "options": undefined,
        "plugins": undefined,
        "type": "bar",
        "updateMode": undefined,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Chart);
    expect(wrapper.html()).toMatchInlineSnapshot(`"<canvas data-v-d66479ff="" role="img" class="acv-chart"></canvas>"`);
  });
});

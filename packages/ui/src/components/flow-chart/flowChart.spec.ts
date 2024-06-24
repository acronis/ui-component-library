import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import FlowChart from './flowChart.vue';
import type { AcvFlowChartProps } from './flowChart';

describe('test FlowChart component', () => {
  it('default props', () => {
    const wrapper = mount(FlowChart);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(FlowChart, {
      props: {
        title: 'test',
      } as AcvFlowChartProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(FlowChart);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

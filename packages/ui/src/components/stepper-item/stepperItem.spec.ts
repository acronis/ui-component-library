import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import StepperItem from './stepperItem.vue';
import type { AcvStepperItemProps } from './stepperItem';

describe('test StepperItem component', () => {
  it('default props', () => {
    const wrapper = mount(StepperItem);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(StepperItem, {
      props: {
        title: 'test',
      } as AcvStepperItemProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(StepperItem);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

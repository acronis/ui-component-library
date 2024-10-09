import type { AcvStepperItemProps } from './stepperItem';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import StepperItem from './stepperItem.vue';

describe('test StepperItem component', () => {
  it('default props', () => {
    const wrapper = mount(StepperItem);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(StepperItem, {
      props: {
        title: 'test',
      } as AcvStepperItemProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(StepperItem);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-67be1ea7="" class="acv-stepper-item"></div>"`);
  });
});

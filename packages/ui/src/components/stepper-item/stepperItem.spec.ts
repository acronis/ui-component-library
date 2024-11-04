import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import StepperItem from './stepperItem.vue';

describe('test StepperItem component', () => {
  it('renders', () => {
    const wrapper = mount(StepperItem);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<button data-v-67be1ea7="" class="acv-stepper-item" type="button" tabindex="0"></button>"`);
  });
});

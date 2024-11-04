import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Stepper from './stepper.vue';

describe('test stepper component', () => {
  it('renders', () => {
    const wrapper = mount(Stepper);
    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-179b3493="" class="acv-stepper"></div>"`);
  });
});

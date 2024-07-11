import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Radio from './radio.vue';
import type { AcvRadioProps } from './radio';

describe('radio component', () => {
  it('default props', () => {
    const wrapper = mount(Radio);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "color": undefined,
        "disabled": false,
        "invalid": false,
        "label": undefined,
        "modelModifiers": undefined,
        "modelValue": undefined,
        "size": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Radio, {
      props: {
        color: 'red',
      } as AcvRadioProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "color": "red",
        "disabled": false,
        "invalid": false,
        "label": undefined,
        "modelModifiers": undefined,
        "modelValue": undefined,
        "size": undefined,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Radio, {
      attrs: {
        id: 'test'
      }
    });

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<label data-v-7fe17e9e="" for="acv-radio-test" class="acv-radio checked"><input data-v-7fe17e9e="" id="acv-radio-test" name="acv-radio-test" checked="" aria-disabled="false" aria-invalid="false" class="hidden" type="radio" role="radio"><span data-v-7fe17e9e="" class="acv-radio-icon"><svg data-v-7fe17e9e="" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle data-v-7fe17e9e="" class="selection" cx="8" cy="8" r="5.5" fill="white" stroke="currentcolor" stroke-width="5"></circle><!--v-if--></svg></span>
        <!--v-if-->
      </label>"
    `);
  });
});

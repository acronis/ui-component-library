import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Checkbox from './checkbox.vue';
import type { CheckboxProps } from './checkbox.ts';

describe('test Checkbox component', () => {
  it('default props', () => {
    const wrapper = mount(Checkbox);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "checked": false,
        "color": undefined,
        "disabled": false,
        "falseValue": undefined,
        "id": undefined,
        "indeterminate": undefined,
        "indeterminateModifiers": undefined,
        "label": false,
        "modelModifiers": undefined,
        "modelValue": undefined,
        "multilineLabel": false,
        "multilineLabelLimit": undefined,
        "name": undefined,
        "showHint": false,
        "size": undefined,
        "trueValue": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Checkbox, {
      props: {
        label: 'test',
      } as CheckboxProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "checked": false,
        "color": undefined,
        "disabled": false,
        "falseValue": undefined,
        "id": undefined,
        "indeterminate": undefined,
        "indeterminateModifiers": undefined,
        "label": "test",
        "modelModifiers": undefined,
        "modelValue": undefined,
        "multilineLabel": false,
        "multilineLabelLimit": undefined,
        "name": undefined,
        "showHint": false,
        "size": undefined,
        "trueValue": undefined,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Checkbox);
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-178ad92c="" class="acv-checkbox"><button data-v-5aaebf8f="" data-v-178ad92c="" class="acv-button primary solid acv-icon-button" type="button">
          <!--v-if--><span class="acv-button__text"><svg data-v-178ad92c="" class="acv-icon" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 24 24" width="1em" fill="currentcolor"><path d="M0 0h24v24H0z" fill="none"></path><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path></svg><input data-v-7419ef09="" data-v-178ad92c="" class="acv-input" type="checkbox"></span>
          <!--v-if-->
        </button></div>"
    `);
  });
});

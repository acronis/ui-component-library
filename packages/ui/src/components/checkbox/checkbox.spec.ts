import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Checkbox from './checkbox.vue';
import type { AcvCheckboxProps } from './checkbox.ts';

describe('test Checkbox component', () => {
  it('default props', () => {
    const wrapper = mount(Checkbox);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "checkedValue": false,
        "color": "primary",
        "cycleIndeterminate": false,
        "disabled": false,
        "iconClass": undefined,
        "id": undefined,
        "indeterminateValue": null,
        "invalid": false,
        "label": undefined,
        "modelValue": false,
        "multilineLabel": false,
        "multilineLabelLimit": undefined,
        "name": undefined,
        "showHint": false,
        "size": "medium",
        "uncheckedValue": false,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Checkbox, {
      props: {
        label: 'test',
      } as AcvCheckboxProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "checkedValue": false,
        "color": "primary",
        "cycleIndeterminate": false,
        "disabled": false,
        "iconClass": undefined,
        "id": undefined,
        "indeterminateValue": null,
        "invalid": false,
        "label": "test",
        "modelValue": false,
        "multilineLabel": false,
        "multilineLabelLimit": undefined,
        "name": undefined,
        "showHint": false,
        "size": "medium",
        "uncheckedValue": false,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Checkbox, {
      propsData: {
        id: 'test'
      }
    });
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<label data-v-178ad92c="" for="acv-checkbox-test" class="acv-checkbox"><input data-v-178ad92c="" id="acv-checkbox-test" name="acv-checkbox-test" class="hidden" aria-disabled="false" type="checkbox"><svg data-v-edf74d45="" data-v-178ad92c="" class="acv-checkbox-icon medium" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="--acv-checkbox-icon-color: var(--acv-color-primary);">
          <rect data-v-edf74d45="" class="outline" x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke-width="1" stroke="currentcolor"></rect>
          <!--v-if-->
          <!--v-if-->
          <!--v-if-->
        </svg>
        <!--v-if-->
      </label>"
    `);
  });
});

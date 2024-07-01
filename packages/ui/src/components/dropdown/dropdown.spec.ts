import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Dropdown from './dropdown.vue';
import type { AcvDropdownProps } from './dropdown.ts';

describe('test Dropdown component', () => {
  it('default props', () => {
    const wrapper = mount(Dropdown);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "arrow": false,
        "delay": undefined,
        "disabled": false,
        "flip": false,
        "hideDelay": undefined,
        "hideOnClick": false,
        "hideOnScroll": false,
        "middleware": undefined,
        "modelValue": false,
        "offset": undefined,
        "persist": false,
        "placeholder": undefined,
        "placement": undefined,
        "popperClass": undefined,
        "search": false,
        "strategy": undefined,
        "teleport": false,
        "transition": undefined,
        "trigger": undefined,
        "value": false,
        "width": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Dropdown, {
      props: {
        title: 'test',
      } as AcvDropdownProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "arrow": false,
        "delay": undefined,
        "disabled": false,
        "flip": false,
        "hideDelay": undefined,
        "hideOnClick": false,
        "hideOnScroll": false,
        "middleware": undefined,
        "modelValue": false,
        "offset": undefined,
        "persist": false,
        "placeholder": undefined,
        "placement": undefined,
        "popperClass": undefined,
        "search": false,
        "strategy": undefined,
        "teleport": false,
        "transition": undefined,
        "trigger": undefined,
        "value": false,
        "width": undefined,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Dropdown);

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-5f77216c="" class="anchor"></div>
      <!--v-if-->"
    `);
  });
});

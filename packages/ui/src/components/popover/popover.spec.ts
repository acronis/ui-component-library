import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Popover from './popover.vue';
import type { AcvPopoverProps } from './popover.ts';

describe('test Popover component', () => {
  it('default props', () => {
    const wrapper = mount(Popover);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "arrow": true,
        "block": false,
        "color": undefined,
        "contentClass": undefined,
        "delay": undefined,
        "disabled": false,
        "flip": false,
        "hideDelay": undefined,
        "keepAlive": false,
        "loading": false,
        "middleware": undefined,
        "modelValue": false,
        "offset": 32,
        "persist": false,
        "placement": "right-start",
        "popperClass": undefined,
        "referenceEl": undefined,
        "strategy": undefined,
        "teleport": false,
        "transition": undefined,
        "trigger": "click",
        "width": 150,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Popover, {
      props: {
        title: 'test',
      } as AcvPopoverProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "arrow": true,
        "block": false,
        "color": undefined,
        "contentClass": undefined,
        "delay": undefined,
        "disabled": false,
        "flip": false,
        "hideDelay": undefined,
        "keepAlive": false,
        "loading": false,
        "middleware": undefined,
        "modelValue": false,
        "offset": 32,
        "persist": false,
        "placement": "right-start",
        "popperClass": undefined,
        "referenceEl": undefined,
        "strategy": undefined,
        "teleport": false,
        "transition": undefined,
        "trigger": "click",
        "width": 150,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Popover);
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-5f77216c="" class="anchor"></div>
      <!--v-if-->"
    `);
  });
});

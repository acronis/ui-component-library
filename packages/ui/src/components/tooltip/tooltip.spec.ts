import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import tooltip from './tooltip.vue';
import type { TooltipProps } from './tooltip.ts';

describe('test tooltip component', () => {
  it('default props', () => {
    const wrapper = mount(tooltip);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "arrow": true,
        "content": undefined,
        "delay": undefined,
        "disabled": false,
        "flip": false,
        "hideDelay": undefined,
        "maxWidth": undefined,
        "middleware": undefined,
        "modelValue": false,
        "offset": 6,
        "persist": false,
        "placement": "top",
        "popperClass": undefined,
        "size": undefined,
        "strategy": undefined,
        "teleport": false,
        "transition": undefined,
        "trigger": "hover",
        "width": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(tooltip, {
      props: {
        title: 'test',
      } as TooltipProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "arrow": true,
        "content": undefined,
        "delay": undefined,
        "disabled": false,
        "flip": false,
        "hideDelay": undefined,
        "maxWidth": undefined,
        "middleware": undefined,
        "modelValue": false,
        "offset": 6,
        "persist": false,
        "placement": "top",
        "popperClass": undefined,
        "size": undefined,
        "strategy": undefined,
        "teleport": false,
        "transition": undefined,
        "trigger": "hover",
        "width": undefined,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(tooltip);
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-5f77216c="" class="anchor"></div>
      <!--v-if-->"
    `);
  });
});

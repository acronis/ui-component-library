import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import type { AcvInputBaseProps } from './inputBase.ts';
import InputBase from './inputBase.vue';

describe('test InputBase component', () => {
  it('default props', () => {
    const wrapper = mount(InputBase);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "hidden": false,
        "modelModifiers": undefined,
        "modelValue": undefined,
        "type": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(InputBase, {
      props: {
        type: 'checkbox',
        hidden: true,
      } as AcvInputBaseProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "hidden": true,
        "modelModifiers": undefined,
        "modelValue": undefined,
        "type": "checkbox",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(InputBase);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<input data-v-9dbd12cf="" class="acv-base-input">"`);
  });
});

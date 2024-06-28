import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Input from './input.vue';
import type { InputProps } from './input.ts';

describe('test Input component', () => {
  it('default props', () => {
    const wrapper = mount(Input);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "falseValue": undefined,
        "modelModifiers": undefined,
        "modelValue": undefined,
        "trueValue": undefined,
        "type": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Input, {
      props: {
        title: 'test',
      } as InputProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "falseValue": undefined,
        "modelModifiers": undefined,
        "modelValue": undefined,
        "trueValue": undefined,
        "type": undefined,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Input);
    expect(wrapper.html()).toMatchInlineSnapshot(`"<input data-v-7419ef09="" class="acv-input">"`);
  });
});

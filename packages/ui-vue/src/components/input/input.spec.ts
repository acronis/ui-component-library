import type { AcvInputProps } from './input.ts';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Input from './input.vue';

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
      } as AcvInputProps,
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

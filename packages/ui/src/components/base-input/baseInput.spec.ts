import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseInput from './baseInput.vue';
import type { AcvBaseInputProps } from './baseInput';

describe('test BaseInput component', () => {
  it('default props', () => {
    const wrapper = mount(BaseInput);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(BaseInput, {
      props: {
        title: 'test',
      } as AcvBaseInputProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(BaseInput);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-63cfe4b8="" class="acv-base-input"></div>"`);
  });
});

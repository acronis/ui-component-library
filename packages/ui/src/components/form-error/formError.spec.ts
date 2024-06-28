import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import FormError from './formError.vue';
import type { AcvFormErrorProps } from './formError';

describe('test FormError component', () => {
  it('default props', () => {
    const wrapper = mount(FormError);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(FormError, {
      props: {
        title: 'test',
      } as AcvFormErrorProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(FormError);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-fa537a04="" class="acv-form-error"></div>"`);
  });
});

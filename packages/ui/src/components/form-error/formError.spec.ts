import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import FormError from './formError.vue';
import type { AcvFormErrorProps } from './formError';

describe('test FormError component', () => {
  it('default props', () => {
    const wrapper = mount(FormError);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(FormError, {
      props: {
        title: 'test',
      } as AcvFormErrorProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(FormError);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

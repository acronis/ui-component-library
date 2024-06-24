import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Textarea from './textarea.vue';
import type { AcvTextareaProps } from './textarea';

describe('test Textarea component', () => {
  it('default props', () => {
    const wrapper = mount(Textarea);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(Textarea, {
      props: {
        title: 'test',
      } as AcvTextareaProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(Textarea);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SplitButton from './splitButton.vue';
import type { AcvSplitButtonProps } from './splitButton';

describe('test SplitButton component', () => {
  it('default props', () => {
    const wrapper = mount(SplitButton);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(SplitButton, {
      props: {
        title: 'test',
      } as AcvSplitButtonProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(SplitButton);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

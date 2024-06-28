import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import CheckboxButton from './checkboxButton.vue';
import type { AcvCheckboxButtonProps } from './checkboxButton';

describe('test CheckboxButton component', () => {
  it('default props', () => {
    const wrapper = mount(CheckboxButton);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(CheckboxButton, {
      props: {
        title: 'test',
      } as AcvCheckboxButtonProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(CheckboxButton);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

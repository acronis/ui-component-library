import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import RadioButton from './radioButton.vue';
import type { AcvRadioButtonProps } from './radioButton';

describe('test RadioButton component', () => {
  it('default props', () => {
    const wrapper = mount(RadioButton);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(RadioButton, {
      props: {
        title: 'test',
      } as AcvRadioButtonProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(RadioButton);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

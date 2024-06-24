import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import NumPicker from './numPicker.vue';
import type { AcvNumPickerProps } from './numPicker';

describe('test NumPicker component', () => {
  it('default props', () => {
    const wrapper = mount(NumPicker);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(NumPicker, {
      props: {
        title: 'test',
      } as AcvNumPickerProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(NumPicker);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

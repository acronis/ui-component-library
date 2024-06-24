import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import DatePicker from './datePicker.vue';
import type { AcvDatePickerProps } from './datePicker';

describe('test DatePicker component', () => {
  it('default props', () => {
    const wrapper = mount(DatePicker);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(DatePicker, {
      props: {
        title: 'test',
      } as AcvDatePickerProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(DatePicker);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

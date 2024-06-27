import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import FilePicker from './filePicker.vue';
import type { AcvFilePickerProps } from './filePicker';

describe('test FilePicker component', () => {
  it('default props', () => {
    const wrapper = mount(FilePicker);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(FilePicker, {
      props: {
        title: 'test',
      } as AcvFilePickerProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(FilePicker);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import FileUpload from './fileUpload.vue';
import type { AcvFileUploadProps } from './fileUpload';

describe('test FileUpload component', () => {
  it('default props', () => {
    const wrapper = mount(FileUpload);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(FileUpload, {
      props: {
        title: 'test',
      } as AcvFileUploadProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(FileUpload);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

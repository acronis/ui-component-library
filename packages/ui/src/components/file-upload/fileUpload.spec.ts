import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import FileUpload from './fileUpload.vue';
import type { AcvFileUploadProps } from './fileUpload';

describe('test FileUpload component', () => {
  it('default props', () => {
    const wrapper = mount(FileUpload);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(FileUpload, {
      props: {
        title: 'test',
      } as AcvFileUploadProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(FileUpload);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-40cec777="" class="acv-file-upload"></div>"`);
  });
});

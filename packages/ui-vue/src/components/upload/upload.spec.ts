import type { AcvUploadProps } from './upload';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Upload from './upload.vue';

describe('test Upload component', () => {
  it('default props', () => {
    const wrapper = mount(Upload);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Upload, {
      props: {
        title: 'test',
      } as AcvUploadProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Upload);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-6483dec9="" class="acv-upload"></div>"`);
  });
});

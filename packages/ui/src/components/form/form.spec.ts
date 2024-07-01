import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Form from './form.vue';
import type { AcvFormProps } from './form';

describe('test Form component', () => {
  it('default props', () => {
    const wrapper = mount(Form);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Form, {
      props: {
        title: 'test',
      } as AcvFormProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Form);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-b4bfdf82="" class="acv-form"></div>"`);
  });
});

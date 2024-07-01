import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import FormItem from './formItem.vue';
import type { AcvFormItemProps } from './formItem';

describe('test FormItem component', () => {
  it('default props', () => {
    const wrapper = mount(FormItem);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(FormItem, {
      props: {
        title: 'test',
      } as AcvFormItemProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(FormItem);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-414cb91d="" class="acv-form-item"></div>"`);
  });
});

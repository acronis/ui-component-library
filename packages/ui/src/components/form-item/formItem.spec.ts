import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import FormItem from './formItem.vue';
import type { AcvFormItemProps } from './formItem';

describe('test FormItem component', () => {
  it('default props', () => {
    const wrapper = mount(FormItem);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(FormItem, {
      props: {
        title: 'test',
      } as AcvFormItemProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(FormItem);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

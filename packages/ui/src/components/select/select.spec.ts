import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Select from './select.vue';
import type { AcvSelectProps } from './select';

describe('test Select component', () => {
  it('default props', () => {
    const wrapper = mount(Select);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(Select, {
      props: {
        title: 'test',
      } as AcvSelectProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(Select);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

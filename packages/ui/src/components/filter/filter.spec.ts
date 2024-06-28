import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Filter from './filter.vue';
import type { AcvFilterProps } from './filter';

describe('test Filter component', () => {
  it('default props', () => {
    const wrapper = mount(Filter);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(Filter, {
      props: {
        title: 'test',
      } as AcvFilterProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(Filter);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

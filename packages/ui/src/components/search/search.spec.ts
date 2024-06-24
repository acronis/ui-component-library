import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Search from './search.vue';
import type { AcvSearchProps } from './search';

describe('test Search component', () => {
  it('default props', () => {
    const wrapper = mount(Search);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(Search, {
      props: {
        title: 'test',
      } as AcvSearchProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(Search);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

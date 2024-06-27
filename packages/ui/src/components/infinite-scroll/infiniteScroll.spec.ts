import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import InfiniteScroll from './infiniteScroll.vue';
import type { AcvInfiniteScrollProps } from './infiniteScroll';

describe('test InfiniteScroll component', () => {
  it('default props', () => {
    const wrapper = mount(InfiniteScroll);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(InfiniteScroll, {
      props: {
        title: 'test',
      } as AcvInfiniteScrollProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(InfiniteScroll);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

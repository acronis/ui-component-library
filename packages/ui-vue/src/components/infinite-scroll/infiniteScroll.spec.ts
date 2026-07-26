import type { AcvInfiniteScrollProps } from './infiniteScroll';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import InfiniteScroll from './infiniteScroll.vue';

describe('test InfiniteScroll component', () => {
  it('default props', () => {
    const wrapper = mount(InfiniteScroll);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(InfiniteScroll, {
      props: {
        title: 'test',
      } as AcvInfiniteScrollProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(InfiniteScroll);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-f14d8230="" class="acv-infinite-scroll"></div>"`);
  });
});

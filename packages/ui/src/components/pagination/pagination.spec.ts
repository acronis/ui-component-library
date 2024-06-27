import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Pagination from './pagination.vue';
import type { AcvPaginationProps } from './pagination';

describe('test Pagination component', () => {
  it('default props', () => {
    const wrapper = mount(Pagination);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(Pagination, {
      props: {
        title: 'test',
      } as AcvPaginationProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(Pagination);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

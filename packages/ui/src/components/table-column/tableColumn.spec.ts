import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import TableColumn from './tableColumn.vue';
import type { AcvTableColumnProps } from './tableColumn';

describe('test TableColumn component', () => {
  it('default props', () => {
    const wrapper = mount(TableColumn);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(TableColumn, {
      props: {
        title: 'test',
      } as AcvTableColumnProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(TableColumn);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

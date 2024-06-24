import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Tag from './tag.vue';
import type { AcvTagProps } from './tag';

describe('test Tag component', () => {
  it('default props', () => {
    const wrapper = mount(Tag);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(Tag, {
      props: {
        title: 'test',
      } as AcvTagProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(Tag);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

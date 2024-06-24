import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import OptionGroup from './optionGroup.vue';
import type { AcvOptionGroupProps } from './optionGroup';

describe('test OptionGroup component', () => {
  it('default props', () => {
    const wrapper = mount(OptionGroup);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(OptionGroup, {
      props: {
        title: 'test',
      } as AcvOptionGroupProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(OptionGroup);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

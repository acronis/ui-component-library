import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import RadioGroup from './radioGroup.vue';
import type { AcvRadioGroupProps } from './radioGroup';

describe('test RadioGroup component', () => {
  it('default props', () => {
    const wrapper = mount(RadioGroup);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        title: 'test',
      } as AcvRadioGroupProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(RadioGroup);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

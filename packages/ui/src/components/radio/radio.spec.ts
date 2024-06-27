import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Radio from './radio.vue';
import type { AcvRadioProps } from './radio';

describe('test Radio component', () => {
  it('default props', () => {
    const wrapper = mount(Radio);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(Radio, {
      props: {
        title: 'test',
      } as AcvRadioProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(Radio);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

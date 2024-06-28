import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Disclosure from './disclosure.vue';
import type { AcvDisclosureProps } from './disclosure';

describe('test Disclosure component', () => {
  it('default props', () => {
    const wrapper = mount(Disclosure);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(Disclosure, {
      props: {
        title: 'test',
      } as AcvDisclosureProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(Disclosure);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

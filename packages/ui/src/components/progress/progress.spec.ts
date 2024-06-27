import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Progress from './progress.vue';
import type { AcvProgressProps } from './progress';

describe('test Progress component', () => {
  it('default props', () => {
    const wrapper = mount(Progress);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(Progress, {
      props: {
        title: 'test',
      } as AcvProgressProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(Progress);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

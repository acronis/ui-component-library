import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Tiles from './tiles.vue';
import type { AcvTilesProps } from './tiles';

describe('test Tiles component', () => {
  it('default props', () => {
    const wrapper = mount(Tiles);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(Tiles, {
      props: {
        title: 'test',
      } as AcvTilesProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(Tiles);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

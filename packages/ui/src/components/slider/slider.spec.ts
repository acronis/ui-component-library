import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Slider from './slider.vue';
import type { AcvSliderProps } from './slider';

describe('test Slider component', () => {
  it('default props', () => {
    const wrapper = mount(Slider);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Slider, {
      props: {
        title: 'test',
      } as AcvSliderProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Slider);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-1aa6b9ac="" class="acv-slider"></div>"`);
  });
});

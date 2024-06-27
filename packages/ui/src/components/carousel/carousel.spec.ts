import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Carousel from './carousel.vue';
import type { CarouselProps } from './carousel';

describe('test Carousel component', () => {
  it('default props', () => {
    const wrapper = mount(Carousel);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Carousel, {
      props: {
        title: 'test',
      } as CarouselProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Carousel);
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-e2d8e9a6="" class="acv-carousel">
        <!--
            @slot description - The description slot content
            @binding {string} description - The description prop value
          -->
      </div>"
    `);
  });
});

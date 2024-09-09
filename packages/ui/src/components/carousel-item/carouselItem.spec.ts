import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import CarouselItem from './carouselItem.vue';
import type { AcvCarouselItemProps } from './carouselItem';
import type { AcvCarouselInjection } from '@/components/carousel/carousel.ts';
import { CAROUSEL_INJECTION_KEY } from '@/components/carousel/carousel.ts';

describe('test CarouselItem component', () => {
  const provide = {
    [CAROUSEL_INJECTION_KEY as symbol]: { register: () => { }, unregister: () => { }, model: ref('test') } as unknown as AcvCarouselInjection,
  };

  it('default props', () => {
    const wrapper = mount(CarouselItem, {
      global: { provide }
    });
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "name": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(CarouselItem, {
      props: {
        name: 'test',
      } as AcvCarouselItemProps,
      global: { provide }
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "name": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(CarouselItem, {
      props: {
        name: 'test',
      },
      global: { provide }
    });

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-317932e6="" class="acv-carousel-item"></div>"`);
  });
});

import { describe, expect, it } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';
import Carousel from './carousel.vue';
import type { AcvCarouselProps } from './carousel';

describe('test Carousel component', () => {
  it('default props', () => {
    const wrapper = shallowMount(Carousel, { props: { count: 3 } as AcvCarouselProps });
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "count": 3,
        "cycle": false,
        "modelModifiers": undefined,
        "modelValue": 0,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Carousel, { props: { count: 2 } as AcvCarouselProps });
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-e2d8e9a6="" class="acv-carousel"><button data-v-7a9642c5="" data-v-e2d8e9a6="" type="button" disabled="" aria-disabled="true" class="acv-button solid medium primary disabled">
          <!--v-if-->
          <!--v-if--><span data-v-7a9642c5="" class="content"> Prev </span>
          <!--v-if-->
        </button><button data-v-7a9642c5="" data-v-e2d8e9a6="" type="button" disabled="" aria-disabled="true" class="acv-button ghost medium primary disabled">
          <!--v-if-->
          <!--v-if--><span data-v-7a9642c5="" class="content"> * </span>
          <!--v-if-->
        </button><button data-v-7a9642c5="" data-v-e2d8e9a6="" type="button" class="acv-button ghost medium primary">
          <!--v-if-->
          <!--v-if--><span data-v-7a9642c5="" class="content"> * </span>
          <!--v-if-->
        </button><button data-v-7a9642c5="" data-v-e2d8e9a6="" type="button" class="acv-button solid medium primary">
          <!--v-if-->
          <!--v-if--><span data-v-7a9642c5="" class="content"> Next </span>
          <!--v-if-->
        </button></div>"
    `);
  });
});

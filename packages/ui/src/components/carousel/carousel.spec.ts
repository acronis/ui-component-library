import type { AcvCarouselProps } from './carousel';
import AcvCarouselItem from '@/components/carousel-item/carouselItem.vue';
import { mount, shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import Carousel from './carousel.vue';

describe('test Carousel component', () => {
  const slots = {
    default: [
      h(AcvCarouselItem, () => 'First'),
      h(AcvCarouselItem, () => 'Second'),
      h(AcvCarouselItem, () => 'Third'),
    ]
  };

  it('default props', () => {
    const props: AcvCarouselProps = {};
    const wrapper = shallowMount(Carousel, { props });
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "autoplay": false,
        "cycle": false,
        "interval": 3000,
        "modelModifiers": undefined,
        "modelValue": undefined,
      }
    `);
  });

  it('renders', async () => {
    const props: AcvCarouselProps = { };
    const wrapper = mount(Carousel, { props, slots });
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-e2d8e9a6="" class="acv-carousel">
        <div data-v-e2d8e9a6="" class="acv-carousel-content">
          <div data-v-317932e6="" class="acv-carousel-item">First</div>
          <!--v-if-->
          <!--v-if-->
        </div>
        <div data-v-e2d8e9a6="" class="acv-carousel-nav"><button data-v-7a9642c5="" data-v-e2d8e9a6="" type="button" class="acv-button ghost medium primary disabled prev-button" disabled="" aria-disabled="true"><svg data-v-7a9642c5="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" class="acv-icon">
              <path fill="currentColor" d="m5.414 7 3.293-3.293a1 1 0 0 0-1.414-1.414l-5 5a1 1 0 0 0 0 1.414l5 5a1 1 0 0 0 1.414-1.414L5.414 9H13a1 1 0 1 0 0-2H5.414Z"></path>
            </svg>
            <!--v-if--><span data-v-7a9642c5="" class="content"> Prev </span>
            <!--v-if-->
          </button>
          <div data-v-e2d8e9a6="" class="inner"><button data-v-7a9642c5="" data-v-e2d8e9a6="" type="button" class="acv-button ghost medium primary selected button-active"><svg data-v-7a9642c5="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" class="acv-icon">
                <circle cx="8" cy="8" r="4" fill="currentColor"></circle>
              </svg>
              <!--v-if-->
              <!--v-if-->
              <!--v-if-->
            </button><button data-v-7a9642c5="" data-v-e2d8e9a6="" type="button" class="acv-button ghost medium primary button-available"><svg data-v-7a9642c5="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" class="acv-icon">
                <circle cx="8" cy="8" r="4" fill="currentColor"></circle>
              </svg>
              <!--v-if-->
              <!--v-if-->
              <!--v-if-->
            </button><button data-v-7a9642c5="" data-v-e2d8e9a6="" type="button" class="acv-button ghost medium primary button-available"><svg data-v-7a9642c5="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" class="acv-icon">
                <circle cx="8" cy="8" r="4" fill="currentColor"></circle>
              </svg>
              <!--v-if-->
              <!--v-if-->
              <!--v-if-->
            </button></div><button data-v-7a9642c5="" data-v-e2d8e9a6="" type="button" class="acv-button ghost medium primary next-button">
            <!--v-if-->
            <!--v-if--><span data-v-7a9642c5="" class="content"> Next </span><svg data-v-7a9642c5="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" class="acv-icon">
              <path fill="currentColor" d="M10.586 7 7.293 3.707a1 1 0 0 1 1.414-1.414l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414-1.414L10.586 9H3a1 1 0 0 1 0-2h7.586Z"></path>
            </svg>
          </button>
        </div>
      </div>"
    `);
  });

  it('show next item when clicking on next button', async () => {
    const props: AcvCarouselProps = {};
    const wrapper = mount(Carousel, { props, slots });
    await wrapper.vm.$nextTick();
    const nextButton = wrapper.find('.next-button');
    await nextButton.trigger('click');
    expect(wrapper.find('.acv-carousel-item').text()).toBe('Second');
  });

  it('prev button is disabled for first active item if cycle is off', async () => {
    const props: AcvCarouselProps = { };
    const wrapper = mount(Carousel, { props, slots });
    await wrapper.vm.$nextTick();
    const prevButton = wrapper.find('.prev-button');
    expect(prevButton.attributes().disabled).toBeDefined();
  });

  it('prev button is enabled for first active item if cycle is on', async () => {
    const props: AcvCarouselProps = { cycle: true };
    const wrapper = mount(Carousel, { props, slots });
    await wrapper.vm.$nextTick();
    const prevButton = wrapper.find('.prev-button');
    expect(prevButton.attributes().disabled).not.toBeDefined();
  });

  it('show last item when active is first and press prev button', async () => {
    const props: AcvCarouselProps = { cycle: true };
    const wrapper = mount(Carousel, { props, slots });
    await wrapper.vm.$nextTick();
    const prevButton = wrapper.find('.prev-button');
    await prevButton.trigger('click');
    expect(wrapper.find('.acv-carousel-item').text()).toBe('Third');
  });
});

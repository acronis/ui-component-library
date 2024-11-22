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
        <div data-v-e2d8e9a6="" class="acv-carousel-nav"><button data-v-7a9642c5="" data-v-e2d8e9a6="" type="button" class="acv-button acv-button_variant_ghost acv-button_size_medium acv-button_disabled prev-button" disabled="" aria-disabled="true">
            <!--v-if--><i data-v-c834062e="" data-v-7a9642c5="" class="acv-custom-icon size-medium" role="presentation" style="--c834062e-iconSizeValue: 24px; --c834062e-fillColor: currentColor;">
              <!--v-if-->
              <!--v-if--><svg data-v-c834062e="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" class="acv-icon is-svg">
                <path fill="currentColor" d="m5.414 7 3.293-3.293a1 1 0 0 0-1.414-1.414l-5 5a1 1 0 0 0 0 1.414l5 5a1 1 0 0 0 1.414-1.414L5.414 9H13a1 1 0 1 0 0-2H5.414Z"></path>
              </svg>
              <!--v-if-->
              <!--v-if--><span data-v-c834062e="" class="visually-hidden"></span>
            </i>
            <!--v-if--><span data-v-7a9642c5="" class="content"><!-- @slot Default slot content. Usually for text --> Prev </span>
            <!--v-if-->
          </button>
          <div data-v-e2d8e9a6="" class="inner"><button data-v-7a9642c5="" data-v-e2d8e9a6="" type="button" class="acv-button acv-button_variant_ghost acv-button_size_medium acv-button_selected button-active" source="function render(_ctx, _cache) {
        return (__vite_ssr_import_0__.openBlock(), __vite_ssr_import_0__.createElementBlock(&quot;svg&quot;, _hoisted_1, [..._hoisted_3]))
      }">
              <!--v-if-->
              <!--v-if-->
              <!--v-if-->
              <!--v-if-->
              <!--v-if-->
            </button><button data-v-7a9642c5="" data-v-e2d8e9a6="" type="button" class="acv-button acv-button_variant_ghost acv-button_size_medium button-available" source="function render(_ctx, _cache) {
        return (__vite_ssr_import_0__.openBlock(), __vite_ssr_import_0__.createElementBlock(&quot;svg&quot;, _hoisted_1, [..._hoisted_3]))
      }">
              <!--v-if-->
              <!--v-if-->
              <!--v-if-->
              <!--v-if-->
              <!--v-if-->
            </button><button data-v-7a9642c5="" data-v-e2d8e9a6="" type="button" class="acv-button acv-button_variant_ghost acv-button_size_medium button-available" source="function render(_ctx, _cache) {
        return (__vite_ssr_import_0__.openBlock(), __vite_ssr_import_0__.createElementBlock(&quot;svg&quot;, _hoisted_1, [..._hoisted_3]))
      }">
              <!--v-if-->
              <!--v-if-->
              <!--v-if-->
              <!--v-if-->
              <!--v-if-->
            </button></div><button data-v-7a9642c5="" data-v-e2d8e9a6="" type="button" class="acv-button acv-button_variant_ghost acv-button_size_medium next-button" append-icon="function render(_ctx, _cache) {
        return (__vite_ssr_import_0__.openBlock(), __vite_ssr_import_0__.createElementBlock(&quot;svg&quot;, _hoisted_1, [..._hoisted_3]))
      }">
            <!--v-if-->
            <!--v-if-->
            <!--v-if--><span data-v-7a9642c5="" class="content"><!-- @slot Default slot content. Usually for text --> Next </span>
            <!--v-if-->
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

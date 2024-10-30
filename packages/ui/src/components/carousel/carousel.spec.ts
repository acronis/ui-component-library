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
        <div data-v-e2d8e9a6="" class="acv-carousel-nav"><button data-v-7a9642c5="" data-v-e2d8e9a6="" type="button" class="acv-button acv-button_variant_ghost acv-button_size_medium acv-button_disabled prev-button" icon="function render(_ctx, _cache) {
        return (__vite_ssr_import_0__.openBlock(), __vite_ssr_import_0__.createElementBlock(&quot;svg&quot;, _hoisted_1, [..._hoisted_3]))
      }" disabled="" aria-disabled="true">
            <!--v-if-->
            <!--v-if--><span data-v-7a9642c5="" class="content"><!-- @slot Default slot content. Usually for text --> Prev </span>
            <!--v-if-->
          </button>
          <div data-v-e2d8e9a6="" class="inner"><button data-v-7a9642c5="" data-v-e2d8e9a6="" type="button" class="acv-button acv-button_variant_ghost acv-button_size_medium acv-button_selected button-active" icon="function render(_ctx, _cache) {
        return (__vite_ssr_import_0__.openBlock(), __vite_ssr_import_0__.createElementBlock(&quot;svg&quot;, _hoisted_1, [..._hoisted_3]))
      }">
              <!--v-if-->
              <!--v-if-->
              <!--v-if-->
              <!--v-if-->
            </button><button data-v-7a9642c5="" data-v-e2d8e9a6="" type="button" class="acv-button acv-button_variant_ghost acv-button_size_medium button-available" icon="function render(_ctx, _cache) {
        return (__vite_ssr_import_0__.openBlock(), __vite_ssr_import_0__.createElementBlock(&quot;svg&quot;, _hoisted_1, [..._hoisted_3]))
      }">
              <!--v-if-->
              <!--v-if-->
              <!--v-if-->
              <!--v-if-->
            </button><button data-v-7a9642c5="" data-v-e2d8e9a6="" type="button" class="acv-button acv-button_variant_ghost acv-button_size_medium button-available" icon="function render(_ctx, _cache) {
        return (__vite_ssr_import_0__.openBlock(), __vite_ssr_import_0__.createElementBlock(&quot;svg&quot;, _hoisted_1, [..._hoisted_3]))
      }">
              <!--v-if-->
              <!--v-if-->
              <!--v-if-->
              <!--v-if-->
            </button></div><button data-v-7a9642c5="" data-v-e2d8e9a6="" type="button" class="acv-button acv-button_variant_ghost acv-button_size_medium next-button" append-icon="function render(_ctx, _cache) {
        return (__vite_ssr_import_0__.openBlock(), __vite_ssr_import_0__.createElementBlock(&quot;svg&quot;, _hoisted_1, [..._hoisted_3]))
      }">
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

import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Footer from './footer.vue';
import type { FooterProps } from './footer.ts';

describe('test Footer component', () => {
  it('default props', () => {
    const wrapper = mount(Footer);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "color": "white",
        "height": "64px",
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Footer, {
      props: {
        title: 'test',
      } as FooterProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "color": "white",
        "height": "64px",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Footer);
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<footer data-v-ec21d032="" class="acv-footer">
        <div data-v-ec21d032="" class="acv-footer__content"></div>
        <div data-v-ec21d032=""></div>
      </footer>"
    `);
  });

  it('height', async () => {
    const wrapper = mount(Footer, {
      props: {
        height: '100',
      } as FooterProps
    });

    await nextTick();

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<footer data-v-ec21d032="" class="acv-footer" style="--ec21d032-height: 100; --ec21d032-backgroundColor: var(--acv-color-white);">
        <div data-v-ec21d032="" class="acv-footer__content"></div>
        <div data-v-ec21d032=""></div>
      </footer>"
    `);
  });
});

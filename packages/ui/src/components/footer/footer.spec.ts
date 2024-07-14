import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Footer from './footer.vue';
import type { AcvFooterProps } from './footer.ts';

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
      } as AcvFooterProps,
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
      "<footer data-v-676f3426="" class="acv-footer acv-footer--color-white">
        <div data-v-676f3426="" class="acv-footer__content"></div>
        <div data-v-676f3426=""></div>
      </footer>"
    `);
  });

  it('height', async () => {
    const wrapper = mount(Footer, {
      props: {
        height: '100',
      } as AcvFooterProps
    });

    await nextTick();

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<footer data-v-676f3426="" class="acv-footer acv-footer--color-white" style="--676f3426-height: 100;">
        <div data-v-676f3426="" class="acv-footer__content"></div>
        <div data-v-676f3426=""></div>
      </footer>"
    `);
  });
});

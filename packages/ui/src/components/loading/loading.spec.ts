import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Loading from './loading.vue';
import type { AcvLoadingProps } from './loading';

describe('test Loading component', () => {
  it('default props', () => {
    const wrapper = mount(Loading);
    expect(wrapper.props()).toMatchInlineSnapshot(`{}`);
  });

  it('pass props', () => {
    const wrapper = mount(Loading, {
      props: {
        title: 'test',
      } as AcvLoadingProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`{}`);
  });

  it('renders', () => {
    const wrapper = mount(Loading);

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-f4e822ab="" class="acv-loading is-fullscreen" style="display: none;">
        <div data-v-f4e822ab="" class="acv-loading__backdrop" style="opacity: 1;"></div>
        <div data-v-f4e822ab="" class="acv-loading__content"><span data-v-5ffbe806="" data-v-f4e822ab="" class="acv-spinner size-16 acv-border-brand-secondary"></span>
          <!--v-if-->
        </div>
      </div>"
    `);
  });
});

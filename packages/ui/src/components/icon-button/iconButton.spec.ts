import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import IconButton from './iconButton.vue';
import type { IconButtonProps } from './iconButton.ts';

describe('test IconButton component', () => {
  it('default props', () => {
    const wrapper = mount(IconButton);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "color": undefined,
        "size": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(IconButton, {
      props: {
        title: 'test',
      } as IconButtonProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "color": undefined,
        "size": undefined,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(IconButton);
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<button data-v-5aaebf8f="" class="acv-button primary solid acv-icon-button" type="button">
        <!--v-if--><span class="acv-button__text"></span>
        <!--v-if-->
      </button>"
    `);
  });
});

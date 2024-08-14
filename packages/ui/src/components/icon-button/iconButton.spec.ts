import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import IconButton from './iconButton.vue';
import type { AcvIconButtonProps } from './iconButton.ts';

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
      } as AcvIconButtonProps,
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
      "<button data-v-7a9642c5="" data-v-5aaebf8f="" class="acv-button solid medium primary acv-icon-button" type="button">
        <!--v-if-->
        <!--v-if--><span data-v-7a9642c5="" class="content"></span>
        <!--v-if-->
      </button>"
    `);
  });
});

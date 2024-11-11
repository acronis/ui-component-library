import type { AcvMainProps } from '@/components/__dev__/main/main.ts';
import Main from '@/components/__dev__/main/main.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('test Main component', () => {
  it('default props', () => {
    const wrapper = mount(Main);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "color": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Main, {
      props: {
        title: 'test',
      } as AcvMainProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "color": undefined,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Main);
    expect(wrapper.html()).toMatchInlineSnapshot(`"<main data-v-0f437ec6="" class="acv-main"></main>"`);
  });
});

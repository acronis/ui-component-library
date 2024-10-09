import type { AcvCardProps } from './card.ts';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import Card from './card.vue';

describe('test Card component', () => {
  it('pass accessibility tests', async () => {
    const wrapper = mount(Card);

    expect(await axe(wrapper.element)).toHaveNoViolations();
  });

  it('default props', () => {
    const wrapper = mount(Card);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "backgroundColor": undefined,
        "border": true,
        "borderColor": undefined,
        "color": undefined,
        "img": undefined,
        "imgAlt": undefined,
        "loading": false,
        "padding": true,
        "round": true,
        "shadow": true,
        "states": false,
        "textColor": undefined,
        "variant": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Card, {
      props: {
        title: 'test',
      } as AcvCardProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "backgroundColor": undefined,
        "border": true,
        "borderColor": undefined,
        "color": undefined,
        "img": undefined,
        "imgAlt": undefined,
        "loading": false,
        "padding": true,
        "round": true,
        "shadow": true,
        "states": false,
        "textColor": undefined,
        "variant": undefined,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Card);
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-e3acac2e="" class="acv-layer acv-card shadowed rounded bordered padded">
        <!--v-if-->
        <!--v-if-->
        <div data-v-e3acac2e="" class="content"></div>
      </div>"
    `);
  });
});

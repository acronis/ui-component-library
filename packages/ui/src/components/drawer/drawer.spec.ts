import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AcvCard from '../card/card.vue';
import Drawer from './drawer.vue';
import type { AcvDrawerProps } from './drawer';

describe('test Drawer component', () => {
  it('default props', () => {
    const wrapper = mount(Drawer);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "anchor": "left",
        "backgroundColor": undefined,
        "border": false,
        "borderColor": undefined,
        "color": undefined,
        "img": undefined,
        "imgAlt": undefined,
        "loading": false,
        "modelValue": false,
        "padding": false,
        "persistent": false,
        "round": false,
        "shadow": false,
        "states": false,
        "textColor": undefined,
        "variant": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Drawer, {
      props: {
        title: 'test',
      } as AcvDrawerProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "anchor": "left",
        "backgroundColor": undefined,
        "border": false,
        "borderColor": undefined,
        "color": undefined,
        "img": undefined,
        "imgAlt": undefined,
        "loading": false,
        "modelValue": false,
        "padding": false,
        "persistent": false,
        "round": false,
        "shadow": false,
        "states": false,
        "textColor": undefined,
        "variant": undefined,
      }
    `);
  });

  it('renders closed', () => {
    const wrapper = mount(Drawer);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<!--v-if-->"`);
  });

  it('renders opened', async () => {
    const wrapper = mount(Drawer);

    await wrapper.setProps({ modelValue: true });

    const drawer = wrapper.getComponent(AcvCard);

    expect(drawer.html()).toMatchInlineSnapshot(`
      "<div data-v-e3acac2e="" data-v-dd14fadb="" class="acv-layer acv-card acv-drawer acv-drawer-left" modelvalue="true" persistent="false" anchor="left">
        <!--v-if-->
        <!--v-if-->
      </div>"
    `);
  });
});

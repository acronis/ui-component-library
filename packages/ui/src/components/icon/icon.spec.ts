import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Icon from './icon.vue';
import type { IconProps } from './icon.ts';

describe('test Icon component', () => {
  it('default props', () => {
    const wrapper = mount(Icon);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "animateOnHover": false,
        "animation": undefined,
        "animationSpeed": undefined,
        "collection": "acronis",
        "color": undefined,
        "disabled": false,
        "fill": undefined,
        "flip": undefined,
        "icon": undefined,
        "inverse": false,
        "name": undefined,
        "scale": undefined,
        "size": "16",
        "state": undefined,
        "stateColor": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Icon, {
      props: {
        title: 'test',
      } as IconProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "animateOnHover": false,
        "animation": undefined,
        "animationSpeed": undefined,
        "collection": "acronis",
        "color": undefined,
        "disabled": false,
        "fill": undefined,
        "flip": undefined,
        "icon": undefined,
        "inverse": false,
        "name": undefined,
        "scale": undefined,
        "size": "16",
        "state": undefined,
        "stateColor": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Icon);
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<i data-v-c834062e="" class="acv-icon size-16" role="presentation">
        <!--v-if-->
        <!--    <slot v-else> -->
        <!--      <component -->
        <!--        :is="dynamicStateIcon" -->
        <!--        v-if="dynamicStateIcon" -->
        <!--        class="state" -->
        <!--        :color="stateColor" -->
        <!--        :width="size" -->
        <!--        :height="size" -->
        <!--      /> -->
        <!--      <component -->
        <!--        :is="dynamicIcon" -->
        <!--        v-if="dynamicIcon" -->
        <!--        class="cmp" -->
        <!--        :width="size" -->
        <!--        :height="size" -->
        <!--      /> -->
        <!--      <span -->
        <!--        v-else -->
        <!--        :class="\`i-\${collection}-icons:\${name}\`" -->
        <!--      ></span> -->
        <!--    </slot> -->
      </i>"
    `);
  });

  it('create svg icon with state', () => {
    const wrapper = mount(Icon, {
      props: {
        name: 'i-notifications-with-state-d-o--16',
        state: 'i-state-alert-d--16'
      }
    });
    const iconElm = wrapper.element;
    // expect(wrapper.vm.iconPath.includes('#mo-notifications-with-state-d-o--16')).toBe(true);
    // expect(wrapper.vm.statePath.includes('#mo-state-alert-d--16')).toBe(true);
    expect(iconElm.classList).toMatchInlineSnapshot(`
      DOMTokenList {
        "0": "acv-icon",
        "1": "size-16",
      }
    `);
  });
});

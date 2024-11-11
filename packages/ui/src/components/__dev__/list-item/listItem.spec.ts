import type { AcvListItemProps } from '@/components/__dev__/list-item/listItem.ts';
import ListItem from '@/components/__dev__/list-item/listItem.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('test ListItem component', () => {
  it('default props', () => {
    const wrapper = mount(ListItem);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "closable": false,
        "color": undefined,
        "data": undefined,
        "disabled": false,
        "draggable": false,
        "icon": undefined,
        "subtitle": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(ListItem, {
      props: {
        title: 'test',
      } as AcvListItemProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "closable": false,
        "color": undefined,
        "data": undefined,
        "disabled": false,
        "draggable": false,
        "icon": undefined,
        "subtitle": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(ListItem);

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-18de18c6="" class="acv-list-item">
        <!--v-if-->
        <!--v-if--><span data-v-18de18c6="" class="left-section"><span data-v-18de18c6="" class="title acv-text acv-text--body-24"></span></span>
        <!--v-if-->
        <!--v-if-->
        <!--      <AcvTypography -->
        <!--        :title="props.title" -->
        <!--        :subtitle="props.subtitle" -->
        <!--      /> -->
      </div>"
    `);
  });
});

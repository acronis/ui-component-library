import type { AcvListProps } from '@/components/__dev__/list/list.ts';
import List from '@/components/__dev__/list/list.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('test List component', () => {
  it('default props', () => {
    const wrapper = mount(List);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "animate": false,
        "card": false,
        "color": undefined,
        "items": undefined,
        "modelModifiers": undefined,
        "modelValue": [],
        "multiselect": false,
        "selectable": false,
        "sortable": false,
        "states": undefined,
        "variant": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(List, {
      props: {
        title: 'test',
      } as AcvListProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "animate": false,
        "card": false,
        "color": undefined,
        "items": undefined,
        "modelModifiers": undefined,
        "modelValue": [],
        "multiselect": false,
        "selectable": false,
        "sortable": false,
        "states": undefined,
        "variant": undefined,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(List);
    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-bf9fece9="" class="acv-list"></div>"`);
  });
});

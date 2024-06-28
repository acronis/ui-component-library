import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Combobox from './combobox.vue';
import type { AcvComboboxProps } from './combobox';

describe('test Combobox component', () => {
  it('default props', () => {
    const wrapper = mount(Combobox);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Combobox, {
      props: {
        title: 'test',
      } as AcvComboboxProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Combobox);

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-86ca4ea8="" class="acv-combobox">
        <!--
            @slot description - The description slot content
            @binding {string} description - The description prop value
          -->
      </div>"
    `);
  });
});

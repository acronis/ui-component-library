import type { AcvComboboxProps } from '@/components/__todo__/combobox/combobox.ts';
import Combobox from '@/components/__todo__/combobox/combobox.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

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

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-86ca4ea8="" class="acv-combobox"></div>"`);
  });
});

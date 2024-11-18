import type { AcvNumPickerProps } from '@/components/__todo__/num-picker/numPicker.ts';
import NumPicker from '@/components/__todo__/num-picker/numPicker.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('test NumPicker component', () => {
  it('default props', () => {
    const wrapper = mount(NumPicker);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(NumPicker, {
      props: {
        title: 'test',
      } as AcvNumPickerProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(NumPicker);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-d4637044="" class="acv-num-picker"></div>"`);
  });
});

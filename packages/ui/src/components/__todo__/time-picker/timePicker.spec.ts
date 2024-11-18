import type { AcvTimePickerProps } from '@/components/__todo__/time-picker/timePicker.ts';
import TimePicker from '@/components/__todo__/time-picker/timePicker.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('test TimePicker component', () => {
  it('default props', () => {
    const wrapper = mount(TimePicker);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(TimePicker, {
      props: {
        title: 'test',
      } as AcvTimePickerProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(TimePicker);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-af034bac="" class="acv-time-picker"></div>"`);
  });
});

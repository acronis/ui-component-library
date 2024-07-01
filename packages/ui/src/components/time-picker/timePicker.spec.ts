import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import TimePicker from './timePicker.vue';
import type { AcvTimePickerProps } from './timePicker';

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

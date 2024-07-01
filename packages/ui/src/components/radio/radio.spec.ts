import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Radio from './radio.vue';
import type { AcvRadioProps } from './radio';

describe('test Radio component', () => {
  it('default props', () => {
    const wrapper = mount(Radio);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Radio, {
      props: {
        title: 'test',
      } as AcvRadioProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Radio);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-7fe17e9e="" class="acv-radio"></div>"`);
  });
});

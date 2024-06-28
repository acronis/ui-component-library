import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Switch from './switch.vue';
import type { AcvSwitchProps } from './switch';

describe('test Switch component', () => {
  it('default props', () => {
    const wrapper = mount(Switch);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Switch, {
      props: {
        title: 'test',
      } as AcvSwitchProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Switch);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-411e8d7f="" class="acv-switch"></div>"`);
  });
});

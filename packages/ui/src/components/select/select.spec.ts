import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Select from './select.vue';
import type { AcvSelectProps } from './select';

describe('test Select component', () => {
  it('default props', () => {
    const wrapper = mount(Select);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Select, {
      props: {
        title: 'test',
      } as AcvSelectProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Select);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-33553d1a="" class="acv-select"></div>"`);
  });
});

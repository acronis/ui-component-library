import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Option from './option.vue';
import type { AcvOptionProps } from './option';

describe('test Option component', () => {
  it('default props', () => {
    const wrapper = mount(Option);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Option, {
      props: {
        title: 'test',
      } as AcvOptionProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Option);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-a4279e8d="" class="acv-option"></div>"`);
  });
});

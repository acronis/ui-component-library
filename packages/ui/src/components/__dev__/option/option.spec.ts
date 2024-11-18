import type { AcvOptionProps } from '@/components/__dev__/option/option.ts';
import Option from '@/components/__dev__/option/option.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('test Option component', () => {
  it('default props', () => {
    const wrapper = mount(Option);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "active": false,
        "disabled": false,
        "label": undefined,
        "selected": false,
        "value": undefined,
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
        "active": false,
        "disabled": false,
        "label": undefined,
        "selected": false,
        "value": undefined,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Option);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-a4279e8d="" class="acv-option" role="option" aria-selected="false" aria-disabled="false"></div>"`);
  });
});

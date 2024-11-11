import type { AcvOptionGroupProps } from '@/components/__todo__/option-group/optionGroup.ts';
import OptionGroup from '@/components/__todo__/option-group/optionGroup.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('test OptionGroup component', () => {
  it('default props', () => {
    const wrapper = mount(OptionGroup);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(OptionGroup, {
      props: {
        title: 'test',
      } as AcvOptionGroupProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(OptionGroup);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-3944f166="" class="acv-option-group"></div>"`);
  });
});

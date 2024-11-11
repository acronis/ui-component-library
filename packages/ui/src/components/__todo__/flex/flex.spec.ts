import type { AcvFlexProps } from '@/components/__todo__/flex/flex.ts';
import Flex from '@/components/__todo__/flex/flex.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('test Flex component', () => {
  it('default props', () => {
    const wrapper = mount(Flex);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Flex, {
      props: {
        title: 'test',
      } as AcvFlexProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Flex);
    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-0395240d="" class="acv-flex"></div>"`);
  });
});

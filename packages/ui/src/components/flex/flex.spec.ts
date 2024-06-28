import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Flex from './flex.vue';
import type { FlexProps } from './flex.ts';

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
      } as FlexProps,
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

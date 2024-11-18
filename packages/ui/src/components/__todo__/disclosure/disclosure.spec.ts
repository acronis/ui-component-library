import type { AcvDisclosureProps } from '@/components/__todo__/disclosure/disclosure.ts';
import Disclosure from '@/components/__todo__/disclosure/disclosure.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('test Disclosure component', () => {
  it('default props', () => {
    const wrapper = mount(Disclosure);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Disclosure, {
      props: {
        title: 'test',
      } as AcvDisclosureProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Disclosure);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-11b8582b="" class="acv-disclosure"></div>"`);
  });
});

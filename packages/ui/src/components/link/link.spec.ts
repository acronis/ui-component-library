import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Link from './link.vue';
import type { LinkProps } from './link.ts';

describe('test Link component', () => {
  it('default props', () => {
    const wrapper = mount(Link);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Link, {
      props: {
        title: 'test',
      } as LinkProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Link);
    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-1ad4db4e="" class="acv-link"></div>"`);
  });
});

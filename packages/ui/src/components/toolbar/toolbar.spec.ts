import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import toolbar from './toolbar.vue';
import type { ToolbarProps } from './toolbar.ts';

describe('test toolbar component', () => {
  it('default props', () => {
    const wrapper = mount(toolbar);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(toolbar, {
      props: {
        title: 'test',
      } as ToolbarProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(toolbar);
    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-bbb452c6="" class="acv-toolbar"></div>"`);
  });
});

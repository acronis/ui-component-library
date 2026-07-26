import type { AcvToolbarProps } from './toolbar.ts';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import toolbar from './toolbar.vue';

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
      } as AcvToolbarProps,
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

import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Cascader from './cascader.vue';
import type { AcvCascaderProps } from './cascader';

describe('test Cascader component', () => {
  it('default props', () => {
    const wrapper = mount(Cascader);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Cascader, {
      props: {
        title: 'test',
      } as AcvCascaderProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Cascader);

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-78e6fb23="" class="acv-cascader">
        <!--
            @slot description - The description slot content
            @binding {string} description - The description prop value
          -->
      </div>"
    `);
  });
});

import type { AcvCascaderProps } from './cascader';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Cascader from './cascader.vue';

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

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-78e6fb23="" class="acv-cascader"></div>"`);
  });
});

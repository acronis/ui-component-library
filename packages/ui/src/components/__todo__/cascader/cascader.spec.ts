import type { AcvCascaderProps } from '@/components/__todo__/cascader/cascader.ts';
import Cascader from '@/components/__todo__/cascader/cascader.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

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

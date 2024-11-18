import type { AcvRibbonProps } from '@/components/__dev__/ribbon/ribbon.ts';
import Ribbon from '@/components/__dev__/ribbon/ribbon.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('test Ribbon component', () => {
  it('default props', () => {
    const wrapper = mount(Ribbon);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "alerts": undefined,
        "closeable": false,
        "description": undefined,
        "hideClose": false,
        "title": undefined,
        "variant": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Ribbon, {
      props: {
        title: 'test',
      } as AcvRibbonProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "alerts": undefined,
        "closeable": false,
        "description": undefined,
        "hideClose": false,
        "title": "test",
        "variant": undefined,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Ribbon);
    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-8271a988="" class="acv-ribbon" role="banner"></div>"`);
  });
});

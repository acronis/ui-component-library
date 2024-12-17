import type { AcvRibbonProps } from './ribbon.ts';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Ribbon from './ribbon.vue';

describe('test Ribbon component', () => {
  it('default props', () => {
    const wrapper = mount(Ribbon);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "alerts": undefined,
        "hideClose": false,
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
        "hideClose": false,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Ribbon);
    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-8271a988="" class="acv-ribbon" role="banner"></div>"`);
  });
});

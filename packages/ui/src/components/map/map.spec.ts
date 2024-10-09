import type { AcvMapProps } from './map';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Map from './map.vue';

describe('test Map component', () => {
  it('default props', () => {
    const wrapper = mount(Map);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Map, {
      props: {
        title: 'test',
      } as AcvMapProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Map);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-6e8d9331="" class="acv-map"></div>"`);
  });
});

import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Card from './card.vue';
import type { CardProps } from './card.ts';

describe('test Card component', () => {
  it('default props', () => {
    const wrapper = mount(Card);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "backgroundColor": undefined,
        "borderColor": undefined,
        "textColor": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Card, {
      props: {
        title: 'test',
      } as CardProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "backgroundColor": undefined,
        "borderColor": undefined,
        "textColor": undefined,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Card);
    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-e3acac2e="" class="acv-card"></div>"`);
  });
});

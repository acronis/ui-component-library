import type { AcvCardProps } from './card.ts';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import Card from './card.vue';

describe('test Card component', () => {
  it('pass accessibility tests', async () => {
    const wrapper = mount(Card);

    expect(await axe(wrapper.element)).toHaveNoViolations();
  });

  it('default props', () => {
    const wrapper = mount(Card);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "border": undefined,
        "shadow": undefined,
        "withPadding": false,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Card, {
      props: {
        border: 'secondary',
        shadow: 'regular',
        withPadding: true,
      } as AcvCardProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "border": "secondary",
        "shadow": "regular",
        "withPadding": true,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Card, {
      props: {
        border: 'secondary',
        shadow: 'regular',
        withPadding: true,
      } as AcvCardProps,
    });

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-e3acac2e="" class="acv-card padded shadow shadow_regular border border_secondary">
        <div data-v-e3acac2e="" class="content"></div>
      </div>"
    `);
  });
});

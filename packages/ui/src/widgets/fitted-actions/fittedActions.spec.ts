import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import FittedActions from './fittedActions.vue';
import type { AcvFittedActionsProps } from './fittedActions.ts';

describe('test FittedActions component', () => {
  it('default props', () => {
    const wrapper = mount(FittedActions);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "actions": undefined,
        "item": undefined,
        "showDropdown": true,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(FittedActions, {
      props: {
        title: 'test',
        actions: []
      } as AcvFittedActionsProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "actions": [],
        "item": undefined,
        "showDropdown": true,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(FittedActions);
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-a22f15ae="" class="acv-fitted-actions">
        <div data-v-a22f15ae="" class="tracing-layer"></div>
        <div data-v-a22f15ae="" class="elements" style="display: none;"></div>
        <!--v-if-->
      </div>"
    `);
  });
});

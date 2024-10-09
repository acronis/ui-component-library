import type { AcvTabsProps } from './tabs';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import Tabs from './tabs.vue';

describe('test Tabs component', () => {
  it('pass accessibility tests', async () => {
    const wrapper = mount(Tabs, {
      props: {
        tabs: [
          {
            label: 'Tab 1',
            content: 'Content 1',
          },
          {
            label: 'Tab 2',
            content: 'Content 2',
          },
        ],
      } as AcvTabsProps
    });

    expect(await axe(wrapper.element)).toHaveNoViolations();
  });

  it('default props', () => {
    const wrapper = mount(Tabs);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "modelModifiers": undefined,
        "modelValue": undefined,
        "size": undefined,
        "spacing": false,
        "tabs": undefined,
        "transition": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Tabs, {
      props: {
        title: 'test',
      } as AcvTabsProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "modelModifiers": undefined,
        "modelValue": undefined,
        "size": undefined,
        "spacing": false,
        "tabs": undefined,
        "transition": undefined,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Tabs);

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-d73d51ff="" class="acv-tabs">
        <nav data-v-d73d51ff="" class="nav" role="tablist"></nav>
      </div>"
    `);
  });
});

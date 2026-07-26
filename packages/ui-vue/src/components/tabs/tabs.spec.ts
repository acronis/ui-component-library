import type { AcvTabsProps } from './tabs';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import Tabs from './tabs.vue';

describe('tabs component', () => {
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
        "large": false,
        "modelValue": undefined,
        "showDivider": true,
        "size": undefined,
        "spacing": true,
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
        "large": false,
        "modelValue": undefined,
        "showDivider": true,
        "size": undefined,
        "spacing": true,
        "transition": undefined,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Tabs);

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-d73d51ff="" class="acv-tabs">
        <div data-v-74e186fc="" data-v-d73d51ff="" class="acv-tabs__nav acv-tabs__nav--spaced" role="tablist"></div>
        <div data-v-d73d51ff="" class="acv-tabs__content">
          <div data-v-db039be1="" data-v-d73d51ff="" class="acv-divider acv-divider--horizontal mt-24" role="separator" aria-hidden="true" aria-orientation="horizontal">
            <!--v-if-->
          </div>
        </div>
      </div>"
    `);
  });
});

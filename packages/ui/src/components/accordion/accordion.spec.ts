import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Accordion from './accordion.vue';
import type { AccordionProps } from './accordion.ts';

describe('test Accordion component', () => {
  it('default props', () => {
    const wrapper = mount(Accordion);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "expanded": false,
        "modelModifiers": undefined,
        "modelValue": undefined,
        "multiple": false,
        "size": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Accordion, {
      props: {
        title: 'test',
      } as AccordionProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "expanded": false,
        "modelModifiers": undefined,
        "modelValue": undefined,
        "multiple": false,
        "size": undefined,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Accordion);
    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-c229abb0="" class="acv accordion acv-accordion"></div>"`);
  });
});

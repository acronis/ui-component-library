import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import CheckboxGroup from './checkboxGroup.vue';
import type { AcvCheckboxGroupProps } from './checkboxGroup';

describe('test CheckboxGroup component', () => {
  it('default props', () => {
    const wrapper = mount(CheckboxGroup);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(CheckboxGroup, {
      props: {
        title: 'test',
      } as AcvCheckboxGroupProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(CheckboxGroup);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-88bdb927="" class="acv-checkbox-group"></div>"`);
  });
});

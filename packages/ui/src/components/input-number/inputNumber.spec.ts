import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import InputNumber from './inputNumber.vue';
import type { AcvInputNumberProps } from './inputNumber';

describe('test InputNumber component', () => {
  it('default props', () => {
    const wrapper = mount(InputNumber);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(InputNumber, {
      props: {
        title: 'test',
      } as AcvInputNumberProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(InputNumber);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-156c8055="" class="acv-input-number"></div>"`);
  });
});

import type { AcvFormLabelProps } from '@/components/__dev__/form-label/formLabel.ts';
import FormLabel from '@/components/__dev__/form-label/formLabel.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('test FormLabel component', () => {
  it('default props', () => {
    const wrapper = mount(FormLabel);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "label": undefined,
        "placement": "right",
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(FormLabel, {
      props: {
        title: 'test',
      } as AcvFormLabelProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "label": undefined,
        "placement": "right",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(FormLabel);

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<label data-v-b7a8a676="" class="acv-form-label right">
        <!--v-if-->
        <!--v-if-->
      </label>"
    `);
  });
});

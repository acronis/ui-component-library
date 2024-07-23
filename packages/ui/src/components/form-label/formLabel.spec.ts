import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import FormLabel from './formLabel.vue';
import type { AcvFormLabelProps } from './formLabel';

describe('test FormLabel component', () => {
  it('default props', () => {
    const wrapper = mount(FormLabel);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "label": undefined,
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
        "label": undefined,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(FormLabel);

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<label data-v-b7a8a676="" class="acv-form-label">
        <!--v-if-->
      </label>"
    `);
  });
});

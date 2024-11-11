import type { AcvFormItemProps } from '@/components/__dev__/form-item/formItem.ts';
import FormItem from '@/components/__dev__/form-item/formItem.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('test FormItem component', () => {
  it('default props', () => {
    const wrapper = mount(FormItem);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "control": undefined,
        "title": undefined,
        "titlePlacement": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(FormItem, {
      props: {
        title: 'test',
      } as AcvFormItemProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "control": undefined,
        "title": "test",
        "titlePlacement": undefined,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(FormItem);

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-414cb91d="" class="acv-form-item"><label data-v-b7a8a676="" data-v-414cb91d="" class="acv-form-label right">
          <div data-v-d623bc49="" data-v-414cb91d="" class="acv-typography title" variant="body-large" component="span">
            <!--v-if-->
            <p data-v-d623bc49="" class="acv-text"></p>
          </div>
          <!--v-if-->
        </label>
        <!--v-if-->
        <!--v-if-->
      </div>"
    `);
  });
});

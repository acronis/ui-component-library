import type { AcvTextareaProps } from '@/components/__dev__/textarea/textarea.ts';
import Textarea from '@/components/__dev__/textarea/textarea.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('test Textarea component', () => {
  it('default props', () => {
    const wrapper = mount(Textarea);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Textarea, {
      props: {
        title: 'test',
      } as AcvTextareaProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Textarea);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-97941581="" class="acv-textarea"></div>"`);
  });
});

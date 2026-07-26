import type { AcvTagProps } from './tag';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Tag from './tag.vue';

describe('test Tag component', () => {
  it('default props', () => {
    const wrapper = mount(Tag);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "small": false,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Tag, {
      props: {
        title: 'test',
      } as AcvTagProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "small": false,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Tag);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-152c3f1b="" class="acv-tag"></div>"`);
  });
});

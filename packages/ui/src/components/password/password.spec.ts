import type { AcvPasswordProps } from './password';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Password from './password.vue';

describe('test Password component', () => {
  it('default props', () => {
    const wrapper = mount(Password);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Password, {
      props: {
        title: 'test',
      } as AcvPasswordProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Password);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-936916cb="" class="acv-password"></div>"`);
  });
});

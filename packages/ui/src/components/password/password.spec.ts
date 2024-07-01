import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Password from './password.vue';
import type { AcvPasswordProps } from './password';

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

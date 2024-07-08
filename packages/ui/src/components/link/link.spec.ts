import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Link from './link.vue';
import type { AcvLinkProps } from './link.ts';

describe('link component', () => {
  it('default props', () => {
    const wrapper = mount(Link);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "disabled": false,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Link, {
      propsData: {
        disabled: true,
      } as AcvLinkProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "disabled": true,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Link);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<a data-v-1ad4db4e="" class="acv-link" role="link"></a>"`);
  });

  it('displays content from slot', () => {
    const wrapper = mount(Link, {
      slots: {
        default: 'Click me',
      },
    });
    expect(wrapper.text()).toContain('Click me');
  });

  it('applies disabled class when disabled prop is true', () => {
    const wrapper = mount(Link, {
      propsData: {
        disabled: true,
      },
    });
    expect(wrapper.classes()).toContain('disabled');
  });

  it('does not apply disabled class when disabled prop is false', () => {
    const wrapper = mount(Link, {
      propsData: {
        disabled: false,
      },
    });
    expect(wrapper.classes()).not.toContain('disabled');
  });

  it('emits close event when clicked', async () => {
    const wrapper = mount(Link);
    await wrapper.trigger('click');

    expect(wrapper.emitted().click).toBeTruthy();
  });

  it('does not emit close event when disabled and clicked', async () => {
    const wrapper = mount(Link, {
      propsData: {
        disabled: true,
      },
    });
    await wrapper.trigger('click');
    expect(wrapper.emitted()).not.toHaveProperty('close');
  });
});

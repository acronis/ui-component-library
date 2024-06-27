import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Header from './header.vue';
import type { HeaderProps } from './header.ts';

describe('test Header component', () => {
  it('default props', () => {
    const wrapper = mount(Header);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "align": "center",
        "bordered": true,
        "color": "white",
        "height": "64px",
        "title": "",
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Header, {
      props: {
        title: 'test',
      } as HeaderProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "align": "center",
        "bordered": true,
        "color": "white",
        "height": "64px",
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Header);
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<header data-v-13c17110="" class="acv-header acv-header--bordered">
        <!--v-if-->
        <!--v-if-->
        <div data-v-13c17110="" class="acv-header__aside"></div>
      </header>"
    `);
  });

  it('bordered', () => {
    const wrapper = mount(Header, {
      props: {
        bordered: true,
      } as HeaderProps,
    });
    expect(wrapper.classes()).toContain('acv-header--bordered');
  });

  it('height', () => {
    const wrapper = mount(Header, {
      props: {
        height: '100px',
      } as HeaderProps,
    });
    expect(wrapper.attributes('style')).toMatchInlineSnapshot('undefined');
  });
});

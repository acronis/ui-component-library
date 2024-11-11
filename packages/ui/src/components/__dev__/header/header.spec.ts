import type { AcvHeaderProps } from '@/components/__dev__/header/header.ts';
import Header from '@/components/__dev__/header/header.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('test Header component', () => {
  it('default props', () => {
    const wrapper = mount(Header);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "align": "center",
        "bordered": false,
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
      } as AcvHeaderProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "align": "center",
        "bordered": false,
        "color": "white",
        "height": "64px",
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Header);
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<header data-v-a605b683="" class="acv-header acv-header--color-white" style="--a605b683-height: 64px;">
        <!--v-if-->
        <!--v-if-->
        <div data-v-a605b683="" class="acv-header__aside"></div>
      </header>"
    `);
  });

  it('bordered', () => {
    const wrapper = mount(Header, {
      props: {
        bordered: true,
      } as AcvHeaderProps,
    });
    expect(wrapper.classes()).toContain('acv-header--bordered');
  });

  it('height', () => {
    const wrapper = mount(Header, {
      props: {
        height: '100px',
      } as AcvHeaderProps,
    });
    expect(wrapper.attributes('style')).toMatchInlineSnapshot(`"--a605b683-height: 100px;"`);
  });
});

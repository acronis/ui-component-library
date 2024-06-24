import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ThemeProvider from './themeProvider.vue';
import type { AcvThemeProviderProps } from './themeProvider';

describe('test ThemeProvider component', () => {
  it('default props', () => {
    const wrapper = mount(ThemeProvider);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "tag": "div",
        "theme": undefined,
        "withBackground": true,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(ThemeProvider, {
      props: {
        theme: 'test',
      } as AcvThemeProviderProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "tag": "div",
        "theme": "test",
        "withBackground": true,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(ThemeProvider, {
      props: {
        theme: 'test',
      } as AcvThemeProviderProps,
      slots: {
        default: '<div>test</div>',
      },
    });

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-56a567aa="" class="acv-theme-provider acv-theme-test" data-theme="test">
        <div>test</div>
      </div>"
    `);
  });
});

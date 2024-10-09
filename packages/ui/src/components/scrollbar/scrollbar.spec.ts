import type { AcvScrollbarProps } from './scrollbar.ts';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AcvScrollbar from './scrollbar.vue';

describe('acvScrollbar component', () => {
  let wrapper: ReturnType<typeof mount<typeof AcvScrollbar>>;

  beforeEach(() => {
    wrapper = mount(AcvScrollbar, {
      props: {
        tag: 'section',
        options: {
          maxScrollbarLength: 50,
        },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('mount instance', async () => {
    expect(wrapper.element).toBeDefined();
  });

  it('render correct element', async () => {
    expect(wrapper.element.tagName).toBe('SECTION');
  });

  it('default props', () => {
    const wrapper = mount(AcvScrollbar);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "options": {},
        "tag": "div",
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(AcvScrollbar, {
      props: {
        tag: 'section',
      } as AcvScrollbarProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "options": {},
        "tag": "section",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(AcvScrollbar);
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-e3a4a672="" class="acv-scrollbar ps">
        <div class="ps__rail-x" style="left: 0px; top: 0px;">
          <div class="ps__thumb-x" tabindex="0" style="left: 0px; width: 0px;"></div>
        </div>
        <div class="ps__rail-y" style="top: 0px; left: 0px;">
          <div class="ps__thumb-y" tabindex="0" style="top: 0px; height: 0px;"></div>
        </div>
      </div>"
    `);
  });
});

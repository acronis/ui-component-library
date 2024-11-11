import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import { Blockquote, OL, Text, Title, UL } from '../public.ts';

const TEXT = 'Text';
const TYPES = ['primary', 'info', 'success', 'warning', 'error'] as const;

describe('typography', () => {
  it('render text', () => {
    const wrapper = mount(Text, {
      slots: {
        default: TEXT,
      },
    });

    expect(wrapper.find('.acv-text').classes()).toContain('acv-text-vars');
    expect(wrapper.find('.acv-text').text()).toEqual(TEXT);
  });

  it('text types', () => {
    TYPES.forEach((type) => {
      const wrapper = mount(Text, {
        props: {
          type,
        },
      });

      expect(wrapper.find('.acv-text').classes()).toContain(`acv-text--${type}`);
    });
  });

  it('text tag', () => {
    const wrapper = mount(Text, {
      props: {
        tag: 'p',
      },
    });

    expect(wrapper.find('.acv-text').element.tagName).toEqual('P');
  });

  it('text code', () => {
    const wrapper = mount(Text, {
      props: {
        code: true,
      },
    });

    expect(wrapper.find('.acv-text').element.tagName).toEqual('CODE');
    expect(wrapper.find('.acv-text').classes()).toContain('acv-text--code');
  });

  it('text delete', () => {
    const wrapper = mount(Text, {
      props: {
        delete: true,
      },
    });

    expect(wrapper.find('.acv-text').element.tagName).toEqual('DEL');
    expect(wrapper.find('.acv-text').classes()).toContain('acv-text--delete');
  });

  it('text code with del', () => {
    const wrapper = mount(Text, {
      props: {
        delete: true,
        code: true,
      },
    });

    expect(wrapper.find('.acv-text').element.tagName).toEqual('CODE');
    expect(wrapper.find('del').exists()).toBe(true);
  });

  it('text style props', () => {
    const wrapper = mount(Text, {
      props: {
        strong: true,
        italic: true,
        underline: true,
        mark: true,
        disabled: true,
        keyboard: true,
        thin: true,
        reversed: true,
      },
    });

    expect(wrapper.find('.acv-text').classes()).toContain('acv-text--strong');
    expect(wrapper.find('.acv-text').classes()).toContain('acv-text--italic');
    expect(wrapper.find('.acv-text').classes()).toContain('acv-text--underline');
    expect(wrapper.find('.acv-text').classes()).toContain('acv-text--mark');
    expect(wrapper.find('.acv-text').classes()).toContain('acv-text--disabled');
    expect(wrapper.find('.acv-text').classes()).toContain('acv-text--keyboard');
    expect(wrapper.find('.acv-text').classes()).toContain('acv-text--thin');
    expect(wrapper.find('.acv-text').classes()).toContain('acv-text--reversed');
  });

  it('render title', () => {
    const wrapper = mount(Title, {
      slots: {
        default: TEXT,
      },
    });

    expect(wrapper.find('.acv-title').classes()).toContain('acv-title-vars');
    expect(wrapper.find('.acv-title').text()).toEqual(TEXT);
  });

  it('title level', () => {
    ;([1, 2, 3, 4, 5, 6] as const).forEach((level) => {
      const wrapper = mount(Title, {
        props: {
          level,
        },
      });

      expect(wrapper.find('.acv-title').element.tagName).toEqual(`H${level}`);
    });
  });

  it('title types', () => {
    TYPES.forEach((type) => {
      const wrapper = mount(Title, {
        props: {
          type,
        },
      });

      expect(wrapper.find('.acv-title').classes()).toContain(`acv-title--${type}`);
    });
  });

  it('title props', () => {
    const wrapper = mount(Title, {
      props: {
        marker: true,
        aligned: true,
        thin: true,
      },
    });

    expect(wrapper.find('.acv-title').classes()).toContain('acv-title--marker');
    expect(wrapper.find('.acv-title').classes()).toContain('acv-title--aligned');
    expect(wrapper.find('.acv-title').classes()).toContain('acv-title--thin');
  });

  it.skip('title marker color', () => {
    const wrapper = mount(Title, {
      props: {
        marker: true,
        markerType: 'pink',
      },
    });

    expect(wrapper.find('.acv-title').attributes('style')).toMatchInlineSnapshot(`undefined`);
    expect(wrapper.find('.acv-title').attributes('style')).toContain(
      '--acv-title-marker-color: pink;',
    );
  });

  it('render blockquote', () => {
    const wrapper = mount(Blockquote, {
      slots: {
        default: TEXT,
      },
    });

    expect(wrapper.find('.acv-blockquote').classes()).toContain('acv-blockquote-vars');
    expect(wrapper.find('.acv-blockquote').text()).toEqual(TEXT);
  });

  it('render ol', () => {
    const wrapper = mount(OL, {
      slots: {
        default: TEXT,
      },
    });

    expect(wrapper.find('.acv-ol').exists()).toBe(true);
    // expect(wrapper.find('.acv-ol').attributes('type')).toEqual('1')
    expect(wrapper.find('.acv-ol').text()).toEqual(TEXT);
  });

  it('render ul', () => {
    const wrapper = mount(UL, {
      slots: {
        default: TEXT,
      },
    });

    expect(wrapper.find('.acv-ul').exists()).toBe(true);
    // expect(wrapper.find('.acv-ul').attributes('style')).toEqual('list-style-type: circle;')
    expect(wrapper.find('.acv-ul').text()).toEqual(TEXT);
  });

  it('ul no marker', () => {
    const wrapper = mount(UL, {
      props: {
        listStyle: 'none',
      },
    });

    expect(wrapper.find('.acv-ul').classes()).toContain('acv-ul--no-marker');
  });
});

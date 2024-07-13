import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import MarkdownEditor from './markdownEditor.vue';
import type { AcvMarkdownEditorProps } from './markdownEditor';

describe.skip('markdownEditor component', () => {
  it('default props', () => {
    const wrapper = mount(MarkdownEditor);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "height": undefined,
        "modelModifiers": undefined,
        "modelValue": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(MarkdownEditor, {
      props: {
        title: 'test',
      } as AcvMarkdownEditorProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "height": undefined,
        "modelModifiers": undefined,
        "modelValue": undefined,
      }
    `);
  });
});

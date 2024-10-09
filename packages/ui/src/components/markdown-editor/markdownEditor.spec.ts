import type { AcvMarkdownEditorProps } from './markdownEditor';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import MarkdownEditor from './markdownEditor.vue';

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

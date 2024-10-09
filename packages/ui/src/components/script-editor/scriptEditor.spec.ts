import type { AcvScriptEditorProps } from './scriptEditor';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ScriptEditor from './scriptEditor.vue';

describe('test ScriptEditor component', () => {
  it('default props', () => {
    const wrapper = mount(ScriptEditor);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(ScriptEditor, {
      props: {
        title: 'test',
      } as AcvScriptEditorProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(ScriptEditor);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-91df3ce3="" class="acv-script-editor"></div>"`);
  });
});

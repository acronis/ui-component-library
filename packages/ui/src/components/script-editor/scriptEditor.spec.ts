import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ScriptEditor from './scriptEditor.vue';
import type { AcvScriptEditorProps } from './scriptEditor';

describe('test ScriptEditor component', () => {
  it('default props', () => {
    const wrapper = mount(ScriptEditor);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(ScriptEditor, {
      props: {
        title: 'test',
      } as AcvScriptEditorProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(ScriptEditor);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

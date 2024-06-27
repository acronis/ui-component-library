import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Dialog from './dialog.vue';
import type { AcvDialogProps } from './dialog';

describe('test Dialog component', () => {
  it('default props', () => {
    const wrapper = mount(Dialog);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "bottom": undefined,
        "closable": false,
        "closeOnClick": false,
        "closeOnPressEscape": false,
        "description": undefined,
        "draggable": false,
        "height": undefined,
        "left": undefined,
        "loading": false,
        "locale": undefined,
        "lockScroll": false,
        "minHeight": undefined,
        "minWidth": undefined,
        "modal": false,
        "modalClass": undefined,
        "resizable": false,
        "right": undefined,
        "title": undefined,
        "top": undefined,
        "transitionName": undefined,
        "type": undefined,
        "width": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Dialog, {
      props: {
        title: 'test',
      } as AcvDialogProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "bottom": undefined,
        "closable": false,
        "closeOnClick": false,
        "closeOnPressEscape": false,
        "description": undefined,
        "draggable": false,
        "height": undefined,
        "left": undefined,
        "loading": false,
        "locale": undefined,
        "lockScroll": false,
        "minHeight": undefined,
        "minWidth": undefined,
        "modal": false,
        "modalClass": undefined,
        "resizable": false,
        "right": undefined,
        "title": "test",
        "top": undefined,
        "transitionName": undefined,
        "type": undefined,
        "width": undefined,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Dialog);
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-d2f715b5="" class="acv-dialog">
        <!--
            @slot description - The description slot content
            @binding {string} description - The description prop value
          -->
      </div>"
    `);
  });
});

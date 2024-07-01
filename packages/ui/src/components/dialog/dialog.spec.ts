import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Dialog from './dialog.vue';
import type { AcvDialogProps } from './dialog';

describe('test Dialog component', () => {
  it('default props', () => {
    const wrapper = mount(Dialog);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "backdrop": true,
        "closable": true,
        "closeOnClickOutside": true,
        "closeOnEscape": true,
        "draggable": false,
        "height": undefined,
        "locale": undefined,
        "lockScroll": false,
        "modelModifiers": undefined,
        "modelValue": false,
        "title": undefined,
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
        "backdrop": true,
        "closable": true,
        "closeOnClickOutside": true,
        "closeOnEscape": true,
        "draggable": false,
        "height": undefined,
        "locale": undefined,
        "lockScroll": false,
        "modelModifiers": undefined,
        "modelValue": false,
        "title": "test",
        "type": undefined,
        "width": undefined,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Dialog);
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<dialog data-v-d2f715b5="" class="acv-dialog backdrop" autofocus="" role="alertdialog" aria-labelledby="label-area" aria-describedby="content-area" aria-modal="true" aria-hidden="true"><button data-v-d2f715b5="" class="dialog-close"> X </button>
        <section data-v-d2f715b5="" class="body">
          <!--v-if-->
          <main data-v-d2f715b5="" id="content-area">
            <div data-v-d2f715b5="" class="scrollable"></div>
          </main>
          <!--v-if-->
        </section>
      </dialog>"
    `);
  });
});

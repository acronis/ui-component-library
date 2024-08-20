import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ConfirmDialog from './confirmDialog.vue';
import type { AcvConfirmDialogProps } from './confirmDialog';

describe('test ConfirmDialog component', () => {
  it('default props', () => {
    const wrapper = mount(ConfirmDialog);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        title: 'test',
      } as AcvConfirmDialogProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(ConfirmDialog);

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<dialog data-v-d2f715b5="" data-v-ecec16b9="" class="acv-dialog backdrop height-small width-small acv-confirm-dialog" autofocus="" role="alertdialog" aria-labelledby="label-area" aria-describedby="content-area" aria-modal="true" aria-hidden="true"><button data-v-d2f715b5="" class="dialog-close"><svg data-v-d2f715b5="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" class="acv-icon">
            <path fill="currentColor" d="M2.295 12.278a1.008 1.008 0 1 0 1.427 1.427L8 9.426l4.278 4.279a1.008 1.008 0 1 0 1.427-1.427L9.426 8l4.279-4.278a1.008 1.008 0 1 0-1.427-1.427L8 6.574 3.722 2.295a1.008 1.008 0 1 0-1.427 1.427L6.574 8l-4.279 4.278Z"></path>
          </svg></button>
        <section data-v-d2f715b5="" class="body">
          <!--v-if-->
          <main data-v-d2f715b5="" id="content-area">
            <div data-v-d2f715b5="" class="scrollable"></div>
          </main>
          <footer data-v-d2f715b5="">
            <menu data-v-ecec16b9=""><button data-v-7a9642c5="" data-v-ecec16b9="" type="button" class="acv-button solid medium primary" value="cancel">
                <!--v-if-->
                <!--v-if--><span data-v-7a9642c5="" class="content"> Cancel </span>
                <!--v-if-->
              </button><button data-v-7a9642c5="" data-v-ecec16b9="" type="button" class="acv-button solid medium primary" value="confirm">
                <!--v-if-->
                <!--v-if--><span data-v-7a9642c5="" class="content"> Confirm </span>
                <!--v-if-->
              </button></menu>
          </footer>
        </section>
      </dialog>"
    `);
  });
});

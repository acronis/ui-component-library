import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import FormDialog from './formDialog.vue';
import type { AcvFormDialogProps } from './formDialog';

describe('test FormDialog component', () => {
  it('default props', () => {
    const wrapper = mount(FormDialog);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(FormDialog, {
      props: {
        title: 'test',
      } as AcvFormDialogProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(FormDialog);

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<dialog data-v-d2f715b5="" data-v-db4a95e1="" class="acv-dialog backdrop height-small width-small acv-form-dialog" autofocus="" role="alertdialog" aria-labelledby="label-area" aria-describedby="content-area" aria-modal="true" aria-hidden="true">
        <section data-v-d2f715b5="" class="body">
          <!--v-if-->
          <main data-v-d2f715b5="" id="content-area">
            <div data-v-d2f715b5="" class="scrollable">
              <form data-v-db4a95e1="" method="dialog"></form>
            </div>
          </main>
          <!--v-if-->
        </section>
      </dialog>"
    `);
  });
});

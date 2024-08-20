import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Dialog from './dialog.vue';
import type { AcvDialogProps } from './dialog';

describe('test Dialog component', () => {
  beforeAll(() => {
    HTMLDialogElement.prototype.show = vi.fn(function (this: HTMLDialogElement) {
      this.open = true;
    });
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      this.open = true;
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.open = false;
    });
  });

  it('default props', () => {
    const wrapper = mount(Dialog);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "backdrop": true,
        "closable": true,
        "closeOnClickOutside": true,
        "closeOnEscape": true,
        "draggable": false,
        "height": "small",
        "lockFocus": true,
        "lockScroll": false,
        "modelModifiers": undefined,
        "modelValue": false,
        "title": undefined,
        "type": undefined,
        "width": "small",
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
        "height": "small",
        "lockFocus": true,
        "lockScroll": false,
        "modelModifiers": undefined,
        "modelValue": false,
        "title": "test",
        "type": undefined,
        "width": "small",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Dialog);
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<dialog data-v-d2f715b5="" class="acv-dialog backdrop height-small width-small" autofocus="" role="alertdialog" aria-labelledby="label-area" aria-describedby="content-area" aria-modal="true" aria-hidden="true">
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

  it('renders title slot content', () => {
    const wrapper = mount(Dialog, {
      slots: { title: '<div>Custom Title</div>' },
    });
    expect(wrapper.html()).toContain('<div>Custom Title</div>');
  });

  it('renders footer slot content', () => {
    const wrapper = mount(Dialog, {
      slots: { footer: '<div>Footer Content</div>' },
    });
    expect(wrapper.html()).toContain('<div>Footer Content</div>');
  });

  it('emits update:modelValue false when close button is clicked', async () => {
    const wrapper = mount(Dialog, {
      props: { closable: true, modelValue: true, title: 'test' } as AcvDialogProps,
    });
    await nextTick();
    await wrapper.find('.close').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
  });

  // TODO: Switch to happy-dom for testing, https://github.com/jsdom/jsdom/issues/3294
  it.skip('does not emit update:modelValue when close button is clicked if closable is false', async () => {
    const wrapper = mount(Dialog, {
      props: { closable: false, modelValue: true, title: 'test' } as AcvDialogProps,
    });
    await nextTick();
    await wrapper.find('.close').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('applies correct class for draggable dialog', () => {
    const wrapper = mount(Dialog, {
      props: { draggable: true } as AcvDialogProps,
    });
    expect(wrapper.classes()).toContain('draggable');
  });

  it('applies correct class for non-draggable dialog', () => {
    const wrapper = mount(Dialog, {
      props: { draggable: false } as AcvDialogProps,
    });
    expect(wrapper.classes()).not.toContain('draggable');
  });

  it('applies correct class for height and width props', () => {
    const wrapper = mount(Dialog, {
      props: { height: 'large', width: 'medium' } as AcvDialogProps,
    });
    expect(wrapper.classes()).toContain('height-large');
    expect(wrapper.classes()).toContain('width-medium');
  });

  // TODO: Switch to happy-dom for testing
  it.skip('closes dialog on Escape key press when closeOnEscape is true', async () => {
    const wrapper = mount(Dialog, {
      props: { closeOnEscape: true, modelValue: true, title: 'test' } as AcvDialogProps,
    });
    await nextTick();
    await wrapper.trigger('keydown.esc');
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
  });

  it('does not close dialog on Escape key press when closeOnEscape is false', async () => {
    const wrapper = mount(Dialog, {
      props: { closeOnEscape: false, modelValue: true } as AcvDialogProps,
    });
    await wrapper.trigger('keydown.esc');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  // TODO: Switch to happy-dom for testing
  it.skip('closes dialog on outside click when closeOnClickOutside is true', async () => {
    const wrapper = mount(Dialog, {
      props: { closeOnClickOutside: true, modelValue: true, title: 'test' } as AcvDialogProps,
    });
    expect(wrapper.element).toMatchInlineSnapshot(`
      <dialog
        aria-describedby="content-area"
        aria-hidden="false"
        aria-labelledby="label-area"
        aria-modal="true"
        autofocus=""
        class="acv-dialog backdrop height-small width-small"
        data-v-d2f715b5=""
        open=""
        role="alertdialog"
      >
        <section
          class="body"
          data-v-d2f715b5=""
        >
          <header
            data-v-d2f715b5=""
          >
            <h2
              data-v-d2f715b5=""
              id="label-area"
            >
              
              test
              
            </h2>
            <button
              class="acv-button ghost medium primary close"
              data-v-7a9642c5=""
              data-v-d2f715b5=""
              type="button"
            >
              <!--v-if-->
              <!--v-if-->
              <span
                class="content"
                data-v-7a9642c5=""
              >
                
                <svg
                  class="acv-icon"
                  data-v-d2f715b5=""
                  fill="none"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.295 12.278a1.008 1.008 0 1 0 1.427 1.427L8 9.426l4.278 4.279a1.008 1.008 0 1 0 1.427-1.427L9.426 8l4.279-4.278a1.008 1.008 0 1 0-1.427-1.427L8 6.574 3.722 2.295a1.008 1.008 0 1 0-1.427 1.427L6.574 8l-4.279 4.278Z"
                    fill="currentColor"
                  />
                </svg>
                
              </span>
              <!--v-if-->
            </button>
          </header>
          <main
            data-v-d2f715b5=""
            id="content-area"
          >
            <div
              class="scrollable"
              data-v-d2f715b5=""
            >
              
              
            </div>
          </main>
          <!--v-if-->
        </section>
      </dialog>
    `);
    await wrapper.trigger('click.outside');

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
  });

  it('does not close dialog on outside click when closeOnClickOutside is false', async () => {
    const wrapper = mount(Dialog, {
      props: { closeOnClickOutside: false, modelValue: true } as AcvDialogProps,
    });
    await wrapper.trigger('click.outside');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });
});

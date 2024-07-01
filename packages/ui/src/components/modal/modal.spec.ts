import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Modal from './modal.vue';
import type { AcvModalProps } from './modal';

describe('test Modal component', () => {
  it('default props', () => {
    const wrapper = mount(Modal);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Modal, {
      props: {
        title: 'test',
      } as AcvModalProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Modal);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-ba0b771c="" class="acv-modal"></div>"`);
  });
});

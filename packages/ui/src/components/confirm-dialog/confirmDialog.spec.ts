import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ConfirmDialog from './confirmDialog.vue';
import type { AcvConfirmDialogProps } from './confirmDialog';

describe('test ConfirmDialog component', () => {
  it('default props', () => {
    const wrapper = mount(ConfirmDialog);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        title: 'test',
      } as AcvConfirmDialogProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(ConfirmDialog);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

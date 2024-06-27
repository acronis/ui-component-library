import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import FormDialog from './formDialog.vue';
import type { AcvFormDialogProps } from './formDialog';

describe('test FormDialog component', () => {
  it('default props', () => {
    const wrapper = mount(FormDialog);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(FormDialog, {
      props: {
        title: 'test',
      } as AcvFormDialogProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(FormDialog);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

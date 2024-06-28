import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SplitButton from './splitButton.vue';
import type { AcvSplitButtonProps } from './splitButton';

describe('test SplitButton component', () => {
  it('default props', () => {
    const wrapper = mount(SplitButton);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(SplitButton, {
      props: {
        title: 'test',
      } as AcvSplitButtonProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(SplitButton);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-851b7187="" class="acv-split-button"></div>"`);
  });
});

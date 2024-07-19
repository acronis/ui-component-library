import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Spinner from './spinner.vue';
import type { AcvSpinnerProps } from './spinner';

describe('test Spinner component', () => {
  it('default props', () => {
    const wrapper = mount(Spinner);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "color": "brand-primary",
        "size": "16",
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Spinner, {
      props: {
        title: 'test',
      } as AcvSpinnerProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "color": "brand-primary",
        "size": "16",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Spinner);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<span data-v-5ffbe806="" class="acv-spinner size-16 color-brand-primary"></span>"`);
  });
});

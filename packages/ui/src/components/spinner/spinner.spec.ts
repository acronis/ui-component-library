import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Spinner from './spinner.vue';
import type { AcvSpinnerProps } from './spinner';

describe('test Spinner component', () => {
  it('default props', () => {
    const wrapper = mount(Spinner);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
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
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Spinner);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-5ffbe806="" class="acv-spinner"></div>"`);
  });
});

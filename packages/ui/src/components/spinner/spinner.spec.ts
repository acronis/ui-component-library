import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Spinner from './spinner.vue';
import type { AcvSpinnerProps } from './spinner';

describe('test Spinner component', () => {
  it('default props', () => {
    const wrapper = mount(Spinner);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "color": "primary",
        "size": "small",
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
        "color": "primary",
        "size": "small",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Spinner);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<span data-v-5ffbe806="" class="acv-spinner small acv-border-primary" style="--5ffbe806-borderColor: var(--acv-color-primary);"></span>"`);
  });

  it('applies correct class for small size', () => {
    const wrapper = mount(Spinner, {
      props: { size: 'small' } as AcvSpinnerProps,
    });
    expect(wrapper.classes()).toContain('small');
  });

  it('applies correct class for medium size', () => {
    const wrapper = mount(Spinner, {
      props: { size: 'medium' } as AcvSpinnerProps,
    });
    expect(wrapper.classes()).toContain('medium');
  });

  it('applies correct class for large size', () => {
    const wrapper = mount(Spinner, {
      props: { size: 'large' } as AcvSpinnerProps,
    });
    expect(wrapper.classes()).toContain('large');
  });

  it('applies correct class for x-large size', () => {
    const wrapper = mount(Spinner, {
      props: { size: 'x-large' } as AcvSpinnerProps,
    });
    expect(wrapper.classes()).toContain('x-large');
  });

  it('applies correct border color based on color prop', () => {
    const wrapper = mount(Spinner, {
      props: { color: 'secondary' } as AcvSpinnerProps,
    });
    expect(wrapper.classes()).toContain('acv-border-secondary');
  });
});

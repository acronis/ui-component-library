import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Loading from './loading.vue';
import type { AcvLoadingProps } from './loading.ts';

describe('test Loading component', () => {
  it('render with default props', () => {
    const wrapper = mount(Loading);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "background": "primary",
        "color": "primary",
        "description": undefined,
        "fullscreen": false,
        "modelValue": false,
        "opacity": 0.5,
        "size": "medium",
        "textColor": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Loading, {
      props: {
        title: 'test',
      } as AcvLoadingProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "background": "primary",
        "color": "primary",
        "description": undefined,
        "fullscreen": false,
        "modelValue": false,
        "opacity": 0.5,
        "size": "medium",
        "textColor": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Loading);

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-5fb9b424="" class="acv-loading" style="display: none; --5fb9b424-backgroundColor: var(--acv-color-primary);">
        <div data-v-5fb9b424="" class="backdrop color-primary" style="opacity: 0.5;"></div>
        <div data-v-5fb9b424="" class="content"><span data-v-5ffbe806="" data-v-5fb9b424="" class="acv-spinner medium acv-border-primary" style="--5ffbe806-borderColor: var(--acv-color-primary);"></span>
          <!--v-if-->
          <!--v-if-->
        </div>
      </div>"
    `);
  });

  it('renders with custom title', () => {
    const wrapper = mount(Loading, {
      props: { title: 'Loading...' } as AcvLoadingProps,
    });
    expect(wrapper.html()).toContain('Loading...');
  });

  it('renders with custom description', () => {
    const wrapper = mount(Loading, {
      props: { description: 'Please wait' } as AcvLoadingProps,
    });
    expect(wrapper.html()).toContain('Please wait');
  });

  it('applies correct class for fullscreen mode', () => {
    const wrapper = mount(Loading, {
      props: { fullscreen: true } as AcvLoadingProps,
    });
    expect(wrapper.find('.acv-loading').classes()).toContain('fullscreen');
  });

  it('applies correct opacity for backdrop', () => {
    const wrapper = mount(Loading, {
      props: { opacity: 0.8 } as AcvLoadingProps,
    });
    expect(wrapper.find('.backdrop').attributes('style')).toContain('opacity: 0.8');
  });

  it('applies correct background color class', () => {
    const wrapper = mount(Loading, {
      props: { background: 'secondary' } as AcvLoadingProps,
    });
    expect(wrapper.find('.backdrop').classes()).toContain('color-secondary');
  });

  it('renders spinner with correct size and color', () => {
    const wrapper = mount(Loading, {
      props: { size: 'large', color: 'secondary' } as AcvLoadingProps,
    });
    const spinner = wrapper.findComponent({ name: 'AcvSpinner' });
    expect(spinner.props('size')).toBe('large');
    expect(spinner.props('color')).toBe('secondary');
  });
});

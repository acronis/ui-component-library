import type { AcvAsideProps } from './aside.ts';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import Aside from './aside.vue';

describe('test Aside component', () => {
  it('default props', () => {
    const wrapper = mount(Aside);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "anchor": "left",
        "animated": true,
        "ariaLabel": undefined,
        "ariaLabelledby": undefined,
        "collapsible": false,
        "color": undefined,
        "customClass": undefined,
        "elevation": false,
        "modelValue": true,
        "persistent": false,
        "position": "static",
        "responsive": true,
        "size": undefined,
      }
    `);
  });

  it('renders with default content', () => {
    const wrapper = mount(Aside, {
      slots: {
        default: 'Test content'
      }
    });
    expect(wrapper.text()).toContain('Test content');
    expect(wrapper.classes()).toContain('acv-aside');
    expect(wrapper.classes()).toContain('acv-aside--anchor-left');
  });

  it('applies color class when color prop is provided', () => {
    const wrapper = mount(Aside, {
      props: {
        color: 'primary',
      },
    });
    expect(wrapper.classes()).toContain('acv-aside--color-primary');
  });

  it('applies anchor positioning classes', async () => {
    const wrapper = mount(Aside, {
      props: {
        anchor: 'right',
      } as AcvAsideProps
    });

    await nextTick();

    expect(wrapper.classes()).toContain('acv-aside--anchor-right');
  });

  it('applies position classes', async () => {
    const wrapper = mount(Aside, {
      props: {
        position: 'fixed',
      } as AcvAsideProps
    });

    await nextTick();

    expect(wrapper.classes()).toContain('acv-aside--position-fixed');
  });

  it('shows elevation when elevation prop is true', () => {
    const wrapper = mount(Aside, {
      props: {
        elevation: true,
      } as AcvAsideProps,
    });
    expect(wrapper.classes()).toContain('acv-aside--elevation');
  });

  it('applies custom class', () => {
    const wrapper = mount(Aside, {
      props: {
        customClass: 'my-custom-class',
      } as AcvAsideProps,
    });
    expect(wrapper.classes()).toContain('my-custom-class');
  });

  it('renders header and footer slots', () => {
    const wrapper = mount(Aside, {
      slots: {
        header: 'Header content',
        footer: 'Footer content',
        default: 'Main content'
      }
    });

    expect(wrapper.find('.acv-aside__header').text()).toBe('Header content');
    expect(wrapper.find('.acv-aside__footer').text()).toBe('Footer content');
    expect(wrapper.find('.acv-aside__content').text()).toBe('Main content');
  });

  it('handles collapsible functionality when collapsed', async () => {
    const wrapper = mount(Aside, {
      props: {
        collapsible: true,
        modelValue: false,
      } as AcvAsideProps,
    });

    // When collapsible is true and modelValue is false, the aside should not be rendered
    expect(wrapper.find('aside').exists()).toBe(false);
  });

  it('handles collapsible functionality when expanded', async () => {
    const wrapper = mount(Aside, {
      props: {
        collapsible: true,
        modelValue: true,
      } as AcvAsideProps,
    });

    // When collapsible is true and modelValue is true, the aside should be rendered with correct classes
    expect(wrapper.find('aside').exists()).toBe(true);
    expect(wrapper.classes()).toContain('acv-aside--collapsible');
    expect(wrapper.classes()).not.toContain('acv-aside--collapsed');
  });

  it('emits events on toggle', async () => {
    const wrapper = mount(Aside, {
      props: {
        collapsible: true,
        modelValue: true,
      } as AcvAsideProps,
    });

    // Get the component instance to call toggle
    const component = wrapper.vm as any;
    component.toggle();

    await nextTick();

    const emitted = wrapper.emitted();
    expect(emitted['update:modelValue']).toEqual([[false]]);
    expect(emitted.toggle).toEqual([[false]]);
    expect(emitted.close).toEqual([[]]);
  });

  it('emits open event when toggling from closed to open', async () => {
    const wrapper = mount(Aside, {
      props: {
        collapsible: true,
        modelValue: false,
      } as AcvAsideProps,
    });

    // Initially the aside should not be rendered
    expect(wrapper.find('aside').exists()).toBe(false);

    // Toggle to open
    const component = wrapper.vm as any;
    component.toggle();

    await nextTick();

    const emitted = wrapper.emitted();
    expect(emitted['update:modelValue']).toEqual([[true]]);
    expect(emitted.toggle).toEqual([[true]]);
    expect(emitted.open).toEqual([[]]);
  });

  it('emits close event when modelValue changes to false', async () => {
    const wrapper = mount(Aside, {
      props: {
        collapsible: true,
        modelValue: true,
      } as AcvAsideProps,
    });

    await wrapper.setProps({ modelValue: false });

    const emitted = wrapper.emitted();
    expect(emitted.close).toBeTruthy();
  });

  it('sets accessibility attributes', () => {
    const wrapper = mount(Aside, {
      props: {
        ariaLabel: 'Sidebar navigation',
        ariaLabelledby: 'sidebar-title',
      } as AcvAsideProps,
    });

    const aside = wrapper.find('aside');
    expect(aside.attributes('aria-label')).toBe('Sidebar navigation');
    expect(aside.attributes('aria-labelledby')).toBe('sidebar-title');
  });

  it('applies width dimension as CSS variable', async () => {
    const wrapper = mount(Aside, {
      props: {
        size: '250px',
      } as AcvAsideProps
    });

    await nextTick();

    const aside = wrapper.find('aside');
    expect(aside.attributes('style')).toContain('--acv-aside-dimension: 250px');
  });

  it('converts numeric width to pixels', async () => {
    const wrapper = mount(Aside, {
      props: {
        size: '250',
      } as AcvAsideProps
    });

    await nextTick();

    const aside = wrapper.find('aside');
    expect(aside.attributes('style')).toContain('--acv-aside-dimension: 250px');
  });
});

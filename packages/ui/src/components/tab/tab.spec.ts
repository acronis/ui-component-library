import AcvTab from '@/components/tab/tab.vue';
import { TABS_KEY } from '@/components/tabs/tabs.ts';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

describe('acvTab', () => {
  it('renders tab with label', () => {
    const wrapper = mount(AcvTab, {
      props: { label: 'Tab 1' }
    });
    expect(wrapper.text()).toContain('Tab 1');
  });

  it('applies active class when tab is selected', () => {
    const wrapper = mount(AcvTab, {
      props: { label: 'Tab 1' },
      global: {
        provide: {
          [TABS_KEY as any]: { selectedTab: ref('Tab 1') }
        }
      }
    });
    expect(wrapper.classes()).toContain('active');
  });

  it('applies disabled class when tab is disabled', () => {
    const wrapper = mount(AcvTab, {
      props: { label: 'Tab 1', disabled: true }
    });
    expect(wrapper.classes()).toContain('disabled');
  });

  it('renders icon when provided', () => {
    const wrapper = mount(AcvTab, {
      props: { label: 'Tab 1', icon: 'icon-name' },
      slots: {
        prepend: '<span class="icon">icon-name</span>'
      }
    });
    expect(wrapper.find('.icon').exists()).toBe(true);
  });

  it('renders append icon when provided', () => {
    const wrapper = mount(AcvTab, {
      props: { label: 'Tab 1', appendIcon: 'append-icon-name' },
      slots: {
        append: '<span class="append-icon">append-icon-name</span>'
      }
    });
    expect(wrapper.find('.append-icon').exists()).toBe(true);
  });

  it('sets aria-selected attribute correctly', () => {
    const wrapper = mount(AcvTab, {
      props: { label: 'Tab 1' },
      global: {
        provide: {
          [TABS_KEY as any]: { selectedTab: ref('Tab 1') }
        }
      }
    });
    expect(wrapper.attributes('aria-selected')).toBe('true');
  });

  it('sets tabindex attribute correctly', () => {
    const wrapper = mount(AcvTab, {
      props: { label: 'Tab 1' },
      global: {
        provide: {
          [TABS_KEY as any]: { selectedTab: ref('Tab 2') }
        }
      }
    });
    expect(wrapper.attributes('tabindex')).toBe('-1');
  });
});

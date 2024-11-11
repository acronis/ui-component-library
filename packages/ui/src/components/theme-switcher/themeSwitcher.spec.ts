import AcvButton from '@/components/button/button.vue';
import AcvDropdown from '@/components/dropdown/dropdown.vue';
import ThemeSwitcher from '@/components/theme-switcher/themeSwitcher.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/composables/useColorScheme.ts', { spy: true });

describe('themeSwitcher', () => {
  beforeEach(() => {
    // you can access variables inside a factory
    vi.doMock('@/composables/useColorScheme.ts', () => ({ setColorScheme: vi.fn() }));
  });

  it('renders button with correct text', () => {
    const wrapper = mount(ThemeSwitcher);
    const button = wrapper.findComponent(AcvButton);
    expect(button.text()).toBe('Change color scheme');
  });

  it('renders dropdown with color schemes', async () => {
    const wrapper = mount(ThemeSwitcher);
    const button = wrapper.findComponent(AcvButton);
    await button.trigger('click');
    const dropdown = wrapper.findComponent(AcvDropdown);
    expect(dropdown.exists()).toBe(true);
    expect(dropdown.text()).toContain('light');
    expect(dropdown.text()).toContain('dark');
  });
});

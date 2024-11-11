import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AcvDivider from '../divider/divider.vue';
import AcvFooter from '../footer/footer.vue';

describe('acvFooter', () => {
  it('should render slots', () => {
    const wrapper = mount(AcvFooter, {
      slots: {
        default: 'Test default slot content',
        side: 'Test side slot content',
      },
    });

    expect(wrapper.html()).toContain('Test default slot content');
    expect(wrapper.html()).toContain('Test side slot content');
  });

  it('should render AcvDivider', () => {
    const wrapper = mount(AcvFooter);
    const divider = wrapper.findComponent(AcvDivider);

    expect(divider.exists()).toBe(true);
  });
});

import type { Directive } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { vTooltip } from '../tooltip';

describe('vTooltip directive', () => {
  const TestComponent = {
    template: `<div v-tooltip="{ content: 'Tooltip content', trigger: 'hover' }">Hover me</div>`,
  };

  it('displays tooltip content on hover', async () => {
    const wrapper = mount(TestComponent, {
      attachTo: document.body,
      global: {
        directives: {
          Tooltip: vTooltip as Directive
        }
      }
    });
    await wrapper.trigger('mouseenter');
    expect(document.body.innerHTML).toContain('Tooltip content');
  });

  it('removes tooltip content on mouseleave', async () => {
    const wrapper = mount(TestComponent, {
      attachTo: document.body,
      global: {
        directives: {
          Tooltip: vTooltip as Directive
        }
      }
    });
    await wrapper.trigger('mouseenter');
    await wrapper.trigger('mouseleave');
    const tooltip = wrapper.find('.acv-popper');
    expect(tooltip.isVisible()).toBe(false);
  });

  it('does not display tooltip for disabled element', async () => {
    const DisabledTestComponent = {
      template: `<div v-tooltip="{ content: 'Disabled tooltip', trigger: 'hover', disabled: true }">Cannot hover me</div>`,
    };
    const wrapper = mount(DisabledTestComponent, {
      attachTo: document.body,
      global: {
        directives: {
          Tooltip: vTooltip as Directive
        }
      }
    });
    await wrapper.trigger('mouseenter');
    const tooltip = wrapper.find('.acv-popper');
    expect(tooltip.isVisible()).toBe(false);
  });

  it('supports dynamic tooltip content', async () => {
    const DynamicContentComponent = {
      template: `<div v-tooltip="{ content: dynamicContent, trigger: 'hover' }">Hover me</div>`,
      data() {
        return {
          dynamicContent: 'Initial content',
        };
      },
    };
    const wrapper = mount(DynamicContentComponent, {
      attachTo: document.body,
      global: {
        directives: {
          Tooltip: vTooltip as Directive
        }
      }
    });
    await wrapper.trigger('mouseenter');
    expect(document.body.innerHTML).toContain('Initial content');
    wrapper.setData({ dynamicContent: 'Updated content' });
    await wrapper.trigger('mouseenter');
    expect(document.body.innerHTML).toContain('Updated content');
  });

  it('applies custom placement', async () => {
    const CustomPlacementComponent = {
      template: `<div v-tooltip="{ content: 'Custom placement', trigger: 'hover', placement: 'bottom' }">Hover me</div>`,
    };
    const wrapper = mount(CustomPlacementComponent, {
      attachTo: document.body,
      global: {
        directives: {
          Tooltip: vTooltip as Directive
        }
      }
    });
    await wrapper.trigger('mouseenter');
    const tooltip = wrapper.find('.acv-popper');

    expect(tooltip.attributes('data-placement')).toEqual('bottom');
  });
});

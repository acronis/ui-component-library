import type { AcvChipProps } from './chip.ts';
import { IconClose16 } from '@acronis-platform/icons/close';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Chip from './chip.vue';

describe('test chip component', () => {
  it('default props', () => {
    const wrapper = mount(Chip);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "icon": undefined,
        "showClose": false,
        "showHoverHint": false,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Chip, {
      props: {
        title: 'test',
      } as AcvChipProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "icon": undefined,
        "showClose": false,
        "showHoverHint": false,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Chip);
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-b16f119d="" class="acv-chip">
        <!--v-if--><span data-v-b16f119d="" class="text"></span>
        <!--v-if-->
      </div>"
    `);
  });

  it('renders icon when provided', () => {
    const wrapper = mount(Chip, {
      props: { icon: 'IconName' },
    });
    expect(wrapper.find('.icon').exists()).toBe(true);
  });

  it('renders close icon when showClose is true', () => {
    const wrapper = mount(Chip, {
      props: { showClose: true },
    });
    expect(wrapper.findComponent(IconClose16).exists()).toBe(true);
  });

  it('emits close event when close icon is clicked', async () => {
    const wrapper = mount(Chip, {
      props: { showClose: true },
    });
    await wrapper.findComponent(IconClose16).trigger('click');
    expect(wrapper.emitted()).toHaveProperty('close');
  });

  it('sets title attribute when showHoverHint is true', () => {
    const wrapper = mount(Chip, {
      props: { showHoverHint: true },
      slots: { default: 'Chip Content' },
    });
    expect(wrapper.find('.text').attributes('title')).toBe('Chip Content');
  });

  it('does not set title attribute when showHoverHint is false', () => {
    const wrapper = mount(Chip, {
      props: { showHoverHint: false },
      slots: { default: 'Chip Content' },
    });
    expect(wrapper.find('.text').attributes('title')).toBeUndefined();
  });
});

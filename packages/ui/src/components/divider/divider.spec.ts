import type { AcvDividerProps } from './divider.ts';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AcvDivider from './divider.vue';

const TEXT = 'Text';

describe('test divider component', () => {
  it('default props', () => {
    const wrapper = mount(AcvDivider);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "color": undefined,
        "margin": undefined,
        "textPosition": undefined,
        "vertical": false,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(AcvDivider, {
      props: {
        color: 'brand',
      } as AcvDividerProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "color": "brand",
        "margin": undefined,
        "textPosition": undefined,
        "vertical": false,
      }
    `);
  });

  it('render', () => {
    const wrapper = mount(AcvDivider);

    expect(wrapper.classes()).toContain('acv-divider--horizontal');
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-db039be1="" class="acv-divider acv-divider--horizontal" role="separator" aria-hidden="true" aria-orientation="horizontal">
        <!--v-if-->
      </div>"
    `);
  });

  it('vertical', () => {
    const wrapper = mount(AcvDivider, {
      props: { vertical: true },
    });

    expect(wrapper.find('.acv-divider').classes()).toContain('acv-divider--vertical');
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-db039be1="" class="acv-divider acv-divider--vertical" role="separator" aria-hidden="true" aria-orientation="vertical">
        <!--v-if-->
      </div>"
    `);
  });

  it('with text', async () => {
    const wrapper = mount(AcvDivider, {
      slots: {
        default: () => TEXT,
      },
    });

    expect(wrapper.classes()).toContain('acv-divider--with-text');

    await wrapper.setProps({ vertical: true });

    expect(wrapper.find('.acv-divider').classes()).not.toContain('acv-divider--with-text');
  });

  it('text position', () => {
    (['center', 'left', 'right'] as const).forEach((position) => {
      const wrapper = mount(AcvDivider, {
        props: {
          textPosition: position,
        },
        slots: {
          default: () => TEXT,
        },
      });

      if (position === 'center') {
        expect(wrapper.find('.acv-divider').classes()).not.toContain(
          'acv-divider--with-text-center',
        );
      }
      else {
        expect(wrapper.find('.acv-divider').classes()).toContain(
          `acv-divider--with-text-${position}`,
        );
      }
    });
  });

  it('margin', async () => {
    const wrapper = mount(AcvDivider, {
      props: { margin: 10 },
    });

    expect(wrapper.find('.acv-divider').attributes('style')).toContain('margin-top: 10px;');
    expect(wrapper.find('.acv-divider').attributes('style')).toContain('margin-bottom: 10px;');

    await wrapper.setProps({ vertical: true });

    expect(wrapper.attributes('style')).toMatchInlineSnapshot(`"margin-right: 10px; margin-left: 10px;"`);
    expect(wrapper.attributes('style')).not.toContain('margin-top');
    expect(wrapper.attributes('style')).not.toContain('margin-bottom');
    expect(wrapper.attributes('style')).toContain('margin-right: 10px;');
    expect(wrapper.attributes('style')).toContain('margin-left: 10px;');
  });
});

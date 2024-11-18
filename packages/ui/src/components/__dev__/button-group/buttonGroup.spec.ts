import type { ButtonGroupProps } from '@/components/__dev__/button-group/buttonGroup.ts';
import ButtonGroup from '@/components/__dev__/button-group/buttonGroup.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

describe('test ButtonGroup component', () => {
  it('pass accessibility tests', async () => {
    const wrapper = mount(ButtonGroup);

    expect(await axe(wrapper.element)).toHaveNoViolations();
  });

  it('default props', () => {
    const wrapper = mount(ButtonGroup);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "size": undefined,
        "vertical": false,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(ButtonGroup, {
      props: {
        title: 'test',
      } as ButtonGroupProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "size": undefined,
        "vertical": false,
      }
    `);
  });

  it('default classes', () => {
    const wrapper = mount(ButtonGroup);

    expect(wrapper.classes()).toMatchInlineSnapshot(`
      [
        "acv-button-group",
      ]
    `);
  });

  it('custom classes', () => {
    const wrapper = mount(ButtonGroup, {
      props: {
        size: 'large',
        vertical: true
      }
    });

    expect(wrapper.classes()).toMatchInlineSnapshot(`
      [
        "acv-button-group-vertical",
        "acv-button-group-size-large",
      ]
    `);
  });

  it('default slot', () => {
    const wrapper = mount(ButtonGroup, {
      slots: {
        default: 'Default slot',
      },
    });

    expect(wrapper.text()).toMatchInlineSnapshot('"Default slot"');
  });

  it('renders correctly', () => {
    const wrapper = mount(ButtonGroup);
    expect(wrapper.html()).toMatchInlineSnapshot(`"<nav data-v-4c93b7c2="" class="acv-button-group"></nav>"`);
  });
});

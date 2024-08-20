import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Switch from './switch.vue';
import type { AcvSwitchProps } from './switch';

describe('test Switch component', () => {
  it('default props', () => {
    const wrapper = mount(Switch);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "color": undefined,
        "disabled": false,
        "label": undefined,
        "modelModifiers": undefined,
        "modelValue": undefined,
        "size": "large",
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Switch, {
      props: {
        label: 'test',
      } as AcvSwitchProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "color": undefined,
        "disabled": false,
        "label": "test",
        "modelModifiers": undefined,
        "modelValue": undefined,
        "size": "large",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Switch);

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<label data-v-411e8d7f="" class="acv-switch checked large"><span data-v-411e8d7f="" class="acv-switch__input"><input data-v-411e8d7f="" checked="" aria-disabled="false" type="checkbox" role="switch" class="visually-hidden"><span data-v-411e8d7f="" class="acv-switch__thumb" aria-hidden="true"></span></span>
        <!--v-if-->
      </label>"
    `);
  });

  it('modelValue', async () => {
    const wrapper = mount(Switch, {
      props: {
        'modelValue': false,
        'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e })
      },
      attachTo: document.body,
    });

    const input = wrapper.find('input');
    expect(input.element.checked).toBe(false);
    expect(wrapper.props('modelValue')).toBe(false);

    await input.trigger('click');
    expect(input.element.checked).toBe(true);
    expect(wrapper.props('modelValue')).toBe(true);
  });

  it('modelValue with value', async () => {
    const wrapper = mount(Switch, {
      props: {
        'modelValue': [],
        'value': 'test',
        'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e })
      },
      attachTo: document.body,
    });

    const input = wrapper.find('input');
    expect(input.element.checked).toBe(false);
    expect(wrapper.props('modelValue')).toStrictEqual([]);

    await input.trigger('click');
    expect(input.element.checked).toBe(true);
    expect(wrapper.props('modelValue')).toStrictEqual(['test']);
  });

  it('color', async () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: true,
        color: 'primary',
      },
    });
    await nextTick();

    const cssVariables = JSON.stringify(Object.getOwnPropertySymbols(wrapper.element.style).map((k) => {
      return wrapper.element.style[k];
    }));
    expect(cssVariables).toMatchInlineSnapshot(`"["--411e8d7f-switchColor: var(--acv-color-primary);"]"`);
    expect(cssVariables.includes('var(--acv-color-primary)')).toBe(true);
  });

  it('label', async () => {
    const wrapper = mount(Switch, {
      props: {
        label: 'test',
      },
    });

    const label = wrapper.find('.acv-switch__label');
    expect(label.text()).toBe('test');
  });

  it('disabled', async () => {
    const wrapper = mount(Switch, {
      props: {
        disabled: true,
      },
    });

    const input = wrapper.find('input');
    expect(input.element.disabled).toBe(true);
  });
});

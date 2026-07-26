import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { defineComponent, h } from 'vue';
import { AcvButtonGroup } from '../button-group/public.ts';
import { BUTTON_VARIANT } from './button.ts';
import Button from './button.vue';

const UserIcon = defineComponent({
  render() {
    return h('svg');
  },
});

const TEXT = 'Text';

describe('button', () => {
  it('render', () => {
    const wrapper = mount(Button, {
      slots: {
        default: TEXT,
      },
    });

    expect(wrapper.find('.acv-button').classes()).toEqual([
      'acv-button',
      'acv-button_variant_primary',
      'acv-button_size_medium',
    ]);
    expect(wrapper.find('.acv-button').text()).toEqual(TEXT);
  });

  it('pass accessibility tests', async () => {
    const wrapper = mount(Button, {
      slots: {
        default: TEXT,
      },
    });

    expect(await axe(wrapper.element)).toHaveNoViolations();
  });

  it('size', () => {
    const wrapper = mount(Button, {
      props: {
        size: 'large',
      },
    });

    expect(wrapper.find('.acv-button').classes()).toContain('acv-button_size_large');
  });

  it('variants', () => {
    Object.keys(BUTTON_VARIANT).forEach((variant) => {
      const wrapper = mount(Button, {
        props: {
          variant,
        } as any,
      });

      if (variant === 'default')
        expect(wrapper.find('.acv-button').classes()).not.toContain(`acv-button_variant_${variant}`);
      else
        expect(wrapper.find('.acv-button').classes()).toContain(`acv-button_variant_${variant}`);
    });
  });

  it('ghost', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'ghost',
      },
    });

    expect(wrapper.find('.acv-button').classes()).toContain('acv-button_variant_ghost');
  });

  it('disabled', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true,
      },
    });

    expect(wrapper.find('.acv-button').classes()).toContain('acv-button_disabled');
  });

  it('loading', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
      },
    });

    expect(wrapper.find('.acv-button').classes()).toContain('acv-button_loading');
    expect(wrapper.find('.loader').exists()).toBe(true);
  });

  it.skip('click', async () => {
    const handleClick = vi.fn();
    const wrapper = mount(Button, {
      props: { onClick: handleClick },
    });

    wrapper.element.dispatchEvent(new MouseEvent('click'));
    expect(handleClick).toBeCalledTimes(1);

    await wrapper.setProps({ disabled: true });
    wrapper.element.dispatchEvent(new MouseEvent('click'));
    expect(handleClick).toBeCalledTimes(1);

    await wrapper.setProps({ disabled: false, loading: true });
    wrapper.element.dispatchEvent(new MouseEvent('click'));
    expect(handleClick).toBeCalledTimes(1);
  });

  /* TODO: Props is legacy, change to slots instead */
  it.skip('icon component', async () => {
    const wrapper = mount(Button, {
      props: {
        icon: UserIcon,
      },
      slots: {
        default: TEXT,
      },
    });

    expect(wrapper.findComponent(UserIcon).exists()).toBe(true);
    expect(wrapper.element).toMatchInlineSnapshot(`
      <button
        class="acv-button solid medium primary"
        data-v-7a9642c5=""
        variant="button"
      >

        <svg
          data-v-7a9642c5=""
        />

        <!--v-if-->
        <span
          class="content"
          data-v-7a9642c5=""
        >

          Text

        </span>
        <!--v-if-->
      </button>
    `);
  });

  /* TODO: Temporarily commented out, due to issues with updating snapshots */
  it.skip('icon name', async () => {
    const wrapper = mount(Button, {
      props: {
        icon: 'workstation-16',
      },
      slots: {
        default: TEXT,
      },
    });

    expect(wrapper.element).toMatchInlineSnapshot(`
      <button
        class="acv-button acv-button_variant_primary acv-button_size_medium"
        data-v-7a9642c5=""
        icon="workstation-16"
        type="button"
      >
        <!--v-if-->
        <!--v-if-->
        <span
          class="content"
          data-v-7a9642c5=""
        >
          <!-- @slot Default slot content. Usually for text -->

          Text

        </span>
        <!--v-if-->
      </button>
    `);
  });

  /* TODO: Props is legacy, change to slots instead */
  it.skip('icon only', async () => {
    const wrapper = mount(Button, {
      props: {
        icon: UserIcon,
      },
    });

    expect(wrapper.findComponent(UserIcon).exists()).toBe(true);
  });

  it.skip('loading icon', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
        loadingIcon: UserIcon,
      },
    });

    expect(wrapper.findComponent(UserIcon).exists()).toBe(true);
  });

  it.skip('loading slot', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
      },
      slots: {
        loading: h('span', { class: 'loading' }, TEXT),
      },
    });

    expect(wrapper.find('.loading').exists()).toBe(true);
    expect(wrapper.find('.loading').text()).toEqual(TEXT);
  });

  it('button type', () => {
    const wrapper = mount(Button, {
      props: {
        type: 'submit',
      },
    });

    expect(wrapper.find('.acv-button').attributes('type')).toEqual('submit');
  });

  it('tag', () => {
    const wrapper = mount(Button, {
      props: {
        is: 'a',
      },
    });

    expect(wrapper.find('a.acv-button').exists()).toBe(true);
  });

  it.skip('color', () => {
    const wrapper = mount(Button, {
      props: {
        color: 'orange',
      },
    });

    expect(wrapper.find('.acv-button').attributes('style')).toContain(
      `--acv-button-background-color: orange;`,
    );
    expect(wrapper.find('.acv-button').attributes('style')).toContain(
      `--acv-button-border-color: orange;`,
    );
  });

  it('group', () => {
    const wrapper = mount(AcvButtonGroup, {
      slots: {
        default: [
          h(Button),
          h(Button),
        ],
      }
    });

    expect(wrapper.findAll('.acv-button').length).toBe(2);
  });

  it.skip('group variant', () => {
    const wrapper = mount(AcvButtonGroup, {
      props: {
        color: 'primary',
      },
      slots: {
        default: [
          h(Button),
          h(Button),
          h(Button, { color: 'success' }),
        ],
      }
    });

    expect(wrapper.findAll('.acv-button.primary').length).toBe(2);
    expect(wrapper.findAll('.acv-button.success').length).toBe(1);
  });

  it.skip('group size', () => {
    const wrapper = mount(AcvButtonGroup, {
      props: {
        size: 'large',
      },
      slots: {
        default: [
          h(Button),
          h(Button),
          h(Button, { size: 'small' }),
        ],
      }
    });

    expect(wrapper.findAll('.large').length).toBe(3);
    expect(wrapper.find('.small').exists()).toBe(false);
  });
});

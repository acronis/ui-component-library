import { useButton } from '@/components/button/useButton.ts';
import { BUTTON_COLOR, BUTTON_GROUP_KEY, BUTTON_VARIANT } from '@/components/index.ts';
import { colord } from '@/utils/colord.ts';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, provide, toRef } from 'vue';

const TestComponent = defineComponent({
  props: {
    block: Boolean,
    buttonType: String,
    color: String,
    disabled: Boolean,
    injection: Object,
    is: String,
    loading: Boolean,
    pill: Boolean,
    selected: Boolean,
    size: String,
    squared: Boolean,
    type: String,
  },
  setup(props) {
    const injection = toRef(props, 'injection');

    provide(BUTTON_GROUP_KEY, injection as any);
    return useButton(props);
  },
  render() {}
});

describe('useButton composable', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(TestComponent);
  });

  it('returns correct variant based on props', async () => {
    await wrapper.setProps({
      type: 'primary'
    });

    expect(wrapper.vm.variant).toBe(BUTTON_VARIANT.solid);
  });

  it('returns correct color based on props', async () => {
    await wrapper.setProps({
      type: 'danger'
    });

    expect(wrapper.vm.color).toBe(BUTTON_COLOR.danger);
  });

  // TODO fix this test
  it.skip('returns correct size based on button group state', async () => {
    await wrapper.setProps({
      injection: { size: 'large' }
    });

    expect(wrapper.vm.size).toBe('large');
  });

  it('returns correct attributes for non-button elements', async () => {
    await wrapper.setProps({
      is: 'div',
      disabled: true,
      loading: true
    });
    expect(wrapper.vm.attrs.role).toBe('button');
    expect(wrapper.vm.attrs['aria-disabled']).toBe('true');
  });

  it('returns correct attributes for button elements', async () => {
    await wrapper.setProps({
      is: 'button',
      buttonType: 'submit',
      disabled: true,
      loading: true
    });

    expect(wrapper.vm.attrs.type).toBe('submit');
    expect(wrapper.vm.attrs.disabled).toBe(true);
  });

  it('returns correct classes based on props', async () => {
    await wrapper.setProps({
      block: true,
      color: 'primary',
      loading: true,
      pill: true,
      selected: true,
      size: 'large',
      squared: true,
      type: 'primary',
    });

    expect(wrapper.vm.classes).toMatchObject({
      'acv-button': true,
      'block': true,
      'disabled': true,
      'large': true,
      'loading': true,
      'pill': true,
      'primary': true,
      'selected': true,
      'solid': true,
      'squared': true,
    });
  });

  it('returns correct styles for non-theme colors', async () => {
    await wrapper.setProps({
      color: 'customColor'
    });

    const rawColor = colord('customColor');
    expect(wrapper.vm.styles).toMatchObject({
      '--acv-button-color': `hsl(${rawColor.toHslValue()})`,
      '--acv-button-text-color': `${rawColor.contrasting().toHslString()}`,
    });
  });

  it('returns empty styles for theme colors', () => {
    wrapper.setProps({
      color: 'primary'
    });

    expect(wrapper.vm.styles.value).toMatchObject({});
  });
});

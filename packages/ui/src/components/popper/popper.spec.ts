import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AcvPopper from './popper.vue';

describe('test AcvPopper component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(AcvPopper, {
      propsData: {
        trigger: 'click',
        transition: 'fade',
        offset: 0,
        delay: 0,
        hideDelay: 0,
        teleport: true
      }
    });
  });

  it('is a Vue instance', () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it('default props are passed correctly', () => {
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "arrow": false,
        "delay": 0,
        "disabled": false,
        "flip": false,
        "hideDelay": 0,
        "middleware": undefined,
        "modelValue": false,
        "offset": 0,
        "persist": false,
        "placement": undefined,
        "popperClass": undefined,
        "referenceEl": undefined,
        "strategy": undefined,
        "teleport": true,
        "transition": "fade",
        "trigger": "click",
        "width": undefined,
      }
    `);
  });

  it('emits show event when modelValue is true', async () => {
    await wrapper.setProps({ modelValue: true });

    expect(wrapper.emitted().show).toBeTruthy();
  });

  it('emits hide event when modelValue is false', async () => {
    await wrapper.setProps({ modelValue: true });

    await wrapper.setProps({ modelValue: false });

    expect(wrapper.emitted().hide).toBeTruthy();
  });

  it('pass props', async () => {
    expect(wrapper.props().modelValue).toBe(false);

    await wrapper.setProps({ modelValue: true });

    expect(wrapper.props().modelValue).toBe(true);
  });

  it('arrowStyle computed property works correctly', async () => {
    await wrapper.setProps({
      arrow: true,
      offset: 5,
    });

    expect(wrapper.vm.arrowStyle).toEqual({
      height: '5px',
      left: '',
      top: '-5px',
      width: '5px',
    });
  });

  it('renders', () => {
    const wrapper = mount(AcvPopper);

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-5f77216c="" class="anchor"></div>
      <!--v-if-->"
    `);
  });
});

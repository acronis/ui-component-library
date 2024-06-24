import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Notification from './notification.vue';
import type { AcvNotificationProps } from './notification';

describe('test Notification component', () => {
  it('default props', () => {
    const wrapper = mount(Notification);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(Notification, {
      props: {
        title: 'test',
      } as AcvNotificationProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(Notification);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});

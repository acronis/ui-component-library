import type { AcvNotificationProps } from './notification';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Notification from './notification.vue';

describe('test Notification component', () => {
  it('default props', () => {
    const wrapper = mount(Notification);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Notification, {
      props: {
        title: 'test',
      } as AcvNotificationProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Notification);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-ff2862d9="" class="acv-notification"></div>"`);
  });
});

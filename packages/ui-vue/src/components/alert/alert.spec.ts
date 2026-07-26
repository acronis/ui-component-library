import type { AcvAlertProps } from './alert.ts';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import Alert from './alert.vue';

describe('alert', () => {
  it('pass accessibility tests', async () => {
    const wrapper = mount(Alert);

    expect(await axe(wrapper.element)).toHaveNoViolations();
  });

  it('default props', () => {
    const wrapper = mount(Alert);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "color": "info",
        "description": undefined,
        "showBorder": false,
        "showClose": false,
        "showIcon": false,
        "subtitle": undefined,
        "title": undefined,
      }
    `);
  });

  it('types', () => {
    ;(['info', 'success', 'warning', 'critical', 'error', 'unknown'] as const).forEach(async (type) => {
      const wrapper = mount(Alert, {
        props: {
          icon: true,
          color: type,
        } as AcvAlertProps,
      });

      expect(wrapper.find('.acv-alert').classes()).toContain(`${type}`);
      // expect(wrapper.findComponent(AcvAlertIconTypes[type]).exists()).toBe(true)
    });
  });

  it('pass props', () => {
    const wrapper = mount(Alert, {
      props: {
        showClose: true,
        variant: 'success',
      } as AcvAlertProps,
    });
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "color": "info",
        "description": undefined,
        "showBorder": false,
        "showClose": true,
        "showIcon": false,
        "subtitle": undefined,
        "title": undefined,
      }
    `);
  });

  it('renders by default', () => {
    const wrapper = mount(Alert);

    expect(wrapper.element).toMatchInlineSnapshot(`
      <div
        class="acv-alert info"
        data-v-437210c2=""
        role="alert"
      >
        <div
          class="content"
          data-v-437210c2=""
        >
          <!--v-if-->
          <!--v-if-->
          <!--v-if-->
          <!--v-if-->
          <!--v-if-->
        </div>
        <!--v-if-->
      </div>
    `);
  });

  it('renders title slot', () => {
    const wrapper = mount(Alert, {
      slots: {
        title: 'Title',
      },
    });

    expect(wrapper.get('.title').text()).toBe('Title');
  });

  it('renders description slot', () => {
    const wrapper = mount(Alert, {
      slots: {
        description: 'Description',
      },
    });

    expect(wrapper.text()).toBe('Description');
  });

  /* TODO: Temporarily commented out, due to issues with updating snapshots */
  it.skip('renders close button', () => {
    const wrapper = mount(Alert, {
      props: {
        showClose: true,
      } as AcvAlertProps,
    });

    expect(wrapper.find('.close').element).toMatchSnapshot();
  });
});

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Alert from './alert.vue'
import type { AlertProps } from './alert'
import { AlertIconTypes } from './alert'

describe('alert', () => {
  it('default props', () => {
    const wrapper = mount(Alert)
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "showBorder": false,
        "showClose": false,
        "showIcon": false,
        "subtitle": undefined,
        "title": undefined,
        "variant": "info",
      }
    `)
  })

  it('types', () => {
    ;(['info', 'success', 'warning', 'critical', 'error', 'unknown'] as const).forEach((type) => {
      const wrapper = mount(() => <Alert icon type={type}></Alert>)

      expect(wrapper.find('.acv-alert').classes()).toContain(`${type}`)
      expect(wrapper.findComponent(AlertIconTypes[type]).exists()).toBe(true)
    })
  })

  it('pass props', () => {
    const wrapper = mount(Alert, {
      props: {
        showClose: true,
        variant: 'success',
      } as AlertProps,
    })
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "showBorder": false,
        "showClose": true,
        "showIcon": false,
        "subtitle": undefined,
        "title": undefined,
        "variant": "success",
      }
    `)
  })

  it('renders by default', () => {
    const wrapper = mount(Alert)

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
    `)
  })

  it('renders title slot', () => {
    const wrapper = mount(Alert, {
      slots: {
        title: 'Title',
      },
    })

    expect(wrapper.get('.title').text()).toBe('Title')
  })

  it('renders description slot', () => {
    const wrapper = mount(Alert, {
      slots: {
        description: 'Description',
      },
    })

    expect(wrapper.text()).toBe('Description')
  })

  it('renders close button', () => {
    const wrapper = mount(Alert, {
      props: {
        showClose: true,
      } as AlertProps,
    })

    expect(wrapper.text()).toBe('X')
  })
})

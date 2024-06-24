import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import type { DividerProps } from '..'
import { Divider } from '..'

const TEXT = 'Text'

describe('test Divider component', () => {
  it('default props', () => {
    const wrapper = mount(Divider)
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "color": undefined,
        "margin": undefined,
        "textPosition": undefined,
        "vertical": false,
      }
    `)
  })

  it('pass props', () => {
    const wrapper = mount(Divider, {
      props: {
        color: 'brand',
      } as DividerProps,
    })

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "color": "brand",
        "margin": undefined,
        "textPosition": undefined,
        "vertical": false,
      }
    `)
  })

  it('render', () => {
    const wrapper = mount(Divider)

    expect(wrapper.classes()).toContain('acv-divider--horizontal')
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-db039be1="" class="acv-divider acv-divider--horizontal" role="separator">
        <!--v-if-->
      </div>"
    `)
  })

  it('vertical', () => {
    const wrapper = mount(() => <Divider vertical></Divider>)

    expect(wrapper.find('.acv-divider').classes()).toContain('acv-divider--vertical')
  })

  it('with text', async () => {
    const wrapper = mount(Divider, {
      slots: {
        default: () => TEXT,
      },
    })

    expect(wrapper.classes()).toContain('acv-divider--with-text')

    await wrapper.setProps({ vertical: true })
    expect(wrapper.classes()).not.toContain('acv-divider--with-text')
  })

  it('text position', () => {
    (['center', 'left', 'right'] as const).forEach((position) => {
      const wrapper = mount(() => <Divider text-position={position}>{TEXT}</Divider>)

      if (position === 'center') {
        expect(wrapper.find('.acv-divider').classes()).not.toContain(
          'acv-divider--with-text-center',
        )
      }
      else {
        expect(wrapper.find('.acv-divider').classes()).toContain(
          `acv-divider--with-text-${position}`,
        )
      }
    })
  })

  it('margin', async () => {
    const wrapper = mount(Divider, {
      props: { margin: 10 },
    })

    expect(wrapper.attributes('style')).toContain('margin-top: 10px;')
    expect(wrapper.attributes('style')).toContain('margin-bottom: 10px;')

    await wrapper.setProps({ vertical: true })
    expect(wrapper.attributes('style')).not.toContain('margin-top')
    expect(wrapper.attributes('style')).not.toContain('margin-bottom')
    expect(wrapper.attributes('style')).toContain('margin-right: 10px;')
    expect(wrapper.attributes('style')).toContain('margin-left: 10px;')
  })
})

import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { defineComponent } from 'vue'
import { AcvButtonGroup } from '../button-group/public.ts'
import { BUTTON_VARIANT } from './button.ts'
import Button from './button.vue'

const UserIcon = defineComponent({
  render() {
    return <svg></svg>
  },
})

const TEXT = 'Text'

describe('button', () => {
  it('render', () => {
    const wrapper = mount(() => <Button>{TEXT}</Button>)

    expect(wrapper.find('.acv-button').classes()).toEqual([
      'acv-button',
      'acv-button_variant_primary',
      'acv-button_size_medium',
    ])
    expect(wrapper.find('.acv-button').text()).toEqual(TEXT)
  })

  it('pass accessibility tests', async () => {
    const wrapper = mount(() => <Button>{TEXT}</Button>)

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('size', () => {
    const wrapper = mount(() => <Button size="large"></Button>)

    expect(wrapper.find('.acv-button').classes()).toContain('acv-button_size_large')
  })

  it('variants', () => {
    Object.keys(BUTTON_VARIANT).forEach((variant) => {
      const wrapper = mount(() => <Button variant={variant}></Button>)

      if (variant === 'default')
        expect(wrapper.find('.acv-button').classes()).not.toContain(`acv-button_variant_${variant}`)
      else
        expect(wrapper.find('.acv-button').classes()).toContain(`acv-button_variant_${variant}`)
    })
  })

  it('ghost', () => {
    const wrapper = mount(() => <Button variant="ghost"></Button>)

    expect(wrapper.find('.acv-button').classes()).toContain('acv-button_variant_ghost')
  })

  it('disabled', () => {
    const wrapper = mount(() => <Button disabled></Button>)

    expect(wrapper.find('.acv-button').classes()).toContain('acv-button_disabled')
  })

  it('loading', () => {
    const wrapper = mount(() => <Button loading></Button>)

    expect(wrapper.find('.acv-button').classes()).toContain('acv-button_loading')
    expect(wrapper.find('.loader').exists()).toBe(true)
  })

  it.skip('click', async () => {
    const handleClick = vi.fn()
    const wrapper = mount(Button, {
      props: { onClick: handleClick },
    })

    wrapper.element.dispatchEvent(new MouseEvent('click'))
    expect(handleClick).toBeCalledTimes(1)

    await wrapper.setProps({ disabled: true })
    wrapper.element.dispatchEvent(new MouseEvent('click'))
    expect(handleClick).toBeCalledTimes(1)

    await wrapper.setProps({ disabled: false, loading: true })
    wrapper.element.dispatchEvent(new MouseEvent('click'))
    expect(handleClick).toBeCalledTimes(1)
  })

  /* TODO: Props is legacy, change to slots instead */
  it.skip('icon component', async () => {
    const wrapper = mount(() => <Button icon={UserIcon}>{TEXT}</Button>)

    expect(wrapper.findComponent(UserIcon).exists()).toBe(true)
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
    `)
  })

  it('icon name', async () => {
    const wrapper = mount(() => <Button icon="workstation-16">{TEXT}</Button>)

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
    `)
  })

  /* TODO: Props is legacy, change to slots instead */
  it.skip('icon only', async () => {
    const wrapper = mount(() => <Button icon={UserIcon}></Button>)

    expect(wrapper.findComponent(UserIcon).exists()).toBe(true)
  })

  it.skip('loading icon', () => {
    const wrapper = mount(() => <Button loading loading-icon={UserIcon}></Button>)

    expect(wrapper.findComponent(UserIcon).exists()).toBe(true)
  })

  it.skip('loading slot', () => {
    const wrapper = mount(() => (
      <Button loading>
        {{
          loading: () => <span class="loading">{TEXT}</span>,
        }}
      </Button>
    ))

    expect(wrapper.find('.loading').exists()).toBe(true)
    expect(wrapper.find('.loading').text()).toEqual(TEXT)
  })

  it('button type', () => {
    const wrapper = mount(() => <Button type="submit"></Button>)

    expect(wrapper.find('.acv-button').attributes('type')).toEqual('submit')
  })

  it('tag', () => {
    const wrapper = mount(() => <Button is="a"></Button>)

    expect(wrapper.find('a.acv-button').exists()).toBe(true)
  })

  it.skip('color', () => {
    const wrapper = mount(() => <Button color="orange"></Button>)

    expect(wrapper.find('.acv-button').attributes('style')).toContain(
      `--acv-button-background-color: orange;`,
    )
    expect(wrapper.find('.acv-button').attributes('style')).toContain(
      `--acv-button-border-color: orange;`,
    )
  })

  it('group', () => {
    const wrapper = mount(() => (
      <AcvButtonGroup>
        <Button></Button>
        <Button></Button>
      </AcvButtonGroup>
    ))

    expect(wrapper.findAll('.acv-button').length).toBe(2)
  })

  it.skip('group variant', () => {
    const wrapper = mount(() => (
      <AcvButtonGroup color="primary">
        <Button></Button>
        <Button></Button>
        <Button color="success"></Button>
      </AcvButtonGroup>
    ))

    expect(wrapper.findAll('.acv-button.primary').length).toBe(2)
    expect(wrapper.findAll('.acv-button.success').length).toBe(1)
  })

  it.skip('group size', () => {
    const wrapper = mount(() => (
      <AcvButtonGroup size="large">
        <Button></Button>
        <Button></Button>
        <Button size="small"></Button>
      </AcvButtonGroup>
    ))

    expect(wrapper.findAll('.large').length).toBe(3)
    expect(wrapper.find('.small').exists()).toBe(false)
  })
})

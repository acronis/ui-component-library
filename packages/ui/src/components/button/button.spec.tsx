import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { AcvButtonGroup } from '../button-group/public.ts'
import Button from './button.vue'
import { BUTTON_VARIANT } from './button.ts'

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
      'solid',
      'medium',
      'primary',
    ])
    expect(wrapper.find('.acv-button').text()).toEqual(TEXT)
  })

  it('pass accessibility tests', async () => {
    const wrapper = mount(() => <Button>{TEXT}</Button>)

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('size', () => {
    const wrapper = mount(() => <Button size="large"></Button>)

    expect(wrapper.find('.acv-button').classes()).toContain('large')
  })

  it('types', () => {
    Object.keys(BUTTON_VARIANT).forEach((type) => {
      const wrapper = mount(() => <Button variant={type}></Button>)

      if (type === 'default')
        expect(wrapper.find('.acv-button').classes()).not.toContain(`${type}`)
      else
        expect(wrapper.find('.acv-button').classes()).toContain(`${type}`)
    })
  })

  it('ghost', () => {
    const wrapper = mount(() => <Button variant="ghost"></Button>)

    expect(wrapper.find('.acv-button').classes()).toContain('ghost')
  })

  it('disabled', () => {
    const wrapper = mount(() => <Button disabled></Button>)

    expect(wrapper.find('.acv-button').classes()).toContain('disabled')
  })

  it('loading', () => {
    const wrapper = mount(() => <Button loading></Button>)

    expect(wrapper.find('.acv-button').classes()).toContain('loading')
    expect(wrapper.find('.acv-button__loader').exists()).toBe(true)
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

  it('icon component', async () => {
    const wrapper = mount(() => <Button icon={UserIcon}>{TEXT}</Button>)

    expect(wrapper.findComponent(UserIcon).exists()).toBe(true)
    expect(wrapper.element).toMatchInlineSnapshot(`
      <button
        class="acv-button solid medium primary"
        data-v-7a9642c5=""
        type="button"
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
        class="acv-button solid medium primary"
        data-v-7a9642c5=""
        type="button"
      >
        
        <workstation-16
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

  it('icon only', async () => {
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
    const wrapper = mount(() => <Button button-type="submit"></Button>)

    expect(wrapper.find('.acv-button').attributes('type')).toEqual('submit')
  })

  it('tag', () => {
    const wrapper = mount(() => <Button tag="a"></Button>)

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

  it.skip('group type', () => {
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

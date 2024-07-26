import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AcvFooter from '@/components/footer/footer.vue'
import AcvDivider from '@/components/divider/divider.vue'

describe('acvFooter', () => {
  it('should render slots', () => {
    const wrapper = mount(AcvFooter, {
      slots: {
        default: 'Test default slot content',
        side: 'Test side slot content',
      },
    })

    expect(wrapper.html()).toContain('Test default slot content')
    expect(wrapper.html()).toContain('Test side slot content')
  })
  it('should render AcvDivider', () => {
    const wrapper = mount(AcvFooter)
    const divider = wrapper.findComponent(AcvDivider)

    expect(divider.exists()).toBe(true)
  })
})

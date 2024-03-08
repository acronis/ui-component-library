import { expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import ElButton from 'packages/button'

test('render', () => {
  const wrapper = mount(ElButton, {
    props: {
      type: 'ghost',
      size: 'large'
    }
  })

  expect(wrapper.find('.el-button--large')).toBeDefined()
  expect(wrapper.find('.el-button--ghost')).toBeDefined()
})

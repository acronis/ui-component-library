import { expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import ElAlert from 'packages/alert'

test('render', () => {
  const wrapper = mount(ElAlert, {
    props: {
      title: 'test',
      showIcon: true
    }
  })

  expect(wrapper.find('.el-alert__title').text()).equal('test')
  expect(wrapper.find('.el-alert--info')).toBeDefined()
})

import { defineComponent } from 'vue'

import Text from './text.tsx'
import { pProps } from './props.ts'
import { useProps } from '@/utils/props.ts'

export default defineComponent({
  name: 'P',
  props: pProps,
  emits: [],
  setup(_props, { slots }) {
    const props = useProps('p', _props, {
      type: 'default',
      delete: false,
      strong: false,
      italic: false,
      underline: false,
      mark: false,
      disabled: false,
      keyboard: false,
      thin: false,
      reversed: false,
    })

    return () => (
      <Text {...props} tag="p">
        {slots.default?.()}
      </Text>
    )
  },
})

import { computed, defineComponent } from 'vue'

import { useProps } from '../../utils/props.ts'
import { useNameHelper } from '../../utils/namespace.ts'
import { olProps } from './props.ts'

export default defineComponent({
  name: 'OL',
  props: olProps,
  emits: [],
  setup(_props, { slots }) {
    const props = useProps('ol', _props, {
      type: '1',
    })

    const nh = useNameHelper('ol')
    const className = computed(() => {
      return {
        [nh]: true,
        [`${nh}--inherit`]: props.inherit,
      }
    })

    return () => (
      <ol class={className.value} type={props.type}>
        {slots.default?.()}
      </ol>
    )
  },
})

import { computed, defineComponent } from 'vue'
import { useProps } from '../../utils/props.ts'
import { useNameHelper } from '../../utils/namespace.ts'
import { ulProps } from './props'

export default defineComponent({
  name: 'UL',
  props: ulProps,
  emits: [],
  setup(_props, { slots }) {
    const props = useProps('ul', _props, {
      listStyle: 'circle',
    })

    const nh = useNameHelper('ul')

    const className = computed(() => {
      return {
        [nh]: true,
        [`${nh}--inherit`]: props.inherit,
        [`${nh}--no-marker`]: props.listStyle === 'none',
      }
    })

    return () => (
      <ul
        class={className.value}
        style={{ listStyleType: props.listStyle }}
      >
        {slots.default?.()}
      </ul>
    )
  },
})
